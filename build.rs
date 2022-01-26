// Copyright 2019-2022 Manta Network.
// This file is part of manta-sdk.
//
// manta-sdk is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// manta-sdk is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with manta-sdk.  If not, see <http://www.gnu.org/licenses/>.

//! Manta SDK Build Script

// FIXME: Build should fail if the checksums don't match the checkfile.

use anyhow::{anyhow, bail, ensure, Result};
use convert_case::{Case, Casing};
use core::fmt::{self, Write as _};
use hex::FromHex;
use indoc::indoc;
use jsonschema::JSONSchema;
use serde_json::Value as JsonValue;
use std::{
    collections::{HashMap, HashSet},
    env,
    fs::{self, File, OpenOptions},
    io::{BufRead, BufReader},
    path::{Path, PathBuf},
};

/// Returns the parent of `path` which should exist relative to `OUT_DIR`.
#[inline]
fn parent(path: &Path) -> Result<&Path> {
    path.parent().ok_or(anyhow!(
        "The parent should be in the subtree of the `OUT_DIR` directory."
    ))
}

/// Checksum
type Checksum = [u8; 32];

/// Checksum Map
type ChecksumMap = HashMap<PathBuf, Checksum>;

/// Parses the checkfile at `path` producing a [`ChecksumMap`] for all the files in the data
/// directory.
#[inline]
fn parse_checkfile<P>(path: P) -> Result<ChecksumMap>
where
    P: AsRef<Path>,
{
    let file = OpenOptions::new().read(true).open(path)?;
    let mut checksums = ChecksumMap::new();
    for line in BufReader::new(file).lines() {
        let line = line?;
        let mut iter = line.split("  ");
        match (iter.next(), iter.next(), iter.next()) {
            (Some(checksum), Some(path), None) => {
                checksums.insert(path.into(), Checksum::from_hex(checksum)?);
            }
            _ => bail!("Invalid checkfile line: {:?}", line),
        }
    }
    Ok(checksums)
}

/// Gets the checksum from the `checksums` map for `path` returning an error if it was not found.
#[inline]
fn get_checksum<P>(checksums: &ChecksumMap, path: P) -> Result<Checksum>
where
    P: AsRef<Path>,
{
    let path = path.as_ref();
    checksums
        .get(path)
        .ok_or_else(|| anyhow!("Unable to get checksum for path: {:?}", path))
        .map(move |c| *c)
}

/// Writes the `checksum` to `path` returning an error if the write failed.
#[inline]
fn write_checksum<P>(path: P, checksum: Checksum) -> Result<()>
where
    P: AsRef<Path>,
{
    Ok(fs::write(
        path.as_ref().with_extension("checksum"),
        checksum,
    )?)
}

/// JSON Schema Matcher
#[derive(Clone, Debug, Default)]
struct JsonSchemaMatcher {
    /// Base Data File Path and Checksum
    base: Option<(PathBuf, Checksum)>,

    /// Schema Path and Checksum
    schema: Option<(PathBuf, Checksum)>,
}

/// Compiles all JSON files in `source_dir` checking against the schemas present in the same
/// directory.
#[inline]
fn compile_json(source_dir: &Path, out_dir: &Path, checksums: &ChecksumMap) -> Result<()> {
    let mut kinds = HashMap::<String, JsonSchemaMatcher>::new();
    for file in fs::read_dir(source_dir)? {
        let file = file?;
        let path = file.path();
        if path.is_dir() {
            bail!("Only flat JSON data hierarchies are supported.");
        } else {
            let file_name = path.file_name().unwrap();
            let name_componenets = file_name.to_str().expect("").split('.').collect::<Vec<_>>();
            ensure!(
                name_componenets.len() <= 3,
                "JSON files should have at most three name components, either XXX.json or XXX.schema.json."
            );
            match name_componenets[1] {
                "json" => {
                    let kind_entry = kinds.entry(name_componenets[0].to_string()).or_default();
                    if kind_entry.base.is_some() {
                        bail!("Only one matching entry allowed for JSON data files.");
                    }
                    let checksum = get_checksum(checksums, &path)?;
                    kind_entry.base = Some((path.to_owned(), checksum));
                }
                "schema" => {
                    let kind_entry = kinds.entry(name_componenets[0].to_string()).or_default();
                    if kind_entry.schema.is_some() {
                        bail!("Only one matching entry allowed for schemas.");
                    }
                    let checksum = get_checksum(checksums, &path)?;
                    kind_entry.schema = Some((path.to_owned(), checksum));
                }
                _ => bail!("JSON file names must be of the form XXX.json or XXX.schema.json."),
            }
        }
    }
    for (_, matcher) in kinds {
        match (matcher.base, matcher.schema) {
            (Some((base_path, base_checksum)), Some((schema_path, schema_checksum))) => {
                match serde_json::from_reader(File::open(&base_path)?)? {
                    JsonValue::Object(object) => {
                        let raw_schema = serde_json::from_reader(File::open(&schema_path)?)?;
                        let schema = JSONSchema::options().compile(&raw_schema).map_err(|err| {
                            anyhow!("Unable to compile JSON schema: {:#?}", err.kind)
                        })?;
                        for value in object.values() {
                            if let jsonschema::output::BasicOutput::Invalid(errors) =
                                schema.apply(value).basic()
                            {
                                bail!(
                                    "JSON value should implement the schema properly: {:#?}",
                                    errors
                                );
                            }
                        }
                        let mut code = String::new();
                        let (type_name, optional_field_set) =
                            generate_struct_from_json_schema(&raw_schema, &mut code)?;
                        writeln!(code)?;
                        let mut map_data = phf_codegen::Map::<&'static str>::new();
                        for (key, value) in object.iter() {
                            map_data.entry(
                                key,
                                &generate_struct_value_from_json(2, type_name, value, |name| {
                                    optional_field_set.contains(name)
                                })?,
                            );
                        }
                        // TODO: Customize this doc-string
                        let docs = "/// Map";
                        // TODO: Customize this name
                        let name = "MAP";
                        write!(
                            code,
                            "{DOCS}\npub const {NAME}: phf::Map<&'static str, {VALUE}> = \n{DATA};\n",
                            DOCS = docs,
                            NAME = name,
                            VALUE = type_name,
                            DATA = map_data.build()
                        )?;

                        let target_base = out_dir.join(base_path);
                        let target_schema = out_dir.join(schema_path);

                        let target = target_base.with_extension("rs");
                        fs::create_dir_all(parent(&target)?)?;
                        fs::write(target, code)?;

                        write_checksum(target_base, base_checksum)?;
                        write_checksum(target_schema, schema_checksum)?;
                    }
                    _ => bail!("Only JSON files as objects are supported."),
                }
            }
            (Some(_), _) => bail!("JSON data files without matching schemas are not allowed."),
            (_, Some(_)) => bail!("JSON schemas without matching data files are not allowed."),
            _ => unreachable!("Matcher map does not include empty matches."),
        }
    }
    Ok(())
}

/// Converts a JSON primitive type into a compile-time Rust type.
#[inline]
fn from_json_primitive_type(string: &str) -> Result<&'static str> {
    Ok(match string {
        "string" => "&'static str",
        "integer" => "u64",
        _ => bail!("Other JSON types not allowed."),
    })
}

/// Generates a struct definition from a JSON schema.
#[inline]
fn generate_struct_from_json_schema<W>(
    schema: &JsonValue,
    mut writer: W,
) -> Result<(&str, HashSet<String>)>
where
    W: fmt::Write,
{
    let struct_docs = schema["description"].as_str().unwrap();
    let struct_name = schema["title"].as_str().unwrap();
    let mut struct_fields = String::new();
    let mut optional_field_set = HashSet::new();
    for (field_name, type_data) in schema["properties"].as_object().unwrap() {
        let type_data = type_data.as_object().unwrap();
        let field_docs = type_data["description"].as_str().unwrap();
        let (is_optional, field_type) = match &type_data["type"] {
            JsonValue::Array(field_types) => {
                ensure!(field_types.len() <= 2, "");
                (
                    true,
                    format!(
                        "Option<{}>",
                        from_json_primitive_type(
                            field_types[1 - field_types
                                .iter()
                                .position(|t| t == "null")
                                .ok_or(anyhow!(""))?]
                            .as_str()
                            .unwrap()
                        )?
                    ),
                )
            }
            JsonValue::String(field_type) => {
                (false, from_json_primitive_type(field_type)?.to_owned())
            }
            _ => unreachable!(),
        };
        let field_name = field_name.to_case(Case::Snake);
        write!(
            struct_fields,
            "\n    /// {}\n    {}pub {}: {},\n",
            field_docs,
            if is_optional {
                "#[serde(default)]\n    "
            } else {
                ""
            },
            field_name,
            field_type
        )?;
        if is_optional {
            optional_field_set.insert(field_name);
        }
    }
    write!(
        writer,
        indoc! { r#"
            /// {DOCS}
            #[derive(Clone, Debug, Default, Deserialize, Eq, Hash, PartialEq, Serialize)]
            #[serde(deny_unknown_fields)]
            pub struct {NAME} {{{FIELDS}}}
        "# },
        DOCS = struct_docs,
        NAME = struct_name,
        FIELDS = struct_fields,
    )?;
    Ok((struct_name, optional_field_set))
}

/// Generates a Rust `struct` value from a JSON value.
#[inline]
fn generate_struct_value_from_json<F>(
    indentation: usize,
    type_name: &str,
    struct_value: &JsonValue,
    mut is_optional_field: F,
) -> Result<String>
where
    F: FnMut(&str) -> bool,
{
    let tab = "    ".repeat(indentation);
    let mut output = String::new();
    write!(output, "{} {{", type_name)?;
    for (field, value) in struct_value.as_object().unwrap() {
        let value = match value {
            JsonValue::Null => None,
            JsonValue::String(string) => Some(format!("{:?}", string)),
            JsonValue::Number(number) => match number.as_u64() {
                Some(integer) => Some(format!("{}", integer)),
                _ => bail!("Other JSON types not allowed."),
            },
            _ => bail!("Other JSON types not allowed."),
        };
        let field = field.to_case(Case::Snake);
        match (is_optional_field(&field), value) {
            (true, Some(value)) => write!(output, "\n{}    {}: Some({}),", tab, field, value)?,
            (true, None) => write!(output, "\n{}    {}: None,", tab, field)?,
            (false, Some(value)) => write!(output, "\n{}    {}: {},", tab, field, value)?,
            (false, None) => bail!("Non-optional field cannot contain `None`."),
        }
    }
    write!(output, "\n{}}}", tab)?;
    Ok(output)
}

/// Compiles raw data files by copying them to the `out_dir` directory to be interpreted as blobs.
#[inline]
fn compile_dat(source: &Path, out_dir: &Path, checksums: &ChecksumMap) -> Result<()> {
    let checksum = get_checksum(checksums, source)?;
    let target = out_dir.join(source);
    fs::create_dir_all(parent(&target)?)?;
    fs::copy(source, &target)?;
    write_checksum(target, checksum)?;
    Ok(())
}

/// Loads all the files from `data` into the `OUT_DIR` directory for inclusion into the library.
#[inline]
fn main() -> Result<()> {
    println!("cargo:rerun-if-changed=data");
    let out_dir = PathBuf::from(env::var_os("OUT_DIR").unwrap());
    let checksums = parse_checkfile("data.checkfile")?;
    let mut json_directories = HashSet::new();
    for file in walkdir::WalkDir::new("data") {
        let file = file?;
        let path = file.path();
        if !path.is_dir() {
            match path.extension() {
                Some(extension) => match extension.to_str() {
                    Some("json") => {
                        let parent = parent(path)?;
                        if !json_directories.contains(parent) {
                            compile_json(parent, &out_dir, &checksums)?;
                            json_directories.insert(parent.to_owned());
                        }
                    }
                    Some("dat") => compile_dat(path, &out_dir, &checksums)?,
                    _ => bail!("Unsupported data file extension."),
                },
                _ => bail!("All data files must have an extension."),
            }
        }
    }
    Ok(())
}
// Copyright 2019-2021 Manta Network.
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

use std::{env, fs, io, path::PathBuf};

/// Loads all the files from `data` into the `OUT_DIR` directory for inclusion into the library.
#[inline]
fn main() -> io::Result<()> {
    let out_dir = PathBuf::from(env::var_os("OUT_DIR").unwrap());
    for file in walkdir::WalkDir::new("data") {
        let file = file?;
        let path = file.path();
        if !path.is_dir() {
            let target = out_dir.join(path);
            fs::create_dir_all(target.parent().unwrap())?;
            fs::copy(path, target)?;
        }
    }
    Ok(())
}

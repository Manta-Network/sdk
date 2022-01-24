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

//! Manta SDK

// TODO: Check checksums when decoding or maybe also when downloading.
// TODO: Use more code-generation to reduce duplication here.

#![cfg_attr(not(any(feature = "std", test)), no_std)]
#![cfg_attr(doc_cfg, feature(doc_cfg))]
#![forbid(rustdoc::broken_intra_doc_links)]
#![forbid(missing_docs)]

#[cfg(feature = "alloc")]
extern crate alloc;

#[cfg(feature = "std")]
extern crate std;

use serde::{Deserialize, Serialize};

#[cfg(feature = "download")]
use {anyhow::Result, std::path::Path};

/// GitHub Data File Downloading
#[cfg(feature = "download")]
#[cfg_attr(doc_cfg, doc(cfg(feature = "download")))]
pub mod github {
    use super::*;
    use std::fs::{File, OpenOptions};

    /// GitHub Organization
    pub const ORGANIZATION: &str = "manta-network";

    /// SDK GitHub Repository Name
    pub const REPO: &str = "sdk";

    /// Default GitHub Branch
    pub const DEFAULT_BRANCH: &str = "add-sdk-library";

    /// Returns the Git-LFS URL for GitHub content at the given `branch` and `data_path`.
    #[inline]
    pub fn lfs_url(branch: &str, data_path: &str) -> String {
        alloc::format!(
            "https://media.githubusercontent.com/media/{ORGANIZATION}/{REPO}/{branch}/{data_path}"
        )
    }

    /// Returns the raw file storage URL for GitHub content at the given `branch` and `data_path`.
    #[inline]
    pub fn raw_url(branch: &str, data_path: &str) -> String {
        alloc::format!(
            "https://raw.githubusercontent.com/{ORGANIZATION}/{REPO}/{branch}/{data_path}"
        )
    }

    /// Downloads the data from `url` to `file` returning the number of bytes read.
    #[inline]
    fn download_from(url: String, file: &mut File) -> Result<u64> {
        Ok(attohttpc::get(url).send()?.write_to(file)?)
    }

    /// Downloads data from `data_path` relative to the given `branch` to a file at `path`.
    #[inline]
    pub fn download<P>(branch: &str, data_path: &str, path: P) -> Result<()>
    where
        P: AsRef<Path>,
    {
        let mut file = OpenOptions::new().create(true).write(true).open(path)?;
        if download_from(lfs_url(branch, data_path), &mut file)? == 0 {
            download_from(raw_url(branch, data_path), &mut file)?;
        }
        Ok(())
    }
}

/// Manta Pay
///
/// See [`manta-pay`](https://github.com/manta-network/manta-rs) for the definitions.
pub mod pay {
    use super::*;

    /// Testnet Data
    pub mod testnet {
        use super::*;

        /// Asset Definitions
        pub mod asset {
            use super::*;

            include!(concat!(env!("OUT_DIR"), "/data/pay/testnet/asset/map.rs"));

            /// Asset Map JSON File Checksum
            pub const MAP_CHECKSUM: &[u8; 32] = include_bytes!(concat!(
                env!("OUT_DIR"),
                "/data/pay/testnet/asset/map.checksum",
            ));

            /// Asset Map JSON Schema File Checksum
            pub const MAP_SCHEMA_CHECKSUM: &[u8; 32] = include_bytes!(concat!(
                env!("OUT_DIR"),
                "/data/pay/testnet/asset/map.schema.checksum",
            ));
        }

        /// Parameters
        pub mod parameters {
            /// Key Agreement Scheme Parameters
            pub const KEY_AGREEMENT: &[u8] = include_bytes!(concat!(
                env!("OUT_DIR"),
                "/data/pay/testnet/parameters/key-agreement.dat",
            ));

            /// Key Agreement Scheme Parameters Checksum
            pub const KEY_AGREEMENT_CHECKSUM: &[u8; 32] = include_bytes!(concat!(
                env!("OUT_DIR"),
                "/data/pay/testnet/parameters/key-agreement.checksum",
            ));

            /// UTXO Commitment Scheme Parameters
            pub const UTXO_COMMITMENT_SCHEME: &[u8] = include_bytes!(concat!(
                env!("OUT_DIR"),
                "/data/pay/testnet/parameters/utxo-commitment-scheme.dat",
            ));

            /// UTXO Commitment Scheme Parameters Checksum
            pub const UTXO_COMMITMENT_SCHEME_CHECKSUM: &[u8] = include_bytes!(concat!(
                env!("OUT_DIR"),
                "/data/pay/testnet/parameters/utxo-commitment-scheme.checksum",
            ));

            /// Void Number Hash Function Parameters
            pub const VOID_NUMBER_HASH_FUNCTION: &[u8] = include_bytes!(concat!(
                env!("OUT_DIR"),
                "/data/pay/testnet/parameters/void-number-hash-function.dat",
            ));

            /// Void Number Hash Function Parameters Checksum
            pub const VOID_NUMBER_HASH_FUNCTION_CHECKSUM: &[u8] = include_bytes!(concat!(
                env!("OUT_DIR"),
                "/data/pay/testnet/parameters/void-number-hash-function.checksum",
            ));

            /// UTXO Set Parameters
            pub const UTXO_SET_PARAMETERS: &[u8] = include_bytes!(concat!(
                env!("OUT_DIR"),
                "/data/pay/testnet/parameters/utxo-set-parameters.dat",
            ));

            /// UTXO Set Parameters Checksum
            pub const UTXO_SET_PARAMETERS_CHECKSUM: &[u8] = include_bytes!(concat!(
                env!("OUT_DIR"),
                "/data/pay/testnet/parameters/utxo-set-parameters.checksum",
            ));
        }

        /// Zero-Knowledge Proof System Proving Data
        pub mod proving {
            #[cfg(feature = "download")]
            use super::*;

            /// Downloads the `MINT` data to `path`.
            #[cfg(feature = "download")]
            #[cfg_attr(doc_cfg, doc(cfg(feature = "download")))]
            #[inline]
            pub fn mint<P>(path: P) -> Result<()>
            where
                P: AsRef<Path>,
            {
                github::download(
                    github::DEFAULT_BRANCH,
                    "data/pay/testnet/proving/mint.dat",
                    path,
                )
            }

            /// Mint Proving Context Checksum
            pub const MINT_CHECKSUM: &[u8; 32] = include_bytes!(concat!(
                env!("OUT_DIR"),
                "/data/pay/testnet/proving/mint.checksum",
            ));

            /// Downloads the `PRIVATE_TRANSFER` data to `path`.
            #[cfg(feature = "download")]
            #[cfg_attr(doc_cfg, doc(cfg(feature = "download")))]
            #[inline]
            pub fn private_transfer<P>(path: P) -> Result<()>
            where
                P: AsRef<Path>,
            {
                github::download(
                    github::DEFAULT_BRANCH,
                    "data/pay/testnet/proving/private-transfer.dat",
                    path,
                )
            }

            /// Private Transfer Proving Context Checksum
            pub const PRIVATE_TRANSFER_CHECKSUM: &[u8; 32] = include_bytes!(concat!(
                env!("OUT_DIR"),
                "/data/pay/testnet/proving/private-transfer.checksum",
            ));

            /// Downloads the `RECLAIM` data to `path`.
            #[cfg(feature = "download")]
            #[cfg_attr(doc_cfg, doc(cfg(feature = "download")))]
            #[inline]
            pub fn reclaim<P>(path: P) -> Result<()>
            where
                P: AsRef<Path>,
            {
                github::download(
                    github::DEFAULT_BRANCH,
                    "data/pay/testnet/proving/reclaim.dat",
                    path,
                )
            }

            /// Reclaim Proving Context Checksum
            pub const RECLAIM_CHECKSUM: &[u8; 32] = include_bytes!(concat!(
                env!("OUT_DIR"),
                "/data/pay/testnet/proving/reclaim.checksum",
            ));
        }

        /// Zero-Knowledge Proof System Verifying Data
        pub mod verifying {
            /// Mint Verifying Context
            pub const MINT: &[u8] = include_bytes!(concat!(
                env!("OUT_DIR"),
                "/data/pay/testnet/verifying/mint.dat",
            ));

            /// Mint Verifying Context Checksum
            pub const MINT_CHECKSUM: &[u8; 32] = include_bytes!(concat!(
                env!("OUT_DIR"),
                "/data/pay/testnet/verifying/mint.checksum",
            ));

            /// Private Transfer Verifying Context
            pub const PRIVATE_TRANSFER: &[u8] = include_bytes!(concat!(
                env!("OUT_DIR"),
                "/data/pay/testnet/verifying/private-transfer.dat",
            ));

            /// Private Transfer Verifying Context Checksum
            pub const PRIVATE_TRANSFER_CHECKSUM: &[u8; 32] = include_bytes!(concat!(
                env!("OUT_DIR"),
                "/data/pay/testnet/verifying/private-transfer.checksum",
            ));

            /// Reclaim Verifying Context
            pub const RECLAIM: &[u8] = include_bytes!(concat!(
                env!("OUT_DIR"),
                "/data/pay/testnet/verifying/reclaim.dat",
            ));

            /// Reclaim Verifying Context Checksum
            pub const RECLAIM_CHECKSUM: &[u8; 32] = include_bytes!(concat!(
                env!("OUT_DIR"),
                "/data/pay/testnet/verifying/reclaim.checksum",
            ));
        }
    }
}

/// Testing Suite
#[cfg(test)]
mod test {
    use super::*;
    use anyhow::Result;
    use std::{
        fs::{self, File},
        io::Read,
    };

    /// Checks if two files `lhs` and `rhs` have equal content.
    #[inline]
    fn equal_files(lhs: &mut File, rhs: &mut File) -> Result<bool> {
        let mut lhs_buffer = [0; 2048];
        let mut rhs_buffer = [0; 2048];
        loop {
            let lhs_len = lhs.read(&mut lhs_buffer)?;
            let rhs_len = rhs.read(&mut rhs_buffer)?;
            if (lhs_len != rhs_len) || (lhs_buffer[..lhs_len] != rhs_buffer[..rhs_len]) {
                return Ok(false);
            }
            if lhs_len == 0 {
                return Ok(true);
            }
        }
    }

    /// Downloads all data from GitHub and checks if they are the same as the data known locally to
    /// this Rust crate.
    #[test]
    fn download_all_data() -> Result<()> {
        let directory = tempfile::tempdir().expect("Unable to generate temporary test directory.");
        println!("[INFO] Temporary Directory: {:?}", directory);
        let directory_path = directory.path();
        for file in walkdir::WalkDir::new("data") {
            let file = file?;
            let path = file.path();
            if !path.is_dir() {
                println!("[INFO] Checking path: {:?}", path);
                let target = directory_path.join(path);
                fs::create_dir_all(target.parent().unwrap())?;
                github::download(github::DEFAULT_BRANCH, path.to_str().unwrap(), &target)?;
                assert!(equal_files(
                    &mut File::open(path)?,
                    &mut File::open(target)?
                )?);
            }
        }
        Ok(())
    }
}

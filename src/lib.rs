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

use serde::{Deserialize, Serialize};

#[cfg(feature = "download")]
use std::{fs, path::Path};

/// GitHub Data File Downloading
#[cfg(feature = "download")]
#[cfg_attr(doc_cfg, doc(cfg(feature = "download")))]
pub mod github {
    use super::*;

    /// GitHub Organization
    pub const ORGANIZATION: &str = "manta-network";

    /// SDK GitHub Repository Name
    pub const REPO: &str = "sdk";

    /// Default GitHub Branch
    pub const DEFAULT_BRANCH: &str = "add-sdk-library";

    /// Downloads data from `data_path` relative to the given `branch` to a file at `path`.
    #[cfg(feature = "download")]
    #[cfg_attr(doc_cfg, doc(cfg(feature = "download")))]
    #[inline]
    pub fn download<P>(branch: &str, data_path: &str, path: P) -> anyhow::Result<()>
    where
        P: AsRef<Path>,
    {
        let data = attohttpc::get(alloc::format!(
            "https://media.githubusercontent.com/media/{ORGANIZATION}/{REPO}/{branch}/{data_path}"
        ))
        .send()?
        .text()?;
        fs::write(path, data)?;
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
            pub fn mint<P>(path: P) -> anyhow::Result<()>
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
            pub fn private_transfer<P>(path: P) -> anyhow::Result<()>
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
            pub fn reclaim<P>(path: P) -> anyhow::Result<()>
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

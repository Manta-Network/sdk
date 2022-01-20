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

//! Manta SDK

/// Manta Pay
///
/// See [`manta-pay`](https://github.com/manta-network/manta-rs) for the definitions.
pub mod pay {
    /// Testnet Data
    pub mod testnet {
        /// Asset Definitions
        pub mod asset {}

        /// Parameters
        pub mod parameters {}

        /// Zero-Knowledge Proof Verifying Data
        pub mod verifying {
            /// Mint Verifying Context
            pub const MINT: &[u8] = include_bytes!(concat!(
                env!("OUT_DIR"),
                "/data/pay/testnet/verifying/mint.dat"
            ));

            /// Private Transfer Verifying Context
            pub const PRIVATE_TRANSFER: &[u8] = include_bytes!(concat!(
                env!("OUT_DIR"),
                "/data/pay/testnet/verifying/private-transfer.dat"
            ));

            /// Reclaim Verifying Context
            pub const RECLAIM: &[u8] = include_bytes!(concat!(
                env!("OUT_DIR"),
                "/data/pay/testnet/verifying/reclaim.dat"
            ));
        }
    }
}

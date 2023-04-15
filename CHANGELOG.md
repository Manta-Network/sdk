# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- [\#119](https://github.com/Manta-Network/sdk/pull/119) Add HttpProvider && Fix private-transfer.lfs file download failure in Manta Wallet && Fix the error that the download failed on Ledger api
- [\#115](https://github.com/Manta-Network/sdk/pull/115) Add the reading and writing of JsValue related to authorization_context && Add sync SBT function, without Merkle tree && getZkAddress and toPrivate do not need load_accounts, only authorization_context is required
- [\#114](https://github.com/Manta-Network/sdk/pull/114) Refactor SDK logic && Add build SBT posts method, and getIdentityProof && Add docs and examples on how to connect Manta Wallet && Add how to use SDK docs and examples
- [\#108](https://github.com/Manta-Network/sdk/pull/108) Added initial sync method.
- [\#105](https://github.com/Manta-Network/sdk/pull/105) Save while syncing.
- [\#85](https://github.com/Manta-Network/sdk/pull/85) Key-dependent signer function APIs.
- [\#71](https://github.com/Manta-Network/sdk/pull/71) Update to dense pull ledger diff
- [\#51](https://github.com/Manta-Network/sdk/pull/51) Update to MantaPay v1

### Changed
- [\#103](https://github.com/Manta-Network/sdk/pull/103) Update manta-rs to v0.5.12.
- [\#102](https://github.com/Manta-Network/sdk/pull/102) Include sink accounts in ToPublic. Removes `assetIdToUInt8Array` function as it encodes values < 255 incorrectly, now changed to use polkadot.js utility function.
- [\#88](https://github.com/Manta-Network/sdk/pull/88) Update API wording to be consistent with company-wide language.

### Deprecated

### Removed

### Fixed

### Security

# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- [\#148](https://github.com/Manta-Network/sdk/pull/148) Add caching to the getMetadata interface that takes up too much bandwidth
- [\#139](https://github.com/Manta-Network/sdk/pull/139) Add sdk node example
- [\#133](https://github.com/Manta-Network/sdk/pull/133) Restore pruning and add UTXO consolidation && add Api `estimateTransferPostsCount` && add Api `consolidateTransferSend`
- [\#131](https://github.com/Manta-Network/sdk/pull/131) Add synced ledger count api
- [\#128](https://github.com/Manta-Network/sdk/pull/128) Add total ledger count
- [\#127](https://github.com/Manta-Network/sdk/pull/127) Add ledger sync progress
- [\#126](https://github.com/Manta-Network/sdk/pull/126) Add Reproduce extra balance example && Update SDK example && && Update extension example
- [\#119](https://github.com/Manta-Network/sdk/pull/119) Add HttpProvider && Fix private-transfer.lfs file download failure in Manta Wallet && Fix the error that the download failed on Ledger api
- [\#118](https://github.com/Manta-Network/sdk/pull/118) Add pruning function && Fix initial sync bug && Refactor walletIsBusy logic && Add get transactionDatas from posts
- [\#115](https://github.com/Manta-Network/sdk/pull/115) Add the reading and writing of JsValue related to authorization_context && Add sync SBT function, without Merkle tree && getZkAddress and toPrivate do not need load_accounts, only authorization_context is required
- [\#114](https://github.com/Manta-Network/sdk/pull/114) Refactor SDK logic && Add build SBT posts method, and getIdentityProof && Add docs and examples on how to connect Manta Wallet && Add how to use SDK docs and examples
- [\#108](https://github.com/Manta-Network/sdk/pull/108) Added initial sync method.
- [\#105](https://github.com/Manta-Network/sdk/pull/105) Save while syncing.
- [\#85](https://github.com/Manta-Network/sdk/pull/85) Key-dependent signer function APIs.
- [\#71](https://github.com/Manta-Network/sdk/pull/71) Update to dense pull ledger diff
- [\#51](https://github.com/Manta-Network/sdk/pull/51) Update to MantaPay v1

### Changed
- [\#124](https://github.com/Manta-Network/sdk/pull/124) Upgrade manta-rs dependencies to v0.5.15.
- [\#103](https://github.com/Manta-Network/sdk/pull/103) Update manta-rs to v0.5.12.
- [\#102](https://github.com/Manta-Network/sdk/pull/102) Include sink accounts in ToPublic. Removes `assetIdToUInt8Array` function as it encodes values < 255 incorrectly, now changed to use polkadot.js utility function.
- [\#88](https://github.com/Manta-Network/sdk/pull/88) Update API wording to be consistent with company-wide language.

### Deprecated
- [\#125](https://github.com/Manta-Network/sdk/pull/125) Disable pruning feature.
### Removed

### Fixed
- [\#136](https://github.com/Manta-Network/sdk/pull/136) Asset selection fix
- [\#129](https://github.com/Manta-Network/sdk/pull/129) Signer bug fix.

### Security

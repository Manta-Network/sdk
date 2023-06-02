# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security

## [0.0.0] 2022-12-21

### Added
- [\#51](https://github.com/Manta-Network/manta-signer/pull/51) Initial version of manta.js


## [2.0.0] 2023-2-24

### Changed
- [\#86](https://github.com/Manta-Network/manta-signer/pull/86) Allow the PrivateWallet class to be initialized without polkadot.js api being connected to a node

## [3.0.0] 2023-3-7

### Changed
[\#102](https://github.com/Manta-Network/sdk/pull/102) Include sink accounts in ToPublic. Removes `assetIdToUInt8Array` function as it encodes values < 255 incorrectly, now changed to use polkadot.js utility function.

## [3.0.2] 2023-6-2

### Fixed
[\#132](https://github.com/Manta-Network/sdk/pull/132) Update polkadot.js dependencies to fix an issue building transactions

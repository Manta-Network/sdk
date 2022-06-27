# Manta Network SDK

The SDK includes a data library for the concrete public parameters of the Manta protocols and also Javascript bindings to the Wallet API.

## Data Library

**Note: Data Library will be deprecated soon.**

- [`data`](data)
- [`data.checkfile`](data.checkfile)
- [`src`](src/lib.rs)
- [`build.rs`](build.rs)

This data library represents the parts of the Manta protocols which depend on real-world data or concrete public parameters. To build on top of of the Manta protocols, be sure to visit [`manta-rs`](https://github.com/manta-network/manta-rs) for actual libraries and implementations of the protocols.

The data library is comprised of a bunch of data files, either as raw binary data or JSON, and an accompanying Rust library which has access to these data files at compile-time. See the [`build.rs`](./build.rs) file for more on how those data files are parsed into Rust. Some data files are too large to package into a Rust library and so are left as stand-alone files. For these files, a [`BLAKE3`](https://github.com/BLAKE3-team/BLAKE3) digest is offered in the Rust library as a checksum.

### Checksums

For checksums we use [`BLAKE3`](https://github.com/BLAKE3-team/BLAKE3). Install the `b3sum` command with

```sh
cargo install b3sum
```

to compute the checksums for yourself. The checksums for the [`data`](./data/) directory are stored in [`data.checkfile`](./data.checkfile) which is created by the following command:

```sh
b3sum data/**/* 2>/dev/null > data.checkfile
```

To check that the checkfile is up-to-date use the following command:

```sh
b3sum --check data.checkfile
```

### Validating the Dataset

To check that the dataset in the [`data`](./data) directory matches the data exported by the `manta-sdk` crate, run 

```sh
cargo test --release -- --nocapture
```

which will download all the files on the GitHub source repository for the current branch and check that all the files match the known checksums.

## Javascript Wallet Bindings

- [`wallet`](wallet)

The core logic of the wallet is written in Rust and built from [`manta-rs`](https://github.com/manta-network/manta-rs). To integrate it into Javascript we use the `wasm-bindgen` crate to build the WASM Foreign-Function Interface and then call the WASM functions from Javascript. 

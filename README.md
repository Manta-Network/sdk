# Manta Network SDK

## Get Started

This SDK represents the parts of the Manta protocols which depend on real-world data or concrete public parameters. To build on top of of the Manta protocols, be sure to visit [`manta-rs`](https://github.com/manta-network/manta-rs) for actual libraries and implementations of the protocols.

The SDK is comprised of a bunch of data files, either as raw binary data or JSON, and an accompanying Rust library which has access to these data files at compile-time. See the [`build.rs`](./build.rs) file for more on how those data files are parsed into Rust. Some data files are too large to package into a Rust library and so are left as stand-alone files. For these files, a [`BLAKE3`](https://github.com/BLAKE3-team/BLAKE3) digest is offered in the Rust library as a checksum.

# Manta Network SDK

The SDK includes Javascript bindings to the Wallet API.

## Javascript Wallet Bindings

- [`wallet`](wallet)

The core logic of the wallet is written in Rust and built from [`manta-rs`](https://github.com/manta-network/manta-rs). To integrate it into Javascript we use the `wasm-bindgen` crate to build the WASM Foreign-Function Interface and then call the WASM functions from Javascript. 

**Note: Data Library has been deprecated and moved to [`manta-parameters`](https://github.com/Manta-Network/manta-rs/tree/main/manta-parameters).**

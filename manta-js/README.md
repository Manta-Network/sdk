# Manta SDK

## Quick Start

- ### If you want to connect Manta Wallet in your dApp, build private-related transactions.
  - Docs: [how-to-use-manta-private-wallet-in-dapp](./docs/how-to-use-manta-private-wallet-in-dapp.md)
  - Example: [extension-example](./examples/extension-example)
  - Online Website: [https://2076b1.csb.app](https://2076b1.csb.app)
  - Manta Wallet Download: [Chrome WebStore](https://chrome.google.com/webstore/detail/enabgbdfcbaehmbigakijjabdpdnimlg), [Beta Packages](https://github.com/Manta-Network/manta-extension/actions)
- ### If you want to test the SDK or integrate the SDK into your wallet
  - Docs: [how-to-use-manta-js-sdk](./docs/how-to-use-manta-js-sdk.md)
  - Example: [sdk-example](./examples/sdk-example)
- ### If you want to test zkSBT related functions
  - Docs: [how-to-mint-zk-sbt](./docs/how-to-mint-zk-sbt.md)

## How to build

``` sh
# If wasm-pack is not installed, please install wasm-pack first, https://rustwasm.github.io/wasm-pack/installer/
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

cd ./package
yarn
yarn build-browser
```

## Related links

- [manta-extension](https://github.com/manta-Network/manta-extension) Manta Wallet Extension
- [manta-rs](https://github.com/Manta-Network/manta-rs)
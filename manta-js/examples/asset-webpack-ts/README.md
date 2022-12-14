# Manta.js Examples

This directory contains some end to end examples of how to use manta.js.

In order to run these examples:

- Make sure all the dependencies are up to date, below is an example of a bash script to update all the dependencies:

```
#!/bin/bash
cd /Users/kevingislason/sdk/wallet/crate
wasm-pack build
cd /Users/kevingislason/sdk/manta-js/package
yarn upgrade file:../../wallet/crate/pkg
yarn upgrade file:../../wallet/api
cd /Users/kevingislason/sdk/manta-js/examples/aset-webpack-ts
yarn
yarn upgrade manta.js
```

- Make sure you modify the examples to use the correct network. They are currently set to dev, which requires a local node.

- Make sure the public polkadot JS account you are using has sufficient funds.

- To run the examples make sure you are in the `asset-webpack-ts` directory, after installing all dependencies and call `yarn serve`.
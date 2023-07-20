# Manta SDK Example

## Build manta-sdk

```
cd manta-js/package
yarn build-all
```

## How to run this example

``` shell
cd manta-js/examples/sbt-example
yarn
yarn start # Will rebuild the sdk and run example
```

After run `yarn start`, it will open browser: `http://localhost:8080/`

Open chrome developer console, initialize log:

```
[Demo] 4437.9000: Initial base
13:43:07.083 index.js:294 [BaseWallet]: 4438.3000, Start download
13:43:08.797 index.js:294 [BaseWallet]: 6152.4000, Download successful
13:43:08.830 index.js:294 [BaseWallet]: 6185.5000, Initial api
13:43:08.834 index.ts:69 [Demo] 6189.3000: Initial base end
13:43:08.872 index.ts:69 [Demo] 6227.2000: Initial pallets
13:43:08.872 index.ts:69 [Demo] 6227.5000: Initial pallets end
13:43:08.872 index.ts:69 [Demo] 6227.5000: Initial mantaSbt data
13:43:08.872 index.ts:69 [Demo] 6227.5000: Initial signer
13:43:08.896 index.js:294 [Private Wallet mantaSBT]: 6251.2000, Start initial signer
13:43:10.032 index.js:294 [Private Wallet mantaSBT]: 7387.6000, Initial signer successful
13:43:10.033 index.ts:69 [Demo] 7388.0000: Load user mnemonic
13:43:10.064 index.ts:69 [Demo] 7419.3000: The zkAddress is:  KqjRB8VgFqADvhgHvjnvENPVieWUR4fYufGTAUwCCWp
13:43:10.064 index.ts:69 [Demo] 7419.4000: Initial mantaSbt data end
13:43:10.064 index.ts:69 [Demo] 7419.4000: Initial successful
```

Then you can run mint sbt with signature transaction:

```
window.actions.mintSbtWithSignature()
```

If you found message: `asset id of XXXX is none, please reserve asset id first.` on the console, then you need run below transaction first:

```
window.actions.reserveSbt()
```

If you mint sbt success, you should see `mantaSbt.MintSbt` event on polkadot.js browser.

- Calamari development: https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fcalamari.seabird.systems#/explorer
- Calamari production: https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fcalamari.systems#/explorer

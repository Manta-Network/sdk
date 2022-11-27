# Manta Api

This package implements a Javascript SDK for connecting with the Manta Network.

## Installation

```sh
yarn install manta.js
```

# Usage

All methods are called through the `mantaSdk` class.

`manta-signer` must be installed and running, with the `features=unsafe-disable-cors` flag.

Refer to `/examples` for more thorough examples, as well as examples using Non-Fungible Tokens.

## Initialization

The `Environment` flag specifies whether to connect to a local node, or the use an actual running node from the network.

The `Network` flag specifies which network to connect to, either `Dolphin`, `Calamari` or `Manta`.

It is also possible to switch between environments and networks.

A public address can also be specified in the `init()` method, if it is not the first polkadot.js address will be selected by default.

```javascript
import { MantaSdk, init, Environment, Network } from 'manta.js';

const devEnvironment = sdk.Environment.Development;
const prodEnvironment = sdk.Environment.Production;
const dolphinNetwork = sdk.Network.Dolphin;
const calamariNetwork = sdk.Network.Calamari;

const mantaSdk = await sdk.init(devEnvironment,dolphinNetwork);

await mantaSdk.setNetwork(calamariNetwork);
await mantaSdk.setEnvironment(prodEnvironment);

```

## Transacting

After initialization, as well as switching between networks or environments, `initalWalletSync()` must be called before any transactions are made.

After every single transaction, to get the latest data from the ledger, `walletSync()` must be called.

Below is an example of how to transact using fungible tokens. This example assumes the publicAddress already has associated funds.

```javascript

// DOL token
const assetId = 1;

// DOL amount - 10 DOL
const amount_10 = 10000000000000000000;

// DOL amount - 3 DOL
const amount_3 = 3000000000000000000;

// Sync with most recent ledger state. 
await mantaSdk.initialWalletSync();

// Get private address
const privateAddress = await mantaSdk.privateAddress();

// Get public address
const publicAddress = await mantaSdk.publicAddress();

// Get private balance of DOL for given private address
const privateBalance = await mantaSdk.privateBalance(assetId);

// Privatize 10 DOL to 10 pDOL
await mantaSdk.toPrivatePost(assetId, amount_10);

// Sync to get latest data after transaction and check that it was successful.
await mantaSdk.walletSync();
let newPrivateBalance = await mantaSdk.privateBalance(asset_id);

// Private Transfer of 3 pDOL to another private address
const examplePrivateAddress = "64nmibscb1UdWGMWnRQAYx6hS4TA2iyFqiS897cFRWvNTmjad85p6yD9ud7cyVPhyNPDrSMs2eZxTfovxZbJdFqH";
await mantaSdk.privateTransfer(assetId, amount_3, examplePrivateAddress);

// Sync to get latest data after transaction and check that it was successful.
await mantaSdk.walletSync();
newPrivateBalance = await mantaSdk.privateBalance(asset_id);

// Convert 3 pDOL back to DOL
await mantaSdk.toPublic(assetId, amount_3);

// Sync to get latest data after transaction and check that it was successful.
await mantaSdk.walletSync();
newPrivateBalance = await mantaSdk.privateBalance(asset_id);

// To only sign the transaction without sending it to the ledger, add the optional `onlySign` flag
// Convert 3 pDOL back to DOL - only sign the transaction.
const onlySign = true;
const signResult = await mantaSdk.toPublic(assetId, amount_3, onlySign);
```

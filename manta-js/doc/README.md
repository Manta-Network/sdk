# Manta JS

This package implements a Javascript SDK for connecting with the Manta Network.

## Installation

```sh
yarn install manta.js
```

# Usage

All methods are called through the `mantaSdk` class.

`manta-signer` must be installed and running.

> If running `manta-signer` on dev mode, should using `features=unsafe-disable-cors` flag.

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

Below is an example of how to transact using fungible tokens, it contains three main methods that `manta-pay` provided:
- toPrivate(asset, amount)
- privateTransfer(asset, amount, receiver)
- toPublic(asset, amount)

> This example assumes the `publicAddress` already has associated funds.

### ToPrivate

This example made 10 public asset(i.e. DOL) to private asset(i.e. pDOL).

```javascript
// DOL token
const asset_id = new BN("1");
const amount = new BN("10000000000000000000");

// Sync with most recent ledger state. 
await mantaSdk.initialWalletSync();

// Get private address
const privateAddress = await mantaSdk.privateAddress();

// Get public address
const publicAddress = await mantaSdk.publicAddress();

// Get private balance of DOL for given private address
const privateBalance = await mantaSdk.privateBalance(asset_id);

// Privatize 10 DOL to 10 pDOL
await mantaSdk.toPrivate(asset_id, amount);

// Sync to get latest data after transaction and check that it was successful.
await mantaSdk.walletSync();
// The private balance of pDOL should increments 10 UNITS.
let newPrivateBalance = await mantaSdk.privateBalance(asset_id);
```

### PrivateTransfer

This example transfer 5 private asset(i.e. pDOL) to other one.

```javascript
// DOL token
const asset_id = new BN("1");
const amount = new BN("10000000000000000000");

// Sync with most recent ledger state. 
await mantaSdk.initialWalletSync();

// Get private address
const privateAddress = await mantaSdk.privateAddress();

// Get public address
const publicAddress = await mantaSdk.publicAddress();

// Private Transfer of 5 pDOL to another private address
const examplePrivateAddress = "3UG1BBvv7viqwyg1QKsMVarnSPcdiRQ1aL2vnTgwjWYX";
await mantaSdk.privateTransfer(asset_id, amount, examplePrivateAddress);

// Sync to get latest data after transaction and check that it was successful.
await mantaSdk.walletSync();
let newPrivateBalance = await mantaSdk.privateBalance(asset_id);
```

### ToPublic

This example made 5 private asset(i.e. pDOL) to public asset(i.e. DOL).

```javascript
// DOL token
const asset_id = new BN("1");
const amount = new BN("5000000000000000000");

// Sync with most recent ledger state. 
await mantaSdk.initialWalletSync();

// Get private address
const privateAddress = await mantaSdk.privateAddress();

// Get public address
const publicAddress = await mantaSdk.publicAddress();

// Get private balance of DOL for given private address
const privateBalance = await mantaSdk.privateBalance(asset_id);

// Convert 5 pDOL back to DOL
await mantaSdk.toPublic(asset_id, amount);

// Sync to get latest data after transaction and check that it was successful.
await mantaSdk.walletSync();
newPrivateBalance = await mantaSdk.privateBalance(asset_id);
```

### Sign and manual send transaction

In some case that you may not want to send transaction by our sdk, you can get sign result, and send transaction by yourself.

This example get sign result of `ToPrivate` 10 DOL.

```javascript
// To only sign the transaction without sending it to the ledger
const onlySign = true;

const asset_id = new BN("1");
const amount = new BN("10000000000000000000");

const env = sdk.Environment.Development;
const net = sdk.Network.Dolphin;
const mantaSdk = await sdk.init(env,net, ALICE);

const privateAddress = await mantaSdk.privateAddress();
console.log("The private address is: ", privateAddress);

await mantaSdk.initalWalletSync();

const initalPrivateBalance = await mantaSdk.privateBalance(asset_id);
console.log("The inital private balance is: ", initalPrivateBalance);

const signResult = await mantaSdk.toPrivate(asset_id, amount, onlySign);

console.log("The result of the signing: ", JSON.stringify(signResult.transactions));
```

You can get other transaction type result:

```javascript
const signResult = await mantaSdk.toPrivate(asset_id, amount, onlySign);
const signResult = await mantaSdk.toPublic(asset_id, amount, onlySign);
const signResult = await mantaSdk.privateTransfer(asset_id, amount, address, onlySign);
```

Then you can use this result to submit transaction by your self. Here is an `to_private` example that verify sign result is ok:

Copy the transaction to polkadot.js `Extrinsic` decode:

![extrinsic decode](./to_private_decode.png)

Switch to `Submission`:

![extrinsic decode](./to_private_extrinsic.png)

Then submit transaction.

![extrinsic decode](./to_private_submit.png)

You should see your extrinsic show on polkadot.js explorer. And you can check private balance is increment.


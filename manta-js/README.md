# Manta JS

This package implements a Javascript SDK for connecting with the Manta Network.

## Installation

```sh
yarn install manta.js
```

# Usage

All methods are called through the `MantaPrivateWallet` class.

`manta-signer` must be installed and running.

> If running `manta-signer` on dev mode, you should use the following features: `features=unsafe-disable-cors,disable-restart`.

Refer to `/examples` for more thorough examples, and how to run them.

## Initialization

The `Environment` flag specifies whether to connect to a local node, or the use an actual node from the network.

The `Network` flag specifies which network to connect to, either `Dolphin`, `Calamari` or `Manta`.

To switch between environments and networks, a new `MantaPrivateWallet` instance should be created.

```javascript
import { MantaPrivateWallet, Environment, Network } from 'manta.js';

const prodEnvironment = sdk.Environment.Production;
const dolphinNetwork = sdk.Network.Dolphin;

const privateWallet = await MantaPrivateWallet.init(prodEnvironment,dolphinNetwork);
```

## Transacting

After initialization of the `MantaPrivateWallet` class, `initalWalletSync()` must be called before any transactions are made.

After every single transaction, to get the latest data from the ledger, `walletSync()` must be called.

A PolkadotJS `Signer` and public `Address` should be provided to every function that requires transacting. Below is an example of how to get these values, this example assumes that the Polkadot JS extension is installed and contains an existing account.

### Polkadot JS Transaction Parameters

```javascript
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';

// Get Polkadot JS Signer and Polkadot JS account address.
const getPolkadotSignerAndAddress = async () => {
    const extensions = await web3Enable('Polkadot App');
    if (extensions.length === 0) {
        throw new Error("Polkadot browser extension missing. https://polkadot.js.org/extension/");
    }
    const allAccounts = await web3Accounts();
    let account = allAccounts[0];

    const injector = await web3FromSource(account.meta.source);
    const polkadotSigner = injector.signer;
    const polkadotAddress = account.address;
    return {
        polkadotSigner,
        polkadotAddress
    }
}
```

Below is an example of how to transact using fungible tokens, there are four main methods that `manta-pay` provides:
- `toPrivateSend(asset, amount, polkadotSigner, polkadotAddress)`
- `privateTransferSend(asset, amount, receiver, polkadotSigner, polkadotAddress)`
- `toPublicSend(asset, amount, polkadotSigner, polkadotAddress)`
- `publicTransfer(asset, amount, destinationAddress, polkadotSigner, polkadotAddress)`

> This example assumes the `polkadotAddress` already has associated public funds.

### ToPrivate

This example converts 10 public DOL tokens to 10 private DOL tokens.

```javascript
// DOL token
const assetId = new BN("1");
const amount = new BN("10000000000000000000");

// Sync with most recent ledger state. 
await mantaPrivateWallet.initialWalletSync();

// Get private address
const privateAddress = await mantaPrivateWallet.privateAddress();

// Get private balance of DOL for given private address
const privateBalance = await mantaPrivateWallet.privateBalance(assetId);

// Privatize 10 DOL to 10 pDOL
await mantaPrivateWallet.toPrivate(asset_id, amount, polkadotSigner, polkadotAddress);

// Sync to get latest data after the transaction and check that it was successful.
await mantaPrivateWallet.walletSync();

// The private balance of pDOL should be incremented by 10 units.
const newPrivateBalance = await mantaSdk.privateBalance(assetId);
```

### PrivateTransfer

This example transfers 10 private private pDOL to another address.

```javascript
// DOL token
const assetId = new BN("1");
const amount = new BN("10000000000000000000");

// Sync with most recent ledger state. 
await mantaSdk.initialWalletSync();

// Get private address
const privateAddress = await mantaSdk.privateAddress();

// Private Transfer of 10 pDOL to another private address
const examplePrivateAddress = "3UG1BBvv7viqwyg1QKsMVarnSPcdiRQ1aL2vnTgwjWYX";
await mantaSdk.privateTransfer(asset_id, amount, examplePrivateAddress, polkadotSigner, polkadotAddress);

// Sync to get latest data after transaction and check that it was successful.
await mantaSdk.walletSync();

// The private balance of pDOL should decrease by 10 units.
const newPrivateBalance = await mantaSdk.privateBalance(assetId);
```

### ToPublic

This example converts 5 private pDOL to 5 public DOL.

```javascript
// DOL token
const assetId = new BN("1");
const amount = new BN("5000000000000000000");

// Sync with most recent ledger state. 
await mantaSdk.initialWalletSync();

// Get private address
const privateAddress = await mantaSdk.privateAddress();

// Get private balance of DOL for given private address
const privateBalance = await mantaSdk.privateBalance(assetId);

// Convert 5 pDOL back to DOL
await mantaSdk.toPublic(assetId, amount, polkadotSigner, polkadotAddress);

// Sync to get latest data after transaction and check that it was successful.
await mantaSdk.walletSync();

// The private balance of pDOL should decrease by 5 units.
const newPrivateBalance = await mantaSdk.privateBalance(assetId);
```

### Sign and manual send transaction

In some cases you may not want to send transaction to the ledger through manta.js, thus you can get sign result after manta-signer has signed the transaction and send the transaction yourself. This is done by using the `toPrivateBuild`, `privateTransferBuild`, `publicTransferBuild` functions.

This example returns the signed transaction of `toPrivate` for 10 DOL.

```javascript
const assetId = new BN("1");
const amount = new BN("10000000000000000000");

const env = sdk.Environment.Development;
const net = sdk.Network.Dolphin;
const mantaSdk = await sdk.init(env,net);

const privateAddress = await mantaSdk.privateAddress();
console.log("The private address is: ", privateAddress);

await mantaSdk.initalWalletSync();

const initalPrivateBalance = await mantaSdk.privateBalance(assetId);
console.log("The inital private balance is: ", initalPrivateBalance);

const signResult = await mantaSdk.toPrivateBuild(assetId, amount, polkadotSigner, polkadotAddress);

console.log("The result of the signing: ", JSON.stringify(signResult.transactions));
```

This can also be done for all other transaction types:

```javascript
const toPrivateSignResult = await mantaSdk.toPrivateBuild(assetId, amount, polkadotSigner, polkadotAddress);
const toPublicSignResult = await mantaSdk.toPublicBuild(assetId, amount, polkadotSigner, polkadotAddress);
const privateTransferSignResult = await mantaSdk.privateTransferBuild(assetId, amount, privateAddress, polkadotSigner, polkadotAddress);
```

Then you can use the signResult to submit transaction by your self. Here is an example on how to verify the `toPrivateBuild` sign result is valid:

Copy the transaction to polkadot.js `Extrinsic` decode:

![extrinsic decode](./doc/to_private_decode.png)

Switch to `Submission`:

![extrinsic decode](./doc/to_private_extrinsic.png)

Then submit transaction.

![extrinsic decode](./doc/to_private_submit.png)

You should see your extrinsic show up on polkadot.js explorer. Then you will notice an increase in your private balance.
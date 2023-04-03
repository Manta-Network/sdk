# Manta SDK Example

## How to run this example


``` shell
yarn
yarn start # Will rebuild the sdk and run example
```
> This example supports any polkadot extension wallet

## How to test the SDK

1. Update the config in the [index.ts](./index.ts) file, If you need to change.
``` typescript
const apiEndpoint = 'wss://zenlink.zqhxuyuan.cloud:444';
const nativeTokenDecimals = 12;

const currentNetwork: interfaces.Network = 'Dolphin';

// Native asset id
const assetId = new BN('1');

// toPrivate Amount (50 DOL)
const transferInAmount = new BN(50).mul(
  new BN(10).pow(new BN(nativeTokenDecimals)),
);
// privateTransfer && toPublic Amount (5 DOL)
const transferOutAmount = transferInAmount.div(new BN(10));

let currentSeedPhrase =
  'spike napkin obscure diamond slice style excess table process story excuse absurd';
```
2. Run example
```shell
yarn start # chrome will automatically open localhost:8080
```
3. Open the chrome devtools，When you see `Initial successful`, it means that the ledgers of mantaPay and mantaSBT have been synchronized successfully. Then you can execute the following code to test
``` typescript
// Under the window.actions object, the following methods are injected for testing
// This code is at the bottom of the index.ts file
window.actions = {
  getPallets() {
    return pallets;
  },
  async toPrivateTest() {
    await toPrivateTest(pallets.mantaPay as MantaPayWallet);
  },
  async toPublicTest() {
    await toPublicTest(pallets.mantaPay as MantaPayWallet);
  },
  async privateTransferTest() {
    await privateTransferTest(pallets.mantaPay as MantaPayWallet);
  },
  async toPrivateOnlySignTest() {
    await toPrivateOnlySignTest(pallets.mantaPay as MantaPayWallet);
  },
  async multiSbtBuildOnlySignTest(startAssetId: string) {
    if (!startAssetId) {
      throw new Error('startAssetId is required');
    }
    const sbtInfoList: interfaces.SbtInfo[] = [
      {
        assetId: new BN(startAssetId),
        metadata: 'test1',
      },
      {
        assetId: new BN(startAssetId).add(new BN(1)),
        metadata: 'test2',
      },
    ];
    await multiSbtBuildOnlySignTest(
      pallets.mantaSbt as MantaSbtWallet,
      sbtInfoList,
    );
  },
  async getIdentityProof() {
    await getIdentityProof(pallets.mantaSbt as MantaSbtWallet);
  },
  async relaunch() {
    await relaunch(pallets.mantaPay);
    await relaunch(pallets.mantaSbt);
  },
};

// Now you can execute the corresponding method to test

// test toPrivate
window.actions.toPrivateTest();

// test privateTransfer
window.actions.privateTransferTest();

// test toPublic
window.actions.toPublicTest();
```

# Manta SDK Example

## How to run this example


``` shell
yarn
yarn start # Will rebuild the sdk and run example
```
> This example supports any polkadot extension wallet, such as polkadot.js, SubWallet, Talisman, MantaWallet.

## How to test the SDK

1. Update the config in the [index.ts](./index.ts) file, If you need to change.
``` typescript
const apiEndpoint = 'wss://ws.calamari.systems';
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
3. Open the chrome devtools，When you see `Initial successful`, it means that the wallet of mantaPay and mantaSBT have been synchronized successfully. Then you can execute the following code to test
``` typescript
// The following methods will be automatically injected into `window.actions`
// This code is at the bottom of the index.ts file
window.actions = {
  getPallets() {
    return pallets;
  },
  async clearData() {
    await resetData(pallets.mantaPay);
    await resetData(pallets.mantaSbt);

    window.location.reload();
  },
  async getZkBalance(assetId: string) {
    return (await pallets.mantaPay.getZkBalance(new BN(assetId))).toString();
  },
  async toPrivateBuild() {
    await toPrivateBuild(pallets.mantaPay as MantaPayWallet);
  },
  async toPrivateSend() {
    await toPrivateSend(pallets.mantaPay as MantaPayWallet);
  },
  async toPublicSend() {
    await toPublicSend(pallets.mantaPay as MantaPayWallet);
  },
  async privateTransferSend() {
    await privateTransferSend(pallets.mantaPay as MantaPayWallet);
  },
  async multiSbtPostBuild(startAssetId: string) {
    if (!startAssetId) {
      throw new Error('startAssetId is required');
    }
    const sbtInfoList: interfaces.SbtInfo[] = [
      { assetId: new BN(startAssetId) },
      { assetId: new BN(startAssetId).add(new BN(1)) },
    ];
    return await multiSbtPostBuild(pallets.mantaSbt as MantaSbtWallet, sbtInfoList);
  },
  async getTransactionDatas(posts: any[]) {
    return await getTransactionDatas(pallets.mantaSbt as MantaSbtWallet, posts);
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

// get zkBalance
window.actions.getZkBalance('1');

// test toPrivate
window.actions.toPrivateSend();

// test privateTransfer
window.actions.privateTransferSend();

// test toPublic
window.actions.toPublicSend();
```

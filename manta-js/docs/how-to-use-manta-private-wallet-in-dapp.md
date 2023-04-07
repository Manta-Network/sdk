# How to use Manta Wallet in dApp

This doc mainly introduces the private-related content in Manta Wallet; some other content of Wallet Extension is similar to other Polkadot wallets, so this doc will not introduce too much.
> Note: For private transactions, it is no longer necessary to import manta.js on the dApp side

## Examples

  - [`extension-example`](../examples/extension-example). Temporary online website: https://2076b1.csb.app

## Initialize

There are two ways to use Manta Wallet.

1. Using the NPM package of [`@talismn/connect-wallets`](https://www.npmjs.com/package/@talismn/connect-wallets), Manta Wallet has not been officially launched yet, and a PR cannot be submitted to the [@talismn/connect](https://github.com/TalismanSociety/talisman-connect) project. Currently use [`manta-extension-connect`](https://www.npmjs.com/package/manta-extension-connect) instead.

``` typescript
import { getWallets } from 'manta-extension-connect'

const selectedWallet = getWallets().find((wallet) => wallet.extensionName === 'manta-wallet-js');
await selectedWallet.enable('dApp name');

const mantaWallet = selectedWallet?.extension;
const privateWallet = mantaWallet?.privateWallet;
```
2. Use the `privateWallet` object injected in `window`
``` typescript
const injectedMantaWallet = window.injectedWeb3['manta-wallet-js'] as InjectedWeb3;
const mantaWallet = await injectedMantaWallet.enable('dApp name');

const privateWallet = mantaWallet?.privateWallet;
```

## TypeScript type support

Just import the [interfaces.ts](../examples/extension-example/src/interfaces.ts) file, which will be published to npm later.

``` typescript
const privateWallet = privateWallet as InjectedPrivateWallet;
```

## Get zkAddress

``` typescript
const accounts = await mantaWallet.accounts.get();
if (!accounts || accounts.length <= 0) {
  return;
}
const { address as publicAddress, zkAddress } = accounts[0];
```

## Subscribe to the State of the wallet

Through State, you can know the internal state of the private wallet, and dApp can do corresponding processing according to the state value

``` typescript
const [walletState, setWalletState] = useState<PrivateWalletStateInfo | null>(null);
const unSub = privateWallet.subscribeWalletState(setWalletState);

// walletState will be like:
{
  isWalletInitialized: false, // Whether the instance of mantaPay and mantaSBT has been initialized
  isWalletAuthorized: false, // Whether the private wallet has been authorized and whether the auth_context has been injected
  isWalletReady: false,  // Whether the private wallet is ready and whether the ledger has been synchronized
  isWalletBusy: false, // Is the wallet busy
}
```

## MantaPay related functions

### Get token balance

``` typescript

const assetId = '1'
const network = 'Calamari'
// Get the token balance in MantaPay
const balance = await privateWallet.getZkBalance({ network, assetId });
// balance will be like '100000000000'

const assetIds = ['1', '8', '9'];
// Get multiple Token Balance in MantaPay
const balanceList = await privateWallet.getMultiZkBalance({ network, assetIds });
// balance will be like ['100000000000', '0', '0']
```

### ToPrivate
``` typescript
const amount = '100';
const decimals = 12;

// sync wallet is required before build
await privateWallet.walletSync();

// build to private transaction
const txHexList = await privateWallet.toPrivateBuild({
  assetId,
  amount: new BigNumber(10).pow(decimals).times(amount).toFixed(),
  polkadotAddress: publicAddress,
  network,
});
// txHexList will be like: ['0xaaaab12332131']
```

### PrivateTransfer
``` typescript
const receiveZkAddress = 'gUhdkKjmbQHup8yEDjRs4kNWMWxfn18hC6ThQcFW6DW';

// build private transfer transaction
const txHexList = await privateWallet.privateTransferBuild({
  assetId,
  amount: new BigNumber(10).pow(decimals).times(amount).toFixed(),
  polkadotAddress: publicAddress,
  toZkAddress: receiveZkAddress,
  network,
});
```

### ToPublic
``` typescript

// build to public transaction
const txHexList = await privateWallet.toPublicBuild({
  assetId,
  amount: new BigNumber(10).pow(decimals).times(amount).toFixed(),
  polkadotAddress: publicAddress,
  network,
});
```

### signAndSend transaction

``` typescript
// signAndSend transaction
for (let i = 0; i < txHexList.length; i++) {
  const tx = api.tx(txHexList[i]);
  await tx?.signAndSend(publicAddress, () => {});
}
```

## MantaSBT related functions

### Get token balance

``` typescript
// Get the token balance in MantaSBT
const balance = await privateWallet.getZkSbtBalance({ network, assetId });
// Get multiple Token Balance in MantaSBT
const balance = await privateWallet.getMultiZkSbtBalance({ network, assetIds });
```

### build multiSBT posts
``` typescript
const sbtInfoList = [
  { assetId: '1', amount: '1' },
  { assetId: '2', amount: '1' },
];
const { posts, transactionDatas } = await privateWallet.multiSbtPostBuild({ sbtInfoList, network });
```

### get identity proof
``` typescript
await privateWallet.getSbtIdentityProof({
  virtualAsset: '{"identifier":{...}}',
  polkadotAddress: publicAddress,
  network,
});
```

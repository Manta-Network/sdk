# How to use manta.js SDK

The SDK is no longer directly provided to the dApp side, but allows the wallet to integrate the SDK (may include the Node side, the wallet app, the extension wallet, etc.), because the SDK needs the user's seed phrase and the logic of accessing the wallet data.

## Examples

- [sdk-example](../examples/sdk-example) Check out this example to get a quicker understanding of how to use the manta.js SDK


## Some key Class introductions

- [BaseWallet.ts](../package/src/BaseWallet.ts) The basic instance of all wallets, which handles some common logic
``` typescript
export type Network = 'Dolphin' | 'Calamari' | 'Manta';

export type SaveStorageStateToLocal = (
  palletName: PalletName,
  network: Network,
  data: any,
) => Promise<boolean>;

export type GetStorageStateFromLocal = (
  palletName: PalletName,
  network: Network,
) => Promise<any>;

export interface IBaseWallet {
  api: ApiPromise;
  apiEndpoint: string | string[];
  apiTimeout: number;
  wasm: any;
  loggingEnabled: boolean;
  fullParameters: any;
  multiProvingContext: any;
  saveStorageStateToLocal: SaveStorageStateToLocal;
  getStorageStateFromLocal: GetStorageStateFromLocal;
  walletIsBusy: boolean;
  updateApi(apiEndpoint: string | string[], apiTimeout?: number): ApiPromise;
  disconnectApi(): Promise<boolean>;
  log(message: string, name?: string): void;
}
```
- [PrivateWallet.ts](../package/src/PrivateWallet.ts) The base class for all wallets, which handles the common functions of wallets
``` typescript
export type PalletName = 'mantaPay' | 'mantaSBT';

export interface IPrivateWallet {
  palletName: PalletName;
  baseWallet: IBaseWallet;
  wasmWallet: Wallet;
  ledgerApi: any;
  initialSyncIsFinished: boolean;
  isBindAuthorizationContext: boolean;
  network: Network;

  initialSigner(): Promise<boolean>;
  setNetwork(network: Network): Promise<boolean>;
  loadUserSeedPhrase(seedPhrase: string): Promise<boolean>;
  loadAuthorizationContext(authContext: AuthContextType): Promise<boolean>;
  getAuthorizationContext(): Promise<AuthContextType | null>;
  dropAuthorizationContext(): Promise<boolean>;
  dropUserSeedPhrase(): Promise<boolean>;
  initialWalletSync(): Promise<boolean>;
  initialNewAccountWalletSync(): Promise<boolean>;
  walletSync(): Promise<boolean>;
  getZkAddress(): Promise<Address>;
  getZkBalance(assetId: BN): Promise<BN>;
  getMultiZkBalance(assetIds: BN[]): Promise<BN[]>;
  resetState(): Promise<boolean>;
}
```
- [pallets/MantaPayWallet.ts](../package/src/pallets/MantaPayWallet.ts) Inherited PrivateWallet and implemented MantaPay related functions
``` typescript
export type SignedTransaction = {
  posts: any;
  transactionData: any;
  transactions: SubmittableExtrinsic<'promise', any>[];
  txs: SubmittableExtrinsic<'promise', any>[];
};

export interface IMantaPayWallet extends IPrivateWallet {
  toPrivateBuild(assetId: BN, amount: BN): Promise<SignedTransaction | null>;
  privateTransferBuild(
    assetId: BN,
    amount: BN,
    toZkAddress: Address,
  ): Promise<SignedTransaction | null>;
  toPublicBuild(
    assetId: BN,
    amount: BN,
    polkadotAddress: Address,
  ): Promise<SignedTransaction | null>;
}
```
- [pallets/MantaSbtWallet.ts](../package/src/pallets/MantaSbtWallet.ts) Inherited PrivateWallet and implemented MantaSBT related functions
``` typescript
export type SignedMultiSbtPost = {
  transactionDatas: any[];
  posts: any[];
};

export interface IMantaSbtWallet extends IPrivateWallet {
  multiSbtPostBuild(
    sbtInfoList: SbtInfo[],
  ): Promise<SignedMultiSbtPost | null>;
  getIdentityProof(virtualAsset: string, polkadotAddress: Address,): Promise<any>;
}
```
- [ledger-api/index.ts](../package/src/ledger-api/index.ts) Interface for pulling ledger data
``` typescript
export interface ILedgerApi {
  api: ApiPromise;
  palletName: PalletName;
  loggingEnabled: boolean;
  errorCallback: (err: Error) => void;

  initial_pull(checkpoint: any): any;
  pull(checkpoint: any): any;
}
```

## How to use the SDK

### 1. Get the BaseWallet instance
``` typescript
// indexedDB library, Switch to file storage or anything else if you need
import { get as getIdbData, set as setIdbData } from 'idb-keyval';

const baseWallet = await BaseWallet.init({
  apiEndpoint: 'wss://ws.calamari.systems',
  loggingEnabled: true,
  // You can download these files locally and then refer to the local path, But the name of the file cannot be changed
  provingFilePath: 'https://media.githubusercontent.com/media/Manta-Network/manta-rs/main/manta-parameters/data/pay/proving',
  parametersFilePath: 'https://raw.githubusercontent.com/Manta-Network/manta-rs/main/manta-parameters/data/pay/parameters',
  // Store the wallet data locally
  saveStorageStateToLocal: async (
    palletName: interfaces.PalletName,
    network: interfaces.Network,
    data: any,
  ): Promise<boolean> => {
    try {
      await setIdbData(`storage_state_${palletName}_${network}`, data);
    } catch (ex) {
      console.error(ex);
      return false;
    }
    return true;
  },
  // Read locally stored wallet data
  getStorageStateFromLocal: async (
    palletName: interfaces.PalletName,
    network: interfaces.Network,
  ): Promise<any> => {
    let result: string;
    try {
      result = await getIdbData(`storage_state_${palletName}_${network}`);
    } catch (ex) {
      console.error(ex);
    }
    return result || null;
  },
})
```
### 2. Instantiate the MantaPay wallet
``` typescript
const mantaPayWallet = MantaPayWallet.init('Dolphin', baseWallet);
await mantaPayWallet.initialSigner();
```
### 3. Instantiate the MantaSBT wallet
``` typescript
const mantaSbtWallet = MantaSbtWallet.init('Dolphin', baseWallet);
await mantaSbtWallet.initialSigner();
```
### 4. Load the user seed phrase, there are two types of user permissions in the SDK: 
- Related to the signature transaction, the user's seed phrase needs to be loaded
``` typescript
// Step 1: load user seed phrase
await mantaPayWallet.loadUserSeedPhrase('User Seed Phrase');
// Step 2: execute signed transaction
await mantaPayWallet.privateTransferBuild(assetId: BN, amount: BN)
// Step 3: remove user seed phrase
await mantaPayWallet.dropUserSeedPhrase();
```
- For wallet synchronization and account related, authorization_context needs to be loaded, which can always exist after initialization and does not need to be deleted
``` typescript
// When you execute loadUserSeedPhrase first, the AuthorizationContext will auto updated

// Step 1: cache the AuthorizationContext through getAuthorizationContext
const authContext = await mantaPayWallet.getAuthorizationContext();
// step 2: load the authorization from cache
const success = await mantaPayWallet.loadAuthorizationContext(authContext);

// is `loadAuthorizationContext` success, you can execute following functions
await mantaPayWallet.walletSync();
await mantaPayWallet.getZkAddress();
```

### 5. Initialize the synchronization wallet
``` typescript
// mantaPay
await mantaPayWallet.initialWalletSync();
// mantaSbt
await mantaSbtWallet.initialWalletSync();

// Only for the initialization synchronization method of accounts without wallet data, it is not necessary to call initialWalletSync
await mantaPayWallet.initialNewAccountWalletSync()
await mantaSbtWallet.initialNewAccountWalletSync()

```
### 6. Execute signed transaction
> Executing signed transactions needs to be wrapped with loadUserSeedPhrase and dropUserSeedPhrase
``` typescript
// mantaPay
await mantaPayWallet.toPrivateBuild(assetId: BN, amount: BN);
await mantaPayWallet.privateTransferBuild(assetId: BN, amount: BN, toZkAddress: Address);
await mantaPayWallet.toPublicBuild(assetId: BN, amount: BN, polkadotAddress: Address );

// mantaSBT
export type SbtInfo = {
  assetId: BN;
  amount?: BN;
};
await mantaSbtWallet.multiSbtPostBuild(sbtInfoList: SbtInfo[]);
await mantaSbtWallet.getIdentityProof(virtualAsset: string, polkadotAddress: Address);
```

### 7. Wallet synchronization
``` typescript
// Generally, the wallet is synchronized before and after the transaction, but it needs to be called after initialWalletSync/initialNewAccountWalletSync
await mantaPayWallet.walletSync();
```
### 8. Query balance
``` typescript
// mantaPay
await mantaPayWallet.getZkBalance(assetId: BN);
await mantaPayWallet.getMultiZkBalance(assetIds: BN[]);

// mantaSBT
await mantaSbtWallet.getZkBalance(assetId: BN);
await mantaSbtWallet.getMultiZkBalance(assetIds: BN[]);
```
### 9. Get zkAddress
``` typescript
await mantaPayWallet.getZkAddress();
```
### 10. Switch network
``` typescript
// mantaPay
await mantaPayWallet.setNetwork('Calamari');
// mantaSBT
await mantaSbtWallet.setNetwork('Calamari');
```

## Who uses the manta.js SDK
- [manta-extension](https://github.com/manta-Network/manta-extension) Manta Wallet Extension

## Related links
- [manta-rs](https://github.com/Manta-Network/manta-rs)

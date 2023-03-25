import type BN from 'bn.js';
import type { ApiPromise } from '@polkadot/api';
import type { Wallet } from './wallet/crate/pkg';
import type { Network } from './constants';
import type { SubmittableExtrinsic } from '@polkadot/api/types';

export type PalletName = 'mantaPay' | 'mantaSBT';

export type Address = string;

export interface ILedgerApi {
  api: any;
  palletName: PalletName;
  loggingEnabled: boolean;

  initial_pull(checkpoint: any): any;
  pull(checkpoint: any): any;
}

export type SignedTransaction = {
  posts: any;
  transactionData: any;
  transactions: SubmittableExtrinsic<'promise', any>[];
  txs: SubmittableExtrinsic<'promise', any>[];
};

export type SignedMultiSbtTransaction = {
  transactionDatas: any[];
  batchedTx: SubmittableExtrinsic<'promise', any>;
};

export type SaveStorageStateToLocal = (
  palletName: PalletName,
  network: string,
  data: any,
) => Promise<boolean>;
export type GetStorageStateFromLocal = (
  palletName: PalletName,
  network: string,
) => Promise<any>;

export type BaseWalletConfig = {
  rpcUrl: string;
  loggingEnabled: boolean;
  provingFilePath: string;
  parametersFilePath: string;
  saveStorageStateToLocal: SaveStorageStateToLocal;
  getStorageStateFromLocal: GetStorageStateFromLocal;
};

export interface IBaseWallet {
  api: ApiPromise;
  wasm: any;
  loggingEnabled: boolean;
  fullParameters: any;
  multiProvingContext: any;
  saveStorageStateToLocal: SaveStorageStateToLocal;
  getStorageStateFromLocal: GetStorageStateFromLocal;
  walletIsBusy: boolean;
}

export interface IMantaPrivateWallet {
  palletName: PalletName;
  baseWallet: IBaseWallet;
  wasmWallet: Wallet;
  ledgerApi: any;
  initialSyncIsFinished: boolean;
  isBindAuthorizationContext: boolean;
  network: Network;

  initialSigner(): Promise<boolean>;
  setNetwork(network: Network): Promise<boolean>;
  loadUserSeedPhrase(seedPhrase: string): boolean;
  loadAuthorizationContext(seedPhrase: string): boolean;
  dropAuthorizationContext(): boolean;
  dropUserSeedPhrase(): boolean;
  initialWalletSync(): Promise<boolean>;
  walletSync(): Promise<boolean>;
  getZkAddress(): Promise<Address>;
  getZkBalance(assetId: BN): Promise<BN | null>;
  getMultiZkBalance(assetId: BN[]): Promise<BN[] | null>;
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
  multiSbtBuild(
    startingAssetId: BN,
    metadataList: string[],
  ): Promise<SignedMultiSbtTransaction | null>;
  resetState(): Promise<boolean>;
}

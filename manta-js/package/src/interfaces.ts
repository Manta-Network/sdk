import type BN from 'bn.js';
import type { ApiPromise } from '@polkadot/api';
import type { Wallet } from './wallet/crate/pkg/manta_wasm_wallet';
import type { SubmittableExtrinsic } from '@polkadot/api/types';

export type PalletName = 'mantaPay' | 'mantaSBT';

export type Network = 'Dolphin' | 'Calamari' | 'Manta';

export type Address = string;

export interface ILedgerApi {
  api: ApiPromise;
  palletName: PalletName;
  loggingEnabled: boolean;
  errorCallback: (err: Error) => void;

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
  network: Network,
  data: any,
) => Promise<boolean>;
export type GetStorageStateFromLocal = (
  palletName: PalletName,
  network: Network,
) => Promise<any>;

export type BaseWalletConfig = {
  apiEndpoint: string | string[];
  apiTimeout?: number;
  loggingEnabled: boolean;
  provingFilePath: string;
  parametersFilePath: string;
  saveStorageStateToLocal: SaveStorageStateToLocal;
  getStorageStateFromLocal: GetStorageStateFromLocal;
};

export type SbtInfo = {
  assetId: BN;
  amount?: BN;
  signature?: string;
  metadata?: string;
}

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
  loadUserSeedPhrase(seedPhrase: string): boolean;
  loadAuthorizationContext(seedPhrase: string): boolean;
  dropAuthorizationContext(): boolean;
  dropUserSeedPhrase(): boolean;
  initialWalletSync(): Promise<boolean>;
  initialNewAccountWalletSync(): Promise<boolean>;
  walletSync(): Promise<boolean>;
  getZkAddress(): Promise<Address>;
  getZkBalance(assetId: BN): Promise<BN | null>;
  getMultiZkBalance(assetId: BN[]): Promise<BN[] | null>;
  resetState(): Promise<boolean>;
}

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

export interface IMantaSbtWallet extends IPrivateWallet {
  multiSbtBuild(
    sbtInfoList: SbtInfo[],
  ): Promise<SignedMultiSbtTransaction | null>;
  getIdentityProof(asset: string, zkAddress: Address): Promise<string>;
}

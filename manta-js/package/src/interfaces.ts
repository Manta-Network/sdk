import type BN from 'bn.js';
import type { ApiPromise } from '@polkadot/api';
import type { Wallet } from './wallet/crate/pkg/manta_wasm_wallet';
import type { ApiOptions, SubmittableExtrinsic } from '@polkadot/api/types';

export type PalletName = 'mantaPay' | 'mantaSBT';

export type Network = 'Dolphin' | 'Calamari' | 'Manta';

export type PrivateTransactionType =
  | 'publicToPrivate'
  | 'privateToPrivate'
  | 'privateToPublic';

export type Address = string;

export interface ILedgerApi {
  api: ApiPromise;
  palletName: PalletName;
  loggingEnabled: boolean;

  initial_pull(checkpoint: any): any;
  pull(checkpoint: any): any;
}

export type LedgerSyncType = 'initial' | 'normal';

export type LedgerSyncProgress = {
  current: number;
  total: number;
  syncType: LedgerSyncType;
};

export type SignedTransaction = {
  posts: any;
  transactionData: any;
  transactions: SubmittableExtrinsic<'promise', any>[];
  txs: SubmittableExtrinsic<'promise', any>[];
};

export type Checkpoint = any;
export type TransactionPost = any;
export type TransactionData = any;

export type SignedMultiSbtPost = {
  transactionDatas: any[];
  posts: any[];
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
  partialApiOptions?: Partial<ApiOptions>;
};

export type SbtInfo = {
  assetId: BN;
  amount?: BN;
};

export type AuthContextType = {
  proof_authorization_key: Uint8Array;
};

export type UtxoAsset = {
  id: string;
  value: string;
};

export type UtxoIdentifier = {
  is_transparent: boolean;
  utxo_commitment_randomness: string;
};

export type UtxoInfo = {
  asset: UtxoAsset;
  identifier: UtxoIdentifier;
};

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
  updateApi(
    apiEndpoint: string | string[],
    apiTimeout?: number,
    partialApiOptions?: Partial<ApiOptions>,
  ): ApiPromise;
  isApiReady(): Promise<ApiPromise>;
  disconnectApi(): Promise<boolean>;
  wrapWalletIsBusy<T>(
    func: () => Promise<T>,
    errorFunc?: (ex: Error) => void,
  ): Promise<T>;
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
  getLedgerTotalCount(): Promise<number>;
  getLedgerCurrentCount(checkpoint: Checkpoint): number;
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
  getAllUtxoList(): Promise<UtxoInfo[]>;
  consolidateTransactionBuild(
    utxoList: UtxoInfo[],
  ): Promise<SignedTransaction | null>;
  estimateTransferPostsCount(
    type: PrivateTransactionType,
    assetId: BN,
    amount: BN,
    zkAddressOrPolkadotAddress?: Address,
  ): Promise<number>;
}

export interface IMantaSbtWallet extends IPrivateWallet {
  multiSbtPostBuild(sbtInfoList: SbtInfo[]): Promise<SignedMultiSbtPost | null>;
  getTransactionDatas(posts: TransactionPost[]): Promise<TransactionData[]>;
  getIdentityProof(
    virtualAsset: string,
    polkadotAddress: Address,
  ): Promise<any>;
}

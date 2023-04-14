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
};

export type SbtInfo = {
  assetId: BN;
  amount?: BN;
};

export type AuthContextType = {
  proof_authorization_key: Uint8Array;
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
  updateApi(apiEndpoint: string | string[], apiTimeout?: number): ApiPromise;
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
  multiSbtPostBuild(sbtInfoList: SbtInfo[]): Promise<SignedMultiSbtPost | null>;
  getIdentityProof(
    virtualAsset: string,
    polkadotAddress: Address,
  ): Promise<any>;
}

import { ApiPromise } from '@polkadot/api';
import { Wallet } from './wallet/crate/pkg';
import { Environment, Network } from './privateWallet';
import BN from 'bn.js';
import { SubmittableExtrinsic, Signer } from '@polkadot/api/types';

export type Version = string;
export type Address = string;

// Must be a uint8Array of length 32.
export type AssetId = Uint8Array;

export type InitApiResult = {
  api: ApiPromise
}

export type InitWasmResult = {
  wasm: any,
  wasmWallet: Wallet,
  wasmApi: any,
  parameters: any;
  provingContext: any;
}

export type SignedTransaction = {
  posts: any,
  transactions: SubmittableExtrinsic<'promise', any>[],
  txs: SubmittableExtrinsic<'promise', any>[]
}

export type RequestUserSeedPhrase = () => Promise<string | null>;
export type SaveStorageStateToLocal = (network: string, data: any) => Promise<boolean>;
export type GetStorageStateFromLocal = (network: string) => Promise<any>;

export type PrivateWalletConfig = {
  environment: Environment,
  network: Network,
  loggingEnabled?: boolean,
  maxReceiversPullSize?: number,
  maxSendersPullSize?: number,
  pullCallback?: any,
  errorCallback?: any,
  provingFilePath: string,
  parametersFilePath: string,
  requestUserSeedPhrase: RequestUserSeedPhrase,
  saveStorageStateToLocal: SaveStorageStateToLocal,
  getStorageStateFromLocal: GetStorageStateFromLocal,
}

export interface IMantaPrivateWallet {
  api: ApiPromise;
  wasm: any;
  wasmWallet: Wallet;
  network: Network;
  wasmApi: any;
  walletIsBusy: boolean;
  initialSyncIsFinished: boolean;
  loggingEnabled: boolean;
  parameters: any;

  loadUserSeedPhrase(initialSeedPhrase?: string):any;
  loadAuthorizationContext(initialSeedPhrase?: string):any;
  dropAuthorizationContext():any;
  dropUserSeedPhrase():any;
  convertZkAddressToJson(address: string): any
  getNetworks(): any;
  getZkAddress(): Promise<Address>;
  getAssetMetadata(assetId: BN): Promise<any>;
  initialWalletSync(): Promise<boolean>;
  walletSync(): Promise<boolean>;
  getZkBalance(assetId: BN): Promise<BN | null>;
  getMultiZkBalance(assetId: BN[]): Promise<BN[] | null>;
  toPrivateSend(assetId: BN, amount: BN, polkadotSigner:Signer, polkadotAddress:Address): Promise<void>;
  toPrivateBuild(assetId: BN, amount: BN, polkadotAddress:Address): Promise<SignedTransaction | null>;
  privateTransferSend(assetId: BN, amount: BN, toZkAddress: Address, polkadotSigner:Signer, polkadotAddress:Address): Promise<void>;
  privateTransferBuild(assetId: BN, amount: BN, toZkAddress: Address, polkadotAddress:Address): Promise<SignedTransaction | null>;
  toPublicSend(assetId: BN, amount: BN, polkadotSigner:Signer, polkadotAddress:Address): Promise<void>;
  toPublicBuild(assetId: BN, amount: BN, polkadotAddress:Address): Promise<SignedTransaction | null>;
  resetState(): Promise<boolean>;
}

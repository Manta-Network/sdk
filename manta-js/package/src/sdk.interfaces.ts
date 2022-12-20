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
  wasmApi: any
}

export type SignedTransaction = {
  posts: any,
  transactions: SubmittableExtrinsic<'promise', any>[],
  txs: SubmittableExtrinsic<'promise', any>[]
} 

export type PrivateWalletConfig = {
  environment: Environment,
  network: Network,
  loggingEnabled?: boolean,
  maxReceiversPullSize?: number,
  maxSendersPullSize?: number,
  pullCallback?: any,
  errorCallback?: any
}

export interface IMantaUtilities {
  getSignerVersion(): Promise<Version>;
  getPublicBalance(api:ApiPromise, assetId: BN, address:Address): Promise<any>;
  publicTransfer(api:ApiPromise, assetId: BN, amount: BN, destinationAddress: Address, senderAddress:Address, polkadotSigner:Signer): Promise<void>;
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

  convertPrivateAddressToJson(address: string): any
  getNetworks(): any;
  getZkAddress(): Promise<Address>;
  getAssetMetadata(assetId: BN): Promise<any>;
  initalWalletSync(): Promise<void>;
  walletSync(): Promise<void>;
  getPrivateBalance(assetId: BN): Promise<string>;
  toPrivateSend(assetId: BN, amount: BN, polkadotSigner:Signer, polkadotAddress:Address): Promise<void>;
  toPrivateBuild(assetId: BN, amount: BN, polkadotSigner:Signer, polkadotAddress:Address): Promise<SignedTransaction>;
  privateTransferSend(assetId: BN, amount: BN, toPrivateAddress: Address, polkadotSigner:Signer, polkadotAddress:Address): Promise<void>;
  privateTransferBuild(assetId: BN, amount: BN, toPrivateAddress: Address, polkadotSigner:Signer, polkadotAddress:Address): Promise<SignedTransaction>;
  toPublicSend(assetId: BN, amount: BN, polkadotSigner:Signer, polkadotAddress:Address): Promise<void>;
  toPublicBuild(assetId: BN, amount: BN, polkadotSigner:Signer, polkadotAddress:Address): Promise<SignedTransaction>;
}
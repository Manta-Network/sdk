import { ApiPromise } from '@polkadot/api';
import { Wallet } from 'manta-wasm-wallet';
import { Environment, Network } from './sdk';
import BN from 'bn.js';
import { SubmittableExtrinsic } from '@polkadot/api/types';

export type Version = string;
export type Address = string;

// Must be a uint8Array of length 32.
export type AssetId = Uint8Array;

export type InitApiResult = {
  api: ApiPromise,
  signer: string
}

export type InitWasmResult = {
  wasm: any,
  wasmWallet: Wallet,
  wasmApi: any
}

export type SignedTransaction = {
  posts: any,
  transactions: SubmittableExtrinsic<"promise", any>[],
  txs: SubmittableExtrinsic<"promise", any>[]
} 

export interface IMantaPrivateWallet {

  api: ApiPromise;
  signer: string;
  wasm: any;
  wasmWallet: Wallet;
  network: Network;
  environment: Environment;
  wasmApi: any;

  convertPrivateAddressToJson(address: string): any
  networks(): any;
  privateAddress(): Promise<Address>;
  initalWalletSync(): Promise<void>;
  walletSync(): Promise<void>;
  signerVersion(): Promise<Version>;
  assetMetaData(asset_id: BN): Promise<any>;
  privateBalance(asset_id: BN): Promise<string>;
  toPrivateSend(asset_id: BN, amount: BN): Promise<any>;
  toPrivateBuild(asset_id: BN, amount: BN): Promise<any>;
  privateTransferSend(asset_id: BN, amount: BN, address: Address): Promise<any>;
  privateTransferBuild(asset_id: BN, amount: BN, address: Address): Promise<any>;
  toPublicSend(asset_id: BN, amount: BN): Promise<any>;
  toPublicBuild(asset_id: BN, amount: BN): Promise<any>;
  publicTransfer(asset_id: BN, amount: BN, address: Address): Promise<any>
  publicBalance(asset_id: BN, address:string): Promise<any>;
}
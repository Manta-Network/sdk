import { ApiPromise } from '@polkadot/api';
import { Wallet } from 'manta-wasm-wallet';
import { Environment, Network } from './sdk';
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
  transactions: SubmittableExtrinsic<"promise", any>[],
  txs: SubmittableExtrinsic<"promise", any>[]
} 

export interface IMantaPrivateWallet {
  api: ApiPromise;
  wasm: any;
  wasmWallet: Wallet;
  network: Network;
  environment: Environment;
  wasmApi: any;
  walletIsBusy: boolean;
  initialSyncIsFinished: boolean;
  loggingEnabled: boolean;

  convertPrivateAddressToJson(address: string): any
  getNetworks(): any;
  getZkAddress(): Promise<Address>;
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
import { ApiPromise } from '@polkadot/api';
import { Wallet } from 'manta-wasm-wallet';

export type Version = string;
export type PrivateAddress = string;
export type AssetId = number;

export interface InitApiResult {
  api: ApiPromise,
  signer: string
}

export interface InitWasmResult {
  wasm: any,
  wasmWallet: Wallet
}

export interface IMantaSdk {

  api: ApiPromise,
  signer: string,
  wasm: any,
  wasmWallet: Wallet

  privateAddress(): Promise<PrivateAddress>;
  initalWalletSync(): Promise<void>;
  walletSync(): Promise<void>;
  signerVersion(): Promise<Version>;
  assetMetaData(asset_id: AssetId): Promise<any>;
  privateBalance(asset_id: AssetId): Promise<string>;
  toPrivatePost(asset_id: AssetId, amount: number): Promise<void>;
  toPrivateSign(asset_id: AssetId, amount: number): Promise<void>;
  privateTransfer(asset_id: AssetId, amount: number, address: PrivateAddress): Promise<void>;
  toPublic(asset_id: AssetId, amount: number): Promise<void>;
  toPrivateNFT(asset_id: number): Promise<void>;
  privateTransferNFT(asset_id: AssetId, address: PrivateAddress): Promise<void>;
  toPublicNFT(asset_id: number): Promise<void>;

}
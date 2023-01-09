import { ApiPromise } from '@polkadot/api';
import { Transaction, SBTWallet } from './wallet/crate/pkg/manta_wasm_wallet';
import {MantaPrivateWallet, Network, SIGNER_URL, DEFAULT_PULL_SIZE } from './privateWallet';
import {Address, PrivateWalletConfig, InitWasmResult, SignedTransaction} from './sdk.interfaces';
import Api, {ApiConfig} from './api/index';
import { Signer, SubmittableExtrinsic } from '@polkadot/api/types';
import BN from 'bn.js';

/// SbtMantaPrivateWallet class
export class SbtMantaPrivateWallet extends MantaPrivateWallet {
  wasmWallet: SBTWallet;

  constructor(api: ApiPromise, wasm: any, wasmWallet: SBTWallet, network: Network, wasmApi: any, loggingEnabled: boolean) {
    super(api, wasm, wasmWallet, network, wasmApi, loggingEnabled);
  }

  /// Initializes the MantaPrivateWallet class, for a corresponding environment and network.
  static async initSBT(config: PrivateWalletConfig): Promise<SbtMantaPrivateWallet> {
    const { api } = await SbtMantaPrivateWallet.initApi(config.environment, config.network, Boolean(config.loggingEnabled));
    const { wasm, wasmWallet, wasmApi } = await SbtMantaPrivateWallet.initSBTWasmSdk(api,config);
    return new SbtMantaPrivateWallet(api,wasm,wasmWallet,config.network,wasmApi,Boolean(config.loggingEnabled));
  }

  /// Private helper method for internal use to initialize the initialize manta-wasm-wallet for SBT.
  private static async initSBTWasmSdk(api: ApiPromise, config:PrivateWalletConfig): Promise<InitWasmResult> {
    const wasm = await import('./wallet/crate/pkg/manta_wasm_wallet');
    const wasmSigner = new wasm.Signer(SIGNER_URL);
    const wasmApiConfig = new ApiConfig(
      (config.maxReceiversPullSize ?? DEFAULT_PULL_SIZE), (config.maxSendersPullSize ?? DEFAULT_PULL_SIZE), config.pullCallback, config.errorCallback, Boolean(config.loggingEnabled)
    );
    const wasmApi = new Api(api,wasmApiConfig);
    const wasmLedger = new wasm.SBTPolkadotJsLedger(wasmApi);
    const wasmWallet = new wasm.SBTWallet(wasmLedger, wasmSigner);
    return {
      wasm,
      wasmWallet,
      wasmApi
    };
  }

  /// Signs the a given transaction returning posts, transactions and batches.
  /// assetMetaDataJson is optional, pass in null if transaction should not contain any.
  protected async signTransaction (assetMetadataJson: any, transaction: Transaction, network: Network): Promise<SignedTransaction | null> {
    try {
      let assetMetadata = null;
      if (assetMetadataJson) {
        assetMetadata = this.wasm.AssetMetadata.from_string(assetMetadataJson);
      }
      const networkType = this.wasm.Network.from_string(`"${network}"`);
      const posts = await this.wasmWallet.sign(transaction, assetMetadata, networkType);
      const transactions = [];
      for (let i = 0; i < posts.length; i++) {
        const convertedPost = this.transferPost(posts[i]);
          const transaction = await this.sbtPostToTransaction(convertedPost, this.api);
          transactions.push(transaction);
      }
      const txs = await this.transactionsToBatches(transactions, this.api);
      return {
        posts,
        transactions,
        txs
      };
    } catch (e) {
      console.error('Unable to sign transaction.',e);
      return null;
    }
  }

  /// Executes a "To Private" transaction for any fungible token.
  async mintSbt(assetId: BN, amount: BN, polkadotSigner:Signer, polkadotAddress: Address): Promise<void> {
    const signed = await this.toPrivateBuild(assetId,amount,polkadotSigner, polkadotAddress);
    // transaction rejected by signer
    if (signed === null) {
      return;
    }
    await this.sendTransaction(polkadotAddress,signed);
    this.log('Mint SBT transaction finished.');
  }

  private async sbtPostToTransaction(post: any, api: ApiPromise): Promise<SubmittableExtrinsic<'promise', any>> {
    const mintSBT = await api.tx.mantaSbt.toPrivate(post);

    return mintSBT
  }

}
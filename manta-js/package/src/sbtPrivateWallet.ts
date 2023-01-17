import { ApiPromise } from '@polkadot/api';
import { SBTWallet } from './wallet/crate/pkg/manta_wasm_wallet';
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

  /// Initializes the SbtMantaPrivateWallet class, for a corresponding environment and network.
  static async initSBT(config: PrivateWalletConfig): Promise<SbtMantaPrivateWallet> {
    const { api } = await SbtMantaPrivateWallet.initApi(config.environment, config.network, Boolean(config.loggingEnabled));
    const { wasm, wasmWallet, wasmApi } = await SbtMantaPrivateWallet.initSBTWasmSdk(api,config);
    return new SbtMantaPrivateWallet(api,wasm,wasmWallet,config.network,wasmApi,Boolean(config.loggingEnabled));
  }

  /// Private helper method for internal use to initialize manta-wasm-wallet for SBT.
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

  /// Reserve Sbt to whitelist to mint SBT
  async reserveSbt(polkadotSigner: Signer, polkadotAddress: Address): Promise<void> {
    await this.waitForWallet();
    this.walletIsBusy = true;
    await this.setPolkadotSigner(polkadotSigner, polkadotAddress);
    this.walletIsBusy = false;

    const reserveSbt = this.api.tx.mantaSbt.reserveSbt()

    try {
      await reserveSbt.signAndSend(polkadotAddress, (_status:any, _events:any) => { });
    } catch (error) {
      console.error('Transaction failed', error);
    }
    this.log('Reserve SBT transaction finished.');
  }

  /// Executes a "To Private" transaction for any fungible token.
  async mintSbt(assetId: BN, numberOfMints: number, polkadotSigner: Signer, polkadotAddress: Address, metadata: string[]): Promise<void> {
    const signed = await this.buildSbtBatch(polkadotSigner, polkadotAddress, assetId, numberOfMints, metadata);
    // transaction rejected by signer
    if (signed === null) {
      return;
    }
    try {
      await signed.signAndSend(polkadotAddress, (_status:any, _events:any) => { });
    } catch (error) {
      console.error('Transaction failed', error);
    }
    this.log('Mint SBT transaction finished.');
  }

  private async buildSbtBatch(polkadotSigner: Signer, polkadotAddress: Address, startingAssetId: BN, numberOfMints: number, metadata: string[]): Promise<SubmittableExtrinsic<"promise", any>> {
    if (numberOfMints != metadata.length) {
      console.error('Number of mints does not correspond to metadata');
      return null
    }

    try {
      await this.waitForWallet();
      this.walletIsBusy = true;
      await this.setPolkadotSigner(polkadotSigner, polkadotAddress);
      const amount = new BN("1"); // 1 nft

      const transactions = [];
      for (let i = 0; i < numberOfMints; i++ ) {
        const transactionUnsigned = await this.toPrivateBuildUnsigned(startingAssetId, amount);
        startingAssetId = startingAssetId.add(new BN("1"));

        const networkType = this.wasm.Network.from_string(`"${this.network}"`);
        const posts = await this.wasmWallet.sign(transactionUnsigned, null, networkType);
        for (let i = 0; i < posts.length; i++) {
          const convertedPost = this.transferPost(posts[i]);
          const transaction = await this.sbtPostToTransaction(convertedPost, this.api, metadata[i]);
          transactions.push(transaction);
        }
      }
      this.walletIsBusy = false;

      const batchTx = this.api.tx.utility.batchAll(transactions);
      return batchTx
    } catch {
      console.error('Unable to build mintSbt transaction');
      return null
    }
  }

  private async sbtPostToTransaction(post: any, api: ApiPromise, metadata: string): Promise<SubmittableExtrinsic<'promise', any> | null> {
    const mintSBT = api.tx.mantaSbt.toPrivate(post, metadata);

    return mintSBT
  }
}

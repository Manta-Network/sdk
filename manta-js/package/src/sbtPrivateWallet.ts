import { ApiPromise } from '@polkadot/api';
import { SBTWallet } from './wallet/crate/pkg/manta_wasm_wallet';
import {MantaPrivateWallet, Network, SIGNER_URL, DEFAULT_PULL_SIZE } from './privateWallet';
import {Address, PrivateWalletConfig, InitWasmResult, SignedTransaction} from './sdk.interfaces';
import Api, {ApiConfig} from './api/index';
import { Signer, SubmittableExtrinsic } from '@polkadot/api/types';
import BN from 'bn.js';

// Collection of  sbt is hardcoded to 0 in runtime
const COLLECTION_ID = new BN("0");

/// SbtMantaPrivateWallet class
export class SbtMantaPrivateWallet extends MantaPrivateWallet {
  wasmWallet: SBTWallet;

  constructor(api: ApiPromise, wasm: any, wasmWallet: SBTWallet, network: Network, wasmApi: any, loggingEnabled: boolean) {
    super(api, wasm, wasmWallet, network, wasmApi, loggingEnabled, true);
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

  /// Gets metadata of SBT, corresponds to image
  async getSBTMetadata(assetId: BN): Promise<string | null> {
    const metadata = await this.api.query.uniques.instanceMetadataOf(COLLECTION_ID, assetId);
    if (metadata.isNone) {
      return null
    } else {
      const data = metadata.unwrap().data.toString();
      return hex2a(data)
    }
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

  /// Executes a "To Private" transaction for SBT.
  async mintSbt(assetId: BN, numberOfMints: number, polkadotSigner: Signer, polkadotAddress: Address, metadata: string[]) {
    const {batchTx, transaction_datas} = await this.buildSbtBatch(polkadotSigner, polkadotAddress, assetId, numberOfMints, metadata);
    // transaction rejected by signer
    if (batchTx === null) {
      return;
    }
    try {
      await batchTx.signAndSend(polkadotAddress, (_status:any, _events:any) => { });
      return transaction_datas;
    } catch (error) {
      console.error('Transaction failed', error);
    }
    this.log('Mint SBT transaction finished.');
  }

  toHexString(byteArray: Uint8Array) {
    return byteArray.reduce((output, elem) => 
      (output + ('0' + elem.toString(16)).slice(-2)),
      '');
  }

  private async buildSbtBatch(polkadotSigner: Signer, polkadotAddress: Address, startingAssetId: BN, numberOfMints: number, metadata: string[]) {
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
      const transaction_datas = [];
      for (let i = 0; i < numberOfMints; i++ ) {
        const transactionUnsigned = await this.toPrivateBuildUnsigned(startingAssetId, amount);
        startingAssetId = startingAssetId.add(new BN("1"));

        const networkType = this.wasm.Network.from_string(`"${this.network}"`);
        const posts_txs = await this.wasmWallet.sign_with_transaction_data(transactionUnsigned, null, networkType);
        const transaction_data = posts_txs[1];
        console.log("transaction_data:" + JSON.stringify(transaction_data));
        const to_private_tx_data = transaction_data[0]["ToPrivate"][0]["utxo_commitment_randomness"];
        console.log("tx_data of private:" + JSON.stringify(to_private_tx_data));
        transaction_datas.push(this.toHexString(to_private_tx_data));
        const posts = posts_txs[0];
        for (let i = 0; i < posts.length; i++) {
          const convertedPost = this.transferPost(posts[i]);
          const transaction = await this.sbtPostToTransaction(convertedPost, this.api, metadata[i]);
          transactions.push(transaction);
        }
      }
      this.walletIsBusy = false;

      const batchTx = this.api.tx.utility.batchAll(transactions);
      return {
        batchTx,
        transaction_datas
      }
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

// convert hex to ascii string starts with 0x
function hex2a(hex: string): string {
    var str = '';
    for (var i = 2; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

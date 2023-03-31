import { ApiPromise } from '@polkadot/api';
import { SBTWallet } from './wallet/crate/pkg/manta_wasm_wallet';
import {MantaPrivateWallet, Network, SIGNER_URL, DEFAULT_PULL_SIZE } from './privateWallet';
import {Address, PrivateWalletConfig, InitWasmResult} from './sdk.interfaces';
import Api, {ApiConfig} from './api/index';
import { Signer, SubmittableExtrinsic } from '@polkadot/api/types';
import BN from 'bn.js';
import { decodeAddress } from '@polkadot/util-crypto';

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

  /// Gets metadata of SBT, corresponds to image
  async getSBTMetadata(assetId: BN): Promise<string | null> {
    this.checkApiIsReady();
    const metadata: any = await this.api.query.mantaSbt.sbtMetadata(assetId);
    if (metadata.isNone) {
      return null
    } else {
      // will not fail due to check above
      const data = metadata.unwrap();

      const asciiHex = data.toString()
      return hex2a(asciiHex)
    }
  }

  /// Builds reserveSbt tx to whitelist to mint SBT
  async buildReserveSbt(polkadotSigner: Signer, polkadotAddress: Address): Promise<SubmittableExtrinsic<"promise", any>> {
    this.checkApiIsReady();
    await this.waitForWallet();
    this.walletIsBusy = true;
    await this.setPolkadotSigner(polkadotSigner, polkadotAddress);
    this.walletIsBusy = false;

    return this.api.tx.mantaSbt.reserveSbt()
  }

  toHexString(byteArray: Uint8Array) {
    return byteArray.reduce((output, elem) =>
      (output + ('0' + elem.toString(16)).slice(-2)),
      '');
  }

  async buildSbtBatch(polkadotSigner: Signer, polkadotAddress: Address, startingAssetId: BN, numberOfMints: number, metadata: string[]): Promise<{batchTx: SubmittableExtrinsic<"promise", any>, transactionDatas: string[]} | null> {
    if (numberOfMints != metadata.length) {
      console.error('Number of mints does not correspond to metadata');
      return null
    }
    this.checkApiIsReady();

    try {
      await this.waitForWallet();
      this.walletIsBusy = true;
      await this.setPolkadotSigner(polkadotSigner, polkadotAddress);
      const amount = new BN("1"); // 1 nft

      const transactions = [];
      const transactionDatas = [];
      for (let i = 0; i < numberOfMints; i++ ) {
        const transactionUnsigned = await this.toPrivateBuildUnsigned(startingAssetId, amount);
        startingAssetId = startingAssetId.add(new BN("1"));

        const networkType = this.wasm.Network.from_string(`"${this.network}"`);
        const posts_txs = await this.wasmWallet.sign(transactionUnsigned, null, networkType);
        const posts = posts_txs[0];
        for (let j = 0; j < posts.length; j++) {
          const convertedPost = this.transferPost(posts[j]);
          const transaction = await this.sbtPostToTransaction(convertedPost, this.api, metadata[i]);
          transactions.push(transaction);
        }
        transactionDatas.push(posts_txs[1]);
      }
      this.walletIsBusy = false;

      const batchTx = this.api.tx.utility.batchAll(transactions);
      return {
        batchTx,
        transactionDatas
      }
    } catch {
      console.error('Unable to build mintSbt transaction');
      return null
    }
  }

  async buildSbtPost(assetId: BN) {
    const amount = new BN("1");
    await this.waitForWallet();
    this.walletIsBusy = true;
    const transactionUnsigned = await this.toPrivateBuildUnsigned(assetId, amount);

    const networkType = this.wasm.Network.from_string(`"${this.network}"`);
    const posts_txs = await this.wasmWallet.sign(transactionUnsigned, null, networkType);
    const posts = posts_txs[0];
    const convertedPost = this.transferPost(posts[0]);

    this.walletIsBusy = false;
    return convertedPost
  }

  private async sbtPostToTransaction(post: any, api: ApiPromise, metadata: string): Promise<SubmittableExtrinsic<'promise', any> | null> {
    const mintSBT = api.tx.mantaSbt.toPrivate(post, metadata);

    return mintSBT
  }

  /// Produces Identity Proof from randomness in `virtualAsset`
  async getIdentityProof(virtualAsset: string, account: Address) {
    try {
      await this.waitForWallet();
      this.walletIsBusy = true;
      const networkType = this.wasm.Network.from_string(`"${this.network}"`);
      const asset = this.wasm.VirtualAsset.from_string(virtualAsset);
      // const address_decoded = `[${decodeAddress(account)}]`;
      const account_id = this.wasm.AccountId.from_string(`[${decodeAddress(account)}]`);
      const identityProof = this.wasmWallet.identity_proof(asset, account_id, networkType);
      this.walletIsBusy = false;
      return identityProof;
    } catch (e) {
      this.walletIsBusy = false;
      console.error('Failed to build Identity Proof.',e);
    }
  }
}

// convert hex to ascii string starts with 0x
function hex2a(hex: string): string {
    var str = '';
    for (var i = 2; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

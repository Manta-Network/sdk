import { ApiPromise } from '@polkadot/api';
import { Wallet } from './wallet/crate/pkg/manta_wasm_wallet';
import {MantaPrivateWallet, Network } from './privateWallet';
import {Address, PrivateWalletConfig} from './sdk.interfaces';
import { Signer, SubmittableExtrinsic } from '@polkadot/api/types';
import BN from 'bn.js';

/// SbtMantaPrivateWallet class
export class SbtMantaPrivateWallet extends MantaPrivateWallet {
  constructor(api: ApiPromise, wasm: any, wasmWallet: Wallet, network: Network, wasmApi: any, loggingEnabled: boolean) {
    super(api, wasm, wasmWallet, network, wasmApi, loggingEnabled, true);
  }

  /// Initializes the SbtMantaPrivateWallet class, for a corresponding environment and network.
  static async initSBT(config: PrivateWalletConfig): Promise<SbtMantaPrivateWallet> {
    const { api } = await SbtMantaPrivateWallet.initApi(config.environment, config.network, Boolean(config.loggingEnabled));
    const { wasm, wasmWallet, wasmApi } = await SbtMantaPrivateWallet.initWasmSdk(api,config);
    return new SbtMantaPrivateWallet(api,wasm,wasmWallet,config.network,wasmApi,Boolean(config.loggingEnabled));
  }

  /// Gets metadata of SBT, corresponds to image
  async getSBTMetadata(assetId: BN): Promise<string | null> {
    const metadata: any = await this.api.query.assetManager.assetIdMetadata(assetId);
    if (metadata.isNone) {
      return null
    } else {
      // will not fail due to check above
      const data = metadata.unwrap();

      if (data.isSbt) {
        const asciiHex = data.asSbt.toString()
        return hex2a(asciiHex)
      } else {
        return null;
      }
    }
  }

  /// Builds reserveSbt tx to whitelist to mint SBT
  async buildReserveSbt(polkadotSigner: Signer, polkadotAddress: Address): Promise<SubmittableExtrinsic<"promise", any>> {
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
        const posts_txs = await this.wasmWallet.sign_with_transaction_data(transactionUnsigned, null, networkType);
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

  private async sbtPostToTransaction(post: any, api: ApiPromise, metadata: string): Promise<SubmittableExtrinsic<'promise', any> | null> {
    const mintSBT = api.tx.mantaSbt.toPrivate(post, metadata);

    return mintSBT
  }

  /// Produces Identity Proof from randomness in `virtualAsset`
  async getIdentityProof(virtualAsset: string) {
    try {
      await this.waitForWallet();
      this.walletIsBusy = true;
      const networkType = this.wasm.Network.from_string(`"${this.network}"`);
      const asset = this.wasm.VirtualAsset.from_string(virtualAsset);
      const identityProof = this.wasmWallet.identity_proof(asset, networkType);
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

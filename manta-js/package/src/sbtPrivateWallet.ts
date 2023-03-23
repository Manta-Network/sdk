import { ApiPromise } from '@polkadot/api';
import { SbtWallet } from './wallet/crate/pkg/manta_wasm_wallet';
import {MantaPrivateWallet, Network, PayProvingNames, PayParameterNames } from './privateWallet';
import {Address, PrivateWalletConfig, InitWasmResult, RequestUserSeedPhrase, SaveStorageStateToLocal, GetStorageStateFromLocal} from './sdk.interfaces';
import Api, {ApiConfig} from './api/index';
import { Signer, SubmittableExtrinsic } from '@polkadot/api/types';
import BN from 'bn.js';
import config from './manta-config.json';
import * as mantaWasm from './wallet/crate/pkg/manta_wasm_wallet';

/// SbtMantaPrivateWallet class
export class SbtMantaPrivateWallet extends MantaPrivateWallet {
  wasmWallet: SbtWallet;

  constructor(
    api: ApiPromise,
    wasm: any,
    wasmWallet: SbtWallet,
    network: Network,
    wasmApi: any,
    loggingEnabled: boolean,
    parameters: any,
    provingContext: any,
    requestUserSeedPhrase: RequestUserSeedPhrase,
    saveStorageStateToLocal: SaveStorageStateToLocal,
    getStorageStateFromLocal: GetStorageStateFromLocal,
  ) {
    super(api, wasm, wasmWallet, network, wasmApi, loggingEnabled, parameters, provingContext, requestUserSeedPhrase, saveStorageStateToLocal, getStorageStateFromLocal)
  }

  /// Initializes the MantaPrivateWallet class, for a corresponding environment and network.
  static async initSbt(config: PrivateWalletConfig): Promise<MantaPrivateWallet> {
    const { api } = await MantaPrivateWallet.initApi(
      config.environment,
      config.network,
      Boolean(config.loggingEnabled)
    );
    const { wasm, wasmWallet, wasmApi, parameters, provingContext } =
      await SbtMantaPrivateWallet.initSbtWasmSdk(api, config);
    return new MantaPrivateWallet(
      api,
      wasm,
      wasmWallet,
      config.network,
      wasmApi,
      Boolean(config.loggingEnabled),
      parameters,
      provingContext,
      config.requestUserSeedPhrase,
      config.saveStorageStateToLocal,
      config.getStorageStateFromLocal,
    );
  }

  /// Private helper method for internal use to initialize the initialize manta-wasm-wallet.
  static async initSbtWasmSdk(
    api: ApiPromise,
    priConfig: PrivateWalletConfig
  ): Promise<InitWasmResult> {

    const wasm = mantaWasm; // await import('./wallet/crate/pkg/manta_wasm_wallet');
    wasm.init_panic_hook();

    if (priConfig.loggingEnabled) {
      console.log(`Start download files: ${performance.now()}`);
    }
    const provingFileList = await MantaPrivateWallet.fetchFiles(priConfig.provingFilePath, PayProvingNames);
    const parameterFileList = await MantaPrivateWallet.fetchFiles(priConfig.parametersFilePath, PayParameterNames);
    if (priConfig.loggingEnabled) {
      console.log(`Download file successful: ${performance.now()}`);
    }

    const multiProvingContext = new wasm.RawMultiProvingContext(...(provingFileList as [Uint8Array, Uint8Array, Uint8Array]));
    const fullParameters = new wasm.RawFullParameters(...(parameterFileList as [Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array]));
    const storageData = await priConfig.getStorageStateFromLocal (`${priConfig.network}`);
    if (priConfig.loggingEnabled) {
      console.log(`Start initial signer: ${performance.now()}`);
    }
    const wasmSigner = new wasm.Signer(fullParameters, multiProvingContext, storageData);
    if (priConfig.loggingEnabled) {
      console.log(`Initial signer successful: ${performance.now()}`);
    }

    const wasmWallet = new wasm.Wallet();
    const wasmApiConfig = new ApiConfig(
      priConfig.maxReceiversPullSize ?? config.DEFAULT_PULL_SIZE,
      priConfig.maxSendersPullSize ?? config.DEFAULT_PULL_SIZE,
      priConfig.pullCallback,
      priConfig.errorCallback,
      Boolean(priConfig.loggingEnabled)
    );

    const wasmApi = new Api(api, wasmApiConfig);
    const wasmLedger = new wasm.PolkadotJsLedger(wasmApi);
    wasmWallet.set_network(
      wasmLedger,
      wasmSigner,
      wasm.Network.from_string(`"${priConfig.network}"`)
    );
    return {
      wasm,
      wasmWallet,
      wasmApi,
      parameters: fullParameters,
      provingContext: multiProvingContext,
    };
  }

  /// Gets metadata of SBT, corresponds to image
  async getSBTMetadata(assetId: BN): Promise<string | null> {
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
    await this.waitForWallet();
    this.walletIsBusy = true;
    await this.setPolkadotSigner(polkadotSigner);
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
      await this.setPolkadotSigner(polkadotSigner);
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
}

// convert hex to ascii string starts with 0x
function hex2a(hex: string): string {
    var str = '';
    for (var i = 2; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

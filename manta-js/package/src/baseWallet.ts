import { ApiPromise, WsProvider } from '@polkadot/api';
import * as mantaWasm from './wallet/crate/pkg/manta_wasm_wallet';
import type {
  SaveStorageStateToLocal,
  GetStorageStateFromLocal,
  BaseWalletConfig,
  IBaseWallet,
} from './sdk.interfaces';
import { PAY_PARAMETER_NAMES, PAY_PROVING_NAMES } from './constants';
import mantaConfig from './rpcConfig.json';

export class BaseWallet implements IBaseWallet {
  api: ApiPromise;
  wasm: any;
  loggingEnabled: boolean;
  fullParameters: any;
  multiProvingContext: any;
  saveStorageStateToLocal: SaveStorageStateToLocal;
  getStorageStateFromLocal: GetStorageStateFromLocal;
  walletIsBusy = false;

  constructor(
    api: ApiPromise,
    wasm: any,
    fullParameters: any,
    multiProvingContext: any,
    saveStorageStateToLocal: SaveStorageStateToLocal,
    getStorageStateFromLocal: GetStorageStateFromLocal,
    loggingEnabled: boolean,
  ) {
    this.api = api;
    this.wasm = wasm;
    this.fullParameters = fullParameters;
    this.multiProvingContext = multiProvingContext;
    this.saveStorageStateToLocal = saveStorageStateToLocal;
    this.getStorageStateFromLocal = getStorageStateFromLocal;
    this.loggingEnabled = loggingEnabled;
  }

  private static async initApi(
    rpcUrl: string,
    loggingEnabled: boolean,
  ): Promise<ApiPromise> {
    const provider = new WsProvider(rpcUrl);
    const api = await ApiPromise.create({
      provider,
      types: mantaConfig.TYPES,
      rpc: mantaConfig.RPC,
    });
    if (loggingEnabled) {
      Promise.all([
        api.rpc.system.chain(),
        api.rpc.system.name(),
        api.rpc.system.version(),
      ]).then(([chain, nodeName, nodeVersion]) => {
        console.log(
          `[INFO]: MantaPrivateWallet is connected to chain ${chain} using ${nodeName} v${nodeVersion}`,
        );
      });
    }
    return api;
  }

  private static async fetchFiles(
    filePrefix: string,
    fileNames: string[],
  ): Promise<Uint8Array[] | null> {
    const fileList = await Promise.all(
      fileNames.map((name) => BaseWallet.fetchFile(`${filePrefix}/${name}`)),
    );
    return fileList;
  }

  private static async fetchFile(url: string): Promise<Uint8Array | null> {
    try {
      const responseData = await fetch(url);
      const result = await responseData.blob();
      const reader = new FileReader();
      return new Promise((resolve) => {
        try {
          reader.addEventListener('load', () => {
            resolve(new Uint8Array(reader.result as ArrayBuffer));
          });
          reader.addEventListener('error', () => {
            resolve(null);
          });
          // Read the contents of the specified Blob or File
          reader.readAsArrayBuffer(result);
        } catch (ex) {
          resolve(null);
        }
      });
      // return result;
    } catch (ex) {
      console.error(`fetch ${url}, failed`, ex);
    }
    return null;
  }

  static async init(config: BaseWalletConfig) {
    const loggingEnabled = Boolean(config.loggingEnabled);
    const api = await BaseWallet.initApi(config.rpcUrl, loggingEnabled);
    if (loggingEnabled) {
      mantaWasm.init_panic_hook();
    }
    if (loggingEnabled) {
      console.log(`Start download files: ${performance.now()}`);
    }
    const provingFileList = await BaseWallet.fetchFiles(
      config.provingFilePath,
      PAY_PROVING_NAMES,
    );
    const parameterFileList = await BaseWallet.fetchFiles(
      config.parametersFilePath,
      PAY_PARAMETER_NAMES,
    );
    if (loggingEnabled) {
      console.log(`Download file successful: ${performance.now()}`);
    }

    const multiProvingContext = new mantaWasm.RawMultiProvingContext(
      ...(provingFileList as [Uint8Array, Uint8Array, Uint8Array]),
    );
    const fullParameters = new mantaWasm.RawFullParameters(
      ...(parameterFileList as [
        Uint8Array,
        Uint8Array,
        Uint8Array,
        Uint8Array,
        Uint8Array,
        Uint8Array,
        Uint8Array,
        Uint8Array,
        Uint8Array,
        Uint8Array,
        Uint8Array,
      ]),
    );
    return new BaseWallet(
      api,
      mantaWasm,
      fullParameters,
      multiProvingContext,
      config.saveStorageStateToLocal,
      config.getStorageStateFromLocal,
      loggingEnabled,
    );
  }
}

import { ApiPromise, WsProvider } from '@polkadot/api';
import * as mantaWasm from './wallet/crate/pkg/manta_wasm_wallet';
import type {
  SaveStorageStateToLocal,
  GetStorageStateFromLocal,
  BaseWalletConfig,
  IBaseWallet,
} from './interfaces';
import { PAY_PARAMETER_NAMES, PAY_PROVING_NAMES } from './constants';
import mantaConfig from './config.json';
import { log } from './utils';

export default class BaseWallet implements IBaseWallet {
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

  protected static log(
    loggingEnabled: boolean,
    message: string,
    name = 'BaseWallet',
  ) {
    log(loggingEnabled, message, name);
  }

  log(message: string, name: string) {
    BaseWallet.log(this.loggingEnabled, message, name);
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
        BaseWallet.log(
          loggingEnabled,
          `Wallet is connected to chain ${chain} using ${nodeName} v${nodeVersion}`,
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
      console.error(`[BaseWallet]: Fetch ${url}, failed`, ex);
    }
    return null;
  }

  static async init(config: BaseWalletConfig) {
    const loggingEnabled = Boolean(config.loggingEnabled);
    BaseWallet.log(loggingEnabled, 'Initial api');

    const api = await BaseWallet.initApi(config.rpcUrl, loggingEnabled);
    if (loggingEnabled) {
      mantaWasm.init_panic_hook();
    }
    BaseWallet.log(loggingEnabled, 'Start download');
    const provingFileList = await BaseWallet.fetchFiles(
      config.provingFilePath,
      PAY_PROVING_NAMES,
    );
    const parameterFileList = await BaseWallet.fetchFiles(
      config.parametersFilePath,
      PAY_PARAMETER_NAMES,
    );
    BaseWallet.log(loggingEnabled, 'Download successful');

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

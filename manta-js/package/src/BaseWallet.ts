import { ApiPromise, HttpProvider, WsProvider } from '@polkadot/api';
import * as mantaWasm from './wallet/crate/pkg/manta_wasm_wallet';
import type {
  SaveStorageStateToLocal,
  GetStorageStateFromLocal,
  BaseWalletConfig,
  IBaseWallet,
  PalletName,
} from './interfaces';
import { PAY_PARAMETER_NAMES, PAY_PROVING_NAMES } from './constants';
import mantaConfig from './config.json';
import { fetchFiles, log } from './utils';

export default class BaseWallet implements IBaseWallet {
  api: ApiPromise;
  apiEndpoint: string | string[];
  apiTimeout: number;
  wasm: any;
  loggingEnabled: boolean;
  fullParameters: any;
  multiProvingContext: any;
  saveStorageStateToLocal: SaveStorageStateToLocal;
  getStorageStateFromLocal: GetStorageStateFromLocal;
  walletIsBusy = false;
  isHttpProvider = false;

  static onWasmCalledJsErrorCallback: (
    err: Error,
    palletName: PalletName,
  ) => void;

  constructor(
    wasm: any,
    apiEndpoint: string | string[],
    fullParameters: any,
    multiProvingContext: any,
    saveStorageStateToLocal: SaveStorageStateToLocal,
    getStorageStateFromLocal: GetStorageStateFromLocal,
    loggingEnabled: boolean,
    apiTimeout?: number,
  ) {
    this.wasm = wasm;
    this.fullParameters = fullParameters;
    this.multiProvingContext = multiProvingContext;
    this.saveStorageStateToLocal = saveStorageStateToLocal;
    this.getStorageStateFromLocal = getStorageStateFromLocal;
    this.loggingEnabled = loggingEnabled;

    this.updateApi(apiEndpoint, apiTimeout);
  }

  protected static log(
    loggingEnabled: boolean,
    message: string,
    name = 'BaseWallet',
  ) {
    log(loggingEnabled, message, name);
  }

  log(message: string, name?: string) {
    BaseWallet.log(this.loggingEnabled, message, name);
  }

  private getApiProvider(apiEndpoint: string | string[], apiTimeout: number) {
    const isArray = apiEndpoint instanceof Array;
    this.isHttpProvider = (isArray ? apiEndpoint[0] : apiEndpoint).startsWith(
      'http',
    );
    if (this.isHttpProvider) {
      const endPoint = isArray
        ? apiEndpoint[(Math.random() * apiEndpoint.length) | 0]
        : apiEndpoint;
      return new HttpProvider(endPoint);
    } else {
      return new WsProvider(this.apiEndpoint, 2500, {}, apiTimeout);
    }
  }

  updateApi(apiEndpoint: string | string[], apiTimeout?: number) {
    this.log('Initial api');

    this.apiEndpoint = apiEndpoint;
    this.apiTimeout = apiTimeout || 60 * 1000;

    this.api = new ApiPromise({
      provider: this.getApiProvider(apiEndpoint, apiTimeout),
      types: mantaConfig.TYPES,
      rpc: mantaConfig.RPC,
    });

    if (this.loggingEnabled) {
      const queryChainInfo = () => {
        Promise.all([
          this.api.rpc.system.chain(),
          this.api.rpc.system.name(),
          this.api.rpc.system.version(),
        ]).then(([chain, nodeName, nodeVersion]) => {
          this.log(
            `Wallet is connected to chain ${chain} using ${nodeName} v${nodeVersion}, isHttpProvider: ${this.isHttpProvider}`,
          );
        });
      };
      if (this.isHttpProvider) {
        this.api.isReady.then(queryChainInfo);
      } else {
        this.api.on('connected', queryChainInfo);
      }
    }
    return this.api;
  }

  async disconnectApi() {
    if (!this.isHttpProvider) {
      await this.api.disconnect();
    }
    return true;
  }

  static async init(config: BaseWalletConfig) {
    const loggingEnabled = Boolean(config.loggingEnabled);
    if (loggingEnabled) {
      mantaWasm.init_panic_hook();
    }
    BaseWallet.log(loggingEnabled, 'Start download');
    const provingFileList = await fetchFiles(
      config.provingFilePath,
      PAY_PROVING_NAMES,
    );
    const parameterFileList = await fetchFiles(
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
      mantaWasm,
      config.apiEndpoint,
      fullParameters,
      multiProvingContext,
      config.saveStorageStateToLocal,
      config.getStorageStateFromLocal,
      loggingEnabled,
      config.apiTimeout,
    );
  }
}

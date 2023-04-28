import { ApiPromise, HttpProvider, WsProvider } from '@polkadot/api';
import * as mantaWasm from './wallet/crate/pkg/manta_wasm_wallet';
import type {
  SaveStorageStateToLocal,
  GetStorageStateFromLocal,
  BaseWalletConfig,
  IBaseWallet,
} from './interfaces';
import { PAY_PARAMETER_NAMES, PAY_PROVING_NAMES } from './constants';
import mantaConfig from './config.json';
import { fetchFiles, log, wrapWasmError } from './utils';
import TaskSchedule, { TaskTimeoutError } from './utils/TaskSchedule';

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
  taskSchedule: TaskSchedule;

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

    this.taskSchedule = new TaskSchedule();

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

    return this.api;
  }

  async isApiReady() {
    if (!this.isHttpProvider) {
      return this.api.isReady;
    }

    // see detail https://github.com/polkadot-js/api/blob/master/packages/api/src/base/Init.ts#L413
    // HttpProvider has no retry logic, so it is necessary to resend the meta information request
    // to ensure that the api initialization is successful

    // At present, this solution is only a temporary solution,
    // and this problem will be solved by submitting pr to polkadot/api later

    // @ts-ignore
    if (this.api._isReady) {
      return this.api;
    }

    // @ts-ignore
    const metaData = await this.api._loadMeta();
    if (!metaData) {
      throw new Error('Metadata initialization failed');
    }
    // @ts-ignore
    this.api._isReady = true;

    // @ts-ignore
    this.api.emit('ready', this.api);
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

  async wrapWalletIsBusy<T>(
    func: () => Promise<T>,
    errorFunc?: (ex: Error) => void,
  ) {
    let isTaskTimeoutError = false;
    try {
      await this.taskSchedule.wait();
      this.walletIsBusy = true;
      const result = await func();
      return result;
    } catch (ex) {
      isTaskTimeoutError = ex instanceof TaskTimeoutError;
      const wrapError = wrapWasmError(ex);
      if (typeof errorFunc === 'function') {
        errorFunc(wrapError);
      }
      throw wrapError;
    } finally {
      if (!isTaskTimeoutError) {
        this.walletIsBusy = false;
        setTimeout(() => {
          this.taskSchedule.next();
        }, 0);
      }
    }
  }
}

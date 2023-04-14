import { ApiPromise, WsProvider } from '@polkadot/api';
import * as mantaWasm from './wallet/crate/pkg/manta_wasm_wallet';
import type {
  SaveStorageStateToLocal,
  GetStorageStateFromLocal,
  BaseWalletConfig,
  IBaseWallet,
  PalletName,
} from './interfaces';
import {
  CHECK_WALLET_BUSY_TIMEOUT,
  EVENT_NAME_WALLET_BUSY,
  PAY_PARAMETER_NAMES,
  PAY_PROVING_NAMES,
} from './constants';
import mantaConfig from './config.json';
import { fetchFiles, getUUID, log, wrapWasmError } from './utils';
import SafeEventEmitter from '@metamask/safe-event-emitter';

export default class BaseWallet
  extends SafeEventEmitter
  implements IBaseWallet
{
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
  currentSubEventKey = '';

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
    super();

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

  updateApi(apiEndpoint: string | string[], apiTimeout?: number) {
    this.log('Initial api');

    this.apiEndpoint = apiEndpoint;
    this.apiTimeout = apiTimeout || 60 * 1000;

    this.api = new ApiPromise({
      provider: new WsProvider(this.apiEndpoint, 2500, {}, this.apiTimeout),
      types: mantaConfig.TYPES,
      rpc: mantaConfig.RPC,
    });

    if (this.loggingEnabled) {
      this.api.on('connected', () => {
        Promise.all([
          this.api.rpc.system.chain(),
          this.api.rpc.system.name(),
          this.api.rpc.system.version(),
        ]).then(([chain, nodeName, nodeVersion]) => {
          this.log(
            `Wallet is connected to chain ${chain} using ${nodeName} v${nodeVersion}`,
          );
        });
      });
    }
    return this.api;
  }

  async disconnectApi() {
    await this.api.disconnect();
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

  private get currentEventKey() {
    return `${EVENT_NAME_WALLET_BUSY}_${this.currentSubEventKey}`;
  }

  private async waitStateCompleteOrTimeout(
    action: () => boolean,
    subKey: string,
    timeout = CHECK_WALLET_BUSY_TIMEOUT,
  ) {
    return new Promise((resolve) => {
      if (action()) {
        console.log('start resolver');
        resolve(true);
      } else {
        let timerId = 0;
        const listener = () => {
          console.log('resolve');
          clearTimeout(timerId);
          resolve(true);
        };
        this.once(subKey, listener);
        timerId = Number(
          setTimeout(() => {
            this.removeListener(subKey, listener);
            resolve(false);
          }, timeout * 1000),
        );
      }
    });
  }

  // WASM wallet doesn't allow you to call two methods at once, so before
  // calling methods it is necessary to wait for a pending call to finish.
  protected async waitForWallet(): Promise<void> {
    const result = await this.waitStateCompleteOrTimeout(() => {
      return !this.walletIsBusy;
    }, this.currentEventKey);

    if (!result) {
      throw new Error('Check wallet busy timeout');
    }
  }

  async wrapWalletIsBusy<T>(
    func: () => Promise<T>,
    errorFunc?: (ex: Error) => void,
  ) {
    try {
      await this.waitForWallet();
      this.currentSubEventKey = getUUID();
      this.walletIsBusy = true;
      const result = await func();
      this.walletIsBusy = false;
      this.emit(this.currentEventKey);
      return result;
    } catch (ex) {
      this.walletIsBusy = false;
      this.emit(this.currentEventKey);
      const wrapError = wrapWasmError(ex);
      if (typeof errorFunc === 'function') {
        errorFunc(wrapError);
      }
      throw wrapError;
    }
  }
}

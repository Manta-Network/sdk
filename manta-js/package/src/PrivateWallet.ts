import BN from 'bn.js';
import { base58Encode } from '@polkadot/util-crypto';
import type { Wallet as WasmWallet } from './wallet/crate/pkg/manta_wasm_wallet';
import type {
  Address,
  IPrivateWallet,
  IBaseWallet,
  ILedgerApi,
  PalletName,
  Network,
  AuthContextType,
  Checkpoint,
} from './interfaces';
import LedgerApi from './ledger-api';
import { u8aToBn } from '@polkadot/util';
import { getLedgerSyncedCount } from './utils';

export default class PrivateWallet implements IPrivateWallet {
  palletName: PalletName;
  baseWallet: IBaseWallet;
  wasmWallet: WasmWallet;
  ledgerApi: ILedgerApi;
  network: Network;

  initialSyncIsFinished = false;
  isBindAuthorizationContext = false;

  constructor(
    palletName: PalletName,
    network: Network,
    baseWallet: IBaseWallet,
    wasmWallet: WasmWallet,
    ledgerApi: ILedgerApi,
  ) {
    this.palletName = palletName;
    this.network = network;
    this.baseWallet = baseWallet;
    this.wasmWallet = wasmWallet;
    this.ledgerApi = ledgerApi;
  }

  get wasm() {
    return this.baseWallet.wasm;
  }

  get api() {
    return this.baseWallet.api;
  }

  ///
  /// Public Methods
  ///

  /// Initializes the PrivateWallet class, for a corresponding environment and network.
  protected static getInitialParams(
    palletName: PalletName,
    baseWallet: IBaseWallet,
  ): {
    wasmWallet: any;
    ledgerApi: LedgerApi;
  } {
    const wasmWallet = new baseWallet.wasm.Wallet();
    const ledgerApi = new LedgerApi(
      baseWallet.api,
      palletName,
      baseWallet.loggingEnabled,
    );
    return {
      wasmWallet,
      ledgerApi,
    };
  }

  async dropUserSeedPhrase() {
    const result = await this.baseWallet.wrapWalletIsBusy(async () => {
      this.wasmWallet.drop_accounts(this.getWasmNetWork());
      return true;
    });
    return result;
  }

  async loadUserSeedPhrase(seedPhrase: string) {
    const result = await this.baseWallet.wrapWalletIsBusy(async () => {
      const wasmSeedPhrase = this.wasm.mnemonic_from_phrase(seedPhrase);
      const accountTable = this.wasm.accounts_from_mnemonic(wasmSeedPhrase);
      this.wasmWallet.load_accounts(accountTable, this.getWasmNetWork());
      this.isBindAuthorizationContext = true;
      return true;
    });
    return result;
  }

  async getAuthorizationContext() {
    if (!this.isBindAuthorizationContext) {
      return null;
    }
    const result = await this.baseWallet.wrapWalletIsBusy(async () => {
      return this.wasmWallet.authorization_context(
        this.getWasmNetWork(),
      ) as AuthContextType;
    });
    return result;
  }

  async loadAuthorizationContext(authContext: AuthContextType) {
    const result = await this.baseWallet.wrapWalletIsBusy(async () => {
      const success = this.wasmWallet.try_load_authorization_context(
        authContext,
        this.getWasmNetWork(),
      );
      if (success) {
        this.isBindAuthorizationContext = true;
      }
      return success;
    });
    return result;
  }

  async dropAuthorizationContext() {
    const result = await this.baseWallet.wrapWalletIsBusy(async () => {
      this.wasmWallet.drop_authorization_context(this.getWasmNetWork());
      this.isBindAuthorizationContext = false;
      return true;
    });
    return result;
  }

  async initialSigner() {
    const result = await this.setNetwork(this.network);
    return result;
  }

  /// After initial PrivateWallet, need to call setNetwork
  async setNetwork(network: Network) {
    const result = await this.baseWallet.wrapWalletIsBusy(async () => {
      this.network = network;
      const storageData = await this.baseWallet.getStorageStateFromLocal(
        this.palletName,
        this.network,
      );

      this.log('Start initial signer');

      const wasmSigner = new this.wasm.Signer(
        this.baseWallet.fullParameters,
        this.baseWallet.multiProvingContext,
        storageData,
      );

      this.log('Initial signer successful');

      const wasmLedger = new this.baseWallet.wasm.PolkadotJsLedger(
        this.ledgerApi,
      );

      this.wasmWallet.set_network(
        wasmLedger,
        wasmSigner,
        this.getWasmNetWork(),
      );
      return true;
    });
    return result;
  }

  /// This method is optimized based on initialWalletSync
  ///
  /// Requirements: Must be called once after creating an instance of PrivateWallet
  /// and must be called before walletSync().
  /// If it is a new wallet (the current solution is that the native token is 0),
  /// you can call this method to save initialization time
  async initialNewAccountWalletSync(): Promise<boolean> {
    if (!this.isBindAuthorizationContext) {
      throw new Error('No ViewingKey');
    }
    const result = await this.baseWallet.wrapWalletIsBusy(async () => {
      this.log('Start initial new account');
      await this.baseWallet.isApiReady();
      await this.wasmWallet.initial_sync(this.getWasmNetWork());
      this.log('Initial new account completed');
      await this.saveStateToLocal();
      this.initialSyncIsFinished = true;
      return true;
    });
    return result;
  }

  /// Performs full wallet recovery. Restarts `self` with an empty state and
  /// performs a synchronization against the signer and ledger to catch up to
  /// the current checkpoint and balance state.
  ///
  /// Requirements: Must be called once after creating an instance of PrivateWallet
  /// and must be called before walletSync().
  /// If it is a new wallet (the current solution is that the native token is 0),
  /// you can call initialNewAccountWalletSync to save initialization time
  async initialWalletSync(): Promise<boolean> {
    const result = await this.loopSyncPartialWallet(true);
    return result;
  }

  /// Pulls data from the ledger, synchronizing the currently connected wallet and
  /// balance state. This method runs until all the ledger data has arrived at and
  /// has been synchronized with the wallet.
  async walletSync(): Promise<boolean> {
    if (!this.initialSyncIsFinished) {
      throw new Error('Must call initialWalletSync before walletSync!');
    }
    const result = await this.loopSyncPartialWallet(false);
    return result;
  }

  /// Returns the ZkAddress (Zk Address) of the currently connected manta-signer instance.
  async getZkAddress(): Promise<Address> {
    const result = await this.baseWallet.wrapWalletIsBusy(async () => {
      const zkAddressRaw = await this.wasmWallet.address(this.getWasmNetWork());
      const zkAddressBytes = [...zkAddressRaw.receiving_key];
      return base58Encode(zkAddressBytes);
    });
    return result;
  }

  /// Returns the zk balance of the currently connected zkAddress for the currently
  /// connected network.
  async getZkBalance(assetId: BN): Promise<BN> {
    const result = await this.baseWallet.wrapWalletIsBusy(async () => {
      const balanceString = this.wasmWallet.balance(
        assetId.toString(),
        this.getWasmNetWork(),
      );
      return new BN(balanceString);
    });
    return result;
  }

  /// Returns the multi zk balance of the currently connected zkAddress for the currently
  /// connected network.
  async getMultiZkBalance(assetIds: BN[]): Promise<BN[]> {
    const result = await this.baseWallet.wrapWalletIsBusy(async () => {
      return assetIds.map((assetId) => {
        const balanceString = this.wasmWallet.balance(
          assetId.toString(),
          this.getWasmNetWork(),
        );
        return new BN(balanceString);
      });
    });
    return result;
  }

  /// reset instance state
  async resetState() {
    await this.baseWallet.wrapWalletIsBusy(async () => {
      this.initialSyncIsFinished = false;
      this.isBindAuthorizationContext = false;
      const wasmSigner = new this.wasm.Signer(
        this.baseWallet.fullParameters,
        this.baseWallet.multiProvingContext,
        null,
      );
      const wasmLedger = new this.wasm.PolkadotJsLedger(this.ledgerApi);
      this.wasmWallet.set_network(
        wasmLedger,
        wasmSigner,
        this.getWasmNetWork(),
      );
    });
    this.dropAuthorizationContext();
    return true;
  }

  async getLedgerTotalCount() {
    await this.baseWallet.isApiReady();
    // @ts-ignore
    const totalCount = await this.api.rpc[this.palletName].pull_ledger_total_count();
    return u8aToBn(totalCount).toNumber();
  }

  getLedgerCurrentCount(checkpoint: Checkpoint) {
    return getLedgerSyncedCount(checkpoint);
  }

  ///
  /// Private Methods
  ///

  /// Conditionally logs the contents of `message` depending on if `loggingEnabled`
  /// is set to `true`.
  protected log(message: string) {
    this.baseWallet.log(message, `Private Wallet ${this.palletName}`);
  }

  protected getWasmNetWork(): any {
    return this.wasm.Network.from_string(`"${this.network}"`);
  }

  private async loopSyncPartialWallet(isInitial: boolean): Promise<boolean> {
    if (!this.isBindAuthorizationContext) {
      throw new Error('No ViewingKey');
    }
    const result = await this.baseWallet.wrapWalletIsBusy(async () => {
      if (isInitial) {
        await this.wasmWallet.reset_state(this.getWasmNetWork());
      }
      let syncResult = null;
      let retryTimes = 0;
      do {
        this.log('Sync partial start');
        syncResult = await this.syncPartialWallet();
        this.log(
          `Sync partial end, success: ${syncResult.success}, continue: ${syncResult.continue}`,
        );
        if (!syncResult.success) {
          await new Promise((resolve) => {
            setTimeout(resolve, 600);
          });
          retryTimes += 1;
        } else {
          retryTimes = 0;
        }
        if (retryTimes > 5) {
          throw new Error('Sync partial failed');
        }
      } while (syncResult && syncResult.continue);
      if (isInitial) {
        this.initialSyncIsFinished = true;
      }
      return true;
    });
    return result;
  }

  private async syncPartialWallet(): Promise<{
    success: boolean;
    continue: boolean;
  }> {
    try {
      const syncType =
        this.palletName === 'mantaSBT' ? 'sbt_sync_partial' : 'sync_partial';
      await this.baseWallet.isApiReady();
      const result = await this.wasmWallet[syncType](this.getWasmNetWork());
      await this.saveStateToLocal();
      return {
        success: true,
        continue: Object.keys(result)[0] === 'Continue',
      };
    } catch (ex) {
      console.error('Sync partial failed.', ex);
      return {
        success: false,
        continue: true,
      };
    }
  }

  private async saveStateToLocal() {
    this.wasmWallet.prune(this.getWasmNetWork());
    const stateData = await this.wasmWallet.get_storage(this.getWasmNetWork());
    await this.baseWallet.saveStorageStateToLocal(
      this.palletName,
      this.network,
      stateData,
    );
  }
}

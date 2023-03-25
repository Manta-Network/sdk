import BN from 'bn.js';
import { base58Encode } from '@polkadot/util-crypto';
import type {
  Transaction as WasmTransaction,
  Wallet as WasmWallet,
} from './wallet/crate/pkg/manta_wasm_wallet';
import {
  Address,
  IMantaPrivateWallet,
  SignedTransaction,
  SignedMultiSbtTransaction,
  IBaseWallet,
  ILedgerApi,
  PalletName,
} from './sdk.interfaces';
import {
  mapPostToTransaction,
  privateTransferBuildUnsigned,
  toPrivateBuildUnsigned,
  toPublicBuildUnsigned,
  transactionsToBatches,
  transferPost,
} from './utils';
import LedgerApi from './api';
import { Network } from './constants';

/// MantaPrivateWallet class
export class MantaPrivateWallet implements IMantaPrivateWallet {
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

  get walletIsBusy() {
    return this.baseWallet.walletIsBusy;
  }

  set walletIsBusy(result: boolean) {
    this.baseWallet.walletIsBusy = result;
  }

  ///
  /// Public Methods
  ///

  /// Initializes the MantaPrivateWallet class, for a corresponding environment and network.
  static init(
    palletName: PalletName,
    network: Network,
    baseWallet: IBaseWallet,
  ): MantaPrivateWallet {

    const wasmWallet = new baseWallet.wasm.Wallet();
    const ledgerApi = new LedgerApi(
      baseWallet.api,
      palletName,
      baseWallet.loggingEnabled,
    );

    return new MantaPrivateWallet(
      palletName,
      network,
      baseWallet,
      wasmWallet,
      ledgerApi,
    );
  }

  dropAuthorizationContext() {
    this.wasmWallet.drop_authorization_context(this.getWasmNetWork());
    return true;
  }

  dropUserSeedPhrase() {
    this.wasmWallet.drop_accounts(this.getWasmNetWork());
    return true;
  }

  loadUserSeedPhrase(seedPhrase: string) {
    const wasmSeedPhrase = this.wasm.mnemonic_from_phrase(seedPhrase);
    const accountTable = this.wasm.accounts_from_mnemonic(wasmSeedPhrase);
    this.wasmWallet.load_accounts(accountTable, this.getWasmNetWork());
    this.wasmWallet.update_authorization_context(this.getWasmNetWork());
    this.isBindAuthorizationContext = true;
    return true;
  }

  loadAuthorizationContext(seedPhrase: string) {
    const autoUpdateAuthContext = this.wasmWallet.update_authorization_context(
      this.getWasmNetWork(),
    );
    if (autoUpdateAuthContext) {
      return true;
    }
    const wasmSeedPhrase = this.wasm.mnemonic_from_phrase(seedPhrase);
    const authorizationContext = this.wasm.authorization_context_from_mnemonic(
      wasmSeedPhrase,
      this.baseWallet.fullParameters,
    );
    this.wasmWallet.load_authorization_context(
      authorizationContext,
      this.getWasmNetWork(),
    );
    this.isBindAuthorizationContext = true;
    return true;
  }

  async initialSigner() {
    const result = await this.setNetwork(this.network);
    return result;
  }

  /// After initial MantaPrivateWallet, need to call setNetwork
  async setNetwork(network: Network) {
    this.network = network;
    const storageData = await this.baseWallet.getStorageStateFromLocal(
      this.palletName,
      this.network,
    );

    MantaPrivateWallet.log(
      this.palletName,
      this.baseWallet.loggingEnabled,
      'Start initial signer',
    );

    const wasmSigner = new this.wasm.Signer(
      this.baseWallet.fullParameters,
      this.baseWallet.multiProvingContext,
      storageData,
    );

    MantaPrivateWallet.log(
      this.palletName,
      this.baseWallet.loggingEnabled,
      'Initial signer successful',
    );
    const wasmLedger = new this.baseWallet.wasm.PolkadotJsLedger(this.ledgerApi);

    this.wasmWallet.set_network(
      wasmLedger,
      wasmSigner,
      this.getWasmNetWork(),
    );
    return true;
  }

  /// This method is optimized based on initialWalletSync
  ///
  /// Requirements: Must be called once after creating an instance of MantaPrivateWallet
  /// and must be called before walletSync().
  /// If it is a new wallet (the current solution is that the native token is 0),
  /// you can call this method to save initialization time
  async initialNewAccountWalletSync(): Promise<boolean> {
    if (!this.isBindAuthorizationContext) {
      throw new Error('No ViewingKey');
    }
    try {
      await this.waitForWallet();
      this.walletIsBusy = true;
      this.log('Start initial new account');
      await this.wasmWallet.initial_sync(this.getWasmNetWork());
      this.log('Initial new account completed');
      await this.saveStateToLocal();
      this.walletIsBusy = false;
      this.initialSyncIsFinished = true;
      return true;
    } catch (ex) {
      this.walletIsBusy = false;
      throw ex;
    }
  }

  /// Performs full wallet recovery. Restarts `self` with an empty state and
  /// performs a synchronization against the signer and ledger to catch up to
  /// the current checkpoint and balance state.
  ///
  /// Requirements: Must be called once after creating an instance of MantaPrivateWallet
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
    try {
      await this.waitForWallet();
      this.walletIsBusy = true;
      const zkAddressRaw = await this.wasmWallet.address(this.getWasmNetWork());
      const zkAddressBytes = [...zkAddressRaw.receiving_key];
      const zkAddress = base58Encode(zkAddressBytes);
      this.walletIsBusy = false;
      return zkAddress;
    } catch (ex) {
      this.walletIsBusy = false;
      throw ex;
    }
  }

  /// Returns the zk balance of the currently connected zkAddress for the currently
  /// connected network.
  async getZkBalance(assetId: BN): Promise<BN | null> {
    try {
      await this.waitForWallet();
      this.walletIsBusy = true;
      const balanceString = await this.wasmWallet.balance(
        assetId.toString(),
        this.getWasmNetWork(),
      );
      const balance = new BN(balanceString);
      this.walletIsBusy = false;
      return balance;
    } catch (ex) {
      this.walletIsBusy = false;
      console.error('Failed to fetch zk balance.', ex);
      throw ex;
    }
  }

  /// Returns the multi zk balance of the currently connected zkAddress for the currently
  /// connected network.
  async getMultiZkBalance(assetIds: BN[]): Promise<BN[] | null> {
    try {
      await this.waitForWallet();
      this.walletIsBusy = true;
      const balances = await Promise.all(
        assetIds.map(async (assetId) => {
          const balanceString = await this.wasmWallet.balance(
            assetId.toString(),
            this.getWasmNetWork(),
          );
          return new BN(balanceString);
        }),
      );
      this.walletIsBusy = false;
      return balances;
    } catch (ex) {
      this.walletIsBusy = false;
      console.error('Failed to fetch zk balance.', ex);
      throw ex;
    }
  }

  /// Builds and signs a "To Private" transaction for any fungible token.
  /// Note: This transaction is not published to the ledger.
  async toPrivateBuild(
    assetId: BN,
    amount: BN,
  ): Promise<SignedTransaction | null> {
    try {
      await this.waitForWallet();
      this.walletIsBusy = true;
      const transaction = await toPrivateBuildUnsigned(
        this.wasm,
        assetId,
        amount,
      );
      const signResult = await this.signTransaction(null, transaction);
      this.walletIsBusy = false;
      return signResult;
    } catch (ex) {
      this.walletIsBusy = false;
      console.error('Failed to build toPrivateBuild.', ex);
      throw ex;
    }
  }

  /// Builds a "Private Transfer" transaction for any fungible token.
  /// Note: This transaction is not published to the ledger.
  async privateTransferBuild(
    assetId: BN,
    amount: BN,
    toZkAddress: Address,
  ): Promise<SignedTransaction | null> {
    try {
      await this.waitForWallet();
      this.walletIsBusy = true;
      const transaction = await privateTransferBuildUnsigned(
        this.wasm,
        this.api,
        assetId,
        amount,
        toZkAddress,
      );
      const signResult = await this.signTransaction(
        transaction.assetMetadataJson,
        transaction.transaction,
      );
      this.walletIsBusy = false;
      return signResult;
    } catch (ex) {
      this.walletIsBusy = false;
      console.error('Failed to build privateTransferBuild.', ex);
      throw ex;
    }
  }

  /// Builds and signs a "To Public" transaction for any fungible token.
  /// Note: This transaction is not published to the ledger.
  async toPublicBuild(
    assetId: BN,
    amount: BN,
    polkadotAddress: Address,
  ): Promise<SignedTransaction | null> {
    try {
      await this.waitForWallet();
      this.walletIsBusy = true;
      const transaction = await toPublicBuildUnsigned(
        this.wasm,
        this.api,
        assetId,
        amount,
        polkadotAddress,
      );
      const signResult = await this.signTransaction(
        transaction.assetMetadataJson,
        transaction.transaction,
      );
      this.walletIsBusy = false;
      return signResult;
    } catch (ex) {
      this.walletIsBusy = false;
      console.error('Failed to build toPublicBuild.', ex);
      throw ex;
    }
  }

  async multiSbtBuild(
    startingAssetId: BN,
    metadataList: string[],
  ): Promise<SignedMultiSbtTransaction | null> {
    try {
      await this.waitForWallet();
      this.walletIsBusy = true;
      const amount = new BN('1');
      const transactions = [];
      const transactionDatas = [];
      for (let i = 0; i < metadataList.length; i += 1) {
        const transactionUnsigned = await toPrivateBuildUnsigned(
          this.wasm,
          startingAssetId,
          amount,
        );
        startingAssetId = startingAssetId.add(new BN('1'));
        const postsTxs = await this.wasmWallet.sign_with_transaction_data(
          transactionUnsigned,
          null,
          this.getWasmNetWork(),
        );
        const posts = postsTxs[0];
        for (let j = 0; j < posts.length; j++) {
          const convertedPost = transferPost(posts[j]);
          const transaction = await mapPostToTransaction(
            this.palletName,
            this.api,
            convertedPost,
            metadataList[i],
          );
          transactions.push(transaction);
        }
        transactionDatas.push(postsTxs[1]);
      }
      const batchedTx = await this.api.tx.utility.batch(transactions);
      this.walletIsBusy = false;
      return {
        batchedTx,
        transactionDatas,
      };
    } catch (ex) {
      this.walletIsBusy = false;
      console.error('Failed to build multiSbtBuild.', ex);
      throw ex;
    }
  }

  /// reset instance state
  async resetState() {
    const wasmSigner = new this.wasm.Signer(
      this.baseWallet.fullParameters,
      this.baseWallet.multiProvingContext,
      null,
    );
    const wasmLedger = new this.wasm.PolkadotJsLedger(this.ledgerApi);
    this.wasmWallet.set_network(wasmLedger, wasmSigner, this.getWasmNetWork());
    this.dropUserSeedPhrase();
    this.dropAuthorizationContext();
    return true;
  }

  ///
  /// Private Methods
  ///

  /// Conditionally logs the contents of `message` depending on if `loggingEnabled`
  /// is set to `true`.
  private static log(
    palletName: PalletName,
    loggingEnabled: boolean,
    message: string,
  ) {
    if (loggingEnabled) {
      console.log(
        `[Private Wallet ${palletName}]: ${performance.now()}, ${message}`,
      );
    }
  }

  private log(message: string) {
    MantaPrivateWallet.log(
      this.palletName,
      this.baseWallet.loggingEnabled,
      message,
    );
  }

  private getWasmNetWork(): any {
    return this.wasm.Network.from_string(`"${this.network}"`);
  }

  // WASM wallet doesn't allow you to call two methods at once, so before
  // calling methods it is necessary to wait for a pending call to finish.
  private async waitForWallet(): Promise<void> {
    while (this.walletIsBusy === true) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  private async loopSyncPartialWallet(isInitial: boolean): Promise<boolean> {
    if (!this.isBindAuthorizationContext) {
      throw new Error('No ViewingKey');
    }
    try {
      await this.waitForWallet();
      this.walletIsBusy = true;
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
          retryTimes += 1;
        } else {
          retryTimes = 0;
        }
        if (retryTimes > 5) {
          throw new Error('Sync partial failed');
        }
      } while (syncResult && syncResult.continue);
      this.walletIsBusy = false;
      if (isInitial) {
        this.initialSyncIsFinished = true;
      }
    } catch (ex) {
      this.walletIsBusy = false;
      throw ex;
    }
    return true;
  }

  private async syncPartialWallet(): Promise<{
    success: boolean;
    continue: boolean;
  }> {
    try {
      const result = await this.wasmWallet.sync_partial(this.getWasmNetWork());
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
    const stateData = await this.wasmWallet.get_storage(this.getWasmNetWork());
    await this.baseWallet.saveStorageStateToLocal(
      this.palletName,
      this.network,
      stateData,
    );
  }

  /// Signs the a given transaction returning posts, transactions and batches.
  /// assetMetaDataJson is optional, pass in null if transaction should not contain any.
  private async signTransaction(
    assetMetadataJson: any,
    transaction: WasmTransaction,
  ): Promise<SignedTransaction | null> {
    let assetMetadata: any = null;
    if (assetMetadataJson) {
      assetMetadata = this.wasm.AssetMetadata.from_string(assetMetadataJson);
    }
    this.log('Start Start');
    const posts = await this.wasmWallet.sign(
      transaction,
      assetMetadata,
      this.getWasmNetWork(),
    );
    this.log('Start End');
    const transactions = [];
    for (let i = 0; i < posts.length; i++) {
      const convertedPost = transferPost(posts[i]);
      const transaction = await mapPostToTransaction(
        this.palletName,
        this.api,
        convertedPost,
      );
      transactions.push(transaction);
    }
    const txs = await transactionsToBatches(this.api, transactions);
    return {
      posts,
      transactionData: null,
      transactions,
      txs,
    };
  }
}

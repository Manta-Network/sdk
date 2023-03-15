import { ApiPromise, WsProvider } from '@polkadot/api';
import { base58Decode, base58Encode, decodeAddress } from '@polkadot/util-crypto';
import { bnToU8a } from '@polkadot/util';
import Api, { ApiConfig } from './api/index';
import BN from 'bn.js';
import config from './manta-config.json';
import type { Transaction as WasmTransaction, Wallet as WasmWallet } from './wallet/crate/pkg/manta_wasm_wallet';
import * as mantaWasm from './wallet/crate/pkg/manta_wasm_wallet';
import { Signer, SubmittableExtrinsic } from '@polkadot/api/types';
import {
  Address,
  InitApiResult,
  InitWasmResult,
  IMantaPrivateWallet,
  SignedTransaction,
  PrivateWalletConfig,
  RequestUserSeedPhrase,
  SaveStorageStateToLocal,
  GetStorageStateFromLocal,
} from './sdk.interfaces';
import { NATIVE_TOKEN_ASSET_ID } from './utils';

const rpc = config.RPC;
const types = config.TYPES;
const DEFAULT_PULL_SIZE = config.DEFAULT_PULL_SIZE;
const PRIVATE_ASSET_PREFIX = 'zk';

/// The Envrionment that the sdk is configured to run for, if development
/// is selected then it will attempt to connect to a local node instance.
/// If production is selected it will attempt to connect to actual node.
export enum Environment {
  Development = 'DEV',
  Production = 'PROD',
}

/// Supported networks.
export enum Network {
  Dolphin = 'Dolphin',
  Calamari = 'Calamari',
  Manta = 'Manta',
}

// warning: do not update the array's order
const PayParameterNames = [
  'address-partition-function.dat',
  'group-generator.dat',
  'incoming-base-encryption-scheme.dat',
  'light-incoming-base-encryption-scheme.dat',
  'nullifier-commitment-scheme.dat',
  'outgoing-base-encryption-scheme.dat',
  'schnorr-hash-function.dat',
  'utxo-accumulator-item-hash.dat',
  'utxo-accumulator-model.dat',
  'utxo-commitment-scheme.dat',
  'viewing-key-derivation-function.dat',
];

// warning: do not edit the array's order
const PayProvingNames = [
  'to-private.lfs',
  'private-transfer.lfs',
  'to-public.lfs',
];

/// MantaPrivateWallet class
export class MantaPrivateWallet implements IMantaPrivateWallet {
  api: ApiPromise;
  wasm: any;
  wasmWallet: WasmWallet;
  network: Network;
  wasmApi: any;
  walletIsBusy: boolean;
  initialSyncIsFinished: boolean;
  loggingEnabled: boolean;
  isBindAuthorizationContext: boolean;
  parameters: any;
  requestUserSeedPhrase: RequestUserSeedPhrase;
  saveStorageStateToLocal: SaveStorageStateToLocal;
  getStorageStateFromLocal: GetStorageStateFromLocal;

  constructor(
    api: ApiPromise,
    wasm: any,
    wasmWallet: WasmWallet,
    network: Network,
    wasmApi: any,
    loggingEnabled: boolean,
    parameters: any,
    requestUserSeedPhrase: RequestUserSeedPhrase,
    saveStorageStateToLocal: SaveStorageStateToLocal,
    getStorageStateFromLocal: GetStorageStateFromLocal,
  ) {
    this.api = api;
    this.wasm = wasm;
    this.wasmWallet = wasmWallet;
    this.network = network;
    this.wasmApi = wasmApi;
    this.walletIsBusy = false;
    this.initialSyncIsFinished = false;
    this.loggingEnabled = loggingEnabled;
    this.isBindAuthorizationContext = false;
    this.parameters = parameters;
    this.requestUserSeedPhrase = requestUserSeedPhrase;
    this.saveStorageStateToLocal = saveStorageStateToLocal;
    this.getStorageStateFromLocal = getStorageStateFromLocal;
  }

  ///
  /// Public Methods
  ///

  /// Initializes the MantaPrivateWallet class, for a corresponding environment and network.
  static async init(config: PrivateWalletConfig): Promise<MantaPrivateWallet> {
    const { api } = await MantaPrivateWallet.initApi(
      config.environment,
      config.network,
      Boolean(config.loggingEnabled)
    );
    const { wasm, wasmWallet, wasmApi, parameters } =
      await MantaPrivateWallet.initWasmSdk(api, config);
    return new MantaPrivateWallet(
      api,
      wasm,
      wasmWallet,
      config.network,
      wasmApi,
      Boolean(config.loggingEnabled),
      parameters,
      config.requestUserSeedPhrase,
      config.saveStorageStateToLocal,
      config.getStorageStateFromLocal,
    );
  }

  /// Convert a private address to JSON.
  convertZkAddressToJson(address: string): any {
    const bytes = base58Decode(address);
    return JSON.stringify({
      receiving_key: Array.from(bytes),
    });
  }

  /// Returns information about the currently supported networks.
  getNetworks(): any {
    return config.NETWORKS;
  }

  /// Returns the ZkAddress (Zk Address) of the currently connected manta-signer instance.
  async getZkAddress(): Promise<Address> {
    try {
      await this.waitForWallet();
      this.walletIsBusy = true;
      const zkAddressRaw = await this.wasmWallet.address(
        this.getWasmNetWork()
      );
      const zkAddressBytes = [...zkAddressRaw.receiving_key];
      const zkAddress = base58Encode(zkAddressBytes);
      this.walletIsBusy = false;
      return zkAddress;
    } catch (e) {
      this.walletIsBusy = false;
      console.error('Failed to fetch ZkAddress.', e);
    }
  }

  /// Performs full wallet recovery. Restarts `self` with an empty state and
  /// performs a synchronization against the signer and ledger to catch up to
  /// the current checkpoint and balance state.
  ///
  /// Requirements: Must be called once after creating an instance of MantaPrivateWallet
  /// and must be called before walletSync().
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
    } catch (e) {
      this.walletIsBusy = false;
      console.error('Failed to fetch zk balance.', e);
      return null;
    }
  }

  /// Returns the metadata for an asset with a given `assetId` for the currently
  /// connected network.
  async getAssetMetadata(assetId: BN): Promise<any> {
    const data: any = await this.api.query.assetManager.assetIdMetadata(
      assetId
    );
    const json = JSON.stringify(data.toHuman());
    const jsonObj = JSON.parse(json);
    // Dolphin is equivalent to Calamari on-chain, and only appears differently at UI level
    // so it is necessary to set its symbol and name manually
    if (
      this.network === Network.Dolphin &&
      assetId.toString() === NATIVE_TOKEN_ASSET_ID
    ) {
      jsonObj.metadata.symbol = 'DOL';
      jsonObj.metadata.name = 'Dolphin';
    }
    return jsonObj;
  }

  /// Executes a "To Private" transaction for any fungible token.
  async toPrivateSend(
    assetId: BN,
    amount: BN,
    polkadotSigner: Signer,
    polkadotAddress: Address
  ): Promise<void> {
    const signed = await this.toPrivateBuild(
      assetId,
      amount,
      polkadotAddress
    );
    // transaction rejected by signer
    if (signed === null) {
      return;
    }
    await this.setPolkadotSigner(polkadotSigner);
    await this.sendTransaction(polkadotAddress, signed);
    this.log('To Private transaction finished.');
  }

  /// Builds and signs a "To Private" transaction for any fungible token.
  /// Note: This transaction is not published to the ledger.
  async toPrivateBuild(
    assetId: BN,
    amount: BN,
    polkadotAddress: Address
  ): Promise<SignedTransaction | null> {
    try {
      await this.waitForWallet();
      this.walletIsBusy = true;
      await this.setWasmExternalAccountSigner(polkadotAddress);
      const transaction = await this.toPrivateBuildUnsigned(assetId, amount);
      const signResult = await this.signTransaction(
        null,
        transaction,
        this.network
      );
      this.walletIsBusy = false;
      return signResult;
    } catch (e) {
      this.walletIsBusy = false;
      console.error('Failed to build transaction.', e);
      return null;
    }
  }

  /// Executes a "Private Transfer" transaction for any fungible token.
  async privateTransferSend(
    assetId: BN,
    amount: BN,
    toZkAddress: Address,
    polkadotSigner: Signer,
    polkadotAddress: Address
  ): Promise<void> {
    const signed = await this.privateTransferBuild(
      assetId,
      amount,
      toZkAddress,
      polkadotAddress
    );
    // transaction rejected by signer
    if (signed === null) {
      return;
    }
    await this.setPolkadotSigner(polkadotSigner);
    await this.sendTransaction(polkadotAddress, signed);
    this.log('Private Transfer transaction finished.');
  }

  /// Builds a "Private Transfer" transaction for any fungible token.
  /// Note: This transaction is not published to the ledger.
  async privateTransferBuild(
    assetId: BN,
    amount: BN,
    toZkAddress: Address,
    polkadotAddress: Address
  ): Promise<SignedTransaction | null> {
    try {
      await this.waitForWallet();
      this.walletIsBusy = true;
      await this.setWasmExternalAccountSigner(polkadotAddress);
      const transaction = await this.privateTransferBuildUnsigned(
        assetId,
        amount,
        toZkAddress
      );
      const signResult = await this.signTransaction(
        transaction.assetMetadataJson,
        transaction.transaction,
        this.network
      );
      this.walletIsBusy = false;
      return signResult;
    } catch (e) {
      this.walletIsBusy = false;
      console.error('Failed to build transaction.', e);
      return null;
    }
  }

  /// Executes a "To Public" transaction for any fungible token.
  async toPublicSend(
    assetId: BN,
    amount: BN,
    polkadotSigner: Signer,
    polkadotAddress: Address
  ): Promise<void> {
    const signed = await this.toPublicBuild(
      assetId,
      amount,
      polkadotAddress
    );
    // transaction rejected by signer
    if (signed === null) {
      return;
    }
    await this.setPolkadotSigner(polkadotSigner);
    await this.sendTransaction(polkadotAddress, signed);
    this.log('To Public transaction finished.');
  }

  /// Builds and signs a "To Public" transaction for any fungible token.
  /// Note: This transaction is not published to the ledger.
  async toPublicBuild(
    assetId: BN,
    amount: BN,
    polkadotAddress: Address
  ): Promise<SignedTransaction | null> {
    try {
      await this.waitForWallet();
      this.walletIsBusy = true;
      await this.setWasmExternalAccountSigner(polkadotAddress);
      const transaction = await this.toPublicBuildUnsigned(assetId, amount, polkadotAddress);
      const signResult = await this.signTransaction(
        transaction.assetMetadataJson,
        transaction.transaction,
        this.network
      );
      this.walletIsBusy = false;
      return signResult;
    } catch (e) {
      this.walletIsBusy = false;
      console.error('Failed to build transaction.', e);
      return null;
    }
  }

  ///
  /// Private Methods
  ///

  /// Conditionally logs the contents of `message` depending on if `loggingEnabled`
  /// is set to `true`.
  private log(message: string): void {
    if (this.loggingEnabled) {
      console.log('[INFO]: ' + message);
      console.log(performance.now());
    }
  }

  // WASM wallet doesn't allow you to call two methods at once, so before
  // calling methods it is necessary to wait for a pending call to finish.
  private async waitForWallet(): Promise<void> {
    while (this.walletIsBusy === true) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  /// Private helper method for internal use to initialize the Polkadot.js API with web3Extension.
  private static async initApi(
    env: Environment,
    network: Network,
    loggingEnabled: boolean
  ): Promise<InitApiResult> {
    const provider = new WsProvider(MantaPrivateWallet.envUrl(env, network));
    const api = await ApiPromise.create({ provider, types, rpc });
    const [chain, nodeName, nodeVersion] = await Promise.all([
      api.rpc.system.chain(),
      api.rpc.system.name(),
      api.rpc.system.version(),
    ]);

    if (loggingEnabled) {
      console.log(
        `[INFO]: MantaPrivateWallet is connected to chain ${chain} using ${nodeName} v${nodeVersion}`
      );
    }

    return {
      api,
    };
  }

  /// Private helper method for internal use to initialize the initialize manta-wasm-wallet.
  private static async initWasmSdk(
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
      priConfig.maxReceiversPullSize ?? DEFAULT_PULL_SIZE,
      priConfig.maxSendersPullSize ?? DEFAULT_PULL_SIZE,
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
    };
  }

  private async loopSyncPartialWallet(isInitial: boolean): Promise<boolean> {
    if (!this.isBindAuthorizationContext) {
      await this.loadUserSeedPhrase();
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
        this.log(`Sync partial end, success: ${syncResult.success}, continue: ${syncResult.continue}`, );
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

  private async syncPartialWallet(): Promise<{success: boolean, continue: boolean}> {
    try {
      const result = await this.wasmWallet.sync_partial(this.getWasmNetWork());
      const stateData = await this.wasmWallet.set_storage(this.getWasmNetWork());
      await this.saveStorageStateToLocal(`${this.network}`, stateData);
      return {
        success: true,
        continue: Object.keys(result)[0] === 'Continue',
      };
    } catch (e) {
      console.error('Sync partial failed.', e);
      return {
        success: false,
        continue: true,
      };
    }
  }

  private getWasmNetWork(): any {
    return this.wasm.Network.from_string(`"${this.network}"`);
  }

  /// Set polkadot signing address to `polkadotAddress`.
  private async setPolkadotSigner(
    polkadotSigner: Signer,
  ): Promise<void> {
    await this.api.setSigner(polkadotSigner);
  }

  /// Set the polkadot Signer to `polkadotSigner`
  private async setWasmExternalAccountSigner(polkadotAddress: Address): Promise<void> {
    await this.wasmApi.setExternalAccountSigner(polkadotAddress);
  }

  /// Returns the corresponding blockchain connection URL from Environment
  /// and Network values.
  private static envUrl(env: Environment, network: Network): string {
    let url = config.NETWORKS[network].ws_local;
    if (env == Environment.Production) {
      url = config.NETWORKS[network].ws;
    }
    return url;
  }

  /// Builds the "ToPrivate" transaction in JSON format to be signed.
  private async toPrivateBuildUnsigned(assetId: BN, amount: BN): Promise<any> {
    try {
      const assetIdArray = bnToU8a(assetId, {bitLength: 256});
      const txJson = `{ "ToPrivate": { "id": [${assetIdArray}], "value": ${amount.toString()} }}`;
      const transaction = this.wasm.Transaction.from_string(txJson);
      return transaction;
    } catch (error) {
      console.error('Unable to build "To Private" Transaction.', error);
    }
  }

  /// private transfer transaction
  private async privateTransferBuildUnsigned(
    assetId: BN,
    amount: BN,
    toZkAddress: Address
  ): Promise<any> {
    try {
      const addressJson = this.convertZkAddressToJson(toZkAddress);
      const assetIdArray = bnToU8a(assetId, {bitLength: 256});
      const txJson = `{ "PrivateTransfer": [{ "id": [${assetIdArray}], "value": ${amount.toString()} }, ${addressJson} ]}`;
      const transaction = this.wasm.Transaction.from_string(txJson);
      const jsonObj = await this.getAssetMetadata(assetId);
      const decimals = jsonObj['metadata']['decimals'];
      const symbol = jsonObj['metadata']['symbol'];
      const assetMetadataJson = `{ "token_type": {"FT": ${decimals}}, "symbol": "${PRIVATE_ASSET_PREFIX}${symbol}" }`;
      return {
        transaction,
        assetMetadataJson,
      };
    } catch (e) {
      console.error('Unable to build "Private Transfer" Transaction.', e);
    }
  }

  /// Builds the "ToPublic" transaction in JSON format to be signed.
  private async toPublicBuildUnsigned(assetId: BN, amount: BN, publicAddress: string): Promise<any> {
    try {
      const assetIdArray = bnToU8a(assetId, {bitLength: 256});
      const publicAddressArray = `[${decodeAddress(publicAddress)}]`;
      const txJson = `{ "ToPublic": [{ "id": [${assetIdArray}], "value": ${amount.toString()} }, ${publicAddressArray} ]}`;

      const transaction = this.wasm.Transaction.from_string(txJson);
      const jsonObj = await this.getAssetMetadata(assetId);
      const decimals = jsonObj['metadata']['decimals'];
      const symbol = jsonObj['metadata']['symbol'];
      const assetMetadataJson = `{ "token_type": {"FT": ${decimals}}, "symbol": "${PRIVATE_ASSET_PREFIX}${symbol}" }`;
      return {
        transaction,
        assetMetadataJson,
      };
    } catch (error) {
      console.error('Unable to build "To Public" Transaction.', error);
    }
  }

  public dropAuthorizationContext() {
    this.wasmWallet.drop_authorization_context(this.getWasmNetWork());
  }

  public dropUserSeedPhrase() {
    this.wasmWallet.drop_accounts(this.getWasmNetWork());
  }

  public async loadUserSeedPhrase(initialSeedPhrase?: string) {
    const seedPhrase = await this.getUserSeedPhrase(initialSeedPhrase);
    const accountTable = await this.wasm.accounts_from_mnemonic(seedPhrase);
    await this.wasmWallet.load_accounts(accountTable, this.getWasmNetWork());
    await this.wasmWallet.update_authorization_context(this.getWasmNetWork());
    this.isBindAuthorizationContext = true;
  }

  public async loadAuthorizationContext(initialSeedPhrase?: string) {
    const autoUpdateAuthContext = await this.wasmWallet.update_authorization_context(this.getWasmNetWork());
    if (autoUpdateAuthContext) {
      return;
    }
    const seedPhrase = await this.getUserSeedPhrase(initialSeedPhrase);
    const authorizationContext = await this.wasm.authorization_context_from_mnemonic(
      seedPhrase,
      this.parameters,
    );
    await this.wasmWallet.load_authorization_context(
      authorizationContext,
      this.getWasmNetWork()
    );
    this.isBindAuthorizationContext = true;
  }

  private async getUserSeedPhrase(initialSeedPhrase?: string): Promise<any> {
    const seedPhrase = initialSeedPhrase || (await this.requestUserSeedPhrase());
    if (!seedPhrase) {
      throw new Error('User Rejected');
    }
    return this.wasm.mnemonic_from_phrase(seedPhrase);
  }

  private async wrapperSpendingKeyOperation(func: () => any): Promise<any> {
    await this.loadUserSeedPhrase();
    let result: any = undefined;
    this.log('Sign start');
    result = await func();
    this.log('Sign end');
    // this.dropUserSeedPhrase();
    return result;
  }

  /// Signs the a given transaction returning posts, transactions and batches.
  /// assetMetaDataJson is optional, pass in null if transaction should not contain any.
  private async signTransaction(
    assetMetadataJson: any,
    transaction: WasmTransaction,
    network: Network
  ): Promise<SignedTransaction | null> {
    try {
      let assetMetadata: any = null;
      if (assetMetadataJson) {
        assetMetadata = this.wasm.AssetMetadata.from_string(assetMetadataJson);
      }
      const networkType = this.wasm.Network.from_string(`"${network}"`);
      const posts = await this.wrapperSpendingKeyOperation(async () => {
        return await this.wasmWallet.sign(
          transaction,
          assetMetadata,
          networkType
        );
      });
      const transactions = [];
      for (let i = 0; i < posts.length; i++) {
        const convertedPost = this.transferPost(posts[i]);
        const transaction = await this.mapPostToTransaction(
          convertedPost,
          this.api
        );
        transactions.push(transaction);
      }
      const txs = await this.transactionsToBatches(transactions, this.api);
      return {
        posts,
        transactions,
        txs,
      };
    } catch (e) {
      console.error('Unable to sign transaction.', e);
      return null;
    }
  }

  /// This method sends a transaction to the public ledger after it has been signed
  /// by Manta Signer.
  private async sendTransaction(
    signer: string,
    signedTransaction: SignedTransaction
  ): Promise<void> {
    for (let i = 0; i < signedTransaction.txs.length; i++) {
      try {
        await signedTransaction.txs[i].signAndSend(
          signer,
          (_status: any, _events: any) => {}
        );
      } catch (error) {
        console.error('Transaction failed', error);
      }
    }
  }

  /// Maps a given `post` to a known transaction type, either Mint, Private Transfer or Reclaim.
  private async mapPostToTransaction(
    post: any,
    api: ApiPromise
  ): Promise<SubmittableExtrinsic<'promise', any>> {
    const sources = post.sources.length;
    const senders = post.sender_posts.length;
    const receivers = post.receiver_posts.length;
    const sinks = post.sinks.length;

    if (sources == 1 && senders == 0 && receivers == 1 && sinks == 0) {
      const mintTx = await api.tx.mantaPay.toPrivate(post);
      return mintTx;
    } else if (sources == 0 && senders == 2 && receivers == 2 && sinks == 0) {
      const privateTransferTx = await api.tx.mantaPay.privateTransfer(post);
      return privateTransferTx;
    } else if (sources == 0 && senders == 2 && receivers == 1 && sinks == 1) {
      const reclaimTx = await api.tx.mantaPay.toPublic(post);
      return reclaimTx;
    } else {
      throw new Error(
        'Invalid transaction shape; there is no extrinsic for a transaction' +
          `with ${sources} sources, ${senders} senders, ` +
          ` ${receivers} receivers and ${sinks} sinks`
      );
    }
  }

  /// Batches transactions.
  private async transactionsToBatches(
    transactions: any,
    api: ApiPromise
  ): Promise<SubmittableExtrinsic<'promise', any>[]> {
    const MAX_BATCH = 2;
    const batches = [];
    for (let i = 0; i < transactions.length; i += MAX_BATCH) {
      const transactionsInSameBatch = transactions.slice(i, i + MAX_BATCH);
      const batchTransaction = await api.tx.utility.batch(
        transactionsInSameBatch
      );
      batches.push(batchTransaction);
    }
    return batches;
  }

  // convert receiver_posts to match runtime side
  private convertReceiverPost(x: any) {
    const arr1 = x.note.incoming_note.ciphertext.ciphertext.message.flatMap(
      function (item: any, index: any, a: any) {
        return item;
      }
    );
    const tag = x.note.incoming_note.ciphertext.ciphertext.tag;
    const pk = x.note.incoming_note.ciphertext.ephemeral_public_key;
    x.note.incoming_note.tag = tag;
    x.note.incoming_note.ephemeral_public_key = pk;
    x.note.incoming_note.ciphertext = arr1;
    delete x.note.incoming_note.header;

    const lightPk = x.note.light_incoming_note.ciphertext.ephemeral_public_key;
    // ciphertext is [u8; 96] on manta-rs, but runtime side is [[u8; 32]; 3]
    const lightCipher = x.note.light_incoming_note.ciphertext.ciphertext;
    const lightCiper0 = lightCipher.slice(0, 32);
    const lightCiper1 = lightCipher.slice(32, 64);
    const lightCiper2 = lightCipher.slice(64, 96);
    x.note.light_incoming_note.ephemeral_public_key = lightPk;
    x.note.light_incoming_note.ciphertext = [
      lightCiper0,
      lightCiper1,
      lightCiper2,
    ];
    delete x.note.light_incoming_note.header;

    // convert asset value to [u8; 16]
    x.utxo.public_asset.value = new BN(x.utxo.public_asset.value).toArray(
      'le',
      16
    );

    x.full_incoming_note = x.note;
    delete x.note;
  }

  // convert sender_posts to match runtime side
  private convertSenderPost(x: any) {
    const pk = x.nullifier.outgoing_note.ciphertext.ephemeral_public_key;
    const cipher = x.nullifier.outgoing_note.ciphertext.ciphertext;
    const ciper0 = cipher.slice(0, 32);
    const ciper1 = cipher.slice(32, 64);
    const outgoing = {
      ephemeral_public_key: pk,
      ciphertext: [ciper0, ciper1],
    };
    x.outgoing_note = outgoing;
    const nullifier = x.nullifier.nullifier.commitment;
    x.nullifier_commitment = nullifier;
    delete x.nullifier;
  }

  // replace all Uint8Array type to Array
  // replace all bigint type to string
  private formatPostData(post: any): any {
    const walk = function(data: any, keys: string[]) {
      for (const key of keys) {
        if (data[key] instanceof Uint8Array) {
          data[key] = Array.from(data[key]);
        } else if (typeof data[key] === 'bigint') {
          data[key] = (data[key]).toString();
        } else if (data[key]) {
          const tKeys = Object.keys(data[key]);
          if (tKeys.length > 0) {
            walk(data[key], tKeys);
          }
        }
      }
    };
    walk(post, Object.keys(post));
    return post;
  }

  /// NOTE: `post` from manta-rs sign result should match runtime side data structure type.
  private transferPost(post: any): any {
    const json = JSON.parse(JSON.stringify(this.formatPostData(post)));

    // transfer authorization_signature format
    if (json.authorization_signature != null) {
      const scala = json.authorization_signature.signature.scalar;
      const nonce = json.authorization_signature.signature.nonce_point;
      json.authorization_signature.signature = [scala, nonce];
    }

    // transfer receiver_posts to match runtime side
    json.receiver_posts.map((x: any) => {
      this.convertReceiverPost(x);
    });

    // transfer sender_posts to match runtime side
    json.sender_posts.map((x: any) => {
      this.convertSenderPost(x);
    });

    return json;
  }

  private static async fetchFiles(
    filePrefix: string,
    fileNames: string[]
  ): Promise<Uint8Array[] | null> {
    const fileList = await Promise.all(
      fileNames.map((name) =>
        MantaPrivateWallet.fetchFile(`${filePrefix}/${name}`)
      )
    );
    return fileList;
  }

  private static async fetchFile(
    url: string,
  ): Promise<Uint8Array | null> {
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
}

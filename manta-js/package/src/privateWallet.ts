import { ApiPromise, WsProvider } from '@polkadot/api';
import { base58Decode, base58Encode } from '@polkadot/util-crypto';
// @ts-ignore
import Api, {ApiConfig} from './api/index';
import BN from 'bn.js';
import config from './manta-config.json';
import { Transaction, Wallet } from './wallet/crate/pkg/manta_wasm_wallet';
import { Signer, SubmittableExtrinsic } from '@polkadot/api/types';
import { Address, AssetId, InitApiResult, InitWasmResult, IMantaPrivateWallet, SignedTransaction, PrivateWalletConfig } from './sdk.interfaces';
import { NATIVE_TOKEN_ASSET_ID } from './utils';

const rpc = config.RPC;
const types = config.TYPES;
const DEFAULT_PULL_SIZE = config.DEFAULT_PULL_SIZE;
const SIGNER_URL = config.SIGNER_URL;
const PRIVATE_ASSET_PREFIX = 'zk';

/// The Envrionment that the sdk is configured to run for, if development
/// is selected then it will attempt to connect to a local node instance.
/// If production is selected it will attempt to connect to actual node.
export enum Environment {
    Development = 'DEV',
    Production = 'PROD'
}

/// Supported networks.
export enum Network {
    Dolphin = 'Dolphin',
    Calamari = 'Calamari',
    Manta = 'Manta'
}

/// MantaPrivateWallet class
export class MantaPrivateWallet implements IMantaPrivateWallet {

  api: ApiPromise;
  wasm: any;
  wasmWallet: Wallet;
  network: Network;
  wasmApi: any;
  walletIsBusy: boolean;
  initialSyncIsFinished: boolean;
  loggingEnabled: boolean;

  constructor(api: ApiPromise, wasm: any, wasmWallet: Wallet, network: Network, wasmApi: any, loggingEnabled: boolean) {
    this.api = api;
    this.wasm = wasm;
    this.wasmWallet = wasmWallet;
    this.network = network;
    this.wasmApi = wasmApi;
    this.walletIsBusy = false;
    this.initialSyncIsFinished = false;
    this.loggingEnabled = loggingEnabled;
  }

  ///
  /// Public Methods
  ///

  /// Initializes the MantaPrivateWallet class, for a corresponding environment and network.
  static async init(config: PrivateWalletConfig): Promise<MantaPrivateWallet> {
    const { api } = await MantaPrivateWallet.initApi(config.environment, config.network, Boolean(config.loggingEnabled));
    const { wasm, wasmWallet, wasmApi } = await MantaPrivateWallet.initWasmSdk(api,config);
    return new MantaPrivateWallet(api,wasm,wasmWallet,config.network,wasmApi,Boolean(config.loggingEnabled));
  }

  /// Convert a private address to JSON.
  convertPrivateAddressToJson(address: string): any {
    const bytes = base58Decode(address);
    return JSON.stringify({
      receiving_key: Array.from(bytes)
    });
  }

  /// Convert asset_id string to UInt8Array, default UInt8 array size is 32.
  static assetIdToUInt8Array(asset_id: BN, len=32): AssetId {
    let hex = asset_id.toString(16); // to heximal format
    if (hex.length % 2) { hex = '0' + hex; }

    const u8a = new Uint8Array(len);

    let i = 0;
    let j = 0;
    while (i < len) {
      u8a[i] = parseInt(hex.slice(j, j+2), 16);
      i += 1;
      j += 2;
    }
    return u8a;
  }

  /// Returns information about the currently supported networks.
  getNetworks(): any {
    return config.NETWORKS;
  }

  /// Returns the ZkAddress (Private Address) of the currently connected manta-signer instance.
  async getZkAddress(): Promise<Address> {
    try {
      await this.waitForWallet();
      this.walletIsBusy = true;
      const networkType = this.wasm.Network.from_string(`"${this.network}"`);
      const privateAddressRaw = await this.wasmWallet.address(
        networkType
      );
      const privateAddressBytes = [
        ...privateAddressRaw.receiving_key
      ];
      const privateAddress = base58Encode(privateAddressBytes);
      this.walletIsBusy = false;
      return privateAddress;
    } catch (e) {
      this.walletIsBusy = false;
      console.error('Failed to fetch ZkAddress.',e);
    }
  }

  /// Performs full wallet recovery. Restarts `self` with an empty state and
  /// performs a synchronization against the signer and ledger to catch up to
  /// the current checkpoint and balance state.
  ///
  /// Requirements: Must be called once after creating an instance of MantaPrivateWallet
  /// and must be called before walletSync().
  async initalWalletSync(): Promise<boolean> {
    try {
      await this.waitForWallet();
      this.walletIsBusy = true;
      this.log('Beginning initial sync');
      const networkType = this.wasm.Network.from_string(`"${this.network}"`);
      const startTime = performance.now();
      await this.wasmWallet.restart(networkType);
      const endTime = performance.now();
      this.log(`Initial sync finished in ${(endTime - startTime) / 1000} seconds`);
      this.walletIsBusy = false;
      this.initialSyncIsFinished = true;
      return true;
    } catch (e) {
      this.walletIsBusy = false;
      console.error('Initial sync failed.',e);
      return false;
    }
  }

  /// Pulls data from the ledger, synchronizing the currently connected wallet and
  /// balance state. This method runs until all the ledger data has arrived at and
  /// has been synchronized with the wallet.
  async walletSync(): Promise<boolean> {
    try {
      if (!this.initialSyncIsFinished) {
        throw new Error('Must call initalWalletSync before walletSync!');
      }
      await this.waitForWallet();
      this.walletIsBusy = true;
      this.log('Beginning sync');
      const networkType = this.wasm.Network.from_string(`"${this.network}"`);
      const startTime = performance.now();
      await this.wasmWallet.sync(networkType);
      const endTime = performance.now();
      this.log(`Initial sync finished in ${(endTime - startTime) / 1000} seconds`);
      this.walletIsBusy = false;
      return true;
    } catch (e) {
      this.walletIsBusy = false;
      console.error('Sync failed.',e);
      return false;
    }
  }

  /// Returns the private balance of the currently connected zkAddress for the currently
  /// connected network.
  async getPrivateBalance(assetId: BN): Promise<BN | null> {
    try {
      await this.waitForWallet();
      this.walletIsBusy = true;
      const balanceString = await this.wasmWallet.balance(assetId.toString());
      const balance = new BN(balanceString)
      this.walletIsBusy = false;
      return balance;
    } catch (e) {
      this.walletIsBusy = false;
      console.error('Failed to fetch private balance.',e);
      return null
    }
  }

  /// Returns the metadata for an asset with a given `assetId` for the currently
  /// connected network.
  async getAssetMetadata(assetId: BN): Promise<any> {
    const data: any = await this.api.query.assetManager.assetIdMetadata(assetId);
    const json = JSON.stringify(data.toHuman());
    const jsonObj = JSON.parse(json);
    // Dolphin is equivalent to Calamari on-chain, and only appears differently at UI level
    // so it is necessary to set its symbol and name manually
    if (this.network === Network.Dolphin && assetId.toString() === NATIVE_TOKEN_ASSET_ID) {
      jsonObj.metadata.symbol = 'DOL';
      jsonObj.metadata.name = 'Dolphin';
    }
    return jsonObj;
  }

  /// Executes a "To Private" transaction for any fungible token.
  async toPrivateSend(assetId: BN, amount: BN, polkadotSigner:Signer, polkadotAddress:Address): Promise<void> {
    const signed = await this.toPrivateBuild(assetId,amount,polkadotSigner, polkadotAddress);
    // transaction rejected by signer
    if (signed === null) {
      return;
    }
    await this.sendTransaction(polkadotAddress,signed);
    this.log('To Private transaction finished.');
  }

  /// Builds and signs a "To Private" transaction for any fungible token.
  /// Note: This transaction is not published to the ledger.
  async toPrivateBuild(assetId: BN, amount: BN, polkadotSigner:Signer, polkadotAddress:Address): Promise<SignedTransaction | null> {
    try {
      await this.waitForWallet();
      this.walletIsBusy = true;
      await this.setPolkadotSigner(polkadotSigner, polkadotAddress);
      const transaction = await this.toPrivateBuildUnsigned(assetId, amount);
      const signResult = await this.signTransaction(null, transaction, this.network);
      this.walletIsBusy = false;
      return signResult;
    } catch (e) {
      this.walletIsBusy = false;
      console.error('Failed to build transaction.',e);
      return null;
    }
  }

  /// Executes a "Private Transfer" transaction for any fungible token.
  async privateTransferSend(assetId: BN, amount: BN, toPrivateAddress: Address, polkadotSigner:Signer, polkadotAddress:Address): Promise<void> {
    const signed = await this.privateTransferBuild(assetId,amount,toPrivateAddress,polkadotSigner,polkadotAddress);
    // transaction rejected by signer
    if (signed === null) {
      return;
    }
    await this.sendTransaction(polkadotAddress, signed);
    this.log('Private Transfer transaction finished.');
  }

  /// Builds a "Private Transfer" transaction for any fungible token.
  /// Note: This transaction is not published to the ledger.
  async privateTransferBuild(assetId: BN, amount: BN, toPrivateAddress: Address, polkadotSigner:Signer, polkadotAddress:Address): Promise<SignedTransaction | null> {
    try {
      await this.waitForWallet();
      this.walletIsBusy = true;
      await this.setPolkadotSigner(polkadotSigner, polkadotAddress);
      const transaction = await this.privateTransferBuildUnsigned(assetId, amount, toPrivateAddress);
      const signResult = await this.signTransaction(transaction.assetMetadataJson, transaction.transaction, this.network);
      this.walletIsBusy = false;
      return signResult;
    } catch (e) {
      this.walletIsBusy = false;
      console.error('Failed to build transaction.',e);
      return null;
    }
  }

  /// Executes a "To Public" transaction for any fungible token.
  async toPublicSend(assetId: BN, amount: BN, polkadotSigner:Signer, polkadotAddress:Address): Promise<void> {
    const signed = await this.toPublicBuild(assetId,amount,polkadotSigner, polkadotAddress);
    // transaction rejected by signer
    if (signed === null) {
      return;
    }
    await this.sendTransaction(polkadotAddress, signed);
    this.log('To Public transaction finished.');
  }

  /// Builds and signs a "To Public" transaction for any fungible token.
  /// Note: This transaction is not published to the ledger.
  async toPublicBuild(assetId: BN, amount: BN, polkadotSigner:Signer, polkadotAddress:Address): Promise<SignedTransaction | null> {
    try {
      await this.waitForWallet();
      this.walletIsBusy = true;
      await this.setPolkadotSigner(polkadotSigner, polkadotAddress);
      const transaction = await this.toPublicBuildUnsigned(assetId, amount);
      const signResult = await this.signTransaction(transaction.assetMetadataJson, transaction.transaction, this.network);
      this.walletIsBusy = false;
      return signResult;
    } catch (e) {
      this.walletIsBusy = false;
      console.error('Failed to build transaction.',e);
      return null;
    }
  }

  ///
  /// Private Methods
  ///

  /// Conditionally logs the contents of `message` depending on if `loggingEnabled`
  /// is set to `true`.
  private log(message:string): void {
    if (this.loggingEnabled) {
      console.log('[INFO]: '+message);
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
  private static async initApi(env: Environment, network: Network, loggingEnabled:boolean): Promise<InitApiResult> {
    const provider = new WsProvider(MantaPrivateWallet.envUrl(env, network));
    const api = await ApiPromise.create({ provider, types, rpc });
    const [chain, nodeName, nodeVersion] = await Promise.all([
      api.rpc.system.chain(),
      api.rpc.system.name(),
      api.rpc.system.version()
    ]);

    if (loggingEnabled) {
      console.log(`[INFO]: MantaPrivateWallet is connected to chain ${chain} using ${nodeName} v${nodeVersion}`);
    }

    return {
      api
    };
  }

  /// Private helper method for internal use to initialize the initialize manta-wasm-wallet.
  private static async initWasmSdk(api: ApiPromise, config:PrivateWalletConfig): Promise<InitWasmResult> {
    const wasm = await import('./wallet/crate/pkg/manta_wasm_wallet');
    const wasmSigner = new wasm.Signer(SIGNER_URL);
    const wasmApiConfig = new ApiConfig(
      (config.maxReceiversPullSize ?? DEFAULT_PULL_SIZE), (config.maxSendersPullSize ?? DEFAULT_PULL_SIZE), config.pullCallback, config.errorCallback, Boolean(config.loggingEnabled)
    );
    const wasmApi = new Api(api,wasmApiConfig);
    const wasmLedger = new wasm.PolkadotJsLedger(wasmApi);
    const wasmWallet = new wasm.Wallet(wasmLedger, wasmSigner);
    return {
      wasm,
      wasmWallet,
      wasmApi
    };
  }

  /// Sets the polkadot Signer to `polkadotSigner` and polkadot signing address to `polkadotAddress`.
  private async setPolkadotSigner(polkadotSigner: Signer, polkadotAddress:Address): Promise<void> {
    this.wasmApi.setExternalAccountSigner(polkadotAddress);
    this.api.setSigner(polkadotSigner);
  }

  /// Returns the corresponding blockchain connection URL from Environment
  /// and Network values.
  private static envUrl(env: Environment, network: Network): string {
    let url = config.NETWORKS[network].ws_local;
    if(env == Environment.Production) {
      url = config.NETWORKS[network].ws;
    }
    return url;
  }


  /// Builds the "ToPrivate" transaction in JSON format to be signed.
  private async toPrivateBuildUnsigned(assetId: BN, amount: BN): Promise<any> {
    try {
      const assetIdArray = Array.from(MantaPrivateWallet.assetIdToUInt8Array(assetId));
      const txJson = `{ "ToPrivate": { "id": [${assetIdArray}], "value": ${amount.toString()} }}`;
      const transaction = this.wasm.Transaction.from_string(txJson);
      return transaction;
    } catch (error) {
      console.error('Unable to build "To Private" Transaction.',error);
    }
  }

  /// private transfer transaction
  private async privateTransferBuildUnsigned(assetId: BN, amount: BN, toPrivateAddress: Address): Promise<any> {
    try {
      const addressJson = this.convertPrivateAddressToJson(toPrivateAddress);
      const assetIdArray = Array.from(MantaPrivateWallet.assetIdToUInt8Array(assetId));
      const txJson = `{ "PrivateTransfer": [{ "id": [${assetIdArray}], "value": ${amount.toString()} }, ${addressJson} ]}`;
      const transaction = this.wasm.Transaction.from_string(txJson);
      const jsonObj = await this.getAssetMetadata(assetId);
      const decimals = jsonObj['metadata']['decimals'];
      const symbol = jsonObj['metadata']['symbol'];
      const assetMetadataJson = `{ "decimals": ${decimals}, "symbol": "${PRIVATE_ASSET_PREFIX}${symbol}" }`;
      return {
        transaction,
        assetMetadataJson
      };
    } catch (e) {
      console.error('Unable to build "Private Transfer" Transaction.',e);
    }
  }

  /// Builds the "ToPublic" transaction in JSON format to be signed.
  private async toPublicBuildUnsigned(assetId: BN, amount: BN): Promise<any> {
    try {
      const assetIdArray = Array.from(MantaPrivateWallet.assetIdToUInt8Array(assetId));
      const txJson = `{ "ToPublic": { "id": [${assetIdArray}], "value": ${amount.toString()} }}`;
      const transaction = this.wasm.Transaction.from_string(txJson);
      const jsonObj = await this.getAssetMetadata(assetId);
      const decimals = jsonObj['metadata']['decimals'];
      const symbol = jsonObj['metadata']['symbol'];
      const assetMetadataJson = `{ "decimals": ${decimals}, "symbol": "${PRIVATE_ASSET_PREFIX}${symbol}" }`;
      return {
        transaction,
        assetMetadataJson
      };
    } catch (error) {
      console.error('Unable to build "To Public" Transaction.',error);
    }
  }

  /// Signs the a given transaction returning posts, transactions and batches.
  /// assetMetaDataJson is optional, pass in null if transaction should not contain any.
  private async signTransaction (assetMetadataJson: any, transaction: Transaction, network: Network): Promise<SignedTransaction | null> {
    try {
      let assetMetadata = null;
      if (assetMetadataJson) {
        assetMetadata = this.wasm.AssetMetadata.from_string(assetMetadataJson);
      }
      const networkType = this.wasm.Network.from_string(`"${network}"`);
      const posts = await this.wasmWallet.sign(transaction, assetMetadata, networkType);
      const transactions = [];
      for (let i = 0; i < posts.length; i++) {
        const convertedPost = this.transferPost(posts[i]);
        const transaction = await this.mapPostToTransaction(convertedPost, this.api);
        transactions.push(transaction);
      }
      const txs = await this.transactionsToBatches(transactions, this.api);
      return {
        posts,
        transactions,
        txs
      };
    } catch (e) {
      console.error('Unable to sign transaction.',e);
      return null;
    }
  }

  /// This method sends a transaction to the public ledger after it has been signed
  /// by Manta Signer.
  private async sendTransaction(signer: string, signedTransaction:SignedTransaction): Promise<void> {
    for (let i = 0; i < signedTransaction.txs.length; i++) {
      try {
        await signedTransaction.txs[i].signAndSend(signer, (_status:any, _events:any) => { });
      } catch (error) {
        console.error('Transaction failed', error);
      }
    }
  }

  /// Maps a given `post` to a known transaction type, either Mint, Private Transfer or Reclaim.
  private async mapPostToTransaction(post: any, api: ApiPromise): Promise<SubmittableExtrinsic<'promise', any>> {
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
        'Invalid transaction shape; there is no extrinsic for a transaction'
                + `with ${sources} sources, ${senders} senders, `
                + ` ${receivers} receivers and ${sinks} sinks`
      );
    }
  }

  /// Batches transactions.
  private async transactionsToBatches(transactions: any, api: ApiPromise): Promise<SubmittableExtrinsic<'promise', any>[]> {
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
  private convertReceiverPost(x:any) {
    const arr1 = x.note.incoming_note.ciphertext.ciphertext.message.flatMap(
      function(item: any,index:any,a: any){
        return item;
      });
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
    x.note.light_incoming_note.ciphertext = [lightCiper0, lightCiper1, lightCiper2];
    delete x.note.light_incoming_note.header;

    // convert asset value to [u8; 16]
    x.utxo.public_asset.value = new BN(x.utxo.public_asset.value).toArray('le', 16);

    x.full_incoming_note = x.note;
    delete x.note;
  }

  // convert sender_posts to match runtime side
  private convertSenderPost(x:any) {
    const pk = x.nullifier.outgoing_note.ciphertext.ephemeral_public_key;
    const cipher = x.nullifier.outgoing_note.ciphertext.ciphertext;
    const ciper0 = cipher.slice(0, 32);
    const ciper1 = cipher.slice(32, 64);
    const outgoing = {
      ephemeral_public_key: pk,
      ciphertext: [ciper0, ciper1]
    };
    x.outgoing_note = outgoing;
    const nullifier = x.nullifier.nullifier.commitment;
    x.nullifier_commitment = nullifier;
    delete x.nullifier;
  }

  /// NOTE: `post` from manta-rs sign result should match runtime side data structure type.
  private transferPost(post:any): any {
    const json = JSON.parse(JSON.stringify(post));

    // transfer authorization_signature format
    if(json.authorization_signature != null){
      const scala = json.authorization_signature.signature.scalar;
      const nonce = json.authorization_signature.signature.nonce_point;
      json.authorization_signature.signature = [scala, nonce];
    }

    // transfer receiver_posts to match runtime side
    json.receiver_posts.map((x:any) => {
      this.convertReceiverPost(x);
    });

    // transfer sender_posts to match runtime side
    json.sender_posts.map((x:any) => {
      this.convertSenderPost(x);
    });

    return json;
  }
}

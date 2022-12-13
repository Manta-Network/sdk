import { ApiPromise, WsProvider } from '@polkadot/api';
import { base58Decode, base58Encode } from '@polkadot/util-crypto';
// @ts-ignore
import Api, {ApiConfig} from 'manta-wasm-wallet-api';
import axios from 'axios';
import BN from 'bn.js';
import config from './manta-config.json';
import { Transaction, Wallet } from 'manta-wasm-wallet';
import { Signer, SubmittableExtrinsic } from '@polkadot/api/types';
import { Version, Address, AssetId, InitApiResult, InitWasmResult, IMantaPrivateWallet, SignedTransaction, wasmApi } from "./sdk.interfaces";

const rpc = config.RPC;
const types = config.TYPES;
const DEFAULT_PULL_SIZE = config.DEFAULT_PULL_SIZE;
const SIGNER_URL = config.SIGNER_URL;
const PRIVATE_ASSET_PREFIX = "p";
const NATIVE_TOKEN_ASSET_ID = "1";

/// The Envrionment that the sdk is configured to run for, if development
/// is selected then it will attempt to connect to a local node instance.
/// If production is selected it will attempt to connect to actual node.
export enum Environment {
    Development = "DEV",
    Production = "PROD"
}

/// Supported networks.
export enum Network {
    Dolphin = "Dolphin",
    Calamari = "Calamari",
    Manta = "Manta"
}

/// MantaPrivateWallet class
export class MantaPrivateWallet implements IMantaPrivateWallet {

    api: ApiPromise;
    wasm: any;
    wasmWallet: Wallet;
    network: Network;
    environment: Environment;
    wasmApi: wasmApi;
    walletIsBusy: boolean;

    constructor(api: ApiPromise, wasm: any, wasmWallet: Wallet, network: Network, environment: Environment, wasmApi: wasmApi) {
        this.api = api;
        this.wasm = wasm;
        this.wasmWallet = wasmWallet;
        this.network = network;
        this.environment = environment;
        this.wasmApi = wasmApi;
        this.walletIsBusy = false;
    }

    ///
    /// MantaPrivateWallet Initialization
    ///

    /// Initializes the MantaPrivateWallet class, given an optional address, this will be used
    /// for specifying which polkadot.js address to use upon initialization if there are several.
    /// If no address is specified then the first polkadot.js address will be used.
    static async init(env: Environment, network: Network): Promise<MantaPrivateWallet> {
        const { api } = await MantaPrivateWallet._initApi(env, network);
        const { wasm, wasmWallet, wasmApi } = await MantaPrivateWallet._initWasmSdk(api);
        const sdk = new MantaPrivateWallet(api,wasm,wasmWallet,network,env,wasmApi);
        return sdk;
    }

    /// Private helper method for internal use to initialize the Polkadot.js API with web3Extension.
    static async _initApi(env: Environment, network: Network): Promise<InitApiResult> {
        const provider = new WsProvider(envUrl(env, network));
        const api = await ApiPromise.create({ provider, types, rpc });
        const [chain, nodeName, nodeVersion] = await Promise.all([
            api.rpc.system.chain(),
            api.rpc.system.name(),
            api.rpc.system.version()
        ]);
        
        console.log(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`);

        return {
            api
        };
    }

    /// Private helper method for internal use to initialize the initialize manta-wasm-wallet.
    static async _initWasmSdk(api: ApiPromise): Promise<InitWasmResult> {
        const wasm = await import('manta-wasm-wallet');
        const wasmSigner = new wasm.Signer(SIGNER_URL);
        const wasmApiConfig = new ApiConfig(
            api, DEFAULT_PULL_SIZE, DEFAULT_PULL_SIZE
        );
        const wasmApi = new Api(wasmApiConfig);
        const wasmLedger = new wasm.PolkadotJsLedger(wasmApi);
        const wasmWallet = new wasm.Wallet(wasmLedger, wasmSigner);
        return {
            wasm,
            wasmWallet,
            wasmApi
        }
    }

    async _setPolkadotSigner(polkadotSigner: Signer, polkadotAddress:Address): Promise<void> {
        try {

            this.wasmApi.setExternalAccountSigner(polkadotAddress);
            this.api.setSigner(polkadotSigner);

        } catch (e) {
            console.error("Unable to set polkadotJS signer.", e);
        }
    }

    ///
    /// SDK methods
    ///

    /// Convert a private address to JSON.
    convertPrivateAddressToJson(address: string): any {
        return privateAddressToJson(address);
    }

    /// Returns information about the currently supported networks.
    networks(): any {
        return config.NETWORKS;
    }

    /// Returns whether the current wasm wallet instance is busy. To avoid multiple
    /// calls to wasmWallet simultaneously which causes a borrowMut rust error.
    isWalletBusy(): boolean {
        return this.walletIsBusy;
    }

    ///
    /// Manta Signer methods
    ///

    /// Returns the zkAddress of the currently connected manta-signer instance.
    async privateAddress(): Promise<Address> {
        if (!this.walletIsBusy) {
            this.walletIsBusy = true;
            const privateAddress = await getPrivateAddress(this.wasm, this.wasmWallet, this.network);
            this.walletIsBusy = false;
            return privateAddress
        } else {
            console.error("Wallet is currently busy!");
        }
    }

    /// Performs full wallet recovery. Restarts `self` with an empty state and
    /// performs a synchronization against the signer and ledger to catch up to
    /// the current checkpoint and balance state.
    ///
    /// Requirements: Must be called once after creating an instance of MantaPrivateWallet 
    /// and must be called before walletSync(). Must also be called after every 
    /// time the network is changed.
    async initalWalletSync(): Promise<void> {
        if (!this.walletIsBusy) {
            this.walletIsBusy = true;
            await initSync(this.wasm, this.wasmWallet, this.network);
            this.walletIsBusy = false;
        } else {
            console.error("Wallet is currently busy!");
        }
    }

    /// Pulls data from the ledger, synchronizing the currently connected wallet and
    /// balance state. This method runs until all the ledger data has arrived at and
    /// has been synchronized with the wallet.
    async walletSync(): Promise<void> {
        if (!this.walletIsBusy) {
            this.walletIsBusy = true;
            await sync(this.wasm, this.wasmWallet, this.network);
            this.walletIsBusy = false;
        } else {
            console.error("Wallet is currently busy!");
        }
    }

    /// Returns the version of the currently connected manta-signer instance.
    async signerVersion(): Promise<Version> {
        const version = await getSignerVersion();
        return version;
    }

    ///
    /// Fungible token methods
    ///
 
    /// Returns the metadata for an asset with a given `asset_id` for the currently
    /// connected network.
    async assetMetaData(assetId: BN): Promise<any> {
        const data = await this.api.query.assetManager.assetIdMetadata(assetId);
        const json = JSON.stringify(data.toHuman());
        const jsonObj = JSON.parse(json);
        return jsonObj;
    }
    
    /// Returns the private balance of the currently connected zkAddress for the currently
    /// connected network.
    async privateBalance(assetId: BN): Promise<string> {
        if (!this.walletIsBusy) {
            this.walletIsBusy = true;
            const balance = await getPrivateBalance(this.wasmWallet, assetId);
            this.walletIsBusy = false;
            return balance;
        } else {
            console.error("Wallet is currently busy!");
        }
    }

    /// Returns the public balance associated with an account for a given `asset_id`.
    /// If no address is provided, the balance will be returned for this.signer.
    async publicBalance(assetId: BN, address:Address): Promise<any> {
        const balance = await getPublicBalance(this.api,assetId,address);
        return balance;
    }
    
    /// Executes a "To Private" transaction for any fungible token.
    async toPrivateSend(assetId: BN, amount: BN, polkadotSigner:Signer, polkadotAddress:Address): Promise<void> {
        const signed = await this.toPrivateBuild(assetId,amount,polkadotSigner, polkadotAddress);
        await sendTransaction(polkadotAddress,signed);
    }

    /// Builds and signs a "To Private" transaction for any fungible token.
    /// Note: This transaction is not published to the ledger.
    async toPrivateBuild(assetId: BN, amount: BN, polkadotSigner:Signer, polkadotAddress:Address): Promise<SignedTransaction> {
        if (!this.walletIsBusy) {
            this.walletIsBusy = true;
            await this._setPolkadotSigner(polkadotSigner, polkadotAddress);
            const transaction = await toPrivateFungible(this.wasm, assetId, amount);
            const signResult = await signTransaction(this.api, this.wasm, this.wasmWallet, null, transaction, this.network);
            this.walletIsBusy = false;
            return signResult;
        } else {
            console.error("Wallet is currently busy!");
        }
    }

    /// Executes a "Private Transfer" transaction for any fungible token.
    async privateTransferSend(assetId: BN, amount: BN, toPrivateAddress: Address, polkadotSigner:Signer, polkadotAddress:Address): Promise<void> {
        const signed = await this.privateTransferBuild(assetId,amount,toPrivateAddress,polkadotSigner,polkadotAddress);
        await sendTransaction(polkadotAddress,signed);
    }

    /// Builds a "Private Transfer" transaction for any fungible token.
    /// Note: This transaction is not published to the ledger.
    async privateTransferBuild(assetId: BN, amount: BN, toPrivateAddress: Address, polkadotSigner:Signer, polkadotAddress:Address): Promise<SignedTransaction> {
        if (!this.walletIsBusy) {
            this.walletIsBusy = true;
            await this._setPolkadotSigner(polkadotSigner, polkadotAddress);
            const transaction = await privateFungibleTransfer(this.api, this.wasm, assetId, amount, toPrivateAddress);
            const signResult = await signTransaction(this.api, this.wasm, this.wasmWallet, transaction.assetMetadataJson, transaction.transaction, this.network);
            this.walletIsBusy = false;
            return signResult;
        } else {
            console.error("Wallet is currently busy!");
        }
    }

    /// Executes a "To Public" transaction for any fungible token.
    async toPublicSend(assetId: BN, amount: BN, polkadotSigner:Signer, polkadotAddress:Address): Promise<void> {
        const signed = await this.toPublicBuild(assetId,amount,polkadotSigner, polkadotAddress);
        await sendTransaction(polkadotAddress,signed);
    }

    /// Builds and signs a "To Public" transaction for any fungible token.
    /// Note: This transaction is not published to the ledger.
    async toPublicBuild(assetId: BN, amount: BN, polkadotSigner:Signer, polkadotAddress:Address): Promise<SignedTransaction> {
        if (!this.walletIsBusy) {
            this.walletIsBusy = true;
            await this._setPolkadotSigner(polkadotSigner, polkadotAddress);
            const transaction = await toPublicFungible(this.api, this.wasm, assetId, amount);
            const signResult = await signTransaction(this.api, this.wasm, this.wasmWallet, transaction.assetMetadataJson, transaction.transaction, this.network);
            this.walletIsBusy = false;
            return signResult;
        } else {
            console.error("Wallet is currently busy!");
        }
    }

    /// Executes a public transfer.
    async publicTransfer(assetId: BN, amount: BN, destinationAddress: Address, senderAddress:Address, polkadotSigner:Signer): Promise<void> {
        await this._setPolkadotSigner(polkadotSigner, senderAddress);
        await publicFungibleTransfer(this.api, senderAddress, assetId, destinationAddress, amount);
    }
}

/// Returns the corresponding blockchain connection URL from Environment
/// and Network values. 
function envUrl(env: Environment, network: Network): string {
    var url = config.NETWORKS[network].ws_local;
    if(env == Environment.Production) {
        url = config.NETWORKS[network].ws;
    }
    return url;
}

/// Returns the version of the currently connected manta-signer instance.
async function getSignerVersion(): Promise<Version> {
    try {
        const version_res = await axios.get(`${SIGNER_URL}version`, {
            timeout: 1500
        });
        const version: Version = version_res.data;
        return version;
    } catch (error) {
        console.error('Sync failed', error);
        return;
    }
}

/// Returns the zkAddress of the currently connected manta-signer instance.
async function getPrivateAddress(wasm: any, wallet:Wallet, network: Network): Promise<Address> {
    const networkType = wasm.Network.from_string(`"${network}"`);
    const privateAddressRaw = await wallet.address(
        networkType
    );
    const privateAddressBytes = [
        ...privateAddressRaw.receiving_key
    ];
    const privateAddress = base58Encode(privateAddressBytes);
    return privateAddress;
};

/// Returns private asset balance for a given `asset_id` for the associated zkAddress.
function getPrivateBalance(wasmWallet: Wallet, assetId: BN): string {
    return wasmWallet.balance(assetId.toString());
}

/// Returns the public balance for a given Asset ID.
async function getPublicBalance(api: ApiPromise, assetId: BN, targetAddress:Address): Promise<any> {
    try {
        if (assetId.toString() === NATIVE_TOKEN_ASSET_ID) {
            const nativeBalance: any = await api.query.system.account(targetAddress);
            return nativeBalance.data.free.toHuman();
        } else {
            const assetBalance: any = await api.query.assets.account(assetId, targetAddress);
            if (assetBalance.value.isEmpty) {
                return "0";
            } else {
                return assetBalance.value.balance.toString();
            }
        }
    } catch (e) {
        console.log("Failed to fetch public balance.");
        console.error(e);
    }
}

/// Converts a given zkAddress to json.
function privateAddressToJson(privateAddress: Address): Address {
    const bytes = base58Decode(privateAddress);
    return JSON.stringify({
        receiving_key: Array.from(bytes)
    });
};

/// Initial synchronization with signer.
async function initSync(wasm: any, wasmWallet: Wallet, network: Network): Promise<void> {
    console.log('Beginning initial sync');
    const networkType = wasm.Network.from_string(`"${network}"`);
    const startTime = performance.now();
    await wasmWallet.restart(networkType);
    const endTime = performance.now();
    console.log(
        `Initial sync finished in ${(endTime - startTime) / 1000} seconds`
    );
}

/// Syncs wallet with ledger.
async function sync(wasm: any, wasmWallet: Wallet, network: Network): Promise<void> {
    try {
        console.log('Beginning sync');
        const startTime = performance.now();
        const networkType = wasm.Network.from_string(`"${network}"`);
        await wasmWallet.sync(networkType);
        const endTime = performance.now();
        console.log(`Sync finished in ${(endTime - startTime) / 1000} seconds`);
    } catch (error) {
        console.error('Sync failed', error);
    }
}

/// Builds the "ToPrivate" transaction in JSON format to be signed.
async function toPrivateFungible(wasm: any, assetId: BN, amount: BN): Promise<any> {
    try {
        const assetIdArray = Array.from(assetIdToUInt8Array(assetId));
        const txJson = `{ "ToPrivate": { "id": [${assetIdArray}], "value": ${amount} }}`;
        const transaction = wasm.Transaction.from_string(txJson);
        return transaction;
    } catch (error) {
        console.error('Unable to build "To Private" Transaction.',error);
    }
}

/// Builds the "ToPublic" transaction in JSON format to be signed.
async function toPublicFungible(api: ApiPromise, wasm: any, assetId: BN, amount: BN): Promise<any> {
    try {
        const assetIdArray = Array.from(assetIdToUInt8Array(assetId));
        const txJson = `{ "ToPublic": { "id": [${assetIdArray}], "value": ${amount} }}`;
        const transaction = wasm.Transaction.from_string(txJson);
    
        // construct asset metadata json by query api
        const assetMeta = await api.query.assetManager.assetIdMetadata(assetId);
    
        const json = JSON.stringify(assetMeta.toHuman());
        const jsonObj = JSON.parse(json);
        const decimals = jsonObj["metadata"]["decimals"];
        const symbol = jsonObj["metadata"]["symbol"];
        const assetMetadataJson = `{ "decimals": ${decimals}, "symbol": "${PRIVATE_ASSET_PREFIX}${symbol}" }`;
        return {
            transaction,
            assetMetadataJson
        }
    } catch (error) {
        console.error('Unable to build "To Public" Transaction.',error);
    }
}

/// private transfer transaction
async function privateFungibleTransfer(api: ApiPromise, wasm: any, assetId: BN, amount: BN, toPrivateAddress: Address): Promise<any> {
    try {
        const addressJson = privateAddressToJson(toPrivateAddress);
        const assetIdArray = Array.from(assetIdToUInt8Array(assetId));
        const txJson = `{ "PrivateTransfer": [{ "id": [${assetIdArray}], "value": ${amount} }, ${addressJson} ]}`;
        const transaction = wasm.Transaction.from_string(txJson);
    
        // construct asset metadata json by query api
        const assetMeta = await api.query.assetManager.assetIdMetadata(assetId);
    
        const json = JSON.stringify(assetMeta.toHuman());
        const jsonObj = JSON.parse(json);
        const decimals = jsonObj["metadata"]["decimals"];
        const symbol = jsonObj["metadata"]["symbol"];
        const assetMetadataJson = `{ "decimals": ${decimals}, "symbol": "${PRIVATE_ASSET_PREFIX}${symbol}" }`;
        return {
            transaction,
            assetMetadataJson
        }
    } catch (e) {
        console.error('Unable to build "Private Transfer" Transaction.',e);
    }
}

/// Executes a public transfer from the address of `signer` to the address of `address`,
/// of the fungible token with AssetId `asset_id`.
async function publicFungibleTransfer(api: ApiPromise, senderAddress:Address, assetId:BN, destinationAddress:Address, amount:BN): Promise<void> {
    try {
        const assetIdArray = Array.from(assetIdToUInt8Array(assetId));
        const amountBN = amount.toArray('le', 16);
        const tx = await api.tx.mantaPay.publicTransfer(
            { id: assetIdArray, value: amountBN },
            destinationAddress
        );
        await tx.signAndSend(senderAddress);
    } catch (e) {
        console.log("Failed to execute public transfer.");
        console.error(e);
    }
}

/// Signs the a given transaction returning posts, transactions and batches.
/// assetMetaDataJson is optional, pass in null if transaction should not contain any.
const signTransaction = async (api: ApiPromise, wasm: any, wasmWallet: Wallet, assetMetadataJson: any, transaction: Transaction, network: Network): Promise<SignedTransaction> => {
    try {
        let assetMetadata = null;
        if (assetMetadataJson) {
            assetMetadata = wasm.AssetMetadata.from_string(assetMetadataJson);
        }
        const networkType = wasm.Network.from_string(`"${network}"`);
        const posts = await wasmWallet.sign(transaction, assetMetadata, networkType);
        const transactions = [];
        for (let i = 0; i < posts.length; i++) {
            const convertedPost = transferPost(posts[i]);
            const transaction = await mapPostToTransaction(convertedPost, api);
            transactions.push(transaction);
        }
        const txs = await transactionsToBatches(transactions, api);
        return {
            posts,
            transactions,
            txs
        }
    } catch (e) {
        console.error("Unable to sign transaction.",e);
    }
}

/// This method sends a transaction to the public ledger after it has been signed
/// by Manta Signer.
const sendTransaction = async (signer: string, signedTransaction:SignedTransaction): Promise<void> => {
    for (let i = 0; i < signedTransaction.txs.length; i++) {
        try {
            await signedTransaction.txs[i].signAndSend(signer, (_status:any, _events:any) => { });
        } catch (error) {
            console.error('Transaction failed', error);
        }
    }
}

/// Maps a given `post` to a known transaction type, either Mint, Private Transfer or Reclaim.
async function mapPostToTransaction(post: any, api: ApiPromise): Promise<SubmittableExtrinsic<"promise", any>> {
    let sources = post.sources.length;
    let senders = post.sender_posts.length;
    let receivers = post.receiver_posts.length;
    let sinks = post.sinks.length;

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
};

/// Batches transactions.
async function transactionsToBatches(transactions: any, api: ApiPromise): Promise<SubmittableExtrinsic<"promise", any>[]> {
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
const convertReceiverPost = (x:any) => {
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
const convertSenderPost = (x:any) => {
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
const transferPost = (post:any): any => {
    let json = JSON.parse(JSON.stringify(post));
    
    // transfer authorization_signature format
    if(json.authorization_signature != null){
        const scala = json.authorization_signature.signature.scalar;
        const nonce = json.authorization_signature.signature.nonce_point;
        json.authorization_signature.signature = [scala, nonce];
    }

    // transfer receiver_posts to match runtime side
    json.receiver_posts.map((x:any) => {
        convertReceiverPost(x);
    });

    // transfer sender_posts to match runtime side
    json.sender_posts.map((x:any) => {
        convertSenderPost(x);
    });

    return json
}

/// Convert asset_id string to UInt8Array, default UInt8 array size is 32.
const assetIdToUInt8Array = (asset_id: BN, len: number=32): AssetId => {
    let hex = asset_id.toString(16); // to heximal format
    if (hex.length % 2) { hex = '0' + hex; }
  
    let u8a = new Uint8Array(len);
  
    let i = 0;
    let j = 0;
    while (i < len) {
      u8a[i] = parseInt(hex.slice(j, j+2), 16);
      i += 1;
      j += 2;
    }
    return u8a;
}
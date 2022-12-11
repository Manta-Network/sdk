import { ApiPromise, WsProvider } from '@polkadot/api';
import { base58Decode, base58Encode } from '@polkadot/util-crypto';
// TODO: remove this dependency with better signer integration
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
// @ts-ignore
import Api, {ApiConfig} from 'manta-wasm-wallet-api';
import axios from 'axios';
import BN from 'bn.js';
import config from './manta-config.json';
import { Transaction, Wallet } from 'manta-wasm-wallet';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { Version, Address, AssetId, InitApiResult, InitWasmResult, IMantaPrivateWallet, TransferAmount } from "./sdk.interfaces";

const rpc = config.RPC;
const types = config.TYPES;
const DEFAULT_PULL_SIZE = config.DEFAULT_PULL_SIZE;
const SIGNER_URL = config.SIGNER_URL;
const PRIVATE_ASSET_PREFIX = "p";

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
    signer: string;
    wasm: any;
    wasmWallet: Wallet;
    network: Network;
    environment: Environment;
    wasmApi: any;

    constructor(api: ApiPromise, signer: string, wasm: any, wasmWallet: Wallet, network: Network, environment: Environment, wasmApi: any) {
        this.api = api;
        this.signer = signer;
        this.wasm = wasm;
        this.wasmWallet = wasmWallet;
        this.network = network;
        this.environment = environment;
        this.wasmApi = wasmApi;
    }

    ///
    /// SDK methods
    ///


    /// Converts a javascript number to Uint8Array(32), which is the type of AssetId and used
    /// for all transactions.
    /// @TODO: Add proper implementation for this method. 
    numberToAssetIdArray(assetIdNumber: number): AssetId {
        return numberToUint8Array(assetIdNumber);
    }

    /// Converts an AssetId of type [u8;32] to a number.
    /// Assumes that AssetId Uint32Array is in little endian order.
    assetIdArrayToNumber(assetId: AssetId): number {
        return uint8ArrayToNumber(assetId);
    }

    /// Convert a private address to JSON.
    convertPrivateAddressToJson(address: string): any {
        return privateAddressToJson(address);
    }

    /// Returns information about the currently supported networks.
    networks(): any {
        return config.NETWORKS;
    }

    ///
    /// Signer methods
    ///

    /// Returns the zkAddress of the currently connected manta-signer instance.
    async privateAddress(): Promise<Address> {
        const privateAddress = await getPrivateAddress(this.wasm, this.wasmWallet, this.network);
        return privateAddress
    }

    /// Returns the currently connected public polkadot.js address.
    async publicAddress(): Promise<Address> {
        return this.signer;
    }

    /// Performs full wallet recovery. Restarts `self` with an empty state and
    /// performs a synchronization against the signer and ledger to catch up to
    /// the current checkpoint and balance state.
    ///
    /// Requirements: Must be called once after creating an instance of MantaPrivateWallet 
    /// and must be called before walletSync(). Must also be called after every 
    /// time the network is changed.
    async initalWalletSync(): Promise<void> {
        await init_sync(this.wasm, this.wasmWallet, this.network);
    }

    /// Pulls data from the ledger, synchronizing the currently connected wallet and
    /// balance state. This method runs until all the ledger data has arrived at and
    /// has been synchronized with the wallet.
    async walletSync(): Promise<void> {
        await sync(this.wasm, this.wasmWallet, this.network);
    }

    /// Returns the version of the currently connected manta-signer instance.
    async signerVersion(): Promise<Version> {
        const version = await get_signer_version();
        return version;
    }

    ///
    /// Fungible token methods
    ///
 
    /// Returns the metadata for an asset with a given `asset_id` for the currently
    /// connected network.
    async assetMetaData(asset_id: AssetId): Promise<any> {
        const assetIdNumber = this.assetIdArrayToNumber(asset_id);
        const data = await this.api.query.assetManager.assetIdMetadata(assetIdNumber);
        const json = JSON.stringify(data.toHuman());
        const jsonObj = JSON.parse(json);
        return jsonObj;
    }
    
    /// Returns the private balance of the currently connected zkAddress for the currently
    /// connected network.
    async privateBalance(asset_id: AssetId): Promise<string> {
        const balance = await get_private_balance(this.wasmWallet, asset_id);
        return balance;
    }

    /// Returns the public balance associated with an account for a given `asset_id`.
    /// If no address is provided, the balance will be returned for this.signer.
    async publicBalance(asset_id: AssetId, address:string=""): Promise<any> {

        let targetAddress = address;
        if (!targetAddress) {
            targetAddress = this.signer;
        }
        const balance = await get_public_balance(this.api,asset_id,targetAddress);
        return balance;
    }

    /// Executes a "To Private" transaction for any fungible token, using the post method.
    async toPrivatePost(asset_id: AssetId, amount: TransferAmount): Promise<any> {
        const res = await to_private_by_post(this.wasm, this.wasmWallet, asset_id, amount, this.network);
        return res;
    }
    
    /// Executes a "To Private" transaction for any fungible token.
    /// Optional: The `onlySign` flag allows for the ability to sign and return
    /// the transaction without posting it to the ledger.
    async toPrivateSign(asset_id: AssetId, amount: TransferAmount, onlySign: boolean = false): Promise<any> {
        const result = await to_private_by_sign(this.api, this.signer, this.wasm, this.wasmWallet, asset_id, amount, this.network, onlySign);
        return result;
    }

    /// Executes a "Private Transfer" transaction for any fungible token.
    /// Optional: The `onlySign` flag allows for the ability to sign and return
    /// the transaction without posting it to the ledger.
    async privateTransfer(asset_id: AssetId, amount: TransferAmount, address: Address, onlySign: boolean = false): Promise<any> {
        const result = await private_transfer(this.api, this.signer, this.wasm, this.wasmWallet, asset_id, amount, address, this.network, onlySign);
        return result;
    }

    /// Executes a public transfer of `asset_id` for an amount of `amount` from the address
    /// of this.signer to `address`.
    async publicTransfer(asset_id: AssetId, amount: TransferAmount, address: Address): Promise<any> {
        const result = await public_transfer(this.api, this.signer, asset_id, address, amount);
        return result;
    }

    /// Executes a "To Public" transaction for any fungible token.
    /// Optional: The `onlySign` flag allows for the ability to sign and return
    /// the transaction without posting it to the ledger.
    async toPublic(asset_id: AssetId, amount: TransferAmount, onlySign: boolean = false): Promise<any> {
        const result = await to_public(this.api, this.signer, this.wasm, this.wasmWallet, asset_id, amount, this.network, onlySign);
        return result
    }
}

// Initializes the MantaPrivateWallet class, given an optional address, this will be used
// for specifying which polkadot.js address to use upon initialization if there are several.
// If no address is specified then the first polkadot.js address will be used.
export async function init(env: Environment, network: Network, address: string=""): Promise<MantaPrivateWallet> {
    const {api, signer} = await init_api(env, address.toLowerCase(), network);
    const {wasm, wasmWallet, wasmApi} = await init_wasm_sdk(api, signer);
    const sdk = new MantaPrivateWallet(api,signer,wasm,wasmWallet,network,env,wasmApi);
    return sdk
}

/// Returns the corresponding blockchain connection URL from Environment
/// and Network values. 
function env_url(env: Environment, network: Network): string {
    var url = config.NETWORKS[network].ws_local;
    if(env == Environment.Production) {
        url = config.NETWORKS[network].ws;
    }
    return url;
}

// Polkadot.js API with web3Extension
async function init_api(env: Environment, address: string, network: Network): Promise<InitApiResult> {
    const provider = new WsProvider(env_url(env, network));
    const api = await ApiPromise.create({ provider, types, rpc });
    const [chain, nodeName, nodeVersion] = await Promise.all([
        api.rpc.system.chain(),
        api.rpc.system.name(),
        api.rpc.system.version()
    ]);
    
    console.log(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`);

    // TODO: Better handling signer
    const extensions = await web3Enable('Polkadot App');
    if (extensions.length === 0) {
        throw new Error("Polkadot browser extension missing. https://polkadot.js.org/extension/");
    }
    const allAccounts = await web3Accounts();
    let account: any;

    if (!address) {
        account = allAccounts[0];
    } else {
        // need to check that argument `address` exists in `allAccounts` if an address was
        // specified.
        address = address.toLowerCase();
        for (let i = 0; i < allAccounts.length; i++) {
            if (allAccounts[i].address.toLowerCase() === address) {
                account = allAccounts[i];
                break;
            }
        }

        if (!account) {
            const errorString = "Unable to find account with specified address: " + address + " in Polkadot JS.";
            throw new Error(errorString);
        }
    }

    const injector = await web3FromSource(account.meta.source);
    const signer = account.address;
    console.log("address:" + account.address);
    api.setSigner(injector.signer)
    return {
        api,
        signer
    };
}

// Initialize wasm wallet sdk
async function init_wasm_sdk(api: ApiPromise, signer: string): Promise<InitWasmResult> {
    const wasm = await import('manta-wasm-wallet');
    const wasmSigner = new wasm.Signer(SIGNER_URL);
    const wasmApiConfig = new ApiConfig(
        api, signer, DEFAULT_PULL_SIZE, DEFAULT_PULL_SIZE
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

/// Returns the version of the currently connected manta-signer instance.
async function get_signer_version(): Promise<Version> {
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
function get_private_balance(wasmWallet: Wallet, asset_id: AssetId): string {
    const assetIdNumber = uint8ArrayToNumber(asset_id);
    const balance = wasmWallet.balance(assetIdNumber);
    return balance;
}

async function get_public_balance(api: ApiPromise, asset_id:AssetId, targetAddress:string): Promise<any> {
    try {
        const assetIdNumber = await uint8ArrayToNumber(asset_id);
        // TODO: assets is only for non native token
        // For native token(DOL,KMA), should query system.balance(address)
        const account: any = await api.query.assets.account(assetIdNumber, targetAddress);
        if (account.value.isEmpty) {
            return "0"
        } else {
            return account.value.balance.toString();
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
async function init_sync(wasm: any, wasmWallet: Wallet, network: Network): Promise<void> {
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

/// Attempts to execute a "To Private" transaction by a post on the currently
/// connected wallet.
async function to_private_by_post(wasm: any, wasmWallet: Wallet, asset_id: AssetId, to_private_amount: TransferAmount, network: Network): Promise<any> {
    const amountBN = new BN(to_private_amount);
    const asset_id_arr = Array.from(asset_id);
    const txJson = `{ "ToPrivate": { "id": [${asset_id_arr}], "value": ${amountBN} }}`;
    const transaction = wasm.Transaction.from_string(txJson);
    const networkType = wasm.Network.from_string(`"${network}"`);
    try {
        const res = await wasmWallet.post(transaction, null, networkType);
        console.log("To Private finished.");
        return res;
    } catch (error) {
        console.error('Transaction failed', error);
    }
}

/// Attempts to execute a "To Private" transaction by a sign + sign_and_send on
/// the currently connected wallet.
/// Optional: The `onlySign` flag allows for the ability to sign and return
/// the transaction without posting it to the ledger.
async function to_private_by_sign(api: ApiPromise, signer: string, wasm: any, wasmWallet: Wallet, asset_id: AssetId, to_private_amount: TransferAmount, network: Network, onlySign: boolean): Promise<any> {
    const amountBN = new BN(to_private_amount);
    const asset_id_arr = Array.from(asset_id);
    const txJson = `{ "ToPrivate": { "id": [${asset_id_arr}], "value": ${amountBN} }}`;
    const transaction = wasm.Transaction.from_string(txJson);
    try {
        if (onlySign) {
            const signResult = await sign_transaction(api, wasm, wasmWallet, null, transaction, network);
            return signResult;
        } else {
            const res = await sign_and_send_without_metadata(wasm, api, signer, wasmWallet, transaction, network);
            console.log("To Private finished.");
            return res;
        }
    } catch (error) {
        console.error('Transaction failed', error);
    }
}

/// public transfer transaction
/// Optional: The `onlySign` flag allows for the ability to sign and return
/// the transaction without posting it to the ledger.
async function to_public(api: ApiPromise, signer: string, wasm: any, wasmWallet: Wallet, asset_id: AssetId, transfer_amount: TransferAmount, network: Network, onlySign: boolean): Promise<any> {
    const amountBN = new BN(transfer_amount);
    const asset_id_arr = Array.from(asset_id);
    const txJson = `{ "ToPublic": { "id": [${asset_id_arr}], "value": ${amountBN} }}`;
    const transaction = wasm.Transaction.from_string(txJson);

    // construct asset metadata json by query api
    const assetIdNumber = uint8ArrayToNumber(asset_id);
    const asset_meta = await api.query.assetManager.assetIdMetadata(assetIdNumber);

    const json = JSON.stringify(asset_meta.toHuman());
    const jsonObj = JSON.parse(json);
    const decimals = jsonObj["metadata"]["decimals"];
    const symbol = jsonObj["metadata"]["symbol"];
    const assetMetadataJson = `{ "decimals": ${decimals}, "symbol": "${PRIVATE_ASSET_PREFIX}${symbol}" }`;

    if (onlySign) {
        const signResult = await sign_transaction(api, wasm, wasmWallet, assetMetadataJson, transaction, network);
        return signResult;
    } else {
        const res = await sign_and_send(api, signer, wasm, wasmWallet, assetMetadataJson, transaction, network);
        console.log("Public transfer finished.");
        return res;
    }
}

/// private transfer transaction
async function private_transfer(api: ApiPromise, signer: string, wasm: any, wasmWallet: Wallet, asset_id: AssetId, private_transfer_amount: TransferAmount, to_private_address: Address, network: Network, onlySign: boolean): Promise<any> {
    const addressJson = privateAddressToJson(to_private_address);
    // asset_id: [u8; 32]
    const amountBN = new BN(private_transfer_amount);
    const asset_id_arr = Array.from(asset_id);
    const txJson = `{ "PrivateTransfer": [{ "id": [${asset_id_arr}], "value": ${amountBN} }, ${addressJson} ]}`;
    const transaction = wasm.Transaction.from_string(txJson);

    // construct asset metadata json by query api
    const assetIdNumber = uint8ArrayToNumber(asset_id);
    const asset_meta = await api.query.assetManager.assetIdMetadata(assetIdNumber);

    const json = JSON.stringify(asset_meta.toHuman());
    const jsonObj = JSON.parse(json);
    const decimals = jsonObj["metadata"]["decimals"];
    const symbol = jsonObj["metadata"]["symbol"];
    const assetMetadataJson = `{ "decimals": ${decimals}, "symbol": "${PRIVATE_ASSET_PREFIX}${symbol}" }`;

    if (onlySign) {
        const signResult = await sign_transaction(api, wasm, wasmWallet, assetMetadataJson, transaction, network);
        return signResult;
    } else {
        const res = await sign_and_send(api, signer, wasm, wasmWallet, assetMetadataJson, transaction, network);
        console.log("Private Transfer finished.");
        return res;
    }
}

/// Executes a public transfer from the address of `signer` to the address of `address`,
/// of the fungible token with AssetId `asset_id`.
async function public_transfer(api: ApiPromise, signer:string, asset_id:AssetId, address:string, amount:TransferAmount): Promise<any> {
    try {
        const asset_id_arr = Array.from(asset_id);
        const amountBN = new BN(amount).toArray('le', 16);
        const tx = await api.tx.mantaPay.publicTransfer(
            { id: asset_id_arr, value: amountBN },
            address
        );
        await tx.signAndSend(signer);
    } catch (e) {
        console.log("Failed to execute public transfer.");
        console.error(e);
    }
}

/// Using sign on wallet and using signAndSend to polkadot.js transaction
/// This version is using `null` asset metdata. Only meaningful for to_private.
const sign_and_send_without_metadata = async (wasm: any, api: ApiPromise, signer: string, wasmWallet: Wallet, transaction: any, network: Network): Promise<void> => {
    const signed_transaction = await sign_transaction(api,wasm,wasmWallet,null,transaction,network);
    for (let i = 0; i < signed_transaction.txs.length; i++) {
        try {
            await signed_transaction.txs[i].signAndSend(signer, (status, events) => { });
        } catch (error) {
            console.error('Transaction failed', error);
        }
    }
}

/// Signs the a given transaction returning posts, transactions and batches.
/// assetMetaDataJson is optional, pass in null if transaction should not contain any.
const sign_transaction = async (api: ApiPromise, wasm: any, wasmWallet: Wallet, assetMetadataJson: any, transaction: Transaction, network: Network) => {
    let assetMetadata = null;
    if (assetMetadataJson) {
        assetMetadata = wasm.AssetMetadata.from_string(assetMetadataJson);
    }
    const networkType = wasm.Network.from_string(`"${network}"`);
    const posts = await wasmWallet.sign(transaction, assetMetadata, networkType);
    const transactions = [];
    for (let i = 0; i < posts.length; i++) {
        const convertedPost = transfer_post(posts[i]);
        const transaction = await mapPostToTransaction(convertedPost, api);
        transactions.push(transaction);
    }
    const txs = await transactionsToBatches(transactions, api);
    return {
        posts,
        transactions,
        txs
    }
}

/// Using sign on wallet and using signdAndSend to polkadot.js transaction
const sign_and_send = async (api: ApiPromise, signer: string, wasm: any, wasmWallet: Wallet, assetMetadataJson: any, transaction: Transaction, network: Network): Promise<void> => {

    const signed_transaction = await sign_transaction(api,wasm,wasmWallet,assetMetadataJson,transaction,network);

    for (let i = 0; i < signed_transaction.txs.length; i++) {
        try {
            await signed_transaction.txs[i].signAndSend(signer, (_status, _events) => { });
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
        const mint_tx = await api.tx.mantaPay.toPrivate(post);
        return mint_tx;
    } else if (sources == 0 && senders == 2 && receivers == 2 && sinks == 0) {
        const private_transfer_tx = await api.tx.mantaPay.privateTransfer(post);
        return private_transfer_tx;
    } else if (sources == 0 && senders == 2 && receivers == 1 && sinks == 1) {
        const reclaim_tx = await api.tx.mantaPay.toPublic(post);
        return reclaim_tx;
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

/// NOTE: `post` from manta-rs sign result should match runtime side data structure type.
const transfer_post = (post:any): any => {
    let json = JSON.parse(JSON.stringify(post));
    
    // transfer authorization_signature format
    if(json.authorization_signature != null){
        const scala = json.authorization_signature.signature.scalar;
        const nonce = json.authorization_signature.signature.nonce_point;
        json.authorization_signature.signature = [scala, nonce];
    }

    // transfer receiver_posts to match runtime side
    json.receiver_posts.map((x:any) => {
        // `message` is [[[..],[..],[..]]], change to [[..], [..], [..]]
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

        const light_pk = x.note.light_incoming_note.ciphertext.ephemeral_public_key; 
        // ciphertext is [u8; 96] on manta-rs, but runtime side is [[u8; 32]; 3]
        const light_cipher = x.note.light_incoming_note.ciphertext.ciphertext;
        const light_ciper0 = light_cipher.slice(0, 32);
        const light_ciper1 = light_cipher.slice(32, 64);
        const light_ciper2 = light_cipher.slice(64, 96);
        x.note.light_incoming_note.ephemeral_public_key = light_pk;
        x.note.light_incoming_note.ciphertext = [light_ciper0, light_ciper1, light_ciper2];
        delete x.note.light_incoming_note.header;

        // convert asset value to [u8; 16]
        x.utxo.public_asset.value = new BN(x.utxo.public_asset.value).toArray('le', 16);

        x.full_incoming_note = x.note;
        delete x.note;
    });

    // transfer sender_posts to match runtime side
    json.sender_posts.map((x:any) => {
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
    });

    return json
}

/// Convert uint8Array to number
/// This method assumes the uint8array is sorted in little-endian form
/// thus the smallest, least significant value is stored first.
const uint8ArrayToNumber = (uint8array: AssetId): number => {
    let value = 0;
    for (let i = uint8array.length-1; i >= 0; i--) {
        value = (value * 256) + uint8array[i];
    }
    return value;
}

/// @TODO: Proper implementation of this function
const numberToUint8Array = (assetIdNumber: number): AssetId => {
    // @TODO: the `number` type has value limitation, should change to `string` type.
    let bn = assetIdNumber.toString();
    let hex = BigInt(bn).toString(16);
    if (hex.length % 2) { hex = '0' + hex; }
  
    let len = 32;
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
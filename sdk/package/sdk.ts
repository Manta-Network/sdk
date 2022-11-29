import { ApiPromise, WsProvider } from '@polkadot/api';
import { base58Decode, base58Encode } from '@polkadot/util-crypto';
// TODO: remove this dependency with better signer integration
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import Api, {ApiConfig } from 'manta-wasm-wallet-api';
import axios from 'axios';
import BN from 'bn.js';
import config from './manta-config.json';
import { Transaction, Wallet } from 'manta-wasm-wallet';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { Version, Address, AssetId, InitApiResult, InitWasmResult, IMantaSdk } from "./sdk.interfaces";

const rpc = config.RPC;
const types = config.TYPES;
const DEFAULT_PULL_SIZE = config.DEFAULT_PULL_SIZE;
const SIGNER_URL = config.SIGNER_URL;

/// TODO: NFT stuff
const PRIVATE_ASSET_PREFIX = "p"
const NFT_AMOUNT = 1000000000000;

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

/// MantaSdk class
export class MantaSdk implements IMantaSdk {

    api: ApiPromise;
    signer: string;
    wasm: any;
    wasmWallet: Wallet;
    network: Network;
    environment: Environment;

    constructor(api: ApiPromise, signer: string, wasm: any, wasmWallet: Wallet, network: Network, environment: Environment) {
        this.api = api;
        this.signer = signer;
        this.wasm = wasm;
        this.wasmWallet = wasmWallet;
        this.network = network;
        this.environment = environment;
    }

    ///
    /// SDK methods
    ///

    /// Switches MantaSdk environment.
    /// Requirements: Must call initialWalletSync() after switching to a different
    /// environment, to pull the latest data before calling any other methods.
    async setEnvironment(environment: Environment): Promise<void> {

        if (environment === this.environment) {
            return;
        }

        const sdk = init(environment,this.network,this.signer);
        this.api = (await sdk).api;
        this.signer = (await sdk).signer;
        this.wasm = (await sdk).wasm;
        this.wasmWallet = (await sdk).wasmWallet;
        this.environment = environment;
    }

    /// Switches MantaSdk to a different network.
    /// Requirements: Must call initialWalletSync() after switching to a different
    /// network, to pull the latest data before calling any other methods.
    async setNetwork(network: Network): Promise<void> {

        if (network === this.network) {
            return;
        }

        const sdk = init(this.environment,network,this.signer);
        this.api = (await sdk).api;
        this.signer = (await sdk).signer;
        this.wasm = (await sdk).wasm;
        this.wasmWallet = (await sdk).wasmWallet;
        this.network = network;
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
    /// Requirements: Must be called once after creating an instance of MantaSdk 
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
        const data = await this.api.query.assetManager.assetIdMetadata(asset_id);
        const json = JSON.stringify(data.toHuman());
        const jsonObj = JSON.parse(json);
        this.api.query.assets;
        return jsonObj;
    }
    
    /// Returns the private balance of the currently connected zkAddress for the currently
    /// connected network.
    async privateBalance(asset_id: AssetId): Promise<string> {
        const balance = await get_private_balance(this.wasm, this.wasmWallet, asset_id);
        return balance;
    }

    async toPrivatePost(asset_id: AssetId, amount: number): Promise<void> {
        await to_private_by_post(this.wasm, this.wasmWallet, asset_id, amount, this.network);
    }
    
    async toPrivateSign(asset_id: AssetId, amount: number): Promise<void> {
        await to_private_by_sign(this.api, this.signer, this.wasm, this.wasmWallet, asset_id, amount, this.network);
    }

    async privateTransfer(asset_id: AssetId, amount: number, address: Address): Promise<void> {
        await private_transfer(this.api, this.signer, this.wasm, this.wasmWallet, asset_id, amount, address, this.network);
    }

    async toPublic(asset_id: AssetId, amount: number): Promise<void> {
        await to_public(this.api, this.signer, this.wasm, this.wasmWallet, asset_id, amount, this.network);
    }

    ///
    /// Non fungible token methods
    ///
    
    async toPrivateNFT(asset_id: number): Promise<void> {
        await to_private_nft(this.wasm, this.wasmWallet, asset_id, this.network);
    }

    async privateTransferNFT(asset_id: AssetId, address: Address): Promise<void> {
        await private_transfer_nft(this.api, this.signer, this.wasm, this.wasmWallet, asset_id, address, this.network)
    }

    async toPublicNFT(asset_id: number): Promise<void> {
        await to_public_nft(this.api, this.signer, this.wasm, this.wasmWallet, asset_id, this.network);
    }

}

// Initializes the MantaSdk class, given an optional address, this will be used
// for specifying which polkadot.js address to use upon initialization if there are several.
// If no address is specified then the first polkadot.js address will be used.
export async function init(env: Environment, network: Network, address: string=""): Promise<MantaSdk> {
    const {api, signer} = await init_api(env, address.toLowerCase(), network);
    const {wasm, wasmWallet} = await init_wasm_sdk(api, signer);
    const sdk = new MantaSdk(api,signer,wasm,wasmWallet,network,env);
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
                console.log("Account with selected address found!");
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
        wasmWallet
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
    console.log("privateAddressRaw:" + JSON.stringify(privateAddressRaw));
    // const privateAddressRaw = keys[0];
    // const privateAddressBytes = [
    //     ...privateAddressRaw.spend,
    //     ...privateAddressRaw.view
    // ];
    const privateAddressBytes = [
        ...privateAddressRaw.receiving_key
    ];
    console.log("privateAddressBytes:" + JSON.stringify(privateAddressBytes));
    const privateAddress = base58Encode(privateAddressBytes);
    return privateAddress;
};

/// Converts a given zkAddress to json.
function privateAddressToJson(privateAddress: Address): Address {
    const bytes = base58Decode(privateAddress);
    return JSON.stringify({
        spend: Array.from(bytes.slice(0, 32)),
        view: Array.from(bytes.slice(32))
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
async function to_private_by_post(wasm: any, wasmWallet: Wallet, asset_id: AssetId, to_private_amount: number, network: Network): Promise<void> {
    console.log("to_private transaction...");
    // let asset = asset_id.toU8a(); // [u8; 32]
    // const asset_arr = Array.from(uint8);
    const asset_ids = new Uint8Array(32);
    asset_ids[31] = asset_id;
    const asset_id_arr = Array.from(asset_ids);
    const txJson = `{ "ToPrivate": { "id": [${asset_id_arr}], "value": ${to_private_amount} }}`;
    console.log("txJson:" + txJson);
    const transaction = wasm.Transaction.from_string(txJson);
    console.log("transaction:" + JSON.stringify(transaction));
    const networkType = wasm.Network.from_string(`"${network}"`);
    try {
        const res = await wasmWallet.post(transaction, null, networkType);
        console.log("📜to_private result:" + res);
    } catch (error) {
        console.error('Transaction failed', error);
    }
}

/// Attempts to execute a "To Private" transaction by a sign + sign_and_send on
/// the currently connected wallet.
/// TODO: expose sign() method that return TransferPost.
async function to_private_by_sign(api: ApiPromise, signer: string, wasm: any, wasmWallet: Wallet, asset_id: AssetId, to_private_amount: number, network: Network): Promise<void> {
    console.log("to_private transaction...");
    const asset_ids = new Uint8Array(32);
    asset_ids[31] = asset_id;
    const asset_id_arr = Array.from(asset_ids);
    const txJson = `{ "ToPrivate": { "id": [${asset_id_arr}], "value": ${to_private_amount} }}`;
    const transaction = wasm.Transaction.from_string(txJson);
    try {
        await sign_and_send_without_metadata(wasm, api, signer, wasmWallet, transaction, network);
        console.log("📜to_private done");
    } catch (error) {
        console.error('Transaction failed', error);
    }
}

/// to_private transaction for NFT
/// TODO: fixed amount value
async function to_private_nft(wasm: any, wasmWallet: Wallet, asset_id: AssetId, network: Network): Promise<void> {
    console.log("to_private NFT transaction...");
    const txJson = `{ "ToPrivate": { "id": ${asset_id}, "value": "${NFT_AMOUNT}" }}`;
    const transaction = wasm.Transaction.from_string(txJson);
    const networkType = wasm.Network.from_string(`"${network}"`);
    try {
        const res = await wasmWallet.post(transaction, null, networkType);
        console.log("📜to_private NFT result:" + res);
    } catch (error) {
        console.error('Transaction failed', error);
    }
}

/// public transfer transaction
async function to_public(api: ApiPromise, signer: string, wasm: any, wasmWallet: Wallet, asset_id: AssetId, transfer_amount: number, network: Network): Promise<void> {
    console.log("to_public transaction of asset_id:" + asset_id);
    const txJson = `{ "ToPublic": { "id": ${asset_id}, "value": "${transfer_amount}" }}`;
    const transaction = wasm.Transaction.from_string(txJson);

    // construct asset metadata json by query api
    const asset_meta = await api.query.assetManager.assetIdMetadata(asset_id);

    const json = JSON.stringify(asset_meta.toHuman());
    const jsonObj = JSON.parse(json);
    console.log("asset metadata:" + json);
    const decimals = jsonObj["metadata"]["decimals"];
    const symbol = jsonObj["metadata"]["symbol"];
    const assetMetadataJson = `{ "decimals": ${decimals}, "symbol": "${PRIVATE_ASSET_PREFIX}${symbol}" }`;
    console.log("📜asset metadata:" + assetMetadataJson);

    await sign_and_send(api, signer, wasm, wasmWallet, assetMetadataJson, transaction, network);
    console.log("📜finish to public transfer.");
}

/// private transfer transaction
async function private_transfer(api: ApiPromise, signer: string, wasm: any, wasmWallet: Wallet, asset_id: AssetId, private_transfer_amount: number, to_private_address: Address, network: Network): Promise<void> {
    console.log("private_transfer transaction of asset_id:" + asset_id);
    const addressJson = privateAddressToJson(to_private_address);
    // asset_id: [u8; 32]
    const txJson = `{ "PrivateTransfer": [{ "id": ${asset_id}, "value": "${private_transfer_amount}" }, ${addressJson} ]}`;
    const transaction = wasm.Transaction.from_string(txJson);

    // construct asset metadata json by query api
    const asset_meta = await api.query.assetManager.assetIdMetadata(asset_id);
    // console.log(asset_meta.toHuman());
    const json = JSON.stringify(asset_meta.toHuman());
    const jsonObj = JSON.parse(json);
    console.log("asset metadata:" + json);
    const decimals = jsonObj["metadata"]["decimals"];
    const symbol = jsonObj["metadata"]["symbol"];
    const assetMetadataJson = `{ "decimals": ${decimals}, "symbol": "${PRIVATE_ASSET_PREFIX}${symbol}" }`;
    console.log("📜asset metadata:" + assetMetadataJson);

    await sign_and_send(api, signer, wasm, wasmWallet, assetMetadataJson, transaction, network);
    console.log("📜finish private transfer.");
}

/// private transfer transaction for NFT
/// TODO: fixed amount value and asset metadata
async function private_transfer_nft(api: ApiPromise, signer: string, wasm: any, wasmWallet: Wallet, asset_id: AssetId, to_private_address: Address, network: Network): Promise<void> {
    console.log("private_transfer NFT transaction...");
    const addressJson = privateAddressToJson(to_private_address);
    const txJson = `{ "PrivateTransfer": [{ "id": ${asset_id}, "value": "${NFT_AMOUNT}" }, ${addressJson} ]}`;
    const transaction = wasm.Transaction.from_string(txJson);

    // TODO: symbol query from chain storage.
    // Can we passing `None` as assetMetadata, because parameter type of 
    // `sign(tx, metadata: Option<AssetMetadata>)` on manta-sdk/wallet?
    const assetMetadataJson = `{ "decimals": 12, "symbol": "pNFT" }`;

    await sign_and_send(api, signer, wasm, wasmWallet, assetMetadataJson, transaction, network);
    console.log("📜finish private nft transfer.");
}

/// to_public transaction for NFT
/// TODO: fixed amount value and asset metadata
async function to_public_nft(api: ApiPromise, signer: string, wasm: any, wasmWallet: Wallet, asset_id: AssetId, network: Network): Promise<void> {
    console.log("to_public NFT transaction...");
    const txJson = `{ "ToPublic": { "id": ${asset_id}, "value": "${NFT_AMOUNT}" }}`;
    const transaction = wasm.Transaction.from_string(txJson);
    const assetMetadataJson = `{ "decimals": 12 , "symbol": "pNFT" }`;

    await sign_and_send(api, signer, wasm, wasmWallet, assetMetadataJson, transaction, network);
    console.log("📜finish to public nft transfer.");
};

/// Converts old transferpost to new transferpost.
const convertToOldPost = (post:any): any => {
    // need to iterate over all receiverPosts and convert EncryptedNote from new
    // format of EncryptedNote { header: (), Ciphertext {...} } to old format:
    // EncryptedNote { ephermeral_public_key: [], ciphertext: [] }

    let postCopy = JSON.parse(JSON.stringify(post));
    postCopy.receiver_posts.map((x:any) => {x.encrypted_note = x.encrypted_note.ciphertext});
    return postCopy
}

/// Using sign on wallet and using signAndSend to polkadot.js transaction
/// This version is using `null` asset metdata. Only meaningful for to_private.
const sign_and_send_without_metadata = async (wasm: any, api: ApiPromise, signer: string, wasmWallet: Wallet, transaction: any, network: Network): Promise<void> => {
    const networkType = wasm.Network.from_string(`"${network}"`);
    const posts = await wasmWallet.sign(transaction, null, networkType);
    const transactions = [];
    for (let i = 0; i < posts.length; i++) {
        console.log("post:" + JSON.stringify(posts[i]));
        // let convertedPost = convertToOldPost(posts[i]);
        // console.log("convert post:" + JSON.stringify(convertedPost));
        const transaction = await mapPostToTransaction(posts[i], api);
        console.log("transaction:" + JSON.stringify(transaction));
        transactions.push(transaction);
    }
    const txs = await transactionsToBatches(transactions, api);
    for (let i = 0; i < txs.length; i++) {
        try {
            await txs[i].signAndSend(signer, (status, events) => { });
        } catch (error) {
            console.error('Transaction failed', error);
        }
    }
}

/// Using sign on wallet and using signdAndSend to polkadot.js transaction
const sign_and_send = async (api: ApiPromise, signer: string, wasm: any, wasmWallet: Wallet, assetMetadataJson: any, transaction: Transaction, network: Network): Promise<void> => {
    const assetMetadata = wasm.AssetMetadata.from_string(assetMetadataJson);
    const networkType = wasm.Network.from_string(`"${network}"`);
    const posts = await wasmWallet.sign(transaction, assetMetadata, networkType);
    const transactions = [];
    for (let i = 0; i < posts.length; i++) {
        let convertedPost = convertToOldPost(posts[i]);
        const transaction = await mapPostToTransaction(convertedPost, api);
        transactions.push(transaction);
    }
    const txs = await transactionsToBatches(transactions, api);
    for (let i = 0; i < txs.length; i++) {
        try {
            await txs[i].signAndSend(signer, (_status, _events) => { });
        } catch (error) {
            console.error('Transaction failed', error);
        }
    }
}

/// Maps a given `post` to a known transaction type, either Mint, Private Transfer or Reclaim.
async function mapPostToTransaction(post: any, api: ApiPromise): Promise<SubmittableExtrinsic<"promise", any>> {
    post.sources = post.sources.map((source:any) => new BN(source));
    post.sinks = post.sinks.map((sink:any) => new BN(sink));

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

/// Returns private asset balance for a given `asset_id` for the associated zkAddress.
function get_private_balance(wasm: any, wasmWallet: Wallet, asset_id: AssetId): string {
    const balance = wasmWallet.balance(asset_id);
    console.log(`💰private asset ${asset_id} balance:` + balance);
    return balance;
}
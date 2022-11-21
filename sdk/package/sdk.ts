import { ApiPromise, WsProvider } from '@polkadot/api';
import { base58Decode, base58Encode } from '@polkadot/util-crypto';
// TODO: remove this dependency with better signer integration
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';

import Api, { ApiConfig } from 'manta-wasm-wallet-api';
import axios from 'axios';
import BN from 'bn.js';
import config from './manta-config.json';
import { Transaction, Wallet } from 'manta-wasm-wallet';
import { SubmittableExtrinsic } from '@polkadot/api/types';

const rpc = config.RPC;
const types = config.TYPES;
const DEFAULT_PULL_SIZE = config.DEFAULT_PULL_SIZE;
const SIGNER_URL = config.SIGNER_URL;

/// TODO: NFT stuff
const PRIVATE_ASSET_PREFIX = "p"
const NFT_AMOUNT = 1000000000000;

export enum Environment {
    Development = "DEV",
    Production = "PROD"
}

interface InitApiResult {
    api: ApiPromise,
    signer: string
}

interface InitWasmResult {
    wasm: any,
    wasmWallet: Wallet
}

type Version = string;
type PrivateAddress = string;

type AssetId = number;


/// Get blockchain connection url by env constant value
// TODO: better env variable handling
function env_url(env: Environment): string {
    var url = config.BLOCKCHAIN_URL_LOCAL;
    if(env == Environment.Production) {
        url = config.BLOCKCHAIN_URL;
    }
    return url;
}

/// Polkadot.js API with web3Extension
export async function init_api(env: Environment): Promise<InitApiResult> {
    const provider = new WsProvider(env_url(env));
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
        console.error("Polkadot browser extension missing. https://polkadot.js.org/extension/")
        return;
    }
    const allAccounts = await web3Accounts();
    const account = allAccounts[0];
    const injector = await web3FromSource(account.meta.source);
    const signer = account.address;
    console.log("address:" + account.address);
    api.setSigner(injector.signer)
    return {
        api,
        signer
    };
}

export async function init_api_config(env: Environment): Promise<ApiPromise> {
    const provider = new WsProvider(env_url(env));
    const api = await ApiPromise.create({ provider, types, rpc });
    const [chain, nodeName, nodeVersion] = await Promise.all([
        api.rpc.system.chain(),
        api.rpc.system.name(),
        api.rpc.system.version()
    ]);
    console.log(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`);
    return api;
}

// Compile error: Module parse failed: Unexpected token .... => :SDK or : Promise<Sdk>
// You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
// import {SDK, Sdk} from './sdk.interfaces';
// export function init_chain(env): SDK
// async function init_sdk(env): Promise<Sdk>

// Compile ok, but not works
// TypeError: sdks.private_address is not a function
export async function init_chain(env: Environment): Promise<any> {
    const sdks = await init_sdk(env);
    return {
        sdks
    }
}
async function init_sdk(env: Environment): Promise<any> {
    const {api, signer} = await init_api(env);
    const {wasm, wasmWallet} = await init_wasm_sdk(api, signer);
    return {
        private_address: async() => {
            await getPrivateAddress(wasm, wasmWallet);
        },
        init_synchronize: async() => {
            await init_sync(wasmWallet);
        },
    }
}

/// Initialize wasm wallet sdk
export async function init_wasm_sdk(api: ApiPromise, signer: string): Promise<InitWasmResult> {
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

/// Get signer version
export async function get_signer_version(): Promise<Version> {
    const version_res = await axios.get(`${SIGNER_URL}version`, {
        timeout: 1500
    });
    const version: Version = version_res.data;
    return version;
}

/// Get private address
export async function getPrivateAddress(wasm: any, wallet:Wallet): Promise<PrivateAddress> {
    const keys = await wallet.receiving_keys(
        new wasm.ReceivingKeyRequest('GetAll')
    );
    const privateAddressRaw = keys[0];
    const privateAddressBytes = [
        ...privateAddressRaw.spend,
        ...privateAddressRaw.view
    ];
    const privateAddress = base58Encode(privateAddressBytes);
    console.log("private address:" + privateAddress);
    return privateAddress;
};

export function privateAddressToJson(privateAddress: PrivateAddress): PrivateAddress {
    const bytes = base58Decode(privateAddress);
    return JSON.stringify({
        spend: Array.from(bytes.slice(0, 32)),
        view: Array.from(bytes.slice(32))
    });
};

/// Initial synchronization with signer
export async function init_sync(wasmWallet: Wallet): Promise<void> {
    console.log('Beginning initial sync');
    const startTime = performance.now();
    await wasmWallet.restart();
    const endTime = performance.now();
    console.log(
        `Initial sync finished in ${(endTime - startTime) / 1000} seconds`
    );
}

/// to_private transaction by post on wallet
export async function to_private_by_post(wasm: any, wasmWallet: Wallet, asset_id: AssetId, to_private_amount: number): Promise<void> {
    console.log("to_private transaction...");
    const txJson = `{ "Mint": { "id": ${asset_id}, "value": "${to_private_amount}" }}`;
    const transaction = wasm.Transaction.from_string(txJson);
    try {
        const res = await wasmWallet.post(transaction, null);
        console.log("📜to_private result:" + res);
    } catch (error) {
        console.error('Transaction failed', error);
    }
}

/// to_private can also using sign + signAndSend
/// TODO: expose sign() method that return TransferPost.
export async function to_private_by_sign(api: ApiPromise, signer: string, wasm: any, wasmWallet: Wallet, asset_id: AssetId, to_private_amount: number): Promise<void> {
    console.log("to_private transaction...");
    const txJson = `{ "Mint": { "id": ${asset_id}, "value": "${to_private_amount}" }}`;
    const transaction = wasm.Transaction.from_string(txJson);
    try {
        await sign_and_send_without_metdata(api, signer, wasmWallet, transaction);
        console.log("📜to_private done");
    } catch (error) {
        console.error('Transaction failed', error);
    }
}

/// to_private transaction for NFT
/// TODO: fixed amount value
export async function to_private_nft(wasm: any, wasmWallet: Wallet, asset_id: AssetId): Promise<void> {
    console.log("to_private NFT transaction...");
    const txJson = `{ "Mint": { "id": ${asset_id}, "value": "${NFT_AMOUNT}" }}`;
    const transaction = wasm.Transaction.from_string(txJson);
    try {
        const res = await wasmWallet.post(transaction, null);
        console.log("📜to_private NFT result:" + res);
    } catch (error) {
        console.error('Transaction failed', error);
    }
}

/// private transfer transaction
export async function private_transfer(api: ApiPromise, signer: string, wasm: any, wasmWallet: Wallet, asset_id: AssetId, private_transfer_amount: number, to_private_address: PrivateAddress): Promise<void> {
    console.log("private_transfer transaction of asset_id:" + asset_id);
    const addressJson = privateAddressToJson(to_private_address);
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

    await sign_and_send(api, signer, wasm, wasmWallet, assetMetadataJson, transaction);
    console.log("📜finish private transfer 1 pDOL.");
}

/// private transfer transaction for NFT
/// TODO: fixed amount value and asset metadata
export async function private_transfer_nft(api: ApiPromise, signer: string, wasm: any, wasmWallet: Wallet, asset_id: AssetId, to_private_address: PrivateAddress): Promise<void> {
    console.log("private_transfer NFT transaction...");
    const addressJson = privateAddressToJson(to_private_address);
    const txJson = `{ "PrivateTransfer": [{ "id": ${asset_id}, "value": "${NFT_AMOUNT}" }, ${addressJson} ]}`;
    const transaction = wasm.Transaction.from_string(txJson);

    // TODO: symbol query from chain storage.
    // Can we passing `None` as assetMetadata, because parameter type of 
    // `sign(tx, metadata: Option<AssetMetadata>)` on manta-sdk/wallet?
    const assetMetadataJson = `{ "decimals": 12, "symbol": "pNFT" }`;

    await sign_and_send(api, signer, wasm, wasmWallet, assetMetadataJson, transaction);
    console.log("📜finish private transfer 1 pDOL.");
}

/// to_public transaction for NFT
/// TODO: fixed amount value and asset metadata
export async function to_public_nft(api: ApiPromise, signer: string, wasm: any, wasmWallet: Wallet, asset_id: AssetId): Promise<void> {
    console.log("to_public NFT transaction...");
    const txJson = `{ "Reclaim": { "id": ${asset_id}, "value": "${NFT_AMOUNT}" }}`;
    const transaction = wasm.Transaction.from_string(txJson);
    const assetMetadataJson = `{ "decimals": 12 , "symbol": "pNFT" }`;

    await sign_and_send(api, signer, wasm, wasmWallet, assetMetadataJson, transaction);
    console.log("📜finish to public transfer 1 pDOL.");
};

/// Using sign on wallet and using signdAndSend to polkadot.js transaction
/// This version is using `null` asset metdata. only meaningul for to_private.
const sign_and_send_without_metdata = async (api: ApiPromise, signer: string, wasmWallet: Wallet, transaction: any): Promise<void> => {
    const posts = await wasmWallet.sign(transaction, null);
    const transactions = [];
    for (let i = 0; i < posts.length; i++) {
        const transaction = await mapPostToTransaction(posts[i], api);
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
const sign_and_send = async (api: ApiPromise, signer: string, wasm: any, wasmWallet: Wallet, assetMetadataJson: any, transaction: Transaction): Promise<void> => {
    const assetMetadata = wasm.AssetMetadata.from_string(assetMetadataJson);
    const posts = await wasmWallet.sign(transaction, assetMetadata);
    const transactions = [];
    for (let i = 0; i < posts.length; i++) {
        const transaction = await mapPostToTransaction(posts[i], api);
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

/// inner method
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

/// Get private asset balance
export function get_private_balance(wasm: any, wasmWallet: Wallet, asset_id: AssetId, info: string): string {
    const balance = wasmWallet.balance(new wasm.AssetId(asset_id));
    console.log(`💰private asset ${asset_id} balance[${info}]:` + balance);
    return balance;
}
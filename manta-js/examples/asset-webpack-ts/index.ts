// @ts-ignore
import { MantaPrivateWallet, SbtMantaPrivateWallet, Environment, Network, MantaUtilities } from 'manta.js';
import BN from 'bn.js';
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import axios from "axios";
import { u8aToBn, hexToU8a, u8aToHex } from '@polkadot/util';
import { Wallet } from "@ethersproject/wallet";
import { ethers } from 'ethers';
import { Keyring } from '@polkadot/api';
import { encodeAddress } from "@polkadot/keyring";
import { ApiPromise, WsProvider } from '@polkadot/api';
import { cryptoWaitReady } from '@polkadot/util-crypto';

const privateWalletConfig = {
    environment: Environment.Development,
    network: Network.Manta,
    loggingEnabled: true
}
// const privateWalletConfig = {
//     environment: Environment.Production,
//     network: Network.Dolphin,
//     loggingEnabled: true
// }

async function main() {
    // const id_proof = '{"identifier":{"is_transparent":false,"utxo_commitment_randomness":[218,12,198,205,243,45,111,55,97,232,107,40,237,202,174,102,12,100,161,170,141,2,173,101,117,161,177,116,146,37,81,31]},"asset":{"id":[82,77,144,171,218,215,31,37,190,239,170,153,12,42,235,151,22,238,79,66,34,183,22,37,117,55,167,12,74,225,51,45],"value":1}}';
    // const privateWallet = await SbtMantaPrivateWallet.initSBT(privateWalletConfig);
    // const proof_json = await identityProofGen(privateWallet, id_proof);
    // console.log("proof json:" + proof_json);

    // await reserve_assetId();
    await ethPompMint();
    // await ethMintSbt();
    // await toSBTPrivateTest(false);
    // await reserveAndMints();
    // await toPrivateOnlySignTest();
    //await toPrivateTest();
    //await privateTransferOnlySignTest();
    //await privateTransferTest();
    //await toPublicOnlySignTest();
    // await toPublicTest();
    //await publicTransferTest();
    //await publicTransferOnlySignTest();
    // await tx_data_test2();
    console.log("END");
}

const tx_data_test = async () => {
    const privateWallet = await SbtMantaPrivateWallet.initSBT(privateWalletConfig);
    const polkadotConfig = await getPolkadotSignerAndAddress();
    await privateWallet.initialWalletSync();

    // const networkType = privateWallet.wasm.Network.from_string(Network.Dolphin);
    const post = `{"authorization_signature":null,"asset_id":[24,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"sources":[[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],"sender_posts":[],"receiver_posts":[{"utxo":{"is_transparent":false,"public_asset":{"id":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"value":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},"commitment":[155,117,198,96,29,146,191,84,96,149,48,211,58,0,113,90,76,181,231,199,87,181,244,59,37,143,221,116,62,214,136,46]},"full_incoming_note":{"address_partition":88,"incoming_note":{"ciphertext":[[249,233,105,114,82,204,31,87,183,23,21,189,14,112,255,113,227,222,133,193,159,108,195,53,163,33,12,153,32,213,116,36],[159,203,209,223,95,133,69,97,246,191,219,54,12,8,170,215,24,85,0,144,98,10,231,84,128,143,17,112,238,126,202,19],[123,197,190,42,153,198,120,107,153,254,211,92,228,245,177,194,51,215,55,53,252,12,118,6,73,103,174,19,217,143,152,43]],"tag":[189,68,145,159,152,153,37,221,190,71,154,169,171,27,123,82,126,144,130,57,26,94,247,35,130,195,91,165,246,133,28,1],"ephemeral_public_key":[164,7,246,172,247,235,4,35,241,72,8,4,175,164,123,146,7,88,141,35,167,251,167,32,60,133,216,80,109,201,51,14]},"light_incoming_note":{"ciphertext":[[78,211,208,221,18,186,95,17,207,23,71,166,112,119,131,218,3,116,114,73,121,54,216,117,220,41,182,150,184,251,105,15],[10,148,6,40,140,24,192,123,83,21,151,0,112,93,121,36,23,107,135,65,175,227,222,179,68,36,253,18,123,228,118,102],[229,253,239,200,105,6,237,203,103,1,69,147,36,38,4,34,113,24,12,89,205,52,199,249,215,186,45,81,190,158,140,20]],"ephemeral_public_key":[164,7,246,172,247,235,4,35,241,72,8,4,175,164,123,146,7,88,141,35,167,251,167,32,60,133,216,80,109,201,51,14]}}}],"sinks":[],"proof":[233,41,67,218,94,196,137,1,129,3,197,220,206,163,124,223,209,198,160,166,240,164,189,55,17,164,29,107,6,16,149,155,116,208,56,240,153,42,69,168,60,216,108,79,53,205,69,201,255,138,80,94,221,95,225,47,13,50,51,108,44,61,81,35,129,46,79,31,102,29,153,10,13,208,55,100,90,58,42,183,111,49,157,249,6,87,80,1,56,88,246,39,158,88,147,135,175,178,144,178,217,178,99,185,235,88,190,184,185,103,203,180,0,215,46,3,22,16,157,141,121,67,119,245,213,224,164,7],"sink_accounts":[]}`
    // const transfer_post = privateWallet.wasm.ConfigTransferPost.from_string(post);

    // const tx_data = await privateWallet.wasmWallet.transaction_data(transfer_post, networkType);
    // const tx_data = await privateWallet.transactionData(transfer_post);
    // console.log("tx data:" + JSON.stringify(tx_data));
   
}

const tx_data_test2 = async () => {
    const privateWallet = await SbtMantaPrivateWallet.initSBT(privateWalletConfig);
    const polkadotConfig = await getPolkadotSignerAndAddress();
    await privateWallet.initialWalletSync();

    // const networkType = privateWallet.wasm.Network.from_string(Network.Dolphin);
    const post = `{"authorization_signature":null,"asset_id":[24,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"sources":[[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],"sender_posts":[],"receiver_posts":[{"utxo":{"is_transparent":false,"public_asset":{"id":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"value":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},"commitment":[155,117,198,96,29,146,191,84,96,149,48,211,58,0,113,90,76,181,231,199,87,181,244,59,37,143,221,116,62,214,136,46]},"full_incoming_note":{"address_partition":88,"incoming_note":{"ciphertext":[[249,233,105,114,82,204,31,87,183,23,21,189,14,112,255,113,227,222,133,193,159,108,195,53,163,33,12,153,32,213,116,36],[159,203,209,223,95,133,69,97,246,191,219,54,12,8,170,215,24,85,0,144,98,10,231,84,128,143,17,112,238,126,202,19],[123,197,190,42,153,198,120,107,153,254,211,92,228,245,177,194,51,215,55,53,252,12,118,6,73,103,174,19,217,143,152,43]],"tag":[189,68,145,159,152,153,37,221,190,71,154,169,171,27,123,82,126,144,130,57,26,94,247,35,130,195,91,165,246,133,28,1],"ephemeral_public_key":[164,7,246,172,247,235,4,35,241,72,8,4,175,164,123,146,7,88,141,35,167,251,167,32,60,133,216,80,109,201,51,14]},"light_incoming_note":{"ciphertext":[[78,211,208,221,18,186,95,17,207,23,71,166,112,119,131,218,3,116,114,73,121,54,216,117,220,41,182,150,184,251,105,15],[10,148,6,40,140,24,192,123,83,21,151,0,112,93,121,36,23,107,135,65,175,227,222,179,68,36,253,18,123,228,118,102],[229,253,239,200,105,6,237,203,103,1,69,147,36,38,4,34,113,24,12,89,205,52,199,249,215,186,45,81,190,158,140,20]],"ephemeral_public_key":[164,7,246,172,247,235,4,35,241,72,8,4,175,164,123,146,7,88,141,35,167,251,167,32,60,133,216,80,109,201,51,14]}}}],"sinks":[],"proof":[233,41,67,218,94,196,137,1,129,3,197,220,206,163,124,223,209,198,160,166,240,164,189,55,17,164,29,107,6,16,149,155,116,208,56,240,153,42,69,168,60,216,108,79,53,205,69,201,255,138,80,94,221,95,225,47,13,50,51,108,44,61,81,35,129,46,79,31,102,29,153,10,13,208,55,100,90,58,42,183,111,49,157,249,6,87,80,1,56,88,246,39,158,88,147,135,175,178,144,178,217,178,99,185,235,88,190,184,185,103,203,180,0,215,46,3,22,16,157,141,121,67,119,245,213,224,164,7],"sink_accounts":[]}`

    const config_post: any = {"authorization_signature":null,"body": {"asset_id":[24,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"sources":[[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],"sender_posts":[],"receiver_posts":[{"utxo":{"is_transparent":false,"public_asset":{"id":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"value":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},"commitment":[155,117,198,96,29,146,191,84,96,149,48,211,58,0,113,90,76,181,231,199,87,181,244,59,37,143,221,116,62,214,136,46]},"full_incoming_note":{"address_partition":88,"incoming_note":{"ciphertext":[[249,233,105,114,82,204,31,87,183,23,21,189,14,112,255,113,227,222,133,193,159,108,195,53,163,33,12,153,32,213,116,36],[159,203,209,223,95,133,69,97,246,191,219,54,12,8,170,215,24,85,0,144,98,10,231,84,128,143,17,112,238,126,202,19],[123,197,190,42,153,198,120,107,153,254,211,92,228,245,177,194,51,215,55,53,252,12,118,6,73,103,174,19,217,143,152,43]],"tag":[189,68,145,159,152,153,37,221,190,71,154,169,171,27,123,82,126,144,130,57,26,94,247,35,130,195,91,165,246,133,28,1],"ephemeral_public_key":[164,7,246,172,247,235,4,35,241,72,8,4,175,164,123,146,7,88,141,35,167,251,167,32,60,133,216,80,109,201,51,14]},"light_incoming_note":{"ciphertext":[[78,211,208,221,18,186,95,17,207,23,71,166,112,119,131,218,3,116,114,73,121,54,216,117,220,41,182,150,184,251,105,15],[10,148,6,40,140,24,192,123,83,21,151,0,112,93,121,36,23,107,135,65,175,227,222,179,68,36,253,18,123,228,118,102],[229,253,239,200,105,6,237,203,103,1,69,147,36,38,4,34,113,24,12,89,205,52,199,249,215,186,45,81,190,158,140,20]],"ephemeral_public_key":[164,7,246,172,247,235,4,35,241,72,8,4,175,164,123,146,7,88,141,35,167,251,167,32,60,133,216,80,109,201,51,14]}}}],"sinks":[],"proof":[233,41,67,218,94,196,137,1,129,3,197,220,206,163,124,223,209,198,160,166,240,164,189,55,17,164,29,107,6,16,149,155,116,208,56,240,153,42,69,168,60,216,108,79,53,205,69,201,255,138,80,94,221,95,225,47,13,50,51,108,44,61,81,35,129,46,79,31,102,29,153,10,13,208,55,100,90,58,42,183,111,49,157,249,6,87,80,1,56,88,246,39,158,88,147,135,175,178,144,178,217,178,99,185,235,88,190,184,185,103,203,180,0,215,46,3,22,16,157,141,121,67,119,245,213,224,164,7]},"sink_accounts":[]};
    const transfer_post = privateWallet.wasm.ConfigTransferPost.from_string(JSON.stringify(config_post));

    // const receiver_post = [{"utxo":{"is_transparent":false,"public_asset":{"id":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"value":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},"commitment":[155,117,198,96,29,146,191,84,96,149,48,211,58,0,113,90,76,181,231,199,87,181,244,59,37,143,221,116,62,214,136,46]},"full_incoming_note":{"address_partition":88,"incoming_note":{"ciphertext":[[249,233,105,114,82,204,31,87,183,23,21,189,14,112,255,113,227,222,133,193,159,108,195,53,163,33,12,153,32,213,116,36],[159,203,209,223,95,133,69,97,246,191,219,54,12,8,170,215,24,85,0,144,98,10,231,84,128,143,17,112,238,126,202,19],[123,197,190,42,153,198,120,107,153,254,211,92,228,245,177,194,51,215,55,53,252,12,118,6,73,103,174,19,217,143,152,43]],"tag":[189,68,145,159,152,153,37,221,190,71,154,169,171,27,123,82,126,144,130,57,26,94,247,35,130,195,91,165,246,133,28,1],"ephemeral_public_key":[164,7,246,172,247,235,4,35,241,72,8,4,175,164,123,146,7,88,141,35,167,251,167,32,60,133,216,80,109,201,51,14]},"light_incoming_note":{"ciphertext":[[78,211,208,221,18,186,95,17,207,23,71,166,112,119,131,218,3,116,114,73,121,54,216,117,220,41,182,150,184,251,105,15],[10,148,6,40,140,24,192,123,83,21,151,0,112,93,121,36,23,107,135,65,175,227,222,179,68,36,253,18,123,228,118,102],[229,253,239,200,105,6,237,203,103,1,69,147,36,38,4,34,113,24,12,89,205,52,199,249,215,186,45,81,190,158,140,20]],"ephemeral_public_key":[164,7,246,172,247,235,4,35,241,72,8,4,175,164,123,146,7,88,141,35,167,251,167,32,60,133,216,80,109,201,51,14]}}}];
    // const receiver_posts = privateWallet.wasm.ReceiverPost.from_string(receiver_post);

    // const asset_id = [24,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    // const asset_ids = privateWallet.wasm.ConfigTransferPost.from_string(asset_id);

    // const jsonObj = JSON.parse(post);
    // const auth = JSON.stringify(jsonObj.authorization_signature);
    // const asset_id = JSON.stringify(jsonObj.asset_id);
    // const sources = JSON.stringify(jsonObj.sources);
    // const sender_posts = JSON.stringify(jsonObj.sender_posts);
    // const receiver_posts = JSON.stringify(jsonObj.receiver_posts);
    // const sinks = JSON.stringify(jsonObj.sinks);
    // const proof = JSON.stringify(jsonObj.proof);
    // const sink_accounts = JSON.stringify(jsonObj.sink_accounts);
    // console.log("auth:" + auth);
    // console.log(asset_id);
    // console.log(receiver_posts);
    // const transfer_post = new privateWallet.wasm.TransferPost(auth, asset_id, sources, sender_posts, receiver_posts, sinks, proof, sink_accounts);

    // const tx_data = await privateWallet.wasmWallet.transaction_data(transfer_post, networkType);
    // const tx_data = await privateWallet.transactionData(transfer_post);
    // console.log("tx data:" + JSON.stringify(tx_data));
   
}

// Get Polkadot JS Signer and Polkadot JS account address.
const getPolkadotSignerAndAddress = async () => {
    const extensions = await web3Enable('Polkadot App');
    if (extensions.length === 0) {
        throw new Error("Polkadot browser extension missing. https://polkadot.js.org/extension/");
    }
    const allAccounts = await web3Accounts();
    let account = allAccounts[0];

    const injector = await web3FromSource(account.meta.source);
    const polkadotSigner = injector.signer;
    const polkadotAddress = account.address;
    return {
        polkadotSigner,
        polkadotAddress
    }
}

/// Test to publicly transfer 10 KMA.
const publicTransferTest = async () => {
    const privateWalletConfig = {
        environment: Environment.Development,
        network: Network.Calamari
    }

    const privateWallet = await MantaPrivateWallet.init(privateWalletConfig);
    await privateWallet.api.isReady;
    const polkadotConfig = await getPolkadotSignerAndAddress();

    const assetId = new BN("1"); // KMA
    const amount = new BN("10000000000000"); // 10 units

    const destinationAddress = "5FHT5Rt1oeqAytX5KSn4ZZQdqN8oEa5Y81LZ5jadpk41bdoM";

    const senderBalance = await MantaUtilities.getPublicBalance(privateWallet.api, assetId, polkadotConfig.polkadotAddress);
    console.log("Sender Balance:" + JSON.stringify(senderBalance.toString()));

    const destinationBalance = await MantaUtilities.getPublicBalance(privateWallet.api, assetId, destinationAddress);
    console.log("Destination Balance:" + JSON.stringify(destinationBalance.toString()));

    await MantaUtilities.publicTransferSend(privateWallet.api, assetId, amount, destinationAddress, polkadotConfig.polkadotAddress, polkadotConfig.polkadotSigner);

    await new Promise(r => setTimeout(r, 10000));

    const senderBalanceAfterTransfer = await MantaUtilities.getPublicBalance(privateWallet.api, assetId,polkadotConfig.polkadotAddress);
    console.log("Sender Balance After:" + JSON.stringify(senderBalanceAfterTransfer.toString()));

    const destinationBalanceAfterTransfer = await MantaUtilities.getPublicBalance(privateWallet.api, assetId, destinationAddress);
    console.log("Dest Balance After:" + JSON.stringify(destinationBalanceAfterTransfer.toString()));
}

/// Test to publicly transfer 5 zkKMA.
const publicTransferOnlySignTest = async () => {

    const privateWalletConfig = {
        environment: Environment.Production,
        network: Network.Dolphin
    }

    const privateWallet = await MantaPrivateWallet.init(privateWalletConfig);

    const destinationAddress = "5FHT5Rt1oeqAytX5KSn4ZZQdqN8oEa5Y81LZ5jadpk41bdoM";
    const assetId = new BN("1"); // DOL
    const amount = new BN("10000000000000"); // 10 units

    let tx = MantaUtilities.publicTransferBuild(privateWallet.api, assetId, amount, destinationAddress);

    console.log("The resulting tx payload is : ", tx);
}

/// Test to privately transfer 5 pDOL.
const privateTransferTest = async () => {
    const privateWalletConfig = {
        environment: Environment.Development,
        network: Network.Calamari
    }

    const privateWallet = await MantaPrivateWallet.init(privateWalletConfig);
    await privateWallet.api.isReady;
    const polkadotConfig = await getPolkadotSignerAndAddress();

    const assetId = new BN("1"); // KMA
    const amount = new BN("5000000000000"); // 5 units

    const toPrivateTestAddress = "3UG1BBvv7viqwyg1QKsMVarnSPcdiRQ1aL2vnTgwjWYX";

    await privateWallet.initialWalletSync();

    const initialPrivateBalance = await privateWallet.getPrivateBalance(assetId);
    console.log("The initial private balance is: ", initialPrivateBalance.toString());

    await privateWallet.privateTransferSend(assetId, amount, toPrivateTestAddress, polkadotConfig.polkadotSigner, polkadotConfig.polkadotAddress);

    while (true) {

        await new Promise(r => setTimeout(r, 5000));
        console.log("Syncing with ledger...");
        await privateWallet.walletSync();
        let newPrivateBalance = await privateWallet.getPrivateBalance(assetId);
        console.log("Private Balance after sync: ", newPrivateBalance.toString());

        if (initialPrivateBalance !== newPrivateBalance) {
            console.log("Detected balance change after sync!");
            console.log("Old balance: ", initialPrivateBalance.toString());
            console.log("New balance: ", newPrivateBalance.toString());
            break;
        }
    }
}

const privateTransferOnlySignTest = async () => {
    const privateWalletConfig = {
        environment: Environment.Development,
        network: Network.Calamari
    }

    const privateWallet = await MantaPrivateWallet.init(privateWalletConfig);
    const polkadotConfig = await getPolkadotSignerAndAddress();

    const assetId = new BN("1"); // KMA
    const amount = new BN("5000000000000"); // 5 units

    const toPrivateTestAddress = "3UG1BBvv7viqwyg1QKsMVarnSPcdiRQ1aL2vnTgwjWYX";

    await privateWallet.initialWalletSync();

    const initialPrivateBalance = await privateWallet.getPrivateBalance(assetId);
    console.log("The initial private balance is: ", initialPrivateBalance.toString());

    let signResult = await privateWallet.privateTransferBuild(assetId, amount, toPrivateTestAddress, polkadotConfig.polkadotSigner, polkadotConfig.polkadotAddress);

    console.log("The result of the signing: ", signResult);

    console.log("Full payload for use directly on the Manta Network parachains: ", JSON.stringify(signResult.txs[0]));

    console.log("For xcm remote transact payload use: " + MantaUtilities.removeLeadingBytesFromHexString(JSON.stringify(signResult.txs[0]), 3, false));
}


/// Test to sign a transaction that converts 10 KMA to zkKMA,
/// without publishing the transaction.
const toPrivateOnlySignTest = async () => {

    const privateWalletConfig = {
        environment: Environment.Development,
        network: Network.Calamari,
    }

    const privateWallet = await MantaPrivateWallet.init(privateWalletConfig);
    await privateWallet.api.isReady;
    const polkadotConfig = await getPolkadotSignerAndAddress();

    const zkAddress = await privateWallet.getZkAddress();
    console.log("The zk address is: ", zkAddress);

    const assetId = new BN("1"); // KMA
    const amount = new BN("10000000000000"); // 10 units

    await privateWallet.initialWalletSync();

    const initialPrivateBalance = await privateWallet.getPrivateBalance(assetId);
    console.log("The initial private balance is: ", initialPrivateBalance.toString());

    const signResult = await privateWallet.toPrivateBuild(assetId, amount, polkadotConfig.polkadotSigner, polkadotConfig.polkadotAddress);

    console.log("The result of the signing: ", JSON.stringify(signResult));

    console.log("Full payload for use directly on the Manta Network parachains: ", JSON.stringify(signResult.txs[0]));

    console.log("For xcm remote transact payload use: " + MantaUtilities.removeLeadingBytesFromHexString(JSON.stringify(signResult.txs[0]), 3, false));
}

/// Test to execute a `ToPrivate` transaction.
/// Convert 10 KMA to 10 zkKMA.
const toPrivateTest = async () => {

    const privateWalletConfig = {
        environment: Environment.Development,
        network: Network.Calamari,
        loggingEnabled: true
    }

    const privateWallet = await MantaPrivateWallet.init(privateWalletConfig);
    await privateWallet.api.isReady;
    const polkadotConfig = await getPolkadotSignerAndAddress();

    const zkAddress = await privateWallet.getZkAddress();
    console.log("The zk address is: ", zkAddress);

    const assetId = new BN("1"); // KMA
    const amount = new BN("10000000000000"); // 10 units

    await privateWallet.initialWalletSync();

    const initialPrivateBalance = await privateWallet.getPrivateBalance(assetId);
    console.log("The initial private balance is: ", initialPrivateBalance.toString());

    await privateWallet.toPrivateSend(assetId, amount, polkadotConfig.polkadotSigner, polkadotConfig.polkadotAddress);

    while (true) {

        await new Promise(r => setTimeout(r, 5000));
        console.log("Syncing with ledger...");
        await privateWallet.walletSync();
        let newPrivateBalance = await privateWallet.getPrivateBalance(assetId);
        console.log("Private Balance after sync: ", newPrivateBalance.toString());

        if (initialPrivateBalance !== newPrivateBalance) {
            console.log("Detected balance change after sync!");
            console.log("Old balance: ", initialPrivateBalance.toString());
            console.log("New balance: ", newPrivateBalance.toString());
            break;
        }
    }
}

/// Test to execute a `ToPublic` transaction without submitting it.
const toPublicOnlySignTest = async () => {

    const privateWalletConfig = {
        environment: Environment.Development,
        network: Network.Calamari
    }

    const privateWallet = await MantaPrivateWallet.init(privateWalletConfig);
    const polkadotConfig = await getPolkadotSignerAndAddress();

    const privateAddress = await privateWallet.getZkAddress();
    console.log("The private address is: ", privateAddress);

    const assetId = new BN("1"); // KMA
    const amount = new BN("5000000000000"); // 5 units

    await privateWallet.initialWalletSync();

    const initialPrivateBalance = await privateWallet.getPrivateBalance(assetId);
    console.log("The inital private balance is: ", initialPrivateBalance.toString());

    let signResult = await privateWallet.toPublicBuild(assetId, amount, polkadotConfig.polkadotSigner, polkadotConfig.polkadotAddress);

    console.log("The result of the signing: ", signResult);

    console.log("Full payload for use directly on the Manta Network parachains: ", JSON.stringify(signResult.txs[0]));

    console.log("For xcm remote transact payload use: " + MantaUtilities.removeLeadingBytesFromHexString(JSON.stringify(signResult.txs[0]), 3, false));
}

/// Test to execute a `ToPublic` transaction.
/// Convert 5 zkKMA to 5 KMA.
const toPublicTest = async () => {

    // const privateWalletConfig = {
    //     environment: Environment.Development,
    //     network: Network.Calamari
    // }

    const privateWallet = await MantaPrivateWallet.init(privateWalletConfig);
    await privateWallet.api.isReady;
    const polkadotConfig = await getPolkadotSignerAndAddress();

    const zkAddress = await privateWallet.getZkAddress();
    console.log("The zk address is: ", zkAddress);

    const assetId = new BN("1"); // KMA
    const amount = new BN("100000000000000"); // 5 units

    await privateWallet.initialWalletSync();

    const initialPrivateBalance = await privateWallet.getPrivateBalance(assetId);
    console.log("The initial private balance is: ", initialPrivateBalance.toString());

    await privateWallet.toPublicSend(assetId, amount, polkadotConfig.polkadotSigner, polkadotConfig.polkadotAddress);

    await privateWallet.walletSync();
    let privateBalance = await privateWallet.getPrivateBalance(assetId);

    // while (true) {

        await new Promise(r => setTimeout(r, 5000));
        console.log("Syncing with ledger...");
        await privateWallet.walletSync();
        let newPrivateBalance = await privateWallet.getPrivateBalance(assetId);
        console.log("Private Balance after sync: ", newPrivateBalance.toString());

    //     if (privateBalance !== newPrivateBalance) {
    //         console.log("Detected balance change after sync!");
    //         console.log("Old balance: ", privateBalance.toString());
    //         console.log("New balance: ", newPrivateBalance.toString());
    //         break;
    //     }
    // }

}

const reserve_id_test = async() => {
    const privateWallet = await SbtMantaPrivateWallet.initSBT(privateWalletConfig);
    const polkadotConfig = await getPolkadotSignerAndAddress();

    const privateAddress = await privateWallet.getZkAddress();
    console.log("The private address is: ", privateAddress);

    const numberOfMints = 1;
    const metadata: string[] = [];
    for (let i = 0; i < numberOfMints; i++ ) {
        metadata.push(`hello ${i.toString()}`)
    }
    await privateWallet.initialWalletSync();

    for (let i = 0; i < 44; i++ ) {
        const reserveSbt = await privateWallet.buildReserveSbt(polkadotConfig.polkadotSigner, polkadotConfig.polkadotAddress);
        await reserveSbt.signAndSend(polkadotConfig.polkadotAddress);

        await new Promise(r => setTimeout(r, 200));
    }

    const assetIdRange: any = await privateWallet.api.query.mantaSbt.reservedIds(polkadotConfig.polkadotAddress);
    if (assetIdRange.isNone) {
        console.error("no assetId in storage mapped to this account");
        return
    }
    const assetId = assetIdRange.unwrap()[0];
    console.log("NFT AssetId: ", assetId.toString());
}

/// Test to execute a `ToPrivate` transaction.
/// Convert 10 DOL to 10 pDOL.
const toSBTPrivateTest = async (verify: boolean) => {
    const privateWallet = await SbtMantaPrivateWallet.initSBT(privateWalletConfig);
    const polkadotConfig = await getPolkadotSignerAndAddress();
    console.log("Public address:" + polkadotConfig.polkadotAddress);

    const privateAddress = await privateWallet.getZkAddress();
    console.log("The private address is: ", privateAddress);

    const numberOfMints = 2;
    const metadata: string[] = [];
    for (let i = 0; i < numberOfMints; i++ ) {
        metadata.push(`hello ${i.toString()}`)
    }
    await privateWallet.initialWalletSync();

    // const reserveSbt = await privateWallet.buildReserveSbt(polkadotConfig.polkadotSigner, polkadotConfig.polkadotAddress);
    // const reserveGasFee = await reserveSbt.paymentInfo(polkadotConfig.polkadotAddress);
    // console.log("reserveSbt Gas Fee: ",`
    //     class=${reserveGasFee.class.toString()},
    //     weight=${reserveGasFee.weight.toString()},
    //     partialFee=${reserveGasFee.partialFee.toHuman()}
    // `);

    // // example of some error handling of tx result
    // await reserveSbt.signAndSend(polkadotConfig.polkadotAddress, {}, (result: {status: any, events: any, dispatchError: any}) => {
    //     if (result.dispatchError) {
    //         if (result.dispatchError.isModule) {
    //             const moduleError = result.dispatchError.asModule;
    //             // polkadot.js version is older need to convert to BN
    //             const errorInfo = {index: moduleError.index, error: u8aToBn(moduleError.error)};
    //             // for module errors, we have the section indexed, lookup
    //             const decoded = privateWallet.api.registry.findMetaError(errorInfo);
    //             const { docs, name, section } = decoded;

    //             console.error("Call failed", `${section}.${name}: ${docs.join(' ')}`);
    //         } else {
    //             // Other, CannotLookup, BadOrigin, no extra info
    //             console.error("Call failed", result.dispatchError.toString());
    //         }
    //     }
    // });

    // // pause to wait for tx to submit
    // await new Promise(r => setTimeout(r, 5000));

    const assetIdRange: any = await privateWallet.api.query.mantaSbt.reservedIds(polkadotConfig.polkadotAddress);
    if (assetIdRange.isNone) {
        console.error("no assetId in storage mapped to this account");
        return
    }
    const assetId = assetIdRange.unwrap()[0];

    const initalPrivateBalance = await privateWallet.getPrivateBalance(assetId);
    console.log("Asset:", assetId);
    console.log("NFT AssetId: ", assetId.toString(), ",BN:" + new BN(assetId));
    console.log("NFT Present: ", initalPrivateBalance.toString());

    // pause to wait for tx to submit
    await new Promise(r => setTimeout(r, 5000));

    const sbtMint = await privateWallet.buildSbtBatch(polkadotConfig.polkadotSigner, polkadotConfig.polkadotAddress, assetId, numberOfMints, metadata);
    const sbtMintGas = await sbtMint.batchTx.paymentInfo(polkadotConfig.polkadotAddress);
    console.log("mintSbt Gas Fee: ",`
        class=${sbtMintGas.class.toString()},
        weight=${sbtMintGas.weight.toString()},
        partialFee=${sbtMintGas.partialFee.toHuman()}
    `);

    // example of some error handling of tx result
    await sbtMint.batchTx.signAndSend(polkadotConfig.polkadotAddress, (result: {status: any, events: any, dispatchError: any}) => {
        if (result.dispatchError) {
            if (result.dispatchError.isModule) {
                const moduleError = result.dispatchError.asModule;
                // polkadot.js version is older need to convert to BN
                const errorInfo = {index: moduleError.index, error: u8aToBn(moduleError.error)};
                // for module errors, we have the section indexed, lookup
                const decoded = privateWallet.api.registry.findMetaError(errorInfo);
                const { docs, name, section } = decoded;

                console.error("Call failed", `${section}.${name}: ${docs.join(' ')}`);
            } else {
                // Other, CannotLookup, BadOrigin, no extra info
                console.error("Call failed", result.dispatchError.toString());
            }
        }
    });

    console.log("transaction_datas:" + JSON.stringify(sbtMint.transactionDatas));
    sbtMint.transactionDatas.map(async(tx: any) => {
        const utxo_commitment_randomness = tx[0].ToPrivate[0]["utxo_commitment_randomness"];
        const asset_id = tx[0].ToPrivate[1]["id"];
        console.log("  assetId:" + new BN(asset_id, "le") + ", hex:" + toHexString(asset_id));
        console.log("  randomness:" + toHexString(utxo_commitment_randomness));
    })

    const addressBytes = SbtMantaPrivateWallet.getAddressBytes(privateAddress);
    console.log("Private address in json form: " + JSON.stringify(addressBytes));

    const tx_datas = sbtMint.transactionDatas;
    const requests = await Promise.all(tx_datas.map(async (tx: any, index: number) => {
        var request: any = {"transaction_data": {"identifier": {},  "asset_info": {}, "zk_address": {"receiving_key": []}}};
        const identifier = tx[0].ToPrivate[0];
        const asset_info = tx[0].ToPrivate[1];
        request.transaction_data.identifier = identifier;
        request.transaction_data.asset_info = asset_info;
        request.transaction_data.zk_address.receiving_key = addressBytes;
        console.log("tx data request[" + index + "]");
        console.log(JSON.stringify(request))
        return request;
    }));

    /// VERIFICATION TO MANTA_AUTH SERVICE.
    if(verify == true) {
        await new Promise(r => setTimeout(r, 6000));

        const request = requests[0];
        const request2 = requests[1];

        // Send data to manta-authentication verifier service to validate.
        // TODO: failed if loop all request.
        // requests.forEach(async (request: any) => {
        console.log("[insert_new_transaction_id]request.....");
        await axios.post("http://127.0.0.1:5000", request).then(function (response) {
            console.log("[insert_new_transaction_id]response1:" + JSON.stringify(response.data));
        });

        await new Promise(r => setTimeout(r, 5000));

        console.log("[request_new_virtual_asset]request.....");
        await axios.post("http://127.0.0.1:5000/virtual_asset", request).then(async function (response) {
            console.log("[request_new_virtual_asset]virtual asset response:" + JSON.stringify(response.data));
            const json_str = JSON.stringify(response.data)

            const virtual_asset = `${json_str}`;
            const identity_proof_response = await identityProofGen(privateWallet, virtual_asset, polkadotConfig.polkadotAddress);
            console.log("identity proof format response:");
            console.log(identity_proof_response);

            var validate_request: any = {"transaction_data": {}, "constructed_transfer_post": {"transfer_post": {}}};
            validate_request.transaction_data = request.transaction_data;
            const identity_response = JSON.parse(identity_proof_response)
            validate_request.constructed_transfer_post.transfer_post = identity_response;
            console.log("[validate_proof_id]validate request:");
            console.log(JSON.stringify(validate_request))

            await axios.post("http://127.0.0.1:5000/verify", validate_request).then(async function (response) {
                console.log("[validate_proof_id]validate response1:" + JSON.stringify(response.data));
            });
        });

        await new Promise(r => setTimeout(r, 1000));
        console.log("Second Transaction Data Request without IdendityProof:");
        console.log("------------------------------------------------------");
        await axios.post("http://127.0.0.1:5000", request2).then(function (response) {
            console.log("[insert_new_transaction_id]response2:" + JSON.stringify(response.data));
        });

        await new Promise(r => setTimeout(r, 5000));

        var validate_request2: any = {"transaction_data": {}};
        validate_request2.transaction_data = request2.transaction_data;
        console.log("[validate_proof_id]validate request2:");
        console.log(JSON.stringify(validate_request2))

        await axios.post("http://127.0.0.1:5000/verify", validate_request2).then(async function (response) {
            console.log("[validate_proof_id]validate response2:" + JSON.stringify(response.data));
        });
        // });
    }

    // while (true) {
    //     await new Promise(r => setTimeout(r, 5000));
    //     console.log("Syncing with ledger...");
    //     await privateWallet.walletSync();
    //     let newPrivateBalance = await privateWallet.getPrivateBalance(assetId);
    //     console.log("Private Balance after sync: ", newPrivateBalance.toString());
    //     console.log("NFT AssetId: ", assetId.toString());
    //     if (initalPrivateBalance.toString() !== newPrivateBalance.toString()) {
    //         console.log("Detected balance change after sync!");
    //         console.log(`Metadata: ${await privateWallet.getSBTMetadata(assetId)}`);
    //         console.log("Old balance: ", initalPrivateBalance.toString());
    //         console.log("New balance: ", newPrivateBalance.toString());
    //         break;
    //     }
    // }
}

const reserveAndMints = async () => {
    const privateWallet = await SbtMantaPrivateWallet.initSBT(privateWalletConfig);
    const polkadotConfig = await getPolkadotSignerAndAddress();
    console.log("public address:", polkadotConfig.polkadotAddress);

    const privateAddress = await privateWallet.getZkAddress();
    console.log("The private address is: ", privateAddress);

    const numberOfMints = 2;
    const metadata: string[] = [];
    for (let i = 0; i < numberOfMints; i++ ) {
        metadata.push(`hello ${i.toString()}`)
    }
    await privateWallet.initialWalletSync();

    // reserve 5 assets
    const reserveSbt = await privateWallet.buildReserveSbt(polkadotConfig.polkadotSigner, polkadotConfig.polkadotAddress);
    await reserveSbt.signAndSend(polkadotConfig.polkadotAddress);

    // pause to wait for tx to submit
    await new Promise(r => setTimeout(r, 5000));

    const assetIdRange: any = await privateWallet.api.query.mantaSbt.reservedIds(polkadotConfig.polkadotAddress);
    if (assetIdRange.isNone) {
        console.error("no assetId in storage mapped to this account");
        return
    }
    const assetId = assetIdRange.unwrap()[0];
    const initalPrivateBalance = await privateWallet.getPrivateBalance(assetId);
    console.log("NFT1 AssetId: ", assetId.toString());
    console.log("NFT1 Present: ", initalPrivateBalance.toString());

    const sbtMint = await privateWallet.buildSbtBatch(polkadotConfig.polkadotSigner, polkadotConfig.polkadotAddress, assetId, numberOfMints, metadata);
    await sbtMint.batchTx.signAndSend(polkadotConfig.polkadotAddress);
    console.log("transaction_datas:" + JSON.stringify(sbtMint.transactionDatas));
    sbtMint.transactionDatas.map(async(tx: any) => {
        const utxo_commitment_randomness = tx[0].ToPrivate[0]["utxo_commitment_randomness"];
        const asset_id = tx[0].ToPrivate[1]["id"];
        console.log("  assetId:" + new BN(asset_id, "le") + ", hex:" + toHexString(asset_id));
        console.log("  randomness:" + toHexString(utxo_commitment_randomness));
    })

    await new Promise(r => setTimeout(r, 5000));

    // second mint
    const assetIdRange2: any = await privateWallet.api.query.mantaSbt.reservedIds(polkadotConfig.polkadotAddress);
    if (assetIdRange2.isNone) {
        console.error("no assetId in storage mapped to this account");
        return
    }
    const assetId2 = assetIdRange2.unwrap()[0];
    console.log("NFT2 AssetId: ", assetId2.toString());
    const metadata2: string[] = [];
    for (let i = 0; i < numberOfMints; i++ ) {
        metadata2.push(`hello2 ${i.toString()}`)
    }

    const sbtMint2 = await privateWallet.buildSbtBatch(polkadotConfig.polkadotSigner, polkadotConfig.polkadotAddress, assetId2, numberOfMints, metadata2);
    await sbtMint2.batchTx.signAndSend(polkadotConfig.polkadotAddress);
    console.log("transaction_datas:" + JSON.stringify(sbtMint2.transactionDatas));
    sbtMint2.transactionDatas.map(async(tx: any) => {
        const utxo_commitment_randomness = tx[0].ToPrivate[0]["utxo_commitment_randomness"];
        const asset_id = tx[0].ToPrivate[1]["id"];
        console.log("  assetId:" + new BN(asset_id, "le") + ", hex:" + toHexString(asset_id));
        console.log("  randomness:" + toHexString(utxo_commitment_randomness));
    })
}


const identityProofGen = async (privateWallet: any, virtualAsset: string, address: string) => {
    const identityProof = await privateWallet.getIdentityProof(virtualAsset, address);
    // console.log("Idnetity Proof: ", identityProof);
    // console.log("Identity Proof JSON: ", JSON.stringify(identityProof));

    // const identityProofJson = JSON.stringify(identityProof);
    const authorization_signature = identityProof[0].authorization_signature;
    const sink_accounts = identityProof[0].sink_accounts;
    delete identityProof[0].authorization_signature;
    delete identityProof[0].sink_accounts;
    var identityProof2: any = {"authorization_signature": "", "body": {}};
    identityProof2.body = identityProof[0];
    identityProof2.authorization_signature = authorization_signature;
    // console.log("add body:" + JSON.stringify(identityProof2));

    const sink = identityProof2.body.sinks[0];
    const bn = u8aToBn(sink);
    identityProof2.body.sinks[0] = bn.toString();
    // console.log(JSON.stringify(identityProof2));

    identityProof2.sink_accounts = sink_accounts;

    const identityProofJson = JSON.stringify(identityProof2);
    const format_json = identityProofJson.replace('"sinks":["', '"sinks":[').replace('"],"proof"', '],"proof"');
    return format_json;
}

const ethMintSbt = async () => {
    const privateWallet = await SbtMantaPrivateWallet.initSBT(privateWalletConfig);
    const polkadotConfig = await getPolkadotSignerAndAddress();
    console.log("public:" + polkadotConfig.polkadotAddress);

    // 0x0123456789012345678901234567890123456789012345678901234567890123
    // const signer = new Wallet("522bd73700711e4a0080dd31dbabbe6e0a0c025007528d2440fa997803aae265");
    const signer = new Wallet("0x0123456789012345678901234567890123456789012345678901234567890123");
    // 0x14791697260E4c9A71f18484C9f997B308e59325
    console.log("eth address: ", signer.address);

    const mintId = 1;
    const assetId = new BN(474);

    // const maybeAssetId: any = await privateWallet.api.query.mantaSbt.evmAccountAllowlist(mintId, signer.address);
    // if (maybeAssetId.isNone) {
    //     console.error("no assetId in storage mapped to this account");
    //     return;
    // }
    // const assetIdInfo = maybeAssetId.unwrap();
    // if (assetIdInfo.isAlreadyMinted) {
    //     console.error("Eth address has already minted sbt");
    //     return;
    // }
    // const assetId = assetIdInfo.asAvailable;
    // console.log("assetId:" + assetId);

    // manta_wasm_wallet_bg.js:2050 panicked at 'Deserialization is not allowed to fail1.: Error("invalid type: null, expected struct RawPullResponse", line: 1, column: 4)',
    // await privateWallet.initialWalletSync();
    // const initalPrivateBalance = await privateWallet.getPrivateBalance(assetId);
    // console.log("NFT present: ", initalPrivateBalance.toString());

    const chain_id = 56;

    // generate zkp
    const post = await privateWallet.buildSbtPost(assetId);
    console.log("post:" + JSON.stringify(post));

    const genesis = (await privateWallet.api.rpc.chain.getBlockHash(0)).toHex();
    console.log("genesis:" + genesis);

    const domain = {
        name: "Claim Free SBT",
        version: "1",
        chainId: chain_id,
        salt: genesis,
    };
    const types = {
        Transaction: [{ name: "proof", type: "bytes" }],
    };
    // Sign zkp proof
    const value = {
        proof: post.proof,
    };
    const signature = await signer._signTypedData(domain, types, value);
    console.log("eth signature: " + signature);

    const structHash = ethers.utils._TypedDataEncoder.hash(domain, types, value)
    console.log("message hashed:" + structHash + ",type:" + typeof(structHash));
    const public_signature = await polkadotConfig.polkadotSigner.signRaw({
        address: polkadotConfig.polkadotAddress,
        type: "bytes",
        data: structHash
    });
    console.log("public signature: " + JSON.stringify(public_signature));

    const evmTx = privateWallet.api.tx.mantaSbt.mintSbtEth(post, chain_id, signature, mintId, null, null, "hello eth");
    privateWallet.api.setSigner(polkadotConfig.polkadotSigner);
    await evmTx.signAndSend(polkadotConfig.polkadotAddress, async ({ status, dispatchError }) => {
        if (status.isInBlock) {
            console.log("send tx success to blockchain.");
        }
    });

    await new Promise(r => setTimeout(r, 10000));
}

const test_address = async () => {
    const privateWallet = await SbtMantaPrivateWallet.initSBT(privateWalletConfig);

    const keyring = new Keyring({ type: 'sr25519' });
    const alice = keyring.addFromUri('//Alice', { name: 'Alice default' });
    console.log("alice: " + alice.address + ", key:" + u8aToHex(alice.publicKey)); // 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY

    let keyHex = u8aToHex(alice.publicKey); // 
    let calamari_address = encodeAddress(alice.address, 78);
    let manta_address = encodeAddress(alice.address, 77);
    console.log("calamari:" + calamari_address + ",manta:" + manta_address);

    calamari_address = encodeAddress(keyHex, 78);
    manta_address = encodeAddress(keyHex, 77);
    console.log("calamari:" + calamari_address + ",manta:" + manta_address);

    // example:
    const ss58_addr = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY";
    calamari_address = encodeAddress(ss58_addr, 78);
    manta_address = encodeAddress(ss58_addr, 77);
    console.log("calamari:" + calamari_address + ",manta:" + manta_address);
}

const ethPompMint = async () => {
    const privateWallet = await SbtMantaPrivateWallet.initSBT(privateWalletConfig);

    const keyring = new Keyring({ type: 'sr25519' });
    const alice = keyring.addFromUri('//Alice', { name: 'Alice default' });
    console.log("alice: " + alice.address); // 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY

    const calamari_address = encodeAddress(alice.address, 67);
    const manta_address = encodeAddress(alice.address, 68);
    console.log("calamari:" + calamari_address + ",manta:" + manta_address);

    const polkadotConfig = await getPolkadotSignerAndAddress();
    // 5GC5tSpmWL68P3aPs6ZwrjP5JSrtVrziwQaHVxRZGdhbwdxQ
    // console.log("public:" + polkadotConfig.polkadotAddress);

    // 0x0123456789012345678901234567890123456789012345678901234567890123
    // const signer = new Wallet("522bd73700711e4a0080dd31dbabbe6e0a0c025007528d2440fa997803aae265");
    const signer = new Wallet("0x0123456789012345678901234567890123456789012345678901234567890123");
    // 0x14791697260E4c9A71f18484C9f997B308e59325
    console.log("eth address: ", signer.address);

    // const mintId = 3;
    const assetId = new BN(3);
    // const maybeAssetId: any = await privateWallet.api.query.mantaSbt.reserverId(alice.address);
    // if exist, return maybeAssetId.0
    // not exist, send reserverSbt tx, and query again
    // await privateWallet.api.tx.mantaSbt.reserverSbt(alice.address); //public_address -> [startAssetId, endAssetId]

    const chain_id = 0;
    const post = await privateWallet.buildSbtPost(assetId);
    console.log("post:" + JSON.stringify(post));

    const genesis = (await privateWallet.api.rpc.chain.getBlockHash(0)).toHex();
    console.log("genesis:" + genesis);

    const domain = {
        name: "Claim Free SBT",
        version: "1",
        chainId: chain_id,
        salt: genesis,
    };
    const types = {
        Transaction: [{ name: "proof", type: "bytes" }],
    };
    const value = {
        proof: post.proof,
    };
    const signature = await signer._signTypedData(domain, types, value);
    console.log("eth signature: " + signature);

    const structHash = ethers.utils._TypedDataEncoder.hash(domain, types, value)
    console.log("message hashed:" + structHash + ",type:" + typeof(structHash));

    const public_signature1 = await polkadotConfig.polkadotSigner.signRaw({
        address: polkadotConfig.polkadotAddress,
        type: "bytes",
        data: structHash
    });
    console.log("dot signature: " + JSON.stringify(public_signature1));

    const public_signature = alice.sign(structHash);
    const public_sig_key = {
        sig: {
            Sr25519: Array.from(public_signature)
        },
        pub_key: {
            Sr25519: Array.from(alice.publicKey)
        }
    }
    console.log("public signature:" + JSON.stringify(public_sig_key));

    // const evmTx = privateWallet.api.tx.mantaSbt.to_private(post, chain_id, signature, mintId, null, null, "hello eth");
    await privateWallet.api.tx.mantaSbt.toPrivate(public_sig_key, post, "metadata").signAndSend(alice.address);

    // User pay gas fee:
    const signedExtrinsic = await privateWallet.api.tx.mantaSbt.toPrivate(
        public_sig_key, post, "{range:0-1,mintId:10,}").signAsync(polkadotConfig.polkadotAddress, { nonce: -1, era: 64 });
    const signedExtrinsicHash = signedExtrinsic.toHex();

    // server/relayer execute tx:
    await privateWallet.api.rpc.author.submitExtrinsic(signedExtrinsicHash);

    await new Promise(r => setTimeout(r, 10000));
}

main();

function toHexString(byteArray: Uint8Array) {
    return byteArray.reduce((output, elem) =>
      (output + ('0' + elem.toString(16)).slice(-2)),
      '');
  }

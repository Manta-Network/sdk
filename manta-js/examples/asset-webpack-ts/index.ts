import * as sdk from 'manta.js';
import BN from 'bn.js';
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';

async function main() {
    //await toPrivateOnlySignTest();
    await toPrivateTest();
    //await privateTransferTest();
    //await toPublicTest();
    //await publicTransferTest();
    console.log("END");
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
 
/// Test to publicly transfer 10 DOL.
const publicTransferTest = async () => {
    const env = sdk.Environment.Development;
    const net = sdk.Network.Dolphin;
    const privateWallet = await sdk.MantaPrivateWallet.init(env,net);
    const polkadotConfig = await getPolkadotSignerAndAddress();

    const assetId = new BN("1"); // DOL
    const amount = new BN("10000000000000000000"); // 10 units

    const destinationAddress = "5FHT5Rt1oeqAytX5KSn4ZZQdqN8oEa5Y81LZ5jadpk41bdoM";

    const senderBalance = await privateWallet.publicBalance(assetId, polkadotConfig.polkadotAddress);
    console.log("Sender Balance:" + JSON.stringify(senderBalance));

    const destinationBalance = await privateWallet.publicBalance(assetId, destinationAddress);
    console.log("Destination Balance:" + JSON.stringify(destinationBalance));

    await privateWallet.publicTransfer(assetId, amount, destinationAddress, polkadotConfig.polkadotAddress, polkadotConfig.polkadotSigner);

    const senderBalanceAfterTrasnfer = await privateWallet.publicBalance(assetId,polkadotConfig.polkadotAddress);
    console.log("Sender Balance After:" + JSON.stringify(senderBalanceAfterTrasnfer));

    const destinationBalanceAfterTransfer = await privateWallet.publicBalance(assetId, destinationAddress);
    console.log("Dest Balance After:" + JSON.stringify(destinationBalanceAfterTransfer));
}

/// Test to privately transfer 5 pDOL.
const privateTransferTest = async () => {
    const env = sdk.Environment.Development;
    const net = sdk.Network.Dolphin;
    const privateWallet = await sdk.MantaPrivateWallet.init(env,net);
    const polkadotConfig = await getPolkadotSignerAndAddress();

    const assetId = new BN("1"); // DOL
    const amount = new BN("5000000000000000000"); // 5 units

    const toPrivateTestAddress = "3UG1BBvv7viqwyg1QKsMVarnSPcdiRQ1aL2vnTgwjWYX";

    await privateWallet.initalWalletSync();

    const initalPrivateBalance = await privateWallet.privateBalance(assetId);
    console.log("The inital private balance is: ", initalPrivateBalance);

    await privateWallet.privateTransferSend(assetId, amount, toPrivateTestAddress, polkadotConfig.polkadotSigner, polkadotConfig.polkadotAddress);

    while (true) {

        await new Promise(r => setTimeout(r, 5000));
        console.log("Syncing with ledger...");
        await privateWallet.walletSync();
        let newPrivateBalance = await privateWallet.privateBalance(assetId);
        console.log("Private Balance after sync: ", newPrivateBalance);

        if (initalPrivateBalance !== newPrivateBalance) {
            console.log("Detected balance change after sync!");
            console.log("Old balance: ", initalPrivateBalance);
            console.log("New balance: ", newPrivateBalance);
            break;
        }
    }   
}

/// Test to sign a transaction that converts 10 DOL to pDOL,
/// without publishing the transaction.
const toPrivateOnlySignTest = async () => {

    const env = sdk.Environment.Development;
    const net = sdk.Network.Dolphin;
    const mantaSdk = await sdk.MantaPrivateWallet.init(env,net);
    const polkadotConfig = await getPolkadotSignerAndAddress();

    const privateAddress = await mantaSdk.privateAddress();
    console.log("The private address is: ", privateAddress);

    const assetId = new BN("1"); // DOL
    const amount = new BN("10000000000000000000"); // 10 units

    await mantaSdk.initalWalletSync();

    const initalPrivateBalance = await mantaSdk.privateBalance(assetId);
    console.log("The inital private balance is: ", initalPrivateBalance);

    const signResult = await mantaSdk.toPrivateSend(assetId, amount, polkadotConfig.polkadotSigner, polkadotConfig.polkadotAddress);

    console.log("The result of the signing: ", signResult);
}

/// Test to execute a `ToPrivate` transaction.
/// Convert 10 DOL to 10 pDOL.
const toPrivateTest = async () => {

    // Initialize privateWallet
    const env = sdk.Environment.Development;
    const net = sdk.Network.Dolphin;
    const privateWallet = await sdk.MantaPrivateWallet.init(env,net);
    const polkadotConfig = await getPolkadotSignerAndAddress();

    const privateAddress = await privateWallet.privateAddress();
    console.log("The private address is: ", privateAddress);

    const assetId = new BN("1"); // DOL
    const amount = new BN("10000000000000000000"); // 10 units

    await privateWallet.initalWalletSync();

    const initalPrivateBalance = await privateWallet.privateBalance(assetId);
    console.log("The inital private balance is: ", initalPrivateBalance);

    await privateWallet.toPrivateSend(assetId, amount, polkadotConfig.polkadotSigner, polkadotConfig.polkadotAddress);

    while (true) {

        await new Promise(r => setTimeout(r, 5000));
        console.log("Syncing with ledger...");
        await privateWallet.walletSync();
        let newPrivateBalance = await privateWallet.privateBalance(assetId);
        console.log("Private Balance after sync: ", newPrivateBalance);

        if (initalPrivateBalance !== newPrivateBalance) {
            console.log("Detected balance change after sync!");
            console.log("Old balance: ", initalPrivateBalance);
            console.log("New balance: ", newPrivateBalance);
            break;
        }
    }
}

/// Test to execute a `ToPublic` transaction.
/// Convert 5 pDOL to 5 DOL.
const toPublicTest = async () => {

    const env = sdk.Environment.Development;
    const net = sdk.Network.Dolphin;
    const privateWallet = await sdk.MantaPrivateWallet.init(env,net);
    const polkadotConfig = await getPolkadotSignerAndAddress();
    
    const privateAddress = await privateWallet.privateAddress();
    console.log("The private address is: ", privateAddress);

    const assetId = new BN("1"); // DOL
    const amount = new BN("5000000000000000000"); // 5 units

    await privateWallet.initalWalletSync();

    const initalPrivateBalance = await privateWallet.privateBalance(assetId);
    console.log("The inital private balance is: ", initalPrivateBalance);

    await privateWallet.toPublicSend(assetId, amount, polkadotConfig.polkadotSigner, polkadotConfig.polkadotAddress);

    await privateWallet.walletSync();
    let privateBalance = await privateWallet.privateBalance(assetId);

    while (true) {

        await new Promise(r => setTimeout(r, 5000));
        console.log("Syncing with ledger...");
        await privateWallet.walletSync();
        let newPrivateBalance = await privateWallet.privateBalance(assetId);
        console.log("Private Balance after sync: ", newPrivateBalance);

        if (privateBalance !== newPrivateBalance) {
            console.log("Detected balance change after sync!");
            console.log("Old balance: ", privateBalance);
            console.log("New balance: ", newPrivateBalance);
            break;
        }
    }
    
}

main();
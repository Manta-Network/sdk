import * as sdk from 'manta.js';
import BN from 'bn.js';

async function main() {
    //await toPrivateOnlySignTest();
    await toPrivateTest();
    //await privateTransferTest();
    //await toPublicTest();
    //await publicTransferTest();
    console.log("END");
}

/// Test to publicly transfer 1 DOL.
const publicTransferTest = async () => {
    const env = sdk.Environment.Development;
    const net = sdk.Network.Dolphin;
    const mantaSdk = await sdk.MantaPrivateWallet.init(env,net);

    const assetId = new BN("1"); // DOL
    const amount = new BN("10000000000000000000"); // 10 units

    const destinationAddress = "5FHT5Rt1oeqAytX5KSn4ZZQdqN8oEa5Y81LZ5jadpk41bdoM";

    const senderBalance = await mantaSdk.publicBalance(assetId);
    console.log("Sender Balance:" + JSON.stringify(senderBalance));

    const destinationBalance = await mantaSdk.publicBalance(assetId, destinationAddress);
    console.log("Destination Balance:" + JSON.stringify(destinationBalance));

    await mantaSdk.publicTransfer(assetId, amount, destinationAddress);

    const senderBalanceAfterTrasnfer = await mantaSdk.publicBalance(assetId);
    console.log("Sender Balance After:" + JSON.stringify(senderBalanceAfterTrasnfer));

    const destinationBalanceAfterTransfer = await mantaSdk.publicBalance(assetId, destinationAddress);
    console.log("Dest Balance After:" + JSON.stringify(destinationBalanceAfterTransfer));
}

/// Test to privately transfer 1 pDOL.
const privateTransferTest = async () => {
    const env = sdk.Environment.Development;
    const net = sdk.Network.Dolphin;
    const mantaSdk = await sdk.MantaPrivateWallet.init(env,net);

    const assetId = new BN("1"); // DOL
    const amount = new BN("5000000000000000000"); // 5 units

    const toPrivateTestAddress = "3UG1BBvv7viqwyg1QKsMVarnSPcdiRQ1aL2vnTgwjWYX";

    await mantaSdk.initalWalletSync();

    const initalPrivateBalance = await mantaSdk.privateBalance(assetId);
    console.log("The inital private balance is: ", initalPrivateBalance);

    await mantaSdk.privateTransferSend(assetId, amount, toPrivateTestAddress);

    while (true) {

        await new Promise(r => setTimeout(r, 5000));
        console.log("Syncing with ledger...");
        await mantaSdk.walletSync();
        let newPrivateBalance = await mantaSdk.privateBalance(assetId);
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

    const privateAddress = await mantaSdk.privateAddress();
    console.log("The private address is: ", privateAddress);

    const assetId = new BN("1"); // DOL
    const amount = new BN("10000000000000000000"); // 10 units

    await mantaSdk.initalWalletSync();

    const initalPrivateBalance = await mantaSdk.privateBalance(assetId);
    console.log("The inital private balance is: ", initalPrivateBalance);

    const signResult = await mantaSdk.toPrivateSend(assetId, amount);

    console.log("The result of the signing: ", signResult);
}

/// Test to execute a `ToPrivate` transaction.
/// Convert 1 DOL to 1 pDOL.
const toPrivateTest = async () => {

    const env = sdk.Environment.Development;
    const net = sdk.Network.Dolphin;
    const mantaSdk = await sdk.MantaPrivateWallet.init(env,net);

    const privateAddress = await mantaSdk.privateAddress();
    console.log("The private address is: ", privateAddress);

    const assetId = new BN("1"); // DOL
    const amount = new BN("10000000000000000000"); // 10 units

    await mantaSdk.initalWalletSync();

    const initalPrivateBalance = await mantaSdk.privateBalance(assetId);
    console.log("The inital private balance is: ", initalPrivateBalance);

    await mantaSdk.toPrivateSend(assetId, amount);

    while (true) {

        await new Promise(r => setTimeout(r, 5000));
        console.log("Syncing with ledger...");
        await mantaSdk.walletSync();
        let newPrivateBalance = await mantaSdk.privateBalance(assetId);
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
/// Convert 1 pDOL to 1 DOL.
const toPublicTest = async () => {

    const env = sdk.Environment.Development;
    const net = sdk.Network.Dolphin;
    const mantaSdk = await sdk.MantaPrivateWallet.init(env,net);

    const privateAddress = await mantaSdk.privateAddress();
    console.log("The private address is: ", privateAddress);

    const assetId = new BN("1"); // DOL
    const amount = new BN("5000000000000000000"); // 5 units

    await mantaSdk.initalWalletSync();

    const initalPrivateBalance = await mantaSdk.privateBalance(assetId);
    console.log("The inital private balance is: ", initalPrivateBalance);

    await mantaSdk.toPublicSend(assetId, amount);

    await mantaSdk.walletSync();
    let privateBalance = await mantaSdk.privateBalance(assetId);

    while (true) {

        await new Promise(r => setTimeout(r, 5000));
        console.log("Syncing with ledger...");
        await mantaSdk.walletSync();
        let newPrivateBalance = await mantaSdk.privateBalance(assetId);
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
// @ts-ignore
import { MantaPrivateWallet, Environment, Network, MantaUtilities } from 'manta.js';
import BN from 'bn.js';
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';

async function main() {
    await toPrivateOnlySignTest();
    // await toPrivateTest();
    // await privateTransferOnlySignTest();
    // await privateTransferTest();
    // await toPublicOnlySignTest();
    // await toPublicTest();
    // await publicTransferTest();
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
    const privateWalletConfig = {
        environment: Environment.Production,
        network: Network.Dolphin
    }

    const privateWallet = await MantaPrivateWallet.init(privateWalletConfig);
    await privateWallet.api.isReady;
    const polkadotConfig = await getPolkadotSignerAndAddress();

    const assetId = new BN("1"); // DOL
    const amount = new BN("10000000000000"); // 10 units

    const destinationAddress = "5FHT5Rt1oeqAytX5KSn4ZZQdqN8oEa5Y81LZ5jadpk41bdoM";

    const senderBalance = await MantaUtilities.getPublicBalance(privateWallet.api, assetId, polkadotConfig.polkadotAddress);
    console.log("Sender Balance:" + JSON.stringify(senderBalance.toString()));

    const destinationBalance = await MantaUtilities.getPublicBalance(privateWallet.api, assetId, destinationAddress);
    console.log("Destination Balance:" + JSON.stringify(destinationBalance.toString()));

    await MantaUtilities.publicTransfer(privateWallet.api, assetId, amount, destinationAddress, polkadotConfig.polkadotAddress, polkadotConfig.polkadotSigner);

    await new Promise(r => setTimeout(r, 10000));

    const senderBalanceAfterTransfer = await MantaUtilities.getPublicBalance(privateWallet.api, assetId,polkadotConfig.polkadotAddress);
    console.log("Sender Balance After:" + JSON.stringify(senderBalanceAfterTransfer.toString()));

    const destinationBalanceAfterTransfer = await MantaUtilities.getPublicBalance(privateWallet.api, assetId, destinationAddress);
    console.log("Dest Balance After:" + JSON.stringify(destinationBalanceAfterTransfer.toString()));
}

/// Test to privately transfer 5 pDOL.
const privateTransferTest = async () => {
    const privateWalletConfig = {
        environment: Environment.Production,
        network: Network.Dolphin
    }

    const privateWallet = await MantaPrivateWallet.init(privateWalletConfig);
    await privateWallet.api.isReady;
    const polkadotConfig = await getPolkadotSignerAndAddress();

    const assetId = new BN("1"); // DOL
    const amount = new BN("5000000000000"); // 5 units

    const toPrivateTestAddress = "3UG1BBvv7viqwyg1QKsMVarnSPcdiRQ1aL2vnTgwjWYX";

    await privateWallet.initalWalletSync();

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
        environment: Environment.Production,
        network: Network.Dolphin
    }

    const privateWallet = await MantaPrivateWallet.init(privateWalletConfig);
    const polkadotConfig = await getPolkadotSignerAndAddress();

    const assetId = new BN("1"); // DOL
    const amount = new BN("5000000000000"); // 5 units

    const toPrivateTestAddress = "3UG1BBvv7viqwyg1QKsMVarnSPcdiRQ1aL2vnTgwjWYX";

    await privateWallet.initalWalletSync();

    const initialPrivateBalance = await privateWallet.getPrivateBalance(assetId);
    console.log("The initial private balance is: ", initialPrivateBalance.toString());

    let signResult = await privateWallet.privateTransferBuild(assetId, amount, toPrivateTestAddress, polkadotConfig.polkadotSigner, polkadotConfig.polkadotAddress);

    console.log("The result of the signing: ", signResult);

    console.log("Full payload for use directly on the Manta Network parachains: ", JSON.stringify(signResult.txs[0]));

    console.log("For xcm remote transact payload use: " + MantaUtilities.removeLeadingBytesFromHexString(JSON.stringify(signResult.txs[0]), 3, false));
}


/// Test to sign a transaction that converts 10 DOL to pDOL,
/// without publishing the transaction.
const toPrivateOnlySignTest = async () => {

    const privateWalletConfig = {
        environment: Environment.Development,
        network: Network.Dolphin
    }

    const privateWallet = await MantaPrivateWallet.init(privateWalletConfig);
    await privateWallet.api.isReady;
    const polkadotConfig = await getPolkadotSignerAndAddress();

    const privateAddress = await privateWallet.getZkAddress();
    console.log("The private address is: ", privateAddress);

    const assetId = new BN("1"); // DOL
    const amount = new BN("10000000000000"); // 10 units

    await privateWallet.initalWalletSync();

    const initialPrivateBalance = await privateWallet.getPrivateBalance(assetId);
    console.log("The initial private balance is: ", initialPrivateBalance.toString());

    const signResult = await privateWallet.toPrivateBuild(assetId, amount, polkadotConfig.polkadotSigner, polkadotConfig.polkadotAddress);

    console.log("The result of the signing: ", signResult);

    console.log("Full payload for use directly on the Manta Network parachains: ", JSON.stringify(signResult.txs[0]));

    console.log("For xcm remote transact payload use: " + MantaUtilities.removeLeadingBytesFromHexString(JSON.stringify(signResult.txs[0]), 3, false));
}

/// Test to execute a `ToPrivate` transaction.
/// Convert 10 DOL to 10 pDOL.
const toPrivateTest = async () => {

    const privateWalletConfig = {
        environment: Environment.Production,
        network: Network.Dolphin,
        loggingEnabled: true
    }

    const privateWallet = await MantaPrivateWallet.init(privateWalletConfig);
    await privateWallet.api.isReady;
    const polkadotConfig = await getPolkadotSignerAndAddress();

    const privateAddress = await privateWallet.getZkAddress();
    console.log("The private address is: ", privateAddress);

    const assetId = new BN("1"); // DOL
    const amount = new BN("10000000000000"); // 10 units

    await privateWallet.initalWalletSync();

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
        environment: Environment.Production,
        network: Network.Dolphin
    }

    const privateWallet = await MantaPrivateWallet.init(privateWalletConfig);
    const polkadotConfig = await getPolkadotSignerAndAddress();

    const privateAddress = await privateWallet.getZkAddress();
    console.log("The private address is: ", privateAddress);

    const assetId = new BN("1"); // DOL
    const amount = new BN("5000000000000"); // 5 units

    await privateWallet.initalWalletSync();

    const initialPrivateBalance = await privateWallet.getPrivateBalance(assetId);
    console.log("The inital private balance is: ", initialPrivateBalance.toString());

    let signResult = await privateWallet.toPublicBuild(assetId, amount, polkadotConfig.polkadotSigner, polkadotConfig.polkadotAddress);

    console.log("The result of the signing: ", signResult);

    console.log("Full payload for use directly on the Manta Network parachains: ", JSON.stringify(signResult.txs[0]));

    console.log("For xcm remote transact payload use: " + MantaUtilities.removeLeadingBytesFromHexString(JSON.stringify(signResult.txs[0]), 3, false));
}

/// Test to execute a `ToPublic` transaction.
/// Convert 5 pDOL to 5 DOL.
const toPublicTest = async () => {

    const privateWalletConfig = {
        environment: Environment.Production,
        network: Network.Dolphin
    }

    const privateWallet = await MantaPrivateWallet.init(privateWalletConfig);
    await privateWallet.api.isReady;
    const polkadotConfig = await getPolkadotSignerAndAddress();

    const privateAddress = await privateWallet.getZkAddress();
    console.log("The private address is: ", privateAddress);

    const assetId = new BN("1"); // DOL
    const amount = new BN("5000000000000"); // 5 units

    await privateWallet.initalWalletSync();

    const initialPrivateBalance = await privateWallet.getPrivateBalance(assetId);
    console.log("The inital private balance is: ", initialPrivateBalance.toString());

    await privateWallet.toPublicSend(assetId, amount, polkadotConfig.polkadotSigner, polkadotConfig.polkadotAddress);

    await privateWallet.walletSync();
    let privateBalance = await privateWallet.getPrivateBalance(assetId);

    while (true) {

        await new Promise(r => setTimeout(r, 5000));
        console.log("Syncing with ledger...");
        await privateWallet.walletSync();
        let newPrivateBalance = await privateWallet.getPrivateBalance(assetId);
        console.log("Private Balance after sync: ", newPrivateBalance.toString());

        if (privateBalance !== newPrivateBalance) {
            console.log("Detected balance change after sync!");
            console.log("Old balance: ", privateBalance.toString());
            console.log("New balance: ", newPrivateBalance.toString());
            break;
        }
    }

}

main();

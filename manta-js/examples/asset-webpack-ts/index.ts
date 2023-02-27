// @ts-ignore
import { MantaPrivateWallet, Environment, Network, MantaUtilities } from 'manta.js';
import BN from 'bn.js';
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import type { Signer as InjectSigner } from '@polkadot/api/types';

let globalPrivateWallet: MantaPrivateWallet = null;
let globalPolkadotConfig: PolkadotSigner = null;
const globalAssetId = new BN("1");
const globalAmount = new BN("10000000000000000000");

interface PolkadotSigner {
    polkadotSigner: InjectSigner;
    polkadotAddress: string;
}

function _log(...message: any[]) {
    console.log('[INFO]: '+ message.join(''));
    console.log(performance.now());
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

const initWallet = async () => {
    const privateWalletConfig = {
        environment: Environment.Production,
        network: Network.Dolphin,
        loggingEnabled: true
    }
    globalPrivateWallet = await MantaPrivateWallet.init(privateWalletConfig);
    // @ts-ignore
    window.globalPrivateWallet = globalPrivateWallet;

    globalPolkadotConfig = await getPolkadotSignerAndAddress();

    _log('Load User Mnemonic');
    await globalPrivateWallet.loadUserMnemonic();
    // _log('Load Authorization Context');
    // await globalPrivateWallet.loadAuthorizationContext();
    _log('Start get zkAddress');
    const privateAddress = await globalPrivateWallet.getZkAddress();
    _log("The zkAddress is: ", privateAddress);

    _log('Sync start');
    await globalPrivateWallet.initalWalletSync();
    _log('Sync end');
}

const queryTransferResult = async (initialPrivateBalance: BN) => {
    let retryTimes = 0;
    while (true) {
        await new Promise(r => setTimeout(r, 5000));
        _log("Syncing with ledger...");
        await globalPrivateWallet.walletSync();
        let newPrivateBalance = await globalPrivateWallet.getPrivateBalance(globalAssetId);
        _log("Private Balance after sync: ", newPrivateBalance.toString());

        if (!initialPrivateBalance.eq(newPrivateBalance)) {
            _log("Detected balance change after sync!");
            _log("Old balance: ", initialPrivateBalance.toString());
            _log("New balance: ", newPrivateBalance.toString());
            break;
        }
        retryTimes += 1;
        if (retryTimes >= 5) {
            break;
        }
    }
}


/// Test to publicly transfer 10 DOL.
const publicTransferTest = async () => {
    const privateWalletConfig = {
        environment: Environment.Development,
        network: Network.Dolphin
    }

    const privateWallet = await MantaPrivateWallet.init(privateWalletConfig);
    const polkadotConfig = await getPolkadotSignerAndAddress();

    const assetId = new BN("1"); // DOL
    const amount = new BN("10000000000000000000"); // 10 units

    const destinationAddress = "5FHT5Rt1oeqAytX5KSn4ZZQdqN8oEa5Y81LZ5jadpk41bdoM";

    const senderBalance = await MantaUtilities.getPublicBalance(privateWallet.api, assetId, polkadotConfig.polkadotAddress);
    _log("Sender Balance:" + JSON.stringify(senderBalance.toString()));

    const destinationBalance = await MantaUtilities.getPublicBalance(privateWallet.api, assetId, destinationAddress);
    _log("Destination Balance:" + JSON.stringify(destinationBalance.toString()));

    await MantaUtilities.publicTransfer(privateWallet.api, assetId, amount, destinationAddress, polkadotConfig.polkadotAddress, polkadotConfig.polkadotSigner);

    await new Promise(r => setTimeout(r, 10000));

    const senderBalanceAfterTransfer = await MantaUtilities.getPublicBalance(privateWallet.api, assetId,polkadotConfig.polkadotAddress);
    _log("Sender Balance After:" + JSON.stringify(senderBalanceAfterTransfer.toString()));

    const destinationBalanceAfterTransfer = await MantaUtilities.getPublicBalance(privateWallet.api, assetId, destinationAddress);
    _log("Dest Balance After:" + JSON.stringify(destinationBalanceAfterTransfer.toString()));
}


/// Test to sign a transaction that converts 10 DOL to pDOL,
/// without publishing the transaction.
const toPrivateOnlySignTest = async () => {

    const privateWalletConfig = {
        environment: Environment.Production,
        network: Network.Dolphin
    }

    const privateWallet = await MantaPrivateWallet.init(privateWalletConfig);
    const polkadotConfig = await getPolkadotSignerAndAddress();
    const privateAddress = await privateWallet.getZkAddress();
    _log("The private address is: ", privateAddress);

    const assetId = new BN("1"); // DOL
    const amount = new BN("10000000000000000000"); // 10 units

    await privateWallet.initalWalletSync();

    const initialPrivateBalance = await privateWallet.getPrivateBalance(assetId);
    _log("The initial private balance is: ", initialPrivateBalance.toString());

    const signResult = await privateWallet.toPrivateBuild(assetId, amount, polkadotConfig.polkadotSigner, polkadotConfig.polkadotAddress);

    _log("The result of the signing: ", signResult);

    _log("Full: ", JSON.stringify(signResult.txs));
    // remove first 3 bytes of the signResult
    _log("For xcm remote transact payload, please use: [\"0x" + JSON.stringify(signResult.txs).slice(10));
}

/// Test to privately transfer 10 pDOL.
const privateTransferTest = async () => {
    const toPrivateTestAddress = "3UG1BBvv7viqwyg1QKsMVarnSPcdiRQ1aL2vnTgwjWYX";
    await globalPrivateWallet.walletSync();
    const initialPrivateBalance = await globalPrivateWallet.getPrivateBalance(globalAssetId);
    _log("The initial balance is: ", initialPrivateBalance.toString());
    await globalPrivateWallet.privateTransferSend(globalAssetId, globalAmount, toPrivateTestAddress, globalPolkadotConfig.polkadotSigner, globalPolkadotConfig.polkadotAddress);
    await queryTransferResult(initialPrivateBalance);
}

/// Test to execute a `ToPrivate` transaction.
/// Convert 10 DOL to 10 pDOL.
const toPrivateTest = async () => {
    await globalPrivateWallet.walletSync();
    const initialPrivateBalance = await globalPrivateWallet.getPrivateBalance(globalAssetId);
    _log("The initial balance is: ", initialPrivateBalance.toString());
    await globalPrivateWallet.toPrivateSend(globalAssetId, globalAmount, globalPolkadotConfig.polkadotSigner, globalPolkadotConfig.polkadotAddress);
    await queryTransferResult(initialPrivateBalance);
}

/// Test to execute a `ToPublic` transaction.
/// Convert 10 pDOL to 10 DOL.
const toPublicTest = async () => {
    await globalPrivateWallet.walletSync();
    const initialPrivateBalance = await globalPrivateWallet.getPrivateBalance(globalAssetId);
    _log("The initial balance is: ", initialPrivateBalance.toString());

    await globalPrivateWallet.toPublicSend(globalAssetId, globalAmount, globalPolkadotConfig.polkadotSigner, globalPolkadotConfig.polkadotAddress);
    await queryTransferResult(initialPrivateBalance);
}

// @ts-ignore
window.actions = {
    toPrivateTest,
    toPublicTest,
    privateTransferTest,
    publicTransferTest,
};

async function main() {
    _log("init");
    await initWallet();
    _log("init end");
};

main();

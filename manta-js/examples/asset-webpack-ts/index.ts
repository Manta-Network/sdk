// @ts-ignore
import { MantaPrivateWallet, SbtMantaPrivateWallet, Environment, Network, MantaUtilities } from 'manta.js';
import BN from 'bn.js';
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import { u8aToBn } from '@polkadot/util';

const privateWalletConfig = {
    environment: Environment.Production,
    network: Network.Manta,
}

async function main() {
    await toSBTPrivateTest();
    await toPrivateOnlySignTest();
    await toPrivateTest();
    await privateTransferOnlySignTest();
    await privateTransferTest();
    await toPublicOnlySignTest();
    await toPublicTest();
    await publicTransferTest();
    await publicTransferOnlySignTest();
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

/// Test to publicly transfer 10 MANTA.
const publicTransferTest = async () => {
    const privateWallet = await MantaPrivateWallet.init(privateWalletConfig);
    await privateWallet.api.isReady;
    const polkadotConfig = await getPolkadotSignerAndAddress();

    const assetId = new BN("1"); // MANTA
    const amount = new BN("10000000000000000000"); // 10 units

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

/// Test to publicly transfer 5 zkMANTA.
const publicTransferOnlySignTest = async () => {
    const privateWallet = await MantaPrivateWallet.init(privateWalletConfig);

    const destinationAddress = "5FHT5Rt1oeqAytX5KSn4ZZQdqN8oEa5Y81LZ5jadpk41bdoM";
    const assetId = new BN("1"); // MANTA
    const amount = new BN("10000000000000000000"); // 10 units

    let tx = MantaUtilities.publicTransferBuild(privateWallet.api, assetId, amount, destinationAddress);

    console.log("The resulting tx payload is : ", tx);
}

/// Test to privately transfer 5 zkMANTA.
const privateTransferTest = async () => {
    const privateWallet = await MantaPrivateWallet.init(privateWalletConfig);
    await privateWallet.api.isReady;
    const polkadotConfig = await getPolkadotSignerAndAddress();

    const assetId = new BN("1"); // MANTA
    const amount = new BN("5000000000000000000"); // 5 units

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
    const privateWallet = await MantaPrivateWallet.init(privateWalletConfig);
    const polkadotConfig = await getPolkadotSignerAndAddress();

    const assetId = new BN("1"); // MANTA
    const amount = new BN("5000000000000000000"); // 5 units

    const toPrivateTestAddress = "3UG1BBvv7viqwyg1QKsMVarnSPcdiRQ1aL2vnTgwjWYX";

    await privateWallet.initialWalletSync();

    const initialPrivateBalance = await privateWallet.getPrivateBalance(assetId);
    console.log("The initial private balance is: ", initialPrivateBalance.toString());

    let signResult = await privateWallet.privateTransferBuild(assetId, amount, toPrivateTestAddress, polkadotConfig.polkadotSigner, polkadotConfig.polkadotAddress);

    console.log("The result of the signing: ", signResult);

    console.log("Full payload for use directly on the Manta Network parachains: ", JSON.stringify(signResult.txs[0]));

    console.log("For xcm remote transact payload use: " + MantaUtilities.removeLeadingBytesFromHexString(JSON.stringify(signResult.txs[0]), 3, false));
}


/// Test to sign a transaction that converts 10 MANTA to zkMANTA,
/// without publishing the transaction.
const toPrivateOnlySignTest = async () => {
    const privateWallet = await MantaPrivateWallet.init(privateWalletConfig);
    await privateWallet.api.isReady;
    const polkadotConfig = await getPolkadotSignerAndAddress();

    const zkAddress = await privateWallet.getZkAddress();
    console.log("The zk address is: ", zkAddress);

    const assetId = new BN("1"); // MANTA
    const amount = new BN("10000000000000000000"); // 10 units

    await privateWallet.initialWalletSync();

    const initialPrivateBalance = await privateWallet.getPrivateBalance(assetId);
    console.log("The initial private balance is: ", initialPrivateBalance.toString());

    const signResult = await privateWallet.toPrivateBuild(assetId, amount, polkadotConfig.polkadotSigner, polkadotConfig.polkadotAddress);

    console.log("The result of the signing: ", JSON.stringify(signResult));

    console.log("Full payload for use directly on the Manta Network parachains: ", JSON.stringify(signResult.txs[0]));

    console.log("For xcm remote transact payload use: " + MantaUtilities.removeLeadingBytesFromHexString(JSON.stringify(signResult.txs[0]), 3, false));
}

/// Test to execute a `ToPrivate` transaction.
/// Convert 10 MANTA to 10 zkMANTA.
const toPrivateTest = async () => {
    const privateWallet = await MantaPrivateWallet.init(privateWalletConfig);
    await privateWallet.api.isReady;
    const polkadotConfig = await getPolkadotSignerAndAddress();

    const zkAddress = await privateWallet.getZkAddress();
    console.log("The zk address is: ", zkAddress);

    const assetId = new BN("1"); // MANTA
    const amount = new BN("10000000000000000000"); // 10 units

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
    const privateWallet = await MantaPrivateWallet.init(privateWalletConfig);
    const polkadotConfig = await getPolkadotSignerAndAddress();

    const privateAddress = await privateWallet.getZkAddress();
    console.log("The private address is: ", privateAddress);

    const assetId = new BN("1"); // MANTA
    const amount = new BN("5000000000000000000"); // 5 units

    await privateWallet.initialWalletSync();

    const initialPrivateBalance = await privateWallet.getPrivateBalance(assetId);
    console.log("The inital private balance is: ", initialPrivateBalance.toString());

    let signResult = await privateWallet.toPublicBuild(assetId, amount, polkadotConfig.polkadotSigner, polkadotConfig.polkadotAddress);

    console.log("The result of the signing: ", signResult);

    console.log("Full payload for use directly on the Manta Network parachains: ", JSON.stringify(signResult.txs[0]));

    console.log("For xcm remote transact payload use: " + MantaUtilities.removeLeadingBytesFromHexString(JSON.stringify(signResult.txs[0]), 3, false));
}

/// Test to execute a `ToPublic` transaction.
/// Convert 5 zkMANTA to 5 MANTA.
const toPublicTest = async () => {
    const privateWallet = await MantaPrivateWallet.init(privateWalletConfig);
    await privateWallet.api.isReady;
    const polkadotConfig = await getPolkadotSignerAndAddress();

    const zkAddress = await privateWallet.getZkAddress();
    console.log("The zk address is: ", zkAddress);

    const assetId = new BN("1"); // MANTA
    const amount = new BN("5000000000000000000"); // 5 units

    await privateWallet.initialWalletSync();

    const initialPrivateBalance = await privateWallet.getPrivateBalance(assetId);
    console.log("The initial private balance is: ", initialPrivateBalance.toString());

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

/// Test to mint an sbt.
const toSBTPrivateTest = async () => {
    const privateWallet = await SbtMantaPrivateWallet.initSBT(privateWalletConfig);
    const polkadotConfig = await getPolkadotSignerAndAddress();
    console.log("Public address:" + polkadotConfig.polkadotAddress);

    const privateAddress = await privateWallet.getZkAddress();
    console.log("The private address is: ", privateAddress);

    const numberOfMints = 2;
    const metadata: string[] = [];
    for (let i = 0; i < numberOfMints; i++ ) {
        // create metadata of sbt, this can be anything (eg. IPFS hash)
        metadata.push(`hello ${i.toString()}`)
    }
    await privateWallet.initialWalletSync();

    const reserveSbt = await privateWallet.buildReserveSbt(polkadotConfig.polkadotSigner, polkadotConfig.polkadotAddress);
    const reserveGasFee = await reserveSbt.paymentInfo(polkadotConfig.polkadotAddress);
    console.log("reserveSbt Gas Fee: ",`
        class=${reserveGasFee.class.toString()},
        weight=${reserveGasFee.weight.toString()},
        partialFee=${reserveGasFee.partialFee.toHuman()}
    `);

    // example of some error handling of tx result
    await reserveSbt.signAndSend(polkadotConfig.polkadotAddress, {}, (result: {status: any, events: any, dispatchError: any}) => {
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

    console.log("Wait for zkp generation!")
    // pause to wait for tx to submit
    await new Promise(r => setTimeout(r, 30000));

    const assetIdRange: any = await privateWallet.api.query.mantaSbt.reservedIds(polkadotConfig.polkadotAddress);
    if (assetIdRange.isNone) {
        console.error("no assetId in storage mapped to this account");
        return
    }
    const assetId = assetIdRange.unwrap()[0];

    const initalPrivateBalance = await privateWallet.getPrivateBalance(assetId);
    console.log("NFT AssetId: ", assetId.toString());
    console.log("NFT Present: ", initalPrivateBalance.toString());

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
}

main();

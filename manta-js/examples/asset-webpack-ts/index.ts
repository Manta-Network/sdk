// @ts-ignore
import { MantaPrivateWallet, SbtMantaPrivateWallet, Environment, Network, MantaUtilities } from 'manta.js';
import BN from 'bn.js';
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import { u8aToBn } from '@polkadot/util'

async function main() {
    await toSBTPrivateTest();
    await identityProofGen();
    //await toPrivateOnlySignTest();
    //await toPrivateTest();
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
    console.log("Sender Balance:" + JSON.stringify(senderBalance.toString()));

    const destinationBalance = await MantaUtilities.getPublicBalance(privateWallet.api, assetId, destinationAddress);
    console.log("Destination Balance:" + JSON.stringify(destinationBalance.toString()));

    await MantaUtilities.publicTransfer(privateWallet.api, assetId, amount, destinationAddress, polkadotConfig.polkadotAddress, polkadotConfig.polkadotSigner);

    await new Promise(r => setTimeout(r, 10000));

    const senderBalanceAfterTrasnfer = await MantaUtilities.getPublicBalance(privateWallet.api, assetId,polkadotConfig.polkadotAddress);
    console.log("Sender Balance After:" + JSON.stringify(senderBalanceAfterTrasnfer.toString()));

    const destinationBalanceAfterTransfer = await MantaUtilities.getPublicBalance(privateWallet.api, assetId, destinationAddress);
    console.log("Dest Balance After:" + JSON.stringify(destinationBalanceAfterTransfer.toString()));
}

/// Test to privately transfer 5 pDOL.
const privateTransferTest = async () => {
    const privateWalletConfig = {
        environment: Environment.Development,
        network: Network.Dolphin
    }

    const privateWallet = await MantaPrivateWallet.init(privateWalletConfig);
    const polkadotConfig = await getPolkadotSignerAndAddress();

    const assetId = new BN("1"); // DOL
    const amount = new BN("5000000000000000000"); // 5 units

    const toPrivateTestAddress = "3UG1BBvv7viqwyg1QKsMVarnSPcdiRQ1aL2vnTgwjWYX";

    await privateWallet.initalWalletSync();

    const initalPrivateBalance = await privateWallet.getPrivateBalance(assetId);
    console.log("The inital private balance is: ", initalPrivateBalance.toString());

    await privateWallet.privateTransferSend(assetId, amount, toPrivateTestAddress, polkadotConfig.polkadotSigner, polkadotConfig.polkadotAddress);

    while (true) {

        await new Promise(r => setTimeout(r, 5000));
        console.log("Syncing with ledger...");
        await privateWallet.walletSync();
        let newPrivateBalance = await privateWallet.getPrivateBalance(assetId);
        console.log("Private Balance after sync: ", newPrivateBalance.toString());

        if (initalPrivateBalance !== newPrivateBalance) {
            console.log("Detected balance change after sync!");
            console.log("Old balance: ", initalPrivateBalance.toString());
            console.log("New balance: ", newPrivateBalance.toString());
            break;
        }
    }
}

/// Test to sign a transaction that converts 10 DOL to pDOL,
/// without publishing the transaction.
const toPrivateOnlySignTest = async () => {

    const privateWalletConfig = {
        environment: Environment.Development,
        network: Network.Dolphin,
        transactionDataEnabled: true,
    }

    const privateWallet = await MantaPrivateWallet.init(privateWalletConfig);
    const polkadotConfig = await getPolkadotSignerAndAddress();

    const privateAddress = await privateWallet.getZkAddress();
    console.log("The private address is: ", privateAddress);

    const assetId = new BN("1"); // DOL
    const amount = new BN("20000000000000000000"); // 10 units

    await privateWallet.initalWalletSync();

    const initalPrivateBalance = await privateWallet.getPrivateBalance(assetId);
    console.log("The inital private balance is: ", initalPrivateBalance.toString());

    const signResult = await privateWallet.toPrivateBuild(assetId, amount, polkadotConfig.polkadotSigner, polkadotConfig.polkadotAddress);

    console.log("The result of the signing: ", JSON.stringify(signResult));
}

/// Test to execute a `ToPrivate` transaction.
/// Convert 10 DOL to 10 pDOL.
const toPrivateTest = async () => {

    const privateWalletConfig = {
        environment: Environment.Development,
        network: Network.Dolphin,
        loggingEnabled: true
    }

    const privateWallet = await MantaPrivateWallet.init(privateWalletConfig);
    const polkadotConfig = await getPolkadotSignerAndAddress();

    const privateAddress = await privateWallet.getZkAddress();
    console.log("The private address is: ", privateAddress);

    const assetId = new BN("1"); // DOL
    const amount = new BN("10000000000000000000"); // 10 units

    await privateWallet.initalWalletSync();

    const initalPrivateBalance = await privateWallet.getPrivateBalance(assetId);
    console.log("The inital private balance is: ", initalPrivateBalance.toString());

    await privateWallet.toPrivateSend(assetId, amount, polkadotConfig.polkadotSigner, polkadotConfig.polkadotAddress);

    while (true) {

        await new Promise(r => setTimeout(r, 5000));
        console.log("Syncing with ledger...");
        await privateWallet.walletSync();
        let newPrivateBalance = await privateWallet.getPrivateBalance(assetId);
        console.log("Private Balance after sync: ", newPrivateBalance.toString());

        if (initalPrivateBalance !== newPrivateBalance) {
            console.log("Detected balance change after sync!");
            console.log("Old balance: ", initalPrivateBalance.toString());
            console.log("New balance: ", newPrivateBalance.toString());
            break;
        }
    }
}

/// Test to execute a `ToPublic` transaction.
/// Convert 5 pDOL to 5 DOL.
const toPublicTest = async () => {

    const privateWalletConfig = {
        environment: Environment.Development,
        network: Network.Dolphin
    }

    const privateWallet = await MantaPrivateWallet.init(privateWalletConfig);
    const polkadotConfig = await getPolkadotSignerAndAddress();

    const privateAddress = await privateWallet.getZkAddress();
    console.log("The private address is: ", privateAddress);

    const assetId = new BN("1"); // DOL
    const amount = new BN("5000000000000000000"); // 5 units

    await privateWallet.initalWalletSync();

    const initalPrivateBalance = await privateWallet.getPrivateBalance(assetId);
    console.log("The inital private balance is: ", initalPrivateBalance.toString());

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

/// Test to execute a `ToPrivate` transaction.
/// Convert 10 DOL to 10 pDOL.
const toSBTPrivateTest = async () => {
    const privateWalletConfig = {
        environment: Environment.Development,
        network: Network.Calamari,
        loggingEnabled: true
    }

    const privateWallet = await SbtMantaPrivateWallet.initSBT(privateWalletConfig);
    const polkadotConfig = await getPolkadotSignerAndAddress();

    const privateAddress = await privateWallet.getZkAddress();
    console.log("The private address is: ", privateAddress);

    const numberOfMints = 2;
    const metadata: string[] = [];
    for (let i = 0; i < numberOfMints; i++ ) {
        metadata.push(`hello ${i.toString()}`)
    }
    await privateWallet.initalWalletSync();

    const reserveSbt = await privateWallet.buildReserveSbt(polkadotConfig.polkadotSigner, polkadotConfig.polkadotAddress);
    const reserveGasFee = await reserveSbt.paymentInfo(polkadotConfig.polkadotAddress);
    console.log("reserveSbt Gas Fee: ",`
        class=${reserveGasFee.class.toString()},
        weight=${reserveGasFee.weight.toString()},
        partialFee=${reserveGasFee.partialFee.toHuman()}
    `);

    // example of some error handling of tx result
    await reserveSbt.signAndSend(polkadotConfig.polkadotAddress, (status: any, events: any, dispatchError: any) => {
        if (dispatchError) {
            if (dispatchError.isModule) {
                const moduleError = dispatchError.asModule;
                // polkadot.js version is older need to convert to BN
                const errorInfo = {index: moduleError.index, error: u8aToBn(moduleError.error)};
                // for module errors, we have the section indexed, lookup
                const decoded = privateWallet.api.registry.findMetaError(errorInfo);
                const { docs, name, section } = decoded;

                console.error("Call failed", `${section}.${name}: ${docs.join(' ')}`);
            } else {
                // Other, CannotLookup, BadOrigin, no extra info
                console.error("Call failed", dispatchError.toString());
            }
        }
    });

    // pause to wait for tx to submit
    await new Promise(r => setTimeout(r, 5000));

    const assetIdRange = await privateWallet.api.query.mantaSbt.reservedIds(polkadotConfig.polkadotAddress);
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
    await sbtMint.batchTx.signAndSend(polkadotConfig.polkadotAddress, (status: any, events: any, dispatchError: any) => {
        if (dispatchError) {
            if (dispatchError.isModule) {
                const moduleError = dispatchError.asModule;
                // polkadot.js version is older need to convert to BN
                const errorInfo = {index: moduleError.index, error: u8aToBn(moduleError.error)};
                // for module errors, we have the section indexed, lookup
                const decoded = privateWallet.api.registry.findMetaError(errorInfo);
                const { docs, name, section } = decoded;

                console.error("Call failed", `${section}.${name}: ${docs.join(' ')}`);
            } else {
                // Other, CannotLookup, BadOrigin, no extra info
                console.error("Call failed", dispatchError.toString());
            }
        }
    });

    console.log("transaction_datas:" + JSON.stringify(sbtMint.transactionDatas));

    while (true) {
        await new Promise(r => setTimeout(r, 5000));
        console.log("Syncing with ledger...");
        await privateWallet.walletSync();
        let newPrivateBalance = await privateWallet.getPrivateBalance(assetId);
        console.log("Private Balance after sync: ", newPrivateBalance.toString());
        console.log("NFT AssetId: ", assetId.toString());

        if (initalPrivateBalance.toString() !== newPrivateBalance.toString()) {
            console.log("Detected balance change after sync!");
            console.log(`Metadata: ${await privateWallet.getSBTMetadata(assetId)}`);
            console.log("Old balance: ", initalPrivateBalance.toString());
            console.log("New balance: ", newPrivateBalance.toString());
            break;
        }
    }
}

/// Test identity proof works
const  identityProofGen = async () => {
    const privateWalletConfig = {
        environment: Environment.Development,
        network: Network.Calamari,
        loggingEnabled: true
    }
    const privateWallet = await SbtMantaPrivateWallet.initSBT(privateWalletConfig);

    const privateAddress = await privateWallet.getZkAddress();
    console.log("The private address is: ", privateAddress);
    const addressBytes = privateWallet.convertPrivateAddressToJson(privateAddress);
    console.log("Private address in json form: ", addressBytes);

    const virtualAsset = '{"identifier":{"is_transparent":false,"utxo_commitment_randomness":[197,181,236,179,236,2,154,216,118,233,242,255,147,38,126,198,116,215,227,197,96,86,249,60,177,171,242,58,4,71,115,22]},"asset":{"id":[105,161,78,174,148,101,81,165,157,39,210,189,199,138,152,217,144,168,13,15,175,65,142,114,174,116,233,207,103,69,130,8],"value":248335983880879439675655614772184357380}}';
    const identityProof = await privateWallet.getIdentityProof(virtualAsset);
    console.log("Idnetity Proof: ", identityProof);
    //console.log("type of sink: ", new BN(identityProof[0].transfer_post.body.sinks[0]).toString());
    console.log("Identity Proof JSON: ", JSON.stringify(identityProof));
}

main();

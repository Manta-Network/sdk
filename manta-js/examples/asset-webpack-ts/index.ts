// @ts-ignore
import { MantaPrivateWallet, SbtMantaPrivateWallet, Environment, Network, MantaUtilities } from 'manta.js';
import BN from 'bn.js';
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import axios from "axios";
import { u8aToBn } from '@polkadot/util';

const privateWalletConfig = {
    environment: Environment.Development,
    network: Network.Calamari,
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

    await toSBTPrivateTest(false);
    // await reserveAndMints();
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
    await privateWallet.api.isReady;
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

    const senderBalanceAfterTransfer = await MantaUtilities.getPublicBalance(privateWallet.api, assetId,polkadotConfig.polkadotAddress);
    console.log("Sender Balance After:" + JSON.stringify(senderBalanceAfterTransfer.toString()));

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
    await privateWallet.api.isReady;
    const polkadotConfig = await getPolkadotSignerAndAddress();

    const assetId = new BN("1"); // DOL
    const amount = new BN("5000000000000000000"); // 5 units

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

/// Test to sign a transaction that converts 10 DOL to pDOL,
/// without publishing the transaction.
const toPrivateOnlySignTest = async () => {

    const privateWalletConfig = {
        environment: Environment.Development,
        network: Network.Dolphin,
        transactionDataEnabled: true,
    }

    const privateWallet = await MantaPrivateWallet.init(privateWalletConfig);
    await privateWallet.api.isReady;
    const polkadotConfig = await getPolkadotSignerAndAddress();

    const privateAddress = await privateWallet.getZkAddress();
    console.log("The private address is: ", privateAddress);

    const assetId = new BN("1"); // DOL
    const amount = new BN("20000000000000000000"); // 10 units

    await privateWallet.initalWalletSync();

    const initialPrivateBalance = await privateWallet.getPrivateBalance(assetId);
    console.log("The initial private balance is: ", initialPrivateBalance.toString());

    const signResult = await privateWallet.toPrivateBuild(assetId, amount, polkadotConfig.polkadotSigner, polkadotConfig.polkadotAddress);

    console.log("The result of the signing: ", JSON.stringify(signResult));

    console.log("Full: ", JSON.stringify(signResult.txs));
    // remove first 3 bytes of the signResult
    console.log("For xcm remote transact payload, please use: [\"0x" + JSON.stringify(signResult.txs).slice(10));
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
    await privateWallet.api.isReady;
    const polkadotConfig = await getPolkadotSignerAndAddress();

    const privateAddress = await privateWallet.getZkAddress();
    console.log("The private address is: ", privateAddress);

    const assetId = new BN("1"); // DOL
    const amount = new BN("10000000000000000000"); // 10 units

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

/// Test to execute a `ToPublic` transaction.
/// Convert 5 pDOL to 5 DOL.
const toPublicTest = async () => {

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
    const amount = new BN("5000000000000000000"); // 5 units

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
    await privateWallet.initalWalletSync();

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

    // pause to wait for tx to submit
    await new Promise(r => setTimeout(r, 2000));

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

    if(verify == true) {
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
            console.log("tx data request" + index);
            console.log(JSON.stringify(request))
            return request;
        }));

        await new Promise(r => setTimeout(r, 5000));

        const request = requests[0];

        // Send data to manta-authentication verifier service to validate.
        // TODO: failed if loop all request.
        // requests.forEach(async (request: any) => {
            console.log("insert new transaction id.....");
            await axios.post("http://127.0.0.1:5000", request).then(function (response) {
                console.log("tx id response:" + JSON.stringify(response.data));
            });

            await new Promise(r => setTimeout(r, 5000));

            console.log("virtual asset.....");
            await axios.post("http://127.0.0.1:5000/virtual_asset", request).then(async function (response) {
                console.log("virtual asset response:" + JSON.stringify(response.data));
                const json_str = JSON.stringify(response.data)

                const virtual_asset = `${json_str}`;
                const identity_proof_response = await identityProofGen(privateWallet, virtual_asset);
                // console.log("identity proof format response:");
                // console.log(identity_proof_response);

                var validate_request: any = {"transaction_data": {}, "constructed_transfer_post": {"transfer_post": {}}};
                validate_request.transaction_data = request.transaction_data;
                const identity_response = JSON.parse(identity_proof_response)
                validate_request.constructed_transfer_post.transfer_post = identity_response;
                console.log("validate request:");
                console.log(JSON.stringify(validate_request))

                console.log("validate proof id:");
                await axios.post("http://127.0.0.1:5000/verify", validate_request).then(async function (response) {
                    console.log("validate response:" + JSON.stringify(response.data));
                });
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
    await privateWallet.initalWalletSync();

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


const identityProofGen = async (privateWallet: any, virtualAsset: string) => {
    const identityProof = await privateWallet.getIdentityProof(virtualAsset);
    // console.log("Idnetity Proof: ", identityProof);
    // console.log("Identity Proof JSON: ", JSON.stringify(identityProof));

    // const identityProofJson = JSON.stringify(identityProof);
    const authorization_signature = identityProof[0].authorization_signature;
    delete identityProof[0].authorization_signature;
    var identityProof2: any = {"authorization_signature": "", "body": {}};
    identityProof2.body = identityProof[0];
    identityProof2.authorization_signature = authorization_signature;
    // console.log("add body:" + JSON.stringify(identityProof2));

    const sink = identityProof2.body.sinks[0];
    const bn = u8aToBn(sink);
    identityProof2.body.sinks[0] = bn.toString();
    // console.log(JSON.stringify(identityProof2));

    const identityProofJson = JSON.stringify(identityProof2);
    const format_json = identityProofJson.replace('"sinks":["', '"sinks":[').replace('"],"proof"', '],"proof"');
    return format_json;
}

main();

function toHexString(byteArray: Uint8Array) {
    return byteArray.reduce((output, elem) =>
      (output + ('0' + elem.toString(16)).slice(-2)),
      '');
  }

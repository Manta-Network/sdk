// TODO: should use published npm package
// import * as sdk from '../../sdk/sdk';
import * as sdk from 'manta.js';

// const to_private_address = "64nmibscb1UdWGMWnRQAYx6hS4TA2iyFqiS897cFRWvNTmjad85p6yD9ud7cyVPhyNPDrSMs2eZxTfovxZbJdFqH";
const publicPolkadotJsAddress = "5HifovYZVQSD4rKLVMo1Rqtv45jfPhCUiGYbf4gPEtKyc1PS"
const to_private_address = "3UG1BBvv7viqwyg1QKsMVarnSPcdiRQ1aL2vnTgwjWYX";
const NFT_AMOUNT = 1000000000000;
const amount = "10000000000000000000"; // 10 unit
const half_amount = "5000000000000000000"; // 5 unit
const ALICE = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY";

async function main() {

    // Fungible Token test
    await ft_test_to_private();
    await ft_test_to_public();
    await ft_test_private_transfer();

    // await public_transfer_test();
    // await create_nft_test();

    // Sing test
    // await ft_test_to_private_only_sign();
    // await private_balance();

    console.log("END");
}

const public_transfer_test = async () => {
    const env = sdk.Environment.Development;
    const net = sdk.Network.Dolphin;
    const mantaSdk = await sdk.init(env,net, "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY");

    const asset_id_number = 1; // DOL
    const asset_id = mantaSdk.numberToAssetIdArray(asset_id_number);

    const dest_address = "5FHT5Rt1oeqAytX5KSn4ZZQdqN8oEa5Y81LZ5jadpk41bdoM";

    const sender_balance = await mantaSdk.publicBalance(asset_id);
    console.log("Sender Balance:" + JSON.stringify(sender_balance));

    const dest_balance = await mantaSdk.publicBalance(asset_id, dest_address);
    console.log("Dest Balance:" + JSON.stringify(dest_balance));
    
    const amount = "1000000000000000000"; // 1 unit

    await mantaSdk.publicTransfer(asset_id, amount, dest_address);

    const sender_balance2 = await mantaSdk.publicBalance(asset_id);
    console.log("Sender Balance After:" + JSON.stringify(sender_balance2));

    const dest_balance2 = await mantaSdk.publicBalance(asset_id, dest_address);
    console.log("Dest Balance After:" + JSON.stringify(dest_balance2));   
}

/// Note: This test requires Manta node with uniques pallet integrated.
const create_nft_test = async () => {
    const env = sdk.Environment.Development;
    const net = sdk.Network.Dolphin;
    const mantaSdk = await sdk.init(env,net);


    // collection_id: 4369(0x1111), item_id: 1(0x0001), asset_id: 0x11110001=286326785

    const collectionId = 0;
    const itemId = 2;
    const assetIdNumber = 12;
    const assetId = mantaSdk.numberToAssetIdArray(assetIdNumber);
    const metadata = "https://ipfs.io/";
    const aliceAddress = "dmyjURuBeJwFo4Nvf2GZ8f5E2Asz98JY2d7UcaDykqYm1zpoi";
    const to_private_address = "3UG1BBvv7viqwyg1QKsMVarnSPcdiRQ1aL2vnTgwjWYX";


    /*
    await mantaSdk.initalWalletSync();

    let privateBalance = await mantaSdk.privateBalance(assetId);
    console.log("The current balance of the private NFT with asset ID 8 is ", privateBalance);
    
    await mantaSdk.toPublicNFT(assetId);

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
    */

    //const assetIdResult = await mantaSdk.mintNFTAndSetMetadata(collectionId,itemId,"",metadata);
    //console.log(assetIdResult);


    //const collectionIdRes = await mantaSdk.createCollection();

    //const n = await mantaSdk.assetIdArrayToNumber(collectionIdRes);

    //const nft_register = await mantaSdk.mintNFT(collectionId, itemId);

    //await mantaSdk.updateNFTMetadata(collectionId,itemId,metadata);

    //const stored_metadata = await mantaSdk.getNFTMetadata(collectionId,itemId);

    //await mantaSdk.publicTransferNFT(assetId,aliceAddress);

    //const all_nfts = await mantaSdk.viewAllNFTsInCollection(collectionId);
    //console.log(all_nfts)

    //const metadata2: any = {
    //    "NonFungible": [collectionId, itemId]
    //}

    //const registeredAssetId = await mantaSdk.api.query.assetManager.registeredAssetId(metadata2);
    //console.log(registeredAssetId.toHuman());


    //const owner_address = await mantaSdk.getNFTOwner(assetId);
    //console.log(owner_address);

}

const ft_test_to_private_only_sign = async () => {

    const env = sdk.Environment.Development;
    const net = sdk.Network.Dolphin;
    const mantaSdk = await sdk.init(env,net, ALICE);

    const privateAddress = await mantaSdk.privateAddress();
    console.log("The private address is: ", privateAddress);

    const asset_id_number = 1; // DOL
    const asset_id = mantaSdk.numberToAssetIdArray(asset_id_number);

    await mantaSdk.initalWalletSync();

    const initalPrivateBalance = await mantaSdk.privateBalance(asset_id);
    console.log("The inital private balance is: ", initalPrivateBalance);

    const signResult = await mantaSdk.toPrivateSign(asset_id, amount, true);

    console.log("The result of the signing: ", JSON.stringify(signResult.transactions));
}

const private_balance = async () => {

    const env = sdk.Environment.Development;
    const net = sdk.Network.Dolphin;
    const mantaSdk = await sdk.init(env,net, ALICE);

    const privateAddress = await mantaSdk.privateAddress();
    console.log("The private address is: ", privateAddress);

    const asset_id_number = 1; // DOL
    const asset_id = mantaSdk.numberToAssetIdArray(asset_id_number);

    await mantaSdk.initalWalletSync();

    const initalPrivateBalance = await mantaSdk.privateBalance(asset_id);
    console.log("The inital private balance is: ", initalPrivateBalance);
}

const ft_test_to_private = async () => {

    const env = sdk.Environment.Development;
    const net = sdk.Network.Dolphin;
    const mantaSdk = await sdk.init(env,net, ALICE);

    const privateAddress = await mantaSdk.privateAddress();
    console.log("The private address is: ", privateAddress);

    const asset_id_number = 1; // DOL
    const asset_id = mantaSdk.numberToAssetIdArray(asset_id_number);

    await mantaSdk.initalWalletSync();

    const initalPrivateBalance = await mantaSdk.privateBalance(asset_id);
    console.log("The inital private balance is: ", initalPrivateBalance);

    await mantaSdk.toPrivateSign(asset_id, amount);

    while (true) {

        await new Promise(r => setTimeout(r, 5000));
        console.log("Syncing with ledger...");
        await mantaSdk.walletSync();
        let newPrivateBalance = await mantaSdk.privateBalance(asset_id);
        console.log("Private Balance after sync: ", newPrivateBalance);

        if (initalPrivateBalance !== newPrivateBalance) {
            console.log("Detected balance change after sync!");
            console.log("Old balance: ", initalPrivateBalance);
            console.log("New balance: ", newPrivateBalance);
            break;
        }
    }
}

const ft_test_private_transfer = async () => {

    const env = sdk.Environment.Development;
    const net = sdk.Network.Dolphin;
    const mantaSdk = await sdk.init(env,net, ALICE);

    const privateAddress = await mantaSdk.privateAddress();
    console.log("The private address is: ", privateAddress);

    const asset_id_number = 1; // DOL
    const asset_id = mantaSdk.numberToAssetIdArray(asset_id_number);

    await mantaSdk.initalWalletSync();

    const initalPrivateBalance = await mantaSdk.privateBalance(asset_id);
    console.log("The inital private balance is: ", initalPrivateBalance);

    await mantaSdk.privateTransfer(asset_id, half_amount, to_private_address);

    while (true) {

        await new Promise(r => setTimeout(r, 5000));
        console.log("Syncing with ledger...");
        await mantaSdk.walletSync();
        let newPrivateBalance = await mantaSdk.privateBalance(asset_id);
        console.log("Private Balance after sync: ", newPrivateBalance);

        if (initalPrivateBalance !== newPrivateBalance) {
            console.log("Detected balance change after sync!");
            console.log("Old balance: ", initalPrivateBalance);
            console.log("New balance: ", newPrivateBalance);
            break;
        }
    }
}


const ft_test_to_public = async () => {

    const env = sdk.Environment.Development;
    const net = sdk.Network.Dolphin;
    const mantaSdk = await sdk.init(env,net, ALICE);

    const privateAddress = await mantaSdk.privateAddress();
    console.log("The private address is: ", privateAddress);

    const asset_id_number = 1; // DOL
    const asset_id = mantaSdk.numberToAssetIdArray(asset_id_number);

    await mantaSdk.initalWalletSync();

    const initalPrivateBalance = await mantaSdk.privateBalance(asset_id);
    console.log("The inital private balance is: ", initalPrivateBalance);

    await mantaSdk.toPublic(asset_id, half_amount);

    await mantaSdk.walletSync();
    let privateBalance = await mantaSdk.privateBalance(asset_id);

    while (true) {

        await new Promise(r => setTimeout(r, 5000));
        console.log("Syncing with ledger...");
        await mantaSdk.walletSync();
        let newPrivateBalance = await mantaSdk.privateBalance(asset_id);
        console.log("Private Balance after sync: ", newPrivateBalance);

        if (privateBalance !== newPrivateBalance) {
            console.log("Detected balance change after sync!");
            console.log("Old balance: ", privateBalance);
            console.log("New balance: ", newPrivateBalance);
            break;
        }
    }

}

main()

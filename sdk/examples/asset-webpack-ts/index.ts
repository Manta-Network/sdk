// TODO: should use published npm package
// import * as sdk from '../../sdk/sdk';
import * as sdk from 'manta.js';

// const to_private_address = "64nmibscb1UdWGMWnRQAYx6hS4TA2iyFqiS897cFRWvNTmjad85p6yD9ud7cyVPhyNPDrSMs2eZxTfovxZbJdFqH";
const to_private_address = "3UG1BBvv7viqwyg1QKsMVarnSPcdiRQ1aL2vnTgwjWYX";

async function main() {

    //const publicPolkadotJsAddress = "5HifovYZVQSD4rKLVMo1Rqtv45jfPhCUiGYbf4gPEtKyc1PS"

    //await ft_test_to_private();
    //await ft_test_to_public();
    //await ft_test_to_private();


    await create_nft_test();


    console.log("END");
}


/// Note: This test requires Manta node with uniques pallet integrated.
const create_nft_test = async () => {
    const env = sdk.Environment.Development;
    const net = sdk.Network.Dolphin;
    const mantaSdk = await sdk.init(env,net);


    // collection_id: 4369(0x1111), item_id: 1(0x0001), asset_id: 0x11110001=286326785

    const collectionId = 4369;
    const itemId = 1;
    const assetId = 286326785;
    const metadata = "https://ipfs.io/";

    //await mantaSdk.createCollection(collectionId);

    //await mantaSdk.mintNFT(collectionId, itemId);

    //await mantaSdk.updateNFTMetadata(collectionId,itemId,metadata);

    //const stored_metadata = await mantaSdk.getNFTMetadata(collectionId,itemId);

}

const ft_test_to_private_only_sign = async () => {

    const env = sdk.Environment.Development;
    const net = sdk.Network.Dolphin;
    const mantaSdk = await sdk.init(env,net);

    const privateAddress = await mantaSdk.privateAddress();
    console.log("The private address is: ", privateAddress);

    const amount = 10000000000000000000; // 10 units
    const asset_id_number = 1; // DOL
    const asset_id = mantaSdk.numberToAssetIdArray(asset_id_number);

    await mantaSdk.initalWalletSync();

    const initalPrivateBalance = await mantaSdk.privateBalance(asset_id);
    console.log("The inital private balance is: ", initalPrivateBalance);

    const signResult = await mantaSdk.toPrivateSign(asset_id, amount, true);

    console.log("The result of the signing: ", signResult);
}

const ft_test_to_private = async () => {

    const env = sdk.Environment.Development;
    const net = sdk.Network.Dolphin;
    const mantaSdk = await sdk.init(env,net);

    const privateAddress = await mantaSdk.privateAddress();
    console.log("The private address is: ", privateAddress);

    const amount = 1000000000000000000; // 1 unit
    const asset_id_number = 1; // DOL
    const asset_id = mantaSdk.numberToAssetIdArray(asset_id_number);

    await mantaSdk.initalWalletSync();

    const initalPrivateBalance = await mantaSdk.privateBalance(asset_id);
    console.log("The inital private balance is: ", initalPrivateBalance);

    await mantaSdk.toPrivateSign(asset_id, amount);
    // await mantaSdk.privateTransfer(asset_id, private_amount, to_private_address);
    // await mantaSdk.toPublic(asset_id, private_amount);

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
    const mantaSdk = await sdk.init(env,net);

    const privateAddress = await mantaSdk.privateAddress();
    console.log("The private address is: ", privateAddress);

    const amount = 1000000000000000000; // 1 unit
    const asset_id_number = 1; // DOL
    const asset_id = mantaSdk.numberToAssetIdArray(asset_id_number);

    await mantaSdk.initalWalletSync();

    const initalPrivateBalance = await mantaSdk.privateBalance(asset_id);
    console.log("The inital private balance is: ", initalPrivateBalance);

    await mantaSdk.toPublic(asset_id, amount);

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

// @TODO: Create proper implementation of mantaSdk.numberToAssetIdArray and
// mantaSdk.assetIdArrayToNumber so this test will work.
// @TODO: Will need to update test to use register asset and new nft creation methods.
/*
const nft_test_to_private = async () => {
    const env = sdk.Environment.Development;
    const net = sdk.Network.Dolphin;
    const mantaSdk = await sdk.init(env,net);

    const privateAddress = await mantaSdk.privateAddress();
    console.log("The private address is: ", privateAddress);

    const nft_asset_id = 286326785;

    await mantaSdk.initalWalletSync();

    const initalPrivateBalanceNFT = await mantaSdk.privateBalance(nft_asset_id);
    console.log("The inital private balance of NFT is: ", initalPrivateBalanceNFT);

    await mantaSdk.toPrivateNFT(286326785);

    await mantaSdk.walletSync();

    let privateBalance = await mantaSdk.privateBalance(nft_asset_id);

    while (true) {

        await new Promise(r => setTimeout(r, 5000));
        console.log("Syncing with ledger...");
        await mantaSdk.walletSync();
        let newPrivateBalance = await mantaSdk.privateBalance(nft_asset_id);
        console.log("Private Balance after sync: ", newPrivateBalance);

        if (privateBalance !== newPrivateBalance) {
            console.log("Detected balance change after sync!");
            console.log("Old balance: ", privateBalance);
            console.log("New balance: ", newPrivateBalance);
            break;
        }
    }
}
*/
main()

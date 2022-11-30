// TODO: should use published npm package
// import * as sdk from '../../sdk/sdk';
import * as sdk from 'manta.js';

const to_private_address = "64nmibscb1UdWGMWnRQAYx6hS4TA2iyFqiS897cFRWvNTmjad85p6yD9ud7cyVPhyNPDrSMs2eZxTfovxZbJdFqH";

async function main() {

    //const publicPolkadotJsAddress = "5HifovYZVQSD4rKLVMo1Rqtv45jfPhCUiGYbf4gPEtKyc1PS"

    await ft_test_to_private();
    // await ft_test_to_public();

    // convert();
    console.log("END");
}

function convert() {
    const post = `{"authorization_signature":null,"asset_id":[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"sources":["10000000000000000000"],"sender_posts":[],"receiver_posts":[{"utxo":{"is_transparent":false,"public_asset":{"id":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"value":0},"commitment":[63,249,147,167,189,223,43,168,228,242,236,211,4,102,247,226,13,117,0,47,207,247,192,112,96,193,151,70,68,154,42,30]},"note":{"address_partition":219,"incoming_note":{"header":null,"ciphertext":{"ephemeral_public_key":[247,149,26,184,43,212,162,69,26,77,225,57,22,14,120,223,24,0,31,41,23,152,191,111,72,112,17,19,241,17,243,141],"ciphertext":{"tag":[144,173,134,57,21,9,116,104,116,165,25,115,102,28,57,139,32,231,19,58,92,100,130,219,154,51,52,168,223,202,194,3],"message":[[[196,189,13,129,125,72,215,171,7,59,174,151,25,216,97,92,43,193,51,132,14,254,1,229,164,20,40,62,190,43,41,46],[194,214,99,18,88,192,187,152,241,148,117,189,178,162,22,236,77,75,6,64,229,126,38,2,135,119,192,128,23,16,62,26],[33,211,125,98,102,248,54,126,104,166,1,52,143,236,87,205,150,208,225,133,144,32,149,230,122,178,78,242,142,177,206,39]]]}}},"light_incoming_note":{"header":null,"ciphertext":{"ephemeral_public_key":[247,149,26,184,43,212,162,69,26,77,225,57,22,14,120,223,24,0,31,41,23,152,191,111,72,112,17,19,241,17,243,141],"ciphertext":[17,229,131,96,153,154,237,246,17,163,159,141,151,148,242,173,225,247,219,145,240,97,170,29,254,18,230,253,66,0,93,39,154,99,24,61,246,234,174,244,217,195,155,108,246,137,57,34,237,180,81,132,231,169,185,159,223,106,82,178,214,73,151,184,136,31,231,238,243,24,172,143,51,24,201,75,224,123,176,62,16,51,181,116,73,136,192,29,208,216,194,105,33,196,173,125]}}}}],"sinks":[],"proof":[210,65,160,1,251,20,49,24,102,205,240,33,109,114,119,120,131,100,180,173,225,182,59,77,22,39,29,86,142,93,143,15,234,239,61,85,8,139,82,167,209,141,82,204,153,193,119,86,38,232,74,62,91,132,123,143,242,138,75,134,243,83,241,11,112,6,140,70,93,175,74,237,50,28,203,6,164,151,154,92,59,209,70,198,21,130,38,99,97,239,205,59,188,238,223,143,3,193,205,244,48,201,103,34,99,177,5,186,163,66,101,9,44,41,169,104,58,68,92,153,153,21,62,254,209,47,107,131]}`;
    
    // let json = JSON.parse(JSON.stringify(post));
    let json = JSON.parse(post);
    console.log("origin post:" + json);

    json.receiver_posts.map((x:any) => {
        var arr1 = x.note.incoming_note.ciphertext.ciphertext.message.flatMap(
            function(item: any,index:any,a: any){
            return item;
        });
        const tag = x.note.incoming_note.ciphertext.ciphertext.tag; 
        const pk = x.note.incoming_note.ciphertext.ephemeral_public_key; 
        x.note.incoming_note.tag = tag;
        x.note.incoming_note.ephemeral_public_key = pk;
        x.note.incoming_note.ciphertext = arr1;
        delete x.note.incoming_note.header;

        const light_pk = x.note.light_incoming_note.ciphertext.ephemeral_public_key; 
        const light_cipher = x.note.light_incoming_note.ciphertext.ciphertext;
        const light_ciper0 = light_cipher.slice(0, 32);
        const light_ciper1 = light_cipher.slice(32, 64);
        const light_ciper2 = light_cipher.slice(64, 96);
        // const light_ciphertext = Array.from(light_ciper0, light_ciper1, light_ciper2);
        x.note.light_incoming_note.ephemeral_public_key = light_pk;
        x.note.light_incoming_note.ciphertext = [light_ciper0, light_ciper1, light_ciper2];
        delete x.note.light_incoming_note.header;
    });
    console.log("json1:" + JSON.stringify(json));
}

const ft_test_to_private = async () => {

    const env = sdk.Environment.Development;
    const net = sdk.Network.Dolphin;
    const mantaSdk = await sdk.init(env,net);

    const privateAddress = await mantaSdk.privateAddress();
    console.log("The private address is: ", privateAddress);

    const amount = 10000000000000000000; // 10 units
    const asset_id = 1; // DOL

    await mantaSdk.initalWalletSync();

    const initalPrivateBalance = await mantaSdk.privateBalance(asset_id);
    console.log("The inital private balance is: ", initalPrivateBalance);

    // await mantaSdk.toPrivateSign(asset_id, amount);

    await mantaSdk.walletSync();
    let privateBalance = await mantaSdk.privateBalance(asset_id);

    // while (true) {

        await new Promise(r => setTimeout(r, 5000));
        console.log("Syncing with ledger...");
        await mantaSdk.walletSync();
        let newPrivateBalance = await mantaSdk.privateBalance(asset_id);
        console.log("Private Balance after sync: ", newPrivateBalance);

        if (privateBalance !== newPrivateBalance) {
            console.log("Detected balance change after sync!");
            console.log("Old balance: ", privateBalance);
            console.log("New balance: ", newPrivateBalance);
            // break;
        }
    // }
}


const ft_test_to_public = async () => {

    const env = sdk.Environment.Development;
    const net = sdk.Network.Dolphin;
    const mantaSdk = await sdk.init(env,net);

    const privateAddress = await mantaSdk.privateAddress();
    console.log("The private address is: ", privateAddress);

    const amount = 1000000000000000000; // 1 unit
    const asset_id = 1; // DOL

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

main()

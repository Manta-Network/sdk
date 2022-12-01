// TODO: should use published npm package
// import * as sdk from '../../sdk/sdk';
import * as sdk from 'manta.js';

// const to_private_address = "64nmibscb1UdWGMWnRQAYx6hS4TA2iyFqiS897cFRWvNTmjad85p6yD9ud7cyVPhyNPDrSMs2eZxTfovxZbJdFqH";
const to_private_address = "3UG1BBvv7viqwyg1QKsMVarnSPcdiRQ1aL2vnTgwjWYX";

async function main() {

    //const publicPolkadotJsAddress = "5HifovYZVQSD4rKLVMo1Rqtv45jfPhCUiGYbf4gPEtKyc1PS"

    await ft_test_to_private();
    // await ft_test_to_public();

    // convert();
    console.log("END");
}

function convert() {
    const post = `{"authorization_signature":{"authorization_key":[234,139,192,54,77,61,254,104,67,253,30,19,213,73,171,99,11,191,167,228,243,118,116,47,46,182,142,73,149,67,26,160],"signature":{"scalar":[216,42,108,97,84,79,192,208,172,28,220,231,225,186,3,99,77,115,128,57,209,80,25,164,241,19,8,73,41,184,25,2],"nonce_point":[36,181,160,29,111,33,162,93,138,193,14,12,130,70,201,173,14,19,87,116,93,30,124,25,104,113,86,253,123,130,237,144]}},"asset_id":null,"sources":[],"sender_posts":[{"utxo_accumulator_output":[34,153,64,199,220,68,80,115,72,21,227,120,105,27,225,152,32,200,123,202,75,119,153,142,167,33,227,160,127,103,193,7],"nullifier":{"nullifier":{"commitment":[95,103,142,49,124,76,143,84,143,75,83,144,13,85,248,199,110,141,133,144,155,236,159,130,6,49,7,222,226,221,81,36]},"outgoing_note":{"header":null,"ciphertext":{"ephemeral_public_key":[62,54,221,165,9,92,169,152,18,199,61,148,8,202,149,195,142,92,88,34,137,120,192,132,11,26,60,69,219,225,52,164],"ciphertext":[98,135,3,236,252,87,53,8,228,28,0,98,114,21,229,12,214,206,172,63,78,86,243,213,192,177,42,150,166,52,39,38,136,24,8,167,253,38,159,165,26,57,14,22,238,223,137,208,17,234,235,17,71,55,68,46,245,152,27,128,183,221,101,45]}}}},{"utxo_accumulator_output":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"nullifier":{"nullifier":{"commitment":[96,209,145,165,61,233,121,68,213,52,66,177,33,103,26,64,159,195,115,37,149,107,95,108,84,107,45,22,17,157,147,42]},"outgoing_note":{"header":null,"ciphertext":{"ephemeral_public_key":[156,62,209,19,241,4,240,69,199,102,101,222,242,10,27,253,173,141,86,212,222,48,25,94,222,7,128,136,159,65,140,165],"ciphertext":[197,13,28,168,241,43,185,147,130,193,59,30,4,82,251,133,107,97,38,18,209,1,113,84,233,160,151,135,108,235,19,93,225,149,173,138,31,192,23,179,252,204,40,164,159,30,133,168,197,211,141,132,23,75,12,163,20,177,17,33,126,98,174,216]}}}}],"receiver_posts":[{"utxo":{"is_transparent":false,"public_asset":{"id":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"value":0},"commitment":[107,123,137,138,172,213,159,151,198,117,146,29,118,160,92,216,102,67,181,106,56,225,178,7,85,231,55,105,168,38,134,13]},"note":{"address_partition":93,"incoming_note":{"header":null,"ciphertext":{"ephemeral_public_key":[147,127,113,146,249,176,142,234,249,75,33,107,102,140,206,2,163,191,207,23,159,171,225,150,221,3,143,211,17,64,45,8],"ciphertext":{"tag":[243,208,158,171,48,41,245,61,141,20,131,15,183,183,9,157,155,31,240,133,61,129,225,115,235,137,247,55,40,158,24,23],"message":[[[250,66,153,76,100,131,208,49,45,146,188,247,83,177,168,209,185,236,51,107,224,252,12,113,204,1,182,145,92,194,185,41],[75,250,202,120,49,231,157,106,32,223,130,56,117,133,184,195,187,199,90,235,24,160,249,4,181,10,255,98,28,145,188,15],[198,220,83,86,72,200,58,228,143,230,198,155,133,190,115,155,76,192,42,54,184,140,155,58,112,175,196,49,135,9,243,46]]]}}},"light_incoming_note":{"header":null,"ciphertext":{"ephemeral_public_key":[147,127,113,146,249,176,142,234,249,75,33,107,102,140,206,2,163,191,207,23,159,171,225,150,221,3,143,211,17,64,45,8],"ciphertext":[227,7,117,158,185,246,141,182,45,184,53,42,126,98,106,226,128,30,55,253,72,219,234,231,151,3,144,153,72,215,16,62,55,161,246,217,254,242,238,144,238,99,21,127,105,231,71,40,121,15,190,251,19,136,25,78,112,240,33,145,77,63,65,103,64,117,167,202,81,222,165,64,246,44,25,30,180,184,183,30,227,103,124,43,38,103,12,105,118,216,245,129,217,183,125,232]}}}},{"utxo":{"is_transparent":false,"public_asset":{"id":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"value":0},"commitment":[180,179,225,3,230,255,14,98,150,203,100,42,182,147,57,87,231,168,142,56,224,241,96,30,228,107,252,101,198,113,205,41]},"note":{"address_partition":93,"incoming_note":{"header":null,"ciphertext":{"ephemeral_public_key":[29,106,33,39,59,7,136,163,143,3,36,215,171,230,189,154,1,229,44,162,217,178,116,6,144,130,179,194,19,179,125,151],"ciphertext":{"tag":[79,244,101,160,23,7,27,51,100,146,34,93,169,172,124,44,204,158,243,24,108,138,203,202,103,248,32,227,24,248,214,13],"message":[[[253,187,17,12,221,194,97,201,87,110,254,70,146,139,78,26,19,11,240,35,227,2,244,106,47,79,132,77,95,207,94,2],[123,92,132,223,183,2,40,166,7,183,97,66,196,114,178,46,64,27,144,160,112,72,86,34,142,133,92,146,34,82,167,34],[20,244,55,96,248,156,31,149,182,151,113,4,52,1,14,203,72,77,156,94,74,186,48,98,254,86,199,166,94,218,3,1]]]}}},"light_incoming_note":{"header":null,"ciphertext":{"ephemeral_public_key":[29,106,33,39,59,7,136,163,143,3,36,215,171,230,189,154,1,229,44,162,217,178,116,6,144,130,179,194,19,179,125,151],"ciphertext":[111,50,231,210,142,48,151,13,228,205,226,21,83,134,43,233,197,109,169,30,57,179,169,123,104,110,59,80,61,210,160,22,115,194,28,98,138,231,180,104,191,23,12,178,100,33,111,142,153,14,108,25,5,115,175,151,66,41,42,144,112,12,15,185,13,101,85,74,178,2,150,117,229,17,193,9,124,85,65,143,210,202,122,26,90,99,29,239,250,8,102,33,55,49,195,126]}}}}],"sinks":[],"proof":[92,205,220,141,220,239,24,201,82,71,118,145,210,234,226,214,38,231,68,137,33,2,124,255,183,85,141,64,218,53,161,155,26,182,237,37,134,40,120,173,50,135,90,156,66,152,6,103,118,157,32,157,187,210,41,252,225,30,92,164,94,213,214,34,45,78,24,70,103,44,68,11,172,182,151,164,128,185,255,57,67,167,169,88,225,162,204,51,16,82,57,134,74,32,130,168,202,247,31,169,122,202,38,96,15,127,203,203,7,22,157,87,151,245,30,186,111,49,63,202,127,21,147,18,118,186,238,160]}`;
    
    // let json = JSON.parse(JSON.stringify(post));
    let json = JSON.parse(post);
    console.log("origin post:" + json);

    const scala = json.authorization_signature.signature.scalar;
    const nonce = json.authorization_signature.signature.nonce_point;
    json.authorization_signature.signature = [scala, nonce];

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

        x.full_incoming_note = x.note;
        delete x.note;
    });
    json.sender_posts.map((x:any) => {
        const pk = x.nullifier.outgoing_note.ciphertext.ephemeral_public_key;
        const cipher = x.nullifier.outgoing_note.ciphertext.ciphertext; 
        const ciper0 = cipher.slice(0, 32);
        const ciper1 = cipher.slice(32, 64);
        const outgoing = {
            ephemeral_public_key: pk,
            ciphertext: [ciper0, ciper1]
        };
        x.outgoing_note = outgoing;

        const nullifier = x.nullifier.nullifier.commitment;
        x.nullifier_commitment = nullifier;
        delete x.nullifier;
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
    await mantaSdk.privateTransfer(asset_id, amount, to_private_address);

    await mantaSdk.walletSync();
    let privateBalance = await mantaSdk.privateBalance(asset_id);

    // while (true) {

        await new Promise(r => setTimeout(r, 5000));
        console.log("Syncing with ledger...");
        await mantaSdk.walletSync();
        let newPrivateBalance = await mantaSdk.privateBalance(asset_id);
        console.log("Private Balance after sync: ", newPrivateBalance);

        // if (privateBalance !== newPrivateBalance) {
        //     console.log("Detected balance change after sync!");
        //     console.log("Old balance: ", privateBalance);
        //     console.log("New balance: ", newPrivateBalance);
        //     break;
        // }
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

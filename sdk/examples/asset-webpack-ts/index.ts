// TODO: should use published npm package
// import * as sdk from '../../sdk/sdk';
import * as sdk from 'manta.js';

const to_private_address = "64nmibscb1UdWGMWnRQAYx6hS4TA2iyFqiS897cFRWvNTmjad85p6yD9ud7cyVPhyNPDrSMs2eZxTfovxZbJdFqH";

async function main() {
    
    /* OLD VERSION:
    const {api, signer} = await sdk.init_api(sdk.Environment.Production);

    const { wasm, wasmWallet } = await sdk.init_wasm_sdk(api, signer);

    await sdk.getPrivateAddress(wasm, wasmWallet);
    await sdk.init_sync(wasmWallet);

    const amount = 10000000000000000000;
    const asset_id = 1;

    await sdk.to_private_by_sign(api, signer, wasm, wasmWallet, asset_id, amount);
    // await sdk.private_transfer(api, signer, wasm, wasmWallet, 1, 1000000000000000000, to_private_address);

    await wasmWallet.sync();
    sdk.get_private_balance(wasm, wasmWallet, 1, "Sync1 after transfer");
  
    setTimeout(function () { }, 1000);
    await wasmWallet.sync();
    sdk.get_private_balance(wasm, wasmWallet, 1, "Sync2 After transfer");
  
    console.log("END");
    */

    const mantaSdk = await sdk.init(sdk.Environment.Production);

    const privateAddress = await mantaSdk.privateAddress();
    console.log("The private address is: ", privateAddress);

    await mantaSdk.initalWalletSync();
    
    const amount = 1000000000000000000; // 1 unit
    const asset_id = 1; // DOL

    await mantaSdk.toPrivateSign(asset_id,amount);

    await mantaSdk.walletSync();

    let privateBalance = await mantaSdk.privateBalance(asset_id);
    console.log("Private balance after first sync: ", privateBalance);

    setTimeout(function () { }, 5000);

    privateBalance = await mantaSdk.privateBalance(asset_id);
    console.log("Private balance after second sync: ", privateBalance);

    console.log("END");
}

main()

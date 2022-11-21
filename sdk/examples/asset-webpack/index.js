// TODO: should use published npm package
// import * as sdk from '../../sdk/sdk';
import * as sdk from 'manta.js';

const to_private_address = "64nmibscb1UdWGMWnRQAYx6hS4TA2iyFqiS897cFRWvNTmjad85p6yD9ud7cyVPhyNPDrSMs2eZxTfovxZbJdFqH";

async function main() {
    const {api, signer } = await sdk.init_api("");

    const { wasm, wasmWallet } = await sdk.init_wasm_sdk(api, signer);

    await sdk.getPrivateAddress(wasm, wasmWallet);
    await sdk.init_sync(wasmWallet);

    await sdk.to_private_by_sign(api, signer, wasm, wasmWallet, 1, 100000000000000000000);
    // await sdk.private_transfer(api, signer, wasm, wasmWallet, 1, 1000000000000000000, to_private_address);

    await wasmWallet.sync();
    sdk.get_private_balance(wasm, wasmWallet, 1, "Sync1 after transfer");
  
    setTimeout(function () { }, 1000);
    await wasmWallet.sync();
    sdk.get_private_balance(wasm, wasmWallet, 1, "Sync2 After transfer");
  
    console.log("END");
}

// TRYING USING RETURN FUNCTION TO GET RID OF PASSING PARAMETERS
// import * as sdk_interface from '../../sdk/sdk.interfaces';
// async function main2() {
//     const { sdks } = await sdk.init_chain("");
//     await sdks.private_address();
//     console.log("END");
// }

main()

import * as sdk from '../../sdk/sdk';

// import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';

const to_private_address = "64nmibscb1UdWGMWnRQAYx6hS4TA2iyFqiS897cFRWvNTmjad85p6yD9ud7cyVPhyNPDrSMs2eZxTfovxZbJdFqH";

async function main() {
    console.log("ts example");

    const api = await sdk.init_api("");

    const { web3Enable,web3Accounts, web3FromSource } = await import("@polkadot/extension-dapp");
    const extensions = await web3Enable('Polkadot App');
    if (extensions.length === 0) {
        return;
    }
    const allAccounts = await web3Accounts();
    const account = allAccounts[0];
    const injector = await web3FromSource(account.meta.source);
    const signer = account.address;
    console.log("address:" + account.address);
    api.setSigner(injector.signer)

    // const { wasm, wasmWallet } = await sdk.init_wasm_sdk(api, signer);

    // await sdk.getPrivateAddress(wasm, wasmWallet);
    // await sdk.init_sync(wasmWallet);

    // await sdk.to_private2(api, signer, wasm, wasmWallet, 1, 100000000000000000000);
    // // await sdk.private_transfer(api, signer, wasm, wasmWallet, 1, 1000000000000000000, to_private_address);

    // await wasmWallet.sync();
    // sdk.print_private_balance(wasm, wasmWallet, 1, "Sync1 after transfer");
  
    // setTimeout(function () { }, 1000);
    // await wasmWallet.sync();
    // sdk.print_private_balance(wasm, wasmWallet, 1, "Sync2 After transfer");
  
    // console.log("END");
}

main()

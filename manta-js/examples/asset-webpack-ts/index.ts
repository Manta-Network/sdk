// @ts-ignore
import {
  MantaPrivateWallet,
  Environment,
  Network,
  MantaUtilities,
} from "manta-extension-sdk";
import BN from "bn.js";
import {
  web3Accounts,
  web3Enable,
  web3FromSource,
} from "@polkadot/extension-dapp";
import type { Signer as InjectSigner } from "@polkadot/api/types";
import { get as getIdbData, set as setIdbData } from "idb-keyval";
interface PolkadotConfig {
  polkadotSigner: InjectSigner;
  polkadotAddress: string;
}

let privateWallet: MantaPrivateWallet = null;
let polkadotConfig: PolkadotConfig = null;
const assetId = new BN("1");
const assetAmount = new BN("5000000000000");

function _log(...message: any[]) {
  console.log("[INFO]: " + message.join(""));
  console.log(performance.now());
}

// Get Polkadot JS Signer and Polkadot JS account address.
const getPolkadotSignerAndAddress = async () => {
  const extensions = await web3Enable("Polkadot App");
  if (extensions.length === 0) {
    throw new Error(
      "Polkadot browser extension missing. https://polkadot.js.org/extension/"
    );
  }
  const allAccounts = await web3Accounts();
  let account = allAccounts[0];

  const injector = await web3FromSource(account.meta.source);
  const polkadotSigner = injector.signer;
  const polkadotAddress = account.address;
  return {
    polkadotSigner,
    polkadotAddress,
  };
};

const initWallet = async () => {
  const privateWalletConfig = {
    environment: Environment.Development,
    network: Network.Dolphin,
    loggingEnabled: true,
    provingFilePath:
      "https://media.githubusercontent.com/media/Manta-Network/manta-rs/main/manta-parameters/data/pay/proving",
    parametersFilePath:
      "https://raw.githubusercontent.com/Manta-Network/manta-rs/main/manta-parameters/data/pay/parameters",
    requestUserSeedPhrase: async () => {
      return "spike napkin obscure diamond slice style excess table process story excuse absurd";
    },
    saveStorageStateToLocal: async (
      network: string,
      data: any
    ): Promise<boolean> => {
      try {
        await setIdbData(`storage_state_${network}`, data);
      } catch (ex) {
        console.error(ex);
        return false;
      }
      return true;
    },
    getStorageStateFromLocal: async (network: string): Promise<any> => {
      let result: string;
      try {
        result = await getIdbData(`storage_state_${network}`);
      } catch (ex) {
        console.error(ex);
      }
      return result || null;
    },
  };
  privateWallet = await MantaPrivateWallet.init(privateWalletConfig);

  // just for test
  // @ts-ignore
  window.privateWallet = privateWallet;

  polkadotConfig = await getPolkadotSignerAndAddress();

  _log("Load user mnemonic");
  await privateWallet.loadUserSeedPhrase();
  const privateAddress = await privateWallet.getZkAddress();
  _log("The zkAddress is: ", privateAddress);

  await privateWallet.initialNewAccountWalletSync();
  // await privateWallet.initialWalletSync();
};

const queryTransferResult = async (initialPrivateBalance: BN) => {
  let retryTimes = 0;
  while (true) {
    await new Promise((r) => setTimeout(r, 5000));
    _log("Syncing with ledger...");
    await privateWallet.walletSync();
    let newPrivateBalance = await privateWallet.getZkBalance(assetId);
    _log("Private Balance after sync: ", newPrivateBalance.toString());

    if (!initialPrivateBalance.eq(newPrivateBalance)) {
      _log("Detected balance change after sync!");
      _log("Try number: ", retryTimes.toString());
      _log("Old balance: ", initialPrivateBalance.toString());
      _log("New balance: ", newPrivateBalance.toString());
      break;
    }
    retryTimes += 1;
    if (retryTimes >= 10) {
      _log("Check balance timeout");
      break;
    }
  }
};

/// Test to publicly transfer 10 DOL.
const publicTransferTest = async () => {
  const destinationAddress = "5FHT5Rt1oeqAytX5KSn4ZZQdqN8oEa5Y81LZ5jadpk41bdoM";

  const senderBalance = await MantaUtilities.getPublicBalance(
    privateWallet.api,
    assetId,
    polkadotConfig.polkadotAddress
  );
  _log("Sender Balance:" + JSON.stringify(senderBalance.toString()));

  const destinationBalance = await MantaUtilities.getPublicBalance(
    privateWallet.api,
    assetId,
    destinationAddress
  );
  _log("Destination Balance:" + JSON.stringify(destinationBalance.toString()));

  await MantaUtilities.publicTransfer(
    privateWallet.api,
    assetId,
    assetAmount,
    destinationAddress,
    polkadotConfig.polkadotAddress,
    polkadotConfig.polkadotSigner
  );

  await new Promise((r) => setTimeout(r, 10000));

  const senderBalanceAfterTransfer = await MantaUtilities.getPublicBalance(
    privateWallet.api,
    assetId,
    polkadotConfig.polkadotAddress
  );
  _log(
    "Sender Balance After:" +
      JSON.stringify(senderBalanceAfterTransfer.toString())
  );

  const destinationBalanceAfterTransfer = await MantaUtilities.getPublicBalance(
    privateWallet.api,
    assetId,
    destinationAddress
  );
  _log(
    "Dest Balance After:" +
      JSON.stringify(destinationBalanceAfterTransfer.toString())
  );
};

/// Test to sign a transaction that converts 10 DOL to pDOL,
/// without publishing the transaction.
const toPrivateOnlySignTest = async () => {
  await privateWallet.walletSync();
  const initialPrivateBalance = await privateWallet.getZkBalance(assetId);
  _log("The initial balance is: ", initialPrivateBalance.toString());
  const signResult = await privateWallet.toPrivateBuild(
    assetId,
    assetAmount,
    polkadotConfig.polkadotAddress
  );
  _log("The result of the signing: ", signResult);
  _log("Full: ", JSON.stringify(signResult.txs));
  // remove first 3 bytes of the signResult
  _log(
    'For xcm remote transact payload, please use: ["0x' +
      JSON.stringify(signResult.txs).slice(10)
  );
};

/// Test to privately transfer 10 pDOL.
const privateTransferTest = async () => {
  const toPrivateTestAddress = "2JZCtGNR1iz6dR613g9p2VGHAAmXQK8xYJ117DLzs4s4";
  await privateWallet.walletSync();
  const initialPrivateBalance = await privateWallet.getZkBalance(assetId);
  _log("The initial balance is: ", initialPrivateBalance.toString());
  await privateWallet.privateTransferSend(
    assetId,
    assetAmount,
    toPrivateTestAddress,
    polkadotConfig.polkadotSigner,
    polkadotConfig.polkadotAddress
  );
  await queryTransferResult(initialPrivateBalance);
};

/// Test to execute a `ToPrivate` transaction.
/// Convert 10 DOL to 10 pDOL.
const toPrivateTest = async () => {
  await privateWallet.walletSync();
  const initialPrivateBalance = await privateWallet.getZkBalance(assetId);
  _log("The initial balance is: ", initialPrivateBalance.toString());
  await privateWallet.toPrivateSend(
    assetId,
    assetAmount,
    polkadotConfig.polkadotSigner,
    polkadotConfig.polkadotAddress
  );
  await queryTransferResult(initialPrivateBalance);
};

/// Test to execute a `ToPublic` transaction.
/// Convert 10 pDOL to 10 DOL.
const toPublicTest = async () => {
  await privateWallet.walletSync();
  const initialPrivateBalance = await privateWallet.getZkBalance(assetId);
  _log("The initial balance is: ", initialPrivateBalance.toString());

  await privateWallet.toPublicSend(
    assetId,
    assetAmount,
    polkadotConfig.polkadotSigner,
    polkadotConfig.polkadotAddress
  );
  await queryTransferResult(initialPrivateBalance);
};

// @ts-ignore
window.actions = {
  toPrivateTest,
  toPublicTest,
  privateTransferTest,
  publicTransferTest,
  toPrivateOnlySignTest,
};

async function main() {
  _log("Initial");
  await initWallet();
  _log("Initial end");
}

main();

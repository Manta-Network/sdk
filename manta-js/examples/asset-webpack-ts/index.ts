import BN from 'bn.js';
import { BaseWallet, MantaPrivateWallet, Network } from 'manta-extension-sdk';
import {
  web3Accounts,
  web3Enable,
  web3FromSource,
} from '@polkadot/extension-dapp';
import {
  get as getIdbData,
  set as setIdbData,
  del as delIdbData,
} from 'idb-keyval';
import type { Signer as InjectSigner } from '@polkadot/api/types';
import type { PalletName } from 'manta-extension-sdk/dist/browser/sdk.interfaces';
import type { SubmittableExtrinsic } from '@polkadot/api/types';

interface PolkadotConfig {
  polkadotSigner: InjectSigner;
  polkadotAddress: string;
}

const currentNetwork = Network.Dolphin;
const rpcUrl = 'wss://kwaltz.baikal.testnet.dolphin.training';
let currentSeedPhrase =
  'spike napkin obscure diamond slice style excess table process story excuse absurd';

let baseWallet: BaseWallet = null;
let polkadotConfig: PolkadotConfig = null;
const assetId = new BN('1');
const assetAmount = new BN('50000000000000000000');

function _log(...message: any[]) {
  console.log(`[Demo] ${performance.now()}: ${message.join('')}`);
}

// Get Polkadot JS Signer and Polkadot JS account address.
const getPolkadotSignerAndAddress = async () => {
  const extensions = await web3Enable('Polkadot App');
  if (extensions.length === 0) {
    throw new Error(
      'Polkadot browser extension missing. https://polkadot.js.org/extension/',
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

const publishTransition = async (
  txs: SubmittableExtrinsic<'promise', any>[],
) => {
  for (let i = 0; i < txs.length; i++) {
    await txs[i].signAndSend(polkadotConfig.polkadotAddress, () => {});
  }
};

const initBaseLogics = async () => {
  baseWallet = await BaseWallet.init({
    rpcUrl,
    loggingEnabled: true,
    provingFilePath:
      'https://media.githubusercontent.com/media/Manta-Network/manta-rs/main/manta-parameters/data/pay/proving',
    parametersFilePath:
      'https://raw.githubusercontent.com/Manta-Network/manta-rs/main/manta-parameters/data/pay/parameters',
    saveStorageStateToLocal: async (
      palletName: PalletName,
      network: string,
      data: any,
    ): Promise<boolean> => {
      try {
        await setIdbData(`storage_state_${palletName}_${network}`, data);
      } catch (ex) {
        console.error(ex);
        return false;
      }
      return true;
    },
    getStorageStateFromLocal: async (
      palletName: PalletName,
      network: string,
    ): Promise<any> => {
      let result: string;
      try {
        result = await getIdbData(`storage_state_${palletName}_${network}`);
      } catch (ex) {
        console.error(ex);
      }
      return result || null;
    },
  });
  polkadotConfig = await getPolkadotSignerAndAddress();
  baseWallet.api.setSigner(polkadotConfig.polkadotSigner);
};

const initWallet = async (palletName: PalletName, baseWallet: BaseWallet) => {
  const privateWallet = MantaPrivateWallet.init(palletName, currentNetwork, baseWallet);
  initWalletData(privateWallet);
  return privateWallet;
};

const initWalletData = async (privateWallet: MantaPrivateWallet) => {
  // const isInitialed = (await getIdbData(`storage_state_${privateWallet.palletName}_${currentNetwork}`));
  _log('Load user mnemonic');
  await privateWallet.loadUserSeedPhrase(currentSeedPhrase);
  const privateAddress = await privateWallet.getZkAddress();
  _log('The zkAddress is: ', privateAddress);

  await privateWallet.initialSigner();
  _log('initialWalletSync');
  await privateWallet.initialWalletSync();

  // if (isInitialed) {
  //   _log('initialWalletSync');
  //   await privateWallet.initialWalletSync();
  // } else {
  //   _log('initialNewAccountWalletSync');
  //   await privateWallet.initialNewAccountWalletSync();
  // }
};

const queryTransferResult = async (
  privateWallet: MantaPrivateWallet,
  initialPrivateBalance: BN,
) => {
  let retryTimes = 0;
  while (true) {
    await new Promise((r) => setTimeout(r, 5000));
    _log('Syncing with ledger...');
    await privateWallet.walletSync();
    let newPrivateBalance = await privateWallet.getZkBalance(assetId);
    _log('Private Balance after sync: ', newPrivateBalance.toString());

    if (!initialPrivateBalance.eq(newPrivateBalance)) {
      _log('Detected balance change after sync!');
      _log('Try number: ', retryTimes.toString());
      _log('Old balance: ', initialPrivateBalance.toString());
      _log('New balance: ', newPrivateBalance.toString());
      break;
    }
    retryTimes += 1;
    if (retryTimes >= 10) {
      _log('Check balance timeout');
      break;
    }
  }
};

/// Test to sign a transaction that converts 10 DOL to pDOL,
/// without publishing the transaction.
const toPrivateOnlySignTest = async (privateWallet: MantaPrivateWallet) => {
  await privateWallet.walletSync();
  const initialPrivateBalance = await privateWallet.getZkBalance(assetId);
  _log('The initial balance is: ', initialPrivateBalance.toString());
  const signResult = await privateWallet.toPrivateBuild(assetId, assetAmount);
  _log('The result of the signing: ', signResult);
  _log('Full: ', JSON.stringify(signResult.txs));
  // remove first 3 bytes of the signResult
  _log(
    'For xcm remote transact payload, please use: ["0x' +
      JSON.stringify(signResult.txs).slice(10),
  );
};

/// Test to privately transfer 10 pDOL.
const privateTransferTest = async (privateWallet: MantaPrivateWallet) => {
  const toPrivateTestAddress = '2JZCtGNR1iz6dR613g9p2VGHAAmXQK8xYJ117DLzs4s4';
  await privateWallet.walletSync();
  const initialPrivateBalance = await privateWallet.getZkBalance(assetId);
  _log('The initial balance is: ', initialPrivateBalance.toString());
  const transaction = await privateWallet.privateTransferBuild(
    assetId,
    assetAmount,
    toPrivateTestAddress,
  );
  await publishTransition(transaction.txs);
  await queryTransferResult(privateWallet, initialPrivateBalance);
};

/// Test to execute a `ToPrivate` transaction.
/// Convert 10 DOL to 10 pDOL.
const toPrivateTest = async (privateWallet: MantaPrivateWallet) => {
  await privateWallet.walletSync();
  const initialPrivateBalance = await privateWallet.getZkBalance(assetId);
  _log('The initial balance is: ', initialPrivateBalance.toString());
  const transaction = await privateWallet.toPrivateBuild(assetId, assetAmount);
  await publishTransition(transaction.txs);
  await queryTransferResult(privateWallet, initialPrivateBalance);
};

/// Test to execute a `ToPublic` transaction.
/// Convert 10 pDOL to 10 DOL.
const toPublicTest = async (privateWallet: MantaPrivateWallet) => {
  await privateWallet.walletSync();
  const initialPrivateBalance = await privateWallet.getZkBalance(assetId);
  _log('The initial balance is: ', initialPrivateBalance.toString());

  const transaction = await privateWallet.toPublicBuild(
    assetId,
    assetAmount,
    polkadotConfig.polkadotAddress,
  );
  await publishTransition(transaction.txs);
  await queryTransferResult(privateWallet, initialPrivateBalance);
};

// TODO: fix the memory is too high when regenerating the instance
const relaunch = async (privateWallet: MantaPrivateWallet) => {
  await privateWallet.resetState();
  await delIdbData(
    `storage_state_${privateWallet.palletName}_${currentNetwork}`,
  );
  currentSeedPhrase =
    'must payment asthma judge tray recall another course zebra morning march engine';
  await initWalletData(privateWallet);
};

// @ts-ignore
window.actions = {
  toPrivateTest,
  toPublicTest,
  privateTransferTest,
  toPrivateOnlySignTest,
  relaunch,
};

async function main() {
  _log('Initial');
  await initBaseLogics();
  const mantaPayWallet = await initWallet('mantaPay', baseWallet);
  _log('Initial end');
  // @ts-ignore
  window.mantaPayWallet = mantaPayWallet;
}

main();

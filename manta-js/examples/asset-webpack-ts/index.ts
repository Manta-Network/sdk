import BN from 'bn.js';
import type { interfaces } from 'manta-extension-sdk';
import type { Signer as InjectSigner } from '@polkadot/api/types';
import type { SubmittableExtrinsic } from '@polkadot/api/types';

import {
  BaseWallet,
  MantaPayWallet,
  MantaSbtWallet,
} from 'manta-extension-sdk';

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

interface PolkadotConfig {
  polkadotSigner: InjectSigner;
  polkadotAddress: string;
}
// const apiEndpoint = 'wss://kwaltz.baikal.testnet.dolphin.training';
// const nativeTokenDecimals = 18;

const loggingEnabled = true;
const apiEndpoint = 'wss://zenlink.zqhxuyuan.cloud:444';
const nativeTokenDecimals = 12;
const provingFilePath =
  'https://media.githubusercontent.com/media/Manta-Network/manta-rs/main/manta-parameters/data/pay/proving';
const parametersFilePath =
  'https://raw.githubusercontent.com/Manta-Network/manta-rs/main/manta-parameters/data/pay/parameters';

const currentNetwork = 'Dolphin';
let currentSeedPhrase =
  'spike napkin obscure diamond slice style excess table process story excuse absurd';

let polkadotConfig: PolkadotConfig = null;

const assetId = new BN('1');
// toPrivate Amount (50 DOL)
const transferInAmount = new BN(50).mul(
  new BN(10).pow(new BN(nativeTokenDecimals)),
);
// privateTransfer && toPublic Amount (5 DOL)
const transferOutAmount = transferInAmount.div(new BN(10));

function _log(...message: any[]) {
  console.log(`[Demo] ${performance.now().toFixed(4)}: ${message.join(' ')}`);
}

// Get Polkadot JS Signer and Polkadot JS account address.
const requestPolkadotSignerAndAddress = async () => {
  const extensions = await web3Enable('Manta SDK');
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

const getBaseWallet = async () => {
  const baseWallet = await BaseWallet.init({
    apiEndpoint,
    loggingEnabled,
    provingFilePath,
    parametersFilePath,
    saveStorageStateToLocal: async (
      palletName: interfaces.PalletName,
      network: interfaces.Network,
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
      palletName: interfaces.PalletName,
      network: interfaces.Network,
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
  return baseWallet;
};

const initMantaPayWallet = async (baseWallet: BaseWallet) => {
  const wallet = MantaPayWallet.init(currentNetwork, baseWallet);
  await initWalletData(wallet);
  return wallet;
};

const initMantaSbtWallet = async (baseWallet: BaseWallet) => {
  const wallet = MantaSbtWallet.init(currentNetwork, baseWallet);
  await initWalletData(wallet);
  return wallet;
};

const initWalletData = async (privateWallet: interfaces.IPrivateWallet) => {

  _log('Initial signer');
  await privateWallet.initialSigner();
  _log('Load user mnemonic');
  await privateWallet.loadUserSeedPhrase(currentSeedPhrase);
  const privateAddress = await privateWallet.getZkAddress();
  _log('The zkAddress is: ', privateAddress);

  _log('Wait for api ready');
  
  try {
    if (!privateWallet.baseWallet.api.isConnected) {
      await privateWallet.baseWallet.api.connect();
      if (!privateWallet.baseWallet.api.isConnected) {
        throw new Error('Network error');
      }
    }
  } catch (ex) {
    _log('Api error', ex.message);
    return;
  }

  // const isInitialed = (await getIdbData(`storage_state_${privateWallet.palletName}_${currentNetwork}`));

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
  privateWallet: interfaces.IPrivateWallet,
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
      _log('Retry times: ', retryTimes.toString());
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

/// Test to execute a `PrivateBuild` transaction.
/// without publishing the transaction.
const toPrivateOnlySignTest = async (privateWallet: MantaPayWallet) => {
  await privateWallet.walletSync();
  const initialPrivateBalance = await privateWallet.getZkBalance(assetId);
  _log('The initial balance is: ', initialPrivateBalance.toString());
  const signResult = await privateWallet.toPrivateBuild(
    assetId,
    transferInAmount,
  );
  _log('The result of the signing: ', signResult);
  _log('Full: ', JSON.stringify(signResult.txs));
  // remove first 3 bytes of the signResult
  _log(
    'For xcm remote transact payload, please use: ["0x' +
      JSON.stringify(signResult.txs).slice(10),
  );
};

/// Test to execute a `ToPrivate` transaction.
const toPrivateTest = async (privateWallet: MantaPayWallet) => {
  await privateWallet.walletSync();
  const initialPrivateBalance = await privateWallet.getZkBalance(assetId);
  _log('The initial balance is: ', initialPrivateBalance.toString());
  const transaction = await privateWallet.toPrivateBuild(
    assetId,
    transferInAmount,
  );
  await publishTransition(transaction.txs);
  await queryTransferResult(privateWallet, initialPrivateBalance);
};

/// Test to execute a `PrivateTransfer` transaction.
const privateTransferTest = async (privateWallet: MantaPayWallet) => {
  const toPrivateTestAddress = '2JZCtGNR1iz6dR613g9p2VGHAAmXQK8xYJ117DLzs4s4';
  await privateWallet.walletSync();
  const initialPrivateBalance = await privateWallet.getZkBalance(assetId);
  _log('The initial balance is: ', initialPrivateBalance.toString());
  const transaction = await privateWallet.privateTransferBuild(
    assetId,
    transferOutAmount,
    toPrivateTestAddress,
  );
  await publishTransition(transaction.txs);
  await queryTransferResult(privateWallet, initialPrivateBalance);
};

/// Test to execute a `ToPublic` transaction.
const toPublicTest = async (privateWallet: MantaPayWallet) => {
  await privateWallet.walletSync();
  const initialPrivateBalance = await privateWallet.getZkBalance(assetId);
  _log('The initial balance is: ', initialPrivateBalance.toString());

  const transaction = await privateWallet.toPublicBuild(
    assetId,
    transferOutAmount,
    polkadotConfig.polkadotAddress,
  );
  await publishTransition(transaction.txs);
  await queryTransferResult(privateWallet, initialPrivateBalance);
};

/// Test to execute a `MultiSbtBuild` transaction.
const multiSbtBuildOnlySignTest = async (
  privateWallet: MantaSbtWallet,
  sbtInfoList: interfaces.SbtInfo[],
) => {
  await privateWallet.walletSync();
  const transaction = await privateWallet.multiSbtBuild(sbtInfoList);
  console.log(transaction);
  _log(`Hex batchedTx: ${transaction.batchedTx.toHex()}`);
};

const relaunch = async (privateWallet: interfaces.IPrivateWallet) => {
  await privateWallet.resetState();
  await delIdbData(
    `storage_state_${privateWallet.palletName}_${currentNetwork}`,
  );
  currentSeedPhrase =
    'must payment asthma judge tray recall another course zebra morning march engine';
  await initWalletData(privateWallet);
};

const pallets: Record<string, interfaces.IPrivateWallet> = {
  mantaPay: null,
  mantaSbt: null,
};

// @ts-ignore
window.actions = {
  getPallets() {
    return pallets;
  },
  async toPrivateTest() {
    await toPrivateTest(pallets.mantaPay as MantaPayWallet);
  },
  async toPublicTest() {
    await toPublicTest(pallets.mantaPay as MantaPayWallet);
  },
  async privateTransferTest() {
    await privateTransferTest(pallets.mantaPay as MantaPayWallet);
  },
  async toPrivateOnlySignTest() {
    await toPrivateOnlySignTest(pallets.mantaPay as MantaPayWallet);
  },
  async multiSbtBuildOnlySignTest(startAssetId: string) {
    if (!startAssetId) {
      throw new Error('startAssetId is required');
    }
    const sbtInfoList: interfaces.SbtInfo[] = [
      {
        assetId: new BN(startAssetId),
        metadata: 'test1',
      },
      {
        assetId: new BN(startAssetId).add(new BN(1)),
        metadata: 'test2',
      },
    ];
    await multiSbtBuildOnlySignTest(
      pallets.mantaSbt as MantaSbtWallet,
      sbtInfoList,
    );
  },
  async relaunch() {
    await relaunch(pallets.mantaPay);
    await relaunch(pallets.mantaSbt);
  },
};

async function main() {
  _log('Initial base');
  const baseWallet = await getBaseWallet();
  _log('Initial base end');

  _log('Initial polkadot signer');
  polkadotConfig = await requestPolkadotSignerAndAddress();
  baseWallet.api.setSigner(polkadotConfig.polkadotSigner);
  _log('Initial polkadot signer end');

  _log('Initial pallet mantaPay');
  pallets.mantaPay = await initMantaPayWallet(baseWallet);
  _log('Initial pallet mantaPay end');

  _log('Initial pallet mantaSBT');
  pallets.mantaSbt = await initMantaSbtWallet(baseWallet);
  _log('Initial pallet mantaSBT end');

  _log('Initial successful');
}

main();

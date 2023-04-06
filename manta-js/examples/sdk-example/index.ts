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

const apiEndpoint = 'wss://zenlink.zqhxuyuan.cloud:444';
const nativeTokenDecimals = 12;

const currentNetwork: interfaces.Network = 'Dolphin';

const assetId = new BN('1');
// toPrivate Amount (50 DOL)
const transferInAmount = new BN(50).mul(
  new BN(10).pow(new BN(nativeTokenDecimals)),
);
// privateTransfer && toPublic Amount (5 DOL)
const transferOutAmount = transferInAmount.div(new BN(10));

let currentSeedPhrase =
  'spike napkin obscure diamond slice style excess table process story excuse absurd';

// If you need to test a new account without any Ledger data, please update it to true
const newAccountFeatureEnabled = true;

const loggingEnabled = true;

const provingFilePath =
  'https://media.githubusercontent.com/media/Manta-Network/manta-rs/main/manta-parameters/data/pay/proving';
const parametersFilePath =
  'https://raw.githubusercontent.com/Manta-Network/manta-rs/main/manta-parameters/data/pay/parameters';

interface PolkadotConfig {
  polkadotSigner: InjectSigner;
  polkadotAddress: string;
}

let polkadotConfig: PolkadotConfig = null;

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
  BaseWallet.onWasmCalledJsErrorCallback = (err, palletName) => {
    console.log(palletName);
    console.error(err);
  };
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
  const zkAddress = await privateWallet.getZkAddress();
  _log('The zkAddress is: ', zkAddress);

  _log('Wait for api ready');

  const isInitialed = (await getIdbData(`storage_state_${privateWallet.palletName}_${currentNetwork}`));
  if (!isInitialed && newAccountFeatureEnabled) {
    _log('initialNewAccountWalletSync');
    await privateWallet.initialNewAccountWalletSync();
  } else {
    _log('initialWalletSync');
    await privateWallet.initialWalletSync();
  }
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
const multiSbtPostBuildOnlySignTest = async (
  privateWallet: MantaSbtWallet,
  sbtInfoList: interfaces.SbtInfo[],
) => {
  await privateWallet.walletSync();
  const result = await privateWallet.multiSbtPostBuild(sbtInfoList);
  console.log(result);
};

const getIdentityProof = async (privateWallet: MantaSbtWallet) => {
  const proof = await privateWallet.getIdentityProof(
    '{"identifier":{"is_transparent":false,"utxo_commitment_randomness":[218,12,198,205,243,45,111,55,97,232,107,40,237,202,174,102,12,100,161,170,141,2,173,101,117,161,177,116,146,37,81,31]},"asset":{"id":[82,77,144,171,218,215,31,37,190,239,170,153,12,42,235,151,22,238,79,66,34,183,22,37,117,55,167,12,74,225,51,45],"value":1}}',
    polkadotConfig.polkadotAddress,
  );
  _log(`getIdentityProof result: `);
  console.log(proof);
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
  async multiSbtPostBuildOnlySignTest(startAssetId: string) {
    if (!startAssetId) {
      throw new Error('startAssetId is required');
    }
    const sbtInfoList: interfaces.SbtInfo[] = [
      { assetId: new BN(startAssetId) },
      { assetId: new BN(startAssetId).add(new BN(1)) },
    ];
    await multiSbtPostBuildOnlySignTest(
      pallets.mantaSbt as MantaSbtWallet,
      sbtInfoList,
    );
  },
  async getIdentityProof() {
    await getIdentityProof(pallets.mantaSbt as MantaSbtWallet);
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

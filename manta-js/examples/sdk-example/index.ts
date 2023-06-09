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

const apiEndpoint = ['http://127.0.0.1:9933'];
// 'wss://c1.calamari.seabird.systems';
const nativeTokenDecimals = 12;

const currentNetwork: interfaces.Network = 'Calamari';

const assetId = new BN('1');
// toPrivate Amount (50 KMA)
const transferInAmount = new BN(50).mul(
  new BN(10).pow(new BN(nativeTokenDecimals)),
);
// privateTransfer && toPublic Amount (5 KMA)
const transferOutAmount = transferInAmount.div(new BN(10));

let currentSeedPhrase =
  'spike napkin obscure diamond slice style excess table process story excuse absurd';

// If you need to test a new account without any Ledger data, please update it to true
const newAccountFeatureEnabled = false;

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

const publishTransaction = async (
  txs: SubmittableExtrinsic<'promise', any>[],
) => {
  for (let i = 0; i < txs.length; i++) {
    await txs[i].signAndSend(
      polkadotConfig.polkadotAddress,
      { nonce: -1 },
      () => {},
    );
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

const initWalletData = async (
  privateWallet: interfaces.IPrivateWallet,
  initialData = true,
) => {
  _log('Initial signer');
  await privateWallet.initialSigner();
  _log('Load user mnemonic');
  await privateWallet.loadUserSeedPhrase(currentSeedPhrase);
  const zkAddress = await privateWallet.getZkAddress();
  _log('The zkAddress is: ', zkAddress);

  if (!initialData) {
    return;
  }

  const isInitialed = await getIdbData(
    `storage_state_${privateWallet.palletName}_${currentNetwork}`,
  );
  if (
    newAccountFeatureEnabled &&
    !isInitialed &&
    privateWallet instanceof MantaPayWallet
  ) {
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
const toPrivateBuild = async (privateWallet: MantaPayWallet) => {
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
const toPrivateSend = async (privateWallet: MantaPayWallet) => {
  await privateWallet.walletSync();
  const initialPrivateBalance = await privateWallet.getZkBalance(assetId);
  _log('The initial balance is: ', initialPrivateBalance.toString());
  const transaction = await privateWallet.toPrivateBuild(
    assetId,
    transferInAmount,
  );
  await publishTransaction(transaction.txs);
  await queryTransferResult(privateWallet, initialPrivateBalance);
};

/// Test to execute a `PrivateTransfer` transaction.
const privateTransferSend = async (privateWallet: MantaPayWallet) => {
  const toPrivateTestAddress = '2JZCtGNR1iz6dR613g9p2VGHAAmXQK8xYJ117DLzs4s4';
  await privateWallet.walletSync();
  const initialPrivateBalance = await privateWallet.getZkBalance(assetId);
  _log('The initial balance is: ', initialPrivateBalance.toString());
  const transaction = await privateWallet.privateTransferBuild(
    assetId,
    transferOutAmount,
    toPrivateTestAddress,
  );
  await publishTransaction(transaction.txs);
  await queryTransferResult(privateWallet, initialPrivateBalance);
};

/// Test to execute a `ToPublic` transaction.
const toPublicSend = async (privateWallet: MantaPayWallet) => {
  await privateWallet.walletSync();
  const initialPrivateBalance = await privateWallet.getZkBalance(assetId);
  _log('The initial balance is: ', initialPrivateBalance.toString());

  const transaction = await privateWallet.toPublicBuild(
    assetId,
    transferOutAmount,
    polkadotConfig.polkadotAddress,
  );
  await publishTransaction(transaction.txs);
  await queryTransferResult(privateWallet, initialPrivateBalance);
};

/// Test to execute a `MultiSbtPostBuild` transaction.
const multiSbtPostBuild = async (
  privateWallet: MantaSbtWallet,
  sbtInfoList: interfaces.SbtInfo[],
) => {
  const result = await privateWallet.multiSbtPostBuild(sbtInfoList);
  console.log(result);
  return result;
};

const reserveSbt = async (
  privateWallet: MantaSbtWallet
) => {
  const reserveTx = privateWallet.api.tx.mantaSbt.reserveSbt(null);
  await publishTransaction([reserveTx]);
};

const mintSbt = async (
  privateWallet: MantaSbtWallet
) => {
  const assetIdRange: any = await privateWallet.api.query.mantaSbt.reservedIds(polkadotConfig.polkadotAddress);
  const [startAssetId, endAssetId] = assetIdRange.unwrap();
  const sbtInfoList: interfaces.SbtInfo[] = [
      { assetId: new BN(startAssetId) },
      { assetId: new BN(startAssetId).add(new BN(1)) },
  ];

  const { transactionDatas, posts } = await multiSbtPostBuild(privateWallet, sbtInfoList);
  const batchesTx: any[] = [];
  posts.forEach((post) => {
    const tx = privateWallet.api.tx.mantaSbt.toPrivate(null, post[0], []);
    batchesTx.push(tx);
  });
  const sbtTx = privateWallet.api.tx.utility.batch(batchesTx);
  await publishTransaction([sbtTx]);
};

const mintSbtWithSignature = async (
  privateWallet: MantaSbtWallet,
) => {
  const assetIdRange: any = await privateWallet.api.query.mantaSbt.reservedIds(polkadotConfig.polkadotAddress);
  const [startAssetId, endAssetId] = assetIdRange.unwrap();
  const sbtInfoList: interfaces.SbtInfo[] = [
      { assetId: new BN(startAssetId) },
  ];

  const { transactionDatas, posts } = await multiSbtPostBuild(privateWallet, sbtInfoList);
  const batchesTx: any[] = [];

  // generate signature


  posts.forEach((post) => {
    const tx = privateWallet.api.tx.mantaSbt.toPrivate(null, post[0], []);
    batchesTx.push(tx);
  });
  const sbtTx = privateWallet.api.tx.utility.batch(batchesTx);
  await publishTransaction([sbtTx]);
};

const getTransactionDatas = async (
  privateWallet: MantaSbtWallet,
  posts: any[],
) => {
  const result = await privateWallet.getTransactionDatas(posts);
  console.log(result);
  return result;
};

const getIdentityProof = async (privateWallet: MantaSbtWallet) => {
  const proof = await privateWallet.getIdentityProof(
    '{"identifier":{"is_transparent":false,"utxo_commitment_randomness":[218,12,198,205,243,45,111,55,97,232,107,40,237,202,174,102,12,100,161,170,141,2,173,101,117,161,177,116,146,37,81,31]},"asset":{"id":[82,77,144,171,218,215,31,37,190,239,170,153,12,42,235,151,22,238,79,66,34,183,22,37,117,55,167,12,74,225,51,45],"value":1}}',
    polkadotConfig.polkadotAddress,
  );
  _log(`getIdentityProof result: `);
  console.log(proof);
};

const resetData = async (privateWallet: interfaces.IPrivateWallet) => {
  await privateWallet.resetState();
  await delIdbData(
    `storage_state_${privateWallet.palletName}_${currentNetwork}`,
  );
};

const relaunch = async (privateWallet: interfaces.IPrivateWallet) => {
  await resetData(privateWallet);
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
  async clearData() {
    await resetData(pallets.mantaPay);
    await resetData(pallets.mantaSbt);
    window.location.reload();
  },
  async getZkBalance(assetId: string) {
    return (await pallets.mantaPay.getZkBalance(new BN(assetId))).toString();
  },
  async toPrivateBuild() {
    await toPrivateBuild(pallets.mantaPay as MantaPayWallet);
  },
  async toPrivateSend() {
    await toPrivateSend(pallets.mantaPay as MantaPayWallet);
  },
  async toPublicSend() {
    await toPublicSend(pallets.mantaPay as MantaPayWallet);
  },
  async privateTransferSend() {
    await privateTransferSend(pallets.mantaPay as MantaPayWallet);
  },
  async multiSbtPostBuild(startAssetId: string) {
    if (!startAssetId) {
      throw new Error('startAssetId is required');
    }
    const sbtInfoList: interfaces.SbtInfo[] = [
      { assetId: new BN(startAssetId) },
      { assetId: new BN(startAssetId).add(new BN(1)) },
    ];
    return await multiSbtPostBuild(
      pallets.mantaSbt as MantaSbtWallet,
      sbtInfoList,
    );
  },
  async reserveSbt() {
    return await reserveSbt(pallets.mantaSbt as MantaSbtWallet);
  },
  async mintSbt() {
    return await mintSbt(pallets.mantaSbt as MantaSbtWallet);
  },
  async getTransactionDatas(posts: any[]) {
    return await getTransactionDatas(pallets.mantaSbt as MantaSbtWallet, posts);
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

  _log('Initial pallets');
  pallets.mantaPay = MantaPayWallet.init(currentNetwork, baseWallet);
  pallets.mantaSbt = MantaSbtWallet.init(currentNetwork, baseWallet);
  _log('Initial pallets end');

  _log('Initial mantaPay data');
  await initWalletData(pallets.mantaPay);
  _log('Initial mantaPay data end');

  // When the runtime supports sbt api, then enable sync sbt data

  _log('Initial mantaSbt data');
  await initWalletData(pallets.mantaSbt, false);
  _log('Initial mantaSbt data end');

  _log('Initial successful');
}

main();

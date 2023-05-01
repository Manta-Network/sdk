import { ApiPromise } from '@polkadot/api';
import BN from 'bn.js';
import BigNumber from 'bignumber.js';
import {
  BaseWallet,
  interfaces,
  type PrivateWallet,
} from 'manta-extension-sdk';
import {
  get as getIdbData,
  set as setIdbData,
  del as delIdbData,
} from 'idb-keyval';
import { PalletName } from 'manta-extension-sdk/dist/browser/interfaces';

export type StepResult = {
  done: number;
  value: any;
};

export const stepList = [
  {
    title: 'Create Account',
    content: 'Create a new account',
    action: 'createAccount',
    button: 'Create',
  },
  {
    title: 'Initial Wallet Data',
    action: 'initialWalletData',
    button: 'Initial Data',
  },
  {
    title: 'Transfer KMA',
    content: 'Transfer 100 KMA to the Public Address just created',
    action: 'updateBalance',
    button: 'Update Balance',
  },
  {
    title: 'ToPrivate Transaction',
    content: 'Deposit 20 KMA to zkAddress',
    action: 'toPrivate',
    button: 'Execute ToPrivate',
  },
  {
    title: 'Private Transfer Transaction',
    content: 'Transfer 20 zkKMA to another zkAddress',
    action: 'privateTransfer',
    button: 'Execute PrivateTransfer',
  },
  {
    title: 'ToPublic Transfer Transaction',
    content: 'Withdraw 10 zkKMA to your Public Address',
    action: 'toPublic',
    button: 'Execute ToPublic',
  },
  {
    title: 'Clear Storage',
    content: 'Clear the storageState of the local cache, then refresh the page',
    action: 'clearStorage',
    button: 'Clear & Refresh Page',
  },
  {
    title: 'Reinitialize wallet data',
    action: 'initialWalletData',
    button: 'Sync Data',
  },
];

export async function fetchZkBalance(
  assetId: BN,
  decimals: number,
  privateWallet: PrivateWallet,
) {
  const balance = await privateWallet.getZkBalance(assetId);
  if (!balance) {
    return null;
  }
  return new BigNumber(balance.toString())
    .div(new BigNumber(10).pow(new BigNumber(decimals)))
    .toFixed();
}

export async function fetchPublicBalance(
  decimals: number,
  api: any,
  publicAddress: string,
) {
  const accountInfo = await api.query.system.account(publicAddress);
  const result = accountInfo as { data?: { free?: any } };
  const balanceString = result?.data?.free?.toString();
  if (!balanceString) {
    return null;
  }
  return balanceString
    ? new BigNumber(balanceString)
        .div(new BigNumber(10).pow(new BigNumber(decimals)))
        .toFixed()
    : '0';
}

export async function getBaseWallet(apiEndpoint: string) {
  const baseWallet = await BaseWallet.init({
    apiEndpoint,
    loggingEnabled: true,
    provingFilePath:
      'https://media.githubusercontent.com/media/Manta-Network/manta-rs/main/manta-parameters/data/pay/proving',
    parametersFilePath:
      'https://raw.githubusercontent.com/Manta-Network/manta-rs/main/manta-parameters/data/pay/parameters',
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
      let result: any;
      try {
        result = await getIdbData(`storage_state_${palletName}_${network}`);
      } catch (ex) {
        console.error(ex);
      }
      return result || null;
    },
  });
  return baseWallet;
}

export async function clearStorage(palletName: PalletName, network: string) {
  await delIdbData(`storage_state_${palletName}_${network}`);
}
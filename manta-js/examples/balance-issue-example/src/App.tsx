import type { interfaces } from 'manta-extension-sdk';
import { BaseWallet, MantaPayWallet } from 'manta-extension-sdk';
import { ApiPromise } from '@polkadot/api';
import BN from 'bn.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  clearStorage,
  fetchPublicBalance,
  fetchZkBalance,
  getBaseWallet,
  stepList,
  type StepResult,
} from './utils';
import { get as getIdbData, set as setIdbData } from 'idb-keyval';
import { mnemonicGenerate } from '@polkadot/util-crypto';
import keyring from '@polkadot/ui-keyring';
import type { KeyringPair } from '@polkadot/keyring/types';
import { assert } from '@polkadot/util';

const assetId = new BN(1);
const decimals = 12;
const network: interfaces.Network = 'Calamari';
const apiEndpoint = 'https://calamari.systems/rpc';
let initial = false;

export default function App() {
  const [stepResultList, setStepResultList] = useState<StepResult[] | null>(
    null,
  );
  const [pair, setPair] = useState<KeyringPair | null>(null);
  const [baseWallet, setBaseWallet] = useState<BaseWallet | null>(null);
  const [privateWallet, setPrivateWallet] = useState<MantaPayWallet | null>(
    null,
  );
  const [publicAddress, setPublicAddress] = useState<string | null>(null);
  const [zkAddress, setZkAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [publicBalance, setPublicBalance] = useState<string | null>(null);
  const [operating, setOperating] = useState<boolean>(false);

  const updateBalance = useCallback(async () => {
    if (
      !privateWallet ||
      !baseWallet?.api ||
      !publicAddress ||
      !privateWallet.initialSyncIsFinished
    ) {
      return;
    }
    const [zkBalance, publicBalance] = await Promise.all([
      fetchZkBalance(assetId, decimals, privateWallet),
      fetchPublicBalance(decimals, baseWallet.api, publicAddress),
    ]);
    setBalance(zkBalance ?? '-');
    setPublicBalance(publicBalance ?? '-');
  }, [setBalance, setPublicBalance, privateWallet, publicAddress]);

  const nextStep = useCallback(
    (value?: any, index?: number) => {
      setStepResultList((prevResult) => {
        const newIndex = index ?? prevResult!.length;
        const newResult = [...prevResult!];
        newResult[newIndex] = {
          done: 1,
          value,
        };
        setIdbData('stepResult', newResult);
        return newResult;
      });
    },
    [setStepResultList],
  );

  const initialWallet = useCallback(
    async (mnemonic: string) => {
      const baseWallet = await getBaseWallet(apiEndpoint);
      const privateWallet = MantaPayWallet.init(network, baseWallet);
      await privateWallet.initialSigner();
      await privateWallet.loadUserSeedPhrase(mnemonic);
      const pair = keyring.createFromUri(mnemonic);
      const zkAddress = await privateWallet.getZkAddress();
      await baseWallet.isApiReady();
      setBaseWallet(baseWallet);
      setPrivateWallet(privateWallet);
      setPair(pair);
      setZkAddress(zkAddress);
      setPublicAddress(pair.address);
      return { privateWallet };
    },
    [setPair, setZkAddress, setPublicAddress],
  );

  const queryTransferResult = useCallback(
    async (
      privateWallet: interfaces.IPrivateWallet,
      initialPrivateBalance: BN,
    ) => {
      let retryTimes = 0;
      let result = false;
      while (true) {
        await new Promise((r) => setTimeout(r, 6000));
        await privateWallet.walletSync();
        let newPrivateBalance = await privateWallet.getZkBalance(assetId);

        if (!initialPrivateBalance.eq(newPrivateBalance)) {
          result = true;
          break;
        }
        retryTimes += 1;
        if (retryTimes >= 10) {
          throw new Error('Check balance timeout');
        }
      }
      return result;
    },
    [],
  );

  const toPrivateSend = useCallback(async (privateWallet: MantaPayWallet, pair: KeyringPair) => {
    await privateWallet.walletSync();
    const initialPrivateBalance = await privateWallet.getZkBalance(assetId);
    const transaction = await privateWallet.toPrivateBuild(
      assetId,
      new BN(20).mul(new BN(10).pow(new BN(decimals))),
    );
    assert(transaction && transaction.txs.length > 0, 'ToPrivate Failed');
    for (let i = 0; i < transaction.txs.length; i += 1) {
      await transaction.txs[i].signAndSend(pair!);
    }
    await queryTransferResult(privateWallet, initialPrivateBalance);
  }, []);

  const privateTransferSend = useCallback(async (privateWallet: MantaPayWallet, pair: KeyringPair) => {
    await privateWallet.walletSync();
    const toPrivateTestAddress = 'ByFduKK9RSaNT99wYraLGCQ61yXUWUw69qP786WdvKmf';
    const initialPrivateBalance = await privateWallet.getZkBalance(assetId);
    const transaction = await privateWallet.privateTransferBuild(
      assetId,
      new BN(2).mul(new BN(10).pow(new BN(decimals))),
      toPrivateTestAddress,
    );
    assert(transaction && transaction.txs.length > 0, 'PrivateTransfer Failed');
    for (let i = 0; i < transaction.txs.length; i += 1) {
      await transaction.txs[i].signAndSend(pair!);
    }
    await queryTransferResult(privateWallet, initialPrivateBalance);
  }, []);

  const toPublicSend = useCallback(async (privateWallet: MantaPayWallet, pair: KeyringPair, publicAddress: string) => {
    await privateWallet.walletSync();
    const initialPrivateBalance = await privateWallet.getZkBalance(assetId);
    const transaction = await privateWallet.toPublicBuild(
      assetId,
      new BN(1).mul(new BN(10).pow(new BN(decimals))),
      publicAddress,
    );
    assert(transaction && transaction.txs.length > 0, 'ToPublic Failed');
    for (let i = 0; i < transaction.txs.length; i += 1) {
      await transaction.txs[i].signAndSend(pair!);
    }
    await queryTransferResult(privateWallet, initialPrivateBalance);
  }, []);

  const executeStep = async (action: string, index: number) => {
    setOperating(true);
    try {
      if (action === 'createAccount') {
        const mnemonic = mnemonicGenerate();
        await initialWallet(mnemonic);
        nextStep({ mnemonic });
      } else if (action === 'initialWalletData') {
        const result = await privateWallet?.initialWalletSync();
        if (result) {
          nextStep();
        }
      } else if (action === 'updateBalance') {
        const balance = await fetchPublicBalance(
          decimals,
          baseWallet?.api,
          publicAddress!,
        );
        if (balance && Number(balance) > 0) {
          nextStep({
            zkBalance: '0',
          });
        }
      } else if (action === 'toPrivate') {
        await toPrivateSend(privateWallet!, pair!);
        nextStep({
          zkBalance: balance,
        });
      } else if (action === 'privateTransfer') {
        await privateTransferSend(privateWallet!, pair!);
        nextStep({
          zkBalance: balance,
        });
      } else if (action === 'toPublic') {
        // await toPublicSend(privateWallet!, pair!, publicAddress!);
        nextStep({
          zkBalance: balance,
        });
      } else if (action === 'clearStorage') {
        await clearStorage(privateWallet!.palletName, network);
        nextStep();
        setTimeout(window.location.reload, 1000);
      }
    } catch (ex) {
      console.error(ex);
    } finally {
      setOperating(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await keyring.loadAll({ type: 'sr25519' });
      const stepResult = (await getIdbData('stepResult')) || [];
      let privateWallet: MantaPayWallet;
      if (stepResult[0] && stepResult[0].done) {
        const result = await initialWallet(stepResult[0].value.mnemonic);
        privateWallet = result.privateWallet;
        assert(privateWallet, 'Initial Wallet Failed');
      }
      if (stepResult[1] && stepResult[1].done) {
        const result = await privateWallet!.initialWalletSync();
        assert(result, 'Initial Wallet Data Failed');
      }
      setStepResultList(stepResult);
    };
    if (!initial) {
      initial = true;
      init();
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      await updateBalance();
    }, 4000);
    return () => {
      clearInterval(intervalId);
    };
  }, [updateBalance]);

  return (
    <div className="App">
      {(stepResultList &&
        stepList.map(
          (step, index) =>
            (index === 0 || stepResultList[index - 1]?.done) && (
              <fieldset key={index}>
                <legend>
                  Step {index + 1}/{stepList.length}: {step.title}
                </legend>
                {step.content && <p className="brief">{step.content}</p>}
                <div className="content">
                  {step.action === 'createAccount' &&
                    stepResultList[index]?.done && (
                      <>
                        <p>
                          <strong className="address">{publicAddress}</strong>
                          (Public Address)
                        </p>
                        <p>
                          <strong className="address">{zkAddress}</strong>
                          (zKAddress)
                        </p>
                      </>
                    )}
                  {step.action === 'updateBalance' &&
                    stepResultList[index]?.done && (
                      <>
                        <p>
                          KMA: <strong>{publicBalance}</strong>
                        </p>
                        <p>
                          zkKMA: <strong>{balance}</strong>
                        </p>
                      </>
                    )}
                </div>
                {step.button && !stepResultList[index]?.done && (
                  <button
                    type="button"
                    disabled={operating}
                    onClick={() => {
                      executeStep(step.action, index);
                    }}
                  >
                    {step.button}
                  </button>
                )}
                {stepResultList[index]?.done && <div>State: ✅</div>}
              </fieldset>
            ),
        )) || <>Initial...</>}
      {stepResultList && stepResultList[stepList.length - 1] && (
        <fieldset>
          <legend>Result</legend>
          <div></div>
        </fieldset>
      )}
    </div>
  );
}

import BN from 'bn.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { mnemonicGenerate } from '@polkadot/util-crypto';
import keyring from '@polkadot/ui-keyring';
import type { KeyringPair } from '@polkadot/keyring/types';
import { assert } from '@polkadot/util';
import type { interfaces } from 'manta-extension-sdk';
import { BaseWallet, MantaPayWallet } from 'manta-extension-sdk';

import {
  clearStorage,
  fetchPublicBalance,
  fetchZkBalance,
  getBaseWallet,
  stepList,
  type StepResult,
} from './utils';

import {
  get as getIdbData,
  set as setIdbData,
  del as delIdbData,
} from 'idb-keyval';

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
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [correctZkBalance, setCorrectZkBalance] = useState<string | null>(null);
  const [latestZkBalance, setLatestZkBalance] = useState<string | null>(null);
  const [publicBalance, setPublicBalance] = useState<string | null>(null);
  const [operating, setOperating] = useState<boolean>(false);

  const updateBalance = useCallback(async () => {
    if (!baseWallet?.api || !publicAddress) {
      return;
    }
    const publicBalance = await fetchPublicBalance(
      decimals,
      baseWallet.api,
      publicAddress,
    );
    setPublicBalance(publicBalance ?? '-');
  }, [setPublicBalance, publicAddress]);

  const nextStep = useCallback(
    (value?: any, index?: number) => {
      setStepResultList((prevResult) => {
        const newIndex = index ?? prevResult!.length;
        const newResult = [...prevResult!];
        newResult[newIndex] = {
          done: 1,
          value: value || {},
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
      setMnemonic(mnemonic);
      setZkAddress(zkAddress);
      setPublicAddress(pair.address);
      return { privateWallet };
    },
    [setPair, setZkAddress, setPublicAddress, setMnemonic],
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

  const toPrivateSend = useCallback(
    async (privateWallet: MantaPayWallet, pair: KeyringPair) => {
      await privateWallet.walletSync();
      const initialPrivateBalance = await privateWallet.getZkBalance(assetId);
      const transaction = await privateWallet.toPrivateBuild(
        assetId,
        new BN(30).mul(new BN(10).pow(new BN(decimals))),
      );
      assert(transaction && transaction.txs.length > 0, 'ToPrivate Failed');
      for (let i = 0; i < transaction.txs.length; i += 1) {
        await transaction.txs[i].signAndSend(pair!);
      }
      await queryTransferResult(privateWallet, initialPrivateBalance);
    },
    [],
  );

  const privateTransferSend = useCallback(
    async (privateWallet: MantaPayWallet, pair: KeyringPair) => {
      await privateWallet.walletSync();
      const toPrivateTestAddress =
        'ByFduKK9RSaNT99wYraLGCQ61yXUWUw69qP786WdvKmf';
      const initialPrivateBalance = await privateWallet.getZkBalance(assetId);
      const transaction = await privateWallet.privateTransferBuild(
        assetId,
        new BN(5).mul(new BN(10).pow(new BN(decimals))),
        toPrivateTestAddress,
      );
      assert(
        transaction && transaction.txs.length > 0,
        'PrivateTransfer Failed',
      );
      for (let i = 0; i < transaction.txs.length; i += 1) {
        await transaction.txs[i].signAndSend(pair!);
      }
      await queryTransferResult(privateWallet, initialPrivateBalance);
    },
    [],
  );

  const toPublicSend = useCallback(
    async (
      privateWallet: MantaPayWallet,
      pair: KeyringPair,
      publicAddress: string,
    ) => {
      await privateWallet.walletSync();
      const initialPrivateBalance = await privateWallet.getZkBalance(assetId);
      const transaction = await privateWallet.toPublicBuild(
        assetId,
        new BN(15).mul(new BN(10).pow(new BN(decimals))),
        publicAddress,
      );
      assert(transaction && transaction.txs.length > 0, 'ToPublic Failed');
      for (let i = 0; i < transaction.txs.length; i += 1) {
        await transaction.txs[i].signAndSend(pair!);
      }
      await queryTransferResult(privateWallet, initialPrivateBalance);
    },
    [],
  );

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
        if (index === stepList.length - 1) {
          const zkBalance = await fetchZkBalance(
            assetId,
            decimals,
            privateWallet!,
          );
          setLatestZkBalance(zkBalance);
        }
      } else if (action === 'updateBalance') {
        const balance = await fetchPublicBalance(
          decimals,
          baseWallet?.api,
          publicAddress!,
        );
        assert(
          balance && Number(balance) >= 50,
          'Please transfer 50 KMA to Public Address first',
        );
        setCorrectZkBalance('0');
        nextStep({
          zkBalance: '0',
        });
      } else if (
        action === 'toPrivate' ||
        action === 'privateTransfer' ||
        action === 'toPublic'
      ) {
        if (action === 'toPrivate') {
          await toPrivateSend(privateWallet!, pair!);
        } else if (action === 'privateTransfer') {
          await privateTransferSend(privateWallet!, pair!);
        } else if (action === 'toPublic') {
          await toPublicSend(privateWallet!, pair!, publicAddress!);
        }
        const zkBalance = await fetchZkBalance(
          assetId,
          decimals,
          privateWallet!,
        );
        setCorrectZkBalance(zkBalance);
        nextStep({ zkBalance });
      } else if (action === 'clearStorage') {
        await clearStorage(privateWallet!.palletName, network);
        nextStep();
        setTimeout(() => {
          window.location.reload();
        }, 300);
      }
    } catch (ex) {
      console.error(ex);
    } finally {
      setOperating(false);
    }
  };

  const clearAllData = async () => {
    setOperating(true);
    await clearStorage(privateWallet!.palletName, network);
    await delIdbData('stepResult');
    window.location.reload();
  };

  useEffect(() => {
    const init = async () => {
      await keyring.loadAll({ type: 'sr25519' });
      const stepResult = (await getIdbData('stepResult')) || [];
      let privateWallet: MantaPayWallet | null = null;
      if (stepResult[0] && stepResult[0].done) {
        const result = await initialWallet(stepResult[0].value.mnemonic);
        privateWallet = result.privateWallet;
        assert(privateWallet, 'Initial Wallet Failed');
      }
      if (stepResult[1] && stepResult[1].done) {
        const needReInitial =
          stepResult[6] &&
          stepResult[6].done &&
          (!stepResult[7] || !stepResult[7].done);
        if (!needReInitial) {
          const result = await privateWallet!.initialWalletSync();
          assert(result, 'Initial Wallet Data Failed');
        }
      }
      if (stepResult[5]?.done) {
        setCorrectZkBalance(stepResult[5].value.zkBalance);
      } else if (privateWallet?.initialSyncIsFinished) {
        const zkBalance = await fetchZkBalance(
          assetId,
          decimals,
          privateWallet,
        );
        setCorrectZkBalance(zkBalance);
      }
      if (stepResult && stepResult[stepList.length - 1]?.done) {
        const zkBalance = await fetchZkBalance(
          assetId,
          decimals,
          privateWallet!,
        );
        setLatestZkBalance(zkBalance);
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
                          <strong className="address">{mnemonic}</strong>
                          (Mnemonic)
                        </p>
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
                          Correct zkKMA: <strong>{correctZkBalance}</strong>
                        </p>
                      </>
                    )}
                </div>
                {step.button && !stepResultList[index]?.done && (
                  <button
                    type="button"
                    className={operating ? 'dots-ellipsis' : ''}
                    disabled={operating}
                    onClick={() => {
                      executeStep(step.action, index);
                    }}
                  >
                    {operating ? 'Operating' : step.button}
                  </button>
                )}
                {stepResultList[index]?.done && <div>State: ✅</div>}
              </fieldset>
            ),
        )) || <strong className="dots-ellipsis">Initial</strong>}

      {stepResultList && stepResultList[stepList.length - 1]?.done && (
        <fieldset>
          <legend>Result</legend>
          <div className="content">
            <p>
              Correct zkKMA: <strong>{correctZkBalance}</strong>
            </p>
            <p>
              Latest zkKMA: <strong>{latestZkBalance}</strong>
            </p>
          </div>
          <button
            type="button"
            className={operating ? 'dots-ellipsis' : ''}
            disabled={operating}
            onClick={clearAllData}
          >
            {operating ? 'Operating' : 'Clear All Data'}
          </button>
        </fieldset>
      )}
      <p style={{ fontSize: 12, marginTop: 20 }}>
        Open Chrome Developer Console to see more information
      </p>
    </div>
  );
}

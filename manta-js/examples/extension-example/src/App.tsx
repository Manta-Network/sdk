import { ApiPromise, WsProvider } from '@polkadot/api';
import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useState } from 'react';

import { Injected, InjectedWeb3, PrivateWalletStateInfo } from './interfaces';

const rpcUrl = 'wss://kwaltz.baikal.testnet.dolphin.training';
// const rpcUrl = "wss://ws.calamari.seabird.systems";
const assetId = '1';
const network = 'Dolphin';
const decimals = 18;
const toZkAddress = '3UG1BBvv7viqwyg1QKsMVarnSPcdiRQ1aL2vnTgwjWYX';

const injectedWeb3 = window.injectedWeb3
  ? (window.injectedWeb3['manta-wallet-js'] as InjectedWeb3)
  : null;

let isConnecting = false;

export default function App() {
  const [isInjected] = useState(!!injectedWeb3);
  const [injected, setInjected] = useState<Injected | null>(null);
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [publicAddress, setPublicAddress] = useState<string | null>(null);
  const [zkAddress, setZkAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [publicBalance, setPublicBalance] = useState<string | null>(null);
  const [toPrivateAmount, setToPrivateAmount] = useState<string>('100');
  const [privateTransferAmount, setPrivateTransferAmount] =
    useState<string>('5');
  const [toPublicAmount, setToPublicAmount] = useState<string>('5');
  const [startAssetId, setStartAssetId] = useState<string>('1');
  const [result, setResult] = useState<any>();
  const [operating, setOperating] = useState<boolean>(false);
  const [receiveZkAddress, setReceiveZkAddress] = useState<string>(toZkAddress);
  const [stateInfo, setStateInfo] = useState<PrivateWalletStateInfo | null>(
    null,
  );

  const onConnect = useCallback(async () => {
    const injected = await injectedWeb3?.enable('Manta Wallet Demo');
    if (!injected) {
      return;
    }

    const accounts = await injected.accounts.get();
    if (!accounts || accounts.length <= 0) {
      return;
    }
    setPublicAddress(accounts[0].address);
    // @ts-ignore
    setZkAddress(accounts[0].zkAddress);
    setInjected(injected);

    const provider = new WsProvider(rpcUrl);
    const api = await ApiPromise.create({ provider });
    api.setSigner(injected.signer);
    setApi(api);
    localStorage.setItem('connected', '1');
  }, [setInjected]);

  const syncWallet = useCallback(async () => {
    return await injected?.privateWallet.walletSync();
  }, [injected]);

  const fetchBalance = useCallback(async () => {
    const balance = await injected?.privateWallet.getZkBalance({
      network,
      assetId,
    });
    if (!balance) {
      return '0';
    }
    return new BigNumber(balance)
      .div(new BigNumber(10).pow(decimals))
      .toFixed();
  }, [injected]);

  const fetchPublicBalance = useCallback(async () => {
    const accountInfo = await api?.query.system.account(publicAddress);
    const result = accountInfo as { data?: { free?: any } };
    const balanceString = result?.data?.free?.toString();
    return balanceString
      ? new BigNumber(balanceString)
          .div(new BigNumber(10).pow(decimals))
          .toFixed()
      : '0';
  }, [api, publicAddress]);

  const queryResult = useCallback(
    async (originBalance: string) => {
      const maxTimes = 12;
      let times = 1;
      const func = async () => {
        await syncWallet();
        const newBalance = await fetchBalance();
        if (originBalance !== newBalance) {
          setResult('Transaction successful');
          setOperating(false);
        } else if (times > 12) {
          setResult('Timeout');
          setOperating(false);
        } else {
          setResult(`Querying... times: ${times}/${maxTimes}`);
          times += 1;
          setTimeout(func, 5000);
        }
      };
      func();
    },
    [injected, setResult, fetchBalance, setOperating, syncWallet],
  );

  const sendTransaction = useCallback(
    async (func: () => Promise<string[] | null>) => {
      if (!publicAddress) {
        setResult('publicAddress is empty');
        return;
      }
      try {
        setOperating(true);
        setResult('Signing');
        await syncWallet();
        const response = await func();
        console.log(response);
        if (!response || response.length <= 0) {
          setOperating(false);
          setResult('Response is empty');
          return;
        }
        setResult('Sign Successful');
        for (let i = 0; i < response.length; i++) {
          const tx = api?.tx(response[i]);
          await tx?.signAndSend(publicAddress, () => {});
        }
        const originBalance = await fetchBalance();
        queryResult(originBalance ?? '0');
      } catch (ex) {
        setOperating(false);
        setResult(ex);
        console.error(ex);
      }
    },
    [injected, publicAddress, api, setResult, fetchBalance, setOperating],
  );

  const toPrivateTransaction = useCallback(async () => {
    sendTransaction(async () => {
      const response = await injected?.privateWallet.toPrivateBuild({
        assetId,
        amount: new BigNumber(10)
          .pow(decimals)
          .times(toPrivateAmount)
          .toFixed(),
        polkadotAddress: publicAddress!,
        network,
      });
      return response || null;
    });
  }, [toPrivateAmount, injected, publicAddress, sendTransaction]);

  const privateTransferTransaction = useCallback(async () => {
    sendTransaction(async () => {
      const response = await injected?.privateWallet.privateTransferBuild({
        assetId,
        amount: new BigNumber(10)
          .pow(decimals)
          .times(privateTransferAmount)
          .toFixed(),
        polkadotAddress: publicAddress!,
        toZkAddress: receiveZkAddress,
        network,
      });
      return response || null;
    });
  }, [
    privateTransferAmount,
    injected,
    publicAddress,
    sendTransaction,
    receiveZkAddress,
  ]);

  const toPublicTransaction = useCallback(async () => {
    sendTransaction(async () => {
      const response = await injected?.privateWallet.toPublicBuild({
        assetId,
        amount: new BigNumber(10).pow(decimals).times(toPublicAmount).toFixed(),
        polkadotAddress: publicAddress!,
        network,
      });
      return response || null;
    });
  }, [toPublicAmount, injected, publicAddress, sendTransaction]);

  const multiSbtBuildTransition = useCallback(async () => {
    const response = await injected?.privateWallet.multiSbtBuild([
      {
        assetId: startAssetId,
        amount: '1',
      },
      {
        assetId: String(startAssetId + 1),
        amount: '1',
      },
    ]);
    console.log(response);
    setResult(response);
  }, [startAssetId, injected, setResult]);

  useEffect(() => {
    if (!injected || !injected.privateWallet) {
      return;
    }
    return injected.privateWallet.subscribeWalletState(setStateInfo);
  }, [injected, setStateInfo]);

  useEffect(() => {
    const timerId = setInterval(async () => {
      if (stateInfo?.isWalletBusy || !stateInfo?.isWalletReady) {
        return;
      }
      const result = await Promise.all([fetchBalance(), fetchPublicBalance()]);
      setBalance(result[0] ?? '0');
      setPublicBalance(result[1] ?? '0');
    }, 2000);
    return () => {
      clearInterval(timerId);
    };
  }, [fetchBalance, setBalance, stateInfo]);

  useEffect(() => {
    if (localStorage.getItem('connected') !== '1' || isConnecting) {
      return;
    }
    isConnecting = true;
    setTimeout(onConnect, 1000);
  }, []);

  return (
    <div className="App">
      {!isInjected ? (
        <>No wallet</>
      ) : !injected ? (
        <button type="button" onClick={onConnect}>
          Connect
        </button>
      ) : (
        <>
          {!publicAddress ? (
            <>No account</>
          ) : (
            <>
              <fieldset>
                <legend>Address</legend>
                <p>
                  Public Address: <strong>{publicAddress}</strong>
                </p>
                <p>
                  zKAddress: <strong>{zkAddress}</strong>
                </p>
              </fieldset>
              <fieldset>
                <legend>Wallet State</legend>
                <pre>{JSON.stringify(stateInfo, null, 2)}</pre>
              </fieldset>
              <fieldset>
                <legend>Balance</legend>
                <p>
                  DOL: <strong>{publicBalance}</strong>
                </p>
                <p>
                  zkDOL: <strong>{balance}</strong>
                </p>
              </fieldset>
              <fieldset>
                <legend>Sign Transaction</legend>
                <p className="sign-item">
                  <span className="input">
                    <input
                      value={toPrivateAmount}
                      onChange={(e) => {
                        setToPrivateAmount(e.target.value);
                      }}
                    />
                    <i>DOL</i>
                  </span>
                  <button
                    type="button"
                    disabled={operating}
                    onClick={toPrivateTransaction}
                  >
                    ToPrivate
                  </button>
                </p>
                <p className="sign-item">
                  <span className="input">
                    <input
                      value={privateTransferAmount}
                      onChange={(e) => {
                        setPrivateTransferAmount(e.target.value);
                      }}
                    />
                    <i>zkDOL</i>
                  </span>
                  <button
                    type="button"
                    disabled={operating}
                    onClick={privateTransferTransaction}
                  >
                    PrivateTransfer
                  </button>
                  <span className="input receive">
                    <input
                      placeholder="Receive zkAddress"
                      value={receiveZkAddress}
                      onChange={(e) => {
                        setReceiveZkAddress(e.target.value);
                      }}
                    />
                  </span>
                </p>
                <p className="sign-item">
                  <span className="input">
                    <input
                      value={toPublicAmount}
                      onChange={(e) => {
                        setToPublicAmount(e.target.value);
                      }}
                    />
                    <i>zkDOL</i>
                  </span>
                  <button
                    type="button"
                    disabled={operating}
                    onClick={toPublicTransaction}
                  >
                    ToPublic
                  </button>
                </p>
                <p className="sign-item">
                  <span className="input">
                    <input
                      value={startAssetId}
                      onChange={(e) => {
                        setStartAssetId(e.target.value);
                      }}
                    />
                  </span>
                  <button
                    type="button"
                    disabled={operating}
                    onClick={multiSbtBuildTransition}
                  >
                    MultiSbtBuild
                  </button>
                </p>
              </fieldset>
              <fieldset>
                <legend>Result</legend>
                <textarea
                  readOnly
                  value={JSON.stringify(result, null, 2)}
                ></textarea>
                <p style={{ fontSize: 12 }}>
                  Open Chrome Dev Console to see more information
                </p>
              </fieldset>
            </>
          )}
        </>
      )}
    </div>
  );
}

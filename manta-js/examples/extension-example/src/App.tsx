import { ApiPromise, WsProvider } from '@polkadot/api';
import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useState } from 'react';

import { Injected, InjectedWeb3, PrivateWalletStateInfo } from './interfaces';

const rpcUrl = 'wss://zenlink.zqhxuyuan.cloud:444';
const decimals = 12;
const network = 'Calamari';

const assetId = '1';
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
  const [virtualAsset, setVirtualAsset] = useState<string>(
    '{"identifier":{"is_transparent":false,"utxo_commitment_randomness":[218,12,198,205,243,45,111,55,97,232,107,40,237,202,174,102,12,100,161,170,141,2,173,101,117,161,177,116,146,37,81,31]},"asset":{"id":[82,77,144,171,218,215,31,37,190,239,170,153,12,42,235,151,22,238,79,66,34,183,22,37,117,55,167,12,74,225,51,45],"value":1}}',
  );
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
      return null;
    }
    return new BigNumber(balance)
      .div(new BigNumber(10).pow(decimals))
      .toFixed();
  }, [injected]);

  const fetchPublicBalance = useCallback(async () => {
    const accountInfo = await api?.query.system.account(publicAddress);
    const result = accountInfo as { data?: { free?: any } };
    const balanceString = result?.data?.free?.toString();
    if (!balanceString) {
      return null;
    }
    return balanceString
      ? new BigNumber(balanceString)
          .div(new BigNumber(10).pow(decimals))
          .toFixed()
      : '0';
  }, [api, publicAddress]);

  const updateBalance = useCallback(async () => {
    const result = await Promise.all([fetchBalance(), fetchPublicBalance()]);
    setBalance(result[0] ?? '-');
    setPublicBalance(result[1] ?? '-');
  }, [fetchBalance, fetchPublicBalance, setBalance, setPublicBalance]);

  const queryResult = useCallback(
    async (originBalance: string) => {
      const maxTimes = 12;
      let times = 1;
      const func = async () => {
        await syncWallet();
        const newBalance = await fetchBalance();
        if (originBalance !== newBalance) {
          setResult('Transaction successful');
          updateBalance();
          setOperating(false);
        } else if (times > 12) {
          setResult('Timeout');
          setOperating(false);
          updateBalance();
        } else {
          setResult(`Querying... times: ${times}/${maxTimes}`);
          times += 1;
          setTimeout(func, 5000);
        }
      };
      func();
    },
    [setResult, fetchBalance, setOperating, syncWallet, updateBalance],
  );

  const sendTransaction = useCallback(
    async (func: () => Promise<any>, checkResult = true) => {
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
        if (!checkResult) {
          setOperating(false);
          setResult(response);
        } else {
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
        }
      } catch (ex) {
        setOperating(false);
        setResult(ex);
        console.error(ex);
      }
    },
    [publicAddress, api, setResult, fetchBalance, setOperating, syncWallet],
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

  const multiSbtPostBuildTransition = useCallback(async () => {
    sendTransaction(async () => {
      return injected?.privateWallet.multiSbtPostBuild({
        sbtInfoList: [
          { assetId: startAssetId, amount: '1' },
          { assetId: String(startAssetId + 1), amount: '1' },
        ],
        network,
      });
    }, false);
  }, [startAssetId, injected, sendTransaction]);

  const getSbtIdentityProof = useCallback(async () => {
    await sendTransaction(async () => {
      return injected?.privateWallet.getSbtIdentityProof({
        virtualAsset,
        polkadotAddress: publicAddress!,
        network,
      });
    }, false);
  }, [virtualAsset, publicAddress, injected, sendTransaction]);

  // sub state && unSub state
  useEffect(() => {
    if (!injected || !injected.privateWallet) {
      return;
    }
    return injected.privateWallet.subscribeWalletState(setStateInfo);
  }, [injected, setStateInfo]);

  // loop balance
  useEffect(() => {
    if (stateInfo?.isWalletBusy || !stateInfo?.isWalletReady) {
      return;
    }
    updateBalance();
  }, [stateInfo?.isWalletReady, updateBalance]);

  // auto connect wallet
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
                  <strong className="address">{publicAddress}</strong>(Public
                  Address)
                </p>
                <p>
                  <strong className="address">{zkAddress}</strong>(zKAddress)
                </p>
              </fieldset>
              <fieldset>
                <legend>Wallet State</legend>
                {stateInfo &&
                  Object.keys(stateInfo).map((key: string) => (
                    <p key={key}>
                      {key}: {/* @ts-ignore */}
                      <strong>{String(stateInfo[key])}</strong>
                    </p>
                  ))}
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
                    <i>AssetId</i>
                  </span>
                  <button
                    type="button"
                    disabled={operating}
                    onClick={multiSbtPostBuildTransition}
                  >
                    MultiSbtPostBuild
                  </button>
                </p>
                <p className="sign-item">
                  <span className="input">
                    <input
                      value={virtualAsset}
                      onChange={(e) => {
                        setVirtualAsset(e.target.value);
                      }}
                    />
                    <i>VirtualAsset</i>
                  </span>
                  <button
                    type="button"
                    disabled={operating}
                    onClick={getSbtIdentityProof}
                  >
                    GetSbtIdentityProof
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

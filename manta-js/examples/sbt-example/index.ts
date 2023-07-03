import BN from 'bn.js';
import type { interfaces } from 'manta-extension-sdk';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import { base58Decode, decodeAddress, cryptoWaitReady } from '@polkadot/util-crypto';
import { ethers } from 'ethers';
import { Keyring } from '@polkadot/api';
import { u8aToBn, hexToU8a, u8aToHex, u8aWrapBytes, u8aUnwrapBytes } from '@polkadot/util';
import { KeyringPair } from '@polkadot/keyring/types';

import {BaseWallet,MantaSbtWallet} from 'manta-extension-sdk';

import {
  get as getIdbData,
  set as setIdbData,
  del as delIdbData,
} from 'idb-keyval';

const apiEndpoint = ['wss://crispy.baikal.testnet.calamari.systems'];
const currentNetwork: interfaces.Network = 'Calamari';
const provingFilePath =
  'https://media.githubusercontent.com/media/Manta-Network/manta-rs/main/manta-parameters/data/pay/proving';
const parametersFilePath =
  'https://raw.githubusercontent.com/Manta-Network/manta-rs/main/manta-parameters/data/pay/parameters';
const loggingEnabled = true;

let currentSeedPhrase = 'spike napkin obscure diamond slice style excess table process story excuse absurd';
let signerAccount: KeyringPair;
let sbtPallet: interfaces.IPrivateWallet;

function _log(...message: any[]) {
  console.log(`[Demo] ${performance.now().toFixed(4)}: ${message.join(' ')}`);
}

const publishTransaction = async (txs: SubmittableExtrinsic<'promise', any>[]) => {
  for (let i = 0; i < txs.length; i++) {
    await txs[i].signAndSend(
      signerAccount,
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

const initWalletData = async (privateWallet: interfaces.IPrivateWallet) => {
  _log('Initial signer');
  await privateWallet.initialSigner();
  _log('Load user mnemonic');
  await privateWallet.loadUserSeedPhrase(currentSeedPhrase);
  const zkAddress = await privateWallet.getZkAddress();
  _log('The zkAddress is: ', zkAddress);
};

const reserveSbt = async (privateWallet: MantaSbtWallet) => {
  const reserveTx = privateWallet.api.tx.mantaSbt.reserveSbt(signerAccount.address);
  await publishTransaction([reserveTx]);
};

const mintSbt = async (privateWallet: MantaSbtWallet) => {
  const assetIdRange: any = await privateWallet.api.query.mantaSbt.reservedIds(signerAccount.address);
  const [startAssetId, endAssetId] = assetIdRange.unwrap();
  const sbtInfoList: interfaces.SbtInfo[] = [
      { assetId: new BN(startAssetId) },
      { assetId: new BN(startAssetId).add(new BN(1)) },
  ];

  const { transactionDatas, posts } = await privateWallet.multiSbtPostBuild(sbtInfoList);
  const batchesTx: any[] = [];
  posts.forEach((post) => {
    const tx = privateWallet.api.tx.mantaSbt.toPrivate(null, null, null, post[0], []);
    batchesTx.push(tx);
  });
  const sbtTx = privateWallet.api.tx.utility.batch(batchesTx);
  await publishTransaction([sbtTx]);
};

const mintSbtWithSignature = async (privateWallet: MantaSbtWallet) => {
  console.log(`signer address: ${signerAccount.address}`);

  let assetIdRange: any = await privateWallet.api.query.mantaSbt.reservedIds(signerAccount.address);
  if(assetIdRange.isNone == true) {
    console.log(`asset id of ${signerAccount.address} is none, please reserve asset id first.`);
    return;
  }
  const [startAssetId, endAssetId] = assetIdRange?.unwrap();
  console.log(`asset id start: ${startAssetId} end:${endAssetId}`);
  const sbtInfoList: interfaces.SbtInfo[] = [{ assetId: new BN(startAssetId) }];

  const { transactionDatas, posts } = await privateWallet.multiSbtPostBuild(sbtInfoList);
  console.log(`tx data: ${JSON.stringify(transactionDatas)}`);

  const genesis = (await privateWallet.api.rpc.chain.getBlockHash(0)).toHex();
  const domain = {
      name: "Claim Free SBT",
      version: "1",
      chainId: 0,
      salt: genesis,
  };
  const types = {
      Transaction: [{ name: "proof", type: "bytes" }],
  };

  const post = posts[0];
  const zkp = post[0];
  const value = {
      proof: zkp.proof,
  };
  const structHash = ethers.utils._TypedDataEncoder.hash(domain, types, value)
  const wrapHex = u8aWrapBytes(structHash);
  const public_signature = signerAccount.sign(wrapHex);
  const sigAndPubKey = {
    sig: {Sr25519: Array.from(public_signature)},
    pub_key: {Sr25519: Array.from(signerAccount.publicKey)}
  }
  const zkAddress = await privateWallet.getZkAddress();

  const tx = privateWallet.api.tx.mantaSbt.toPrivate(null, null, sigAndPubKey, zkp, "hello");

  await tx.signAndSend(signerAccount, { nonce: -1 }, async ({ events = [], status, txHash, dispatchError }) => {
    if (status.isInBlock || status.isFinalized) {
      let tx_data = transactionDatas[0];
      const proofId = u8aToHex(
        tx_data[0].ToPrivate[0]['utxo_commitment_randomness']
      );
      console.log("ProofKey:" + proofId);
      // let eth_address = "0xf5F1bb0420543b1db39351F0B8c63a844e8F982c";
      // const proof_info = await proofInfo(transactionDatas, startAssetId, "TOKEN", zkAddress, eth_address, "https://manta.network/");
      // const post_proof_info = {
        // "address": signerAccount.address,
        // "proof_info": proof_info
      // }
      // TODO: save proof info to NPO platform.
    }
  });
  // await publishTransaction([sbtTx]);
};

const proofInfo = async(transactionDatas: any, assetId: string, tokenType: string, zkAddress: string, ethAddress: string, url: string) => {
  const bytes = base58Decode(zkAddress);
  const addressBytes = Array.from(bytes);
  const proofInfos = transactionDatas?.map((tx: any) => {
    const proofId = u8aToHex(
      tx[0].ToPrivate[0]['utxo_commitment_randomness']
    );
    const identifier = tx[0].ToPrivate[0];
    const asset_info = tx[0].ToPrivate[1];
    return {
      transaction_data: {
        asset_info: {
          id: asset_info.id,
          value: Number(asset_info.value)
        },
        identifier,
        zk_address: {
          receiving_key: addressBytes
        }
      },
      proof_id: proofId,
      blur_url: url,
      asset_id: parseInt(assetId),
      token_type: tokenType,
      eth_address: ethAddress
    };
  });
  console.log(`proof info: ${JSON.stringify(proofInfos)}`);
  return proofInfos;
}

const resetData = async (privateWallet: interfaces.IPrivateWallet) => {
  await privateWallet.resetState();
  await delIdbData(
    `storage_state_${privateWallet.palletName}_${currentNetwork}`,
  );
};

// @ts-ignore
window.actions = {
  async clearData() {
    await resetData(sbtPallet);
    window.location.reload();
  },
  async reserveSbt(reservee: string) {
    return await reserveSbt(sbtPallet as MantaSbtWallet);
  },
  async mintSbt() {
    return await mintSbt(sbtPallet as MantaSbtWallet);
  },
  async mintSbtWithSignature() {
    return await mintSbtWithSignature(sbtPallet as MantaSbtWallet);
  },
};

async function main() {
  _log('Initial base');
  const baseWallet = await getBaseWallet();
  _log('Initial base end');

  await cryptoWaitReady();
  signerAccount = new Keyring({type: 'sr25519'}).addFromMnemonic(currentSeedPhrase);

  _log('Initial pallets');
  sbtPallet = MantaSbtWallet.init(currentNetwork, baseWallet);
  _log('Initial pallets end');

  _log('Initial mantaSbt data');
  await initWalletData(sbtPallet);
  _log('Initial mantaSbt data end');

  _log('Initial successful');
}

main();

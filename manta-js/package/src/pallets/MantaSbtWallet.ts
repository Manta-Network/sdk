import BN from 'bn.js';
import type { Wallet as WasmWallet } from '../wallet/crate/pkg/manta_wasm_wallet';
import type {
  IBaseWallet,
  ILedgerApi,
  PalletName,
  Network,
  IMantaSbtWallet,
  SbtInfo,
  Address,
  SignedMultiSbtPost,
} from '.././interfaces';
import {
  formatSbtTransactionData,
  formatWasmJson,
  toPrivateBuildUnsigned,
  transferPost,
  wrapWasmError,
} from '../utils';
import PrivateWallet from '../PrivateWallet';
import { decodeAddress } from '@polkadot/util-crypto';

const CURRENT_PALLET_NAME: PalletName = 'mantaSBT';

/// PrivateWallet class
export default class MantaSbtWallet
  extends PrivateWallet
  implements IMantaSbtWallet
{
  constructor(
    network: Network,
    baseWallet: IBaseWallet,
    wasmWallet: WasmWallet,
    ledgerApi: ILedgerApi,
  ) {
    super(CURRENT_PALLET_NAME, network, baseWallet, wasmWallet, ledgerApi);
  }

  static init(network: Network, baseWallet: IBaseWallet): MantaSbtWallet {
    const params = PrivateWallet.getInitialParams(
      CURRENT_PALLET_NAME,
      baseWallet,
    );
    return new MantaSbtWallet(
      network,
      baseWallet,
      params.wasmWallet,
      params.ledgerApi,
    );
  }

  async multiSbtPostBuild(
    sbtInfoList: SbtInfo[],
  ): Promise<SignedMultiSbtPost | null> {
    try {
      await this.waitForWallet();
      this.walletIsBusy = true;
      const defaultAmount = new BN('1');
      const posts = [];
      const transactionDatas = [];
      for (let i = 0; i < sbtInfoList.length; i += 1) {
        const sbtInfo = sbtInfoList[i];
        const transactionUnsigned = await toPrivateBuildUnsigned(
          this.wasm,
          sbtInfo.assetId,
          sbtInfo.amount ?? defaultAmount,
        );
        const data = await this.wasmWallet.sign_with_transaction_data(
          transactionUnsigned,
          null,
          this.getWasmNetWork(),
        );
        const postsTxs = formatSbtTransactionData(data);
        posts.push(postsTxs[0].map((post: any) => transferPost(post)));
        transactionDatas.push(postsTxs[1]);
      }
      this.walletIsBusy = false;
      return {
        transactionDatas: formatWasmJson(transactionDatas),
        posts,
      };
    } catch (ex) {
      this.walletIsBusy = false;
      console.error('Failed to build multiSbtPostBuild.', ex);
      throw wrapWasmError(ex);
    }
  }

  async getIdentityProof(
    virtualAsset: string,
    polkadotAddress: Address,
  ): Promise<any> {
    try {
      await this.waitForWallet();
      this.walletIsBusy = true;
      const identityJson = `[[${virtualAsset}, ${`[${decodeAddress(
        polkadotAddress,
      )}]`}]]`;
      const identityRequest =
        this.wasm.IdentityRequest.from_string(identityJson);
      this.log('IdentityProof Start');
      const identityProof = await this.wasmWallet.identity_proof(
        identityRequest,
        this.getWasmNetWork(),
      );
      this.log('IdentityProof End');
      this.walletIsBusy = false;
      return (
        (identityProof &&
          identityProof.map((item: any) => transferPost(item))) ||
        null
      );
    } catch (ex) {
      this.walletIsBusy = false;
      console.error('Failed to getIdentityProof', ex);
      throw wrapWasmError(ex);
    }
  }
}

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
import { formatWasmJson, toPrivateBuildUnsigned, transferPost } from '../utils';
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
    const result = await this.wrapWalletIsBusy(
      async () => {
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
          const result = await this.wasmWallet.sign_with_transaction_data(
            transactionUnsigned,
            null,
            this.getWasmNetWork(),
          );
          const itemPosts: any = [];
          const itemDatas: any = [];
          result.forEach((item: any) => {
            itemPosts.push(transferPost(item[0]));
            itemDatas.push(item[1]);
          });
          posts.push(itemPosts);
          transactionDatas.push(itemDatas);
        }
        return {
          transactionDatas: formatWasmJson(transactionDatas),
          posts,
        };
      },
      (ex: Error) => {
        console.error('Failed to build multiSbtPostBuild.', ex);
      },
    );
    return result;
  }

  async getIdentityProof(
    virtualAsset: string,
    polkadotAddress: Address,
  ): Promise<any> {
    const result = await this.wrapWalletIsBusy(
      async () => {
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
        return (
          (identityProof &&
            identityProof.map((item: any) => transferPost(item))) ||
          null
        );
      },
      (ex: Error) => {
        console.error('Failed to getIdentityProof', ex);
      },
    );
    return result;
  }
}

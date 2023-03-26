import BN from 'bn.js';
import type { Wallet as WasmWallet } from '../wallet/crate/pkg/manta_wasm_wallet';
import {
  SignedMultiSbtTransaction,
  IBaseWallet,
  ILedgerApi,
  PalletName,
  IMantaSbtWallet,
} from '.././interfaces';
import {
  mapPostToTransaction,
  toPrivateBuildUnsigned,
  transferPost,
} from '../utils';
import { Network } from '../constants';
import PrivateWallet from '../PrivateWallet';

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

  /// Initializes the PrivateWallet class, for a corresponding environment and network.
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

  async multiSbtBuild(
    startingAssetId: BN,
    metadataList: string[],
  ): Promise<SignedMultiSbtTransaction | null> {
    try {
      await this.waitForWallet();
      this.walletIsBusy = true;
      const amount = new BN('1');
      const transactions = [];
      const transactionDatas = [];
      for (let i = 0; i < metadataList.length; i += 1) {
        const transactionUnsigned = await toPrivateBuildUnsigned(
          this.wasm,
          startingAssetId,
          amount,
        );
        startingAssetId = startingAssetId.add(new BN('1'));
        const postsTxs = await this.wasmWallet.sign_with_transaction_data(
          transactionUnsigned,
          null,
          this.getWasmNetWork(),
        );
        const posts = postsTxs[0];
        for (let j = 0; j < posts.length; j++) {
          const convertedPost = transferPost(posts[j]);
          const transaction = await mapPostToTransaction(
            this.palletName,
            this.api,
            convertedPost,
            metadataList[i],
          );
          transactions.push(transaction);
        }
        transactionDatas.push(postsTxs[1]);
      }
      const batchedTx = await this.api.tx.utility.batch(transactions);
      this.walletIsBusy = false;
      return {
        batchedTx,
        transactionDatas,
      };
    } catch (ex) {
      this.walletIsBusy = false;
      console.error('Failed to build multiSbtBuild.', ex);
      throw ex;
    }
  }

  async getIdentityProof(asset: string, zkAddress: string): Promise<string> {
    this.log(`asset: ${asset}, zkAddress: ${zkAddress}`);
    throw new Error('Method not implemented.');
  }
}

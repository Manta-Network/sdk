import BN from 'bn.js';
import type {
  Wallet as WasmWallet,
  Transaction as WasmTransaction,
} from '../wallet/crate/pkg/manta_wasm_wallet';
import type {
  Address,
  IMantaPayWallet,
  SignedTransaction,
  IBaseWallet,
  ILedgerApi,
  PalletName,
  Network,
  UtxoInfo,
} from '.././interfaces';
import {
  mapPostToTransaction,
  privateTransferBuildUnsigned,
  toPrivateBuildUnsigned,
  toPublicBuildUnsigned,
  transactionsToBatches,
  transferPost,
} from '../utils';
import PrivateWallet from '../PrivateWallet';
import { u8aToBn } from '@polkadot/util';

const CURRENT_PALLET_NAME: PalletName = 'mantaPay';

export default class MantaPayWallet
  extends PrivateWallet
  implements IMantaPayWallet
{
  constructor(
    network: Network,
    baseWallet: IBaseWallet,
    wasmWallet: WasmWallet,
    ledgerApi: ILedgerApi,
  ) {
    super(CURRENT_PALLET_NAME, network, baseWallet, wasmWallet, ledgerApi);
  }

  static init(network: Network, baseWallet: IBaseWallet): MantaPayWallet {
    const params = PrivateWallet.getInitialParams(
      CURRENT_PALLET_NAME,
      baseWallet,
    );
    return new MantaPayWallet(
      network,
      baseWallet,
      params.wasmWallet,
      params.ledgerApi,
    );
  }

  /// Builds and signs a "To Private" transaction for any fungible token.
  /// Note: This transaction is not published to the ledger.
  async toPrivateBuild(
    assetId: BN,
    amount: BN,
  ): Promise<SignedTransaction | null> {
    const result = await this.baseWallet.wrapWalletIsBusy(
      async () => {
        const transaction = await toPrivateBuildUnsigned(
          this.wasm,
          assetId,
          amount,
        );
        const signResult = await this.signTransaction(null, transaction);
        return signResult;
      },
      (ex: Error) => {
        console.error('Failed to build toPrivateBuild.', ex);
      },
    );
    return result;
  }

  /// Builds a "Private Transfer" transaction for any fungible token.
  /// Note: This transaction is not published to the ledger.
  async privateTransferBuild(
    assetId: BN,
    amount: BN,
    toZkAddress: Address,
  ): Promise<SignedTransaction | null> {
    const result = await this.baseWallet.wrapWalletIsBusy(
      async () => {
        await this.baseWallet.isApiReady();
        const transaction = await privateTransferBuildUnsigned(
          this.wasm,
          this.api,
          assetId,
          amount,
          toZkAddress,
          this.network,
        );
        const signResult = await this.signTransaction(
          transaction.assetMetadataJson,
          transaction.transaction,
        );
        return signResult;
      },
      (ex: Error) => {
        console.error('Failed to build privateTransferBuild.', ex);
      },
    );
    return result;
  }

  /// Builds and signs a "To Public" transaction for any fungible token.
  /// Note: This transaction is not published to the ledger.
  async toPublicBuild(
    assetId: BN,
    amount: BN,
    polkadotAddress: Address,
  ): Promise<SignedTransaction | null> {
    const result = await this.baseWallet.wrapWalletIsBusy(
      async () => {
        await this.baseWallet.isApiReady();
        const transaction = await toPublicBuildUnsigned(
          this.wasm,
          this.api,
          assetId,
          amount,
          polkadotAddress,
          this.network,
        );
        const signResult = await this.signTransaction(
          transaction.assetMetadataJson,
          transaction.transaction,
        );
        return signResult;
      },
      (ex: Error) => {
        console.error('Failed to build toPublicBuild.', ex);
      },
    );
    return result;
  }

  /// Signs the a given transaction returning posts, transactions and batches.
  /// assetMetaDataJson is optional, pass in null if transaction should not contain any.
  private async signTransaction(
    assetMetadataJson: any,
    transaction: WasmTransaction,
  ): Promise<SignedTransaction | null> {
    let assetMetadata: any = null;
    if (assetMetadataJson) {
      assetMetadata = this.wasm.AssetMetadata.from_string(assetMetadataJson);
    }
    this.log('Sign Start');
    const posts = await this.wasmWallet.sign(
      transaction,
      assetMetadata,
      this.getWasmNetWork(),
    );
    this.log('Sign End');
    const transactions = [];
    for (let i = 0; i < posts.length; i++) {
      const convertedPost = transferPost(posts[i]);
      const transaction = await mapPostToTransaction(
        this.palletName,
        this.api,
        convertedPost,
      );
      transactions.push(transaction);
    }
    const txs = await transactionsToBatches(this.api, transactions);
    return {
      posts,
      transactionData: null,
      transactions,
      txs,
    };
  }

  async getAllUtxoList() {
    const result = await this.baseWallet.wrapWalletIsBusy(async () => {
      const assetList = this.wasmWallet.asset_list(this.getWasmNetWork());
      const utxoList: UtxoInfo[] = [];
      assetList.forEach((item: any) => {
        utxoList.push({
          asset: {
            id: u8aToBn(item.asset.id).toString(),
            value: item.asset.value.toString(),
          },
          identifier: {
            is_transparent: item.identifier.is_transparent,
            utxo_commitment_randomness: u8aToBn(
              item.identifier.utxo_commitment_randomness,
            ).toString(),
          },
        } as UtxoInfo);
      });
      return utxoList;
    });
    return result;
  }
}

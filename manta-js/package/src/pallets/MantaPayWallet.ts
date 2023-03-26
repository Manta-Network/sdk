import BN from 'bn.js';
import type {
  Wallet as WasmWallet,
  Transaction as WasmTransaction,
} from '../wallet/crate/pkg/manta_wasm_wallet';
import {
  Address,
  IMantaPayWallet,
  SignedTransaction,
  IBaseWallet,
  ILedgerApi,
  PalletName,
} from '.././interfaces';
import {
  mapPostToTransaction,
  privateTransferBuildUnsigned,
  toPrivateBuildUnsigned,
  toPublicBuildUnsigned,
  transactionsToBatches,
  transferPost,
} from '../utils';
import { Network } from '../constants';
import PrivateWallet from '../PrivateWallet';

const CURRENT_PALLET_NAME: PalletName = 'mantaPay';

/// PrivateWallet class
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

  /// Initializes the PrivateWallet class, for a corresponding environment and network.
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
    try {
      await this.waitForWallet();
      this.walletIsBusy = true;
      const transaction = await toPrivateBuildUnsigned(
        this.wasm,
        assetId,
        amount,
      );
      const signResult = await this.signTransaction(null, transaction);
      this.walletIsBusy = false;
      return signResult;
    } catch (ex) {
      this.walletIsBusy = false;
      console.error('Failed to build toPrivateBuild.', ex);
      throw ex;
    }
  }

  /// Builds a "Private Transfer" transaction for any fungible token.
  /// Note: This transaction is not published to the ledger.
  async privateTransferBuild(
    assetId: BN,
    amount: BN,
    toZkAddress: Address,
  ): Promise<SignedTransaction | null> {
    try {
      await this.waitForWallet();
      this.walletIsBusy = true;
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
      this.walletIsBusy = false;
      return signResult;
    } catch (ex) {
      this.walletIsBusy = false;
      console.error('Failed to build privateTransferBuild.', ex);
      throw ex;
    }
  }

  /// Builds and signs a "To Public" transaction for any fungible token.
  /// Note: This transaction is not published to the ledger.
  async toPublicBuild(
    assetId: BN,
    amount: BN,
    polkadotAddress: Address,
  ): Promise<SignedTransaction | null> {
    try {
      await this.waitForWallet();
      this.walletIsBusy = true;
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
      this.walletIsBusy = false;
      return signResult;
    } catch (ex) {
      this.walletIsBusy = false;
      console.error('Failed to build toPublicBuild.', ex);
      throw ex;
    }
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
}

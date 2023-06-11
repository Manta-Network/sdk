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
  PrivateTransactionType,
} from '.././interfaces';
import {
  getSignedTransaction,
  privateTransferBuildUnsigned,
  toPrivateBuildUnsigned,
  toPublicBuildUnsigned,
} from '../utils';
import PrivateWallet from '../PrivateWallet';
import { bnToBn, bnToU8a, nToBigInt, u8aToBn } from '@polkadot/util';

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
        const transaction = await this.getTransaction(
          'publicToPrivate',
          assetId,
          amount,
        );
        const signResult = await this.signTransaction(
          null,
          transaction.transaction,
        );
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
        const transaction = await this.getTransaction(
          'privateToPrivate',
          assetId,
          amount,
          toZkAddress,
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
        const transaction = await this.getTransaction(
          'privateToPublic',
          assetId,
          amount,
          polkadotAddress,
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

  async consolidateTransactionBuild(utxoList: UtxoInfo[]) {
    const result = await this.baseWallet.wrapWalletIsBusy(
      async () => {
        await this.baseWallet.isApiReady();
        const originUtxoList = utxoList.map((item: UtxoInfo) => {
          return {
            asset: {
              id: bnToU8a(bnToBn(item.asset.id), { bitLength: 256 }),
              value: nToBigInt(item.asset.value),
            },
            identifier: {
              is_transparent: item.identifier.is_transparent,
              utxo_commitment_randomness: bnToU8a(
                bnToBn(item.identifier.utxo_commitment_randomness),
                { bitLength: 256 },
              ),
            },
          };
        });
        console.log(originUtxoList);
        this.log('Consolidate Start');
        const posts = await this.wasmWallet.consolidate(
          originUtxoList,
          this.getWasmNetWork(),
        );
        this.log('Consolidate End');
        const result = await getSignedTransaction(
          this.palletName,
          this.api,
          posts,
        );
        return result;
      },
      (ex: Error) => {
        console.error('Failed to build consolidateTransactionBuild.', ex);
      },
    );
    return result;
  }

  async estimateTransferPostsCount(
    type: PrivateTransactionType,
    assetId: BN,
    amount: BN,
    operateAddress?: Address,
  ) {
    const result = await this.baseWallet.wrapWalletIsBusy(
      async () => {
        const transaction = await this.getTransaction(
          type,
          assetId,
          amount,
          operateAddress,
        );
        const count = this.wasmWallet.estimate_transferposts(
          transaction.transaction,
          this.getWasmNetWork(),
        );
        return count;
      },
      (ex: Error) => {
        console.error('Failed to build toPrivateBuild.', ex);
      },
    );
    return result;
  }

  private async getTransaction(
    type: PrivateTransactionType,
    assetId: BN,
    amount: BN,
    operateAddress?: Address,
  ): Promise<any> {
    if (type === 'publicToPrivate') {
      return toPrivateBuildUnsigned(this.wasm, assetId, amount);
    } else if (type === 'privateToPrivate') {
      return privateTransferBuildUnsigned(
        this.wasm,
        this.api,
        assetId,
        amount,
        operateAddress!,
        this.network,
      );
    } else if (type === 'privateToPublic') {
      return toPublicBuildUnsigned(
        this.wasm,
        this.api,
        assetId,
        amount,
        operateAddress,
        this.network,
      );
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
    const result = await getSignedTransaction(this.palletName, this.api, posts);
    return result;
  }
}

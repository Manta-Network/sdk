import { Address } from './sdk.interfaces';
import { Signer } from '@polkadot/api/types';
import BN from 'bn.js';
import { ApiPromise } from '@polkadot/api';
import { bnToU8a } from '@polkadot/util';

export const NATIVE_TOKEN_ASSET_ID = '1';

/// MantaUtilities class
export class MantaUtilities {

  /// Returns the public balance associated with an account for a given AssetId.
  static async getPublicBalance(api:ApiPromise, assetId: BN, address:Address): Promise<BN | null> {
    try {
      if (assetId.toString() === NATIVE_TOKEN_ASSET_ID) {
        const nativeBalance: any = await api.query.system.account(address);
        return new BN(nativeBalance.data.free.toString());
      } else {
        const assetBalance: any = await api.query.assets.account(assetId, address);
        if (assetBalance.value.isEmpty) {
          return new BN(0);
        } else {
          return new BN(assetBalance.value.balance.toString());
        }
      }
    } catch (e) {
      console.log('Failed to fetch public balance.');
      console.error(e);
      return null;
    }
  }

  /// Executes a public transfer.
  static async publicTransfer(api:ApiPromise, assetId: BN, amount: BN, destinationAddress: Address, senderAddress:Address, polkadotSigner:Signer): Promise<void> {
    api.setSigner(polkadotSigner);
    try {
      const assetIdArray = bnToU8a(assetId, {bitLength: 256});
      const amountBN = amount.toArray('le', 16);
      const tx = await api.tx.mantaPay.publicTransfer(
        { id: assetIdArray, value: amountBN },
        destinationAddress
      );
      await tx.signAndSend(senderAddress);
    } catch (e) {
      console.log('Failed to execute public transfer.');
      console.error(e);
    }
  }
}

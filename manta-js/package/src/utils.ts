import { Version, Address } from './sdk.interfaces';
import { Signer } from '@polkadot/api/types';
import axios from 'axios';
import {config} from './manta-config';
import BN from 'bn.js';
import { ApiPromise } from '@polkadot/api';
import { MantaPrivateWallet } from './privateWallet';

export const NATIVE_TOKEN_ASSET_ID = '1';

/// MantaUtilities class
export class MantaUtilities {

  /// Returns the version of the currently connected manta-signer instance.
  /// Note: Requires manta-signer to be running.
  static async getSignerVersion(): Promise<Version | null> {
    try {
      const versionResult = await axios.get(`${config.SIGNER_URL}version`, {
        timeout: 1500
      });
      const version: Version = versionResult.data;
      return version;
    } catch (error) {
      return null;
    }
  }

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
      const assetIdArray = Array.from(MantaPrivateWallet.assetIdToUInt8Array(assetId));
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

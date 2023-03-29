import { Version, Address } from './sdk.interfaces';
import { Signer, SubmittableExtrinsic } from '@polkadot/api/types';
import { bnToU8a } from '@polkadot/util';
import axios from 'axios';
import config from './manta-config.json';
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

  /// Builds, signs and sends a public transfer transaction.
  static async publicTransferSend(api:ApiPromise, assetId: BN, amount: BN, destinationAddress: Address, senderAddress:Address, polkadotSigner:Signer): Promise<void> {
    api.setSigner(polkadotSigner);
    try {
      const tx = await this.publicTransferBuild(api, assetId, amount, destinationAddress);
      await tx.signAndSend(senderAddress);
    } catch (e) {
      console.log('Failed to execute public transfer.');
      console.error(e);
    }
  }

  /// Creates a public transfer payload.
  static async publicTransferBuild(api:ApiPromise, assetId: BN, amount: BN, destinationAddress: Address): Promise<SubmittableExtrinsic<'promise', any>> {
    const assetIdArray = bnToU8a(assetId, {bitLength: 256}); 
      const amountBN = amount.toArray('le', 16);
      const tx = await api.tx.mantaPay.publicTransfer(
        { id: assetIdArray, value: amountBN },
        destinationAddress
      );
      return tx;
  }

  /// Removes `numBytes` many leading bytes from a `hexString` 
  /// `useQuotes` specifies whether quotation marks should be added
  static removeLeadingBytesFromHexString(hexString: string, numBytes: number, useQuotes:boolean): string {
    let ind = hexString.indexOf("0x");
    let res = hexString.slice(ind + "0x".length + numBytes * 2);
    res = "\"0x" + res;
    if(!useQuotes) {
      res = res.replace(/\"/g, '');
    }
    return res;
  }
}

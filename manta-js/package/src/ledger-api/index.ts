// Polkadot-JS Ledger Integration
import { base64Decode } from '@polkadot/util-crypto';
import { nToBigInt, u8aToBn, u8aToU8a } from '@polkadot/util';
import { MAX_RECEIVERS_PULL_SIZE, MAX_SENDERS_PULL_SIZE } from '../constants';
import $, {
  $Utxos,
  $CurrentPaths,
  $Receivers,
  $Senders,
  outgoingNoteToJson,
  fullIncomingNoteToJson,
  utxoToJson,
  currentPathToJson,
} from './decodeUtils';
import type { ILedgerApi, LedgerSyncProgress, PalletName } from '../interfaces';
import { getLedgerSyncedCount, log } from '../utils';
import { ApiPromise } from '@polkadot/api';

export default class LedgerApi implements ILedgerApi {
  api: ApiPromise;
  palletName: PalletName;
  loggingEnabled: boolean;
  syncProgress: LedgerSyncProgress;

  constructor(
    api: ApiPromise,
    palletName: PalletName,
    loggingEnabled: boolean,
  ) {
    this.api = api;
    this.palletName = palletName;
    this.loggingEnabled = Boolean(loggingEnabled);
    this.syncProgress = {
      current: 0,
      total: 0,
      syncType: 'normal',
    };
  }

  _log(message: string) {
    log(this.loggingEnabled, message, 'Ledger Api');
  }

  // Pulls data from the ledger from the `checkpoint`
  async initial_pull(checkpoint: any) {
    try {
      if (this.loggingEnabled) {
        this._log('checkpoint ' + JSON.stringify(checkpoint));
      }
      // @ts-ignore
      const result = await this.api.rpc[this.palletName].dense_initial_pull(
        checkpoint,
        MAX_RECEIVERS_PULL_SIZE,
      );

      if (this.loggingEnabled) {
        this._log('initial pull result ' + JSON.stringify(result));
      }

      const decodedUtxoData = $Utxos.decode(
        base64Decode(result.utxo_data.toString()),
      );
      const utxoData = decodedUtxoData.map((utxo) => utxoToJson(utxo));

      const decodedMemberShipProofData = $CurrentPaths.decode(
        base64Decode(result.membership_proof_data.toString()),
      );
      let sendersReceiversTotal = 0;
      const membershipProofData = decodedMemberShipProofData.map(
        (currentPath) => {
          sendersReceiversTotal += currentPath.leaf_index || 0;
          return currentPathToJson(currentPath);
        },
      );

      const pull_result = {
        should_continue: result.should_continue.isTrue,
        utxo_data: utxoData,
        membership_proof_data: membershipProofData,
        nullifier_count: result.nullifier_count.toString(),
      };
      if (this.loggingEnabled) {
        this._log('initial pull response: ' + JSON.stringify(pull_result));
      }
      // JSON.stringify does not support bigint
      pull_result.nullifier_count = nToBigInt(result.nullifier_count);

      this.syncProgress = {
        current: getLedgerSyncedCount(checkpoint),
        total: sendersReceiversTotal + 256,
        syncType: 'initial',
      };

      return pull_result;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  // Pulls data from the ledger from the `checkpoint`
  async pull(checkpoint: any) {
    try {
      if (this.loggingEnabled) {
        this._log('checkpoint ' + JSON.stringify(checkpoint));
      }
      // @ts-ignore
      const result = await this.api.rpc[this.palletName].dense_pull_ledger_diff(
        checkpoint,
        MAX_RECEIVERS_PULL_SIZE,
        MAX_SENDERS_PULL_SIZE,
      );
      if (this.loggingEnabled) {
        this._log('pull result ' + JSON.stringify(result));
      }

      const decodedReceivers = $Receivers.decode(
        base64Decode(result.receivers.toString()),
      );
      $.assert($Receivers, decodedReceivers);
      const receivers = decodedReceivers.map((receiver) => {
        return [utxoToJson(receiver[0]), fullIncomingNoteToJson(receiver[1])];
      });

      const decodedSenders = $Senders.decode(
        base64Decode(result.senders.toString()),
      );
      $.assert($Senders, decodedSenders);
      const senders = decodedSenders.map((sender) => {
        return [Array.from(u8aToU8a(sender[0])), outgoingNoteToJson(sender[1])];
      });
      const pull_result = {
        should_continue: result.should_continue.isTrue,
        receivers: receivers,
        senders: senders,
      };
      if (this.loggingEnabled) {
        this._log('pull response: ' + JSON.stringify(pull_result));
      }
      this.syncProgress = {
        current: getLedgerSyncedCount(checkpoint),
        total: u8aToBn(result.senders_receivers_total).toNumber() + 256,
        syncType: 'normal',
      };
      return pull_result;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}

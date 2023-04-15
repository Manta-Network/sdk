// Polkadot-JS Ledger Integration
import { base64Decode } from '@polkadot/util-crypto';
import { nToBigInt, u8aToU8a } from '@polkadot/util';
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
import type { ILedgerApi, PalletName } from '../interfaces';
import { log, wrapWasmError } from '../utils';
import { ApiPromise } from '@polkadot/api';

export default class LedgerApi implements ILedgerApi {
  api: ApiPromise;
  palletName: PalletName;
  loggingEnabled: boolean;
  errorCallback: (err: any) => void;

  constructor(
    api: ApiPromise,
    palletName: PalletName,
    loggingEnabled: boolean,
    errorCallback: (err: Error) => void,
  ) {
    this.api = api;
    this.palletName = palletName;
    this.loggingEnabled = Boolean(loggingEnabled);
    this.errorCallback = errorCallback;
  }

  _log(message: string) {
    log(this.loggingEnabled, message, 'Ledger Api');
  }

  // Pulls data from the ledger from the `checkpoint`
  async initial_pull(checkpoint: any) {
    try {
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
      const membershipProofData = decodedMemberShipProofData.map(
        (currentPath) => currentPathToJson(currentPath),
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

      return pull_result;
    } catch (err) {
      const newError = wrapWasmError(err);
      if (typeof this.errorCallback === 'function') {
        this.errorCallback(newError);
      }
      throw newError;
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
      return pull_result;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}

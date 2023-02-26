// Polkadot-JS Ledger Integration

// Polkadot-JS Ledger API

import { base64Decode } from '@polkadot/util-crypto';
import * as $ from 'scale-codec';
import { u8aToU8a } from '@polkadot/util';


// function dataURItoBlob(dataURI) {
//   // convert base64 to raw binary data held in a string
//   const byteString = atob(dataURI.split(',')[1]);

//   // separate out the mime component
//   const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

//   // write the bytes of the string to an ArrayBuffer
//   const arrayBuffer = new ArrayBuffer(byteString.length);
//   const _ia = new Uint8Array(arrayBuffer);
//   for (let i = 0; i < byteString.length; i++) {
//     _ia[i] = byteString.charCodeAt(i);
//   }

//   const dataView = new DataView(arrayBuffer);
//   const blob = new Blob([dataView], { type: mimeString });
//   return blob;
// }

const formatStorageKey = (key) => `storage_data_${key}`;

export class ApiConfig {
  constructor(
    maxReceiversPullSize,
    maxSendersPullSize,
    pullCallback = null,
    errorCallback = null,
    loggingEnabled = false
  ) {
    this.loggingEnabled = loggingEnabled;
    this.maxReceiversPullSize = maxReceiversPullSize;
    this.maxSendersPullSize = maxSendersPullSize;
    this.pullCallback = pullCallback;
    this.errorCallback = errorCallback;
  }
}

export default class Api {
  // Constructs an API from a config
  constructor(api,config) {
    this.loggingEnabled = config.loggingEnabled;
    this.config = config;
    this.api = api;
    this.externalAccountSigner = null;
    this.maxReceiversPullSize = this.config.maxReceiversPullSize;
    this.maxSendersPullSize = this.config.maxSendersPullSize;
    this.txResHandler = null;
    this.pullCallback = this.config.pullCallback;
    this.errorCallback = this.config.errorCallback;
  }

  _log(message) {
    if (this.loggingEnabled) {
      console.log('[INFO]: '+ message);
      console.log(performance.now());
    }
  }

  // Sets the transaction result handler to `txResHandler`.
  setTxResHandler = (txResHandler) => {
    this.txResHandler = txResHandler;
  };

  // Sets the externalAccountSigner to `signer`.
  setExternalAccountSigner = (signer) => {
    this.externalAccountSigner = signer;
  };

  // Converts an `outgoing note` into a JSON object.
  _outgoing_note_to_json(note) {
    // [[u8; 32], 2]
    const ciphertext = note.ciphertext;
    const cipher0 = Array.from(ciphertext[0]);
    const cipher1 = Array.from(ciphertext[1]);
    return {
      ephemeral_public_key: Array.from(u8aToU8a(note.ephemeral_public_key)),
      ciphertext: [cipher0, cipher1]
    };
  }

  // Converts an `light incoming note` into a JSON object.
  _light_incoming_note_to_json(note) {
    // [[u8; 32], 3]
    const ciphertext = note.ciphertext;
    const cipher0 = Array.from(ciphertext[0]);
    const cipher1 = Array.from(ciphertext[1]);
    const cipher2 = Array.from(ciphertext[2]);
    return {
      ephemeral_public_key: Array.from(u8aToU8a(note.ephemeral_public_key)),
      ciphertext: [cipher0, cipher1, cipher2]
    };
  }

  // Converts an `incoming note` into a JSON object.
  _incoming_note_to_json(note) {
    // [[u8; 32]; 3]
    const ciphertext = note.ciphertext;
    const cipher0 = Array.from(ciphertext[0]);
    const cipher1 = Array.from(ciphertext[1]);
    const cipher2 = Array.from(ciphertext[2]);
    return {
      ephemeral_public_key: Array.from(
        u8aToU8a(note.ephemeral_public_key)
      ),
      tag: Array.from(u8aToU8a(note.tag)),
      ciphertext: [cipher0, cipher1, cipher2]
    };
  }

  // Converts an `full incoming note` into a JSON object.
  _full_incoming_note_to_jons(note) {
    return {
      address_partition: note.address_partition,
      incoming_note: this._incoming_note_to_json(note.incoming_note),
      light_incoming_note: this._light_incoming_note_to_json(note.light_incoming_note),
    };
  }

  // Converts an `utxo` into a JSON object.
  _utxo_to_json(utxo) {
    const asset_id = Array.from(u8aToU8a(utxo.public_asset.id));
    const asset_value = Array.from(u8aToU8a(utxo.public_asset.value));
    return {
      is_transparent: utxo.is_transparent,
      public_asset: {
        id: asset_id,
        value: asset_value,
      },
      commitment: Array.from(u8aToU8a(utxo.commitment))
    };
  }

  // Pulls data from the ledger from the `checkpoint` or later, returning the new checkpoint.
  async pull(checkpoint) {
    try {
      await this.api.isReady;

      this._log('checkpoint ' + JSON.stringify(checkpoint));
      let result = await this.api.rpc.mantaPay.dense_pull_ledger_diff(
        checkpoint,
        this.maxReceiversPullSize,
        this.maxSendersPullSize
      );

      this._log('pull result ' + JSON.stringify(result));

      const decodedReceivers = $Receivers.decode(
        base64Decode(result.receivers.toString())
      );
      $.assert($Receivers, decodedReceivers);
      const receivers = decodedReceivers.map((receiver) => {
        return [
          this._utxo_to_json(receiver[0]),
          this._full_incoming_note_to_jons(receiver[1])
        ];
      });

      const decodedSenders = $Senders.decode(
        base64Decode(result.senders.toString())
      );
      $.assert($Senders, decodedSenders);
      const senders = decodedSenders.map((sender) => {
        return [
          Array.from(u8aToU8a(sender[0])),
          this._outgoing_note_to_json(sender[1]),
        ];
      });
      
      if (this.pullCallback) {
        this.pullCallback(
          receivers,
          senders,
          checkpoint.sender_index,
          result.sender_recievers_total.toNumber()
        );
      }
      const pull_result = {
        should_continue: result.should_continue.isTrue,
        receivers: receivers,
        senders: senders,
      };
      this._log('pull response: ' + JSON.stringify(pull_result));
      return pull_result;
    } catch (err) {
      if (this.errorCallback) {
        this.errorCallback();
      }
    }
  }

  // Maps a transfer post object to its corresponding MantaPay extrinsic.
  async _map_post_to_transaction(post) {
    let sources = post.sources.length;
    let senders = post.sender_posts.length;
    let receivers = post.receiver_posts.length;
    let sinks = post.sinks.length;
    if (sources == 1 && senders == 0 && receivers == 1 && sinks == 0) {
      const mint_tx = await this.api.tx.mantaPay.toPrivate(post);
      return mint_tx;
    } else if (sources == 0 && senders == 2 && receivers == 2 && sinks == 0) {
      const private_transfer_tx = await this.api.tx.mantaPay.privateTransfer(
        post
      );
      return private_transfer_tx;
    } else if (sources == 0 && senders == 2 && receivers == 1 && sinks == 1) {
      const reclaim_tx = await this.api.tx.mantaPay.toPublic(post);
      return reclaim_tx;
    } else {
      throw new Error(
        'Invalid transaction shape; there is no extrinsic for a transaction' +
          `with ${sources} sources, ${senders} senders, ` +
          ` ${receivers} receivers and ${sinks} sinks`
      );
    }
  }

  // Sends a set of transfer posts (i.e. "transactions") to the ledger.
  async push(posts) {
    await this.api.isReady;
    const transactions = [];
    for (let post of posts) {
      const transaction = await this._map_post_to_transaction(post);
      transactions.push(transaction);
    }
    try {
      const batchTx = await this.api.tx.utility.batch(transactions);
      this._log('Batch Transaction: '+ batchTx);
      const signResult = await batchTx.signAndSend(this.externalAccountSigner, this.txResHandler);
      this._log('Result: ' + signResult);
      return { Ok: SUCCESS };
    } catch (err) {
      console.error(err);
      return { Ok: FAILURE };
    }
  }

  /**
   * storage data to local
   * @param {String} key `${network.toString()}`
   * @param {Blob} data
   * @returns {Promise<Object>}
   */
  async saveStorageDataToLocal(key, data) {
    // in Extension, this api will be: chrome.storage.local.set
    // will encrypt data with a user key
    const reader = new FileReader();
    return new Promise((resolve) => {
      try {
        reader.addEventListener('load', () => {
          localStorage.setItem(formatStorageKey(key), reader.result);
          resolve({Ok: SUCCESS});
        });
        reader.addEventListener('error', () => {
          resolve({Ok: FAILURE});
        });
        // Read the contents of the specified Blob or File
        reader.readAsDataURL(data);
      } catch (ex) {
        resolve({Ok: FAILURE});
      }
    });
  }

  /**
   * read storage data from local
   * @param {String} key `${network.toString()}`
   * @returns {String}
   */
  async loadStorageDataFromLocal(key) {
    // in Extension, this api will be: chrome.storage.local.get
    // will decrypt data with a user key
    return localStorage.getItem(formatStorageKey(key)) || null;
  }
}

export const SUCCESS = 'success';
export const FAILURE = 'failure';

const $Asset = $.object(
  $.field('id', $.sizedUint8Array(32)),
  $.field('value', $.sizedUint8Array(16))
);

const $Utxo = $.object(
  $.field('is_transparent', $.bool),
  $.field('public_asset', $Asset),
  $.field('commitment', $.sizedUint8Array(32))
);

const $IncomingNote = $.object(
  $.field('ephemeral_public_key', $.sizedUint8Array(32)),
  $.field('tag', $.sizedUint8Array(32)),
  $.field('ciphertext', $.sizedArray($.sizedUint8Array(32), 3))
);

const $LightIncomingNote = $.object(
  $.field('ephemeral_public_key', $.sizedUint8Array(32)),
  $.field('ciphertext', $.sizedArray($.sizedUint8Array(32), 3))
);

const $FullIncomingNote = $.object(
  $.field('address_partition', $.u8),
  $.field('incoming_note', $IncomingNote),
  $.field('light_incoming_note', $LightIncomingNote)
);

const $OutgoingNote = $.object(
  $.field('ephemeral_public_key', $.sizedUint8Array(32)),
  $.field('ciphertext', $.sizedArray($.sizedUint8Array(32), 2))
);

export const $Receivers = $.array($.tuple($Utxo, $FullIncomingNote));
export const $Senders = $.array($.tuple($.sizedUint8Array(32), $OutgoingNote));

// Polkadot-JS Ledger Integration

// Polkadot-JS Ledger API

import {Struct, Tuple, u128, u8, Vector, bool} from "scale-ts";
import {base64Decode} from "@polkadot/util-crypto";

export class ApiConfig {
  constructor(
    maxReceiversPullSize,
    maxSendersPullSize,
    pullCallback = null,
    errorCallback = null
  ) {
    this.maxReceiversPullSize = maxReceiversPullSize;
    this.maxSendersPullSize = maxSendersPullSize;
    this.pullCallback = pullCallback;
    this.errorCallback = errorCallback;
  }
}

export default class Api {
  // Constructs an API from a config
  constructor(api,config) {
    this.config = config;
    this.api = api;
    this.externalAccountSigner = null;
    this.maxReceiversPullSize = this.config.maxReceiversPullSize;
    this.maxSendersPullSize = this.config.maxSendersPullSize;
    this.txResHandler = null;
    this.pullCallback = this.config.pullCallback;
    this.errorCallback = this.config.errorCallback;
  }

  // Sets the transaction result handler to `txResHandler`.
  setTxResHandler = (txResHandler) => {
    this.txResHandler = txResHandler;
  };

  // Sets the externalAccountSigner to `signer`.
  setExternalAccountSigner = (signer) => {
    this.externalAccountSigner = signer;
  }

  // Converts an `outgoing note` into a JSON object.
  _outgoing_note_to_json(note) {
    // [u8; 64] -> [[u8; 32], 2]
    const ciphertext = note.ciphertext.toU8a();
    const cipher0 = Array.from(ciphertext.slice(0, 32));
    const cipher1 = Array.from(ciphertext.slice(32, 64));
    return {
      ephemeral_public_key: Array.from(note.ephemeral_public_key.toU8a()),
      ciphertext: [cipher0, cipher1]
    }
  }

  // Converts an `light incoming note` into a JSON object.
  _light_incoming_note_to_json(note) {
    const ciphertext = note.ciphertext.toU8a(); // hex to u8 array
    const cipher0 = Array.from(ciphertext.slice(0, 32));
    const cipher1 = Array.from(ciphertext.slice(32, 64));
    const cipher2 = Array.from(ciphertext.slice(64, 96));
    return {
      ephemeral_public_key: Array.from(note.ephemeral_public_key.toU8a()),
      ciphertext: [cipher0, cipher1, cipher2]
    };
  }

  // Converts an `incoming note` into a JSON object.
  _incoming_note_to_json(note) {
    // hex -> [u8; 96] -> [[u8; 32]; 3]
    const ciphertext = note.ciphertext.toU8a();
    const cipher0 = Array.from(ciphertext.slice(0, 32));
    const cipher1 = Array.from(ciphertext.slice(32, 64));
    const cipher2 = Array.from(ciphertext.slice(64, 96));
    return {
      ephemeral_public_key: Array.from(
        note.ephemeral_public_key.toU8a()
      ),
      tag: Array.from(note.tag.toU8a()),
      ciphertext: [cipher0, cipher1, cipher2]
    }
  }

  // Converts an `full incoming note` into a JSON object.
  _full_incoming_note_to_jons(note) {
    return {
      address_partition: note.address_partition.toNumber(),
      incoming_note: this._incoming_note_to_json(note.incoming_note),
      light_incoming_note: this._light_incoming_note_to_json(note.light_incoming_note),
    }
  }

  // Converts an `utxo` into a JSON object.
  _utxo_to_json(utxo) {
    const asset_id = Array.from(utxo.public_asset.id.toU8a()); // hex -> [u8; 32]
    const asset_value = Array.from(utxo.public_asset.value.toU8a()); // to [u8; 16]
    return {
      is_transparent: utxo.is_transparent,
      public_asset: {
        id: asset_id,
        value: asset_value,
      },
      commitment: Array.from(utxo.commitment.toU8a())
    };
  }

  // Pulls data from the ledger from the `checkpoint` or later, returning the new checkpoint.
  async pull(checkpoint) {
    try {
      await this.api.isReady;
      console.log('checkpoint', checkpoint);
      let result = await this.api.rpc.mantaPay.dense_pull_ledger_diff(
        checkpoint,
        this.maxReceiversPullSize,
        this.maxSendersPullSize
      );

      console.log('pull result', JSON.stringify(result));

      const receivers = receiver_spec.dec(base64Decode(result.receivers.toString())).map((r) => {
        return [r[0], r[1]];
      });
      const senders = sender_spec.dec(base64Decode(result.senders.toString())).map((s) => {
          return [s[0], s[1]];
      })
      if (this.pullCallback) {
        this.pullCallback(
          receivers,
          senders,
          checkpoint.sender_index,
          result.sender_recievers_total.toNumber()
        );
      }
      const pull_result = {
        should_continue: result.should_continue,
        receivers: receivers,
        senders: senders,
      };
      console.log("pull response:" + JSON.stringify(pull_result));
      return pull_result;
    } catch (err) {
      if (this.errorCallback) {
        this.errorCallback();
      }
      console.error("get a error: ", err);
    }
  }

  // Maps a transfer post object to its corresponding MantaPay extrinsic.
  async _map_post_to_transaction(post) {
    let sources = post.sources.length;
    let senders = post.sender_posts.length;
    let receivers = post.receiver_posts.length;
    let sinks = post.sinks.length;
    if (sources === 1 && senders === 0 && receivers === 1 && sinks === 0) {
        return this.api.tx.mantaPay.toPrivate(post);
    } else if (sources === 0 && senders === 2 && receivers === 2 && sinks === 0) {
        return this.api.tx.mantaPay.privateTransfer(
            post
        );
    } else if (sources === 0 && senders === 2 && receivers === 1 && sinks === 1) {
        return this.api.tx.mantaPay.toPublic(post);
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
      console.log('[INFO] Batch Transaction:', batchTx);
      console.log(
        '[INFO] Result:',
        await batchTx.signAndSend(this.externalAccountSigner, this.txResHandler)
      );
      return { Ok: SUCCESS };
    } catch (err) {
      console.error(err);
      return { Ok: FAILURE };
    }
  }
}

export const SUCCESS = 'success';
export const FAILURE = 'failure';


/// Here's some types spec to parse pull_ledger_diff info from byte array in densely api response.
/// You can match them in manta-config.json.
/// NOTE: maybe we can just use `decodeU8a` in `@polkadot/types-codec` instead of depending on a third party lib.
const utxo_spec = Struct(
    {
        transparency: bool,
        public_asset: Struct({
            id: Vector(u8, 32),
            value: Vector(u8, 16)
        }),
        commitment: Vector(u8, 32)
    }
);

const full_incoming_note_spec = Struct({
    address_partition: u8,
    incoming_note: Struct({
        ephemeral_public_key: Vector(u8, 32),
        tag: Vector(u8, 32),
        ciphertext: Vector(Vector(u8, 32), 3)
    }),
    light_incoming_note: Struct({
        ephemeral_public_key: Vector(u8, 32),
        ciphertext: Vector(Vector(u8, 32), 3)
    })
});

const receiver_spec = Vector(Tuple(utxo_spec, full_incoming_note_spec));

const outgoing_note_spec = Struct({
    ephemeral_public_key: Vector(u8, 32),
    ciphertext: Vector(Vector(u8, 32), 2)
});

const sender_spec = Vector(Tuple(Vector(u8, 32), outgoing_note_spec));
// to avoid error when use JSON.stringify: JSON.stringify() doesn't know how to serialize a BigInt
BigInt.prototype.toJSON = function() {return this.toString(); }
// Polkadot-JS Ledger Integration

// Polkadot-JS Ledger API

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
      console.log('[INFO]: '+message);
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
    // [u8; 64] -> [[u8; 32], 2]
    const ciphertext = note.ciphertext.toU8a();
    const cipher0 = Array.from(ciphertext.slice(0, 32));
    const cipher1 = Array.from(ciphertext.slice(32, 64));
    return {
      ephemeral_public_key: Array.from(note.ephemeral_public_key.toU8a()),
      ciphertext: [cipher0, cipher1]
    };
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
    };
  }

  // Converts an `full incoming note` into a JSON object.
  _full_incoming_note_to_jons(note) {
    return {
      address_partition: note.address_partition.toNumber(),
      incoming_note: this._incoming_note_to_json(note.incoming_note),
      light_incoming_note: this._light_incoming_note_to_json(note.light_incoming_note),
    };
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

      this._log('checkpoint ' + JSON.stringify(checkpoint));
      let result = await this.api.rpc.mantaPay.pull_ledger_diff(
        checkpoint,
        this.maxReceiversPullSize,
        this.maxSendersPullSize
      );

      this._log('pull result ' + JSON.stringify(result));

      const receivers = result.receivers.map((receiver_raw) => {
        return [
          this._utxo_to_json(receiver_raw[0]),
          this._full_incoming_note_to_jons(receiver_raw[1])
        ];
      });
      const senders = result.senders.map((sender_raw) => {
        return [
          Array.from(sender_raw[0].toU8a()),
          this._outgoing_note_to_json(sender_raw[1]),
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
        should_continue: result.should_continue,
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
}

export const SUCCESS = 'success';
export const FAILURE = 'failure';

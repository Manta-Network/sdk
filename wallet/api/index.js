// Polkadot-JS Ledger Integration

// Polkadot-JS Ledger API
export default class Api {
  // Constructs an API from a polkadot-js API.
  constructor(api, externalAccountSigner) {
    this.api = api;
    this.externalAccountSigner = externalAccountSigner;
    this.txResHandler = null;
  }

  // Sets the transaction result handler to `txResHandler`.
  setTxResHandler = (txResHandler) => {
    this.txResHandler = txResHandler;
  }

  // Pulls sender data starting from `checkpoint`.
  async _pull_senders(checkpoint, new_checkpoint) {
    const sender_index = checkpoint.sender_index;
    const entries = await this.api.query.mantaPay.voidNumberSetInsertionOrder.entries();
    const senders = entries
      .map((entry) => Array.from(entry[1].toU8a()))
      .slice(sender_index);
    new_checkpoint.sender_index = sender_index + senders.length;
    return senders;
  }

  // Pulls receiver data starting from `checkpoint`.
  async _pull_receivers(checkpoint, new_checkpoint) {
    const new_receivers = []

    let entries_raw = await this.api.query.mantaPay.shards.entries()
    const entries = entries_raw.map(([storage_key, receiver_raw]) => {
      let map_keys = storage_key.args.map((k) => k.toHuman())
      let shard_index = parseInt(map_keys[0]);
      let receiver_index = parseInt(map_keys[1]);
      const receiver = [
        Array.from(receiver_raw[0].toU8a()),
        this._encrypted_note_to_json(receiver_raw[1])
      ]
      return [shard_index, receiver_index, receiver]
    });

    entries.forEach(([shard_index, receiver_index, receiver]) => {
      if (receiver_index >= checkpoint.receiver_index[shard_index]) {
        new_receivers.push(receiver);
        if (receiver_index >= new_checkpoint.receiver_index[shard_index]) {
          new_checkpoint.receiver_index[shard_index] = receiver_index + 1;
        }
      }
    })

    return new_receivers;
  }

  // Converts an `encrypted_note` into a JSON object.
  _encrypted_note_to_json(encrypted_note) {
    return  {
        ephemeral_public_key: Array.from(encrypted_note.ephemeralPublicKey.toU8a()),
        ciphertext: Array.from(encrypted_note.ciphertext.toU8a()),
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
      const private_transfer_tx = await this.api.tx.mantaPay.privateTransfer(post);
      return private_transfer_tx;
    } else if (sources == 0 && senders == 2 && receivers == 1 && sinks == 1) {
      const reclaim_tx = await this.api.tx.mantaPay.toPublic(post);
      return reclaim_tx;
    } else {
      throw new Error(
        'Invalid transaction shape; there is no extrinsic for a transaction'
            + `with ${sources} sources, ${senders} senders, `
            + ` ${receivers} receivers and ${sinks} sinks`
      );
    }
  }

  // Pulls data from the ledger from the `checkpoint` or later, returning the new checkpoint.
  async pull(checkpoint) {
    await this.api.isReady;
    const new_checkpoint = JSON.parse(JSON.stringify(checkpoint))

    // NOTE: The receiver indices represent the indices into the sharded utxo set. The utxos and
    //       encrypted notes should be pulled from the `Shards` storage structure. For each
    //       index in this array, we start the pull from that index and proceed forward until we
    //       reach the end of that particular shard.
    const receivers = await this._pull_receivers(checkpoint, new_checkpoint);

    // NOTE: The sender index represents the index into the void number set. The void numbers
    //       should be pulled from the `VoidNumberSetInsertionOrder` storage structure starting
    //       from this index.
    const senders = await this._pull_senders(checkpoint, new_checkpoint);

    new_checkpoint.receiver_index = Object.values(new_checkpoint.receiver_index);

    return {
      Ok: {
        should_continue: false,
        checkpoint: new_checkpoint,
        receivers,
        senders,
      }
    };
  }

  // Sends a set of transfer posts (i.e. "transactions") to the ledger (preferably batched).
  async push(posts) {
    await this.api.isReady;
    const transactions = [];
    for (let post of posts) {
      const transaction = await this._map_post_to_transaction(post);
      transactions.push(transaction);
    }
    const batchTx = await this.api.tx.utility.batch(transactions);
    await batchTx.signAndSend(this.externalAccountSigner, this.txResHandler);
    return { Ok: "" };
  }
}

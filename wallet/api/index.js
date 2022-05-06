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

  /*
  // Pulls sender data starting from `checkpoint`.
  async _pull_senders(checkpoint, new_checkpoint) {
    const sender_index = checkpoint.sender_index;
    const entries = await this.api.query.mantaPay.voidNumberSetInsertionOrder.entries();
    const senders = entries
      .map((storageItem) => Array.from(storageItem[1].toU8a()))
      .slice(sender_index);
    new_checkpoint.sender_index = sender_index + senders.length;
    return senders;
  }

  // Pulls receiver data starting from `checkpoint`.
  async _pull_receivers(checkpoint, new_checkpoint) {
    let receivers = [];
    for (const shard_index in checkpoint.receiver_index) {
      const single_shard_receivers = await this._pull_receivers_single_shard(shard_index, checkpoint, new_checkpoint);
      receivers = [...receivers, ...single_shard_receivers];
    }
    return receivers;
  }

  // Pulls all the receiver data from a single shard.
  async _pull_receivers_single_shard(shard_index, checkpoint, new_checkpoint) {
    let new_receivers = [];
    let receivers = [];
    const receiver_index = checkpoint.receiver_index[shard_index];
    const shard = await api.query.mantaPay.shards.entries(shard_index);
    receivers = shard
      .slice(receiver_index)
      .map((entry) => [Array.from(entry[1][0].toU8a()), this._encrypted_note_to_json(entry[1][1])]);
    new_receivers = [...receivers, ...new_receivers];
    new_checkpoint.receiver_index[shard_index] = receiver_index + receivers.length;
    return new_receivers;
  }

  // Converts an `encrypted_note` into a JSON object.
  _encrypted_note_to_json(encrypted_note) {
    return  {
        ephemeral_public_key: Array.from(encrypted_note.ephemeralPublicKey.toU8a()),
        ciphertext: Array.from(encrypted_note.ciphertext.toU8a()),
    }
  }
  */

  // Pulls data from the ledger from the `checkpoint` or later, returning the new checkpoint.
  async pull(checkpoint) {
    await this.api.isReady;

    /*
    const new_checkpoint = { receiver_index: {}, sender_index: null };
    
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
    */

    console.log(checkpoint);
    let result = await this.api.rpc.mantaPayPull(checkpoint);
    console.log(result);
    result
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
      console.log("[INFO] Batch Transaction:", batchTx);
      console.log("[INFO] Result:", await batchTx.signAndSend(this.externalAccountSigner, this.txResHandler));
      return { Ok: SUCCESS };
    } catch(err) {
      console.error(err);
      return { Ok: FAILURE }
    }
  }
}

export const SUCCESS = "success";
export const FAILURE = "failure";

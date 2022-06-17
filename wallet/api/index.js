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

  // Converts an `encrypted_note` into a JSON object.
  _encrypted_note_to_json(encrypted_note) {
    return  {
        ephemeral_public_key: Array.from(encrypted_note.ephemeralPublicKey.toU8a()),
        ciphertext: Array.from(encrypted_note.ciphertext.toU8a()),
    }
  }


  // Pulls data from the ledger from the `checkpoint` or later, returning the new checkpoint.
  // async pull(checkpoint) {
  //   await this.api.isReady;
  //   console.log('checkpoint', checkpoint);
  //   let result = await this.api.rpc.mantaPay.pull_ledger_diff(checkpoint);
  //   console.log('pull result', result);
  //   const receivers = result.receivers.map(receiver_raw => {
  //     return [
  //     Array.from(receiver_raw[0].toU8a()),
  //     this._encrypted_note_to_json(receiver_raw[1])
  //   ]});
  //   const senders = result.senders.map(sender_raw => {
  //     return Array.from(sender_raw.toU8a());
  //   });
  //   return { should_continue: result.should_continue, receivers: receivers, senders: senders };
  // }

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

  stringToInt = (str) => {
    return parseInt(str.replace(',', ''))
  }

  storageKeyToInt = (key) => {
    return this.stringToInt(key.toHuman()[0])
  }

  _sort_senders = (a, b) => {
    return this.storageKeyToInt(a[0]) > this.storageKeyToInt(b[0]) ? 1 : -1
  }

  // Pulls sender data starting from `checkpoint`.
  async _pull_senders(checkpoint, new_checkpoint, block_hash) {
    const sender_index = checkpoint.sender_index;
    const entries = await this.api.query.mantaPay.voidNumberSetInsertionOrder.entriesAt(block_hash);
    const senders = entries
      .sort(this._sort_senders)
      .map((entry) => Array.from(entry[1].toU8a()))
      .slice(sender_index);
    new_checkpoint.sender_index = sender_index + senders.length;
    return senders;
  }

  _sort_receivers = (a, b) => {
    const [a_shard_index, a_receiver_index] = a[0].toHuman().map(string => this.stringToInt(string));
    const [b_shard_index, b_receiver_index] = b[0].toHuman().map(string => this.stringToInt(string));
    if (a_shard_index > b_shard_index) {
      return 1
    } else if (a_shard_index === b_shard_index && a_receiver_index > b_receiver_index) {
      return 1
    }
    return -1
  }

  // Pulls receiver data starting from `checkpoint`.
  async _pull_receivers(checkpoint, new_checkpoint, block_hash) {
    const new_receivers = []
    let entries_raw = await this.api.query.mantaPay.shards.entriesAt(block_hash)
    entries_raw.sort(this._sort_receivers);
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

    // Pulls data from the ledger from the `checkpoint` or later, returning the new checkpoint.
    async pull(checkpoint) {
      await this.api.isReady;
      const new_checkpoint = JSON.parse(JSON.stringify(checkpoint))
      const block_hash = await this.api.rpc.chain.getBlockHash()
      const receivers = await this._pull_receivers(checkpoint, new_checkpoint, block_hash);
      const senders = await this._pull_senders(checkpoint, new_checkpoint, block_hash);
      new_checkpoint.receiver_index = Object.values(new_checkpoint.receiver_index);
      return {
          should_continue: false,
          receivers: receivers,
          senders: senders
      };
    }

    // Sign and send a single batch
    async _push_batch(batch) {
      console.log("[INFO] Batch: ", batch);
      try {
        const batchTx = await this.api.tx.utility.batch(batch);
        console.log("[INFO] Batch Transaction: ", batchTx);
        await batchTx.signAndSend(this.externalAccountSigner, this.txResHandler);
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    }

}

export const SUCCESS = "success";
export const FAILURE = "failure";

// Polkadot-JS Ledger Integration

// Polkadot-JS Ledger API

export class ApiConfig {
  constructor(
    api,
    externalAccountSigner,
    maxReceiversPullSize,
    maxSendersPullSize,
    pullCallback = null,
    errorCallback = null
  ) {
    this.api = api;
    this.externalAccountSigner = externalAccountSigner;
    this.maxReceiversPullSize = maxReceiversPullSize;
    this.maxSendersPullSize = maxSendersPullSize;
    this.pullCallback = pullCallback;
    this.errorCallback = errorCallback;
  }
}

export default class Api {
  // Constructs an API from a config
  constructor(config) {
    this.config = config;
    this.api = this.config.api;
    this.externalAccountSigner = this.config.externalAccountSigner;
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

  // Converts an `encrypted_note` into a JSON object.
  _encrypted_note_to_json(encrypted_note) {
    return {
      ephemeral_public_key: Array.from(
        encrypted_note.ephemeral_public_key.toU8a()
      ),
      ciphertext: Array.from(encrypted_note.ciphertext.toU8a()),
    };
  }

  // Pulls data from the ledger from the `checkpoint` or later, returning the new checkpoint.
  async pull(checkpoint) {
    try {
      await this.api.isReady;
      console.log('checkpoint', checkpoint);
      let result = await this.api.rpc.mantaPay.pull_ledger_diff(
        checkpoint,
        this.maxReceiversPullSize,
        this.maxSendersPullSize
      );

      console.log('pull result', result);

      const voidNumberSetSize = await api.query.mantaPay.voidNumberSetSize();
      let senders_receivers_total = voidNumberSetSize.toNumber();
      const shardTreeEntries = await api.query.mantaPay.shardTrees.entries();
      if (shardTreeEntries && shardTreeEntries.length > 0) {
        shardTreeEntries.forEach(entry => {
          senders_receivers_total += entry[1].current_path.leaf_index.toNumber();
        })
      }

      const receivers = result.receivers.map((receiver_raw) => {
        return [
          Array.from(receiver_raw[0].toU8a()),
          this._encrypted_note_to_json(receiver_raw[1]),
        ];
      });
      const senders = result.senders.map((sender_raw) => {
        return Array.from(sender_raw.toU8a());
      });
      if (this.pullCallback) {
        this.pullCallback(
          receivers,
          senders,
          checkpoint.sender_index,
          senders_receivers_total
        );
      }
      return {
        should_continue: result.should_continue,
        receivers: receivers,
        senders: senders,
      };
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


  convertToOldPost(post) {
    // need to iterate over all receiverPosts and convert EncryptedNote from new
    // format of EncryptedNote { header: (), Ciphertext {...} } to old format:
    // EncryptedNote { ephermeral_public_key: [], ciphertext: [] }

    let postCopy = JSON.parse(JSON.stringify(post));
    postCopy.receiver_posts.map(x => {x.encrypted_note = x.encrypted_note.ciphertext});
    return postCopy
  }

  // Sends a set of transfer posts (i.e. "transactions") to the ledger.
  async push(posts) {
    await this.api.isReady;
    const transactions = [];
    for (let post of posts) {
      let convertedPost = this.convertToOldPost(post);
      const transaction = await this._map_post_to_transaction(convertedPost);
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

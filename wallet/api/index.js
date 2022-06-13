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
        ephemeral_public_key: Array.from(encrypted_note.ephemeral_public_key.toU8a()),
        ciphertext: Array.from(encrypted_note.ciphertext.toU8a()),
    }
  }

  // Pulls data from the ledger from the `checkpoint` or later, returning the new checkpoint.
  async pull(checkpoint) {
    await this.api.isReady;
    console.log(checkpoint);
    let result = await this.api.rpc.mantaPay.pull_ledger_diff(checkpoint);
    console.log(result);
    const result2 = { should_continue: result.should_continue, receivers: result.receivers.map(receiver_raw => { 
      console.log('receiver_raw: ' + receiver_raw);
      return [
      Array.from(receiver_raw[0].toU8a()),
      this._encrypted_note_to_json(receiver_raw[1])
    ];
  }), senders: result.senders.map(sender_raw => { 
    console.log('sender_raw: ' + sender_raw);
    return Array.from(sender_raw.toU8a());}) };
    console.log('result2: ' + result2);
    return result2;
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

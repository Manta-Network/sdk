import BN from 'bn.js';
import { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import { base58Decode, decodeAddress } from '@polkadot/util-crypto';
import { bnToU8a } from '@polkadot/util';
import type {
  Address,
  PalletName,
  Network,
  SignedTransaction,
} from '../interfaces';
import { NATIVE_TOKEN_ASSET_ID, PRIVATE_ASSET_PREFIX } from '../constants';

/// Convert a private address to JSON.
export function convertZkAddressToJson(address: string) {
  const bytes = base58Decode(address);
  return JSON.stringify({
    receiving_key: Array.from(bytes),
  });
}

export async function mapPostToTransaction(
  palletName: PalletName,
  api: ApiPromise,
  post: any,
): Promise<SubmittableExtrinsic<'promise', any>> {
  if (palletName === 'mantaPay') {
    const sources = post.sources.length;
    const senders = post.sender_posts.length;
    const receivers = post.receiver_posts.length;
    const sinks = post.sinks.length;

    if (sources == 1 && senders == 0 && receivers == 1 && sinks == 0) {
      const mintTx = await api.tx.mantaPay.toPrivate(post);
      return mintTx;
    } else if (sources == 0 && senders == 2 && receivers == 2 && sinks == 0) {
      const privateTransferTx = await api.tx.mantaPay.privateTransfer(post);
      return privateTransferTx;
    } else if (sources == 0 && senders == 2 && receivers == 1 && sinks == 1) {
      const reclaimTx = await api.tx.mantaPay.toPublic(post);
      return reclaimTx;
    } else {
      throw new Error(
        'Invalid transaction shape; there is no extrinsic for a transaction' +
          `with ${sources} sources, ${senders} senders, ` +
          ` ${receivers} receivers and ${sinks} sinks`,
      );
    }
  }
}

/// Returns the metadata for an asset with a given `assetId` for the currently
/// connected network.
export async function getAssetMetadata(
  api: ApiPromise,
  assetId: BN,
  network: Network,
): Promise<any> {
  const data: any = await api.query.assetManager.assetIdMetadata(assetId);
  const json = JSON.stringify(data.toHuman());
  const jsonObj = JSON.parse(json);
  // Dolphin is equivalent to Calamari on-chain, and only appears differently at UI level
  // so it is necessary to set its symbol and name manually
  if (network === 'Dolphin' && assetId.toString() === NATIVE_TOKEN_ASSET_ID) {
    jsonObj.metadata.symbol = 'DOL';
    jsonObj.metadata.name = 'Dolphin';
  }
  return jsonObj;
}

/// Builds the "ToPrivate" transaction in JSON format to be signed.
export function toPrivateBuildUnsigned(
  wasm: any,
  assetId: BN,
  amount: BN,
): any {
  const assetIdArray = bnToU8a(assetId, { bitLength: 256 });
  const txJson = `{ "ToPrivate": { "id": [${assetIdArray}], "value": ${amount.toString()} }}`;
  const transaction = wasm.Transaction.from_string(txJson);
  return { transaction };
}

/// private transfer transaction
export async function privateTransferBuildUnsigned(
  wasm: any,
  api: ApiPromise,
  assetId: BN,
  amount: BN,
  toZkAddress: Address,
  network: Network,
): Promise<any> {
  const addressJson = convertZkAddressToJson(toZkAddress);
  const assetIdArray = bnToU8a(assetId, { bitLength: 256 });
  const txJson = `{ "PrivateTransfer": [{ "id": [${assetIdArray}], "value": ${amount.toString()} }, ${addressJson} ]}`;
  const transaction = wasm.Transaction.from_string(txJson);
  const jsonObj = await getAssetMetadata(api, assetId, network);
  const decimals = jsonObj['metadata']['decimals'];
  const symbol = jsonObj['metadata']['symbol'];
  const assetMetadataJson = `{ "token_type": {"FT": ${decimals}}, "symbol": "${PRIVATE_ASSET_PREFIX}${symbol}" }`;
  return {
    transaction,
    assetMetadataJson,
  };
}

/// Builds the "ToPublic" transaction in JSON format to be signed.
export async function toPublicBuildUnsigned(
  wasm: any,
  api: ApiPromise,
  assetId: BN,
  amount: BN,
  publicAddress: string,
  network: Network,
): Promise<any> {
  const assetIdArray = bnToU8a(assetId, { bitLength: 256 });
  const publicAddressArray = `[${decodeAddress(publicAddress)}]`;
  const txJson = `{ "ToPublic": [{ "id": [${assetIdArray}], "value": ${amount.toString()} }, ${publicAddressArray} ]}`;

  const transaction = wasm.Transaction.from_string(txJson);
  const jsonObj = await getAssetMetadata(api, assetId, network);
  const decimals = jsonObj['metadata']['decimals'];
  const symbol = jsonObj['metadata']['symbol'];
  const assetMetadataJson = `{ "token_type": {"FT": ${decimals}}, "symbol": "${PRIVATE_ASSET_PREFIX}${symbol}" }`;
  return {
    transaction,
    assetMetadataJson,
  };
}

/// Batches transactions.
export async function transactionsToBatches(
  api: ApiPromise,
  transactions: any,
): Promise<SubmittableExtrinsic<'promise', any>[]> {
  const MAX_BATCH = 2;
  const batches = [];
  for (let i = 0; i < transactions.length; i += MAX_BATCH) {
    const transactionsInSameBatch = transactions.slice(i, i + MAX_BATCH);
    const batchTransaction = await api.tx.utility.batch(
      transactionsInSameBatch,
    );
    batches.push(batchTransaction);
  }
  return batches;
}

// convert receiver_posts to match runtime side
export function convertReceiverPost(x: any) {
  const arr1 = x.note.incoming_note.ciphertext.ciphertext.message.flatMap(
    (item: any) => item,
  );
  const tag = x.note.incoming_note.ciphertext.ciphertext.tag;
  const pk = x.note.incoming_note.ciphertext.ephemeral_public_key;
  x.note.incoming_note.tag = tag;
  x.note.incoming_note.ephemeral_public_key = pk;
  x.note.incoming_note.ciphertext = arr1;
  delete x.note.incoming_note.header;

  const lightPk = x.note.light_incoming_note.ciphertext.ephemeral_public_key;
  // ciphertext is [u8; 96] on manta-rs, but runtime side is [[u8; 32]; 3]
  const lightCipher = x.note.light_incoming_note.ciphertext.ciphertext;
  const lightCipher0 = lightCipher.slice(0, 32);
  const lightCipher1 = lightCipher.slice(32, 64);
  const lightCipher2 = lightCipher.slice(64, 96);
  x.note.light_incoming_note.ephemeral_public_key = lightPk;
  x.note.light_incoming_note.ciphertext = [
    lightCipher0,
    lightCipher1,
    lightCipher2,
  ];
  delete x.note.light_incoming_note.header;

  // convert asset value to [u8; 16]
  x.utxo.public_asset.value = new BN(x.utxo.public_asset.value).toArray(
    'le',
    16,
  );

  x.full_incoming_note = x.note;
  delete x.note;
}

// convert sender_posts to match runtime side
export function convertSenderPost(x: any) {
  const pk = x.nullifier.outgoing_note.ciphertext.ephemeral_public_key;
  const cipher = x.nullifier.outgoing_note.ciphertext.ciphertext;
  const cipher0 = cipher.slice(0, 32);
  const cipher1 = cipher.slice(32, 64);
  const outgoing = {
    ephemeral_public_key: pk,
    ciphertext: [cipher0, cipher1],
  };
  x.outgoing_note = outgoing;
  const nullifier = x.nullifier.nullifier.commitment;
  x.nullifier_commitment = nullifier;
  delete x.nullifier;
}

export function formatWasmJson(data: any): any {
  return JSON.parse(
    JSON.stringify(data, (_, value) => {
      if (typeof value === 'bigint') {
        return value.toString();
      } else if (value instanceof Uint8Array) {
        return Array.from(value);
      }
      return value;
    }),
  );
}

/// NOTE: `post` from manta-rs sign result should match runtime side data structure type.
export function transferPost(post: any): any {
  const json = formatWasmJson(post);

  // transfer authorization_signature format
  if (json.authorization_signature && json.authorization_signature.signature) {
    const scalar = json.authorization_signature.signature.scalar;
    const nonce = json.authorization_signature.signature.nonce_point;
    json.authorization_signature.signature = [scalar, nonce];
  }

  // transfer receiver_posts to match runtime side
  json.receiver_posts &&
    json.receiver_posts.map((x: any) => {
      convertReceiverPost(x);
    });

  // transfer sender_posts to match runtime side
  json.sender_posts &&
    json.sender_posts.map((x: any) => {
      convertSenderPost(x);
    });

  return json;
}

export function log(enabled: boolean, message: string, name: string) {
  if (!enabled) {
    return;
  }
  console.log(`[${name}]: ${performance.now().toFixed(4)}, ${message}`);
}

export async function fetchFiles(
  filePrefix: string,
  fileNames: string[],
): Promise<Uint8Array[] | null> {
  const fileList = await Promise.all(
    fileNames.map((name) => fetchFile(`${filePrefix}/${name}`)),
  );
  return fileList;
}

export async function fetchFile(url: string): Promise<Uint8Array | null> {
  try {
    const responseData = await fetch(url);
    const arrayBuffer = await responseData.arrayBuffer();
    const result = new Uint8Array(arrayBuffer);
    return result;
  } catch (ex) {
    console.error(`Fetch ${url}, failed`, ex);
    throw ex;
  }
}

export function wrapWasmError(error: Error | string) {
  return typeof error === 'string' ? new Error(error) : error;
}

export function getLedgerSyncedCount(checkpoint: any) {
  if (!checkpoint) {
    return 0;
  }
  let receiverTotal = 0;
  if (checkpoint.receiver_index instanceof Array) {
    receiverTotal = checkpoint.receiver_index.reduce(
      (total: number, value: number) => total + value,
      0,
    );
  }
  return (checkpoint.sender_index || 0) + (receiverTotal || 0);
}

export async function getSignedTransaction(
  palletName: PalletName,
  api: ApiPromise,
  posts: any[],
): Promise<SignedTransaction> {
  const transactions = [];
  for (let i = 0; i < posts.length; i++) {
    const convertedPost = transferPost(posts[i]);
    const transaction = await mapPostToTransaction(
      palletName,
      api,
      convertedPost,
    );
    transactions.push(transaction);
  }
  const txs = await transactionsToBatches(api, transactions);
  return {
    transactionData: null,
    posts,
    transactions,
    txs,
  };
}

export async function requestData(
  func: () => Promise<any>,
  checkResult?: (value: any) => boolean,
  maxTimes = 3,
  intervalTime = 3000,
) {
  let index = 0;
  let result: any;
  let success = false;
  let error: any;
  while (index < maxTimes) {
    try {
      result = await func();
      if (typeof checkResult === 'function' && !checkResult(result)) {
        throw new Error('Invalid Result');
      }
      success = true;
      break;
    } catch (ex) {
      await new Promise((r) => setTimeout(r, intervalTime));
      error = ex;
      index += 1;
    }
  }
  return { success, result, error };
}

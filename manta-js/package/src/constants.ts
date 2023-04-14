export const PRIVATE_ASSET_PREFIX = 'zk';

export const NATIVE_TOKEN_ASSET_ID = '1';

export const DEFAULT_PULL_SIZE = 4096;

export const MAX_RECEIVERS_PULL_SIZE = DEFAULT_PULL_SIZE;
export const MAX_SENDERS_PULL_SIZE = DEFAULT_PULL_SIZE;

export const EVENT_NAME_WALLET_BUSY = 'EVENT_NAME_WALLET_BUSY';

// 30 Seconds
export const CHECK_WALLET_BUSY_TIMEOUT = 30;

export const PAY_PARAMETER_NAMES = [
  'address-partition-function.dat',
  'group-generator.dat',
  'incoming-base-encryption-scheme.dat',
  'light-incoming-base-encryption-scheme.dat',
  'nullifier-commitment-scheme.dat',
  'outgoing-base-encryption-scheme.dat',
  'schnorr-hash-function.dat',
  'utxo-accumulator-item-hash.dat',
  'utxo-accumulator-model.dat',
  'utxo-commitment-scheme.dat',
  'viewing-key-derivation-function.dat',
];

export const PAY_PROVING_NAMES = [
  'to-private.lfs',
  'private-transfer.lfs',
  'to-public.lfs',
];

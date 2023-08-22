import { interfaces } from 'manta-extension-sdk';
import type { ApiPromise } from '@polkadot/api';
import type { HexString } from '@polkadot/util/types';

import {
  get as getIdbData,
  set as setIdbData,
  del as delIdbData,
} from 'idb-keyval';

// Storage state logics

const storageStateKey = (
  palletName: interfaces.PalletName,
  network: interfaces.Network,
) => `storage_state_${palletName}_${network}`;

export async function saveStorageStateToLocal(
  palletName: interfaces.PalletName,
  network: interfaces.Network,
  data: any,
): Promise<boolean> {
  try {
    await setIdbData(storageStateKey(palletName, network), data);
  } catch (ex) {
    console.error(ex);
    return false;
  }
  return true;
}

export async function getStorageStateFromLocal(
  palletName: interfaces.PalletName,
  network: interfaces.Network,
): Promise<any> {
  let result: string;
  try {
    result = await getIdbData(storageStateKey(palletName, network));
  } catch (ex) {
    console.error(ex);
  }
  return result || null;
}

export async function delStorageState(
  palletName: interfaces.PalletName,
  network: interfaces.Network,
) {
  try {
    await delIdbData(storageStateKey(palletName, network));
  } catch (ex) {
    console.error(ex);
    return false;
  }
  return true;
}

// metadata logics

const metadataKey = 'storage_metadata';

export async function saveMetadataToLocal(
  data: Record<string, HexString>,
): Promise<boolean> {
  try {
    await setIdbData(metadataKey, data);
  } catch (ex) {
    console.error(ex);
    return false;
  }
  return true;
}

export async function getMetadataFromLocal(): Promise<
  Record<string, HexString>
> {
  let result: Record<string, HexString>;
  try {
    result = await getIdbData<Record<string, HexString>>(metadataKey);
  } catch (ex) {
    console.error(ex);
  }
  return result || undefined;
}

// must be called after `await api.isReady`
export async function saveMetaData(api: ApiPromise) {
  const key = `${api.genesisHash.toHex()}-${api.runtimeVersion.specVersion}`;
  const metadata = (await getMetadataFromLocal()) ?? {};
  if (metadata[key]) {
    return true;
  }
  metadata[key] = api.runtimeMetadata.toHex();
  const success = await saveMetadataToLocal(metadata);
  return success;
}

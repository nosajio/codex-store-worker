import { KVNamespace } from '@cloudflare/workers-types';

export async function clearStore(store: KVNamespace): Promise<void> {
  if (!store) {
    throw new TypeError('Store argument required to clear operation');
  }
  const keysToClear = (await store.list({})).keys.map(k => k.name);
  await Promise.all(
    keysToClear.map(k =>
      store
        .delete(k)
        .catch(err => console.error('Cannot delete key: %s \n--\n%s', k, err)),
    ),
  );
  return;
}

export async function saveToStore(
  store: KVNamespace,
  key: string,
  value: string,
): Promise<void> {
  await store.put(key, value);
  return;
}

export async function getFromStore(
  store: KVNamespace,
  key: string,
  defaultValue?: string,
): Promise<string | undefined> {
  const value = await store.get(key);
  if (!value) {
    return defaultValue || undefined;
  }
  return value;
}

export async function bulkSaveToStore(
  store: KVNamespace,
  entries: string[][],
): Promise<void> {
  await Promise.all(entries.map(([k, v]) => saveToStore(store, k, v)));
  return;
}

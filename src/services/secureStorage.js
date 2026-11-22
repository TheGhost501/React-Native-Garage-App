import * as SecureStore from 'expo-secure-store';

// Firebase Auth persists the session through a storage object with async
// getItem / setItem / removeItem. This adapter backs it with expo-secure-store
// (Android Keystore / iOS Keychain) instead of AsyncStorage.
//
// Two SecureStore limits are handled here:
// 1. Keys may only contain [A-Za-z0-9._-]; Firebase keys contain ':' and '['.
// 2. Large values can be rejected, so values are split into chunks.

const CHUNK_SIZE = 1800;

const toSafeKey = (key) => key.replace(/[^A-Za-z0-9._-]/g, '_');
const countKey = (key) => `${toSafeKey(key)}__count`;
const chunkKey = (key, index) => `${toSafeKey(key)}__${index}`;

async function removeItem(key) {
  const count = Number(await SecureStore.getItemAsync(countKey(key))) || 0;
  const deletions = [];
  for (let i = 0; i < count; i += 1) {
    deletions.push(SecureStore.deleteItemAsync(chunkKey(key, i)));
  }
  await Promise.all(deletions);
  await SecureStore.deleteItemAsync(countKey(key));
}

async function setItem(key, value) {
  await removeItem(key);

  const chunks = [];
  for (let i = 0; i < value.length; i += CHUNK_SIZE) {
    chunks.push(value.slice(i, i + CHUNK_SIZE));
  }

  await Promise.all(
    chunks.map((chunk, index) => SecureStore.setItemAsync(chunkKey(key, index), chunk)),
  );
  await SecureStore.setItemAsync(countKey(key), String(chunks.length));
}

async function getItem(key) {
  const count = Number(await SecureStore.getItemAsync(countKey(key))) || 0;
  if (count === 0) {
    return null;
  }

  const chunks = await Promise.all(
    Array.from({ length: count }, (_, index) => SecureStore.getItemAsync(chunkKey(key, index))),
  );

  if (chunks.some((chunk) => chunk === null)) {
    return null;
  }
  return chunks.join('');
}

export const secureStorage = { getItem, setItem, removeItem };

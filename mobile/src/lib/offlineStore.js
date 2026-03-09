import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = 'ba_mobile_cache:';
const QUEUE_KEY = 'ba_mobile_pending_actions';

export async function setCachedValue(key, value) {
  await AsyncStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify({ value, updatedAt: new Date().toISOString() }));
}

export async function getCachedValue(key) {
  const raw = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function enqueuePendingAction(action) {
  const existing = await getPendingActions();
  const next = [{ id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, createdAt: new Date().toISOString(), ...action }, ...existing];
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(next));
  return next;
}

export async function getPendingActions() {
  const raw = await AsyncStorage.getItem(QUEUE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function clearPendingAction(id) {
  const existing = await getPendingActions();
  const next = existing.filter((item) => item.id !== id);
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(next));
  return next;
}

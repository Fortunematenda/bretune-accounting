import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_KEY = 'ba_mobile_access_token';
const REFRESH_KEY = 'ba_mobile_refresh_token';
const USER_KEY = 'ba_mobile_user';

export async function getAccessToken() {
  return AsyncStorage.getItem(ACCESS_KEY);
}

export async function getRefreshToken() {
  return AsyncStorage.getItem(REFRESH_KEY);
}

export async function getStoredUser() {
  const raw = await AsyncStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function setTokens({ accessToken, refreshToken }) {
  const tasks = [];
  if (accessToken) tasks.push(AsyncStorage.setItem(ACCESS_KEY, accessToken));
  if (refreshToken) tasks.push(AsyncStorage.setItem(REFRESH_KEY, refreshToken));
  await Promise.all(tasks);
}

export async function setStoredUser(user) {
  if (!user) {
    await AsyncStorage.removeItem(USER_KEY);
    return;
  }
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function clearTokens() {
  await AsyncStorage.multiRemove([ACCESS_KEY, REFRESH_KEY, USER_KEY]);
}

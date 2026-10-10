
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "@animal_marketplace_token";
const USER_KEY = "@animal_marketplace_user";

// SAVE AUTH
export async function saveAuth(token, user) {
  if (!token) {
    throw new Error("Cannot save empty auth token");
  }

  await AsyncStorage.multiSet([
    [TOKEN_KEY, String(token)],
    [USER_KEY, JSON.stringify(user)],
  ]);
}

// GET TOKEN
export async function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

// GET USER
export async function getUser() {
  const value = await AsyncStorage.getItem(USER_KEY);

  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

// REMOVE TOKEN
export async function removeToken() {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

// CLEAR AUTH
export async function clearAuth() {
  await AsyncStorage.multiRemove([
    TOKEN_KEY,
    USER_KEY,
  ]);
}


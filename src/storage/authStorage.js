import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "animal_marketplace_token";
const USER_KEY = "animal_marketplace_user";

// ============================================
// SAVE AUTH
// ============================================

export async function saveAuth(token, user) {
  if (token) {
    await SecureStore.setItemAsync(
      TOKEN_KEY,
      token
    );
  }

  if (user) {
    await SecureStore.setItemAsync(
      USER_KEY,
      JSON.stringify(user)
    );
  }
}

// ============================================
// SAVE TOKEN
// ============================================

export async function saveToken(token) {
  if (!token) return;

  await SecureStore.setItemAsync(
    TOKEN_KEY,
    token
  );
}

// ============================================
// GET TOKEN
// ============================================

export async function getToken() {
  return await SecureStore.getItemAsync(
    TOKEN_KEY
  );
}

// ============================================
// GET USER
// ============================================

export async function getUser() {
  const value =
    await SecureStore.getItemAsync(USER_KEY);

  return value
    ? JSON.parse(value)
    : null;
}

// ============================================
// REMOVE TOKEN
// ============================================

export async function removeToken() {
  await SecureStore.deleteItemAsync(
    TOKEN_KEY
  );
}

// ============================================
// CLEAR AUTH
// ============================================

export async function clearAuth() {
  await SecureStore.deleteItemAsync(
    TOKEN_KEY
  );

  await SecureStore.deleteItemAsync(
    USER_KEY
  );
}
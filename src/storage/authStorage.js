import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY =
  "@animal_marketplace_token";

const USER_KEY =
  "@animal_marketplace_user";

// =====================================================
// SAVE AUTH
// =====================================================

export async function saveAuth(
  token,
  user
) {
  await AsyncStorage.multiSet([
    [
      TOKEN_KEY,
      token,
    ],
    [
      USER_KEY,
      JSON.stringify(user),
    ],
  ]);
}

// =====================================================
// GET TOKEN
// =====================================================

export async function getToken() {
  return await AsyncStorage.getItem(
    TOKEN_KEY
  );
}

// =====================================================
// GET USER
// =====================================================

export async function getUser() {
  const value =
    await AsyncStorage.getItem(
      USER_KEY
    );

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

// =====================================================
// CLEAR AUTH
// =====================================================

export async function clearAuth() {
  await AsyncStorage.multiRemove([
    TOKEN_KEY,
    USER_KEY,
  ]);
}
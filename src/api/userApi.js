import axios from "axios";

import {
  getToken,
} from "../storage/authStorage";

// =====================================================
// API URL
// =====================================================

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "http://192.168.0.109:5000/api";

// =====================================================
// GET CURRENT USER
// =====================================================

export async function getMe() {
  const token =
    await getToken();

  if (!token) {
    throw new Error(
      "No authentication token"
    );
  }

  const response =
    await axios.get(
      `${API_URL}/auth/me`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.data;
}
import { api } from "./api";

export async function getMe() {
  const response = await api.get("/users/me");
  return response.data;
}

export async function updateMe(data) {
  const response = await api.put("/users/me", data);
  return response.data;
}

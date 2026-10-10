import { api } from "./api";

export async function applySeller(data) {
  const response = await api.post("/sellers/apply", data);
  return response.data;
}

export async function getMySeller() {
  const response = await api.get("/sellers/me");
  return response.data;
}
export async function getDashboardStats() {
  const response = await api.get("/seller/dashboard");
  return response?.data?.data;
}
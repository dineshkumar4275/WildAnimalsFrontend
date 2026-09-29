import { api } from "./api";

export async function createReport(data) {
  const response = await api.post("/reports", data);
  return response.data;
}

import { api } from "./api";

export async function createOrder(listing_id) {
  const response = await api.post("/payments/create-order", { listing_id });
  return response.data;
}

export async function verifyPayment(data) {
  const response = await api.post("/payments/verify", data);
  return response.data;
}

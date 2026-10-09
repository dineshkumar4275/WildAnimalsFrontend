import { api } from "./api";

export async function getListings(params = {}) {
  const response = await api.get("/listings", { params });
  return response.data;
}

export async function getListing(id) {
  const response = await api.get(`/listings/${id}`);
  return response.data;
}

export async function getMyListings() {
  const response = await api.get("/listings/my");
  return response.data;
}

export async function createListing(data) {
  const response = await api.post("/listings", data);
  return response.data;
}

export async function updateListing(id, data) {
  const response = await api.put(`/listings/${id}`, data);
  return response.data;
}

export async function deleteListing(id) {
  const response = await api.delete(`/listings/${id}`);
  return response.data;
}

export async function addFavorite(id) {
  const response = await api.post(`/favorites/${id}`);
  return response.data;
}

export async function removeFavorite(id) {
  const response = await api.delete(`/favorites/${id}`);
  return response.data;
}

export async function getFavorites() {
  const response = await api.get("/favorites");
  return response.data;
}

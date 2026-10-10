import { api } from ".";

export async function getListings(params = {}) {
  return await api.get("/listings", {
    params,
  });
}

export async function getListingById(id) {
  return await api.get(`/listings/${id}`);
}
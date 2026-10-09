import { api } from "./api";

export async function getCloudinarySignature() {
  const response = await api.get("/uploads/cloudinary-signature");
  return response.data;
}

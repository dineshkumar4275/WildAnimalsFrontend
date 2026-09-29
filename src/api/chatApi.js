import { api } from "./api";

export async function createConversation(listing_id) {
  const response = await api.post("/chat/conversations", { listing_id });
  return response.data;
}

export async function getConversations() {
  const response = await api.get("/chat/conversations");
  return response.data;
}

export async function getMessages(id) {
  const response = await api.get(`/chat/conversations/${id}/messages`);
  return response.data;
}

export async function sendMessage(id, message) {
  const response = await api.post(`/chat/conversations/${id}/messages`, {
    message,
  });
  return response.data;
}

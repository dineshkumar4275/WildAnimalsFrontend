
import api from "./api";

/* =========================================================
   GET MESSAGES
   GET /api/messages/:conversationId
========================================================= */

export const getMessages = async (conversationId) => {
  console.log("📨 getMessages() CALLED:", conversationId);

  try {
    if (!conversationId) {
      throw new Error("Conversation ID is required");
    }

    const response = await api.get(
      `/messages/${conversationId}`
    );

    console.log("=================================");
    console.log("📨 GET MESSAGES RESPONSE");
    console.log("RESPONSE:", response);
    console.log("=================================");

    return response || {};
  } catch (error) {
    console.log("=================================");
    console.log("❌ GET MESSAGES ERROR");
    console.log("MESSAGE:", error?.message);
    console.log("STATUS:", error?.response?.status);
    console.log("DATA:", error?.response?.data);
    console.log("=================================");

    throw error;
  }
};

/* =========================================================
   SEND MESSAGE
   POST /api/messages/:conversationId
========================================================= */

export const sendMessage = async (
  conversationId,
  message
) => {
  console.log(
    "📤 sendMessage() CALLED:",
    conversationId,
    message
  );

  try {
    if (!conversationId) {
      throw new Error("Conversation ID is required");
    }

    const cleanMessage = String(
      message || ""
    ).trim();

    if (!cleanMessage) {
      throw new Error("Message is required");
    }

    if (cleanMessage.length > 2000) {
      throw new Error(
        "Message cannot exceed 2000 characters"
      );
    }

    const response = await api.post(
      `/messages/${conversationId}`,
      {
        message: cleanMessage,
      }
    );

    console.log("=================================");
    console.log("📤 SEND MESSAGE RESPONSE");
    console.log("RESPONSE:", response);
    console.log("=================================");

    return response || {};
  } catch (error) {
    console.log("=================================");
    console.log("❌ SEND MESSAGE ERROR");
    console.log("MESSAGE:", error?.message);
    console.log("STATUS:", error?.response?.status);
    console.log("DATA:", error?.response?.data);
    console.log("=================================");

    throw error;
  }
};


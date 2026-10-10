// import api from "./api";

// /* =========================================================
//    GET MY CONVERSATIONS
//    GET /api/conversations
// ========================================================= */

// export const getMyConversations = async () => {
//   try {
//     const response = await api.get("/conversations");

//     console.log(
//       "🔍 RAW CONVERSATIONS API:",
//       JSON.stringify(response.data, null, 2)
//     );

//     const body = response?.data ?? response;

//     const conversations = Array.isArray(body?.conversations)
//       ? body.conversations
//       : Array.isArray(body?.data?.conversations)
//       ? body.data.conversations
//       : Array.isArray(body?.data)
//       ? body.data
//       : Array.isArray(body)
//       ? body
//       : [];

//     console.log(
//       "🔍 FIRST CONVERSATION:",
//       JSON.stringify(conversations[0] ?? null, null, 2)
//     );

//     const total_unread = conversations.reduce((sum, conversation) => {
//       const count =
//         conversation?.unread_count ??
//         conversation?.unreadCount ??
//         conversation?.unread_messages_count ??
//         conversation?.unreadMessagesCount ??
//         0;

//       return sum + Math.max(0, Number(count) || 0);
//     }, 0);

//     console.log("🔔 CALCULATED UNREAD:", total_unread);

//     return {
//       success: true,
//       count: conversations.length,
//       total_unread,
//       conversations,
//     };
//   } catch (error) {
//     console.log(
//       "❌ CONVERSATIONS ERROR:",
//       error?.response?.data || error?.message
//     );
//     throw error;
//   }
// };

// /* =========================================================
//    CREATE / GET CONVERSATION
// ========================================================= */

// export const createOrGetConversation = async (listingId) => {
//   try {
//     if (!listingId) throw new Error("Listing ID is required");

//     const response = await api.post("/conversations", {
//       listing_id: listingId,
//     });

//     return response?.data || response;
//   } catch (error) {
//     console.log("❌ createOrGetConversation error:", error?.message);
//     throw error;
//   }
// };

// /* =========================================================
//    GET MESSAGES IN CONVERSATION
// ========================================================= */

// export const getMessages = async (conversationId) => {
//   try {
//     if (!conversationId) throw new Error("Conversation ID is required");

//     const response = await api.get(`/messages/${conversationId}`);

//     const raw = response?.data || response;

//     let messages = [];

//     if (Array.isArray(raw)) messages = raw;
//     else if (Array.isArray(raw?.messages)) messages = raw.messages;
//     else if (Array.isArray(raw?.data?.messages)) messages = raw.data.messages;
//     else if (Array.isArray(raw?.data)) messages = raw.data;

//     return {
//       success: true,
//       count: messages.length,
//       messages,
//     };
//   } catch (error) {
//     console.log("❌ getMessages error:", error?.message);
//     throw error;
//   }
// };

// /* =========================================================
//    SEND MESSAGE
// ========================================================= */

// export const sendMessage = async (conversationId, message) => {
//   try {
//     if (!conversationId) throw new Error("Conversation ID is required");

//     const cleanMessage = String(message || "").trim();

//     if (!cleanMessage) throw new Error("Message is required");
//     if (cleanMessage.length > 2000) {
//       throw new Error("Message cannot exceed 2000 characters");
//     }

//     const response = await api.post(`/messages/${conversationId}`, {
//       message: cleanMessage,
//     });

//     return response?.data || response;
//   } catch (error) {
//     console.log("❌ sendMessage error:", error?.message);
//     throw error;
//   }
// };

// /* =========================================================
//    MARK CONVERSATION AS READ
// ========================================================= */

// export async function markConversationRead(conversationId) {
//   try {
//     if (!conversationId) throw new Error("Conversation ID required");

//     const response = await api.patch(
//       `/conversations/${conversationId}/read`
//     );

//     return response?.data || response;
//   } catch (error) {
//     console.log(
//       "❌ markConversationRead error:",
//       error?.response?.status,
//       error?.response?.data || error?.message
//     );
//     throw error;
//   }
// }

import api from "./api";

/* =========================================================
   GET MY CONVERSATIONS
   GET /api/conversations
========================================================= */

export const getMyConversations = async () => {
  try {
    const response = await api.get("/conversations");
    const body = response?.data ?? response;

    console.log(
      "🔍 RAW CONVERSATIONS API:",
      JSON.stringify(body, null, 2)
    );

    const conversations = Array.isArray(body)
      ? body
      : Array.isArray(body?.conversations)
      ? body.conversations
      : Array.isArray(body?.data?.conversations)
      ? body.data.conversations
      : Array.isArray(body?.data?.data?.conversations)
      ? body.data.data.conversations
      : Array.isArray(body?.data)
      ? body.data
      : Array.isArray(body?.data?.data)
      ? body.data.data
      : [];

    const serverUnread =
      body?.total_unread ??
      body?.totalUnread ??
      body?.unread_count ??
      body?.unreadCount ??
      body?.data?.total_unread ??
      body?.data?.unread_count ??
      body?.data?.data?.total_unread ??
      body?.data?.data?.unread_count;

    const total_unread =
      serverUnread !== undefined && serverUnread !== null
        ? Math.max(0, Number(serverUnread) || 0)
        : conversations.reduce((total, conversation) => {
            const count =
              conversation?.unread_count ??
              conversation?.unreadCount ??
              conversation?.unread_messages_count ??
              conversation?.unreadMessagesCount ??
              0;

            return total + Math.max(0, Number(count) || 0);
          }, 0);

    console.log("💬 Conversation count:", conversations.length);
    console.log("🔔 Total unread messages:", total_unread);

    if (
      conversations.length > 0 &&
      serverUnread == null &&
      !conversations.some(
        (conversation) =>
          conversation?.unread_count != null ||
          conversation?.unreadCount != null ||
          conversation?.unread_messages_count != null ||
          conversation?.unreadMessagesCount != null
      )
    ) {
      console.warn(
        "⚠️ Backend response has no unread-count field."
      );
    }

    return {
      success: true,
      count: conversations.length,
      total_unread,
      conversations,
    };
  } catch (error) {
    console.log(
      "❌ getMyConversations error:",
      error?.response?.status,
      error?.response?.data || error?.message
    );

    throw error;
  }
};

/* =========================================================
   CREATE / GET CONVERSATION
========================================================= */

export const createOrGetConversation = async (listingId) => {
  try {
    if (!listingId) {
      throw new Error("Listing ID is required");
    }

    const response = await api.post("/conversations", {
      listing_id: listingId,
    });

    return response?.data ?? response;
  } catch (error) {
    console.log(
      "❌ createOrGetConversation error:",
      error?.response?.data || error?.message
    );
    throw error;
  }
};

/* =========================================================
   GET MESSAGES
========================================================= */

export const getMessages = async (conversationId) => {
  try {
    if (!conversationId) {
      throw new Error("Conversation ID is required");
    }

    const response = await api.get(
      `/messages/${conversationId}`
    );

    const raw = response?.data ?? response;

    const messages = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.messages)
      ? raw.messages
      : Array.isArray(raw?.data?.messages)
      ? raw.data.messages
      : Array.isArray(raw?.data)
      ? raw.data
      : [];

    return {
      success: true,
      count: messages.length,
      messages,
    };
  } catch (error) {
    console.log(
      "❌ getMessages error:",
      error?.response?.data || error?.message
    );
    throw error;
  }
};

/* =========================================================
   SEND MESSAGE
========================================================= */

export const sendMessage = async (conversationId, message) => {
  try {
    if (!conversationId) {
      throw new Error("Conversation ID is required");
    }

    const cleanMessage = String(message || "").trim();

    if (!cleanMessage) {
      throw new Error("Message is required");
    }

    if (cleanMessage.length > 2000) {
      throw new Error("Message cannot exceed 2000 characters");
    }

    const response = await api.post(
      `/messages/${conversationId}`,
      {
        message: cleanMessage,
      }
    );

    return response?.data ?? response;
  } catch (error) {
    console.log(
      "❌ sendMessage error:",
      error?.response?.data || error?.message
    );
    throw error;
  }
};

/* =========================================================
   MARK CONVERSATION AS READ
========================================================= */

export async function markConversationRead(conversationId) {
  try {
    if (!conversationId) {
      throw new Error("Conversation ID required");
    }

    const response = await api.patch(
      `/conversations/${conversationId}/read`
    );

    return response?.data ?? response;
  } catch (error) {
    console.log(
      "❌ markConversationRead error:",
      error?.response?.status,
      error?.response?.data || error?.message
    );
    throw error;
  }
}

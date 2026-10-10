import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { getMyConversations } from "../../src/api/chatApi";

export default function Messages() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================================================
     LOAD
  ========================================================= */

  const loadMessages = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getMyConversations();

      let conversations = [];

      if (Array.isArray(response)) {
        conversations = response;
      } else if (Array.isArray(response?.conversations)) {
        conversations = response.conversations;
      } else if (Array.isArray(response?.data?.conversations)) {
        conversations = response.data.conversations;
      } else if (Array.isArray(response?.data)) {
        conversations = response.data;
      }

      setItems(conversations);
    } catch (error) {
      console.log("MESSAGES ERROR:", error?.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadMessages();
    }, [loadMessages])
  );

  /* =========================================================
     HELPERS
  ========================================================= */

  const getPersonName = (item) =>
    item?.other_party ||
    item?.other_user?.name ||
    item?.other_user?.full_name ||
    item?.seller?.name ||
    item?.seller?.full_name ||
    item?.buyer?.name ||
    item?.buyer?.full_name ||
    "Seller";

  const getListingTitle = (item) =>
    item?.title ||
    item?.listing?.title ||
    "Animal listing";

  const getLastMessage = (item) =>
    item?.latest_message?.message ||
    item?.latestMessage?.message ||
    item?.last_message?.message ||
    item?.messages?.[0]?.message ||
    "No messages yet";

  const getPrice = (item) => {
    const price = item?.price || item?.listing?.price || 0;
    const numberPrice = Number(price);

    if (Number.isNaN(numberPrice)) return "₹0";

    return `₹${numberPrice.toLocaleString("en-IN")}`;
  };

  const getTime = (item) => {
    const value =
      item?.latest_message?.created_at ||
      item?.latestMessage?.created_at ||
      item?.updated_at ||
      item?.created_at;

    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    const y = new Date();
    y.setDate(y.getDate() - 1);
    if (date.toDateString() === y.toDateString()) {
      return "yesterday";
    }

    return date.toLocaleDateString([], {
      day: "2-digit",
      month: "short",
    });
  };

  const getUnread = (item) => {
    if (item?.unread_count) return item.unread_count;
    if (item?.unreadCount) return item.unreadCount;
    if (item?.latest_message?.is_read === false) return 1;
    return 0;
  };

  /* =========================================================
     OPEN CHAT — ✅ name + phone pass
  ========================================================= */

  const openConversation = (item) => {
    const conversationId = item?.id || item?.conversation_id;

    if (!conversationId) {
      console.log("❌ CONVERSATION ID MISSING");
      return;
    }

    const name = getPersonName(item);

    // ✅ Seller phone edunga
    const phone =
      item?.seller?.phone ||
      item?.seller?.mobile ||
      item?.other_user?.phone ||
      item?.other_user?.mobile ||
      "";

    console.log("📞 OPEN CHAT:", { id: conversationId, name, phone });

    router.push({
      pathname: "/chat/[id]",
      params: {
        id: String(conversationId),
        name,
        phone,
      },
    });
  };

  /* =========================================================
     RENDER
  ========================================================= */

  const renderConversation = ({ item }) => {
    const personName = getPersonName(item);
    const listingTitle = getListingTitle(item);
    const lastMessage = getLastMessage(item);
    const price = getPrice(item);
    const time = getTime(item);
    const unread = getUnread(item);

    return (
      <Pressable
        onPress={() => openConversation(item)}
        style={({ pressed }) => [
          styles.card,
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {String(personName || "U").charAt(0).toUpperCase()}
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {personName}
            </Text>

            {time ? <Text style={styles.time}>{time}</Text> : null}

            <Ionicons
              name="chevron-forward"
              size={18}
              color="#94A3B8"
            />
          </View>

          <Text style={styles.listing} numberOfLines={1}>
            🐄 {listingTitle}
          </Text>

          <View style={styles.bottomRow}>
            <View style={styles.priceBox}>
              <Text style={styles.price}>{price}</Text>
            </View>

            <View style={styles.chatBadge}>
              <Ionicons
                name="chatbubble-outline"
                size={12}
                color="#16A34A"
              />
              <Text style={styles.chatText}>Chat</Text>
            </View>

            {unread > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unread > 99 ? "99+" : unread}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.lastMessage} numberOfLines={1}>
            {lastMessage}
          </Text>
        </View>
      </Pressable>
    );
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.smallTitle}>
              CONNECT WITH SELLERS
            </Text>
            <Text style={styles.title}>Messages 💬</Text>
          </View>

          <View style={styles.messageIcon}>
            <Ionicons
              name="chatbubbles"
              size={25}
              color="#FFFFFF"
            />
          </View>
        </View>

        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#16A34A" />
          <Text style={styles.loadingText}>
            Loading messages...
          </Text>
        </View>
      </View>
    );
  }

  /* =========================================================
     MAIN
  ========================================================= */

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.smallTitle}>
            CONNECT WITH SELLERS
          </Text>
          <Text style={styles.title}>Messages 💬</Text>
        </View>

        <View style={styles.messageIcon}>
          <Ionicons
            name="chatbubbles"
            size={25}
            color="#FFFFFF"
          />
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item, index) =>
          String(item?.id || item?.conversation_id || index)
        }
        renderItem={renderConversation}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          items.length === 0
            ? styles.emptyContainer
            : styles.list
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="chatbubbles-outline"
                size={44}
                color="#16A34A"
              />
            </View>

            <Text style={styles.emptyTitle}>
              No conversations yet
            </Text>

            <Text style={styles.emptyText}>
              When you contact a seller, your conversations
              will appear here.
            </Text>

            <Pressable
              style={styles.browseButton}
              onPress={() => router.push("/listings")}
            >
              <Ionicons name="paw" size={18} color="#FFFFFF" />
              <Text style={styles.browseText}>
                Find Animals
              </Text>
            </Pressable>
          </View>
        }
      />
    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F8F3" },

  header: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 20,
    borderRadius: 24,
    backgroundColor: "#16A34A",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 5,
  },

  smallTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: "#DCFCE7",
    letterSpacing: 1,
  },

  title: {
    marginTop: 4,
    fontSize: 26,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  messageIcon: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
  },

  list: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 30,
  },

  card: {
    marginBottom: 12,
    padding: 13,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E8F0E8",
  },

  pressed: { opacity: 0.7 },

  avatar: {
    width: 55,
    height: 55,
    borderRadius: 20,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 21,
    fontWeight: "900",
    color: "#16A34A",
  },

  content: {
    flex: 1,
    marginLeft: 12,
    minWidth: 0,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: "900",
    color: "#172033",
  },

  time: {
    marginHorizontal: 7,
    fontSize: 10,
    color: "#94A3B8",
  },

  listing: {
    marginTop: 5,
    fontSize: 11,
    color: "#64748B",
  },

  bottomRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  priceBox: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 9,
    backgroundColor: "#FFF7ED",
  },

  price: {
    fontSize: 13,
    fontWeight: "900",
    color: "#EA580C",
  },

  chatBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 9,
    backgroundColor: "#F0FDF4",
    flexDirection: "row",
    alignItems: "center",
  },

  chatText: {
    marginLeft: 4,
    fontSize: 10,
    fontWeight: "800",
    color: "#16A34A",
  },

  badge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 10,
    backgroundColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },

  lastMessage: {
    marginTop: 7,
    fontSize: 12,
    color: "#64748B",
  },

  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 10,
    color: "#64748B",
    fontWeight: "700",
  },

  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  emptyBox: {
    padding: 25,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    elevation: 3,
  },

  emptyIcon: {
    width: 82,
    height: 82,
    borderRadius: 28,
    backgroundColor: "#F0FDF4",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    marginTop: 16,
    fontSize: 19,
    fontWeight: "900",
    color: "#172033",
  },

  emptyText: {
    marginTop: 7,
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18,
    color: "#64748B",
  },

  browseButton: {
    marginTop: 18,
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 15,
    backgroundColor: "#16A34A",
    flexDirection: "row",
    alignItems: "center",
  },

  browseText: {
    marginLeft: 7,
    color: "#FFFFFF",
    fontWeight: "900",
  },
});
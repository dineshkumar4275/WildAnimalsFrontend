import React, { useCallback, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { getMyConversations } from "../../src/api/chatApi";

const COLORS = {
  primary: "#1F8A47",
  primaryDark: "#166B36",
  background: "#FFFFFF",
  text: "#111827",
  muted: "#8B95A1",
  border: "#EEF1EE",
  searchBg: "#F2F5F2",
  unread: "#22C55E",
};

export default function SellerMessages() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  /* =========================================================
     LOAD
  ========================================================= */

  const loadMessages = useCallback(async (refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else setLoading(true);

      const response = await getMyConversations();

      const conversations =
        Array.isArray(response?.conversations)
          ? response.conversations
          : Array.isArray(response?.data?.conversations)
          ? response.data.conversations
          : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];

      setItems(conversations);
    } catch (err) {
      console.log(
        "SELLER MESSAGES ERROR:",
        err?.response?.data || err?.message
      );
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
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

  const getBuyerName = (item) =>
    item?.other_party ||
    item?.buyer?.name ||
    item?.buyer?.full_name ||
    item?.other_user?.name ||
    item?.other_user?.full_name ||
    item?.buyer_name ||
    "Buyer";

  const getLastMessage = (item) =>
    item?.latest_message?.message ||
    item?.latestMessage?.message ||
    item?.last_message?.message ||
    item?.messages?.[0]?.message ||
    "No messages yet";

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

  const openChat = (item) => {
    const id = item?.id || item?.conversation_id;
    if (!id) return;

    const name = getBuyerName(item);

    // ✅ Buyer phone
    const phone =
      item?.buyer?.phone ||
      item?.buyer?.mobile ||
      item?.other_user?.phone ||
      item?.other_user?.mobile ||
      "";

    console.log("📞 OPEN CHAT:", { id, name, phone });

    router.push({
      pathname: "/chat/[id]",
      params: {
        id: String(id),
        name,
        phone,
      },
    });
  };

  /* =========================================================
     FILTER
  ========================================================= */

  const filtered = search.trim()
    ? items.filter((i) =>
        getBuyerName(i)
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    : items;

  /* =========================================================
     RENDER ITEM
  ========================================================= */

  const renderItem = ({ item }) => {
    const name = getBuyerName(item);
    const lastMsg = getLastMessage(item);
    const time = getTime(item);
    const unread = getUnread(item);

    return (
      <Pressable
        onPress={() => openChat(item)}
        style={({ pressed }) => [
          styles.row,
          pressed && styles.pressed,
        ]}
      >
        {/* AVATAR */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {String(name).charAt(0).toUpperCase()}
          </Text>
        </View>

        {/* CONTENT */}
        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>

            {!!time && (
              <Text style={styles.time}>{time}</Text>
            )}
          </View>

          <View style={styles.bottomRow}>
            <Text style={styles.lastMsg} numberOfLines={1}>
              {lastMsg}
            </Text>

            {unread > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unread > 99 ? "99+" : unread}
                </Text>
              </View>
            )}
          </View>
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
        <Text style={styles.heading}>Chats</Text>

        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </View>
    );
  }

  /* =========================================================
     MAIN
  ========================================================= */

  return (
    <View style={styles.container}>
      {/* HEADING */}
      <Text style={styles.heading}>Chats</Text>

      {/* SEARCH */}
      <View style={styles.searchWrap}>
        <Ionicons
          name="search"
          size={18}
          color={COLORS.muted}
        />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search ..."
          placeholderTextColor={COLORS.muted}
          style={styles.searchInput}
        />
      </View>

      {/* LIST */}
      <FlatList
        data={filtered}
        keyExtractor={(item, index) =>
          String(item?.id || item?.conversation_id || index)
        }
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          filtered.length === 0
            ? styles.emptyContainer
            : styles.list
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadMessages(true)}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="chatbubbles-outline"
                size={38}
                color={COLORS.primary}
              />
            </View>

            <Text style={styles.emptyTitle}>
              No buyer messages yet
            </Text>

            <Text style={styles.emptyText}>
              When buyers contact you about your animals,
              their conversations will appear here.
            </Text>

            <Pressable
              onPress={() =>
                router.push("/(seller)/my-listings")
              }
              style={styles.emptyButton}
            >
              <Ionicons
                name="list"
                size={18}
                color="#FFFFFF"
              />
              <Text style={styles.emptyButtonText}>
                View My Listings
              </Text>
            </Pressable>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 14,
  },

  heading: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.primary,
    paddingHorizontal: 20,
    marginTop: 35,
  },

  /* SEARCH */
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.searchBg,
    marginHorizontal: 20,
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 22,
    marginBottom: 10,
    marginTop: 25,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    paddingVertical: 0,
   
  },

  /* LIST */
  list: {
    paddingTop: 6,
    paddingBottom: 30,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
  },
  pressed: { opacity: 0.6 },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#D6EEDD",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.primaryDark,
  },

  content: {
    flex: 1,
    marginLeft: 13,
    minWidth: 0,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.text,
  },
  time: {
    marginLeft: 8,
    fontSize: 11,
    color: COLORS.muted,
  },

  bottomRow: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  lastMsg: {
    flex: 1,
    fontSize: 13,
    color: COLORS.muted,
  },

  badge: {
    marginLeft: 8,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 10,
    backgroundColor: COLORS.unread,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },

  /* EMPTY */
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  empty: { alignItems: "center" },
  emptyIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#E7F5EC",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
  },
  emptyText: {
    marginTop: 6,
    fontSize: 13,
    color: COLORS.muted,
    textAlign: "center",
    lineHeight: 19,
  },
  emptyButton: {
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  emptyButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
});
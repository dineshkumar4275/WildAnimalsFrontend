import React, { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { getConversations } from "../../src/api/chatApi";
import { COLORS } from "../../src/constants/colors";

export default function Messages() {
  const [items, setItems] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getConversations().then((response) => setItems(response.conversations || [])).catch(() => {});
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Messages</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => router.push(`/chat/${item.id}`)}
          >
            <Text style={styles.name}>{item.other_party || "User"}</Text>
            <Text style={styles.listing}>{item.title}</Text>
            <Text style={styles.price}>₹{Number(item.price || 0).toLocaleString("en-IN")}</Text>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No conversations yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 15,
  },
  card: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
  },
  name: {
    fontSize: 17,
    fontWeight: "800",
  },
  listing: {
    marginTop: 5,
    color: COLORS.muted,
  },
  price: {
    marginTop: 5,
    fontWeight: "700",
  },
  empty: {
    textAlign: "center",
    color: COLORS.muted,
    marginTop: 40,
  },
});

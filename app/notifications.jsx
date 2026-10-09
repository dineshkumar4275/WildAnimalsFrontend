import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { getNotifications } from "../src/api/notificationApi";
import { COLORS } from "../src/constants/colors";

export default function Notifications() {
  const [items, setItems] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getNotifications().then((r) => setItems(r.notifications || [])).catch(() => {});
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, !item.is_read && styles.unread]}>
            <Text style={styles.heading}>{item.title}</Text>
            <Text style={styles.message}>{item.message}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No notifications.</Text>}
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
    fontSize: 27,
    fontWeight: "800",
    marginBottom: 15,
  },
  card: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  unread: {
    borderColor: COLORS.primary,
  },
  heading: {
    fontWeight: "800",
  },
  message: {
    marginTop: 5,
    color: COLORS.muted,
  },
  empty: {
    textAlign: "center",
    color: COLORS.muted,
    marginTop: 30,
  },
});

import React, { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { getMyListings } from "../../src/api/listingApi";
import { COLORS } from "../../src/constants/colors";
import { formatPrice } from "../../src/utils/format";

export default function MyListings() {
  const [items, setItems] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getMyListings().then((r) => setItems(r.listings || [])).catch(() => {});
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Listings</Text>

      <Pressable style={styles.add} onPress={() => router.push("/listing/create")}>
        <Text style={styles.addText}>＋ Add Animal</Text>
      </Pressable>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable style={styles.card}>
            <Text style={styles.name}>{item.title}</Text>
            <Text>{item.category}</Text>
            <Text style={styles.price}>{formatPrice(item.price)}</Text>
            <Text style={styles.status}>{item.status}</Text>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No listings yet.</Text>}
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
  add: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
  },
  addText: {
    color: COLORS.white,
    fontWeight: "800",
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
  price: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 5,
  },
  status: {
    marginTop: 5,
    color: COLORS.primary,
    fontWeight: "700",
  },
  empty: {
    textAlign: "center",
    color: COLORS.muted,
    marginTop: 30,
  },
});

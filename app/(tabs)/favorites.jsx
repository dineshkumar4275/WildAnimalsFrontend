import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, router } from "expo-router";
import { getFavorites } from "../../src/api/listingApi";
import AnimalCard from "../../src/components/AnimalCard";
import { COLORS } from "../../src/constants/colors";

export default function Favorites() {
  const [items, setItems] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getFavorites().then((response) => setItems(response.listings || [])).catch(() => {});
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorites ❤️</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AnimalCard item={item} onPress={() => router.push(`/listing/${item.id}`)} />
        )}
        ListEmptyComponent={<Text style={styles.empty}>No favorites yet.</Text>}
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
  empty: {
    textAlign: "center",
    color: COLORS.muted,
    marginTop: 40,
  },
});

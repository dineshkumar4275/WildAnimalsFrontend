import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { getListings } from "../../src/api/listingApi";
import SearchBar from "../../src/components/SearchBar";
import AnimalCard from "../../src/components/AnimalCard";
import { router } from "expo-router";
import { COLORS } from "../../src/constants/colors";

export default function Search() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const response = await getListings({ q: query });
        setItems(response.listings || []);
      } catch {}
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Animals</Text>
      <SearchBar value={query} onChangeText={setQuery} />

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 15 }}
        renderItem={({ item }) => (
          <AnimalCard item={item} onPress={() => router.push(`/listing/${item.id}`)} />
        )}
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
});

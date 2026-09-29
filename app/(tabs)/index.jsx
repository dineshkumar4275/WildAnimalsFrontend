import React, { useEffect, useState } from "react";
import { Alert, FlatList, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { getListings } from "../../src/api/listingApi";
import { getCategories } from "../../src/api/categoryApi";
import AnimalCard from "../../src/components/AnimalCard";
import CategoryCard from "../../src/components/CategoryCard";
import SearchBar from "../../src/components/SearchBar";
import Loading from "../../src/components/Loading";
import { COLORS } from "../../src/constants/colors";

export default function Home() {
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      const [listingResponse, categoryResponse] = await Promise.all([
        getListings({ q: query, category_id: categoryId || undefined }),
        getCategories(),
      ]);
      setListings(listingResponse.listings || []);
      setCategories(categoryResponse.categories || []);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Unable to load listings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const timer = setTimeout(load, 400);
    return () => clearTimeout(timer);
  }, [query, categoryId]);

  if (loading && listings.length === 0) return <Loading />;

  return (
    <View style={styles.container}>
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Animal Marketplace 🐄</Text>
            <Text style={styles.subtitle}>Find domestic animals near you</Text>

            <SearchBar value={query} onChangeText={setQuery} />

            <Text style={styles.section}>Categories</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <CategoryCard
                name="All"
                selected={!categoryId}
                onPress={() => setCategoryId("")}
              />
              {categories.map((item) => (
                <CategoryCard
                  key={item.id}
                  name={item.name}
                  selected={categoryId === item.id}
                  onPress={() => setCategoryId(item.id)}
                />
              ))}
            </ScrollView>

            <Text style={styles.section}>Latest Listings</Text>
          </>
        }
        renderItem={({ item }) => (
          <AnimalCard
            item={item}
            onPress={() => router.push(`/listing/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No animal listings found.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 25,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: 10,
  },
  subtitle: {
    color: COLORS.muted,
    marginTop: 4,
    marginBottom: 18,
  },
  section: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 22,
    marginBottom: 12,
  },
  empty: {
    textAlign: "center",
    color: COLORS.muted,
    marginTop: 40,
  },
});

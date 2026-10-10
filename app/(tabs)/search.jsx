
import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { getListings } from "../../src/api/listingApi";
import SearchBar from "../../src/components/SearchBar";
import AnimalCard from "../../src/components/AnimalCard";

export default function Search() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchText = query.trim();

    const timer = setTimeout(async () => {
      // ------------------------------------------
      // Empty search
      // ------------------------------------------
      if (!searchText) {
        setItems([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        console.log("=================================");
        console.log("🔎 SEARCH");
        console.log("QUERY:", searchText);
        console.log("API: /listings?q=" + encodeURIComponent(searchText));
        console.log("=================================");

        // IMPORTANT:
        // This calls /api/listings?q=dog
        // NOT /api/listings/search
        const response = await getListings({
          q: searchText,
        });

        console.log("=================================");
        console.log("🔎 SEARCH RESPONSE");
        console.log(response);
        console.log("=================================");

        const listings =
          response?.listings ||
          response?.data?.listings ||
          response?.data ||
          [];

        setItems(Array.isArray(listings) ? listings : []);
      } catch (error) {
        console.log("=================================");
        console.log("❌ SEARCH ERROR");
        console.log("MESSAGE:", error?.message);
        console.log("STATUS:", error?.response?.status);
        console.log("RESPONSE:", error?.response?.data);
        console.log("=================================");

        setItems([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  // ------------------------------------------
  // Open listing details
  // ------------------------------------------
  const openListing = (item) => {
    const listingId = item?.id || item?.listing_id;

    if (!listingId) {
      console.log("❌ LISTING ID MISSING");
      console.log("ITEM:", item);
      return;
    }

    console.log("=================================");
    console.log("➡️ OPEN LISTING");
    console.log("LISTING ID:", listingId);
    console.log("=================================");

    router.push(`/listing/${listingId}`);
  };

  return (
    <View style={styles.container}>
      {/* =====================================================
          HEADER
      ===================================================== */}
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.smallTitle}>
            FIND YOUR PERFECT ANIMAL
          </Text>

          <Text style={styles.title}>
            Search Animals 🔎
          </Text>
        </View>

        <View style={styles.searchIcon}>
          <Ionicons
            name="paw"
            size={24}
            color="#FFFFFF"
          />
        </View>
      </View>

      {/* =====================================================
          SEARCH BAR
      ===================================================== */}
      <View style={styles.searchWrapper}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {/* =====================================================
          SEARCH RESULT INFO
      ===================================================== */}
      {query.trim().length > 0 && (
        <View style={styles.resultHeader}>
          <View style={styles.resultTextContainer}>
            <Text style={styles.resultTitle}>
              Search results
            </Text>

            <Text
              style={styles.resultSub}
              numberOfLines={1}
            >
              Animals matching "{query.trim()}"
            </Text>
          </View>

          {!loading && (
            <View style={styles.resultCount}>
              <Text style={styles.resultCountText}>
                {items.length}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* =====================================================
          LOADING
      ===================================================== */}
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator
            size="large"
            color="#16A34A"
          />

          <Text style={styles.loadingText}>
            Finding animals...
          </Text>
        </View>
      ) : (
        /* ===================================================
           RESULTS
        =================================================== */
        <FlatList
          data={items}
          keyExtractor={(item, index) =>
            String(
              item?.id ||
                item?.listing_id ||
                `search-${index}`
            )
          }
          contentContainerStyle={
            items.length === 0
              ? styles.emptyContainer
              : styles.list
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <AnimalCard
              item={item}
              onPress={() => openListing(item)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name={
                    query.trim().length > 0
                      ? "search-outline"
                      : "search"
                  }
                  size={42}
                  color="#16A34A"
                />
              </View>

              <Text style={styles.emptyTitle}>
                {query.trim().length > 0
                  ? "No animals found"
                  : "Start searching"}
              </Text>

              <Text style={styles.emptyText}>
                {query.trim().length > 0
                  ? "Try another animal name, breed or category."
                  : "Search for cows, goats, dogs, cats and more."}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F8F3",
  },

  /* =========================================================
     HEADER
  ========================================================= */

  header: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 20,
    borderRadius: 24,
    backgroundColor: "#16A34A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 5,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },

  headerTextContainer: {
    flex: 1,
    paddingRight: 10,
  },

  smallTitle: {
    fontSize: 9,
    fontWeight: "800",
    color: "#DCFCE7",
    letterSpacing: 1,
  },

  title: {
    marginTop: 4,
    fontSize: 25,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  searchIcon: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
  },

  /* =========================================================
     SEARCH BAR
  ========================================================= */

  searchWrapper: {
    marginHorizontal: 16,
    marginTop: 14,
  },

  /* =========================================================
     RESULT HEADER
  ========================================================= */

  resultHeader: {
    marginHorizontal: 18,
    marginTop: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  resultTextContainer: {
    flex: 1,
    paddingRight: 10,
  },

  resultTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#172033",
  },

  resultSub: {
    marginTop: 3,
    fontSize: 10,
    color: "#64748B",
  },

  resultCount: {
    minWidth: 35,
    height: 35,
    paddingHorizontal: 9,
    borderRadius: 13,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
  },

  resultCountText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#16A34A",
  },

  /* =========================================================
     LIST
  ========================================================= */

  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 30,
  },

  /* =========================================================
     LOADING
  ========================================================= */

  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 12,
    color: "#64748B",
    fontWeight: "700",
  },

  /* =========================================================
     EMPTY
  ========================================================= */

  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  emptyBox: {
    padding: 25,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
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
});

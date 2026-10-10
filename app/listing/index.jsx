import React, { useCallback, useEffect, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import api from "../../src/api";


// ======================================================
// HELPERS
// ======================================================

const getListingId = (item) => {
  return item?.listing_id || item?.id || item?.listingId || null;
};


const getImageUrl = (item) => {
  if (!item) {
    return null;
  }

  if (item.image_url) {
    return item.image_url;
  }

  if (item.image) {
    if (typeof item.image === "string") {
      return item.image;
    }

    if (item.image?.url) {
      return item.image.url;
    }

    if (item.image?.media_url) {
      return item.image.media_url;
    }
  }

  if (Array.isArray(item.images) && item.images.length > 0) {
    const first = item.images[0];

    if (typeof first === "string") {
      return first;
    }

    return (
      first?.media_url ||
      first?.image_url ||
      first?.url ||
      null
    );
  }

  return null;
};


const getCategoryName = (item) => {
  return (
    item?.category_name ||
    item?.category?.name ||
    item?.category ||
    "Animal"
  );
};


const getBreedName = (item) => {
  return (
    item?.breed_name ||
    item?.breed?.name ||
    item?.breed ||
    ""
  );
};


const getLocationName = (item) => {
  if (item?.location) {
    if (typeof item.location === "string") {
      return item.location;
    }

    return (
      item.location?.area ||
      item.location?.city ||
      item.location?.district ||
      ""
    );
  }

  return (
    item?.area ||
    item?.city ||
    item?.location_name ||
    item?.district ||
    ""
  );
};


const getPrice = (item) => {
  const price =
    item?.price ??
    item?.sales_amount ??
    item?.sale_amount ??
    0;

  const number = Number(price);

  if (Number.isNaN(number)) {
    return String(price);
  }

  return number.toLocaleString("en-IN");
};


// ======================================================
// ANIMAL CARD
// ======================================================

const AnimalCard = ({ item, onPress }) => {
  const imageUrl = getImageUrl(item);
  const categoryName = getCategoryName(item);
  const breedName = getBreedName(item);
  const locationName = getLocationName(item);

  const gender = item?.gender || "";
  const age = item?.age || "";

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
    >
      {/* IMAGE */}
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.cardImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noImage}>
            <Ionicons
              name="paw-outline"
              size={42}
              color="#9CA3AF"
            />

            <Text style={styles.noImageText}>
              No Image
            </Text>
          </View>
        )}

        {/* CATEGORY */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>
            {categoryName}
          </Text>
        </View>

        {/* FAVORITE */}
        <Pressable
          style={styles.favoriteButton}
          onPress={(event) => {
            event.stopPropagation();
          }}
        >
          <Ionicons
            name="heart-outline"
            size={21}
            color="#374151"
          />
        </Pressable>
      </View>


      {/* CONTENT */}
      <View style={styles.cardContent}>
        <Text
          style={styles.cardTitle}
          numberOfLines={1}
        >
          {item?.title || "Animal"}
        </Text>


        {/* BREED */}
        {breedName ? (
          <View style={styles.infoRow}>
            <Ionicons
              name="paw-outline"
              size={15}
              color="#6B7280"
            />

            <Text
              style={styles.infoText}
              numberOfLines={1}
            >
              {breedName}
            </Text>
          </View>
        ) : null}


        {/* LOCATION */}
        {locationName ? (
          <View style={styles.infoRow}>
            <Ionicons
              name="location-outline"
              size={15}
              color="#6B7280"
            />

            <Text
              style={styles.infoText}
              numberOfLines={1}
            >
              {locationName}
            </Text>
          </View>
        ) : null}


        {/* GENDER + AGE */}
        {(gender || age) ? (
          <View style={styles.detailsRow}>
            {gender ? (
              <View style={styles.detailItem}>
                <Ionicons
                  name="male-female-outline"
                  size={14}
                  color="#6B7280"
                />

                <Text style={styles.detailText}>
                  {gender}
                </Text>
              </View>
            ) : null}

            {age ? (
              <View style={styles.detailItem}>
                <Ionicons
                  name="time-outline"
                  size={14}
                  color="#6B7280"
                />

                <Text style={styles.detailText}>
                  {age}
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}


        {/* PRICE */}
        <View style={styles.bottomRow}>
          <Text style={styles.price}>
            ₹{getPrice(item)}
          </Text>

          {item?.negotiable ? (
            <Text style={styles.negotiable}>
              Negotiable
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
};


// ======================================================
// MAIN SCREEN
// ======================================================

export default function ListingsScreen() {
  const params = useLocalSearchParams();

  const initialCategory =
    typeof params?.category === "string"
      ? params.category
      : "";

  const [listings, setListings] = useState([]);

  const [category, setCategory] =
    useState(initialCategory);

  const [search, setSearch] = useState("");

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");


  // ====================================================
  // LOAD LISTINGS
  // ====================================================

  const loadListings = useCallback(
    async (showLoader = true) => {
      try {
        if (showLoader) {
          setLoading(true);
        }

        setError("");

        const params = {};

        if (
          category &&
          category.toLowerCase() !== "all"
        ) {
          params.category = category;
        }

        if (search.trim()) {
          params.q = search.trim();
        }


        console.log(
          "================================="
        );

        console.log("📋 GET LISTINGS");

        console.log(
          "CATEGORY:",
          params.category || "ALL"
        );

        console.log(
          "SEARCH:",
          params.q || "NONE"
        );


        const response = await api.get(
          "/listings",
          {
            params,
          }
        );


        console.log(
          "LISTINGS RESPONSE:",
          response
        );


        // ----------------------------------------------
        // API RESPONSE HANDLING
        // ----------------------------------------------

        let data = [];


        if (Array.isArray(response)) {
          data = response;
        }

        else if (
          Array.isArray(response?.listings)
        ) {
          data = response.listings;
        }

        else if (
          Array.isArray(response?.data)
        ) {
          data = response.data;
        }

        else if (
          Array.isArray(response?.data?.listings)
        ) {
          data = response.data.listings;
        }

        else if (
          Array.isArray(response?.data?.data)
        ) {
          data = response.data.data;
        }


        console.log(
          "TOTAL LISTINGS:",
          data.length
        );


        setListings(data);
      }

      catch (err) {
        console.log(
          "================================="
        );

        console.log(
          "❌ LOAD LISTINGS ERROR"
        );

        console.log(
          "MESSAGE:",
          err?.message
        );

        console.log(
          "STATUS:",
          err?.response?.status
        );

        console.log(
          "RESPONSE:",
          err?.response?.data
        );

        console.log(
          "================================="
        );


        setListings([]);

        setError(
          err?.response?.data?.message ||
          "Unable to load animals"
        );
      }

      finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [category, search]
  );


  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {
    loadListings(true);
  }, [loadListings]);


  // ====================================================
  // REFRESH
  // ====================================================

  const handleRefresh = () => {
    setRefreshing(true);

    loadListings(false);
  };


  // ====================================================
  // OPEN LISTING
  // ====================================================

  const openListing = (item) => {
    const id = getListingId(item);

    console.log(
      "CLICKED LISTING ID:",
      id
    );


    if (!id) {
      console.log(
        "❌ Listing ID missing"
      );

      return;
    }


    router.push(
      `/listing/${id}`
    );
  };


  // ====================================================
  // CLEAR CATEGORY
  // ====================================================

  const clearCategory = () => {
    setCategory("");

    router.setParams({
      category: undefined,
    });
  };


  // ====================================================
  // SEARCH SUBMIT
  // ====================================================

  const handleSearchSubmit = () => {
    loadListings(true);
  };


  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#16A34A"
          />

          <Text style={styles.loadingText}>
            Loading animals...
          </Text>
        </View>
      </SafeAreaView>
    );
  }


  // ====================================================
  // HEADER TITLE
  // ====================================================

  const screenTitle =
    category &&
    category.toLowerCase() !== "all"
      ? `${category} Animals`
      : "All Animals";


  // ====================================================
  // RENDER
  // ====================================================

  return (
    <SafeAreaView style={styles.container}>
      {/* ================================================
          HEADER
      ================================================= */}

      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#111827"
          />
        </Pressable>


        <View style={styles.headerTitleContainer}>
          <Text
            style={styles.headerTitle}
            numberOfLines={1}
          >
            {screenTitle}
          </Text>

          <Text style={styles.headerSubtitle}>
            {listings.length} animals available
          </Text>
        </View>
      </View>


      {/* ================================================
          SEARCH
      ================================================= */}

      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={21}
          color="#6B7280"
        />

        <TextInput
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearchSubmit}
          placeholder="Search animals..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
          returnKeyType="search"
        />

        {search.length > 0 ? (
          <Pressable
            onPress={() => {
              setSearch("");
            }}
          >
            <Ionicons
              name="close-circle"
              size={20}
              color="#9CA3AF"
            />
          </Pressable>
        ) : null}
      </View>


      {/* ================================================
          ACTIVE FILTER
      ================================================= */}

      {category ? (
        <View style={styles.filterContainer}>
          <View style={styles.filterChip}>
            <Text style={styles.filterText}>
              {category}
            </Text>

            <Pressable
              onPress={clearCategory}
            >
              <Ionicons
                name="close"
                size={17}
                color="#166534"
              />
            </Pressable>
          </View>
        </View>
      ) : null}


      {/* ================================================
          ERROR
      ================================================= */}

      {error && listings.length === 0 ? (
        <View style={styles.errorContainer}>
          <Ionicons
            name="cloud-offline-outline"
            size={52}
            color="#9CA3AF"
          />

          <Text style={styles.errorTitle}>
            Unable to load animals
          </Text>

          <Text style={styles.errorText}>
            {error}
          </Text>

          <Pressable
            style={styles.retryButton}
            onPress={() => loadListings(true)}
          >
            <Text style={styles.retryText}>
              Try Again
            </Text>
          </Pressable>
        </View>
      ) : null}


      {/* ================================================
          EMPTY
      ================================================= */}

      {!error && listings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Ionicons
              name="paw-outline"
              size={54}
              color="#9CA3AF"
            />
          </View>

          <Text style={styles.emptyTitle}>
            No animals found
          </Text>

          <Text style={styles.emptyText}>
            {category
              ? `No ${category} listings are available right now.`
              : "There are no active animal listings right now."}
          </Text>

          {category ? (
            <Pressable
              style={styles.viewAllButton}
              onPress={clearCategory}
            >
              <Text style={styles.viewAllText}>
                View All Animals
              </Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}


      {/* ================================================
          LIST
      ================================================= */}

      {listings.length > 0 ? (
        <FlatList
          data={listings}
          keyExtractor={(item, index) =>
            String(
              getListingId(item) ||
              index
            )
          }
          renderItem={({ item }) => (
            <AnimalCard
              item={item}
              onPress={() =>
                openListing(item)
              }
            />
          )}
          contentContainerStyle={
            styles.listContent
          }
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          }
          ItemSeparatorComponent={() => (
            <View style={styles.separator} />
          )}
        />
      ) : null}
    </SafeAreaView>
  );
}


// ======================================================
// STYLES
// ======================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },


  // ====================================================
  // HEADER
  // ====================================================

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },

  headerTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },

  headerTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: "#111827",
  },

  headerSubtitle: {
    marginTop: 2,
    fontSize: 13,
    color: "#6B7280",
  },


  // ====================================================
  // SEARCH
  // ====================================================

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 14,
    paddingHorizontal: 14,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  searchInput: {
    flex: 1,
    marginLeft: 9,
    fontSize: 15,
    color: "#111827",
  },


  // ====================================================
  // FILTER
  // ====================================================

  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#DCFCE7",
  },

  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#166534",
  },


  // ====================================================
  // LIST
  // ====================================================

  listContent: {
    padding: 16,
    paddingBottom: 30,
  },

  separator: {
    height: 12,
  },


  // ====================================================
  // CARD
  // ====================================================

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  cardPressed: {
    opacity: 0.92,
  },

  imageContainer: {
    width: "100%",
    height: 220,
    backgroundColor: "#F3F4F6",
    position: "relative",
  },

  cardImage: {
    width: "100%",
    height: "100%",
  },

  noImage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  noImageText: {
    marginTop: 6,
    fontSize: 13,
    color: "#9CA3AF",
  },


  // ====================================================
  // BADGES
  // ====================================================

  categoryBadge: {
    position: "absolute",
    left: 12,
    top: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
  },

  categoryBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#166534",
  },

  favoriteButton: {
    position: "absolute",
    right: 12,
    top: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },


  // ====================================================
  // CARD CONTENT
  // ====================================================

  cardContent: {
    padding: 14,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  infoText: {
    flex: 1,
    marginLeft: 6,
    fontSize: 13,
    color: "#6B7280",
  },

  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginTop: 2,
  },

  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  detailText: {
    marginLeft: 5,
    fontSize: 13,
    color: "#6B7280",
  },


  // ====================================================
  // PRICE
  // ====================================================

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },

  price: {
    fontSize: 20,
    fontWeight: "800",
    color: "#15803D",
  },

  negotiable: {
    fontSize: 12,
    fontWeight: "600",
    color: "#166534",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
  },


  // ====================================================
  // LOADING
  // ====================================================

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },


  // ====================================================
  // EMPTY
  // ====================================================

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    marginBottom: 18,
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },

  emptyText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: "#6B7280",
    textAlign: "center",
  },

  viewAllButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#16A34A",
  },

  viewAllText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },


  // ====================================================
  // ERROR
  // ====================================================

  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  errorTitle: {
    marginTop: 15,
    fontSize: 19,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },

  errorText: {
    marginTop: 8,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },

  retryButton: {
    marginTop: 20,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#16A34A",
  },

  retryText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
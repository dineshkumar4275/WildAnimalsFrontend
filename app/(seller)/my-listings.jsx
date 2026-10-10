import React, { useCallback, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";

import api from "../../src/api/api";

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ==========================================
  // LOAD MY LISTINGS
  // ==========================================

  const loadListings = async () => {
    try {
      console.log("=================================");
      console.log("📋 LOADING MY LISTINGS");
      console.log("URL: /listings/mine");

      const response = await api.get("/listings/mine");

      console.log("📦 MY LISTINGS RESPONSE:");
      console.log(JSON.stringify(response, null, 2));

      // ==========================================
      // HANDLE ALL POSSIBLE RESPONSE SHAPES
      // ==========================================

      let items = [];

      // Case 1:
      // api returns:
      // {
      //   success: true,
      //   data: [...]
      // }

      if (Array.isArray(response?.data)) {
        items = response.data;
      }

      // Case 2:
      // api returns:
      // {
      //   success: true,
      //   listings: [...]
      // }

      else if (Array.isArray(response?.listings)) {
        items = response.listings;
      }

      // Case 3:
      // api returns:
      // {
      //   success: true,
      //   data: {
      //      listings: [...]
      //   }
      // }

      else if (Array.isArray(response?.data?.listings)) {
        items = response.data.listings;
      }

      // Case 4:
      // api somehow returns direct array

      else if (Array.isArray(response)) {
        items = response;
      }

      // ==========================================
      // SET LISTINGS
      // ==========================================

      console.log("📋 LISTINGS COUNT:", items.length);

      setListings(items);

      console.log("=================================");
    } catch (error) {
      console.log("=================================");
      console.log("❌ MY LISTINGS ERROR");
      console.log("MESSAGE:", error?.message);
      console.log("STATUS:", error?.response?.status);
      console.log(
        "RESPONSE:",
        JSON.stringify(error?.response?.data, null, 2)
      );
      console.log("=================================");

      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Unable to load listings."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ==========================================
  // RELOAD WHEN SCREEN OPENS
  // ==========================================

  useFocusEffect(
    useCallback(() => {
      loadListings();
    }, [])
  );

  // ==========================================
  // GET IMAGE
  // ==========================================

  const getImage = (item) => {
    // New schema
    if (item?.images?.length > 0) {
      const firstImage = item.images[0];

      if (typeof firstImage === "string") {
        return firstImage;
      }

      return (
        firstImage?.media_url ||
        firstImage?.url ||
        firstImage?.image_url ||
        null
      );
    }

    // Other possible backend formats
    return (
      item?.image_url ||
      item?.image ||
      item?.media_url ||
      item?.thumbnail ||
      null
    );
  };

  // ==========================================
  // GET CATEGORY NAME
  // ==========================================

  const getCategoryName = (item) => {
    return (
      item?.category?.name ||
      item?.category_name ||
      item?.category ||
      "Animal"
    );
  };

  // ==========================================
  // GET PRICE
  // ==========================================

  const getPrice = (item) => {
    const price =
      item?.price ??
      item?.amount ??
      item?.sales_amount ??
      0;

    const numericPrice = Number(price);

    return Number.isNaN(numericPrice)
      ? 0
      : numericPrice;
  };

  // ==========================================
  // GET STATUS
  // ==========================================

  const getStatus = (item) => {
    return String(
      item?.status || "PENDING_REVIEW"
    ).replace("_", " ");
  };

  // ==========================================
  // STATUS COLOR
  // ==========================================

  const getStatusColor = (status) => {
    const value = String(status || "").toUpperCase();

    if (value === "ACTIVE") {
      return "#15803D";
    }

    if (value === "SOLD") {
      return "#7C3AED";
    }

    if (value === "REJECTED") {
      return "#DC2626";
    }

    if (value === "PENDING_REVIEW") {
      return "#D97706";
    }

    return "#6B7280";
  };

  // ==========================================
  // RENDER LISTING
  // ==========================================

  const renderItem = ({ item }) => {
    const image = getImage(item);
    const price = getPrice(item);

    const listingId =
      item?.id ||
      item?.listing_id;

    return (
      <Pressable
        style={styles.card}
        onPress={() => {
          if (!listingId) {
            Alert.alert(
              "Error",
              "Listing ID not found."
            );
            return;
          }

          router.push(`/listing/${listingId}`);
        }}
      >
        {/* IMAGE */}

        {image ? (
          <Image
            source={{ uri: image }}
            style={styles.image}
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.emoji}>
              🐄
            </Text>
          </View>
        )}

        {/* DETAILS */}

        <View style={styles.details}>
          <Text
            style={styles.title}
            numberOfLines={1}
          >
            {item?.title ||
              item?.name ||
              "Animal"}
          </Text>

          <Text style={styles.category}>
            {getCategoryName(item)}
          </Text>

          <Text style={styles.price}>
            ₹
            {price.toLocaleString("en-IN")}
          </Text>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  `${getStatusColor(item?.status)}15`,
              },
            ]}
          >
            <Text
              style={[
                styles.status,
                {
                  color:
                    getStatusColor(item?.status),
                },
              ]}
            >
              {getStatus(item?.status)}
            </Text>
          </View>
        </View>

        <Ionicons
          name="chevron-forward"
          size={21}
          color="#9CA3AF"
        />
      </Pressable>
    );
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Pressable
            style={styles.back}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={23}
              color="#111827"
            />
          </Pressable>

          <Text style={styles.headerTitle}>
            My Listings
          </Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <View style={styles.loader}>
          <ActivityIndicator
            size="large"
            color="#16A34A"
          />

          <Text style={styles.loadingText}>
            Loading your listings...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <SafeAreaView style={styles.safe}>
      {/* HEADER */}

      <View style={styles.header}>
        <Pressable
          style={styles.back}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={23}
            color="#111827"
          />
        </Pressable>

        <Text style={styles.headerTitle}>
          My Listings
        </Text>

        <Pressable
          style={styles.add}
          onPress={() =>
            router.push(
              "/(seller)/add-listing"
            )
          }
        >
          <Ionicons
            name="add"
            size={25}
            color="#FFFFFF"
          />
        </Pressable>
      </View>

      {/* LIST */}

      <FlatList
        data={listings}
        keyExtractor={(item, index) =>
          String(
            item?.id ||
              item?.listing_id ||
              index
          )
        }
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          listings.length === 0
            ? styles.emptyContainer
            : styles.list
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await loadListings();
            }}
            tintColor="#16A34A"
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="paw-outline"
                size={55}
                color="#16A34A"
              />
            </View>

            <Text style={styles.emptyTitle}>
              No animals listed
            </Text>

            <Text style={styles.emptyText}>
              You haven't added any animals yet.
            </Text>

            <Pressable
              style={styles.button}
              onPress={() =>
                router.push(
                  "/(seller)/add-listing"
                )
              }
            >
              <Ionicons
                name="add"
                size={20}
                color="#FFFFFF"
              />

              <Text style={styles.buttonText}>
                Add Animal
              </Text>
            </Pressable>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F6FAF7",
  },

  header: {
    height: 68,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  back: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },

  headerPlaceholder: {
    width: 42,
    height: 42,
  },

  add: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    color: "#6B7280",
    fontSize: 14,
  },

  list: {
    padding: 18,
    paddingTop: 5,
    paddingBottom: 30,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 10,
    marginBottom: 13,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },

  image: {
    width: 95,
    height: 95,
    borderRadius: 14,
    backgroundColor: "#E5E7EB",
  },

  placeholder: {
    width: 95,
    height: 95,
    borderRadius: 14,
    backgroundColor: "#EAF8EF",
    justifyContent: "center",
    alignItems: "center",
  },

  emoji: {
    fontSize: 35,
  },

  details: {
    flex: 1,
    marginLeft: 13,
    marginRight: 8,
  },

  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },

  category: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 5,
  },

  price: {
    fontSize: 17,
    color: "#EA580C",
    fontWeight: "900",
    marginTop: 6,
  },

  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 5,
  },

  status: {
    fontSize: 10,
    fontWeight: "800",
  },

  emptyContainer: {
    flexGrow: 1,
  },

  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },

  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#EAF8EF",
    justifyContent: "center",
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: "800",
    marginTop: 15,
    color: "#111827",
  },

  emptyText: {
    color: "#6B7280",
    marginTop: 7,
    textAlign: "center",
  },

  button: {
    backgroundColor: "#16A34A",
    paddingHorizontal: 25,
    paddingVertical: 13,
    borderRadius: 14,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
});
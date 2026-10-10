
import React, {
  useCallback,
  useState,
} from "react";

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  useFocusEffect,
  router,
} from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { getFavorites } from "../../src/api/listingApi";
import { useAuth } from "../../src/context/AuthContext";
import AnimalCard from "../../src/components/AnimalCard";
import { useLanguage } from "../../src/i18n/LanguageContext";

export default function Favorites() {
  const { t } = useLanguage();
  const { token, loading: authLoading } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===================================================
  // LOAD FAVORITES
  // ===================================================

  const loadFavorites = useCallback(async () => {
    if (authLoading) {
      return;
    }

    // No login: do not call the protected API
    if (!token) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await getFavorites();

      console.log("📦 FAVORITES RESPONSE:", response);

      const listings = Array.isArray(response?.listings)
        ? response.listings
        : Array.isArray(response?.favorites)
        ? response.favorites
        : [];

      console.log(
        `✅ Loaded ${listings.length} favorites`
      );

      setItems(listings);
    } catch (error) {
      console.log(
        "❌ Favorites error:",
        error?.response?.data || error?.message
      );

      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [token, authLoading]);

  // ===================================================
  // REFRESH WHEN SCREEN IS FOCUSED
  // ===================================================

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  // ===================================================
  // WAIT FOR AUTH INITIALIZATION
  // ===================================================

  if (authLoading || (loading && token)) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          size="large"
          color="#16A34A"
        />

        <Text style={styles.loadingText}>
          Loading favorites...
        </Text>
      </View>
    );
  }

  // ===================================================
  // SCREEN
  // ===================================================

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.smallTitle}>
            YOUR SAVED ANIMALS
          </Text>

          <Text style={styles.title}>
            Favorites
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <Ionicons
            name="heart"
            size={26}
            color="#EF4444"
          />
        </View>
      </View>

      {!loading && items.length > 0 && (
        <View style={styles.countBox}>
          <Text style={styles.countNumber}>
            {items.length}
          </Text>

          <Text style={styles.countText}>
            {items.length === 1
              ? "saved animal"
              : "saved animals"}
          </Text>
        </View>
      )}

      <FlatList
        data={items}
        keyExtractor={(item, index) =>
          String(item.id || item.listing_id || index)
        }
        contentContainerStyle={
          items.length === 0
            ? styles.emptyContainer
            : styles.list
        }
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={loadFavorites}
        renderItem={({ item }) => (
          <AnimalCard
            item={item}
            showFavoriteButton
            isFavorite
            onPress={() =>
              router.push(
                `/listing/${item.id || item.listing_id}`
              )
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="heart-outline"
                size={42}
                color="#EF4444"
              />
            </View>

            <Text style={styles.emptyTitle}>
              {token
                ? "No favorites yet"
                : "Login to view favorites"}
            </Text>

            <Text style={styles.emptyText}>
              {token
                ? "Save animals you like and they will appear here."
                : "Sign in to see your saved animals."}
            </Text>

            <Pressable
              style={styles.browseButton}
              onPress={() =>
                router.push(
                  token ? "/listings" : "/(auth)/buyer-login"
                )
              }
            >
              <Ionicons
                name={token ? "search" : "log-in-outline"}
                size={18}
                color="#FFFFFF"
              />

              <Text style={styles.browseText}>
                {token ? "Browse Animals" : "Login"}
              </Text>
            </Pressable>
          </View>
        }
      />
    </View>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F8F3",
  },

  header: {
    marginHorizontal: 16,
    marginTop: 14,
    padding: 18,
    borderRadius: 22,
    backgroundColor: "#16A34A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 4,
    shadowColor: "#16A34A",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },

  headerLeft: {
    flex: 1,
  },

  smallTitle: {
    fontSize: 10,
    fontWeight: "900",
    color: "#DCFCE7",
    letterSpacing: 1.2,
  },

  title: {
    marginTop: 4,
    fontSize: 26,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },

  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },

  countBox: {
    marginHorizontal: 16,
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8F0E9",
  },

  countNumber: {
    fontSize: 22,
    fontWeight: "900",
    color: "#16A34A",
  },

  countText: {
    marginLeft: 8,
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },

  list: {
    paddingTop: 8,
    paddingBottom: 30,
  },

  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F4F8F3",
  },

  loadingText: {
    marginTop: 10,
    color: "#64748B",
    fontWeight: "700",
  },

  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 24,
  },

  emptyBox: {
    padding: 28,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    elevation: 3,
  },

  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "900",
    color: "#172033",
    textAlign: "center",
  },

  emptyText: {
    marginTop: 6,
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18,
    color: "#64748B",
  },

  browseButton: {
    marginTop: 18,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#16A34A",
    flexDirection: "row",
    alignItems: "center",
  },

  browseText: {
    marginLeft: 7,
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 13,
  },
});


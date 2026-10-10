
import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import { getFavorites } from "../api/listingApi";
import { useAuth } from "./AuthContext";

const FavoriteContext = createContext(null);

export function FavoriteProvider({ children }) {
  const { token, loading: authLoading } = useAuth();

  const [favoritesCount, setFavoritesCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // ===================================================
  // REFRESH COUNT FROM SERVER
  // ===================================================

  const refreshFavoritesCount = useCallback(async () => {
    // Wait until authentication initialization finishes
    if (authLoading) {
      return;
    }

    // Never request favorites without a login token
    if (!token) {
      setFavoritesCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await getFavorites();

      const listings = Array.isArray(response?.listings)
        ? response.listings
        : Array.isArray(response?.favorites)
        ? response.favorites
        : [];

      setFavoritesCount(listings.length);
    } catch (error) {
      console.log(
        "❌ Favorites count error:",
        error?.response?.data || error?.message
      );

      setFavoritesCount(0);
    } finally {
      setLoading(false);
    }
  }, [token, authLoading]);

  // ===================================================
  // INCREMENT
  // ===================================================

  const incrementCount = useCallback(() => {
    setFavoritesCount((previous) => previous + 1);
  }, []);

  // ===================================================
  // DECREMENT
  // ===================================================

  const decrementCount = useCallback(() => {
    setFavoritesCount((previous) =>
      Math.max(0, previous - 1)
    );
  }, []);

  // ===================================================
  // LOAD WHEN AUTH CHANGES
  // ===================================================

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!token) {
      setFavoritesCount(0);
      setLoading(false);
      return;
    }

    refreshFavoritesCount();
  }, [authLoading, token, refreshFavoritesCount]);

  // ===================================================
  // CONTEXT VALUE
  // ===================================================

  const value = {
    favoritesCount,
    refreshFavoritesCount,
    incrementCount,
    decrementCount,
    loading,
  };

  return (
    <FavoriteContext.Provider value={value}>
      {children}
    </FavoriteContext.Provider>
  );
}

// =====================================================
// HOOK
// =====================================================

export function useFavorite() {
  const context = useContext(FavoriteContext);

  if (!context) {
    throw new Error(
      "useFavorite must be used inside FavoriteProvider"
    );
  }

  return context;
}

export default FavoriteContext;


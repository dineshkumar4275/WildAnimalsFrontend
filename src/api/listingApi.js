import api from "./api";

/* =========================================================
   GET FAVORITES
   GET /api/favorites
========================================================= */

export const getFavorites = async () => {
  try {
    const response = await api.get("/favorites");

    // Backend returns: { success, count, favorites: [{id, listing_id, listing: {...}}] }
    // Frontend expects: { listings: [...] }

    const rawFavorites =
      response?.favorites ||
      response?.data?.favorites ||
      [];

    // Extract `listing` from each favorite
    const listings = rawFavorites
      .map((fav) => {
        const listing = fav?.listing || fav;

        if (!listing || typeof listing !== "object") {
          return null;
        }

        return {
          ...listing,
          // Ensure listing_id set
          listing_id: listing.listing_id || listing.id || fav.listing_id,
          id: listing.id || fav.listing_id,
          // Favorite metadata
          favorite_id: fav.id,
          favorited_at: fav.created_at,
          // Image shortcut
          image_url:
            listing.image_url ||
            (Array.isArray(listing.images) && listing.images[0]?.media_url) ||
            (Array.isArray(listing.images) && listing.images[0]?.url) ||
            null,
        };
      })
      .filter(Boolean);

    return {
      success: true,
      count: listings.length,
      listings,
    };
  } catch (error) {
    console.log("❌ getFavorites error:", error?.message);
    throw error;
  }
};

/* =========================================================
   ADD FAVORITE
   POST /api/favorites
========================================================= */

export const addFavorite = async (listingId) => {
  try {
    const response = await api.post("/favorites", {
      listing_id: listingId,
    });

    return response;
  } catch (error) {
    console.log("❌ addFavorite error:", error?.message);
    throw error;
  }
};

/* =========================================================
   REMOVE FAVORITE
   DELETE /api/favorites/:listingId
========================================================= */

export const removeFavorite = async (listingId) => {
  try {
    const response = await api.delete(`/favorites/${listingId}`);

    return response;
  } catch (error) {
    console.log("❌ removeFavorite error:", error?.message);
    throw error;
  }
};

/* =========================================================
   CHECK IF FAVORITED
   GET /api/favorites/check/:listingId
========================================================= */

export const checkFavorite = async (listingId) => {
  try {
    const response = await api.get(`/favorites/check/${listingId}`);
    return response?.isFavorite || false;
  } catch (error) {
    console.log("❌ checkFavorite error:", error?.message);
    return false;
  }
};

/* =========================================================
   GET LISTINGS / SEARCH
   GET /api/listings
   Example:
   /api/listings?q=dog
========================================================= */




export const getListings = async (params = {}) => {
  try {
    const response = await api.get("/listings", params);

    console.log("=================================");
    console.log("🔎 GET LISTINGS");
    console.log("PARAMS:", params);
    console.log("RESPONSE:", response);
    console.log("=================================");

    return response || {};
  } catch (error) {
    console.log("=================================");
    console.log("❌ GET LISTINGS ERROR");
    console.log("MESSAGE:", error?.message);
    console.log("STATUS:", error?.response?.status);
    console.log("RESPONSE:", error?.response?.data);
    console.log("=================================");

    throw error;
  }
};


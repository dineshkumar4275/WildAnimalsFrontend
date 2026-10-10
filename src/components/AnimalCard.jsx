// import React, { useState } from "react";
// import {
//   Image,
//   Pressable,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// import { COLORS } from "../constants/colors";
// import { formatPrice } from "../utils/format";
// import { useLanguage } from "../i18n/LanguageContext";
// import { addFavorite, removeFavorite } from "../api/listingApi";

// export default function AnimalCard({
//   item,
//   onPress,
//   showFavoriteButton = true,
//   initialIsFavorite = false,
//   onFavoriteChange,
// }) {
//   const { t } = useLanguage();

//   const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
//   const [savingFavorite, setSavingFavorite] = useState(false);

//   /* =======================================================
//      SAFE TEXT HELPER
//   ======================================================= */

//   const safeText = (value, fallback = "") => {
//     if (value === null || value === undefined) return fallback;
//     if (typeof value === "string") return value;
//     if (typeof value === "number") return String(value);

//     if (typeof value === "object") {
//       return (
//         value.name ||
//         value.title ||
//         value.label ||
//         value.value ||
//         fallback
//       );
//     }

//     return fallback;
//   };

//   /* =======================================================
//      GENDER
//   ======================================================= */

//   const getGenderName = (gender) => {
//     const value = String(gender || "").toLowerCase();

//     if (value === "male") return t("male");
//     if (value === "female") return t("female");

//     return safeText(gender);
//   };

//   /* =======================================================
//      CATEGORY
//   ======================================================= */

//   const getCategoryName = (item) => {
//     let categoryValue = "";

//     if (item?.category_name) {
//       categoryValue = safeText(item.category_name);
//     } else if (item?.category?.name) {
//       categoryValue = safeText(item.category.name);
//     } else if (typeof item?.category === "string") {
//       categoryValue = item.category;
//     }

//     const value = String(categoryValue || "").toLowerCase();

//     if (value.includes("buffalo")) return t("buffalo");
//     if (value.includes("calf")) return t("calf");
//     if (value.includes("cow")) return t("cow");
//     if (value.includes("goat")) return t("goat");
//     if (value.includes("sheep")) return t("sheep");
//     if (value.includes("poultry") || value.includes("chicken"))
//       return t("poultry");
//     if (value.includes("dog")) return t("dog");
//     if (value.includes("cat")) return t("cat");

//     return categoryValue || t("animal");
//   };

//   /* =======================================================
//      TITLE
//   ======================================================= */

//   const getTranslatedTitle = (title) => {
//     if (!title) return t("animal");

//     const titleValue = safeText(title);
//     const lower = titleValue.toLowerCase().trim();

//     if (lower === "cow") return t("cow");
//     if (lower === "buffalo") return t("buffalo");
//     if (lower === "calf") return t("calf");
//     if (lower === "goat") return t("goat");
//     if (lower === "sheep") return t("sheep");
//     if (lower === "poultry" || lower === "chicken") return t("poultry");
//     if (lower === "dog") return t("dog");
//     if (lower === "cat") return t("cat");

//     return titleValue;
//   };

//   /* =======================================================
//      LOCATION
//   ======================================================= */

//   const location =
//     safeText(item?.area) ||
//     safeText(item?.city) ||
//     safeText(item?.district) ||
//     safeText(item?.state) ||
//     "";

//   /* =======================================================
//      IMAGE
//   ======================================================= */

//   const getImageUrl = () => {
//     if (item?.image_url && typeof item.image_url === "string")
//       return item.image_url;
//     if (item?.image && typeof item.image === "string")
//       return item.image;
//     if (item?.imageUrl && typeof item.imageUrl === "string")
//       return item.imageUrl;

//     if (Array.isArray(item?.images) && item.images.length > 0) {
//       const first = item.images[0];
//       if (typeof first === "string") return first;
//       if (first?.url) return first.url;
//       if (first?.media_url) return first.media_url;
//     }

//     return null;
//   };

//   const imageUrl = getImageUrl();

//   /* =======================================================
//      TOGGLE FAVORITE
//   ======================================================= */

//   const handleToggleFavorite = async (event) => {
//     event?.stopPropagation?.();

//     if (savingFavorite) return;

//     const listingId = item?.listing_id || item?.id;

//     if (!listingId) {
//       console.log("❌ No listing ID for favorite");
//       return;
//     }

//     try {
//       setSavingFavorite(true);

//       if (isFavorite) {
//         // Remove
//         await removeFavorite(listingId);
//         setIsFavorite(false);
//         onFavoriteChange?.(listingId, false);
//       } else {
//         // Add
//         await addFavorite(listingId);
//         setIsFavorite(true);
//         onFavoriteChange?.(listingId, true);
//       }
//     } catch (error) {
//       console.log("❌ Favorite toggle error:", error?.message);
//     } finally {
//       setSavingFavorite(false);
//     }
//   };

//   /* =======================================================
//      RENDER
//   ======================================================= */

//   return (
//     <Pressable
//       style={styles.card}
//       onPress={onPress}
//       android_ripple={{ color: "#E8F5E9" }}
//     >
//       {/* IMAGE + FAVORITE BUTTON */}
//       <View style={styles.imageWrapper}>
//         {imageUrl ? (
//           <Image
//             source={{ uri: imageUrl }}
//             style={styles.image}
//             resizeMode="cover"
//           />
//         ) : (
//           <View style={[styles.image, styles.placeholder]}>
//             <Text style={styles.placeholderText}>🐄</Text>
//           </View>
//         )}

//         {/* 🔥 FAVORITE BUTTON */}
//         {showFavoriteButton && (
//           <Pressable
//             style={[
//               styles.favoriteButton,
//               isFavorite && styles.favoriteButtonActive,
//             ]}
//             onPress={handleToggleFavorite}
//             disabled={savingFavorite}
//             hitSlop={10}
//           >
//             <Ionicons
//               name={isFavorite ? "heart" : "heart-outline"}
//               size={20}
//               color={isFavorite ? "#EF4444" : "#FFFFFF"}
//             />
//           </Pressable>
//         )}
//       </View>

//       {/* CONTENT */}
//       <View style={styles.content}>
//         <Text style={styles.title} numberOfLines={1}>
//           {getTranslatedTitle(item?.title)}
//         </Text>

//         <Text style={styles.category} numberOfLines={1}>
//           {getCategoryName(item)}
//         </Text>

//         <Text style={styles.location} numberOfLines={1}>
//           📍 {location || t("locationUnavailable")}
//         </Text>

//         {(item?.gender || item?.age) && (
//           <Text style={styles.details} numberOfLines={1}>
//             {getGenderName(item?.gender)}
//             {item?.age ? ` • ${item.age}` : ""}
//           </Text>
//         )}

//         <Text style={styles.price}>
//           {formatPrice(item?.price)}
//         </Text>
//       </View>
//     </Pressable>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: COLORS.white,
//     borderRadius: 14,
//     overflow: "hidden",
//     marginBottom: 14,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },

//   imageWrapper: {
//     position: "relative",
//     width: "100%",
//   },

//   image: {
//     width: "100%",
//     height: 190,
//   },

//   placeholder: {
//     backgroundColor: "#E8F5E9",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   placeholderText: {
//     fontSize: 60,
//   },

//   favoriteButton: {
//     position: "absolute",
//     top: 10,
//     right: 10,
//     width: 38,
//     height: 38,
//     borderRadius: 19,
//     backgroundColor: "rgba(0,0,0,0.4)",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   favoriteButtonActive: {
//     backgroundColor: "#FFFFFF",
//   },

//   content: {
//     padding: 12,
//   },

//   title: {
//     fontSize: 17,
//     fontWeight: "700",
//     color: COLORS.text,
//   },

//   category: {
//     marginTop: 4,
//     color: COLORS.primary,
//     fontWeight: "600",
//   },

//   location: {
//     marginTop: 8,
//     color: COLORS.muted,
//   },

//   details: {
//     marginTop: 5,
//     color: COLORS.muted,
//   },

//   price: {
//     marginTop: 8,
//     fontSize: 19,
//     fontWeight: "800",
//     color: COLORS.text,
//   },
// });

import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useFavorite } from "../context/FavoriteContext";
import { COLORS } from "../constants/colors";
import { useLanguage } from "../i18n/LanguageContext";
import { removeFavorite } from "../api/listingApi";

export default function AnimalCard({
  item,
  onPress,
  showFavoriteButton = false,
  initialIsFavorite = false,
  onFavoriteRemoved,
}) {
  const { t } = useLanguage();
const { incrementCount, decrementCount } = useFavorite();
  const [isFav, setIsFav] = useState(initialIsFavorite);
  const [removing, setRemoving] = useState(false);

  /* =======================================================
     SAFE TEXT
  ======================================================= */

  const safeText = (value, fallback = "") => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === "string") return value;
    if (typeof value === "number") return String(value);

    if (typeof value === "object") {
      return (
        value.name ||
        value.title ||
        value.label ||
        value.value ||
        fallback
      );
    }

    return fallback;
  };

  /* =======================================================
     GENDER
  ======================================================= */

  const getGenderName = (gender) => {
    const value = String(gender || "").toLowerCase();
    if (value === "male") return t("male");
    if (value === "female") return t("female");
    return safeText(gender);
  };

  /* =======================================================
     CATEGORY
  ======================================================= */

  const getCategoryName = (item) => {
    let categoryValue = "";

    if (item?.category_name) {
      categoryValue = safeText(item.category_name);
    } else if (item?.category?.name) {
      categoryValue = safeText(item.category.name);
    } else if (typeof item?.category === "string") {
      categoryValue = item.category;
    }

    const value = String(categoryValue || "").toLowerCase();

    if (value.includes("buffalo")) return t("buffalo");
    if (value.includes("calf")) return t("calf");
    if (value.includes("cow")) return t("cow");
    if (value.includes("goat")) return t("goat");
    if (value.includes("sheep")) return t("sheep");
    if (value.includes("poultry") || value.includes("chicken"))
      return t("poultry");
    if (value.includes("dog")) return t("dog");
    if (value.includes("cat")) return t("cat");

    return categoryValue || t("animal");
  };

  /* =======================================================
     TITLE
  ======================================================= */

  const getTranslatedTitle = (title) => {
    if (!title) return t("animal");

    const titleValue = safeText(title);
    const lower = titleValue.toLowerCase().trim();

    if (lower === "cow") return t("cow");
    if (lower === "buffalo") return t("buffalo");
    if (lower === "calf") return t("calf");
    if (lower === "goat") return t("goat");
    if (lower === "sheep") return t("sheep");
    if (lower === "poultry" || lower === "chicken") return t("poultry");
    if (lower === "dog") return t("dog");
    if (lower === "cat") return t("cat");

    return titleValue;
  };

  /* =======================================================
     EMOJI
  ======================================================= */

  const getAnimalEmoji = (category) => {
    const n = String(category || "").toLowerCase();
    if (n.includes("buffalo")) return "🐃";
    if (n.includes("calf")) return "🐄";
    if (n.includes("cow")) return "🐄";
    if (n.includes("goat")) return "🐐";
    if (n.includes("sheep")) return "🐑";
    if (n.includes("poultry") || n.includes("chicken")) return "🐔";
    if (n.includes("dog")) return "🐕";
    if (n.includes("cat")) return "🐈";
    return "🐄";
  };

  /* =======================================================
     LOCATION
  ======================================================= */

  const getLocation = () => {
    const parts = [];
    if (item?.area) parts.push(safeText(item.area));
    if (item?.city && item?.city !== item?.area) parts.push(safeText(item.city));
    if (item?.district && !item?.area) parts.push(safeText(item.district));
    if (item?.state) parts.push(safeText(item.state));
    return parts.filter(Boolean).join(", ");
  };

  const locationText = getLocation();

  /* =======================================================
     IMAGE
  ======================================================= */

  const getImageUrl = () => {
    if (item?.image_url && typeof item.image_url === "string")
      return item.image_url;
    if (item?.image && typeof item.image === "string") return item.image;
    if (item?.imageUrl && typeof item.imageUrl === "string")
      return item.imageUrl;

    if (Array.isArray(item?.images) && item.images.length > 0) {
      const first = item.images[0];
      if (typeof first === "string") return first;
      if (first?.url) return first.url;
      if (first?.media_url) return first.media_url;
      if (first?.secure_url) return first.secure_url;
    }

    return null;
  };

  const imageUrl = getImageUrl();
  const categoryName = getCategoryName(item);

  /* =======================================================
     REMOVE FAVORITE
  ======================================================= */

 const handleRemoveFavorite = async (event) => {
  event?.stopPropagation?.();

  if (removing) return;

  const listingId = item?.listing_id || item?.id;
  if (!listingId) return;

  try {
    setRemoving(true);

    await removeFavorite(listingId);
    setIsFav(false);

    // 🔥 DECREMENT COUNT
    decrementCount();

    Toast.show({
      type: "success",
      text1: "Removed from favorites",
      position: "bottom",
    });

    onFavoriteRemoved?.(listingId);
  } catch (error) {
    console.log("❌ Remove favorite error:", error?.message);

    Toast.show({
      type: "error",
      text1: "Remove Failed",
      text2: error?.response?.data?.error || "Unable to remove",
      position: "bottom",
    });
  } finally {
    setRemoving(false);
  }
};

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
      android_ripple={{ color: "#E8F5E9" }}
    >
      {/* IMAGE */}
      <View style={styles.imageBox}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imageEmoji}>
              {getAnimalEmoji(categoryName)}
            </Text>
          </View>
        )}
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        {/* TOP ROW: TITLE + HEART */}
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={1}>
            {getTranslatedTitle(item?.title)}
          </Text>

          {showFavoriteButton && (
            <Pressable
              style={[
                styles.heartButton,
                isFav && styles.heartButtonActive,
              ]}
              onPress={handleRemoveFavorite}
              disabled={removing}
              hitSlop={8}
            >
              <Ionicons
                name={isFav ? "heart" : "heart-outline"}
                size={16}
                color={isFav ? "#EF4444" : "#94A3B8"}
              />
            </Pressable>
          )}
        </View>

        {/* CATEGORY + BREED */}
        <Text style={styles.category} numberOfLines={1}>
          {categoryName}
          {item?.breed_name ? ` • ${item.breed_name}` : ""}
        </Text>

        {/* INFO ROW */}
        <View style={styles.infoRow}>
          {item?.gender ? (
            <View style={styles.infoBadge}>
              <Ionicons
                name="male-female-outline"
                size={10}
                color="#475569"
              />
              <Text style={styles.infoText}>
                {getGenderName(item.gender)}
              </Text>
            </View>
          ) : null}

          {item?.age ? (
            <View style={styles.infoBadge}>
              <Ionicons
                name="calendar-outline"
                size={10}
                color="#475569"
              />
              <Text style={styles.infoText}>{item.age}</Text>
            </View>
          ) : null}
        </View>

        {/* 🔥 PRICE + LOCATION — SAME ROW */}
        <View style={styles.priceLocationRow}>
          <Text style={styles.price}>
            ₹{Number(item?.price || 0).toLocaleString("en-IN")}
          </Text>

          {locationText ? (
            <View style={styles.locationBox}>
              <Ionicons
                name="location-outline"
                size={11}
                color="#16A34A"
              />
              <Text
                style={styles.locationText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {locationText}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E8F0E9",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },

  cardPressed: {
    opacity: 0.85,
  },

  /* IMAGE */
  imageBox: {
    width: 100,
    height: 100,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#F0F7F1",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  imagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F7F1",
  },

  imageEmoji: {
    fontSize: 42,
  },

  /* CONTENT */
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
  },

  heartButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  heartButtonActive: {
    backgroundColor: "#FEE2E2",
  },

  category: {
    marginTop: 3,
    fontSize: 11,
    color: "#16A34A",
    fontWeight: "700",
  },

  infoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
    gap: 5,
  },

  infoBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: "#F1F5F9",
    flexDirection: "row",
    alignItems: "center",
  },

  infoText: {
    marginLeft: 3,
    fontSize: 9,
    color: "#475569",
    fontWeight: "700",
  },

  /* 🔥 PRICE + LOCATION — SAME ROW */
  priceLocationRow: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  price: {
    fontSize: 16,
    color: "#EA580C",
    fontWeight: "900",
    marginRight: 8,
  },

  locationBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  locationText: {
    marginLeft: 3,
    fontSize: 10,
    color: "#64748B",
    fontWeight: "600",
    flexShrink: 1,
  },
});
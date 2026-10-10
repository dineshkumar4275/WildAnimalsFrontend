// import { useCallback, useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   FlatList,
//   Image,
//   Pressable,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { router, useLocalSearchParams } from "expo-router";

// import api from "../src/api";

// /* =========================================================
//    SAFE STRING HELPER
// ========================================================= */

// const safeText = (value, fallback = "") => {
//   if (value === null || value === undefined) return fallback;
//   if (typeof value === "string") return value;
//   if (typeof value === "number") return String(value);
//   if (typeof value === "object") {
//     return value.name || value.title || value.label || value.value || fallback;
//   }
//   return fallback;
// };

// /* =========================================================
//    IMAGE HELPER
// ========================================================= */

// const getListingImage = (item) => {
//   if (!item) return null;

//   const possibleFields = [
//     "image_url",
//     "image",
//     "imageUrl",
//     "thumbnail",
//     "thumbnail_url",
//     "primary_image",
//     "cover_image",
//     "media_url",
//     "cloudinary_url",
//     "secure_url",
//     "url",
//     "path",
//   ];

//   for (const field of possibleFields) {
//     const value = item[field];
//     if (value && typeof value === "string" && value.startsWith("http")) {
//       return value;
//     }
//   }

//   if (Array.isArray(item.images) && item.images.length > 0) {
//     for (const img of item.images) {
//       if (typeof img === "string" && img.startsWith("http")) return img;
//       if (img && typeof img === "object") {
//         const url =
//           img.url ||
//           img.image_url ||
//           img.media_url ||
//           img.cloudinary_url ||
//           img.secure_url;
//         if (url && typeof url === "string") return url;
//       }
//     }
//   }

//   if (Array.isArray(item.media) && item.media.length > 0) {
//     for (const m of item.media) {
//       if (typeof m === "string" && m.startsWith("http")) return m;
//       if (m && typeof m === "object") {
//         const url = m.url || m.image_url || m.media_url || m.secure_url;
//         if (url && typeof url === "string") return url;
//       }
//     }
//   }

//   return null;
// };

// /* =========================================================
//    ANIMAL EMOJI
// ========================================================= */

// const getAnimalEmoji = (cat) => {
//   const categoryName =
//     typeof cat === "object" && cat !== null
//       ? cat.name || cat.title || ""
//       : cat;

//   const n = String(categoryName || "").toLowerCase();

//   if (n.includes("buffalo")) return "🐃";
//   if (n.includes("calf")) return "🐄";
//   if (n.includes("cow")) return "🐄";
//   if (n.includes("goat")) return "🐐";
//   if (n.includes("sheep")) return "🐑";
//   if (n.includes("poultry") || n.includes("chicken")) return "🐔";
//   if (n.includes("dog")) return "🐕";
//   if (n.includes("cat")) return "🐈";
//   return "🐄";
// };

// /* =========================================================
//    LISTINGS SCREEN
// ========================================================= */

// export default function ListingsScreen() {
//   const params = useLocalSearchParams();

//   const rawCategory = params?.category;
//   const category = Array.isArray(rawCategory)
//     ? rawCategory[0]
//     : rawCategory || null;

//   const [listings, setListings] = useState([]);
//   const [loading, setLoading] = useState(false);

//   console.log("📦 Listings screen — category:", category);

//   const loadListings = useCallback(async () => {
//     try {
//       setLoading(true);

//       const query = {};
//       if (category) query.category = category;

//       console.log("📡 Fetching /listings with:", query);

//       const response = await api.get("/listings", { params: query });

//       console.log("📥 Response:", response);

//       let data = [];
//       if (Array.isArray(response?.data)) data = response.data;
//       else if (Array.isArray(response?.listings)) data = response.listings;
//       else if (Array.isArray(response?.data?.listings))
//         data = response.data.listings;
//       else if (Array.isArray(response?.data?.data))
//         data = response.data.data;

//       console.log(`✅ Loaded ${data.length} listings for ${category || "all"}`);

//       setListings(data);
//     } catch (error) {
//       console.error(
//         "❌ Listings error:",
//         error?.response?.data || error?.message
//       );
//       setListings([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [category]);

//   useEffect(() => {
//     loadListings();
//   }, [loadListings]);

//   const renderItem = ({ item }) => {
//     const image = getListingImage(item);

//     const title = safeText(item.title, "Animal");
//     const breed = safeText(item.breed, "Premium quality");
//     const city = safeText(item.city);
//     const state = safeText(item.state);
//     const categoryName = safeText(item.category_name, category || "Cow");

//     return (
//       <Pressable
//         style={styles.card}
//         onPress={() => {
//           const id = item.listing_id || item.id;
//           if (id) router.push(`/listing/${id}`);
//         }}
//       >
//         <View style={styles.imageBox}>
//           {image ? (
//             <Image
//               source={{ uri: image }}
//               style={styles.image}
//               resizeMode="cover"
//             />
//           ) : (
//             <Text style={styles.emoji}>
//               {getAnimalEmoji(categoryName)}
//             </Text>
//           )}
//         </View>

//         <View style={styles.info}>
//           <Text style={styles.title} numberOfLines={1}>
//             {title}
//           </Text>
//           <Text style={styles.breed} numberOfLines={1}>
//             {breed}
//           </Text>
//           <Text style={styles.price}>
//             ₹{Number(item.price || 0).toLocaleString("en-IN")}
//           </Text>
//           <Text style={styles.location} numberOfLines={1}>
//             {[city, state].filter(Boolean).join(", ") ||
//               "Location unavailable"}
//           </Text>
//         </View>
//       </Pressable>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Pressable onPress={() => router.back()} style={styles.backBtn}>
//           <Ionicons name="arrow-back" size={22} color="#172033" />
//         </Pressable>

//         <Text style={styles.headerTitle}>
//           {category ? `${category}s` : "All Animals"}
//         </Text>

//         <View style={{ width: 40 }} />
//       </View>

//       {loading ? (
//         <View style={styles.center}>
//           <ActivityIndicator size="large" color="#16A34A" />
//           <Text style={styles.loadingText}>
//             Loading {category || "animals"}...
//           </Text>
//         </View>
//       ) : listings.length === 0 ? (
//         <View style={styles.center}>
//           <Text style={{ fontSize: 60 }}>{getAnimalEmoji(category)}</Text>
//           <Text style={styles.emptyTitle}>
//             No {category || "animals"} found
//           </Text>
//           <Text style={styles.emptySub}>
//             Try again later or browse other categories
//           </Text>
//         </View>
//       ) : (
//         <FlatList
//           data={listings}
//           keyExtractor={(item, i) =>
//             String(item.listing_id || item.id || i)
//           }
//           renderItem={renderItem}
//           contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
//           showsVerticalScrollIndicator={false}
//         />
//       )}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F7FAF7" },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: "#FFFFFF",
//     borderBottomWidth: 1,
//     borderBottomColor: "#E5EBE6",
//   },
//   backBtn: {
//     width: 40,
//     height: 40,
//     borderRadius: 12,
//     backgroundColor: "#F1F5F9",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   headerTitle: { fontSize: 17, fontWeight: "900", color: "#172033" },
//   center: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 24,
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 12,
//     color: "#64748B",
//     fontWeight: "700",
//   },
//   emptyTitle: {
//     marginTop: 10,
//     fontSize: 17,
//     fontWeight: "900",
//     color: "#334155",
//   },
//   emptySub: {
//     marginTop: 6,
//     fontSize: 12,
//     color: "#94A3B8",
//     textAlign: "center",
//   },
//   card: {
//     flexDirection: "row",
//     backgroundColor: "#FFFFFF",
//     borderRadius: 18,
//     padding: 10,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: "#E5EBE6",
//     elevation: 2,
//   },
//   imageBox: {
//     width: 100,
//     height: 100,
//     borderRadius: 14,
//     backgroundColor: "#FFF4E8",
//     overflow: "hidden",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   image: { width: "100%", height: "100%" },
//   emoji: { fontSize: 45 },
//   info: { flex: 1, marginLeft: 12, justifyContent: "space-between" },
//   title: { fontSize: 15, fontWeight: "900", color: "#172033" },
//   breed: { fontSize: 11, color: "#64748B", marginTop: 3 },
//   price: {
//     fontSize: 17,
//     fontWeight: "900",
//     color: "#EA580C",
//     marginTop: 4,
//   },
//   location: { fontSize: 10, color: "#64748B", marginTop: 4 },
// });




import { useCallback, useEffect, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import api from "../src/api";
import { useLanguage } from "../src/i18n/LanguageContext";
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

const getListingImage = (item) => {
  if (!item) return null;

  const possibleFields = [
    "image_url",
    "image",
    "imageUrl",
    "thumbnail",
    "thumbnail_url",
    "primary_image",
    "cover_image",
    "media_url",
    "cloudinary_url",
    "secure_url",
    "url",
    "path",
  ];

  for (const field of possibleFields) {
    const value = item[field];

    if (
      value &&
      typeof value === "string" &&
      value.startsWith("http")
    ) {
      return value;
    }
  }

  if (Array.isArray(item.images) && item.images.length > 0) {
    for (const img of item.images) {
      if (
        typeof img === "string" &&
        img.startsWith("http")
      ) {
        return img;
      }

      if (img && typeof img === "object") {
        const url =
          img.url ||
          img.image_url ||
          img.media_url ||
          img.cloudinary_url ||
          img.secure_url;

        if (
          url &&
          typeof url === "string" &&
          url.startsWith("http")
        ) {
          return url;
        }
      }
    }
  }

  if (Array.isArray(item.media) && item.media.length > 0) {
    for (const m of item.media) {
      if (
        typeof m === "string" &&
        m.startsWith("http")
      ) {
        return m;
      }

      if (m && typeof m === "object") {
        const url =
          m.url ||
          m.image_url ||
          m.media_url ||
          m.secure_url;

        if (
          url &&
          typeof url === "string" &&
          url.startsWith("http")
        ) {
          return url;
        }
      }
    }
  }

  return null;
};

const getAnimalEmoji = (cat) => {
  const categoryName =
    typeof cat === "object" && cat !== null
      ? cat.name || cat.title || ""
      : cat;

  const n = String(categoryName || "").toLowerCase();

  if (n.includes("buffalo")) return "🐃";
  if (n.includes("calf")) return "🐄";
  if (n.includes("cow")) return "🐄";
  if (n.includes("goat")) return "🐐";
  if (n.includes("sheep")) return "🐑";
  if (n.includes("poultry") || n.includes("chicken"))
    return "🐔";
  if (n.includes("dog")) return "🐕";
  if (n.includes("cat")) return "🐈";

  return "🐄";
};

export default function ListingsScreen() {
  const params = useLocalSearchParams();

  const { t } = useLanguage();

  const rawCategory = params?.category;

  const category = Array.isArray(rawCategory)
    ? rawCategory[0]
    : rawCategory || null;

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log(
    "📦 Listings screen — category:",
    category
  );

  const getCategoryTranslation = (value) => {
    const n = String(value || "").toLowerCase();

    if (n === "cow") return t("cow");
    if (n === "buffalo") return t("buffalo");
    if (n === "calf") return t("calf");
    if (n === "goat") return t("goat");
    if (n === "sheep") return t("sheep");
    if (n === "poultry") return t("poultry");
    if (n === "dog") return t("dog");
    if (n === "cat") return t("cat");

    return value || t("animals");
  };

  const loadListings = useCallback(async () => {
    try {
      setLoading(true);

      const query = {};

      // IMPORTANT:
      // Backend still receives English category.
      if (category) {
        query.category = category;
      }

      console.log(
        "📡 Fetching /listings with:",
        query
      );

      const response = await api.get("/listings", {
        params: query,
      });

      console.log("📥 Response:", response);

      let data = [];

      if (Array.isArray(response?.data)) {
        data = response.data;
      } else if (Array.isArray(response?.listings)) {
        data = response.listings;
      } else if (
        Array.isArray(response?.data?.listings)
      ) {
        data = response.data.listings;
      } else if (
        Array.isArray(response?.data?.data)
      ) {
        data = response.data.data;
      }

      console.log(
        `✅ Loaded ${data.length} listings for ${
          category || "all"
        }`
      );

      setListings(data);
    } catch (error) {
      console.error(
        "❌ Listings error:",
        error?.response?.data ||
          error?.message
      );

      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  const renderItem = ({ item }) => {
    const image = getListingImage(item);

    const title = safeText(
      item.title,
      t("animal")
    );

    const breed = safeText(
      item.breed,
      t("premiumQuality")
    );

    const city = safeText(item.city);
    const state = safeText(item.state);

    const categoryName = safeText(
      item.category_name,
      category || "Cow"
    );

    return (
      <Pressable
        style={styles.card}
        onPress={() => {
          const id =
            item.listing_id || item.id;

          if (id) {
            router.push(`/listing/${id}`);
          }
        }}
      >
        <View style={styles.imageBox}>
          {image ? (
            <Image
              source={{ uri: image }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.emoji}>
              {getAnimalEmoji(categoryName)}
            </Text>
          )}
        </View>

        <View style={styles.info}>
          <Text
            style={styles.title}
            numberOfLines={1}
          >
            {title}
          </Text>

          <Text
            style={styles.breed}
            numberOfLines={1}
          >
            {breed}
          </Text>

          <Text style={styles.price}>
            ₹
            {Number(
              item.price || 0
            ).toLocaleString("en-IN")}
          </Text>

          <Text
            style={styles.location}
            numberOfLines={1}
          >
            {[city, state]
              .filter(Boolean)
              .join(", ") ||
              t("locationUnavailable")}
          </Text>
        </View>
      </Pressable>
    );
  };

  const translatedCategory =
    getCategoryTranslation(category);

  const headerTitle = category
    ? translatedCategory
    : t("allAnimals");

  return (
  <SafeAreaView style={styles.container} edges={["top"]}>
    <View style={styles.header}>
      <Pressable
        onPress={() => router.back()}
        style={styles.backBtn}
      >
        <Ionicons
          name="arrow-back"
          size={22}
          color="#172033"
        />
      </Pressable>

      <Text style={styles.headerTitle}>
        {headerTitle}
      </Text>

      <View style={{ width: 40 }} />
    </View>

    {loading ? (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#16A34A"
        />

        <Text style={styles.loadingText}>
          {t("loading")}{" "}
          {category
            ? translatedCategory
            : t("animals")}
          ...
        </Text>
      </View>
    ) : listings.length === 0 ? (
      <View style={styles.center}>
        <Text style={{ fontSize: 60 }}>
          {getAnimalEmoji(category)}
        </Text>

        <Text style={styles.emptyTitle}>
          {t("noAnimalsFound")}
        </Text>

        <Text style={styles.emptySub}>
          {t("tryAgainBrowseCategories")}
        </Text>
      </View>
    ) : (
      <FlatList
        data={listings}
        keyExtractor={(item, i) =>
          String(
            item.listing_id ||
              item.id ||
              i
          )
        }
        renderItem={renderItem}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 30,
        }}
        showsVerticalScrollIndicator={false}
      />
    )}
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAF7",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5EBE6",
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#172033",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  loadingText: {
    marginTop: 10,
    fontSize: 12,
    color: "#64748B",
    fontWeight: "700",
  },

  emptyTitle: {
    marginTop: 10,
    fontSize: 17,
    fontWeight: "900",
    color: "#334155",
    textAlign: "center",
  },

  emptySub: {
    marginTop: 6,
    fontSize: 12,
    color: "#94A3B8",
    textAlign: "center",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5EBE6",
    elevation: 2,
  },

  imageBox: {
    width: 100,
    height: 100,
    borderRadius: 14,
    backgroundColor: "#FFF4E8",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  emoji: {
    fontSize: 45,
  },

  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },

  title: {
    fontSize: 15,
    fontWeight: "900",
    color: "#172033",
  },

  breed: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 3,
  },

  price: {
    fontSize: 17,
    fontWeight: "900",
    color: "#EA580C",
    marginTop: 4,
  },

  location: {
    fontSize: 10,
    color: "#64748B",
    marginTop: 4,
  },
});

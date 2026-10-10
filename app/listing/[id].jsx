import React, { useEffect, useRef, useState } from "react";
import { useFavorite } from "../../src/context/FavoriteContext";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";

import api from "../../src/api";
import { useLanguage } from "../../src/i18n/LanguageContext";
import { useAuth } from "../../src/context/AuthContext";
import {
  addFavorite,
  removeFavorite,
  checkFavorite,
} from "../../src/api/listingApi";
import { createOrGetConversation } from "../../src/api/chatApi";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_HEIGHT = 320;

export default function ListingDetails() {
  const { id } = useLocalSearchParams();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { incrementCount, decrementCount } = useFavorite();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const flatListRef = useRef(null);

  const [isFavorite, setIsFavorite] = useState(false);
  const [savingFavorite, setSavingFavorite] = useState(false);

  const [startingChat, setStartingChat] = useState(false);

  /* VIEWABILITY REFS */
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentImageIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  /* LOAD LISTING */
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        if (!id) {
          setError("Listing ID missing");
          setLoading(false);
          return;
        }

        const response = await api.get(`/listings/${id}`);

        let data = null;

        if (response?.listing) data = response.listing;
        else if (response?.data?.listing) data = response.data.listing;
        else if (response?.data && typeof response.data === "object") {
          data = response.data;
        } else {
          data = response;
        }

        if (mounted) {
          setListing(data);

          // ✅ DEBUG
          console.log("🔍 LISTING DEBUG:");
          console.log("  user.id:", user?.id);
          console.log("  listing.seller_id:", data?.seller_id);
          console.log("  listing.seller?.id:", data?.seller?.id);
        }
      } catch (err) {
        console.log("❌ ERROR:", err?.message);

        if (mounted) {
          setError(
            err?.response?.data?.error ||
              err?.response?.data?.message ||
              err?.message ||
              t("unableToLoadListing")
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [id]);

  /* CHECK FAVORITE */
  useEffect(() => {
    let mounted = true;

    const checkFav = async () => {
      if (!id) return;

      try {
        const result = await checkFavorite(id);

        if (mounted) {
          setIsFavorite(Boolean(result));
        }
      } catch (err) {
        console.log("❌ Check fav error:", err?.message);
      }
    };

    checkFav();

    return () => {
      mounted = false;
    };
  }, [id]);

  /* TOGGLE FAVORITE */
  const handleToggleFavorite = async () => {
    if (!id || savingFavorite) return;

    try {
      setSavingFavorite(true);

      if (isFavorite) {
        await removeFavorite(id);
        setIsFavorite(false);
        decrementCount();

        Toast.show({
          type: "success",
          text1: "Removed from favorites",
          position: "bottom",
        });
      } else {
        await addFavorite(id);
        setIsFavorite(true);
        incrementCount();

        Toast.show({
          type: "success",
          text1: "Added to favorites ❤️",
          position: "bottom",
        });
      }
    } catch (err) {
      console.log("❌ Toggle fav error:", err?.message);

      Toast.show({
        type: "error",
        text1: "Favorite Error",
        text2: err?.response?.data?.error || "Unable to update",
        position: "bottom",
      });
    } finally {
      setSavingFavorite(false);
    }
  };

  /* START CHAT */
  const handleStartChat = async () => {
    if (!id || startingChat) return;

    try {
      setStartingChat(true);

      const response = await createOrGetConversation(id);

      const conversationId =
        response?.conversation?.id ||
        response?.data?.conversation?.id ||
        response?.conversation_id ||
        response?.data?.conversation_id ||
        response?.id ||
        response?.data?.id;

      if (!conversationId) {
        throw new Error("Conversation ID missing");
      }

      const sellerName =
        listing?.seller?.name ||
        listing?.seller?.full_name ||
        "Seller";

      const sellerPhone =
        listing?.seller?.phone ||
        listing?.seller?.mobile ||
        "";

      router.push({
        pathname: "/chat/[id]",
        params: {
          id: String(conversationId),
          name: sellerName,
          phone: sellerPhone,
        },
      });
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Unable to start chat";

      Toast.show({
        type: "error",
        text1: "Chat Error",
        text2: message,
        position: "bottom",
      });
    } finally {
      setStartingChat(false);
    }
  };

  /* IMAGE HELPERS */
  const getImageUrl = (img) => {
    if (!img) return null;
    if (typeof img === "string") return img;

    return (
      img?.media_url ||
      img?.url ||
      img?.image_url ||
      img?.secure_url ||
      img?.cloudinary_url ||
      null
    );
  };

  const getImagesArray = (item) => {
    if (!item) return [];

    const result = [];

    if (Array.isArray(item.images) && item.images.length > 0) {
      item.images.forEach((img) => {
        const url = getImageUrl(img);
        if (url) result.push(url);
      });
    }

    if (result.length === 0) {
      const single =
        item.image_url ||
        item.image ||
        item.primary_image ||
        item.thumbnail;

      if (typeof single === "string" && single.startsWith("http")) {
        result.push(single);
      }
    }

    return result;
  };

  /* TRANSLATION HELPERS */
  const getGenderName = (gender) => {
    const value = String(gender || "").toLowerCase();

    if (value === "male") return t("male");
    if (value === "female") return t("female");

    return gender;
  };

  const getStatusName = (status) => {
    const value = String(status || "").toUpperCase();

    if (value === "ACTIVE") return t("active") || "Active";
    if (value === "SOLD") return t("sold") || "Sold";
    if (value === "PENDING") return t("pending") || "Pending";
    if (value === "PENDING_REVIEW")
      return t("pendingReview") || "Pending Review";
    if (value === "REJECTED") return t("rejected") || "Rejected";

    return String(status || "").replace(/_/g, " ");
  };

  const getTranslatedTitle = (title) => {
    if (!title) return t("animal");

    const titleValue = String(title).trim();
    const lower = titleValue.toLowerCase();

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

  const getTranslatedCategory = (catName) => {
    const value = String(catName || "").toLowerCase();

    if (value.includes("buffalo")) return t("buffalo");
    if (value.includes("calf")) return t("calf");
    if (value.includes("cow")) return t("cow");
    if (value.includes("goat")) return t("goat");
    if (value.includes("sheep")) return t("sheep");
    if (value.includes("poultry") || value.includes("chicken"))
      return t("poultry");
    if (value.includes("dog")) return t("dog");
    if (value.includes("cat")) return t("cat");

    return catName;
  };

  /* LOADING */
  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.header}>
          <Pressable style={styles.back} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </Pressable>

          <Text style={styles.headerTitle}>
            {t("details") || "Details"}
          </Text>

          <View style={styles.headerSpace} />
        </View>

        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#16A34A" />
          <Text style={styles.loadingText}>{t("loading")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  /* ERROR */
  if (error || !listing) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.header}>
          <Pressable style={styles.back} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </Pressable>

          <Text style={styles.headerTitle}>
            {t("details") || "Details"}
          </Text>

          <View style={styles.headerSpace} />
        </View>

        <View style={styles.errorContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={60}
            color="#DC2626"
          />

          <Text style={styles.errorTitle}>
            {t("listingNotFound") || "Listing not found"}
          </Text>

          <Text style={styles.errorText}>
            {error || t("listingCouldNotBeLoaded") || "Unable to load"}
          </Text>

          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>
              {t("goBack") || "Go Back"}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  /* DATA */
  const images = getImagesArray(listing);

  const category =
    listing?.category?.name ||
    listing?.category_name ||
    (typeof listing?.category === "string" ? listing.category : "") ||
    t("animal");

  const breed =
    listing?.breed?.name ||
    listing?.breed_name ||
    (typeof listing?.breed === "string" ? listing.breed : "") ||
    "";

  const price = Number(listing?.price || 0);

  /* ✅ ROBUST isOwnListing CHECK */
  const listingSellerId =
    listing?.seller_id ??
    listing?.seller?.id ??
    listing?.sellerId ??
    null;

  const currentUserId = user?.id ?? user?.user_id ?? null;

  const isOwnListing = Boolean(
    currentUserId &&
      listingSellerId &&
      String(currentUserId) === String(listingSellerId)
  );

  /* GALLERY NAVIGATION */
  const goToPrevImage = () => {
    if (currentImageIndex > 0) {
      const newIndex = currentImageIndex - 1;
      setCurrentImageIndex(newIndex);
      flatListRef.current?.scrollToIndex({
        index: newIndex,
        animated: true,
      });
    }
  };

  const goToNextImage = () => {
    if (currentImageIndex < images.length - 1) {
      const newIndex = currentImageIndex + 1;
      setCurrentImageIndex(newIndex);
      flatListRef.current?.scrollToIndex({
        index: newIndex,
        animated: true,
      });
    }
  };

  /* UI */
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </Pressable>

        <Text style={styles.headerTitle}>
          {t("details") || "Details"}
        </Text>

        {/* ✅ FAVORITE — only for buyers */}
        {!isOwnListing ? (
          <Pressable
            style={styles.favButton}
            onPress={handleToggleFavorite}
            disabled={savingFavorite}
            hitSlop={8}
          >
            {savingFavorite ? (
              <ActivityIndicator size="small" color="#EF4444" />
            ) : (
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={22}
                color={isFavorite ? "#EF4444" : "#111827"}
              />
            )}
          </Pressable>
        ) : (
          <View style={styles.headerSpace} />
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* IMAGE GALLERY */}
        <View style={styles.galleryContainer}>
          {images.length > 0 ? (
            <>
              <FlatList
                ref={flatListRef}
                data={images}
                keyExtractor={(img, idx) => String(idx)}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                getItemLayout={(data, index) => ({
                  length: SCREEN_WIDTH,
                  offset: SCREEN_WIDTH * index,
                  index,
                })}
                renderItem={({ item }) => (
                  <Image
                    source={{ uri: item }}
                    style={styles.galleryImage}
                    resizeMode="cover"
                  />
                )}
              />

              {images.length > 1 && currentImageIndex > 0 && (
                <Pressable
                  style={[styles.chevron, styles.chevronLeft]}
                  onPress={goToPrevImage}
                >
                  <Ionicons
                    name="chevron-back"
                    size={26}
                    color="#FFFFFF"
                  />
                </Pressable>
              )}

              {images.length > 1 &&
                currentImageIndex < images.length - 1 && (
                  <Pressable
                    style={[styles.chevron, styles.chevronRight]}
                    onPress={goToNextImage}
                  >
                    <Ionicons
                      name="chevron-forward"
                      size={26}
                      color="#FFFFFF"
                    />
                  </Pressable>
                )}

              <View style={styles.imageCounter}>
                <Ionicons
                  name="images-outline"
                  size={12}
                  color="#FFFFFF"
                />

                <Text style={styles.imageCounterText}>
                  {currentImageIndex + 1} / {images.length}
                </Text>
              </View>

              {images.length > 1 && images.length <= 10 && (
                <View style={styles.dotsContainer}>
                  {images.map((_, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.dot,
                        idx === currentImageIndex && styles.dotActive,
                      ]}
                    />
                  ))}
                </View>
              )}
            </>
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.emoji}>🐄</Text>
              <Text style={styles.noImageText}>
                {t("noImagesAvailable") || "No images available"}
              </Text>
            </View>
          )}
        </View>

        {/* THUMBNAILS */}
        {images.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailStrip}
          >
            {images.map((img, idx) => (
              <Pressable
                key={idx}
                onPress={() => {
                  setCurrentImageIndex(idx);
                  flatListRef.current?.scrollToIndex({
                    index: idx,
                    animated: true,
                  });
                }}
                style={[
                  styles.thumbnailWrapper,
                  idx === currentImageIndex &&
                    styles.thumbnailWrapperActive,
                ]}
              >
                <Image source={{ uri: img }} style={styles.thumbnail} />
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* DETAILS */}
        <View style={styles.detailsCard}>
          <Text style={styles.title}>
            {getTranslatedTitle(listing?.title)}
          </Text>

          <Text style={styles.category}>
            {getTranslatedCategory(category)}
            {breed ? ` • ${breed}` : ""}
          </Text>

          <Text style={styles.price}>
            ₹{price.toLocaleString("en-IN")}
          </Text>

          <View style={styles.divider} />

          {listing?.gender ? (
            <View style={styles.row}>
              <Text style={styles.label}>{t("gender")}</Text>
              <Text style={styles.value}>
                {getGenderName(listing.gender)}
              </Text>
            </View>
          ) : null}

          {listing?.age ? (
            <View style={styles.row}>
              <Text style={styles.label}>{t("age")}</Text>
              <Text style={styles.value}>{listing.age}</Text>
            </View>
          ) : null}

          {listing?.weight ? (
            <View style={styles.row}>
              <Text style={styles.label}>{t("weight")}</Text>
              <Text style={styles.value}>{listing.weight} kg</Text>
            </View>
          ) : null}

          {listing?.colour ? (
            <View style={styles.row}>
              <Text style={styles.label}>
                {t("colour") || "Colour"}
              </Text>
              <Text style={styles.value}>{listing.colour}</Text>
            </View>
          ) : null}

          {listing?.status ? (
            <View style={styles.row}>
              <Text style={styles.label}>
                {t("status") || "Status"}
              </Text>
              <Text style={styles.status}>
                {getStatusName(listing.status)}
              </Text>
            </View>
          ) : null}

          {listing?.description ? (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>
                {t("description") || "Description"}
              </Text>
              <Text style={styles.description}>
                {listing.description}
              </Text>
            </>
          ) : null}

          {(listing?.area ||
            listing?.city ||
            listing?.district ||
            listing?.state) && (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>
                {t("location") || "Location"}
              </Text>
              <Text style={styles.location}>
                {[
                  listing.area,
                  listing.city,
                  listing.district,
                  listing.state,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </Text>
            </>
          )}
        </View>

        {/* ✅ CHAT BUTTON — always visible (backend blocks own listing) */}
        <Pressable
          style={[
            styles.chatButton,
            startingChat && styles.chatButtonDisabled,
          ]}
          onPress={handleStartChat}
          disabled={startingChat}
        >
          {startingChat ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Ionicons
                name="chatbubble-outline"
                size={20}
                color="#FFFFFF"
              />
              <Text style={styles.chatButtonText}>
                {t("chatWithSeller") || "Chat with Seller"}
              </Text>
            </>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F6FAF7" },
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
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#111827",
  },
  headerSpace: { width: 42 },
  favButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5EBE6",
  },
  content: { paddingBottom: 40 },
  galleryContainer: {
    width: "100%",
    height: IMAGE_HEIGHT,
    position: "relative",
    backgroundColor: "#E5E7EB",
  },
  galleryImage: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
  },
  chevron: {
    position: "absolute",
    top: IMAGE_HEIGHT / 2 - 22,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  chevronLeft: { left: 14 },
  chevronRight: { right: 14 },
  imageCounter: {
    position: "absolute",
    top: 14,
    right: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.6)",
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
  },
  imageCounterText: {
    marginLeft: 5,
    fontSize: 11,
    color: "#FFFFFF",
    fontWeight: "800",
  },
  dotsContainer: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  dotActive: { width: 18, backgroundColor: "#FFFFFF" },
  imagePlaceholder: {
    width: "100%",
    height: IMAGE_HEIGHT,
    backgroundColor: "#EAF8EF",
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: { fontSize: 80 },
  noImageText: {
    marginTop: 10,
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },
  thumbnailStrip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  thumbnailWrapper: {
    width: 60,
    height: 60,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
    backgroundColor: "#F3F4F6",
  },
  thumbnailWrapperActive: { borderColor: "#16A34A" },
  thumbnail: { width: "100%", height: "100%" },
  detailsCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 18,
    marginTop: 6,
    padding: 20,
    borderRadius: 20,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111827",
  },
  category: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 7,
  },
  price: {
    fontSize: 25,
    fontWeight: "900",
    color: "#EA580C",
    marginTop: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 17,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 7,
  },
  label: { fontSize: 14, color: "#6B7280" },
  value: { fontSize: 14, fontWeight: "700", color: "#111827" },
  status: { fontSize: 14, fontWeight: "800", color: "#D97706" },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: "#4B5563",
    marginTop: 8,
  },
  location: {
    fontSize: 14,
    color: "#4B5563",
    marginTop: 8,
    lineHeight: 21,
  },
  chatButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 18,
    marginTop: 16,
    marginBottom: 20,
    height: 54,
    borderRadius: 15,
    backgroundColor: "#16A34A",
    gap: 8,
    elevation: 3,
  },
  chatButtonDisabled: {
    opacity: 0.6,
  },
  chatButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { marginTop: 12, color: "#6B7280" },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  errorTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#111827",
    marginTop: 15,
  },
  errorText: {
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
  },
  backButton: {
    marginTop: 20,
    backgroundColor: "#16A34A",
    paddingHorizontal: 25,
    paddingVertical: 13,
    borderRadius: 13,
  },
  backButtonText: { color: "#FFFFFF", fontWeight: "800" },
});
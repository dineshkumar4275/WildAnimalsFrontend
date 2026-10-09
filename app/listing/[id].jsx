import React, { useEffect, useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { addFavorite, getListing } from "../../src/api/listingApi";
import { createConversation } from "../../src/api/chatApi";
import { COLORS } from "../../src/constants/colors";
import { formatPrice } from "../../src/utils/format";
import Loading from "../../src/components/Loading";

export default function ListingDetails() {
  const { id } = useLocalSearchParams();
  const [listing, setListing] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    getListing(id)
      .then((response) => {
        setListing(response.listing);
        setImages(response.images || []);
      })
      .catch((error) => Alert.alert("Error", error.response?.data?.message || "Listing not found"));
  }, [id]);

  async function startChat() {
    try {
      const response = await createConversation(id);
      router.push(`/chat/${response.conversation.id}`);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Unable to start chat");
    }
  }

  async function favorite() {
    try {
      await addFavorite(id);
      Alert.alert("Saved", "Added to favorites");
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Unable to save");
    }
  }

  if (!listing) return <Loading />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
        {images.map((image) => (
          <Image key={image.id} source={{ uri: image.media_url }} style={styles.image} />
        ))}
      </ScrollView>

      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.title}>{listing.title}</Text>
          <Pressable onPress={favorite}>
            <Text style={styles.heart}>♡</Text>
          </Pressable>
        </View>

        <Text style={styles.price}>{formatPrice(listing.price)}</Text>
        <Text style={styles.category}>{listing.category}</Text>

        <View style={styles.box}>
          <Text>Breed: {listing.breed || "Not specified"}</Text>
          <Text>Gender: {listing.gender || "Not specified"}</Text>
          <Text>Age: {listing.age || "Not specified"}</Text>
          <Text>Weight: {listing.weight || "Not specified"}</Text>
          <Text>Colour: {listing.colour || "Not specified"}</Text>
        </View>

        <Text style={styles.heading}>Location</Text>
        <Text style={styles.muted}>
          {listing.area}, {listing.city}, {listing.district}
        </Text>

        <Text style={styles.heading}>Description</Text>
        <Text style={styles.description}>{listing.description || "No description"}</Text>

        <Text style={styles.heading}>Seller</Text>
        <Text style={styles.muted}>{listing.seller_name}</Text>

        <Pressable style={styles.button} onPress={startChat}>
          <Text style={styles.buttonText}>Chat with Seller</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.buyButton]}
          onPress={() => router.push(`/payment/checkout?listingId=${id}`)}
        >
          <Text style={styles.buttonText}>Buy Now</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  image: {
    width: 390,
    height: 280,
    backgroundColor: "#eee",
  },
  content: {
    padding: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    flex: 1,
    fontSize: 25,
    fontWeight: "800",
  },
  heart: {
    fontSize: 35,
  },
  price: {
    fontSize: 24,
    fontWeight: "800",
    marginTop: 10,
  },
  category: {
    color: COLORS.primary,
    fontWeight: "700",
    marginTop: 4,
  },
  box: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 12,
    marginTop: 18,
    gap: 8,
  },
  heading: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 20,
    marginBottom: 6,
  },
  muted: {
    color: COLORS.muted,
  },
  description: {
    lineHeight: 22,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
  buyButton: {
    backgroundColor: COLORS.primaryDark,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 16,
  },
});

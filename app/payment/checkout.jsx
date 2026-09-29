import React, { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { createOrder } from "../../src/api/paymentApi";
import { COLORS } from "../../src/constants/colors";
import { formatPrice } from "../../src/utils/format";

export default function Checkout() {
  const { listingId } = useLocalSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    createOrder(listingId)
      .then(setData)
      .catch((error) => Alert.alert("Payment", error.response?.data?.message || "Unable to create order"))
      .finally(() => setLoading(false));
  }, [listingId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Creating secure order...</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.center}>
        <Text>Unable to create payment order.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>
      <Text style={styles.price}>{formatPrice(data.transaction.animal_price)}</Text>
      <Text style={styles.info}>Platform fee is calculated by the backend.</Text>

      <Pressable
        style={styles.button}
        onPress={() =>
          Alert.alert(
            "Razorpay",
            "Razorpay Checkout SDK should be integrated here using the order returned by the backend."
          )
        }
      >
        <Text style={styles.buttonText}>Continue to Payment</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
  },
  price: {
    fontSize: 30,
    fontWeight: "800",
    marginTop: 25,
  },
  info: {
    color: COLORS.muted,
    marginTop: 10,
  },
  button: {
    marginTop: 30,
    padding: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "800",
  },
});

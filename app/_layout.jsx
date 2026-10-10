import React from "react";
import { Stack } from "expo-router";
import Toast from "react-native-toast-message";

import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider } from "../src/context/AuthContext";
import { LanguageProvider } from "../src/i18n/LanguageContext";
import { FavoriteProvider } from "../src/context/FavoriteContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <AuthProvider>
          <FavoriteProvider>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            >
              {/* TABS - MAIN */}
              <Stack.Screen name="(tabs)" />

              {/* LISTINGS */}
              <Stack.Screen name="listings" />
              <Stack.Screen name="listing/[id]" />
              <Stack.Screen name="listing/create" />
              <Stack.Screen name="listing/my-listings" />

              {/* SELLER */}
              <Stack.Screen name="(seller)" />

              {/* AUTH */}
              <Stack.Screen name="(auth)" />

              {/* CHAT */}
              <Stack.Screen name="chat/[id]" />
            </Stack>

            <Toast />
          </FavoriteProvider>
        </AuthProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
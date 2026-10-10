import { router } from "expo-router";

/**
 * Safe back navigation.
 * Uses native back if a stack exists; otherwise replaces with `fallback`.
 *
 * Usage:
 *   goBackSafe("/(auth)/buyer-login");
 */
export function goBackSafe(fallback = "/(tabs)") {
  try {
    if (router.canGoBack?.()) {
      router.back();
      return;
    }
  } catch (e) {
    // ignore and fall through to replace
  }

  router.replace(fallback);
}
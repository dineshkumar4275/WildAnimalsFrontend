import React, { useState, useCallback } from "react";

import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  RefreshControl,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";

import { useAuth } from "../../src/context/AuthContext";
import { getDashboardStats } from "../../src/api/sellerApi";

// =====================================================
// FORMAT CURRENCY (₹ Indian)
// =====================================================

function formatCurrency(value) {
  if (!value && value !== 0) return "₹ 0";

  return (
    "₹ " +
    Number(value).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })
  );
}

// =====================================================
// STAT CARD
// =====================================================

function StatCard({
  icon,
  iconBg,
  iconColor,
  title,
  subtitle,
  value,
  loading = false,
  showArrow = true,
  showProgress = false,
  progress = 0,
}) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statTopRow}>
        <View style={[styles.statIconBox, { backgroundColor: iconBg }]}>
          <Ionicons name={icon} size={16} color={iconColor} />
        </View>

        <Text style={styles.statTitle} numberOfLines={1}>
          {title}
        </Text>

        {showArrow && (
          <Ionicons
            name="arrow-up-outline"
            size={16}
            color="#1F2937"
            style={styles.statArrow}
          />
        )}
      </View>

      <Text style={styles.statSubtitle}>{subtitle}</Text>

      <View style={styles.statBottomRow}>
        {loading ? (
          <ActivityIndicator size="small" color="#2E8B57" />
        ) : (
          <Text style={styles.statValue} numberOfLines={1}>
            {value}
          </Text>
        )}

        {showProgress && (
          <View style={styles.progressWrapper}>
            <Text style={styles.progressText}>{progress}%</Text>
          </View>
        )}
      </View>
    </View>
  );
}

// =====================================================
// SELLER DASHBOARD
// =====================================================

export default function SellerDashboard() {
  const { user } = useAuth();

  const [range, setRange] = useState("Today");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Notification count (placeholder — backend API illa na 0)
  const [unreadCount, setUnreadCount] = useState(0);

  // ===================================================
  // FETCH DASHBOARD
  // ===================================================

  const loadDashboard = useCallback(async (isRefresh = false) => {
    try {
      setError(null);

      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const data = await getDashboardStats();

      console.log("📊 DASHBOARD DATA:", data);

      setStats(data);
    } catch (err) {
      console.log(
        "❌ Dashboard error:",
        err?.response?.data?.message || err?.message
      );

      setError(
        err?.response?.data?.message || "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // ===================================================
  // FETCH NOTIFICATIONS (optional)
  // ===================================================

  const loadNotifications = useCallback(async () => {
    try {
      // Uncomment pannunga, unga backend la API irundha
      // const res = await api.get("/seller/notifications/unread-count");
      // setUnreadCount(res?.data?.data?.count || 0);

      // Ippo placeholder
      setUnreadCount(0);
    } catch (err) {
      console.log("⚠️ Notifications error:", err?.message);
      setUnreadCount(0);
    }
  }, []);

  // ===================================================
  // RELOAD ON FOCUS
  // ===================================================

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
      loadNotifications();
    }, [loadDashboard, loadNotifications])
  );

  // ===================================================
  // HANDLERS
  // ===================================================

  const toggleRange = () => {
    setRange((prev) => (prev === "Today" ? "This Week" : "Today"));
  };

  const handleNotifications = () => {
    router.push("/(seller)/notifications");
  };

  const shopName = user?.shopName || user?.name || "Seller";

  // ===================================================
  // ANALYTICS BARS
  // ===================================================

  const analytics = stats?.analytics || [];

  const maxRevenue = Math.max(
    ...analytics.map((a) => a.revenue),
    1
  );

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadDashboard(true)}
            colors={["#2E8B57"]}
          />
        }
      >
        {/* ============ HEADER ============ */}

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>
              Hello <Text style={styles.greetingBold}>{shopName}</Text>,
            </Text>

            <Text style={styles.greetingSub}>
              Here's how your shop's doing
            </Text>
          </View>

          <Pressable
            onPress={handleNotifications}
            style={styles.bellButton}
          >
            <Ionicons
              name="notifications-outline"
              size={22}
              color="#2E8B57"
            />

            {unreadCount > 0 && (
              <View style={styles.bellBadge}>
                <Text style={styles.bellBadgeText}>
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* ============ RANGE ROW ============ */}

        <View style={styles.rangeRow}>
          <Pressable onPress={toggleRange} style={styles.rangePill}>
            <Text style={styles.rangeText}>{range}</Text>
            <Ionicons name="chevron-up" size={15} color="#1F2937" />
          </Pressable>

          <Pressable style={styles.reportsBtn}>
            <Text style={styles.reportsText}>View reports</Text>
          </Pressable>
        </View>

        {/* ============ ERROR ============ */}

        {error && (
          <View style={styles.errorBox}>
            <Ionicons
              name="alert-circle-outline"
              size={18}
              color="#DC2626"
            />
            <Text style={styles.errorText}>{error}</Text>

            <Pressable onPress={() => loadDashboard()}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        )}

        {/* ============ STATS GRID ============ */}

        <View style={styles.statsGrid}>
          <View style={styles.statsCol}>
            <StatCard
              icon="pie-chart"
              iconBg="#E7F5EC"
              iconColor="#2E8B57"
              title="Revenue"
              subtitle="Total revenue"
              value={formatCurrency(stats?.revenue)}
              loading={loading}
              showProgress
              progress={0}
            />

            <StatCard
              icon="document-text"
              iconBg="#E7F5EC"
              iconColor="#2E8B57"
              title="Orders"
              subtitle="Total orders"
              value={String(stats?.orders ?? 0)}
              loading={loading}
              showProgress
              progress={0}
            />
          </View>

          <View style={styles.statsCol}>
            <StatCard
              icon="ribbon"
              iconBg="#E7F5EC"
              iconColor="#2E8B57"
              title="Sales"
              subtitle="Total sales"
              value={String(stats?.sales ?? 0)}
              loading={loading}
              showProgress
              progress={0}
            />

            <StatCard
              icon="people"
              iconBg="#E7F5EC"
              iconColor="#2E8B57"
              title="Customers"
              subtitle="Total customers"
              value={String(stats?.customers ?? 0)}
              loading={loading}
              showProgress
              progress={0}
            />
          </View>
        </View>

        {/* ============ WIDE STATS ============ */}

        <View style={styles.statsGrid}>
          <View style={styles.statsCol}>
            <StatCard
              icon="cube"
              iconBg="#E7F5EC"
              iconColor="#2E8B57"
              title="Total Products"
              subtitle=""
              value={String(stats?.totalProducts ?? 0)}
              loading={loading}
              showArrow={false}
            />
          </View>

          <View style={styles.statsCol}>
            <StatCard
              icon="layers"
              iconBg="#FFF1DD"
              iconColor="#F28C28"
              title="Out of stock"
              subtitle=""
              value={String(stats?.outOfStock ?? 0)}
              loading={loading}
              showArrow={false}
            />
          </View>
        </View>

        {/* ============ SALES ANALYTICS ============ */}

        <Text style={styles.sectionTitle}>Sales analytics</Text>

        <View style={styles.analyticsCard}>
          <View style={styles.analyticsHeader}>
            <Text style={styles.analyticsTitle}>This week</Text>
            <Text style={styles.analyticsValue}>
              {formatCurrency(stats?.weekRevenue)}
            </Text>
          </View>

          {loading ? (
            <View style={styles.analyticsLoading}>
              <ActivityIndicator color="#2E8B57" />
            </View>
          ) : (
            <View style={styles.barsRow}>
              {analytics.map((item, i) => {
                const h =
                  item.revenue > 0
                    ? Math.max(
                        (item.revenue / maxRevenue) * 80,
                        8
                      )
                    : 4;

                const isToday =
                  i === analytics.length - 1;

                return (
                  <View key={i} style={styles.barWrapper}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: h,
                          backgroundColor: isToday
                            ? "#2E8B57"
                            : "#D6EDDD",
                        },
                      ]}
                    />
                    <Text style={styles.barLabel}>
                      {item.day}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* ============ QUICK ACTIONS ============ */}

        <Text style={styles.sectionTitle}>Quick actions</Text>

        <Pressable
          onPress={() => router.push("/(seller)/add-listing")}
          style={styles.actionRow}
        >
          <View
            style={[styles.actionIcon, { backgroundColor: "#FFF1DD" }]}
          >
            <Ionicons name="add-circle" size={20} color="#F28C28" />
          </View>
          <Text style={styles.actionText}>Add Animal</Text>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </Pressable>

        <Pressable
          onPress={() => router.push("/(seller)/my-listings")}
          style={styles.actionRow}
        >
          <View
            style={[styles.actionIcon, { backgroundColor: "#E7F5EC" }]}
          >
            <Ionicons name="list" size={20} color="#2E8B57" />
          </View>
          <Text style={styles.actionText}>My Listings</Text>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </Pressable>

        <Pressable
          onPress={() => router.push("/(seller)/messages")}
          style={styles.actionRow}
        >
          <View
            style={[styles.actionIcon, { backgroundColor: "#EDE9FE" }]}
          >
            <Ionicons name="chatbubbles" size={20} color="#7C3AED" />
          </View>
          <Text style={styles.actionText}>Buyer Messages</Text>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </Pressable>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  container: { flex: 1 },
  content: { padding: 18, paddingBottom: 24 },

  /* ---------------- Header ---------------- */

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  headerLeft: { flex: 1, paddingRight: 12 },
  greeting: {
    fontSize: 17,
    color: "#111827",
    fontWeight: "500",
  },
  greetingBold: { fontWeight: "900", color: "#111827" },
  greetingSub: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
  },
  bellButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  bellBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: "#F04444",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  bellBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
  },

  /* ---------------- Range row ---------------- */

  rangeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  rangePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  rangeText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1F2937",
  },
  reportsBtn: { paddingVertical: 6 },
  reportsText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#2E8B57",
  },

  /* ---------------- Error box ---------------- */

  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    color: "#991B1B",
  },
  retryText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#DC2626",
  },

  /* ---------------- Stats ---------------- */

  statsGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  statsCol: { flex: 1, gap: 10 },

  statCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#EEF1F3",
    minHeight: 115,
    justifyContent: "space-between",
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  statTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statIconBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  statTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
  },
  statArrow: { marginLeft: 2 },
  statSubtitle: {
    fontSize: 10,
    color: "#9CA3AF",
    marginTop: 6,
  },
  statBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  statValue: {
    fontSize: 17,
    fontWeight: "900",
    color: "#111827",
    flexShrink: 1,
  },
  progressWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "#F3F4F6",
    borderTopColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
  },
  progressText: {
    fontSize: 8,
    fontWeight: "800",
    color: "#111827",
  },

  /* ---------------- Section ---------------- */

  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111827",
    marginTop: 16,
    marginBottom: 12,
  },

  /* ---------------- Analytics ---------------- */

  analyticsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EEF1F3",
    marginBottom: 8,
  },
  analyticsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  analyticsTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
  },
  analyticsValue: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111827",
  },
  analyticsLoading: {
    height: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  barsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 100,
  },
  barWrapper: {
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  bar: { width: 22, borderRadius: 6 },
  barLabel: {
    fontSize: 10,
    color: "#9CA3AF",
    fontWeight: "700",
  },

  /* ---------------- Quick actions ---------------- */

  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 13,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#EEF1F3",
  },
  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },
});
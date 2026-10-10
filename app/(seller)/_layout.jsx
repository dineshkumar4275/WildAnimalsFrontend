// // import React, { useCallback, useState } from "react";
// // import { Tabs, Redirect, useFocusEffect } from "expo-router";
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   ActivityIndicator,
// // } from "react-native";
// // import { Ionicons } from "@expo/vector-icons";

// // import { COLORS } from "../../src/constants/colors";
// // import { useAuth } from "../../src/context/AuthContext";
// // import { getMyConversations } from "../../src/api/chatApi";

// // const GREEN = COLORS?.primary || "#16834A";
// // const MUTED = COLORS?.muted || "#89938C";

// // const TAB_CONFIG = {
// //   index: {
// //     label: "Dashboard",
// //     activeIcon: "grid",
// //     inactiveIcon: "grid-outline",
// //   },
// //   "my-listings": {
// //     label: "Listings",
// //     activeIcon: "list",
// //     inactiveIcon: "list-outline",
// //   },
// //   messages: {
// //     label: "Messages",
// //     activeIcon: "chatbubbles",
// //     inactiveIcon: "chatbubbles-outline",
// //   },
// //   profile: {
// //     label: "Profile",
// //     activeIcon: "person",
// //     inactiveIcon: "person-outline",
// //   },
// // };

// // function TabIcon({ routeName, focused, badgeCount = 0 }) {
// //   const config = TAB_CONFIG[routeName];
// //   if (!config) return null;

// //   const iconName = focused ? config.activeIcon : config.inactiveIcon;

// //   return (
// //     <View style={styles.iconContainer}>
// //       <View
// //         style={[
// //           styles.iconBackground,
// //           focused && styles.activeIconBackground,
// //         ]}
// //       >
// //         <Ionicons
// //           name={iconName}
// //           size={23}
// //           color={focused ? GREEN : MUTED}
// //         />
// //       </View>

// //       <Text
// //         style={[
// //           styles.tabLabel,
// //           { color: focused ? GREEN : MUTED },
// //           focused && styles.activeTabLabel,
// //         ]}
// //         numberOfLines={1}
// //       >
// //         {config.label}
// //       </Text>

// //       {focused && <View style={styles.activeIndicator} />}

// //       {/* ✅ BADGE — iconContainer la (iconBackground veliya) */}
// //       {routeName === "messages" && badgeCount > 0 && (
// //         <View style={styles.badge}>
// //           <Text style={styles.badgeText}>
// //             {badgeCount > 99 ? "99+" : badgeCount}
// //           </Text>
// //         </View>
// //       )}
// //     </View>
// //   );
// // }

// // export default function SellerTabLayout() {
// //   const { user, loading } = useAuth();

// //   const [unreadCount, setUnreadCount] = useState(0);

// //   const loadUnread = useCallback(async () => {
// //     try {
// //       const response = await getMyConversations();

// //       console.log("🔔 RESPONSE:", response);

// //       let total =
// //         response?.total_unread ??
// //         response?.data?.total_unread;

// //       if (total === undefined || total === null) {
// //         const conversations =
// //           response?.conversations ||
// //           response?.data?.conversations ||
// //           response?.data ||
// //           response ||
// //           [];

// //         if (Array.isArray(conversations)) {
// //           total = conversations.reduce((sum, c) => {
// //             const count =
// //               c?.unread_count ||
// //               c?.unreadCount ||
// //               (c?.latest_message?.is_read === false ? 1 : 0);

// //             return sum + Number(count || 0);
// //           }, 0);
// //         }
// //       }

// //       console.log("🔔 TOTAL UNREAD:", total);

// //       setUnreadCount(Number(total) || 0);
// //     } catch (error) {
// //       console.log("❌ Unread error:", error?.message);
// //       setUnreadCount(0);
// //     }
// //   }, []);

// //   useFocusEffect(
// //     useCallback(() => {
// //       if (!user) return;

// //       const role = String(user?.role || user?.user_role || "")
// //         .trim()
// //         .toUpperCase();

// //       if (role === "SELLER") loadUnread();
// //     }, [user, loadUnread])
// //   );

// //   if (loading) {
// //     return (
// //       <View style={styles.loading}>
// //         <ActivityIndicator size="large" color={GREEN} />
// //       </View>
// //     );
// //   }

// //   if (!user) return <Redirect href="/buyer-login" />;

// //   const role = String(user?.role || user?.user_role || "")
// //     .trim()
// //     .toUpperCase();

// //   if (role !== "SELLER") return <Redirect href="/buyer-login" />;

// //   return (
// //     <Tabs
// //       screenOptions={{
// //         headerShown: false,
// //         tabBarShowLabel: false,
// //         tabBarStyle: styles.tabBar,
// //         tabBarItemStyle: styles.tabBarItem,
// //         tabBarHideOnKeyboard: true,
// //         animation: "shift",
// //       }}
// //     >
// //       {Object.keys(TAB_CONFIG).map((routeName) => (
// //         <Tabs.Screen
// //           key={routeName}
// //           name={routeName}
// //           options={{
// //             tabBarIcon: ({ focused }) => (
// //               <TabIcon
// //                 routeName={routeName}
// //                 focused={focused}
// //                 badgeCount={unreadCount}
// //               />
// //             ),
// //           }}
// //         />
// //       ))}

// //       <Tabs.Screen name="add-listing" options={{ href: null }} />
// //       <Tabs.Screen name="apply" options={{ href: null }} />
// //     </Tabs>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   loading: {
// //     flex: 1,
// //     backgroundColor: "#F6FAF7",
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   tabBar: {
// //     height: 108,
// //     paddingTop: 8,
// //     paddingBottom: 8,
// //     paddingHorizontal: 4,
// //     backgroundColor: "#FFFFFF",
// //     borderTopWidth: 1,
// //     borderTopColor: "#EDF1ED",
// //     elevation: 12,
// //     shadowColor: "#183D25",
// //     shadowOffset: { width: 0, height: -4 },
// //     shadowOpacity: 0.06,
// //     shadowRadius: 12,
// //   },
// //   tabBarItem: { height: 62 },
// //   iconContainer: {
// //     width: "100%",
// //     height: 62,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     gap: 3,
// //     position: "relative",   // ✅ ADD — badge position la
// //   },
// //   iconBackground: {
// //     width: 48,
// //     height: 34,
// //     borderRadius: 13,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   activeIconBackground: { backgroundColor: "#E8F6EC" },
// //   tabLabel: {
// //     fontSize: 10,
// //     fontWeight: "500",
// //     letterSpacing: 0.1,
// //   },
// //   activeTabLabel: { fontWeight: "700" },
// //   activeIndicator: {
// //     position: "absolute",
// //     bottom: 0,
// //     width: 16,
// //     height: 3,
// //     borderRadius: 3,
// //     backgroundColor: GREEN,
// //   },
// //   badge: {
// //     position: "absolute",
// //     top: 0,
// //     right: 12,
// //     minWidth: 18,
// //     height: 18,
// //     borderRadius: 9,
// //     paddingHorizontal: 4,
// //     backgroundColor: "#F04444",
// //     borderWidth: 1.5,
// //     borderColor: "#FFFFFF",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     zIndex: 10,
// //   },
// //   badgeText: {
// //     color: "#FFFFFF",
// //     fontSize: 9,
// //     fontWeight: "800",
// //   },
// // });
// ```jsx
// import React, {
//   useCallback,
//   useState,
// } from "react";

// import {
//   Tabs,
//   Redirect,
//   useFocusEffect,
// } from "expo-router";

// import {
//   View,
//   Text,
//   StyleSheet,
//   ActivityIndicator,
// } from "react-native";

// import { Ionicons } from "@expo/vector-icons";

// import { COLORS } from "../../src/constants/colors";
// import { useAuth } from "../../src/context/AuthContext";
// import { getMyConversations } from "../../src/api/chatApi";

// const GREEN = COLORS?.primary || "#16834A";
// const MUTED = COLORS?.muted || "#89938C";

// const TAB_CONFIG = {
//   index: {
//     label: "Dashboard",
//     activeIcon: "grid",
//     inactiveIcon: "grid-outline",
//   },
//   "my-listings": {
//     label: "Listings",
//     activeIcon: "list",
//     inactiveIcon: "list-outline",
//   },
//   messages: {
//     label: "Messages",
//     activeIcon: "chatbubbles",
//     inactiveIcon: "chatbubbles-outline",
//   },
//   profile: {
//     label: "Profile",
//     activeIcon: "person",
//     inactiveIcon: "person-outline",
//   },
// };

// function getUnreadCount(response) {
//   if (!response) return 0;

//   const total =
//     response.total_unread ??
//     response.totalUnread ??
//     response.unread_count ??
//     response.unreadCount ??
//     response.data?.total_unread ??
//     response.data?.totalUnread ??
//     response.data?.unread_count ??
//     response.data?.unreadCount;

//   if (
//     total !== undefined &&
//     total !== null &&
//     Number.isFinite(Number(total))
//   ) {
//     return Math.max(0, Number(total));
//   }

//   let conversations = [];

//   if (Array.isArray(response)) {
//     conversations = response;
//   } else if (Array.isArray(response.conversations)) {
//     conversations = response.conversations;
//   } else if (Array.isArray(response.data)) {
//     conversations = response.data;
//   } else if (Array.isArray(response.data?.conversations)) {
//     conversations = response.data.conversations;
//   } else if (Array.isArray(response.data?.data)) {
//     conversations = response.data.data;
//   }

//   return conversations.reduce((sum, conversation) => {
//     const unread =
//       conversation?.unread_count ??
//       conversation?.unreadCount ??
//       conversation?.unread_messages_count ??
//       conversation?.unreadMessagesCount;

//     if (
//       unread !== undefined &&
//       unread !== null &&
//       Number.isFinite(Number(unread))
//     ) {
//       return sum + Math.max(0, Number(unread));
//     }

//     const latestMessage =
//       conversation?.latest_message ??
//       conversation?.latestMessage ??
//       conversation?.last_message ??
//       conversation?.lastMessage;

//     if (
//       latestMessage?.is_read === false ||
//       latestMessage?.is_read === 0
//     ) {
//       return sum + 1;
//     }

//     return sum;
//   }, 0);
// }

// function TabIcon({ routeName, focused, unreadCount }) {
//   const config = TAB_CONFIG[routeName];

//   if (!config) return null;

//   const iconName = focused
//     ? config.activeIcon
//     : config.inactiveIcon;

//   const showBadge =
//     routeName === "messages" && unreadCount > 0;

//   return (
//     <View style={styles.iconContainer}>
//       <View
//         style={[
//           styles.iconBackground,
//           focused && styles.activeIconBackground,
//         ]}
//       >
//         <Ionicons
//           name={iconName}
//           size={23}
//           color={focused ? GREEN : MUTED}
//         />
//       </View>

//       {showBadge && (
//         <View style={styles.badge}>
//           <Text style={styles.badgeText}>
//             {unreadCount > 99 ? "99+" : String(unreadCount)}
//           </Text>
//         </View>
//       )}

//       <Text
//         style={[
//           styles.tabLabel,
//           { color: focused ? GREEN : MUTED },
//           focused && styles.activeTabLabel,
//         ]}
//         numberOfLines={1}
//       >
//         {config.label}
//       </Text>

//       {focused && <View style={styles.activeIndicator} />}
//     </View>
//   );
// }

// export default function SellerTabLayout() {
//   const { user, loading } = useAuth();
//   const [unreadCount, setUnreadCount] = useState(0);

//   const role = String(
//     user?.role || user?.user_role || ""
//   )
//     .trim()
//     .toUpperCase();

//   const loadUnread = useCallback(async () => {
//     try {
//       const response = await getMyConversations();
//       const count = getUnreadCount(response);

//       console.log("💬 Seller unread count:", count);
//       setUnreadCount(count);
//     } catch (error) {
//       console.log(
//         "Seller unread error:",
//         error?.response?.data || error?.message
//       );
//     }
//   }, []);

//   useFocusEffect(
//     useCallback(() => {
//       if (user && role === "SELLER") {
//         loadUnread();
//       }
//     }, [user, role, loadUnread])
//   );

//   if (loading) {
//     return (
//       <View style={styles.loading}>
//         <ActivityIndicator size="large" color={GREEN} />
//       </View>
//     );
//   }

//   if (!user) {
//     return <Redirect href="/buyer-login" />;
//   }

//   if (role !== "SELLER") {
//     return <Redirect href="/buyer-login" />;
//   }

//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,
//         tabBarShowLabel: false,
//         tabBarStyle: styles.tabBar,
//         tabBarItemStyle: styles.tabBarItem,
//         tabBarHideOnKeyboard: true,
//         animation: "shift",
//       }}
//     >
//       {Object.keys(TAB_CONFIG).map((routeName) => (
//         <Tabs.Screen
//           key={routeName}
//           name={routeName}
//           options={{
//             tabBarIcon: ({ focused }) => (
//               <TabIcon
//                 routeName={routeName}
//                 focused={focused}
//                 unreadCount={unreadCount}
//               />
//             ),
//           }}
//         />
//       ))}

//       <Tabs.Screen
//         name="add-listing"
//         options={{ href: null }}
//       />

//       <Tabs.Screen
//         name="apply"
//         options={{ href: null }}
//       />
//     </Tabs>
//   );
// }

// const styles = StyleSheet.create({
//   loading: {
//     flex: 1,
//     backgroundColor: "#F6FAF7",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   tabBar: {
//     height: 108,
//     paddingTop: 8,
//     paddingBottom: 8,
//     paddingHorizontal: 4,
//     backgroundColor: "#FFFFFF",
//     borderTopWidth: 1,
//     borderTopColor: "#EDF1ED",
//     elevation: 12,
//     shadowColor: "#183D25",
//     shadowOffset: { width: 0, height: -4 },
//     shadowOpacity: 0.06,
//     shadowRadius: 12,
//   },

//   tabBarItem: {
//     height: 62,
//   },

//   iconContainer: {
//     width: "100%",
//     height: 62,
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 3,
//     position: "relative",
//     overflow: "visible",
//   },

//   iconBackground: {
//     width: 48,
//     height: 34,
//     borderRadius: 13,
//     alignItems: "center",
//     justifyContent: "center",
//     overflow: "visible",
//   },

//   activeIconBackground: {
//     backgroundColor: "#E8F6EC",
//   },

//   tabLabel: {
//     fontSize: 10,
//     fontWeight: "500",
//     letterSpacing: 0.1,
//   },

//   activeTabLabel: {
//     fontWeight: "700",
//   },

//   activeIndicator: {
//     position: "absolute",
//     bottom: 0,
//     width: 16,
//     height: 3,
//     borderRadius: 3,
//     backgroundColor: GREEN,
//   },

//   badge: {
//     position: "absolute",
//     top: 0,
//     left: "50%",
//     marginLeft: 8,
//     minWidth: 19,
//     height: 19,
//     borderRadius: 10,
//     paddingHorizontal: 4,
//     backgroundColor: "#F04444",
//     borderWidth: 2,
//     borderColor: "#FFFFFF",
//     alignItems: "center",
//     justifyContent: "center",
//     zIndex: 99,
//     elevation: 5,
//   },

//   badgeText: {
//     color: "#FFFFFF",
//     fontSize: 10,
//     fontWeight: "900",
//     textAlign: "center",
//     includeFontPadding: false,
//   },
// });
// ```

import React, { useCallback, useState } from "react";
import { Tabs, Redirect, useFocusEffect } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../src/constants/colors";
import { useAuth } from "../../src/context/AuthContext";
import { getMyConversations } from "../../src/api/chatApi";

const TAB_CONFIG = {
  index: {
    title: "Dashboard",
    icon: "grid-outline",
    activeIcon: "grid",
  },
  "my-listings": {
    title: "My Listings",
    icon: "pricetags-outline",
    activeIcon: "pricetags",
  },
  messages: {
    title: "Messages",
    icon: "chatbubble-ellipses-outline",
    activeIcon: "chatbubble-ellipses",
  },
  profile: {
    title: "Profile",
    icon: "person-outline",
    activeIcon: "person",
  },
};

function getUnreadCount(response) {
  if (!response) return 0;

  const directCount =
    response.total_unread ??
    response.totalUnread ??
    response.unread_count ??
    response.unreadCount ??
    response.data?.total_unread ??
    response.data?.totalUnread ??
    response.data?.unread_count ??
    response.data?.unreadCount ??
    response.data?.data?.total_unread ??
    response.data?.data?.unread_count;

  if (directCount !== undefined && directCount !== null) {
    return Math.max(0, Number(directCount) || 0);
  }

  const conversations = Array.isArray(response)
    ? response
    : Array.isArray(response.conversations)
    ? response.conversations
    : Array.isArray(response.data?.conversations)
    ? response.data.conversations
    : Array.isArray(response.data?.data?.conversations)
    ? response.data.data.conversations
    : Array.isArray(response.data)
    ? response.data
    : Array.isArray(response.data?.data)
    ? response.data.data
    : [];

  return conversations.reduce((total, conversation) => {
    const count =
      conversation?.unread_count ??
      conversation?.unreadCount ??
      conversation?.unread_messages_count ??
      conversation?.unreadMessagesCount ??
      0;

    return total + Math.max(0, Number(count) || 0);
  }, 0);
}

function TabIcon({ routeName, focused, badgeCount = 0 }) {
  const config = TAB_CONFIG[routeName];

  if (!config) return null;

  const iconName = focused ? config.activeIcon : config.icon;
  const showBadge = Number(badgeCount) > 0;
  const badgeLabel = badgeCount > 99 ? "99+" : String(badgeCount);

  return (
    <View style={styles.iconContainer}>
      <Ionicons
        name={iconName}
        size={23}
        color={focused ? COLORS.primary : "#9297A3"}
      />

      {showBadge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeLabel}</Text>
        </View>
      )}
    </View>
  );
}

export default function SellerTabLayout() {
  const { user, loading } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const role = String(user?.role || "").toUpperCase();

  const loadUnread = useCallback(async () => {
    try {
      const response = await getMyConversations();
      const count = getUnreadCount(response);

      console.log("💬 Seller conversations response:", response);
      console.log("🔔 Seller unread count:", count);

      setUnreadCount(count);
    } catch (error) {
      console.log(
        "❌ Seller unread error:",
        error?.response?.data || error?.message
      );
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!loading && user && role === "SELLER") {
        loadUnread();
      }
    }, [loading, user, role, loadUnread])
  );

  if (loading) {
    return null;
  }

  if (!user || role !== "SELLER") {
    return <Redirect href="/(auth)/seller-login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: "#9297A3",
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      {Object.entries(TAB_CONFIG).map(([routeName, config]) => (
        <Tabs.Screen
          key={routeName}
          name={routeName}
          options={{
            title: config.title,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                routeName={routeName}
                focused={focused}
                badgeCount={
                  routeName === "messages" ? unreadCount : 0
                }
              />
            ),
          }}
        />
      ))}

      <Tabs.Screen
        name="add-listing"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="apply"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 108,
    paddingTop: 8,
    paddingBottom: 7,
    backgroundColor: "#FFFFFF",
    borderTopColor: "#EEEEF2",
    borderTopWidth: 1,
    elevation: 8,
  },
  tabItem: {
    paddingTop: 1,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
  },
  iconContainer: {
    width: 34,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
   
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 10,
    backgroundColor: "#FF3040",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 99,
    elevation: 5,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
    textAlign: "center",
  },
});

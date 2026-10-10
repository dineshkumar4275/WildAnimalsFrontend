// import React, {
//   useCallback,
//   useEffect,
//   useRef,
//   useState,
// } from "react";

// import {
//   ActivityIndicator,
//   Alert,
//   FlatList,
//   KeyboardAvoidingView,
//   Linking,
//   Platform,
//   Pressable,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
// } from "react-native";

// import { SafeAreaView } from "react-native-safe-area-context";
// import { Ionicons } from "@expo/vector-icons";
// import { router, useLocalSearchParams } from "expo-router";

// import {
//   getMessages,
//   sendMessage,
//   markConversationRead,
// } from "../../src/api/chatApi";

// import { useAuth } from "../../src/context/AuthContext";

// const COLORS = {
//   primary: "#1F8A47",
//   primaryDark: "#166B36",
//   background: "#F2F5F2",
//   white: "#FFFFFF",
//   text: "#111827",
//   muted: "#8B95A1",
//   border: "#E5EAE5",
//   myBubble: "#1F8A47",
//   otherBubble: "#FFFFFF",
// };

// export default function ChatScreen() {
//   const params = useLocalSearchParams();
//   const { user } = useAuth();

//   const conversationId = Array.isArray(params.id)
//     ? params.id[0]
//     : params.id;

//   const chatName = Array.isArray(params.name)
//     ? params.name[0]
//     : params.name || "Chat";

//   const chatPhone = Array.isArray(params.phone)
//     ? params.phone[0]
//     : params.phone || "";

//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [sending, setSending] = useState(false);

//   const flatListRef = useRef(null);

//   /* =========================================================
//      LOAD
//   ========================================================= */

//   const loadMessages = useCallback(
//     async (showLoader = false) => {
//       if (!conversationId) return;

//       try {
//         if (showLoader) setLoading(true);

//         const response = await getMessages(conversationId);

//         const list =
//           response?.messages ||
//           response?.data?.messages ||
//           [];

//         setMessages(Array.isArray(list) ? list : []);
//       } catch (error) {
//         console.log("CHAT LOAD ERROR:", error);

//         if (showLoader) {
//           Alert.alert(
//             "Error",
//             error?.message || "Unable to load messages"
//           );
//         }
//       } finally {
//         if (showLoader) setLoading(false);
//       }
//     },
//     [conversationId]
//   );

//   useEffect(() => {
//     loadMessages(true);
//   }, [loadMessages]);

//   /* =========================================================
//      AUTO REFRESH
//   ========================================================= */

//   useEffect(() => {
//     if (!conversationId) return;

//     const interval = setInterval(() => {
//       loadMessages(false);
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [conversationId, loadMessages]);

//   /* =========================================================
//      SCROLL
//   ========================================================= */

//   useEffect(() => {
//     if (!messages.length) return;

//     setTimeout(() => {
//       flatListRef.current?.scrollToEnd({ animated: true });
//     }, 100);
//   }, [messages.length]);

//   /* =========================================================
//      MARK AS READ
//   ========================================================= */

//   useEffect(() => {
//     if (!conversationId) return;
//     if (!messages.length) return;

//     markConversationRead(conversationId)
//       .then((res) => console.log("✅ Marked read:", res))
//       .catch((err) =>
//         console.log(
//           "❌ Mark read error:",
//           err?.response?.data || err?.message
//         )
//       );
//   }, [conversationId, messages.length]);

//   /* =========================================================
//      SEND
//   ========================================================= */

//   const handleSend = async () => {
//     const text = input.trim();

//     if (!text || !conversationId || sending) return;

//     try {
//       setSending(true);

//       await sendMessage(conversationId, text);

//       setInput("");

//       await loadMessages(false);

//       setTimeout(() => {
//         flatListRef.current?.scrollToEnd({ animated: true });
//       }, 100);
//     } catch (error) {
//       console.log("SEND MESSAGE ERROR:", error);

//       Alert.alert(
//         "Error",
//         error?.message || "Unable to send message"
//       );
//     } finally {
//       setSending(false);
//     }
//   };

//   /* =========================================================
//      CALL
//   ========================================================= */

//   const handleVoiceCall = async () => {
//     console.log("📞 CALL — phone:", chatPhone);

//     if (!chatPhone) {
//       Alert.alert(
//         "Call unavailable",
//         "This user hasn't shared a phone number."
//       );
//       return;
//     }

//     const cleanPhone = String(chatPhone).replace(/[^\d+]/g, "");
//     const url = `tel:${cleanPhone}`;

//     console.log("📞 Opening URL:", url);

//     try {
//       await Linking.openURL(url);
//     } catch (err) {
//       console.log("Call error:", err?.message);

//       try {
//         await Linking.openURL(`telprompt:${cleanPhone}`);
//       } catch (err2) {
//         console.log("telprompt error:", err2?.message);
//         Alert.alert(
//           "Call unavailable",
//           "Your device doesn't support calling."
//         );
//       }
//     }
//   };

//   const handleVideoCall = () => {
//     Alert.alert("Video call", "Coming soon.");
//   };

//   const handleMenu = () => {
//     Alert.alert("Options", "Menu coming soon");
//   };

//   /* =========================================================
//      RENDER MESSAGE
//   ========================================================= */

//   const renderMessage = ({ item }) => {
//     const senderId =
//       item?.sender_id ||
//       item?.sender?.id ||
//       item?.user_id;

//     const isMine =
//       item?.is_mine === true ||
//       item?.mine === true ||
//       (user?.id &&
//         senderId &&
//         Number(senderId) === Number(user.id));

//     const time = item?.created_at
//       ? new Date(item.created_at).toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         })
//       : "";

//     return (
//       <View style={styles.messageBlock}>
//         <View
//           style={[
//             styles.messageRow,
//             isMine ? styles.rowMine : styles.rowOther,
//           ]}
//         >
//           <View
//             style={[
//               styles.bubble,
//               isMine ? styles.myBubble : styles.otherBubble,
//             ]}
//           >
//             <Text
//               style={[
//                 styles.messageText,
//                 isMine ? styles.myText : styles.otherText,
//               ]}
//             >
//               {item?.message || ""}
//             </Text>
//           </View>
//         </View>

//         {!!time && (
//           <Text
//             style={[
//               styles.timeText,
//               isMine ? styles.timeMine : styles.timeOther,
//             ]}
//           >
//             {time}
//           </Text>
//         )}
//       </View>
//     );
//   };

//   if (!conversationId) {
//     return (
//       <SafeAreaView style={styles.safeArea} edges={["top"]}>
//         <View style={styles.center}>
//           <Text style={styles.errorText}>
//             Conversation ID is missing
//           </Text>
//           <Pressable
//             style={styles.backButton}
//             onPress={() => router.back()}
//           >
//             <Text style={styles.backButtonText}>Go Back</Text>
//           </Pressable>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView
//       style={styles.safeArea}
//       edges={["top", "bottom"]}
//     >
//       <KeyboardAvoidingView
//         style={styles.container}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
//       >
//         {/* HEADER */}
//         <View style={styles.header}>
//           <Pressable
//             style={styles.headerBack}
//             onPress={() => router.back()}
//           >
//             <Ionicons
//               name="chevron-back"
//               size={26}
//               color={COLORS.primary}
//             />
//           </Pressable>

//           <View style={styles.headerAvatar}>
//             <Text style={styles.headerAvatarText}>
//               {String(chatName).charAt(0).toUpperCase()}
//             </Text>
//             <View style={styles.headerOnlineDot} />
//           </View>

//           <View style={styles.headerText}>
//             <Text style={styles.headerTitle} numberOfLines={1}>
//               {chatName}
//             </Text>
//           </View>

//           <Pressable
//             style={styles.headerIconBtn}
//             onPress={handleVoiceCall}
//           >
//             <Ionicons name="call" size={20} color={COLORS.primary} />
//           </Pressable>

//           <Pressable
//             style={styles.headerIconBtn}
//             onPress={handleVideoCall}
//           >
//             <Ionicons
//               name="videocam"
//               size={22}
//               color={COLORS.primary}
//             />
//           </Pressable>

//           <Pressable
//             style={styles.headerIconBtn}
//             onPress={handleMenu}
//           >
//             <Ionicons name="menu" size={22} color={COLORS.primary} />
//           </Pressable>
//         </View>

//         {/* MESSAGES */}
//         {loading ? (
//           <View style={styles.center}>
//             <ActivityIndicator
//               size="large"
//               color={COLORS.primary}
//             />
//           </View>
//         ) : (
//           <FlatList
//             ref={flatListRef}
//             data={messages}
//             keyExtractor={(item, index) =>
//               String(item?.id || `msg-${index}`)
//             }
//             renderItem={renderMessage}
//             contentContainerStyle={[
//               styles.messagesContent,
//               messages.length === 0 && styles.emptyContent,
//             ]}
//             keyboardShouldPersistTaps="handled"
//             showsVerticalScrollIndicator={false}
//             ListEmptyComponent={
//               <View style={styles.empty}>
//                 <View style={styles.emptyIcon}>
//                   <Ionicons
//                     name="chatbubbles-outline"
//                     size={38}
//                     color={COLORS.primary}
//                   />
//                 </View>
//                 <Text style={styles.emptyTitle}>
//                   No messages yet
//                 </Text>
//                 <Text style={styles.emptyText}>
//                   Say hi to start the conversation.
//                 </Text>
//               </View>
//             }
//           />
//         )}

//         {/* INPUT */}
//         <View style={styles.inputArea}>
//           <Pressable style={styles.plusButton}>
//             <Ionicons
//               name="add"
//               size={24}
//               color={COLORS.muted}
//             />
//           </Pressable>

//           <View style={styles.inputWrapper}>
//             <TextInput
//               value={input}
//               onChangeText={setInput}
//               placeholder="Type a message..."
//               placeholderTextColor={COLORS.muted}
//               multiline
//               maxLength={2000}
//               style={styles.input}
//               editable={!sending}
//               textAlignVertical="top"
//             />
//           </View>

//           <Pressable
//             style={[
//               styles.sendButton,
//               (!input.trim() || sending) && styles.sendDisabled,
//             ]}
//             onPress={handleSend}
//             disabled={!input.trim() || sending}
//           >
//             {sending ? (
//               <ActivityIndicator size="small" color="#FFFFFF" />
//             ) : (
//               <Ionicons
//                 name="send"
//                 size={19}
//                 color="#FFFFFF"
//               />
//             )}
//           </Pressable>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// /* =========================================================
//    STYLES
// ========================================================= */

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },

//   container: {
//     flex: 1,
//   },

//   /* ============ HEADER ============ */

//   header: {
//     height: 60,
//     backgroundColor: COLORS.white,
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.border,
//   },

//   headerBack: {
//     width: 38,
//     height: 38,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   headerAvatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "#D6EEDD",
//     alignItems: "center",
//     justifyContent: "center",
//     position: "relative",
//   },

//   headerAvatarText: {
//     fontSize: 16,
//     fontWeight: "800",
//     color: COLORS.primaryDark,
//   },

//   headerOnlineDot: {
//     position: "absolute",
//     bottom: 1,
//     right: 1,
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     backgroundColor: "#22C55E",
//     borderWidth: 2,
//     borderColor: COLORS.white,
//   },

//   headerText: {
//     flex: 1,
//     marginLeft: 10,
//   },

//   headerTitle: {
//     fontSize: 15,
//     fontWeight: "800",
//     color: COLORS.text,
//   },

//   headerIconBtn: {
//     width: 36,
//     height: 36,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   /* ============ MESSAGES ============ */

//   messagesContent: {
//     paddingHorizontal: 14,
//     paddingTop: 14,
//     paddingBottom: 18,
//   },

//   emptyContent: {
//     flexGrow: 1,
//     justifyContent: "center",
//   },

//   messageBlock: {
//     marginBottom: 10,
//   },

//   messageRow: {
//     width: "100%",
//     flexDirection: "row",
//   },

//   rowMine: {
//     justifyContent: "flex-end",
//   },

//   rowOther: {
//     justifyContent: "flex-start",
//   },

//   bubble: {
//     maxWidth: "78%",
//     borderRadius: 18,
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//   },

//   myBubble: {
//     backgroundColor: COLORS.myBubble,
//     borderTopRightRadius: 4,
//   },

//   otherBubble: {
//     backgroundColor: COLORS.otherBubble,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     borderTopLeftRadius: 4,
//   },

//   messageText: {
//     fontSize: 14,
//     lineHeight: 20,
//   },

//   myText: {
//     color: "#FFFFFF",
//   },

//   otherText: {
//     color: COLORS.text,
//   },

//   timeText: {
//     fontSize: 10,
//     marginTop: 4,
//     color: COLORS.muted,
//   },

//   timeMine: {
//     alignSelf: "flex-end",
//     marginRight: 4,
//   },

//   timeOther: {
//     alignSelf: "flex-start",
//     marginLeft: 4,
//   },

//   /* ============ EMPTY ============ */

//   empty: {
//     alignItems: "center",
//     paddingHorizontal: 30,
//   },

//   emptyIcon: {
//     width: 76,
//     height: 76,
//     borderRadius: 38,
//     backgroundColor: "#E7F5EC",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 14,
//   },

//   emptyTitle: {
//     fontSize: 16,
//     fontWeight: "800",
//     color: COLORS.text,
//   },

//   emptyText: {
//     marginTop: 6,
//     fontSize: 13,
//     color: COLORS.muted,
//     textAlign: "center",
//   },

//   /* ============ INPUT ============ */

//   inputArea: {
//     backgroundColor: COLORS.white,
//     borderTopWidth: 1,
//     borderTopColor: COLORS.border,
//     paddingHorizontal: 12,
//     paddingTop: 10,
//     paddingBottom: Platform.OS === "ios" ? 20 : 12,
//     flexDirection: "row",
//     alignItems: "flex-end",
//     gap: 8,
//   },

//   plusButton: {
//     width: 40,
//     height: 44,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   inputWrapper: {
//     flex: 1,
//     minHeight: 44,
//     maxHeight: 110,
//     backgroundColor: "#F1F3F1",
//     borderRadius: 22,
//     paddingHorizontal: 16,
//     justifyContent: "center",
//   },

//   input: {
//     minHeight: 44,
//     maxHeight: 100,
//     fontSize: 15,
//     color: COLORS.text,
//     paddingVertical: 10,
//     textAlignVertical: "top",
//   },

//   sendButton: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: COLORS.primary,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   sendDisabled: {
//     opacity: 0.45,
//   },

//   /* ============ LOADING / ERROR ============ */

//   center: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingHorizontal: 25,
//   },

//   errorText: {
//     fontSize: 15,
//     fontWeight: "700",
//     color: COLORS.text,
//     textAlign: "center",
//   },

//   backButton: {
//     marginTop: 16,
//     backgroundColor: COLORS.primary,
//     paddingHorizontal: 22,
//     paddingVertical: 12,
//     borderRadius: 12,
//   },

//   backButtonText: {
//     color: "#FFFFFF",
//     fontWeight: "700",
//   },
// });
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import {
  getMessages,
  sendMessage,
  markConversationRead,
} from "../../src/api/chatApi";

import { useAuth } from "../../src/context/AuthContext";

const COLORS = {
  primary: "#1F8A47",
  primaryDark: "#166B36",
  background: "#F2F5F2",
  white: "#FFFFFF",
  text: "#111827",
  muted: "#8B95A1",
  border: "#E5EAE5",
  myBubble: "#1F8A47",
  otherBubble: "#FFFFFF",
};

export default function ChatScreen() {
  const params = useLocalSearchParams();
  const { user } = useAuth();

  const conversationId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const chatName = Array.isArray(params.name)
    ? params.name[0]
    : params.name || "Chat";

  const chatPhone = Array.isArray(params.phone)
    ? params.phone[0]
    : params.phone || "";

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const flatListRef = useRef(null);

  /* =========================================================
     LOAD
  ========================================================= */

  const loadMessages = useCallback(
    async (showLoader = false) => {
      if (!conversationId) return;

      try {
        if (showLoader) setLoading(true);

        const response = await getMessages(conversationId);

        const list =
          response?.messages ||
          response?.data?.messages ||
          [];

        setMessages(Array.isArray(list) ? list : []);
      } catch (error) {
        console.log("CHAT LOAD ERROR:", error);

        if (showLoader) {
          Alert.alert(
            "Error",
            error?.message || "Unable to load messages"
          );
        }
      } finally {
        if (showLoader) setLoading(false);
      }
    },
    [conversationId]
  );

  useEffect(() => {
    loadMessages(true);
  }, [loadMessages]);

  /* =========================================================
     AUTO REFRESH
  ========================================================= */

  useEffect(() => {
    if (!conversationId) return;

    const interval = setInterval(() => {
      loadMessages(false);
    }, 3000);

    return () => clearInterval(interval);
  }, [conversationId, loadMessages]);

  /* =========================================================
     SCROLL
  ========================================================= */

  useEffect(() => {
    if (!messages.length) return;

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages.length]);

  /* =========================================================
     MARK AS READ — once when chat opens
  ========================================================= */

  useEffect(() => {
    if (!conversationId) return;
    if (!messages.length) return;

    // Avoid repeated calls
    if (markAsReadRef.current === conversationId) return;
    markAsReadRef.current = conversationId;

    markConversationRead(conversationId)
      .then((res) => console.log("✅ Marked read:", res))
      .catch((err) =>
        console.log(
          "❌ Mark read error:",
          err?.response?.data || err?.message
        )
      );
  }, [conversationId, messages.length]);

  const markAsReadRef = useRef(null);

  /* =========================================================
     SEND
  ========================================================= */

  const handleSend = async () => {
    const text = input.trim();

    if (!text || !conversationId || sending) return;

    try {
      setSending(true);

      await sendMessage(conversationId, text);

      setInput("");

      await loadMessages(false);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.log("SEND MESSAGE ERROR:", error);

      Alert.alert(
        "Error",
        error?.message || "Unable to send message"
      );
    } finally {
      setSending(false);
    }
  };

  /* =========================================================
     CALL
  ========================================================= */

  const handleVoiceCall = async () => {
    if (!chatPhone) {
      Alert.alert(
        "Call unavailable",
        "This user hasn't shared a phone number."
      );
      return;
    }

    const cleanPhone = String(chatPhone).replace(/[^\d+]/g, "");
    const url = `tel:${cleanPhone}`;

    try {
      await Linking.openURL(url);
    } catch (err) {
      try {
        await Linking.openURL(`telprompt:${cleanPhone}`);
      } catch (err2) {
        Alert.alert(
          "Call unavailable",
          "Your device doesn't support calling."
        );
      }
    }
  };

  const handleVideoCall = () => {
    Alert.alert("Video call", "Coming soon.");
  };

  const handleMenu = () => {
    Alert.alert("Options", "Menu coming soon");
  };

  /* =========================================================
     RENDER MESSAGE
  ========================================================= */

  const renderMessage = ({ item }) => {
    const senderId =
      item?.sender_id ||
      item?.sender?.id ||
      item?.user_id;

    const isMine =
      item?.is_mine === true ||
      item?.mine === true ||
      (user?.id &&
        senderId &&
        Number(senderId) === Number(user.id));

    const time = item?.created_at
      ? new Date(item.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

    return (
      <View style={styles.messageBlock}>
        <View
          style={[
            styles.messageRow,
            isMine ? styles.rowMine : styles.rowOther,
          ]}
        >
          <View
            style={[
              styles.bubble,
              isMine ? styles.myBubble : styles.otherBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                isMine ? styles.myText : styles.otherText,
              ]}
            >
              {item?.message || ""}
            </Text>
          </View>
        </View>

        {!!time && (
          <Text
            style={[
              styles.timeText,
              isMine ? styles.timeMine : styles.timeOther,
            ]}
          >
            {time}
          </Text>
        )}
      </View>
    );
  };

  if (!conversationId) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.center}>
          <Text style={styles.errorText}>
            Conversation ID is missing
          </Text>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "bottom"]}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable
            style={styles.headerBack}
            onPress={() => router.back()}
          >
            <Ionicons
              name="chevron-back"
              size={26}
              color={COLORS.primary}
            />
          </Pressable>

          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>
              {String(chatName).charAt(0).toUpperCase()}
            </Text>
            <View style={styles.headerOnlineDot} />
          </View>

          <View style={styles.headerText}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {chatName}
            </Text>
          </View>

          <Pressable
            style={styles.headerIconBtn}
            onPress={handleVoiceCall}
          >
            <Ionicons name="call" size={20} color={COLORS.primary} />
          </Pressable>

          <Pressable
            style={styles.headerIconBtn}
            onPress={handleVideoCall}
          >
            <Ionicons
              name="videocam"
              size={22}
              color={COLORS.primary}
            />
          </Pressable>

          <Pressable
            style={styles.headerIconBtn}
            onPress={handleMenu}
          >
            <Ionicons name="menu" size={22} color={COLORS.primary} />
          </Pressable>
        </View>

        {/* MESSAGES */}
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator
              size="large"
              color={COLORS.primary}
            />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item, index) =>
              String(item?.id || `msg-${index}`)
            }
            renderItem={renderMessage}
            contentContainerStyle={[
              styles.messagesContent,
              messages.length === 0 && styles.emptyContent,
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.empty}>
                <View style={styles.emptyIcon}>
                  <Ionicons
                    name="chatbubbles-outline"
                    size={38}
                    color={COLORS.primary}
                  />
                </View>
                <Text style={styles.emptyTitle}>
                  No messages yet
                </Text>
                <Text style={styles.emptyText}>
                  Say hi to start the conversation.
                </Text>
              </View>
            }
          />
        )}

        {/* INPUT */}
        <View style={styles.inputArea}>
          <Pressable style={styles.plusButton}>
            <Ionicons
              name="add"
              size={24}
              color={COLORS.muted}
            />
          </Pressable>

          <View style={styles.inputWrapper}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Type a message..."
              placeholderTextColor={COLORS.muted}
              multiline
              maxLength={2000}
              style={styles.input}
              editable={!sending}
              textAlignVertical="top"
            />
          </View>

          <Pressable
            style={[
              styles.sendButton,
              (!input.trim() || sending) && styles.sendDisabled,
            ]}
            onPress={handleSend}
            disabled={!input.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons
                name="send"
                size={19}
                color="#FFFFFF"
              />
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: { flex: 1 },

  header: {
    height: 60,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerBack: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#D6EEDD",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  headerAvatarText: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.primaryDark,
  },
  headerOnlineDot: {
    position: "absolute",
    bottom: 1,
    right: 1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#22C55E",
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  headerText: { flex: 1, marginLeft: 10 },
  headerTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.text,
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  messagesContent: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 18,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  messageBlock: { marginBottom: 10 },
  messageRow: { width: "100%", flexDirection: "row" },
  rowMine: { justifyContent: "flex-end" },
  rowOther: { justifyContent: "flex-start" },
  bubble: {
    maxWidth: "78%",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  myBubble: {
    backgroundColor: COLORS.myBubble,
    borderTopRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: COLORS.otherBubble,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderTopLeftRadius: 4,
  },
  messageText: { fontSize: 14, lineHeight: 20 },
  myText: { color: "#FFFFFF" },
  otherText: { color: COLORS.text },
  timeText: {
    fontSize: 10,
    marginTop: 4,
    color: COLORS.muted,
  },
  timeMine: { alignSelf: "flex-end", marginRight: 4 },
  timeOther: { alignSelf: "flex-start", marginLeft: 4 },

  empty: { alignItems: "center", paddingHorizontal: 30 },
  emptyIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#E7F5EC",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
  },
  emptyText: {
    marginTop: 6,
    fontSize: 13,
    color: COLORS.muted,
    textAlign: "center",
  },

  inputArea: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 20 : 12,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  plusButton: {
    width: 40,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  inputWrapper: {
    flex: 1,
    minHeight: 44,
    maxHeight: 110,
    backgroundColor: "#F1F3F1",
    borderRadius: 22,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  input: {
    minHeight: 44,
    maxHeight: 100,
    fontSize: 15,
    color: COLORS.text,
    paddingVertical: 10,
    textAlignVertical: "top",
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendDisabled: { opacity: 0.45 },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
  },
  errorText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
  },
  backButton: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: { color: "#FFFFFF", fontWeight: "700" },
});
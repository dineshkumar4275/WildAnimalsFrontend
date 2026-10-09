import React, { useEffect, useState } from "react";
import { Alert, FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getMessages, sendMessage } from "../../src/api/chatApi";
import { getToken } from "../../src/storage/authStorage";
import { COLORS } from "../../src/constants/colors";
import { io } from "socket.io-client";

export default function Chat() {
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    getMessages(id).then((r) => setMessages(r.messages || [])).catch(() => {});

    let socket;
    (async () => {
      const token = await getToken();
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api";
      const baseUrl = apiUrl.replace(/\/api\/?$/, "");

      socket = io(baseUrl, { auth: { token } });
      socket.emit("joinConversation", id);
      socket.on("newMessage", (message) => {
        setMessages((current) => [...current, message]);
      });
    })();

    return () => {
      if (socket) {
        socket.emit("leaveConversation", id);
        socket.disconnect();
      }
    };
  }, [id]);

  async function send() {
    if (!text.trim()) return;

    try {
      const response = await sendMessage(id, text.trim());
      setMessages((current) => {
        if (current.some((item) => item.id === response.message.id)) return current;
        return [...current, response.message];
      });
      setText("");
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Unable to send message");
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.message}>
            <Text>{item.message}</Text>
          </View>
        )}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={text}
          onChangeText={setText}
        />
        <Pressable style={styles.send} onPress={send}>
          <Text style={styles.sendText}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  list: {
    padding: 16,
  },
  message: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
    padding: 11,
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: "80%",
  },
  inputRow: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  send: {
    marginLeft: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 15,
    justifyContent: "center",
    borderRadius: 12,
  },
  sendText: {
    color: COLORS.white,
    fontWeight: "800",
  },
});

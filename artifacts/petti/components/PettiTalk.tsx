import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { Analysis, MOCK_CHAT_RESPONSES } from "@/data/mockData";

const KAKAO_URL = "https://pf.kakao.com/petti";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
}

interface PettiTalkProps {
  latestAnalysis: Analysis;
  hidden?: boolean;
}

function buildContextMessage(a: Analysis): string {
  return `안녕하세요! 올리버의 최근 분석 결과를 공유드립니다.\n\n📊 Stifle ROM: ${a.averageRom}° (좌 ${a.leftRom}° / 우 ${a.rightRom}°)\n🐾 보상 패턴: ${a.compensationPattern ?? "정보 없음"}\n📅 측정일: ${a.date}\n\n이 결과에 대해 궁금한 점이 있으시면 말씀해 주세요.`;
}

let msgCounter = 0;
const uid = () => `msg-${++msgCounter}-${Date.now()}`;

export function PettiTalk({ latestAnalysis, hidden = false }: PettiTalkProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uid(),
      role: "assistant",
      text: buildContextMessage(latestAnalysis),
    },
  ]);
  const flatRef = useRef<FlatList>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const openChat = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 80, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();
    setOpen(true);
  };

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    Haptics.selectionAsync();

    const userMsg: Message = { id: uid(), role: "user", text };
    setMessages((prev) => [userMsg, ...prev]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const pick =
        MOCK_CHAT_RESPONSES[Math.floor(Math.random() * MOCK_CHAT_RESPONSES.length)];
      const aiMsg: Message = { id: uid(), role: "assistant", text: pick };
      setMessages((prev) => [aiMsg, ...prev]);
      setIsTyping(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1200 + Math.random() * 800);
  };

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <>
      <Animated.View style={[styles.fab, { transform: [{ scale: scaleAnim }] }, hidden && { opacity: 0, pointerEvents: "none" }]}>
        <TouchableOpacity
          style={[styles.fabBtn, { backgroundColor: colors.primary }]}
          onPress={openChat}
          activeOpacity={0.9}
        >
          <Feather name="message-circle" size={22} color="#fff" />
          <Text style={styles.fabLabel}>펫티톡</Text>
        </TouchableOpacity>
      </Animated.View>

      <Modal
        visible={open}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setOpen(false)}
      >
        <View style={[styles.sheet, { backgroundColor: colors.background }]}>
          {/* Sheet header */}
          <View
            style={[styles.sheetHeader, { backgroundColor: colors.background }]}
          >
            <View style={styles.sheetTitleRow}>
              <View style={[styles.sheetIconWrap, { backgroundColor: colors.primaryFixed }]}>
                <Feather name="message-circle" size={18} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.sheetTitle, { color: colors.foreground }]}>
                  펫티톡
                </Text>
                <Text style={[styles.sheetSub, { color: colors.mutedForeground }]}>
                  AI 보행 분석 어시스턴트
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.closeBtn, { backgroundColor: colors.surfaceContainerLow }]}
              onPress={() => setOpen(false)}
              activeOpacity={0.7}
            >
              <Feather name="x" size={18} color={colors.foreground} />
            </TouchableOpacity>
          </View>

          {/* KakaoTalk channel button */}
          <TouchableOpacity
            style={[styles.kakaoBtn, { backgroundColor: "#FEE500" }]}
            onPress={() => Linking.openURL(KAKAO_URL)}
            activeOpacity={0.85}
          >
            <Text style={styles.kakaoBtnText}>💬  카카오톡 채널 상담</Text>
          </TouchableOpacity>

          {/* Messages — inverted FlatList */}
          <FlatList
            ref={flatRef}
            data={messages}
            keyExtractor={(item) => item.id}
            inverted
            contentContainerStyle={[
              styles.messageList,
              { paddingBottom: 8 },
            ]}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              isTyping ? (
                <View style={[styles.bubble, styles.bubbleAI, { backgroundColor: colors.surfaceContainerLow }]}>
                  <Text style={[styles.bubbleText, { color: colors.mutedForeground }]}>
                    입력 중...
                  </Text>
                </View>
              ) : null
            }
            renderItem={({ item }) =>
              item.role === "user" ? (
                <View style={[styles.bubble, styles.bubbleUser, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.bubbleText, { color: "#fff" }]}>
                    {item.text}
                  </Text>
                </View>
              ) : (
                <View style={[styles.bubble, styles.bubbleAI, { backgroundColor: colors.surfaceContainerLow }]}>
                  <Text style={[styles.bubbleText, { color: colors.foreground }]}>
                    {item.text}
                  </Text>
                </View>
              )
            }
          />

          {/* Input bar */}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={0}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View
                style={[
                  styles.inputBar,
                  {
                    backgroundColor: colors.background,
                    paddingBottom: bottomPad + 8,
                    borderTopColor: colors.border + "30",
                  },
                ]}
              >
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.surfaceContainerLow,
                      color: colors.foreground,
                    },
                  ]}
                  value={input}
                  onChangeText={setInput}
                  placeholder="궁금한 점을 입력하세요..."
                  placeholderTextColor={colors.mutedForeground}
                  onSubmitEditing={sendMessage}
                  returnKeyType="send"
                  multiline={false}
                />
                <TouchableOpacity
                  style={[
                    styles.sendBtn,
                    { backgroundColor: input.trim() ? colors.primary : colors.surfaceContainerHigh },
                  ]}
                  onPress={sendMessage}
                  disabled={!input.trim()}
                  activeOpacity={0.8}
                >
                  <Feather
                    name="send"
                    size={17}
                    color={input.trim() ? "#fff" : colors.mutedForeground}
                  />
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 100,
    right: 20,
    zIndex: 100,
  },
  fabBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 13,
    shadowColor: "#00676a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  fabLabel: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  sheet: {
    flex: 1,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },
  sheetTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sheetIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  sheetSub: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 1,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  kakaoBtn: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  kakaoBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#3A1D0A",
  },
  messageList: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 8,
    flexGrow: 1,
  },
  bubble: {
    maxWidth: "82%",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginVertical: 3,
  },
  bubbleUser: {
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/context/AuthContext";

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login } = useAuth();

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 44) : insets.top;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleKakaoLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      login();
    }, 800);
  };

  const handleEmailLogin = () => {
    if (!email || !password) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      login();
    }, 600);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: topPad + 8, paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back */}
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: colors.surfaceContainerLow }]}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.logoBg, { backgroundColor: colors.primaryFixed }]}>
            <Feather name="activity" size={28} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>
            다시 만나요!
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            로그인하여 반려견의 분석 기록을 이어가세요
          </Text>
        </View>

        {/* Kakao */}
        <TouchableOpacity
          style={[styles.kakaoBtn, loading && styles.btnDisabled]}
          onPress={handleKakaoLogin}
          activeOpacity={0.85}
          disabled={loading}
        >
          <Text style={styles.kakaoBtnText}>
            {loading ? "로그인 중..." : "카카오로 로그인"}
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.mutedForeground }]}>또는</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        {/* Email form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>
              이메일
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surfaceContainerLow,
                  color: colors.foreground,
                  borderColor: email ? colors.primary + "60" : colors.border,
                },
              ]}
              value={email}
              onChangeText={setEmail}
              placeholder="이메일 주소 입력"
              placeholderTextColor={colors.outlineVariant}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>
              비밀번호
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surfaceContainerLow,
                  color: colors.foreground,
                  borderColor: password ? colors.primary + "60" : colors.border,
                },
              ]}
              value={password}
              onChangeText={setPassword}
              placeholder="비밀번호 입력"
              placeholderTextColor={colors.outlineVariant}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleEmailLogin}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.loginBtn,
              { backgroundColor: colors.primary },
              (!email || !password || loading) && styles.btnDisabled,
            ]}
            onPress={handleEmailLogin}
            activeOpacity={0.85}
            disabled={!email || !password || loading}
          >
            <Text style={styles.loginBtnText}>
              {loading ? "로그인 중..." : "로그인"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
            아직 계정이 없으신가요?
          </Text>
          <TouchableOpacity onPress={() => Haptics.selectionAsync()}>
            <Text style={[styles.signupText, { color: colors.primary }]}>
              회원가입
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {
    paddingHorizontal: 24,
    gap: 24,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  header: {
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
  },
  logoBg: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 20,
  },
  kakaoBtn: {
    backgroundColor: "#FEE500",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  kakaoBtnText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#191919",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 13, fontWeight: "500" },
  form: { gap: 16 },
  inputGroup: { gap: 6 },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  input: {
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontWeight: "500",
    borderWidth: 1.5,
  },
  loginBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
  },
  loginBtnText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
  },
  btnDisabled: { opacity: 0.5 },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    alignItems: "center",
  },
  footerText: { fontSize: 14 },
  signupText: { fontSize: 14, fontWeight: "700" },
});

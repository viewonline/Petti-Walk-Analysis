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

const FIELDS = [
  { key: "name", label: "이름", placeholder: "이름 입력", icon: "user", secure: false, keyboard: "default" as const },
  { key: "email", label: "이메일", placeholder: "이메일 주소 입력", icon: "mail", secure: false, keyboard: "email-address" as const },
  { key: "password", label: "비밀번호", placeholder: "8자 이상 입력", icon: "lock", secure: true, keyboard: "default" as const },
  { key: "confirm", label: "비밀번호 확인", placeholder: "비밀번호를 다시 입력", icon: "lock", secure: true, keyboard: "default" as const },
];

export default function SignupScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 44) : insets.top;

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const setField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error) setError("");
  };

  const handleSignup = () => {
    if (!form.name.trim()) {
      setError("이름을 입력해주세요");
      return;
    }
    if (!form.email.trim() || !form.email.includes("@")) {
      setError("올바른 이메일 주소를 입력해주세요");
      return;
    }
    if (form.password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다");
      return;
    }
    if (form.password !== form.confirm) {
      setError("비밀번호가 일치하지 않습니다");
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/(auth)/pet-setup");
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
            계정 만들기
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            반려견의 건강 여정을 함께 시작해요
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {FIELDS.map((f) => (
            <View key={f.key} style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>
                {f.label}
              </Text>
              <View style={styles.inputRow}>
                <View style={[styles.inputIconWrap, { backgroundColor: colors.primaryFixed }]}>
                  <Feather name={f.icon as any} size={15} color={colors.primary} />
                </View>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.surfaceContainerLow,
                      color: colors.foreground,
                      borderColor:
                        f.key === "confirm" && form.confirm && form.password !== form.confirm
                          ? colors.destructive + "80"
                          : form[f.key as keyof typeof form]
                          ? colors.primary + "60"
                          : colors.border,
                    },
                  ]}
                  value={form[f.key as keyof typeof form]}
                  onChangeText={(v) => setField(f.key, v)}
                  placeholder={f.placeholder}
                  placeholderTextColor={colors.outlineVariant}
                  secureTextEntry={f.secure}
                  keyboardType={f.keyboard}
                  autoCapitalize={f.key === "name" ? "words" : "none"}
                  returnKeyType={f.key === "confirm" ? "done" : "next"}
                  onSubmitEditing={f.key === "confirm" ? handleSignup : undefined}
                />
              </View>
            </View>
          ))}

          {error !== "" && (
            <View style={[styles.errorBox, { backgroundColor: colors.destructive + "15" }]}>
              <Feather name="alert-circle" size={14} color={colors.destructive} />
              <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.signupBtn,
              { backgroundColor: colors.primary },
              loading && styles.btnDisabled,
            ]}
            onPress={handleSignup}
            activeOpacity={0.85}
            disabled={loading}
          >
            <Text style={styles.signupBtnText}>
              {loading ? "가입 중..." : "이메일로 가입하기"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
            이미 계정이 있으신가요?
          </Text>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={[styles.loginLink, { color: colors.primary }]}>로그인</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.terms, { color: colors.outlineVariant }]}>
          가입하면 이용약관 및 개인정보 처리방침에 동의하는 것으로 간주됩니다
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 24, gap: 20 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  header: { alignItems: "center", gap: 10, paddingVertical: 4 },
  logoBg: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: { fontSize: 28, fontWeight: "800", letterSpacing: -0.8 },
  subtitle: { fontSize: 14, fontWeight: "500", textAlign: "center", lineHeight: 20 },
  form: { gap: 14 },
  inputGroup: { gap: 6 },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  inputRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  inputIconWrap: {
    width: 42,
    height: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  input: {
    flex: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontWeight: "500",
    borderWidth: 1.5,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  errorText: { fontSize: 13, fontWeight: "600" },
  signupBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
  },
  signupBtnText: { fontSize: 16, fontWeight: "800", color: "#fff" },
  btnDisabled: { opacity: 0.5 },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    alignItems: "center",
  },
  footerText: { fontSize: 14 },
  loginLink: { fontSize: 14, fontWeight: "700" },
  terms: { fontSize: 11, textAlign: "center", lineHeight: 16 },
});

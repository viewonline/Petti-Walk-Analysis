import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
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
import { usePet, PetInfo } from "@/context/PetContext";

const GENDER_OPTIONS = ["수컷", "암컷"] as const;
const NEUTERED_OPTIONS = ["했음", "안했음"] as const;

const TEXT_FIELDS: {
  key: keyof PetInfo;
  label: string;
  placeholder: string;
  icon: string;
  unit?: string;
  keyboard?: "default" | "numeric" | "decimal-pad";
  required?: boolean;
}[] = [
  { key: "name", label: "반려동물 이름", placeholder: "이름 입력 (2~10글자)", icon: "tag", required: true },
  { key: "breed", label: "견종", placeholder: "견종 입력 (예: 골든 리트리버)", icon: "activity" },
  { key: "age", label: "나이", placeholder: "나이 입력", icon: "calendar", unit: "살", keyboard: "numeric" },
  { key: "weight", label: "체중", placeholder: "체중 입력", icon: "trending-up", unit: "kg", keyboard: "decimal-pad" },
  { key: "owner", label: "견주 이름", placeholder: "보호자 이름 입력", icon: "user" },
  { key: "hospital", label: "동물병원", placeholder: "주로 방문하는 병원명", icon: "map-pin" },
];

export default function PetSetupScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const { setPetInfo } = usePet();

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 44) : insets.top;

  const [form, setForm] = useState<PetInfo>({
    name: "",
    breed: "",
    gender: "수컷",
    neutered: "안했음",
    age: "",
    weight: "",
    owner: "",
    hospital: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const setField = (key: keyof PetInfo, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error) setError("");
  };

  const handleRegister = () => {
    if (!form.name.trim()) {
      setError("반려동물 이름은 필수입니다");
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setLoading(true);
    const finalInfo: PetInfo = {
      name: form.name.trim() || "내 강아지",
      breed: form.breed.trim() || "미정",
      gender: form.gender,
      neutered: form.neutered,
      age: form.age.trim() || "1",
      weight: form.weight.trim() || "0",
      owner: form.owner.trim() || "견주",
      hospital: form.hospital.trim() || "미정",
    };
    setTimeout(() => {
      setPetInfo(finalInfo);
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
          { paddingTop: topPad + 12, paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.stepBadge, { backgroundColor: colors.primaryFixed }]}>
            <Text style={[styles.stepText, { color: colors.primary }]}>2 / 2단계</Text>
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>
            반려동물 등록
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            반려견 정보를 입력하면 더 정확한 분석이 가능합니다
          </Text>
        </View>

        {/* Pet avatar placeholder */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatarCircle, { backgroundColor: colors.primaryFixed }]}>
            <Feather name="heart" size={40} color={colors.primary} />
          </View>
          <Text style={[styles.avatarHint, { color: colors.mutedForeground }]}>
            반려견 사진 (선택)
          </Text>
        </View>

        {/* Gender + Neutered Selection */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          {/* 성별 */}
          <View style={[styles.fieldLabelRow, { marginBottom: 10 }]}>
            <View style={[styles.fieldIcon, { backgroundColor: colors.primaryFixed }]}>
              <Feather name="users" size={14} color={colors.primary} />
            </View>
            <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>성별</Text>
          </View>
          <View style={[styles.genderGrid, { marginBottom: 20 }]}>
            {GENDER_OPTIONS.map((g) => {
              const selected = form.gender === g;
              return (
                <TouchableOpacity
                  key={g}
                  style={[
                    styles.genderBtn,
                    {
                      backgroundColor: selected ? colors.primary : colors.surfaceContainerLow,
                      borderColor: selected ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setField("gender", g);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.genderText, { color: selected ? "#fff" : colors.foreground }]}>
                    {g}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 중성화 여부 */}
          <View style={[styles.fieldLabelRow, { marginBottom: 10 }]}>
            <View style={[styles.fieldIcon, { backgroundColor: colors.primaryFixed }]}>
              <Feather name="shield" size={14} color={colors.primary} />
            </View>
            <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>중성화 여부</Text>
          </View>
          <View style={styles.genderGrid}>
            {NEUTERED_OPTIONS.map((n) => {
              const selected = form.neutered === n;
              return (
                <TouchableOpacity
                  key={n}
                  style={[
                    styles.genderBtn,
                    {
                      backgroundColor: selected ? colors.primary : colors.surfaceContainerLow,
                      borderColor: selected ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setField("neutered", n);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.genderText, { color: selected ? "#fff" : colors.foreground }]}>
                    {n}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Text Fields */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          {TEXT_FIELDS.map((f, i) => (
            <View
              key={f.key}
              style={[
                styles.fieldRow,
                i < TEXT_FIELDS.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border + "30",
                },
              ]}
            >
              <View style={[styles.fieldIcon, { backgroundColor: colors.primaryFixed }]}>
                <Feather name={f.icon as any} size={14} color={colors.primary} />
              </View>
              <View style={styles.fieldContent}>
                <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>
                  {f.label}
                  {f.required && (
                    <Text style={{ color: colors.destructive }}> *</Text>
                  )}
                </Text>
                <View style={styles.inputWithUnit}>
                  <TextInput
                    style={[
                      styles.fieldInput,
                      { color: colors.foreground },
                    ]}
                    value={form[f.key]}
                    onChangeText={(v) => setField(f.key, v)}
                    placeholder={f.placeholder}
                    placeholderTextColor={colors.outlineVariant}
                    keyboardType={f.keyboard ?? "default"}
                    returnKeyType="next"
                  />
                  {f.unit && (
                    <Text style={[styles.unitLabel, { color: colors.mutedForeground }]}>
                      {f.unit}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Error */}
        {error !== "" && (
          <View style={[styles.errorBox, { backgroundColor: colors.destructive + "15" }]}>
            <Feather name="alert-circle" size={14} color={colors.destructive} />
            <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
          </View>
        )}

        {/* Skip hint */}
        <Text style={[styles.skipHint, { color: colors.outlineVariant }]}>
          * 필수 항목 외 나머지는 나중에 프로필에서 수정할 수 있습니다
        </Text>

        {/* Register button */}
        <TouchableOpacity
          style={[styles.registerBtn, { backgroundColor: colors.primary }, loading && styles.btnDisabled]}
          onPress={handleRegister}
          activeOpacity={0.85}
          disabled={loading}
        >
          <Feather name="check-circle" size={20} color="#fff" />
          <Text style={styles.registerBtnText}>
            {loading ? "등록 중..." : "등록 완료"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 16 },
  header: { alignItems: "center", gap: 8, paddingTop: 8 },
  stepBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  stepText: { fontSize: 12, fontWeight: "700" },
  title: { fontSize: 26, fontWeight: "800", letterSpacing: -0.6 },
  subtitle: { fontSize: 13, textAlign: "center", lineHeight: 19 },
  avatarSection: { alignItems: "center", gap: 8 },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarHint: { fontSize: 12, fontWeight: "500" },
  card: {
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  fieldLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  genderGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  genderBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  genderText: { fontSize: 13, fontWeight: "600" },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  fieldIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  fieldContent: { flex: 1, gap: 2 },
  fieldLabel: { fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.3 },
  inputWithUnit: { flexDirection: "row", alignItems: "center", gap: 4 },
  fieldInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    paddingVertical: 2,
  },
  unitLabel: { fontSize: 13, fontWeight: "500" },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  errorText: { fontSize: 13, fontWeight: "600" },
  skipHint: { fontSize: 11, textAlign: "center", lineHeight: 16 },
  registerBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  registerBtnText: { fontSize: 16, fontWeight: "800", color: "#fff" },
  btnDisabled: { opacity: 0.5 },
});

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
import { BreedPicker } from "@/components/BreedPicker";
import { BirthdatePicker } from "@/components/BirthdatePicker";
import { HospitalSearch } from "@/components/HospitalSearch";

const GENDER_OPTIONS = ["수컷", "암컷"] as const;
const NEUTERED_OPTIONS = ["했음", "안했음"] as const;

const CONCERN_OPTIONS = [
  "퇴행성 관절염", "슬개골 탈구", "기관지협", "비만", "세균성/식이성 설사",
  "외이염(급성)", "유루증", "치은염/치주염", "피부사상균증", "방광염",
  "소양증", "외이염(만성)", "장염(급성 포함)", "피부염(감염성)", "피부염(아토피성)", "피부질환",
];

const FOOD_OPTIONS = [
  "호흡기건강", "피모/모질 개선", "포만감/기호성", "치석예방/제거", "저지방",
  "기능 개선", "영양공급", "알러지 예방/완화", "심장 건강", "소화력/식욕 증진",
  "면역력 향상", "눈 건강(눈물,시력)", "노화예방", "근력강화", "관절/뼈 도움",
  "다이어트", "성장발육", "스트레스/분리불안", "귀 건강", "피부개선",
];

type StringKey = "name" | "breed" | "age" | "weight" | "owner" | "hospital" | "birthdate" | "regNumber";

const FIELDS_BEFORE: { key: StringKey; label: string; placeholder: string; icon: string; unit?: string; keyboard?: "default" | "numeric" | "decimal-pad"; required?: boolean }[] = [
  { key: "name", label: "반려동물 이름", placeholder: "이름 입력 (2~10글자)", icon: "tag", required: true },
  { key: "breed", label: "견종", placeholder: "견종 입력 (예: 골든 리트리버)", icon: "activity" },
];

const FIELDS_AFTER: { key: StringKey; label: string; placeholder: string; icon: string; unit?: string; keyboard?: "default" | "numeric" | "decimal-pad" }[] = [
  { key: "age", label: "나이", placeholder: "나이 입력", icon: "calendar", unit: "살", keyboard: "numeric" },
  { key: "weight", label: "체중", placeholder: "체중 입력", icon: "trending-up", unit: "kg", keyboard: "decimal-pad" },
  { key: "owner", label: "견주 이름", placeholder: "보호자 이름 입력", icon: "user" },
  { key: "hospital", label: "동물병원", placeholder: "주로 방문하는 병원명", icon: "map-pin" },
  { key: "birthdate", label: "생년월일", placeholder: "YYYY-MM-DD (예: 2019-03-15)", icon: "calendar" },
  { key: "regNumber", label: "동물 등록 번호", placeholder: "동물 등록 번호 입력", icon: "hash" },
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
    birthdate: "",
    regNumber: "",
    concerns: [],
    foods: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const setField = (key: StringKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error) setError("");
  };

  const setToggle = (key: "gender" | "neutered", value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArray = (key: "concerns" | "foods", value: string, max: number) => {
    setForm((prev) => {
      const arr = prev[key] as string[];
      if (arr.includes(value)) {
        return { ...prev, [key]: arr.filter((v) => v !== value) };
      }
      if (arr.length >= max) return prev;
      return { ...prev, [key]: [...arr, value] };
    });
    Haptics.selectionAsync();
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
      birthdate: form.birthdate.trim(),
      regNumber: form.regNumber.trim(),
      concerns: form.concerns,
      foods: form.foods,
    };
    setTimeout(() => {
      setPetInfo(finalInfo);
      setLoading(false);
      login();
    }, 600);
  };

  const renderTextField = (f: typeof FIELDS_BEFORE[0] | typeof FIELDS_AFTER[0], showDivider: boolean) => {
    const dividerStyle = showDivider ? { borderBottomWidth: 1, borderBottomColor: colors.border + "30" } : {};
    return (
      <View key={f.key} style={[styles.fieldRow, { alignItems: "flex-start" }, dividerStyle]}>
        <View style={[styles.fieldIcon, { backgroundColor: colors.primaryFixed, marginTop: 2 }]}>
          <Feather name={f.icon as any} size={14} color={colors.primary} />
        </View>
        <View style={[styles.fieldContent, { gap: 0 }]}>
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>
            {f.label}
            {"required" in f && f.required && (
              <Text style={{ color: colors.destructive }}> *</Text>
            )}
          </Text>

          {f.key === "breed" ? (
            <BreedPicker value={form.breed} onChange={(v) => setField("breed", v)} colors={colors} />
          ) : f.key === "birthdate" ? (
            <BirthdatePicker value={form.birthdate} onChange={(v) => setField("birthdate", v)} colors={colors} />
          ) : f.key === "hospital" ? (
            <HospitalSearch value={form.hospital} onChange={(v) => setField("hospital", v)} colors={colors} />
          ) : (
            <View style={styles.inputWithUnit}>
              <TextInput
                style={[styles.fieldInput, { color: colors.foreground }]}
                value={form[f.key]}
                onChangeText={(v) => setField(f.key, v)}
                placeholder={f.placeholder}
                placeholderTextColor={colors.outlineVariant}
                keyboardType={f.keyboard ?? "default"}
                returnKeyType="next"
              />
              {f.unit && (
                <Text style={[styles.unitLabel, { color: colors.mutedForeground }]}>{f.unit}</Text>
              )}
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderToggleRow = (
    label: string, icon: string,
    options: readonly string[],
    value: string,
    onSelect: (v: string) => void,
    showDivider: boolean
  ) => (
    <View style={[styles.fieldRow, { alignItems: "flex-start" }, showDivider && { borderBottomWidth: 1, borderBottomColor: colors.border + "30" }]}>
      <View style={[styles.fieldIcon, { backgroundColor: colors.primaryFixed, marginTop: 2 }]}>
        <Feather name={icon as any} size={14} color={colors.primary} />
      </View>
      <View style={[styles.fieldContent, { gap: 8 }]}>
        <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{label}</Text>
        <View style={styles.genderGrid}>
          {options.map((opt) => {
            const selected = value === opt;
            return (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.genderBtn,
                  {
                    backgroundColor: selected ? colors.primary : colors.surfaceContainerLow,
                    borderColor: selected ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => { Haptics.selectionAsync(); onSelect(opt); }}
                activeOpacity={0.7}
              >
                <Text style={[styles.genderText, { color: selected ? "#fff" : colors.foreground }]}>
                  {opt}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );

  const renderMultiSelect = (
    label: string, icon: string,
    options: string[], selected: string[],
    onToggle: (v: string) => void,
    max: number,
    isLast: boolean
  ) => (
    <View style={[styles.fieldRow, { alignItems: "flex-start" }, !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border + "30" }]}>
      <View style={[styles.fieldIcon, { backgroundColor: colors.primaryFixed, marginTop: 2 }]}>
        <Feather name={icon as any} size={14} color={colors.primary} />
      </View>
      <View style={[styles.fieldContent, { gap: 8 }]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{label}</Text>
          <Text style={[styles.maxHint, { color: colors.outlineVariant }]}>최대 {max}개</Text>
        </View>
        <View style={styles.tagGrid}>
          {options.map((opt) => {
            const isSelected = selected.includes(opt);
            const isDisabled = !isSelected && selected.length >= max;
            return (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.tagBtn,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surfaceContainerLow,
                    borderColor: isSelected ? colors.primary : isDisabled ? colors.border + "50" : colors.border,
                    opacity: isDisabled ? 0.45 : 1,
                  },
                ]}
                onPress={() => onToggle(opt)}
                activeOpacity={0.7}
                disabled={isDisabled}
              >
                <Text style={[styles.tagText, { color: isSelected ? "#fff" : colors.foreground }]}>
                  {opt}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );

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
          <Text style={[styles.title, { color: colors.foreground }]}>반려동물 등록</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            반려견 정보를 입력하면 더 정확한 분석이 가능합니다
          </Text>
        </View>

        {/* Pet avatar placeholder */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatarCircle, { backgroundColor: colors.primaryFixed }]}>
            <Feather name="heart" size={40} color={colors.primary} />
          </View>
          <Text style={[styles.avatarHint, { color: colors.mutedForeground }]}>반려견 사진 (선택)</Text>
        </View>

        {/* All Fields Card */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          {/* 이름, 견종 */}
          {FIELDS_BEFORE.map((f, i) => renderTextField(f, true))}

          {/* 성별 */}
          {renderToggleRow("성별", "users", GENDER_OPTIONS, form.gender, (v) => setToggle("gender", v), true)}

          {/* 중성화 여부 */}
          {renderToggleRow("중성화 여부", "shield", NEUTERED_OPTIONS, form.neutered, (v) => setToggle("neutered", v), true)}

          {/* 나이, 체중, 견주, 병원, 생년월일, 동물등록번호 */}
          {FIELDS_AFTER.map((f, i) => renderTextField(f, i < FIELDS_AFTER.length - 1))}
        </View>

        {/* 걱정되는 질병 */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          {renderMultiSelect(
            "걱정되는 질병", "alert-circle",
            CONCERN_OPTIONS, form.concerns,
            (v) => toggleArray("concerns", v, 3),
            3, true
          )}
        </View>

        {/* 관심있는 기능성 사료 */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          {renderMultiSelect(
            "관심있는 기능성 사료", "package",
            FOOD_OPTIONS, form.foods,
            (v) => toggleArray("foods", v, 3),
            3, true
          )}
        </View>

        {/* Error */}
        {error !== "" && (
          <View style={[styles.errorBox, { backgroundColor: colors.destructive + "15" }]}>
            <Feather name="alert-circle" size={14} color={colors.destructive} />
            <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
          </View>
        )}

        <Text style={[styles.skipHint, { color: colors.outlineVariant }]}>
          * 필수 항목 외 나머지는 나중에 프로필에서 수정할 수 있습니다
        </Text>

        <TouchableOpacity
          style={[styles.registerBtn, { backgroundColor: colors.primary }, loading && styles.btnDisabled]}
          onPress={handleRegister}
          activeOpacity={0.85}
          disabled={loading}
        >
          <Feather name="check-circle" size={20} color="#fff" />
          <Text style={styles.registerBtnText}>{loading ? "등록 중..." : "등록 완료"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 16 },
  header: { alignItems: "center", gap: 8, paddingTop: 8 },
  stepBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  stepText: { fontSize: 12, fontWeight: "700" },
  title: { fontSize: 26, fontWeight: "800", letterSpacing: -0.6 },
  subtitle: { fontSize: 13, textAlign: "center", lineHeight: 19 },
  avatarSection: { alignItems: "center", gap: 8 },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center" },
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
  genderGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  genderBtn: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10, borderWidth: 1.5 },
  genderText: { fontSize: 13, fontWeight: "600" },
  tagGrid: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tagBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
  tagText: { fontSize: 12, fontWeight: "500" },
  maxHint: { fontSize: 10, fontWeight: "500" },
  fieldRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, gap: 12 },
  fieldIcon: { width: 30, height: 30, borderRadius: 8, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  fieldContent: { flex: 1, gap: 2 },
  fieldLabel: { fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.3 },
  inputWithUnit: { flexDirection: "row", alignItems: "center", gap: 4 },
  fieldInput: { flex: 1, fontSize: 15, fontWeight: "600", paddingVertical: 2 },
  unitLabel: { fontSize: 13, fontWeight: "500" },
  errorBox: { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 },
  errorText: { fontSize: 13, fontWeight: "600" },
  skipHint: { fontSize: 11, textAlign: "center", lineHeight: 16 },
  registerBtn: { borderRadius: 16, paddingVertical: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  registerBtnText: { fontSize: 16, fontWeight: "800", color: "#fff" },
  btnDisabled: { opacity: 0.5 },
});

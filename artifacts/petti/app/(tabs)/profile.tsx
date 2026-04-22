import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Alert,
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
import { mockAnalyses, OPTIMAL_ROM } from "@/data/mockData";
import { usePet, PetInfo } from "@/context/PetContext";
import { useAuth } from "@/context/AuthContext";
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

const FIELDS = [
  { key: "name" as keyof PetInfo, icon: "tag", label: "이름", unit: "", type: "text" },
  { key: "breed" as keyof PetInfo, icon: "activity", label: "견종", unit: "", type: "breed" },
  { key: "gender" as keyof PetInfo, icon: "users", label: "성별", unit: "", type: "toggle" },
  { key: "neutered" as keyof PetInfo, icon: "shield", label: "중성화 여부", unit: "", type: "toggle" },
  { key: "age" as keyof PetInfo, icon: "calendar", label: "나이", unit: "살", type: "text" },
  { key: "weight" as keyof PetInfo, icon: "trending-up", label: "체중", unit: "kg", type: "text" },
  { key: "owner" as keyof PetInfo, icon: "user", label: "견주", unit: "", type: "text" },
  { key: "hospital" as keyof PetInfo, icon: "map-pin", label: "동물병원", unit: "", type: "hospital" },
  { key: "birthdate" as keyof PetInfo, icon: "calendar", label: "생년월일", unit: "", type: "birthdate" },
  { key: "regNumber" as keyof PetInfo, icon: "hash", label: "동물 등록 번호", unit: "", type: "text" },
  { key: "concerns" as keyof PetInfo, icon: "alert-circle", label: "걱정되는 질병", unit: "", type: "multiselect" },
  { key: "foods" as keyof PetInfo, icon: "package", label: "관심있는 기능성 사료", unit: "", type: "multiselect" },
];

const SETTINGS = [
  { icon: "bell", label: "알림 설정" },
  { icon: "shield", label: "개인정보 보호" },
  { icon: "help-circle", label: "도움말 및 지원" },
  { icon: "info", label: "앱 정보" },
  { icon: "log-out", label: "로그아웃" },
];

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? Math.max(insets.top, 44) : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

  const { petInfo, setPetInfo } = usePet();
  const { logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<PetInfo>(petInfo);

  const latestRom = mockAnalyses[0].averageRom;
  const isGood = latestRom >= OPTIMAL_ROM.min && latestRom <= OPTIMAL_ROM.max;

  const openEdit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDraft({ ...petInfo });
    setEditing(true);
  };

  const saveEdit = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setPetInfo({ ...draft });
    setEditing(false);
  };

  const cancelEdit = () => {
    setEditing(false);
  };

  const setField = (key: keyof PetInfo, value: string) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArrayField = (key: "concerns" | "foods", value: string, max: number) => {
    Haptics.selectionAsync();
    setDraft((prev) => {
      const arr = (prev[key] as string[]) || [];
      if (arr.includes(value)) return { ...prev, [key]: arr.filter((v) => v !== value) };
      if (arr.length >= max) return prev;
      return { ...prev, [key]: [...arr, value] };
    });
  };

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: topPad + 12,
          paddingBottom: insets.bottom + bottomPad + 100,
        },
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={[styles.logoCircle, { backgroundColor: colors.primaryFixed }]}>
          <Feather name="activity" size={18} color={colors.primary} />
        </View>
        <Text style={[styles.appName, { color: colors.primary }]}>Petti</Text>

        {editing ? (
          <View style={styles.editActions}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.surfaceContainerLow }]}
              onPress={cancelEdit}
              activeOpacity={0.7}
            >
              <Text style={[styles.cancelText, { color: colors.mutedForeground }]}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.primary }]}
              onPress={saveEdit}
              activeOpacity={0.7}
            >
              <Text style={styles.saveText}>저장</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.logoCircle, { backgroundColor: colors.surfaceContainerLow }]}
            onPress={openEdit}
            activeOpacity={0.7}
          >
            <Feather name="edit-2" size={16} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Pet Profile Hero */}
      <View style={[styles.profileHero, { backgroundColor: colors.surfaceContainerLow }]}>
        <View style={[styles.avatarCircle, { backgroundColor: colors.primaryFixed }]}>
          <Feather name="heart" size={40} color={colors.primary} />
        </View>
        <Text style={[styles.heroName, { color: colors.foreground }]}>
          {petInfo.name}
        </Text>
        <Text style={[styles.heroBreed, { color: colors.mutedForeground }]}>
          {petInfo.age}살 {petInfo.breed}
        </Text>
        <View style={styles.statsRow}>
          {[
            { label: "분석 횟수", value: `${mockAnalyses.length}회` },
            { label: "최근 ROM", value: `${latestRom}°` },
            { label: "상태", value: isGood ? "양호" : "주의 필요" },
          ].map((s, i) => (
            <View key={i} style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Pet Info Card */}
      <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
        <View style={styles.cardTitleRow}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>반려견 정보</Text>
          {editing && (
            <View style={[styles.editingBadge, { backgroundColor: colors.primaryFixed }]}>
              <Feather name="edit-3" size={11} color={colors.primary} />
              <Text style={[styles.editingBadgeText, { color: colors.primary }]}>편집 중</Text>
            </View>
          )}
        </View>

        {FIELDS.map((f, i) => {
          const isLast = i === FIELDS.length - 1;
          const divider = !isLast ? { borderBottomWidth: 1, borderBottomColor: colors.border + "30" } : {};

          // Toggle fields (gender, neutered)
          if (f.type === "toggle") {
            const toggleOptions = f.key === "gender" ? GENDER_OPTIONS : NEUTERED_OPTIONS;
            return (
              <View key={f.key} style={[styles.infoRow, { flexDirection: "column", alignItems: "flex-start", gap: 10 }, divider]}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <View style={[styles.infoIcon, { backgroundColor: colors.surfaceContainerLow }]}>
                    <Feather name={f.icon as any} size={16} color={colors.primary} />
                  </View>
                  <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>{f.label}</Text>
                </View>
                {editing ? (
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, paddingBottom: 4 }}>
                    {toggleOptions.map((opt) => {
                      const selected = draft[f.key] === opt;
                      return (
                        <TouchableOpacity
                          key={opt}
                          onPress={() => setField(f.key, opt)}
                          style={[styles.genderBtn, { backgroundColor: selected ? colors.primary : colors.surfaceContainerLow, borderColor: selected ? colors.primary : colors.border }]}
                          activeOpacity={0.75}
                        >
                          <Text style={[styles.genderBtnText, { color: selected ? "#fff" : colors.mutedForeground }]}>{opt}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : (
                  <Text style={[styles.infoValue, { color: colors.foreground, paddingBottom: 4 }]}>
                    {String(petInfo[f.key] || "—")}
                  </Text>
                )}
              </View>
            );
          }

          // Multi-select fields (concerns, foods)
          if (f.type === "multiselect") {
            const allOptions = f.key === "concerns" ? CONCERN_OPTIONS : FOOD_OPTIONS;
            const selectedArr = (editing ? draft[f.key] : petInfo[f.key]) as string[];
            const max = 3;
            return (
              <View key={f.key} style={[styles.infoRow, { flexDirection: "column", alignItems: "flex-start", gap: 10 }, divider]}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <View style={[styles.infoIcon, { backgroundColor: colors.surfaceContainerLow }]}>
                    <Feather name={f.icon as any} size={16} color={colors.primary} />
                  </View>
                  <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>{f.label}</Text>
                  {editing && (
                    <Text style={[styles.maxHint, { color: colors.outlineVariant }]}>최대 {max}개</Text>
                  )}
                </View>
                {editing ? (
                  <View style={[styles.tagGrid, { paddingBottom: 4 }]}>
                    {allOptions.map((opt) => {
                      const isSelected = selectedArr.includes(opt);
                      const isDisabled = !isSelected && selectedArr.length >= max;
                      return (
                        <TouchableOpacity
                          key={opt}
                          onPress={() => toggleArrayField(f.key as "concerns" | "foods", opt, max)}
                          style={[
                            styles.tagBtn,
                            {
                              backgroundColor: isSelected ? colors.primary : colors.surfaceContainerLow,
                              borderColor: isSelected ? colors.primary : isDisabled ? colors.border + "50" : colors.border,
                              opacity: isDisabled ? 0.45 : 1,
                            },
                          ]}
                          activeOpacity={0.75}
                          disabled={isDisabled}
                        >
                          <Text style={[styles.tagText, { color: isSelected ? "#fff" : colors.foreground }]}>{opt}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : (
                  <View style={[styles.tagGrid, { paddingBottom: 4 }]}>
                    {selectedArr.length > 0 ? selectedArr.map((opt) => (
                      <View key={opt} style={[styles.tagBtn, { backgroundColor: colors.primaryFixed, borderColor: colors.primary + "40" }]}>
                        <Text style={[styles.tagText, { color: colors.primary }]}>{opt}</Text>
                      </View>
                    )) : (
                      <Text style={[styles.infoValue, { color: colors.outlineVariant }]}>—</Text>
                    )}
                  </View>
                )}
              </View>
            );
          }

          // Picker fields (breed, birthdate, hospital) — expand vertically in edit mode
          if (f.type === "breed" || f.type === "birthdate" || f.type === "hospital") {
            return (
              <View key={f.key} style={[styles.infoRow, { flexDirection: "column", alignItems: "flex-start", gap: 6 }, divider]}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <View style={[styles.infoIcon, { backgroundColor: colors.surfaceContainerLow }]}>
                    <Feather name={f.icon as any} size={16} color={colors.primary} />
                  </View>
                  <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>{f.label}</Text>
                </View>
                {editing ? (
                  <View style={{ width: "100%", paddingBottom: 4 }}>
                    {f.type === "breed" && (
                      <BreedPicker value={String(draft.breed || "")} onChange={(v) => setField("breed", v)} colors={colors} />
                    )}
                    {f.type === "birthdate" && (
                      <BirthdatePicker value={String(draft.birthdate || "")} onChange={(v) => setField("birthdate", v)} colors={colors} />
                    )}
                    {f.type === "hospital" && (
                      <HospitalSearch value={String(draft.hospital || "")} onChange={(v) => setField("hospital", v)} colors={colors} />
                    )}
                  </View>
                ) : (
                  <Text style={[styles.infoValue, { color: colors.foreground, paddingBottom: 4 }]}>
                    {String(petInfo[f.key] || "—")}
                  </Text>
                )}
              </View>
            );
          }

          // Text fields
          return (
            <View key={f.key} style={[styles.infoRow, divider]}>
              <View style={[styles.infoIcon, { backgroundColor: colors.surfaceContainerLow }]}>
                <Feather name={f.icon as any} size={16} color={colors.primary} />
              </View>
              <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>{f.label}</Text>
              {editing ? (
                <View style={styles.inputWrap}>
                  <TextInput
                    style={[styles.inlineInput, { color: colors.foreground, backgroundColor: colors.surfaceContainerLow, borderColor: colors.primary + "60" }]}
                    value={String(draft[f.key] || "")}
                    onChangeText={(v) => setField(f.key, v)}
                    keyboardType={f.key === "age" ? "numeric" : f.key === "weight" ? "decimal-pad" : "default"}
                    returnKeyType="done"
                    selectTextOnFocus
                  />
                  {f.unit !== "" && (
                    <Text style={[styles.unitText, { color: colors.mutedForeground }]}>{f.unit}</Text>
                  )}
                </View>
              ) : (
                <Text style={[styles.infoValue, { color: colors.foreground }]}>
                  {String(petInfo[f.key] || "—")}{f.unit !== "" ? ` ${f.unit}` : ""}
                </Text>
              )}
            </View>
          );
        })}

        {editing && (
          <TouchableOpacity
            style={[styles.saveFullBtn, { backgroundColor: colors.primary }]}
            onPress={saveEdit}
            activeOpacity={0.85}
          >
            <Feather name="check" size={16} color="#fff" />
            <Text style={styles.saveFullText}>변경사항 저장</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Settings */}
      {!editing && (
        <>
          <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>설정</Text>
            {SETTINGS.map((s, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.settingRow,
                  i < SETTINGS.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border + "30",
                  },
                ]}
                onPress={() => {
                  Haptics.selectionAsync();
                  if (s.label === "로그아웃") {
                    if (Platform.OS === "web") {
                      if (window.confirm("정말 로그아웃하시겠습니까?")) {
                        logout();
                      }
                    } else {
                      Alert.alert("로그아웃", "정말 로그아웃하시겠습니까?", [
                        { text: "취소", style: "cancel" },
                        {
                          text: "로그아웃",
                          style: "destructive",
                          onPress: logout,
                        },
                      ]);
                    }
                  }
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.infoIcon, { backgroundColor: colors.surfaceContainerLow }]}>
                  <Feather
                    name={s.icon as any}
                    size={16}
                    color={s.label === "로그아웃" ? colors.destructive : colors.primary}
                  />
                </View>
                <Text
                  style={[
                    styles.settingLabel,
                    { color: s.label === "로그아웃" ? colors.destructive : colors.foreground },
                  ]}
                >
                  {s.label}
                </Text>
                <Feather name="chevron-right" size={16} color={colors.outlineVariant} />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[styles.version, { color: colors.outlineVariant }]}>Petti v1.0.0</Text>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 16 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  logoCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  appName: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.5,
    flex: 1,
    textAlign: "center",
  },
  editActions: {
    flexDirection: "row",
    gap: 6,
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: { fontSize: 13, fontWeight: "600" },
  saveText: { fontSize: 13, fontWeight: "800", color: "#fff" },
  profileHero: {
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    gap: 8,
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  heroName: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  heroBreed: { fontSize: 14, fontWeight: "500" },
  statsRow: { flexDirection: "row", gap: 24, marginTop: 16 },
  statItem: { alignItems: "center", gap: 2 },
  statValue: { fontSize: 20, fontWeight: "800", letterSpacing: -0.5 },
  statLabel: { fontSize: 11, fontWeight: "500" },
  infoCard: {
    borderRadius: 20,
    padding: 16,
    gap: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  cardTitle: { fontSize: 15, fontWeight: "700" },
  editingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  editingBadgeText: { fontSize: 11, fontWeight: "700" },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  infoLabel: { fontSize: 13, fontWeight: "500", flex: 1 },
  infoValue: { fontSize: 13, fontWeight: "600" },
  inputWrap: { flexDirection: "row", alignItems: "center", gap: 4 },
  inlineInput: {
    fontSize: 14,
    fontWeight: "600",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1.5,
    minWidth: 90,
    textAlign: "right",
  },
  unitText: { fontSize: 13, fontWeight: "500" },
  genderBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  genderBtnText: {
    fontSize: 13,
    fontWeight: "500",
  },
  tagGrid: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tagBtn: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1 },
  tagText: { fontSize: 12, fontWeight: "500" },
  maxHint: { fontSize: 10, fontWeight: "500" },
  saveFullBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 14,
  },
  saveFullText: { fontSize: 15, fontWeight: "800", color: "#fff" },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  settingLabel: { fontSize: 14, fontWeight: "500", flex: 1 },
  version: { textAlign: "center", fontSize: 12, fontWeight: "500" },
});

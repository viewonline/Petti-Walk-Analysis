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

interface PetInfo {
  name: string;
  breed: string;
  age: string;
  weight: string;
  owner: string;
  hospital: string;
}

const DEFAULT_INFO: PetInfo = {
  name: "올리버",
  breed: "골든 리트리버",
  age: "6",
  weight: "28.5",
  owner: "김민준",
  hospital: "행복 동물병원",
};

const FIELDS = [
  { key: "name" as keyof PetInfo, icon: "tag", label: "이름", unit: "" },
  { key: "breed" as keyof PetInfo, icon: "activity", label: "견종", unit: "" },
  { key: "age" as keyof PetInfo, icon: "calendar", label: "나이", unit: "살" },
  { key: "weight" as keyof PetInfo, icon: "trending-up", label: "체중", unit: "kg" },
  { key: "owner" as keyof PetInfo, icon: "user", label: "견주", unit: "" },
  { key: "hospital" as keyof PetInfo, icon: "map-pin", label: "동물병원", unit: "" },
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

  const [petInfo, setPetInfo] = useState<PetInfo>(DEFAULT_INFO);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<PetInfo>(DEFAULT_INFO);

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

        {FIELDS.map((f, i) => (
          <View
            key={f.key}
            style={[
              styles.infoRow,
              i < FIELDS.length - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: colors.border + "30",
              },
            ]}
          >
            <View style={[styles.infoIcon, { backgroundColor: colors.surfaceContainerLow }]}>
              <Feather name={f.icon as any} size={16} color={colors.primary} />
            </View>
            <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>
              {f.label}
            </Text>
            {editing ? (
              <View style={styles.inputWrap}>
                <TextInput
                  style={[
                    styles.inlineInput,
                    {
                      color: colors.foreground,
                      backgroundColor: colors.surfaceContainerLow,
                      borderColor: colors.primary + "60",
                    },
                  ]}
                  value={draft[f.key]}
                  onChangeText={(v) => setField(f.key, v)}
                  keyboardType={
                    f.key === "age"
                      ? "numeric"
                      : f.key === "weight"
                      ? "decimal-pad"
                      : "default"
                  }
                  returnKeyType="done"
                  selectTextOnFocus
                />
                {f.unit !== "" && (
                  <Text style={[styles.unitText, { color: colors.mutedForeground }]}>
                    {f.unit}
                  </Text>
                )}
              </View>
            ) : (
              <Text style={[styles.infoValue, { color: colors.foreground }]}>
                {petInfo[f.key]}{f.unit !== "" ? ` ${f.unit}` : ""}
              </Text>
            )}
          </View>
        ))}

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
                    Alert.alert("로그아웃", "정말 로그아웃하시겠습니까?", [
                      { text: "취소", style: "cancel" },
                      { text: "로그아웃", style: "destructive" },
                    ]);
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

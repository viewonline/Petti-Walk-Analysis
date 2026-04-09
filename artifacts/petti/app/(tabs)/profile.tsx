import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { mockPet, mockAnalyses, OPTIMAL_ROM } from "@/data/mockData";

const INFO_ROWS = [
  { icon: "tag", label: "이름", value: "올리버" },
  { icon: "activity", label: "견종", value: "골든 리트리버" },
  { icon: "calendar", label: "나이", value: "6살" },
  { icon: "trending-up", label: "체중", value: "28.5 kg" },
  { icon: "user", label: "견주", value: "김민준" },
  { icon: "map-pin", label: "동물병원", value: "행복 동물병원" },
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

  const latestRom = mockAnalyses[0].averageRom;
  const isGood = latestRom >= OPTIMAL_ROM.min && latestRom <= OPTIMAL_ROM.max;

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
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={[styles.logoCircle, { backgroundColor: colors.primaryFixed }]}>
          <Feather name="activity" size={18} color={colors.primary} />
        </View>
        <Text style={[styles.appName, { color: colors.primary }]}>Petti</Text>
        <TouchableOpacity
          style={[styles.logoCircle, { backgroundColor: colors.surfaceContainerLow }]}
          onPress={() => Alert.alert("편집", "반려견 정보 편집 기능은 준비 중입니다.")}
        >
          <Feather name="edit-2" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Pet Profile Hero */}
      <View style={[styles.profileHero, { backgroundColor: colors.surfaceContainerLow }]}>
        <View style={[styles.avatarCircle, { backgroundColor: colors.primaryFixed }]}>
          <Feather name="heart" size={40} color={colors.primary} />
        </View>
        <Text style={[styles.heroName, { color: colors.foreground }]}>
          {mockPet.name}
        </Text>
        <Text style={[styles.heroBreed, { color: colors.mutedForeground }]}>
          {mockPet.age}살 {mockPet.breed}
        </Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: "분석 횟수", value: `${mockAnalyses.length}회` },
            { label: "최근 ROM", value: `${latestRom}°` },
            { label: "상태", value: isGood ? "양호" : "주의 필요" },
          ].map((s, i) => (
            <View key={i} style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {s.value}
              </Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                {s.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Pet Info */}
      <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.foreground }]}>
          반려견 정보
        </Text>
        {INFO_ROWS.map((row, i) => (
          <View
            key={i}
            style={[
              styles.infoRow,
              i < INFO_ROWS.length - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: colors.border + "30",
              },
            ]}
          >
            <View style={[styles.infoIcon, { backgroundColor: colors.surfaceContainerLow }]}>
              <Feather name={row.icon as any} size={16} color={colors.primary} />
            </View>
            <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>
              {row.label}
            </Text>
            <Text style={[styles.infoValue, { color: colors.foreground }]}>
              {row.value}
            </Text>
          </View>
        ))}
      </View>

      {/* Settings */}
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
                {
                  color:
                    s.label === "로그아웃" ? colors.destructive : colors.foreground,
                },
              ]}
            >
              {s.label}
            </Text>
            <Feather name="chevron-right" size={16} color={colors.outlineVariant} />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.version, { color: colors.outlineVariant }]}>
        Petti v1.0.0
      </Text>
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
  heroBreed: {
    fontSize: 14,
    fontWeight: "500",
  },
  statsRow: {
    flexDirection: "row",
    gap: 24,
    marginTop: 16,
  },
  statItem: {
    alignItems: "center",
    gap: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "500",
  },
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
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 12,
  },
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
  infoLabel: {
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "600",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "500",
  },
});

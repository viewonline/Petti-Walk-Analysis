import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AnalysisCard } from "@/components/AnalysisCard";
import { PrescriptionSummarySheet } from "@/components/PrescriptionSummarySheet";
import { RomGauge } from "@/components/RomGauge";
import { StatusBadge } from "@/components/StatusBadge";
import { useColors } from "@/hooks/useColors";
import { mockAnalyses, mockPrescription } from "@/data/mockData";
import { usePet } from "@/context/PetContext";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { petInfo } = usePet();
  const latest = mockAnalyses[0];
  const rx = mockPrescription;

  const [showRxSheet, setShowRxSheet] = useState(false);

  const topPad =
    Platform.OS === "web" ? Math.max(insets.top, 44) : insets.top;
  const bottomPad =
    Platform.OS === "web" ? 34 : 0;

  const handleRecord = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/(tabs)/camera");
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        style={{ flex: 1 }}
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
            style={[styles.settingsBtn, { backgroundColor: colors.surfaceContainerLow }]}
            onPress={() => router.push("/(tabs)/profile")}
            activeOpacity={0.7}
          >
            <Feather name="settings" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* ★ Prescription notification banner */}
        <TouchableOpacity
          style={[styles.rxBanner, { backgroundColor: colors.primaryFixed }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setShowRxSheet(true);
          }}
          activeOpacity={0.88}
        >
          <View style={styles.rxBannerLeft}>
            <View style={[styles.rxTag, { backgroundColor: colors.primary }]}>
              <Text style={styles.rxTagText}>수의사 처방</Text>
            </View>
            <Text style={[styles.rxTitle, { color: colors.primary }]}>
              {petInfo.name}의 맞춤 재활 솔루션이{"\n"}도착했습니다
            </Text>
            <Text style={[styles.rxSub, { color: colors.primary }]}>
              {rx.date} · {rx.vetName}
            </Text>
          </View>
          <View style={[styles.rxIconBox, { backgroundColor: colors.primary }]}>
            <Feather name="package" size={24} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Pet Hero Card */}
        <View style={[styles.heroCard, { backgroundColor: colors.surfaceContainerLow }]}>
          <View>
            <Text style={[styles.guardianLabel, { color: colors.secondary }]}>
              활성 견주
            </Text>
            <Text style={[styles.petName, { color: colors.foreground }]}>
              {petInfo.name}
            </Text>
            <Text style={[styles.petBreed, { color: colors.mutedForeground }]}>
              {petInfo.age}살 {petInfo.breed}
            </Text>
          </View>
          <View style={[styles.pawCircle, { backgroundColor: colors.primaryFixed }]}>
            <Feather name="heart" size={28} color={colors.primary} />
          </View>
        </View>

        {/* Analysis Summary + ROM */}
        <View style={styles.summaryRow}>
          <View
            style={[
              styles.summaryCard,
              { backgroundColor: colors.card, flex: 1.4 },
            ]}
          >
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
              최근 분석
            </Text>
            <Text style={[styles.analysisDate, { color: colors.foreground }]}>
              {latest.date}
            </Text>
            <View style={styles.badgeRow}>
              <View style={[styles.romBadge, { backgroundColor: colors.tertiaryContainer }]}>
                <Text style={[styles.romBadgeText, { color: "#fff" }]}>ROM 상태</Text>
              </View>
              <StatusBadge status={latest.status} size="md" />
            </View>
            <Text
              style={[styles.analysisNote, { color: colors.mutedForeground }]}
              numberOfLines={3}
            >
              {latest.note}
            </Text>
          </View>

          <RomGauge value={latest.averageRom} />
        </View>

        {/* Record Button */}
        <TouchableOpacity
          style={[styles.recordBtn, { backgroundColor: colors.primary }]}
          onPress={handleRecord}
          activeOpacity={0.85}
        >
          <View style={styles.recordIconWrap}>
            <Feather name="video" size={24} color={colors.primary} />
          </View>
          <View>
            <Text style={[styles.recordTitle, { color: "#fff" }]}>
              분석 영상 촬영
            </Text>
            <Text style={[styles.recordSub, { color: "rgba(255,255,255,0.75)" }]}>
              자동 관절 동작 추적
            </Text>
          </View>
        </TouchableOpacity>

        {/* Recent Visits */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              최근 방문
            </Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/history")}>
              <Text style={[styles.viewAll, { color: colors.primary }]}>
                전체 보기
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.visitList}>
            {mockAnalyses.slice(0, 3).map((a) => (
              <AnalysisCard
                key={a.id}
                analysis={a}
                onPress={() => {
                  Haptics.selectionAsync();
                  router.push(`/(tabs)/history`);
                }}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Prescription summary sheet (rendered outside ScrollView) */}
      <PrescriptionSummarySheet
        visible={showRxSheet}
        onClose={() => setShowRxSheet(false)}
        onViewDetail={() => {
          setShowRxSheet(false);
          router.push("/(tabs)/prescription");
        }}
        colors={colors}
      />
    </View>
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
  settingsBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },

  rxBanner: {
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  rxBannerLeft: { flex: 1, gap: 6 },
  rxTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  rxTagText: { fontSize: 10, fontWeight: "800", color: "#fff", letterSpacing: 0.5 },
  rxTitle: { fontSize: 16, fontWeight: "800", lineHeight: 22, letterSpacing: -0.3 },
  rxSub: { fontSize: 12, fontWeight: "500", opacity: 0.7 },
  rxIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  heroCard: {
    borderRadius: 20,
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  guardianLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  petName: {
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: -1,
    lineHeight: 40,
  },
  petBreed: {
    fontSize: 13,
    fontWeight: "500",
    marginTop: 2,
  },
  pawCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "stretch",
  },
  summaryCard: {
    borderRadius: 20,
    padding: 18,
    gap: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  analysisDate: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 20,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  romBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  romBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  analysisNote: {
    fontSize: 12,
    lineHeight: 17,
  },
  recordBtn: {
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  recordIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  recordTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  recordSub: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
  section: { gap: 12 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  viewAll: {
    fontSize: 13,
    fontWeight: "600",
  },
  visitList: { gap: 10 },
});

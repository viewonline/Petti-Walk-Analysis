import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
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
import { useColors } from "@/hooks/useColors";
import { AnalysisCard } from "@/components/AnalysisCard";
import { TrendChart } from "@/components/TrendChart";
import { PettiTalk } from "@/components/PettiTalk";
import { mockAnalyses, mockTrend, Analysis } from "@/data/mockData";

export default function HistoryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<Analysis | null>(null);

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 44) : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

  const selectAnalysis = (a: Analysis) => {
    Haptics.selectionAsync();
    setSelected(selected?.id === a.id ? null : a);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: topPad + 12,
            paddingBottom: insets.bottom + bottomPad + 120,
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
          <View style={styles.logoCircle} />
        </View>

        {/* Title */}
        <View>
          <Text style={[styles.screenTitle, { color: colors.foreground }]}>
            분석 기록
          </Text>
          <Text style={[styles.screenSub, { color: colors.mutedForeground }]}>
            {mockAnalyses.length}건의 분석 결과
          </Text>
        </View>

        {/* Trend Chart — dual lines */}
        <TrendChart data={mockTrend} />

        {/* Analyses list */}
        <View style={styles.listSection}>
          {mockAnalyses.map((a) => (
            <View key={a.id}>
              <AnalysisCard
                analysis={a}
                onPress={() => selectAnalysis(a)}
              />
              {selected?.id === a.id && (
                <View
                  style={[
                    styles.detailCard,
                    { backgroundColor: colors.surfaceContainerLow },
                  ]}
                >
                  <Text style={[styles.detailTitle, { color: colors.primary }]}>
                    분석 상세
                  </Text>
                  <Text style={[styles.detailNote, { color: colors.mutedForeground }]}>
                    {a.note}
                  </Text>
                  {a.compensationPattern && (
                    <View style={[styles.patternBox, { backgroundColor: colors.secondaryFixed }]}>
                      <Feather name="alert-circle" size={13} color={colors.secondary} />
                      <Text style={[styles.patternText, { color: colors.secondary }]}>
                        {a.compensationPattern}
                      </Text>
                    </View>
                  )}
                  <View style={styles.romRow}>
                    {[
                      { label: "좌측 ROM", value: `${a.leftRom}°`, accent: colors.primary },
                      { label: "우측 ROM", value: `${a.rightRom}°`, accent: colors.primary },
                      { label: "평균 ROM", value: `${a.averageRom}°`, accent: colors.primary },
                      { label: "BCS", value: a.bcs.toFixed(1), accent: colors.secondary },
                    ].map((r, i) => (
                      <View
                        key={i}
                        style={[
                          styles.romBox,
                          { backgroundColor: colors.surfaceContainerHighest },
                        ]}
                      >
                        <Text style={[styles.romLabel, { color: colors.mutedForeground }]}>
                          {r.label}
                        </Text>
                        <Text style={[styles.romValue, { color: r.accent }]}>
                          {r.value}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* PettiTalk floating button */}
      <PettiTalk latestAnalysis={mockAnalyses[0]} />
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
  screenTitle: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  screenSub: {
    fontSize: 13,
    fontWeight: "500",
    marginTop: 2,
  },
  listSection: {
    gap: 8,
  },
  detailCard: {
    borderRadius: 16,
    padding: 16,
    marginTop: 4,
    gap: 10,
  },
  detailTitle: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  detailNote: {
    fontSize: 13,
    lineHeight: 18,
  },
  patternBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  patternText: {
    fontSize: 12,
    fontWeight: "600",
    flex: 1,
  },
  romRow: {
    flexDirection: "row",
    gap: 8,
  },
  romBox: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    gap: 4,
  },
  romLabel: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  romValue: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
});

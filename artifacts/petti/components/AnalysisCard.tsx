import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { Analysis } from "@/data/mockData";
import { StatusBadge } from "./StatusBadge";

interface AnalysisCardProps {
  analysis: Analysis;
  onPress?: () => void;
}

export function AnalysisCard({ analysis, onPress }: AnalysisCardProps) {
  const colors = useColors();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View
        style={[
          styles.iconWrap,
          { backgroundColor: colors.surfaceContainerLow },
        ]}
      >
        <Feather name="clock" size={20} color={colors.primary} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.date, { color: colors.foreground }]}>
          {analysis.date}
        </Text>
        <Text
          style={[styles.label, { color: colors.mutedForeground }]}
          numberOfLines={1}
        >
          {analysis.label}
        </Text>
      </View>
      <View style={styles.right}>
        <View style={styles.metrics}>
          <Text style={[styles.rom, { color: colors.foreground }]}>
            {analysis.averageRom}°
          </Text>
          <View style={[styles.bcsPill, { backgroundColor: colors.surfaceContainerLow }]}>
            <Text style={[styles.bcsText, { color: colors.secondary }]}>
              BCS {analysis.bcs.toFixed(1)}
            </Text>
          </View>
        </View>
        <StatusBadge status={analysis.status} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    gap: 2,
  },
  date: {
    fontSize: 14,
    fontWeight: "700",
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
  },
  right: {
    alignItems: "flex-end",
    gap: 5,
  },
  metrics: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  rom: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  bcsPill: {
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  bcsText: {
    fontSize: 11,
    fontWeight: "700",
  },
});

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { OPTIMAL_ROM } from "@/data/mockData";

interface RomGaugeProps {
  value: number;
  label?: string;
}

export function RomGauge({ value, label = "평균 ROM" }: RomGaugeProps) {
  const colors = useColors();

  const min = 80;
  const max = 160;
  const pct = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);
  const optMinPct = ((OPTIMAL_ROM.min - min) / (max - min)) * 100;
  const optMaxPct = ((OPTIMAL_ROM.max - min) / (max - min)) * 100;
  const isGood = value >= OPTIMAL_ROM.min && value <= OPTIMAL_ROM.max;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surfaceContainerHighest },
      ]}
    >
      <Text style={[styles.label, { color: colors.mutedForeground }]}>
        {label}
      </Text>
      <View style={styles.row}>
        <Text style={[styles.value, { color: colors.primary }]}>{value}°</Text>
        <View
          style={[
            styles.dot,
            { backgroundColor: isGood ? colors.secondary : colors.destructive },
          ]}
        />
      </View>
      <View style={[styles.track, { backgroundColor: colors.surfaceContainer }]}>
        <View
          style={[
            styles.optimalZone,
            {
              left: `${optMinPct}%` as any,
              width: `${optMaxPct - optMinPct}%` as any,
              backgroundColor: colors.primaryFixed,
            },
          ]}
        />
        <View
          style={[
            styles.thumb,
            {
              left: `${pct}%` as any,
              backgroundColor: colors.primary,
            },
          ]}
        />
      </View>
      <Text style={[styles.hint, { color: colors.mutedForeground }]}>
        정상 범위 {OPTIMAL_ROM.min}°–{OPTIMAL_ROM.max}°
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 20,
    gap: 8,
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 4,
  },
  value: {
    fontSize: 56,
    fontWeight: "800",
    letterSpacing: -2,
    lineHeight: 60,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 8,
  },
  track: {
    width: "100%",
    height: 8,
    borderRadius: 4,
    position: "relative",
    overflow: "hidden",
    marginTop: 4,
  },
  optimalZone: {
    position: "absolute",
    top: 0,
    bottom: 0,
    opacity: 0.5,
  },
  thumb: {
    position: "absolute",
    top: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: -6,
  },
  hint: {
    fontSize: 11,
    fontWeight: "500",
  },
});

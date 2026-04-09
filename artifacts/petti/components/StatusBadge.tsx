import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { STATUS_COLORS, STATUS_LABELS } from "@/data/mockData";

interface StatusBadgeProps {
  status: "good" | "attention" | "critical";
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const colors = STATUS_COLORS[status] ?? STATUS_COLORS.good;
  const label = STATUS_LABELS[status] ?? "양호";

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: colors.bg },
        size === "md" && styles.badgeMd,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: colors.text },
          size === "md" && styles.textMd,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  badgeMd: {
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  text: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  textMd: {
    fontSize: 12,
  },
});

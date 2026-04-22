import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface Props {
  value: string;
  onChange: (val: string) => void;
  colors: any;
}

function parseParts(value: string) {
  const parts = value.split("-");
  return {
    year: parts[0] || "",
    month: parts[1] || "",
    day: parts[2] || "",
  };
}

function combine(year: string, month: string, day: string) {
  if (!year && !month && !day) return "";
  return [year, month, day].filter(Boolean).join("-");
}

export function BirthdatePicker({ value, onChange, colors }: Props) {
  const { year, month, day } = parseParts(value);

  const update = (y: string, m: string, d: string) => {
    onChange(combine(y, m, d));
  };

  const inputStyle = [
    styles.input,
    {
      color: colors.foreground,
      backgroundColor: colors.surfaceContainerLow,
      borderColor: colors.border + "60",
    },
  ];
  const labelStyle = [styles.sep, { color: colors.mutedForeground }];

  return (
    <View style={styles.row}>
      <View style={styles.group}>
        <TextInput
          style={[inputStyle, styles.yearInput]}
          value={year}
          onChangeText={(v) => {
            const clean = v.replace(/[^0-9]/g, "").slice(0, 4);
            update(clean, month, day);
          }}
          placeholder="2019"
          placeholderTextColor={colors.outlineVariant}
          keyboardType="number-pad"
          maxLength={4}
          returnKeyType="next"
        />
        <Text style={labelStyle}>년</Text>
      </View>

      <View style={styles.group}>
        <TextInput
          style={[inputStyle, styles.smallInput]}
          value={month}
          onChangeText={(v) => {
            const clean = v.replace(/[^0-9]/g, "").slice(0, 2);
            update(year, clean, day);
          }}
          placeholder="03"
          placeholderTextColor={colors.outlineVariant}
          keyboardType="number-pad"
          maxLength={2}
          returnKeyType="next"
        />
        <Text style={labelStyle}>월</Text>
      </View>

      <View style={styles.group}>
        <TextInput
          style={[inputStyle, styles.smallInput]}
          value={day}
          onChangeText={(v) => {
            const clean = v.replace(/[^0-9]/g, "").slice(0, 2);
            update(year, month, clean);
          }}
          placeholder="15"
          placeholderTextColor={colors.outlineVariant}
          keyboardType="number-pad"
          maxLength={2}
          returnKeyType="done"
        />
        <Text style={labelStyle}>일</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
    flexWrap: "wrap",
  },
  group: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  yearInput: { width: 72 },
  smallInput: { width: 48 },
  sep: { fontSize: 14, fontWeight: "500" },
});

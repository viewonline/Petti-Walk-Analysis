import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Hospital, searchHospitals } from "@/data/hospitals";

interface Props {
  value: string;
  onChange: (val: string) => void;
  colors: any;
}

export function HospitalSearch({ value, onChange, colors }: Props) {
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState(value);

  const suggestions: Hospital[] = focused && query.trim().length >= 1
    ? searchHospitals(query)
    : [];

  const handleChange = (text: string) => {
    setQuery(text);
    onChange(text);
  };

  const select = (hospital: Hospital) => {
    setQuery(hospital.name);
    onChange(hospital.name);
    setFocused(false);
  };

  return (
    <View>
      <View
        style={[
          styles.inputRow,
          {
            backgroundColor: colors.surfaceContainerLow,
            borderColor: focused ? colors.primary : colors.border + "60",
          },
        ]}
      >
        <TextInput
          style={[styles.input, { color: colors.foreground }]}
          value={query}
          onChangeText={handleChange}
          placeholder="병원 이름 검색 (없으면 생략 가능)"
          placeholderTextColor={colors.outlineVariant}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          returnKeyType="done"
        />
        {query.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setQuery("");
              onChange("");
            }}
          >
            <Feather name="x" size={15} color={colors.mutedForeground} />
          </TouchableOpacity>
        )}
      </View>

      {suggestions.length > 0 && (
        <View
          style={[
            styles.dropdown,
            {
              backgroundColor: colors.card,
              borderColor: colors.border + "60",
            },
          ]}
        >
          {suggestions.map((h, idx) => (
            <TouchableOpacity
              key={h.id}
              style={[
                styles.option,
                idx < suggestions.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border + "30",
                },
              ]}
              onPress={() => select(h)}
              activeOpacity={0.7}
            >
              <View style={styles.optionIcon}>
                <Feather name="map-pin" size={12} color={colors.primary} />
              </View>
              <View style={styles.optionText}>
                <Text style={[styles.hospitalName, { color: colors.foreground }]}>
                  {h.name}
                </Text>
                <Text style={[styles.hospitalAddr, { color: colors.mutedForeground }]}>
                  {h.address}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          <View style={[styles.hint, { borderTopColor: colors.border + "30" }]}>
            <Text style={[styles.hintText, { color: colors.outlineVariant }]}>
              목록에 없으면 직접 입력하거나 생략 가능합니다
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 4,
    gap: 8,
  },
  input: { flex: 1, fontSize: 15, fontWeight: "500" },
  dropdown: {
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  optionIcon: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  optionText: { flex: 1 },
  hospitalName: { fontSize: 14, fontWeight: "600" },
  hospitalAddr: { fontSize: 11, marginTop: 1 },
  hint: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  hintText: { fontSize: 11 },
});

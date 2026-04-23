import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const QUICK_BREEDS = [
  "말티즈",
  "푸들",
  "포메라니안",
  "시츄",
  "골든 리트리버",
  "래브라도",
  "비글",
  "치와와",
  "진돗개",
  "보더콜리",
  "웰시코기",
  "닥스훈트",
  "말티푸",
  "믹스견",
];

const CUSTOM_KEY = "__custom__";

interface Props {
  value: string;
  onChange: (breed: string) => void;
  colors: any;
}

export function BreedPicker({ value, onChange, colors }: Props) {
  const isCustom = value !== "" && !QUICK_BREEDS.includes(value);
  const [customMode, setCustomMode] = useState(isCustom);
  const [customText, setCustomText] = useState(isCustom ? value : "");
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (customMode) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [customMode]);

  const selectChip = (breed: string) => {
    Haptics.selectionAsync();
    if (breed === CUSTOM_KEY) {
      setCustomMode(true);
      onChange(customText.trim() || "");
    } else {
      setCustomMode(false);
      setCustomText("");
      onChange(breed);
    }
  };

  const activeChip = customMode ? CUSTOM_KEY : value;

  return (
    <View style={styles.container}>
      <View style={styles.chipGrid}>
        {QUICK_BREEDS.map((breed) => {
          const selected = activeChip === breed;
          return (
            <TouchableOpacity
              key={breed}
              style={[
                styles.chip,
                {
                  backgroundColor: selected ? colors.primary : colors.card,
                  borderColor: selected ? colors.primary : colors.border + "80",
                },
              ]}
              onPress={() => selectChip(breed)}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: selected ? "#fff" : colors.foreground },
                ]}
              >
                {breed}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* 직접 입력 chip */}
        <TouchableOpacity
          style={[
            styles.chip,
            {
              backgroundColor: customMode ? colors.primary : colors.card,
              borderColor: customMode ? colors.primary : colors.border + "80",
            },
          ]}
          onPress={() => selectChip(CUSTOM_KEY)}
          activeOpacity={0.75}
        >
          <Feather
            name="edit-2"
            size={13}
            color={customMode ? "#fff" : colors.mutedForeground}
            style={{ marginRight: 4 }}
          />
          <Text
            style={[
              styles.chipText,
              { color: customMode ? "#fff" : colors.foreground },
            ]}
          >
            직접 입력
          </Text>
        </TouchableOpacity>
      </View>

      {/* 직접 입력 텍스트 필드 */}
      {customMode && (
        <View
          style={[
            styles.customInputWrap,
            {
              borderColor: colors.primary,
              backgroundColor: colors.surfaceContainerLow,
            },
          ]}
        >
          <Feather name="search" size={14} color={colors.mutedForeground} style={{ marginRight: 6 }} />
          <TextInput
            ref={inputRef}
            style={[styles.customInput, { color: colors.foreground }]}
            value={customText}
            onChangeText={(t) => {
              setCustomText(t);
              onChange(t.trim());
            }}
            placeholder="견종을 직접 입력하세요"
            placeholderTextColor={colors.outlineVariant}
            returnKeyType="done"
          />
          {customText !== "" && (
            <TouchableOpacity
              onPress={() => {
                setCustomText("");
                onChange("");
              }}
            >
              <Feather name="x" size={14} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 50,
    borderWidth: 1.5,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: -0.2,
  },
  customInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
  },
  customInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
  },
});

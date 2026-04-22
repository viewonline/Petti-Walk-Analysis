import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { DOG_BREEDS } from "@/data/breeds";

interface Props {
  value: string;
  onChange: (breed: string) => void;
  colors: any;
  placeholder?: string;
}

export function BreedPicker({ value, onChange, colors, placeholder = "견종을 선택하거나 검색하세요" }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? DOG_BREEDS.filter((b) => b.includes(search))
    : DOG_BREEDS;

  const select = (breed: string) => {
    onChange(breed);
    setOpen(false);
    setSearch("");
  };

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.trigger,
          {
            backgroundColor: colors.surfaceContainerLow,
            borderColor: open ? colors.primary : colors.border + "60",
          },
        ]}
        onPress={() => setOpen((o) => !o)}
        activeOpacity={0.8}
      >
        <Text style={[styles.triggerText, { color: value ? colors.foreground : colors.outlineVariant }]}>
          {value || placeholder}
        </Text>
        <Feather
          name={open ? "chevron-up" : "chevron-down"}
          size={16}
          color={colors.mutedForeground}
        />
      </TouchableOpacity>

      {open && (
        <View style={[styles.dropdown, { backgroundColor: colors.card, borderColor: colors.border + "60" }]}>
          <View style={[styles.searchRow, { borderBottomColor: colors.border + "40" }]}>
            <Feather name="search" size={14} color={colors.mutedForeground} />
            <TextInput
              style={[styles.searchInput, { color: colors.foreground }]}
              value={search}
              onChangeText={setSearch}
              placeholder="검색..."
              placeholderTextColor={colors.outlineVariant}
              autoFocus
            />
            {search !== "" && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Feather name="x" size={14} color={colors.mutedForeground} />
              </TouchableOpacity>
            )}
          </View>
          <FlatList
            data={filtered}
            keyExtractor={(item) => item}
            style={styles.list}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => {
              const selected = item === value;
              return (
                <TouchableOpacity
                  style={[
                    styles.option,
                    { borderBottomColor: colors.border + "30" },
                    selected && { backgroundColor: colors.primaryFixed },
                  ]}
                  onPress={() => select(item)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: selected ? colors.primary : colors.foreground },
                    ]}
                  >
                    {item}
                  </Text>
                  {selected && <Feather name="check" size={14} color={colors.primary} />}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 4,
  },
  triggerText: { fontSize: 15, fontWeight: "500", flex: 1 },
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
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 14, fontWeight: "500" },
  list: { maxHeight: 200 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
  },
  optionText: { fontSize: 14, fontWeight: "500" },
});

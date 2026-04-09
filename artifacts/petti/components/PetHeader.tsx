import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

interface PetHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  showSettings?: boolean;
  onSettings?: () => void;
  right?: React.ReactNode;
}

export function PetHeader({
  title = "Petti",
  showBack,
  onBack,
  showSettings,
  onSettings,
  right,
}: PetHeaderProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const topPad =
    Platform.OS === "web" ? Math.max(insets.top, 44) : insets.top;

  return (
    <View
      style={[
        styles.header,
        {
          paddingTop: topPad + 12,
          backgroundColor: colors.background,
        },
      ]}
    >
      <View style={styles.row}>
        {showBack ? (
          <TouchableOpacity
            style={[
              styles.iconBtn,
              { backgroundColor: colors.surfaceContainerLow },
            ]}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Feather name="chevron-left" size={22} color={colors.primary} />
          </TouchableOpacity>
        ) : (
          <View style={[styles.logo, { backgroundColor: colors.primaryFixed }]}>
            <Feather name="activity" size={18} color={colors.primary} />
          </View>
        )}

        <Text style={[styles.title, { color: colors.primary }]}>{title}</Text>

        {right ? (
          right
        ) : showSettings ? (
          <TouchableOpacity
            style={[
              styles.iconBtn,
              { backgroundColor: colors.surfaceContainerLow },
            ]}
            onPress={onSettings}
            activeOpacity={0.7}
          >
            <Feather name="settings" size={20} color={colors.primary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconBtn} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    zIndex: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.5,
    flex: 1,
    textAlign: "center",
  },
  logo: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
});

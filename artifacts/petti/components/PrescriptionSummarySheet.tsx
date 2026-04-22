import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { mockPrescription } from "@/data/mockData";

const PURCHASE_URL = "https://petti.vet/shop";

function formatPrice(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onViewDetail: () => void;
  colors: any;
}

export function PrescriptionSummarySheet({ visible, onClose, onViewDetail, colors }: Props) {
  if (!visible) return null;

  const rx = mockPrescription;
  const discountPct = Math.round((1 - rx.kitPrice / rx.kitOriginalPrice) * 100);

  const handlePurchase = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(PURCHASE_URL).catch(() => {});
  };

  const handleDetail = () => {
    Haptics.selectionAsync();
    onViewDetail();
  };

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 70 }]}>
      <Pressable style={[StyleSheet.absoluteFill, styles.backdrop]} onPress={onClose} />

      <View style={[styles.sheet, { backgroundColor: colors.background }]}>
        <View style={[styles.handle, { backgroundColor: colors.border }]} />

        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border + "40" }]}>
          <View style={[styles.headerIcon, { backgroundColor: colors.primaryFixed }]}>
            <Feather name="package" size={16} color={colors.primary} />
          </View>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>수의사 처방</Text>
          <TouchableOpacity onPress={onClose} hitSlop={10} style={styles.closeBtn}>
            <Feather name="x" size={22} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
        >
          {/* ① Doctor card */}
          <View style={[styles.doctorCard, { backgroundColor: colors.card, borderColor: colors.border + "40" }]}>
            <View style={[styles.doctorAvatar, { backgroundColor: colors.primaryFixed }]}>
              <Feather name="user" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.doctorName, { color: colors.foreground }]}>{rx.vetName}</Text>
              <Text style={[styles.doctorSub, { color: colors.mutedForeground }]}>
                {rx.vetTitle} · {rx.hospital}
              </Text>
            </View>
            <View style={[styles.verifiedBadge, { backgroundColor: colors.primaryFixed }]}>
              <Feather name="check-circle" size={13} color={colors.primary} />
              <Text style={[styles.verifiedText, { color: colors.primary }]}>인증</Text>
            </View>
          </View>

          {/* ② Clinical note — top, 2-line ellipsis */}
          <View style={[styles.noteCard, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.primary + "25" }]}>
            <View style={styles.noteHeaderRow}>
              <Feather name="file-text" size={13} color={colors.primary} />
              <Text style={[styles.noteLabel, { color: colors.primary }]}>임상 소견</Text>
              <Text style={[styles.noteDate, { color: colors.mutedForeground }]}>{rx.date}</Text>
            </View>
            <Text
              style={[styles.noteText, { color: colors.foreground }]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {rx.clinicalNote}
            </Text>
          </View>

          {/* ③ Kit hero */}
          <View style={[styles.kitHero, { backgroundColor: colors.primary }]}>
            <View style={styles.kitHeroLeft}>
              <View style={styles.kitIconWrap}>
                <Feather name="box" size={26} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.kitName}>{rx.kitName}</Text>
                <Text style={styles.kitDesc} numberOfLines={1}>{rx.kitDescription}</Text>
              </View>
            </View>
            <View style={styles.kitPriceCol}>
              <View style={styles.discountRow}>
                <Text style={styles.origPrice}>{formatPrice(rx.kitOriginalPrice)}</Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>{discountPct}%</Text>
                </View>
              </View>
              <Text style={styles.kitPrice}>{formatPrice(rx.kitPrice)}</Text>
            </View>
          </View>

          {/* ④ Kit items — name chips only */}
          <View style={[styles.itemsBox, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.border + "40" }]}>
            <Text style={[styles.itemsLabel, { color: colors.mutedForeground }]}>
              키트 구성 ({rx.items.length}개)
            </Text>
            <View style={styles.itemChips}>
              {rx.items.map((item) => (
                <View key={item.id} style={[styles.chip, { backgroundColor: colors.card, borderColor: colors.primary + "30" }]}>
                  <View style={[styles.chipDot, { backgroundColor: item.iconBg }]}>
                    <Feather name={item.icon as any} size={11} color={item.iconColor} />
                  </View>
                  <Text style={[styles.chipText, { color: colors.foreground }]}>{item.name}</Text>
                </View>
              ))}
              {rx.extraItems.length > 0 && (
                <View style={[styles.chip, { backgroundColor: colors.card, borderColor: colors.border + "40" }]}>
                  <Text style={[styles.chipText, { color: colors.mutedForeground }]}>
                    +{rx.extraItems.length}개 추가
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Action buttons — outside ScrollView, always visible */}
        <View style={[styles.actionBar, { borderTopColor: colors.border + "40", backgroundColor: colors.background }]}>
          <TouchableOpacity
            style={[styles.detailBtn, { borderColor: colors.primary + "60" }]}
            onPress={handleDetail}
            activeOpacity={0.75}
          >
            <Feather name="list" size={15} color={colors.primary} />
            <Text style={[styles.detailBtnText, { color: colors.primary }]}>상세 보기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.purchaseBtn, { backgroundColor: colors.primary }]}
            onPress={handlePurchase}
            activeOpacity={0.85}
          >
            <Feather name="shopping-bag" size={15} color="#fff" />
            <Text style={styles.purchaseBtnText}>구매하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: 120,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: "hidden",
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 10,
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: "800", letterSpacing: -0.4 },
  closeBtn: { padding: 2 },
  body: { padding: 18, gap: 14, paddingBottom: 16 },

  doctorCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
  },
  doctorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  doctorName: { fontSize: 15, fontWeight: "700", marginBottom: 2 },
  doctorSub: { fontSize: 12, fontWeight: "500" },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  verifiedText: { fontSize: 11, fontWeight: "700" },

  noteCard: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    gap: 8,
  },
  noteHeaderRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  noteLabel: { fontSize: 12, fontWeight: "800", flex: 1, letterSpacing: 0.3 },
  noteDate: { fontSize: 11, fontWeight: "500" },
  noteText: { fontSize: 13, lineHeight: 20, fontWeight: "500" },

  kitHero: {
    borderRadius: 20,
    padding: 18,
    gap: 12,
  },
  kitHeroLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  kitIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  kitName: { fontSize: 14, fontWeight: "800", color: "#fff", marginBottom: 3 },
  kitDesc: { fontSize: 11, color: "rgba(255,255,255,0.65)", lineHeight: 16 },
  kitPriceCol: { alignItems: "flex-end" },
  discountRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  origPrice: { fontSize: 11, color: "rgba(255,255,255,0.45)", textDecorationLine: "line-through" },
  discountBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  discountText: { fontSize: 10, fontWeight: "800", color: "#fff" },
  kitPrice: { fontSize: 24, fontWeight: "900", color: "#fff", letterSpacing: -0.8 },

  itemsBox: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    gap: 10,
  },
  itemsLabel: { fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.4 },
  itemChips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  chipDot: {
    width: 20,
    height: 20,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  chipText: { fontSize: 12, fontWeight: "700" },

  actionBar: {
    flexDirection: "row",
    gap: 12,
    padding: 18,
    paddingBottom: 28,
    borderTopWidth: 1,
  },
  detailBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 14,
  },
  detailBtnText: { fontSize: 15, fontWeight: "700" },
  purchaseBtn: {
    flex: 1.4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderRadius: 14,
    paddingVertical: 14,
  },
  purchaseBtnText: { fontSize: 15, fontWeight: "700", color: "#fff" },
});

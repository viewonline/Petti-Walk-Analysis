import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { mockPrescription, mockPet, PrescriptionItem } from "@/data/mockData";

const PURCHASE_URL = "https://petti.vet/shop";

function formatPrice(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

function ItemCard({ item }: { item: PrescriptionItem }) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.itemCard,
        { backgroundColor: colors.card },
      ]}
    >
      <View style={[styles.itemIcon, { backgroundColor: item.iconBg }]}>
        <Feather name={item.icon as any} size={20} color={item.iconColor} />
      </View>
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: colors.foreground }]}>
          {item.name}
        </Text>
        <Text style={[styles.itemDesc, { color: colors.mutedForeground }]}>
          {item.description}
        </Text>
      </View>
      <View style={[styles.includedBadge, { backgroundColor: colors.primaryFixed }]}>
        <Feather name="check" size={11} color={colors.primary} />
      </View>
    </View>
  );
}

function ExtraItemCard({ item }: { item: PrescriptionItem }) {
  const colors = useColors();
  return (
    <View style={[styles.extraCard, { backgroundColor: colors.card }]}>
      <View style={[styles.itemIcon, { backgroundColor: item.iconBg }]}>
        <Feather name={item.icon as any} size={20} color={item.iconColor} />
      </View>
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: colors.foreground }]}>
          {item.name}
        </Text>
        <Text style={[styles.itemDesc, { color: colors.mutedForeground }]}>
          {item.description}
        </Text>
      </View>
      <Text style={[styles.extraPrice, { color: colors.foreground }]}>
        {formatPrice(item.price)}
      </Text>
    </View>
  );
}

export default function PrescriptionScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const rx = mockPrescription;
  const pet = mockPet;
  const [purchasing, setPurchasing] = useState(false);

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 44) : insets.top;
  const discountPct = Math.round(
    (1 - rx.kitPrice / rx.kitOriginalPrice) * 100
  );

  const handlePurchase = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await Linking.openURL(PURCHASE_URL);
    } catch {
      Alert.alert("알림", "구매 페이지를 열 수 없습니다.");
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: topPad + 12,
            paddingBottom: insets.bottom + 120,
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
          <View style={[styles.notifDot, { backgroundColor: colors.surfaceContainerLow }]}>
            <Feather name="bell" size={16} color={colors.mutedForeground} />
            <View style={[styles.badge, { backgroundColor: colors.secondary }]} />
          </View>
        </View>

        {/* Prescription Banner */}
        <View style={[styles.banner, { backgroundColor: colors.primaryFixed }]}>
          <View style={styles.bannerLeft}>
            <View style={[styles.bannerTag, { backgroundColor: colors.primary }]}>
              <Text style={styles.bannerTagText}>수의사 처방</Text>
            </View>
            <Text style={[styles.bannerTitle, { color: colors.primary }]}>
              {pet.name}의 맞춤 재활 솔루션이{"\n"}도착했습니다
            </Text>
            <Text style={[styles.bannerSub, { color: colors.primary }]}>
              {rx.date} · {rx.vetName}
            </Text>
          </View>
          <View style={[styles.bannerIcon, { backgroundColor: colors.primary }]}>
            <Feather name="package" size={24} color="#fff" />
          </View>
        </View>

        {/* Vet Profile */}
        <View style={[styles.vetCard, { backgroundColor: colors.card }]}>
          <View style={[styles.vetAvatar, { backgroundColor: colors.primaryFixed }]}>
            <Feather name="user" size={20} color={colors.primary} />
          </View>
          <View style={styles.vetInfo}>
            <Text style={[styles.vetName, { color: colors.foreground }]}>
              {rx.vetName}
            </Text>
            <Text style={[styles.vetSub, { color: colors.mutedForeground }]}>
              {rx.vetTitle} · {rx.hospital}
            </Text>
          </View>
          <View style={[styles.verifiedBadge, { backgroundColor: colors.primaryFixed }]}>
            <Feather name="check-circle" size={14} color={colors.primary} />
            <Text style={[styles.verifiedText, { color: colors.primary }]}>인증</Text>
          </View>
        </View>

        {/* Main Kit Hero */}
        <View style={[styles.heroCard, { backgroundColor: colors.primary }]}>
          <View style={styles.heroTop}>
            <View style={styles.heroKitIcon}>
              <Feather name="box" size={32} color="#fff" />
            </View>
            <View style={styles.heroTexts}>
              <View style={styles.discountRow}>
                <Text style={styles.heroOrigPrice}>
                  {formatPrice(rx.kitOriginalPrice)}
                </Text>
                <View style={styles.discountTag}>
                  <Text style={styles.discountText}>{discountPct}% 할인</Text>
                </View>
              </View>
              <Text style={styles.heroPrice}>
                {formatPrice(rx.kitPrice)}
              </Text>
              <Text style={styles.heroKitName}>{rx.kitName}</Text>
            </View>
          </View>
          <Text style={styles.heroKitDesc}>{rx.kitDescription}</Text>
        </View>

        {/* Kit Components */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionAccent, { backgroundColor: colors.primary }]} />
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              키트 구성
            </Text>
            <View style={[styles.countBadge, { backgroundColor: colors.primaryFixed }]}>
              <Text style={[styles.countText, { color: colors.primary }]}>
                {rx.items.length}개
              </Text>
            </View>
          </View>
          <View style={styles.itemGrid}>
            {rx.items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </View>
        </View>

        {/* Extra Prescribed Items */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionAccent, { backgroundColor: colors.secondary }]} />
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              추가 처방 아이템
            </Text>
          </View>
          <View style={styles.extraList}>
            {rx.extraItems.map((item) => (
              <ExtraItemCard key={item.id} item={item} />
            ))}
          </View>
        </View>

        {/* Clinical Note */}
        <View style={[styles.noteCard, { backgroundColor: colors.surfaceContainerLow }]}>
          <View style={styles.noteHeader}>
            <Feather name="file-text" size={14} color={colors.primary} />
            <Text style={[styles.noteTitle, { color: colors.primary }]}>
              임상 소견
            </Text>
          </View>
          <Text style={[styles.noteText, { color: colors.mutedForeground }]}>
            {rx.clinicalNote}
          </Text>
        </View>

        {/* Clinical Proof */}
        <View style={[styles.proofCard, { backgroundColor: colors.primary }]}>
          <View style={styles.proofHeaderRow}>
            <Feather name="bar-chart-2" size={18} color="#9ff0f3" />
            <Text style={styles.proofTitle}>임상 결과 검증</Text>
          </View>
          <Text style={styles.proofSub}>
            실제 환견 100두 대상 8주 재활 프로그램 적용 결과
          </Text>
          <View style={styles.statsGrid}>
            {rx.stats.map((s, i) => (
              <View key={i} style={styles.statItem}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[styles.ctaButton, { backgroundColor: colors.primary }]}
          onPress={handlePurchase}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaText}>지금 구매하고 홈케어 시작</Text>
          <Feather name="arrow-right" size={18} color="#fff" />
        </TouchableOpacity>
      </ScrollView>
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
  notifDot: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  banner: {
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  bannerLeft: { flex: 1, gap: 6 },
  bannerTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  bannerTagText: { fontSize: 10, fontWeight: "800", color: "#fff", letterSpacing: 0.5 },
  bannerTitle: { fontSize: 16, fontWeight: "800", lineHeight: 22, letterSpacing: -0.3 },
  bannerSub: { fontSize: 12, fontWeight: "500", opacity: 0.7 },
  bannerIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  vetCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  vetAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  vetInfo: { flex: 1 },
  vetName: { fontSize: 14, fontWeight: "700" },
  vetSub: { fontSize: 12, marginTop: 1 },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verifiedText: { fontSize: 11, fontWeight: "700" },

  heroCard: {
    borderRadius: 24,
    padding: 22,
    gap: 14,
  },
  heroTop: { flexDirection: "row", gap: 16, alignItems: "flex-start" },
  heroKitIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTexts: { flex: 1, gap: 4 },
  discountRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  heroOrigPrice: { fontSize: 12, color: "rgba(255,255,255,0.5)", textDecorationLine: "line-through" },
  discountTag: { backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  discountText: { fontSize: 10, fontWeight: "800", color: "#fff" },
  heroPrice: { fontSize: 30, fontWeight: "900", color: "#fff", letterSpacing: -1 },
  heroKitName: { fontSize: 13, color: "rgba(255,255,255,0.75)", fontWeight: "600" },
  heroKitDesc: { fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 17 },

  section: { gap: 10 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionAccent: { width: 4, height: 18, borderRadius: 2 },
  sectionTitle: { fontSize: 16, fontWeight: "800", flex: 1, letterSpacing: -0.3 },
  countBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  countText: { fontSize: 11, fontWeight: "700" },

  itemGrid: { gap: 8 },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  itemInfo: { flex: 1, gap: 2 },
  itemName: { fontSize: 13, fontWeight: "700" },
  itemDesc: { fontSize: 11, lineHeight: 15 },
  includedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  extraList: { gap: 8 },
  extraCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  extraPrice: { fontSize: 14, fontWeight: "800" },

  noteCard: {
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  noteHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  noteTitle: { fontSize: 13, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },
  noteText: { fontSize: 13, lineHeight: 20 },

  proofCard: {
    borderRadius: 24,
    padding: 22,
    gap: 10,
  },
  proofHeaderRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  proofTitle: { fontSize: 17, fontWeight: "800", color: "#fff", letterSpacing: -0.3 },
  proofSub: { fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 17 },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginTop: 6,
  },
  statItem: { gap: 2 },
  statValue: { fontSize: 26, fontWeight: "900", color: "#fff", letterSpacing: -1 },
  statLabel: { fontSize: 10, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 0.5 },

  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
    borderRadius: 20,
    shadowColor: "#00676a",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaText: { fontSize: 16, fontWeight: "800", color: "#fff", letterSpacing: -0.3 },
});

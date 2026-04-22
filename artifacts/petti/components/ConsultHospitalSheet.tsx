import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CONSULT_HOSPITALS,
  ConsultHospital,
  SPECIALTY_FILTERS,
  Specialty,
} from "@/data/hospitals";
import { Analysis, mockPet } from "@/data/mockData";
import type { ColorTokens } from "@/constants/colors";

interface Props {
  visible: boolean;
  onClose: () => void;
  analysis: Analysis | null;
  colors: ColorTokens;
  onHospitalPress: (h: ConsultHospital, tab?: "info" | "reviews" | "consult") => void;
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text
          key={i}
          style={{
            fontSize: 13,
            color: i <= full ? "#f59e0b" : hasHalf && i === full + 1 ? "#f59e0b" : "#d1d5db",
            lineHeight: 16,
          }}
        >
          {i <= full ? "★" : hasHalf && i === full + 1 ? "★" : "☆"}
        </Text>
      ))}
    </View>
  );
}

const SPECIALTY_COLORS: Record<string, { bg: string; fg: string }> = {
  정형외과: { bg: "#e0f2f1", fg: "#00676a" },
  재활:    { bg: "#e8f5e9", fg: "#2e7d32" },
  피부과:   { bg: "#fce4ec", fg: "#c2185b" },
  건강검진:  { bg: "#e3f2fd", fg: "#1565c0" },
  중성화수술: { bg: "#f3e5f5", fg: "#6a1b9a" },
  내과:    { bg: "#fff3e0", fg: "#e65100" },
  치과:    { bg: "#e8eaf6", fg: "#283593" },
};

export function ConsultHospitalSheet({ visible, onClose, analysis, colors, onHospitalPress }: Props) {
  const [activeFilter, setActiveFilter] = useState<Specialty | "전체">("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const insets = useSafeAreaInsets();
  const tabBarH = Platform.OS === "web" ? 84 : 49;
  const scrollBottomPad = insets.bottom + tabBarH + 16;

  if (!visible) return null;

  const filtered = CONSULT_HOSPITALS.filter((h) => {
    const matchFilter = activeFilter === "전체" || h.specialties.includes(activeFilter);
    const matchSearch =
      !searchQuery.trim() ||
      h.name.includes(searchQuery) ||
      h.address.includes(searchQuery);
    return matchFilter && matchSearch;
  });

  const toggleBookmark = (id: string) => {
    Haptics.selectionAsync();
    setBookmarked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const statusColor =
    analysis?.status === "good"
      ? "#00676a"
      : analysis?.status === "attention"
      ? "#8e4e14"
      : "#ba1a1a";
  const statusLabel =
    analysis?.status === "good" ? "양호" : analysis?.status === "attention" ? "주의" : "위험";

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 60 }]}>
      <Pressable style={[StyleSheet.absoluteFill, styles.backdrop]} onPress={onClose} />

      <View style={[styles.sheet, { backgroundColor: colors.background }]}>
        <View style={[styles.handle, { backgroundColor: colors.border }]} />

        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border + "50" }]}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} hitSlop={8}>
            <Feather name="chevron-down" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>맞춤 상담 병원</Text>
          <View style={styles.headerRight}>
            <Feather name="map-pin" size={14} color={colors.primary} />
            <Text style={[styles.headerDistrict, { color: colors.primary }]}>서울 양천구</Text>
          </View>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: scrollBottomPad }}
        >
          {/* Analysis context banner */}
          {analysis && (
            <View style={[styles.contextBanner, { backgroundColor: colors.primaryFixed + "90", borderColor: colors.primary + "40" }]}>
              <View style={[styles.contextDot, { backgroundColor: colors.primary }]}>
                <Feather name="activity" size={14} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.contextTop, { color: colors.primary }]}>
                  {mockPet.name}의 최근 분석 기반 추천
                </Text>
                <Text style={[styles.contextSub, { color: colors.foreground }]}>
                  ROM {analysis.averageRom}°&nbsp;·&nbsp;BCS {analysis.bcs.toFixed(1)}&nbsp;·&nbsp;
                  <Text style={{ color: statusColor, fontWeight: "700" }}>{statusLabel}</Text>
                  {analysis.compensationPattern ? `\n${analysis.compensationPattern}` : ""}
                </Text>
              </View>
            </View>
          )}

          {/* Search */}
          <View style={[styles.searchRow, { backgroundColor: colors.card, borderColor: colors.border + "60" }]}>
            <Feather name="search" size={16} color={colors.mutedForeground} />
            <TextInput
              style={[styles.searchInput, { color: colors.foreground }]}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="병원 이름 또는 지역 검색"
              placeholderTextColor={colors.outlineVariant}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")} hitSlop={8}>
                <Feather name="x-circle" size={16} color={colors.mutedForeground} />
              </TouchableOpacity>
            )}
          </View>

          {/* Filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {SPECIALTY_FILTERS.map((f) => {
              const active = activeFilter === f.key;
              return (
                <TouchableOpacity
                  key={f.key}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: active ? colors.primary : colors.card,
                      borderColor: active ? colors.primary : colors.border + "80",
                    },
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setActiveFilter(f.key as any);
                  }}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.filterChipText, { color: active ? "#fff" : colors.foreground }]}>
                    {f.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Summary row */}
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryCount, { color: colors.mutedForeground }]}>
              <Text style={{ color: colors.primary, fontWeight: "800" }}>{filtered.length}</Text>개 병원
            </Text>
            <Text style={[styles.sortLabel, { color: colors.primary }]}>펫티랭킹 순 ▾</Text>
          </View>

          {/* Hospital cards */}
          <View style={styles.list}>
            {filtered.map((h) => {
              const isBookmarked = bookmarked.has(h.id);
              const matchColor =
                h.matchScore >= 90 ? "#00676a" : h.matchScore >= 75 ? "#8e4e14" : "#6b7280";

              return (
                <TouchableOpacity
                  key={h.id}
                  style={[
                    styles.card,
                    {
                      backgroundColor: colors.card,
                      borderColor: h.recommended ? colors.primary + "50" : colors.border + "40",
                      borderWidth: h.recommended ? 1.5 : 1,
                    },
                  ]}
                  onPress={() => { Haptics.selectionAsync(); onHospitalPress(h, "info"); }}
                  activeOpacity={0.92}
                >
                  {/* Recommended banner */}
                  {h.recommended && (
                    <View style={[styles.recBanner, { backgroundColor: colors.primaryFixed }]}>
                      <Feather name="award" size={12} color={colors.primary} />
                      <Text style={[styles.recText, { color: colors.primary }]}>Petti 추천 병원</Text>
                    </View>
                  )}

                  <View style={styles.cardBody}>
                    {/* Left avatar */}
                    <View style={[styles.avatar, { backgroundColor: colors.surfaceContainerLow }]}>
                      <Text style={styles.avatarEmoji}>🏥</Text>
                    </View>

                    {/* Center info */}
                    <View style={{ flex: 1 }}>
                      <View style={styles.nameRow}>
                        <Text style={[styles.hospitalName, { color: colors.foreground }]}>
                          {h.name}
                        </Text>
                        {h.revisitRate >= 100 && (
                          <View style={[styles.revisitBadge, { backgroundColor: "#e0f7fa" }]}>
                            <Text style={styles.revisitText}>재방문 {h.revisitRate}%</Text>
                          </View>
                        )}
                      </View>

                      <View style={styles.ratingRow}>
                        <StarRating rating={h.rating} />
                        <Text style={styles.ratingNum}>{h.rating.toFixed(1)}</Text>
                        {h.reviewCount > 0 && (
                          <Text style={[styles.reviewCount, { color: colors.mutedForeground }]}>
                            ({h.reviewCount}건)
                          </Text>
                        )}
                      </View>

                      {/* Specialty tags */}
                      <View style={styles.tagsRow}>
                        {h.specialties.slice(0, 3).map((s) => {
                          const c = SPECIALTY_COLORS[s] ?? { bg: colors.surfaceContainerLow, fg: colors.mutedForeground };
                          return (
                            <View key={s} style={[styles.tag, { backgroundColor: c.bg }]}>
                              <Text style={[styles.tagText, { color: c.fg }]}>{s}</Text>
                            </View>
                          );
                        })}
                      </View>
                    </View>

                    {/* Match + bookmark */}
                    <View style={{ alignItems: "flex-end", gap: 8 }}>
                      <TouchableOpacity
                        onPress={() => toggleBookmark(h.id)}
                        hitSlop={8}
                        style={styles.bookmarkBtn}
                      >
                        <Text style={{ fontSize: 20, color: isBookmarked ? "#ef4444" : colors.border }}>
                          {isBookmarked ? "♥" : "♡"}
                        </Text>
                      </TouchableOpacity>
                      <View style={[styles.matchBadge, { backgroundColor: matchColor + "18", borderColor: matchColor + "40" }]}>
                        <Text style={[styles.matchText, { color: matchColor }]}>{h.matchScore}%</Text>
                      </View>
                    </View>
                  </View>

                  {/* Meta strip */}
                  <View style={[styles.metaStrip, { borderTopColor: colors.border + "30", backgroundColor: colors.surfaceContainerLow + "80" }]}>
                    <View style={styles.metaItem}>
                      <Feather name="clock" size={12} color={h.isOpen ? colors.primary : "#ef4444"} />
                      <Text style={[styles.metaText, { color: h.isOpen ? colors.primary : "#ef4444", fontWeight: "700" }]}>
                        {h.isOpen ? "진료중" : "진료종료"}
                      </Text>
                      <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                        {h.hours}
                      </Text>
                    </View>
                    <Text style={[styles.metaDot, { color: colors.border }]}>·</Text>
                    <View style={styles.metaItem}>
                      <Feather name="map-pin" size={12} color={colors.mutedForeground} />
                      <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{h.distance}</Text>
                    </View>
                    <Text style={[styles.metaDot, { color: colors.border }]}>·</Text>
                    <View style={styles.metaItem}>
                      <Feather name="credit-card" size={12} color={colors.mutedForeground} />
                      <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                        최대 {(h.maxFee / 1000).toFixed(0)}천원
                      </Text>
                    </View>
                  </View>

                  {/* Action buttons */}
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={[styles.reportBtn, { borderColor: colors.primary + "70" }]}
                      activeOpacity={0.75}
                      onPress={() => { Haptics.selectionAsync(); onHospitalPress(h, "consult"); }}
                    >
                      <Feather name="file-text" size={14} color={colors.primary} />
                      <Text style={[styles.reportBtnText, { color: colors.primary }]}>리포트 전송</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.bookBtn, { backgroundColor: colors.primary }]}
                      activeOpacity={0.85}
                      onPress={() => { Haptics.selectionAsync(); onHospitalPress(h, "consult"); }}
                    >
                      <Feather name="calendar" size={14} color="#fff" />
                      <Text style={styles.bookBtnText}>예약하기</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.50)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: 64,
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
    marginBottom: 6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 10,
  },
  closeBtn: { padding: 2 },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: "800", letterSpacing: -0.4 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 4 },
  headerDistrict: { fontSize: 13, fontWeight: "700" },
  contextBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 6,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  contextDot: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  contextTop: { fontSize: 12, fontWeight: "700", marginBottom: 3 },
  contextSub: { fontSize: 13, fontWeight: "500", lineHeight: 18 },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 2,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  searchInput: { flex: 1, fontSize: 15, fontWeight: "500" },
  filterRow: { paddingHorizontal: 16, paddingVertical: 14, gap: 8, flexDirection: "row" },
  filterChip: { borderRadius: 999, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 7 },
  filterChipText: { fontSize: 13, fontWeight: "600" },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    marginBottom: 12,
  },
  summaryCount: { fontSize: 13, fontWeight: "500" },
  sortLabel: { fontSize: 13, fontWeight: "700" },
  list: { paddingHorizontal: 16, gap: 14 },
  card: { borderRadius: 20, overflow: "hidden" },
  recBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  recText: { fontSize: 12, fontWeight: "700" },
  cardBody: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 14,
    paddingBottom: 10,
  },
  avatar: { width: 50, height: 50, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  avatarEmoji: { fontSize: 26 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 3 },
  hospitalName: { fontSize: 15, fontWeight: "800", letterSpacing: -0.3, flexShrink: 1 },
  revisitBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  revisitText: { fontSize: 10, fontWeight: "700", color: "#006064" },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 6 },
  ratingNum: { fontSize: 13, fontWeight: "700", color: "#f59e0b" },
  reviewCount: { fontSize: 12 },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 5 },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 7 },
  tagText: { fontSize: 11, fontWeight: "700" },
  bookmarkBtn: { padding: 2 },
  matchBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8, borderWidth: 1 },
  matchText: { fontSize: 11, fontWeight: "800" },
  metaStrip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderTopWidth: 1,
    gap: 6,
  },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 11 },
  metaDot: { fontSize: 12 },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 14,
    paddingBottom: 14,
    paddingTop: 8,
  },
  reportBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 12,
  },
  reportBtnText: { fontSize: 14, fontWeight: "700" },
  bookBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderRadius: 12,
    paddingVertical: 12,
  },
  bookBtnText: { fontSize: 14, fontWeight: "700", color: "#fff" },
});

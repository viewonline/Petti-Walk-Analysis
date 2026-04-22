import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  CONSULT_HOSPITALS,
  ConsultHospital,
  Specialty,
  SPECIALTY_FILTERS,
} from "@/data/hospitals";
import { Analysis, mockPet } from "@/data/mockData";

const KAKAO_YELLOW = "#FAE100";

interface Props {
  visible: boolean;
  onClose: () => void;
  analysis: Analysis | null;
  colors: any;
}

function StarRow({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Feather
          key={i}
          name="star"
          size={10}
          color={i <= Math.round(rating) ? "#f59e0b" : "#d1d5db"}
        />
      ))}
    </View>
  );
}

export function ConsultHospitalSheet({ visible, onClose, analysis, colors }: Props) {
  const [activeFilter, setActiveFilter] = useState<Specialty | "전체">("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

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
        {/* Top handle */}
        <View style={[styles.handle, { backgroundColor: colors.border }]} />

        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border + "40" }]}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Feather name="chevron-down" size={22} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>맞춤 상담 병원</Text>
          <View style={styles.headerRight}>
            <Text style={[styles.headerDistrict, { color: colors.primary }]}>
              서울 양천구
            </Text>
            <Feather name="map-pin" size={13} color={colors.primary} />
          </View>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Analysis context card */}
          {analysis && (
            <View style={[styles.contextCard, { backgroundColor: colors.primaryFixed + "80", borderColor: colors.primary + "30" }]}>
              <View style={[styles.contextIcon, { backgroundColor: colors.primary }]}>
                <Feather name="activity" size={13} color="#fff" />
              </View>
              <View style={styles.contextText}>
                <Text style={[styles.contextTitle, { color: colors.primary }]}>
                  {mockPet.name}의 최근 분석 기반 추천
                </Text>
                <Text style={[styles.contextSub, { color: colors.foreground }]}>
                  평균 ROM {analysis.averageRom}° · BCS {analysis.bcs.toFixed(1)} ·{" "}
                  <Text style={{ color: statusColor, fontWeight: "700" }}>{statusLabel}</Text>
                  {analysis.compensationPattern ? ` · ${analysis.compensationPattern}` : ""}
                </Text>
              </View>
            </View>
          )}

          {/* Search bar */}
          <View style={[styles.searchWrap, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.border + "50" }]}>
            <Feather name="search" size={15} color={colors.mutedForeground} />
            <TextInput
              style={[styles.searchInput, { color: colors.foreground }]}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="병원 이름 또는 지역 검색"
              placeholderTextColor={colors.outlineVariant}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Feather name="x" size={14} color={colors.mutedForeground} />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter chips */}
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
                      backgroundColor: active ? colors.primary : colors.surfaceContainerLow,
                      borderColor: active ? colors.primary : colors.border + "60",
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

          {/* Count */}
          <View style={styles.countRow}>
            <Text style={[styles.countText, { color: colors.mutedForeground }]}>
              {filtered.length}개 병원
            </Text>
            <Text style={[styles.sortText, { color: colors.primary }]}>
              펫티랭킹 순 ▾
            </Text>
          </View>

          {/* Hospital list */}
          <View style={styles.list}>
            {filtered.map((h) => {
              const isBookmarked = bookmarked.has(h.id);
              const isInquired = inquired.has(h.id);

              return (
                <View
                  key={h.id}
                  style={[
                    styles.card,
                    {
                      backgroundColor: colors.card,
                      borderColor: h.recommended ? colors.primary + "40" : colors.border + "30",
                    },
                  ]}
                >
                  {h.recommended && (
                    <View style={[styles.recommendBadge, { backgroundColor: colors.primaryFixed }]}>
                      <Feather name="award" size={10} color={colors.primary} />
                      <Text style={[styles.recommendText, { color: colors.primary }]}>Petti 추천</Text>
                    </View>
                  )}

                  <View style={styles.cardTop}>
                    <View style={[styles.hospitalAvatar, { backgroundColor: colors.surfaceContainerLow }]}>
                      <Feather name="plus-square" size={20} color={colors.primary} />
                    </View>
                    <View style={styles.cardInfo}>
                      <View style={styles.cardNameRow}>
                        <Text style={[styles.cardName, { color: colors.foreground }]}>
                          {h.name}
                        </Text>
                        {h.revisitRate >= 100 && (
                          <View style={[styles.revisitBadge, { backgroundColor: "#e0f2f1" }]}>
                            <Text style={styles.revisitText}>재방문 의사 {h.revisitRate}%</Text>
                          </View>
                        )}
                      </View>

                      <View style={styles.ratingRow}>
                        <StarRow rating={h.rating} />
                        <Text style={[styles.ratingNum, { color: "#f59e0b" }]}>
                          {h.rating.toFixed(1)}
                        </Text>
                        {h.reviewCount > 0 && (
                          <Text style={[styles.reviewCount, { color: colors.mutedForeground }]}>
                            ({h.reviewCount})
                          </Text>
                        )}
                      </View>

                      <View style={styles.specialtyRow}>
                        {h.specialties.slice(0, 3).map((s) => (
                          <View
                            key={s}
                            style={[styles.specialtyTag, { backgroundColor: colors.surfaceContainerLow }]}
                          >
                            <Text style={[styles.specialtyText, { color: colors.mutedForeground }]}>
                              {s}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>

                    <TouchableOpacity
                      style={styles.bookmarkBtn}
                      onPress={() => toggleBookmark(h.id)}
                      activeOpacity={0.7}
                    >
                      <Feather
                        name={isBookmarked ? "heart" : "heart"}
                        size={18}
                        color={isBookmarked ? "#ef4444" : colors.border}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Hours & distance */}
                  <View style={[styles.metaRow, { borderTopColor: colors.border + "30" }]}>
                    <View style={styles.metaItem}>
                      <Feather name="clock" size={11} color={colors.mutedForeground} />
                      <Text
                        style={[
                          styles.metaText,
                          { color: h.isOpen ? colors.primary : colors.destructive },
                        ]}
                      >
                        {h.isOpen ? "진료중" : "진료종료"}
                      </Text>
                      <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                        {h.hours}
                      </Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Feather name="map-pin" size={11} color={colors.mutedForeground} />
                      <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                        {h.distance}
                      </Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Feather name="calendar" size={11} color={colors.mutedForeground} />
                      <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                        최대 {h.maxFee.toLocaleString()}원
                      </Text>
                    </View>
                  </View>

                  {/* Action row */}
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={[styles.reportBtn, { borderColor: colors.primary + "60", backgroundColor: colors.surfaceContainerLow }]}
                      activeOpacity={0.75}
                    >
                      <Feather name="file-text" size={13} color={colors.primary} />
                      <Text style={[styles.reportBtnText, { color: colors.primary }]}>
                        리포트 전송
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.bookBtn, { backgroundColor: colors.primary }]}
                      activeOpacity={0.85}
                    >
                      <Feather name="calendar" size={13} color="#fff" />
                      <Text style={styles.bookBtnText}>예약하기</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
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
    top: "8%",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 30,
    overflow: "hidden",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  closeBtn: { padding: 4, marginRight: 4 },
  headerTitle: { flex: 1, fontSize: 17, fontWeight: "800", letterSpacing: -0.3 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 4 },
  headerDistrict: { fontSize: 13, fontWeight: "600" },
  contextCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 4,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
  },
  contextIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  contextText: { flex: 1 },
  contextTitle: { fontSize: 11, fontWeight: "700", marginBottom: 2 },
  contextSub: { fontSize: 12, fontWeight: "500" },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  searchInput: { flex: 1, fontSize: 14, fontWeight: "500" },
  filterRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    flexDirection: "row",
  },
  filterChip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  filterChipText: { fontSize: 12, fontWeight: "600" },
  countRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  countText: { fontSize: 12, fontWeight: "500" },
  sortText: { fontSize: 12, fontWeight: "600" },
  list: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  recommendBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,103,106,0.15)",
  },
  recommendText: {
    fontSize: 11,
    fontWeight: "700",
  },
  cardTop: {
    flexDirection: "row",
    padding: 14,
    gap: 12,
    alignItems: "flex-start",
  },
  hospitalAvatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: { flex: 1 },
  cardNameRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 4,
  },
  cardName: { fontSize: 15, fontWeight: "800" },
  revisitBadge: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  revisitText: { fontSize: 9, fontWeight: "700", color: "#00676a" },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 6,
  },
  ratingNum: { fontSize: 12, fontWeight: "800" },
  reviewCount: { fontSize: 11 },
  specialtyRow: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  specialtyTag: {
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  specialtyText: { fontSize: 10, fontWeight: "600" },
  bookmarkBtn: { padding: 4 },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 11, fontWeight: "500" },
  actionRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 14,
    paddingBottom: 14,
    paddingTop: 4,
  },
  reportBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  reportBtnText: { fontSize: 13, fontWeight: "700" },
  bookBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  bookBtnText: { fontSize: 13, fontWeight: "700", color: "#fff" },
});

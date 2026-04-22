import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import { useColors } from "@/hooks/useColors";

interface Post {
  id: string;
  author: string;
  petName: string;
  petBreed: string;
  condition: string;
  hospital?: string;
  category: "자유" | "병원Q&A" | "재활이야기";
  title: string;
  body: string;
  likes: number;
  comments: number;
  time: string;
  pinned?: boolean;
}

const MOCK_POSTS: Post[] = [
  {
    id: "p1",
    author: "체리맘",
    petName: "체리",
    petBreed: "말티즈",
    condition: "슬개골 탈구 2기",
    hospital: "다터펫동물병원",
    category: "병원Q&A",
    title: "다터펫동물병원 수술 후 재활 비용 얼마나 드셨나요?",
    body: "내일 슬개골 수술 예정인데 수술 후 재활까지 총 비용이 궁금해서요. Petti 앱으로 리포트 보냈더니 진료가 빨리 진행됐어요!",
    likes: 14,
    comments: 7,
    time: "2시간 전",
    pinned: true,
  },
  {
    id: "p2",
    author: "두부아빠",
    petName: "두부",
    petBreed: "비글",
    condition: "전방십자인대 수술 후",
    hospital: "24시 로운동물의료센터",
    category: "재활이야기",
    title: "수술 6주차 — 드디어 뛰기 시작했어요 🐾",
    body: "전방십자인대 수술하고 6주 됐는데 오늘 처음으로 조금 뛰었어요. Petti로 보행 측정했더니 ROM이 12도 올라갔다고 나오네요. 다들 화이팅하세요!",
    likes: 38,
    comments: 12,
    time: "4시간 전",
  },
  {
    id: "p3",
    author: "몽이엄마",
    petName: "몽이",
    petBreed: "보더콜리",
    condition: "고관절 이형성증",
    category: "자유",
    title: "고관절 이형성증 진단받고 너무 힘드네요",
    body: "갑자기 진단받고 멘탈이 무너졌어요. 비슷한 경험 있으신 분들 어떻게 극복하셨나요?",
    likes: 52,
    comments: 23,
    time: "어제",
  },
  {
    id: "p4",
    author: "루시맘",
    petName: "루시",
    petBreed: "푸들",
    condition: "디스크 내과 치료",
    hospital: "정말로동물병원",
    category: "병원Q&A",
    title: "정말로동물병원 재활 담당 선생님 어떠세요?",
    body: "재활 전문 선생님이 따로 계신다고 들었는데 실제로 치료받아보신 분 후기 부탁드려요.",
    likes: 9,
    comments: 4,
    time: "어제",
  },
  {
    id: "p5",
    author: "봄이아빠",
    petName: "봄이",
    petBreed: "시바이누",
    condition: "슬개골 탈구 1기 보존치료",
    category: "재활이야기",
    title: "집에서 할 수 있는 슬개골 재활 운동 공유해요",
    body: "수의사 선생님께 허락받고 집에서 하는 재활 운동들 정리했어요. 수영 대신 할 수 있는 방법도 있어요!",
    likes: 67,
    comments: 31,
    time: "2일 전",
  },
  {
    id: "p6",
    author: "초코맘",
    petName: "초코",
    petBreed: "말티즈",
    condition: "슬개골 수술 후 재활",
    hospital: "다터펫동물병원",
    category: "재활이야기",
    title: "Petti 리포트 미리 보내고 진료받으니 훨씬 편해요",
    body: "병원 오기 전에 Petti 리포트 전송했더니 원장님이 이미 데이터 보시고 바로 상담해주셨어요. 다들 꼭 써보세요!",
    likes: 28,
    comments: 9,
    time: "3일 전",
  },
];

const CATEGORIES = ["전체", "자유", "병원Q&A", "재활이야기"] as const;
type CategoryFilter = typeof CATEGORIES[number];

const CATEGORY_COLORS: Record<string, { bg: string; fg: string }> = {
  자유: { bg: "#e3f2fd", fg: "#1565c0" },
  "병원Q&A": { bg: "#e8f5e9", fg: "#2e7d32" },
  재활이야기: { bg: "#fff3e0", fg: "#e65100" },
};

export default function CommunityScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ hospital?: string }>();
  const router = useRouter();

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>(
    params.hospital ? "병원Q&A" : "전체"
  );
  const [hospitalFilter] = useState<string | null>(params.hospital ?? null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showWrite, setShowWrite] = useState(false);
  const [writeText, setWriteText] = useState(
    params.hospital ? `[${params.hospital}] ` : ""
  );
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const tabBarH = Platform.OS === "web" ? 84 : 49;
  const bottomPad = insets.bottom + tabBarH;

  const filtered = MOCK_POSTS.filter((p) => {
    if (activeCategory !== "전체" && p.category !== activeCategory) return false;
    if (hospitalFilter && activeCategory === "병원Q&A" && p.hospital !== hospitalFilter) return false;
    if (searchQuery.trim() && !p.title.includes(searchQuery) && !p.body.includes(searchQuery)) return false;
    return true;
  });

  const toggleLike = (id: string) => {
    Haptics.selectionAsync();
    setLikedPosts((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 12, borderBottomColor: colors.border + "40" }]}>
        <View style={s.headerTop}>
          <View style={[s.logoWrap, { backgroundColor: colors.primaryFixed }]}>
            <Feather name="message-circle" size={16} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[s.headerTitle, { color: colors.foreground }]}>커뮤니티</Text>
            {hospitalFilter && (
              <View style={[s.hospitalBadge, { backgroundColor: colors.primaryFixed }]}>
                <Feather name="map-pin" size={10} color={colors.primary} />
                <Text style={[s.hospitalBadgeText, { color: colors.primary }]}>{hospitalFilter}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={[s.writeBtn, { backgroundColor: colors.primary }]}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setShowWrite(true); }}
            activeOpacity={0.85}
          >
            <Feather name="edit-3" size={14} color="#fff" />
            <Text style={s.writeBtnText}>글쓰기</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={[s.searchBar, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.border + "50" }]}>
          <Feather name="search" size={15} color={colors.mutedForeground} />
          <TextInput
            style={[s.searchInput, { color: colors.foreground }]}
            placeholder="게시글 검색"
            placeholderTextColor={colors.outlineVariant}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Category tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.catRow}>
          {CATEGORIES.map((c) => {
            const active = activeCategory === c;
            return (
              <TouchableOpacity
                key={c}
                style={[s.catChip, { backgroundColor: active ? colors.primary : colors.surfaceContainerLow, borderColor: active ? colors.primary : colors.border + "60" }]}
                onPress={() => { Haptics.selectionAsync(); setActiveCategory(c); }}
                activeOpacity={0.8}
              >
                <Text style={[s.catChipText, { color: active ? "#fff" : colors.mutedForeground }]}>{c}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Post list */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.list, { paddingBottom: bottomPad + 24 }]}
      >
        {hospitalFilter && activeCategory === "병원Q&A" && (
          <View style={[s.filterBanner, { backgroundColor: colors.primaryFixed + "80", borderColor: colors.primary + "30" }]}>
            <Feather name="info" size={13} color={colors.primary} />
            <Text style={[s.filterBannerText, { color: colors.primary }]}>
              {hospitalFilter} 관련 질문만 표시 중
            </Text>
          </View>
        )}

        {filtered.length === 0 && (
          <View style={s.empty}>
            <Text style={{ fontSize: 36 }}>💬</Text>
            <Text style={[s.emptyText, { color: colors.mutedForeground }]}>아직 게시글이 없어요</Text>
            <Text style={[s.emptySubText, { color: colors.mutedForeground }]}>첫 번째로 이야기를 시작해 보세요</Text>
          </View>
        )}

        {filtered.map((p) => {
          const catColor = CATEGORY_COLORS[p.category] ?? { bg: "#f3f4f6", fg: "#374151" };
          const isLiked = likedPosts.has(p.id);
          return (
            <TouchableOpacity
              key={p.id}
              style={[s.card, { backgroundColor: colors.card, borderColor: p.pinned ? colors.primary + "40" : colors.border + "40", borderWidth: p.pinned ? 1.5 : 1 }]}
              onPress={() => Haptics.selectionAsync()}
              activeOpacity={0.92}
            >
              {p.pinned && (
                <View style={[s.pinnedBadge, { backgroundColor: colors.primaryFixed }]}>
                  <Feather name="bookmark" size={10} color={colors.primary} />
                  <Text style={[s.pinnedText, { color: colors.primary }]}>인기글</Text>
                </View>
              )}

              <View style={s.cardHeader}>
                <View style={[s.avatar, { backgroundColor: colors.primaryFixed }]}>
                  <Text style={{ fontSize: 14 }}>🐾</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Text style={[s.author, { color: colors.foreground }]}>{p.author}</Text>
                    <Text style={[s.petInfo, { color: colors.mutedForeground }]}>{p.petName} · {p.petBreed}</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 2 }}>
                    <View style={[s.catTag, { backgroundColor: catColor.bg }]}>
                      <Text style={[s.catTagText, { color: catColor.fg }]}>{p.category}</Text>
                    </View>
                    {p.hospital && (
                      <View style={[s.hospitalTag, { backgroundColor: colors.primaryFixed + "80" }]}>
                        <Feather name="map-pin" size={9} color={colors.primary} />
                        <Text style={[s.hospitalTagText, { color: colors.primary }]}>{p.hospital}</Text>
                      </View>
                    )}
                  </View>
                </View>
                <Text style={[s.time, { color: colors.mutedForeground }]}>{p.time}</Text>
              </View>

              <Text style={[s.postTitle, { color: colors.foreground }]} numberOfLines={2}>{p.title}</Text>
              <Text style={[s.postBody, { color: colors.mutedForeground }]} numberOfLines={2}>{p.body}</Text>

              <View style={[s.cardFooter, { borderTopColor: colors.border + "30" }]}>
                <View style={[s.conditionPill, { backgroundColor: colors.surfaceContainerLow }]}>
                  <Text style={[s.conditionText, { color: colors.mutedForeground }]}>{p.condition}</Text>
                </View>
                <View style={s.footerActions}>
                  <TouchableOpacity style={s.actionBtn} onPress={() => toggleLike(p.id)} activeOpacity={0.7}>
                    <Feather name="heart" size={13} color={isLiked ? "#ef4444" : colors.mutedForeground} />
                    <Text style={[s.actionCount, { color: isLiked ? "#ef4444" : colors.mutedForeground }]}>
                      {p.likes + (isLiked ? 1 : 0)}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.actionBtn} onPress={() => Haptics.selectionAsync()} activeOpacity={0.7}>
                    <Feather name="message-square" size={13} color={colors.mutedForeground} />
                    <Text style={[s.actionCount, { color: colors.mutedForeground }]}>{p.comments}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.actionBtn} onPress={() => Haptics.selectionAsync()} activeOpacity={0.7}>
                    <Feather name="share-2" size={13} color={colors.mutedForeground} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Write overlay */}
      {showWrite && (
        <View style={[StyleSheet.absoluteFill, { zIndex: 80 }]}>
          <Pressable style={s.writeBackdrop} onPress={() => setShowWrite(false)} />
          <View style={[s.writeSheet, { backgroundColor: colors.background }]}>
            <View style={[s.writeHandle, { backgroundColor: colors.border }]} />
            <View style={[s.writeHeader, { borderBottomColor: colors.border + "40" }]}>
              <Text style={[s.writeTitle, { color: colors.foreground }]}>새 글 작성</Text>
              <TouchableOpacity onPress={() => setShowWrite(false)} hitSlop={10}>
                <Feather name="x" size={20} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={[s.writeInput, { color: colors.foreground, borderColor: colors.border + "50" }]}
              placeholder={hospitalFilter ? `[${hospitalFilter}] 에 대한 질문을 작성하세요` : "반려견 보행 회복 경험을 나눠보세요"}
              placeholderTextColor={colors.outlineVariant}
              value={writeText}
              onChangeText={setWriteText}
              multiline
              autoFocus
            />
            <View style={[s.writeFooter, { borderTopColor: colors.border + "40", paddingBottom: insets.bottom + tabBarH }]}>
              <TouchableOpacity
                style={[s.writeSubmit, { backgroundColor: writeText.trim().length > 0 ? colors.primary : colors.surfaceContainerLow }]}
                disabled={writeText.trim().length === 0}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setShowWrite(false); setWriteText(""); }}
                activeOpacity={0.85}
              >
                <Text style={[s.writeSubmitText, { color: writeText.trim().length > 0 ? "#fff" : colors.mutedForeground }]}>게시하기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  header: { borderBottomWidth: 1, paddingHorizontal: 16, paddingBottom: 12, gap: 10 },
  headerTop: { flexDirection: "row", alignItems: "center", gap: 10 },
  logoWrap: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 20, fontWeight: "900", letterSpacing: -0.5 },
  hospitalBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, alignSelf: "flex-start", marginTop: 3 },
  hospitalBadgeText: { fontSize: 11, fontWeight: "700" },
  writeBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  writeBtnText: { fontSize: 13, fontWeight: "700", color: "#fff" },
  searchBar: { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 12, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10 },
  searchInput: { flex: 1, fontSize: 14 },
  catRow: { gap: 8, flexDirection: "row" },
  catChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, borderWidth: 1 },
  catChipText: { fontSize: 13, fontWeight: "600" },

  list: { padding: 16, gap: 12 },
  filterBanner: { flexDirection: "row", alignItems: "center", gap: 8, padding: 12, borderRadius: 12, borderWidth: 1 },
  filterBannerText: { fontSize: 13, fontWeight: "600" },

  empty: { alignItems: "center", paddingVertical: 60, gap: 10 },
  emptyText: { fontSize: 16, fontWeight: "700" },
  emptySubText: { fontSize: 13 },

  card: { borderRadius: 18, overflow: "hidden" },
  pinnedBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 12, paddingVertical: 6 },
  pinnedText: { fontSize: 11, fontWeight: "700" },
  cardHeader: { flexDirection: "row", alignItems: "flex-start", gap: 10, padding: 14, paddingBottom: 8 },
  avatar: { width: 36, height: 36, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  author: { fontSize: 13, fontWeight: "800" },
  petInfo: { fontSize: 12 },
  catTag: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  catTagText: { fontSize: 10, fontWeight: "700" },
  hospitalTag: { flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6 },
  hospitalTagText: { fontSize: 10, fontWeight: "700" },
  time: { fontSize: 11 },
  postTitle: { fontSize: 14, fontWeight: "800", lineHeight: 20, paddingHorizontal: 14, marginBottom: 4 },
  postBody: { fontSize: 13, lineHeight: 18, paddingHorizontal: 14, marginBottom: 10 },
  cardFooter: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, gap: 8 },
  conditionPill: { flex: 1, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: "flex-start" },
  conditionText: { fontSize: 10, fontWeight: "600" },
  footerActions: { flexDirection: "row", gap: 12 },
  actionBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  actionCount: { fontSize: 12, fontWeight: "600" },

  writeBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.4)" },
  writeSheet: { position: "absolute", bottom: 0, left: 0, right: 0, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: "hidden" },
  writeHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: "center", marginTop: 10, marginBottom: 4 },
  writeHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: 1 },
  writeTitle: { fontSize: 16, fontWeight: "800" },
  writeInput: { minHeight: 120, padding: 16, fontSize: 15, lineHeight: 22, borderWidth: 1, margin: 16, borderRadius: 14, textAlignVertical: "top" },
  writeFooter: { paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1 },
  writeSubmit: { alignItems: "center", paddingVertical: 14, borderRadius: 14 },
  writeSubmitText: { fontSize: 15, fontWeight: "800" },
});

import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Analysis, mockPet } from "@/data/mockData";

const KAKAO_YELLOW = "#FAE100";
const KAKAO_DARK = "#191919";
const KAKAO_CHANNEL_URL = "https://pf.kakao.com/petti";
const MOCK_VIDEO_URL = "https://petti.vet/skeleton/demo";
const MOCK_REPORT_URL = "https://petti.vet/report/demo";

interface ShareItemDef {
  key: string;
  icon: React.ComponentProps<typeof Feather>["name"];
  color: string;
  bg: string;
  title: string;
  desc: string;
  badge: string;
  /** If defined, tapping opens this action instead of toggling check */
  actionOnly?: boolean;
  onAction?: () => void;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onOpenConsult: () => void;
  analysis: Analysis | null;
  colors: any;
}

export function KakaoShareSheet({ visible, onClose, onOpenConsult, analysis, colors }: Props) {
  const [checked, setChecked] = useState<Set<string>>(new Set(["video", "report"]));

  if (!visible || !analysis) return null;

  const statusLabel =
    analysis.status === "good" ? "양호" : analysis.status === "attention" ? "주의" : "위험";
  const statusColor =
    analysis.status === "good" ? "#00676a" : analysis.status === "attention" ? "#8e4e14" : "#ba1a1a";

  const ITEMS: ShareItemDef[] = [
    {
      key: "video",
      icon: "film",
      color: "#5e35b1",
      bg: "#ede7f6",
      title: "관절 스켈레톤 영상",
      desc: "AI 분석으로 생성된 관절 움직임 시각화 영상",
      badge: "영상",
    },
    {
      key: "report",
      icon: "file-text",
      color: "#00676a",
      bg: "#e0f2f1",
      title: "보행 분석 리포트",
      desc: `ROM ${analysis.averageRom}° · BCS ${analysis.bcs.toFixed(1)} · ${statusLabel}`,
      badge: "PDF",
    },
    {
      key: "consult",
      icon: "search",
      color: "#c17f24",
      bg: "#fff3e0",
      title: "맞춤 상담 병원 찾기",
      desc: "리뷰·거리·진료과목별 병원 선택 후 카카오톡 문의",
      badge: "병원 보기 →",
      actionOnly: true,
      onAction: onOpenConsult,
    },
  ];

  const toggleCheck = (key: string) => {
    Haptics.selectionAsync();
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const buildShareText = () => {
    const lines: string[] = [
      `🐾 [Petti 보행 분석 결과]`,
      ``,
      `${mockPet.name}(${mockPet.breed})의 보행 분석이 완료되었습니다.`,
      ``,
      `📅 측정일: ${analysis.date}`,
      `📋 검사 유형: ${analysis.label}`,
      `📐 평균 ROM: ${analysis.averageRom}°  (좌 ${analysis.leftRom}° / 우 ${analysis.rightRom}°)`,
      `⚖️ BCS: ${analysis.bcs.toFixed(1)}  |  상태: ${statusLabel}`,
      ...(analysis.compensationPattern ? [`⚠ 보상 패턴: ${analysis.compensationPattern}`] : []),
      ``,
    ];
    if (checked.has("video")) lines.push(`🎬 관절 스켈레톤 영상: ${MOCK_VIDEO_URL}`);
    if (checked.has("report")) lines.push(`📄 분석 리포트: ${MOCK_REPORT_URL}`);
    if (checked.has("consult")) lines.push(`💬 맞춤 상담: ${KAKAO_CHANNEL_URL}`);
    return lines.join("\n");
  };

  const handleShare = async () => {
    const anyChecked = checked.size > 0;
    if (!anyChecked) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      if (Platform.OS === "web") {
        alert("공유할 항목을 하나 이상 선택해 주세요.");
      }
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const shareText = buildShareText();
    if (Platform.OS === "web") {
      try {
        await navigator.clipboard.writeText(shareText);
        alert("공유 내용이 클립보드에 복사되었습니다.\n카카오톡에 붙여넣기 하세요!");
      } catch {
        alert(shareText);
      }
      onClose();
      return;
    }
    try {
      await Share.share({ message: shareText, title: "Petti 보행 분석 결과" });
    } catch {}
    onClose();
  };

  const checkedCount = checked.size;

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 50 }]}>
      <Pressable style={[StyleSheet.absoluteFill, styles.backdrop]} onPress={onClose} />

      <View style={[styles.sheet, { backgroundColor: colors.card }]}>
        <View style={[styles.handle, { backgroundColor: colors.border }]} />

        {/* Header */}
        <View style={[styles.sheetHeader, { borderBottomColor: colors.border + "40" }]}>
          <View style={[styles.kakaoIcon, { backgroundColor: KAKAO_YELLOW }]}>
            <Text style={styles.kakaoIconText}>K</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>
              카카오톡으로 공유
            </Text>
            <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
              분석 결과를 지인이나 담당 수의사에게 전달하세요
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={8}>
            <Feather name="x" size={20} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>

        {/* ── Scrollable body ── */}
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Preview card */}
          <View style={[styles.previewCard, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.border + "40" }]}>
            <View style={[styles.previewBrand, { backgroundColor: colors.primaryFixed }]}>
              <Text style={[styles.previewBrandText, { color: colors.primary }]}>Petti</Text>
            </View>
            <View style={styles.previewBody}>
              <Text style={[styles.previewTitle, { color: colors.foreground }]}>
                {mockPet.name}의 보행 분석 결과
              </Text>
              <Text style={[styles.previewDate, { color: colors.mutedForeground }]}>
                {analysis.date} · {analysis.label}
              </Text>
              <View style={styles.previewMetrics}>
                <View style={styles.previewMetricItem}>
                  <Text style={[styles.previewMetricVal, { color: colors.primary }]}>
                    {analysis.averageRom}°
                  </Text>
                  <Text style={[styles.previewMetricKey, { color: colors.mutedForeground }]}>ROM</Text>
                </View>
                <View style={[styles.previewDivider, { backgroundColor: colors.border }]} />
                <View style={styles.previewMetricItem}>
                  <Text style={[styles.previewMetricVal, { color: colors.primary }]}>
                    {analysis.bcs.toFixed(1)}
                  </Text>
                  <Text style={[styles.previewMetricKey, { color: colors.mutedForeground }]}>BCS</Text>
                </View>
                <View style={[styles.previewDivider, { backgroundColor: colors.border }]} />
                <View style={styles.previewMetricItem}>
                  <Text style={[styles.previewMetricVal, { color: statusColor }]}>
                    {statusLabel}
                  </Text>
                  <Text style={[styles.previewMetricKey, { color: colors.mutedForeground }]}>상태</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Section label */}
          <View style={styles.sectionLabelRow}>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
              공유할 항목 선택
            </Text>
            <Text style={[styles.sectionCount, { color: colors.primary }]}>
              {checkedCount}개 선택됨
            </Text>
          </View>

          {/* Share items with checkboxes */}
          <View style={styles.itemList}>
            {ITEMS.map((item) => {
              const isChecked = checked.has(item.key);

              if (item.actionOnly) {
                return (
                  <TouchableOpacity
                    key={item.key}
                    style={[
                      styles.shareItem,
                      {
                        backgroundColor: "#fffbeb",
                        borderColor: "#f59e0b60",
                      },
                    ]}
                    onPress={item.onAction}
                    activeOpacity={0.75}
                  >
                    <View style={[styles.shareItemIcon, { backgroundColor: item.bg }]}>
                      <Feather name={item.icon} size={16} color={item.color} />
                    </View>
                    <View style={styles.shareItemText}>
                      <Text style={[styles.shareItemTitle, { color: colors.foreground }]}>
                        {item.title}
                      </Text>
                      <Text style={[styles.shareItemDesc, { color: colors.mutedForeground }]}>
                        {item.desc}
                      </Text>
                    </View>
                    <View style={[styles.shareItemBadge, { backgroundColor: item.bg }]}>
                      <Text style={[styles.shareItemBadgeText, { color: item.color }]}>
                        {item.badge}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }

              return (
                <TouchableOpacity
                  key={item.key}
                  style={[
                    styles.shareItem,
                    {
                      backgroundColor: isChecked
                        ? item.bg + "60"
                        : colors.surfaceContainerLow,
                      borderColor: isChecked
                        ? item.color + "50"
                        : colors.border + "40",
                      borderWidth: isChecked ? 1.5 : 1,
                    },
                  ]}
                  onPress={() => toggleCheck(item.key)}
                  activeOpacity={0.75}
                >
                  {/* Checkbox */}
                  <View
                    style={[
                      styles.checkbox,
                      {
                        backgroundColor: isChecked ? item.color : "transparent",
                        borderColor: isChecked ? item.color : colors.border,
                      },
                    ]}
                  >
                    {isChecked && (
                      <Feather name="check" size={12} color="#fff" />
                    )}
                  </View>

                  <View style={[styles.shareItemIcon, { backgroundColor: item.bg }]}>
                    <Feather name={item.icon} size={16} color={item.color} />
                  </View>
                  <View style={styles.shareItemText}>
                    <Text style={[styles.shareItemTitle, { color: colors.foreground }]}>
                      {item.title}
                    </Text>
                    <Text style={[styles.shareItemDesc, { color: colors.mutedForeground }]}>
                      {item.desc}
                    </Text>
                  </View>
                  <View style={[styles.shareItemBadge, { backgroundColor: isChecked ? item.bg : colors.surfaceContainerLow }]}>
                    <Text style={[styles.shareItemBadgeText, { color: isChecked ? item.color : colors.mutedForeground }]}>
                      {item.badge}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{ height: 8 }} />
        </ScrollView>

        {/* ── Sticky bottom: share button ── */}
        <View style={[styles.bottomBar, { borderTopColor: colors.border + "40", backgroundColor: colors.card }]}>
          <TouchableOpacity
            style={[
              styles.shareBtn,
              {
                backgroundColor: checkedCount > 0 ? KAKAO_YELLOW : colors.surfaceContainerLow,
                opacity: checkedCount > 0 ? 1 : 0.6,
              },
            ]}
            onPress={handleShare}
            activeOpacity={0.85}
          >
            <View style={[styles.kakaoBtnIcon, { backgroundColor: "rgba(0,0,0,0.10)" }]}>
              <Text style={[styles.kakaoBtnIconText, { color: checkedCount > 0 ? KAKAO_DARK : colors.mutedForeground }]}>
                K
              </Text>
            </View>
            <Text style={[styles.shareBtnText, { color: checkedCount > 0 ? KAKAO_DARK : colors.mutedForeground }]}>
              {checkedCount > 0 ? `${checkedCount}개 항목 공유하기` : "항목을 선택해 주세요"}
            </Text>
          </TouchableOpacity>
          <Text style={[styles.disclaimer, { color: colors.outlineVariant }]}>
            선택한 항목이 카카오톡 메시지에 포함됩니다
          </Text>
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
    top: 80,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
  },
  handle: {
    width: 42,
    height: 5,
    borderRadius: 3,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 2,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  kakaoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  kakaoIconText: { fontSize: 18, fontWeight: "900", color: "#3a1d1d" },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 15, fontWeight: "700" },
  headerSub: { fontSize: 11, marginTop: 2 },
  closeBtn: { padding: 4 },

  scrollArea: { flex: 1 },
  scrollContent: { padding: 18, gap: 14 },

  previewCard: {
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    overflow: "hidden",
  },
  previewBrand: {
    width: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  previewBrandText: {
    fontSize: 12,
    fontWeight: "900",
    transform: [{ rotate: "-90deg" }],
    letterSpacing: -0.5,
  },
  previewBody: { flex: 1, padding: 14, gap: 6 },
  previewTitle: { fontSize: 13, fontWeight: "700" },
  previewDate: { fontSize: 11 },
  previewMetrics: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 4,
  },
  previewMetricItem: { alignItems: "center", gap: 2 },
  previewMetricVal: { fontSize: 16, fontWeight: "800" },
  previewMetricKey: { fontSize: 9, fontWeight: "600", textTransform: "uppercase" },
  previewDivider: { width: 1, height: 24 },

  sectionLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionLabel: { fontSize: 12, fontWeight: "600" },
  sectionCount: { fontSize: 12, fontWeight: "800" },

  itemList: { gap: 10 },
  shareItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  shareItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  shareItemText: { flex: 1 },
  shareItemTitle: { fontSize: 13, fontWeight: "700" },
  shareItemDesc: { fontSize: 11, marginTop: 2, lineHeight: 15 },
  shareItemBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  shareItemBadgeText: { fontSize: 10, fontWeight: "700" },

  bottomBar: {
    borderTopWidth: 1,
    padding: 16,
    paddingBottom: 28,
    gap: 10,
  },
  shareBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  kakaoBtnIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  kakaoBtnIconText: { fontSize: 14, fontWeight: "900" },
  shareBtnText: { fontSize: 15, fontWeight: "800" },
  disclaimer: { fontSize: 10, textAlign: "center" },
});

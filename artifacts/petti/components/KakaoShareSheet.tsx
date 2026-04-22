import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  Platform,
  Pressable,
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

interface Props {
  visible: boolean;
  onClose: () => void;
  analysis: Analysis | null;
  colors: any;
}

export function KakaoShareSheet({ visible, onClose, analysis, colors }: Props) {
  if (!visible || !analysis) return null;

  const statusLabel =
    analysis.status === "good" ? "양호" : analysis.status === "attention" ? "주의" : "위험";
  const statusColor =
    analysis.status === "good" ? "#00676a" : analysis.status === "attention" ? "#8e4e14" : "#ba1a1a";

  const shareText = [
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
    `🎬 관절 스켈레톤 영상: ${MOCK_VIDEO_URL}`,
    `📄 분석 리포트: ${MOCK_REPORT_URL}`,
    `💬 맞춤 상담: ${KAKAO_CHANNEL_URL}`,
  ].join("\n");

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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

  const ITEMS = [
    {
      icon: "film" as const,
      color: "#5e35b1",
      bg: "#ede7f6",
      title: "관절 스켈레톤 영상",
      desc: "AI 분석으로 생성된 관절 움직임 시각화 영상",
      badge: "영상",
    },
    {
      icon: "file-text" as const,
      color: "#00676a",
      bg: "#e0f2f1",
      title: "보행 분석 리포트",
      desc: `ROM ${analysis.averageRom}° · BCS ${analysis.bcs.toFixed(1)} · ${statusLabel}`,
      badge: "PDF",
    },
    {
      icon: "message-circle" as const,
      color: "#c17f24",
      bg: "#fff3e0",
      title: "맞춤 상담 받기",
      desc: "수의사와 1:1 카카오톡 채널 상담 연결",
      badge: "바로가기",
    },
  ];

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={[styles.sheet, { backgroundColor: colors.card }]}>
        <View style={[styles.handle, { backgroundColor: colors.border }]} />

        {/* Header */}
        <View style={styles.sheetHeader}>
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
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Feather name="x" size={18} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>

        {/* Preview card — KakaoTalk message look */}
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

        {/* Share items */}
        <View style={styles.itemList}>
          {ITEMS.map((item) => (
            <View
              key={item.title}
              style={[styles.shareItem, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.border + "40" }]}
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
            </View>
          ))}
        </View>

        {/* Share button */}
        <TouchableOpacity
          style={[styles.shareBtn, { backgroundColor: KAKAO_YELLOW }]}
          onPress={handleShare}
          activeOpacity={0.85}
        >
          <View style={[styles.kakaoBtnIcon, { backgroundColor: "rgba(0,0,0,0.12)" }]}>
            <Text style={[styles.kakaoBtnIconText, { color: KAKAO_DARK }]}>K</Text>
          </View>
          <Text style={[styles.shareBtnText, { color: KAKAO_DARK }]}>카카오톡으로 공유하기</Text>
        </TouchableOpacity>

        <Text style={[styles.disclaimer, { color: colors.outlineVariant }]}>
          공유 내용에는 영상 링크, 리포트, 상담 연결이 포함됩니다
        </Text>
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
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: 36,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 20,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 4,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  kakaoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  kakaoIconText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#3a1d1d",
  },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 15, fontWeight: "700" },
  headerSub: { fontSize: 11, marginTop: 2 },
  closeBtn: { padding: 4 },
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
  previewBody: {
    flex: 1,
    padding: 14,
    gap: 6,
  },
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
  itemList: { gap: 8 },
  shareItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    gap: 12,
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
  shareItemDesc: { fontSize: 11, marginTop: 2 },
  shareItemBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  shareItemBadgeText: { fontSize: 10, fontWeight: "700" },
  shareBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 4,
  },
  kakaoBtnIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  kakaoBtnIconText: {
    fontSize: 14,
    fontWeight: "900",
  },
  shareBtnText: {
    fontSize: 15,
    fontWeight: "800",
  },
  disclaimer: {
    fontSize: 10,
    textAlign: "center",
    marginTop: -8,
  },
});

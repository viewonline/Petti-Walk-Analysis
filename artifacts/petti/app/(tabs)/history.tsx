import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import React, { useState } from "react";
import {
  ActivityIndicator,
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
import { AnalysisCard } from "@/components/AnalysisCard";
import { TrendChart } from "@/components/TrendChart";
import { PettiTalk } from "@/components/PettiTalk";
import { mockAnalyses, mockTrend, Analysis, mockPet } from "@/data/mockData";

const HOSPITAL_URL = "https://pf.kakao.com/petti";

function buildPdfHtml(): string {
  const pet = mockPet;
  const now = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const rows = mockAnalyses
    .map(
      (a) => `
      <tr>
        <td>${a.date}</td>
        <td>${a.label}</td>
        <td style="text-align:center">${a.leftRom}°</td>
        <td style="text-align:center">${a.rightRom}°</td>
        <td style="text-align:center"><strong>${a.averageRom}°</strong></td>
        <td style="text-align:center">${a.bcs.toFixed(1)}</td>
        <td style="text-align:center">${
          a.status === "good"
            ? '<span style="color:#00676a;font-weight:700">양호</span>'
            : a.status === "attention"
            ? '<span style="color:#8e4e14;font-weight:700">주의</span>'
            : '<span style="color:#ba1a1a;font-weight:700">위험</span>'
        }</td>
        <td>${a.note}</td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif; margin: 0; padding: 32px; color: #181c1d; background: #fff; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #00676a; padding-bottom: 20px; margin-bottom: 24px; }
    .brand { font-size: 28px; font-weight: 900; color: #00676a; letter-spacing: -1px; }
    .subtitle { font-size: 13px; color: #3e4949; margin-top: 4px; }
    .meta-box { background: #f0f4f4; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px; display: flex; gap: 40px; }
    .meta-item { }
    .meta-label { font-size: 11px; color: #3e4949; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
    .meta-value { font-size: 16px; font-weight: 700; color: #181c1d; margin-top: 2px; }
    h2 { font-size: 16px; font-weight: 800; color: #181c1d; margin: 0 0 12px; letter-spacing: -0.3px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 28px; }
    thead tr { background: #00676a; color: #fff; }
    thead th { padding: 10px 8px; text-align: left; font-weight: 700; font-size: 11px; }
    tbody tr:nth-child(even) { background: #f6fafa; }
    tbody td { padding: 9px 8px; border-bottom: 1px solid #e5e9e9; vertical-align: top; line-height: 1.4; }
    .note-section { background: #f6fafa; border-left: 3px solid #00676a; padding: 14px 16px; border-radius: 0 8px 8px 0; margin-bottom: 28px; }
    .note-text { font-size: 12px; color: #3e4949; line-height: 1.6; }
    .footer { font-size: 10px; color: #6e7979; text-align: center; border-top: 1px solid #bec9c9; padding-top: 12px; margin-top: 8px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">Petti</div>
      <div class="subtitle">반려견 보행 분석 리포트</div>
    </div>
    <div style="text-align:right; font-size:12px; color:#3e4949;">
      <div>발행일: ${now}</div>
      <div style="margin-top:4px; color:#00676a; font-weight:600;">petti.vet</div>
    </div>
  </div>

  <div class="meta-box">
    <div class="meta-item">
      <div class="meta-label">반려견 이름</div>
      <div class="meta-value">${pet.name}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">견종</div>
      <div class="meta-value">${pet.breed}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">나이</div>
      <div class="meta-value">${pet.age}세</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">체중</div>
      <div class="meta-value">${pet.weight} kg</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">총 측정 횟수</div>
      <div class="meta-value">${mockAnalyses.length}회</div>
    </div>
  </div>

  <h2>보행 분석 이력</h2>
  <table>
    <thead>
      <tr>
        <th>측정일</th>
        <th>검사 유형</th>
        <th>좌측 ROM</th>
        <th>우측 ROM</th>
        <th>평균 ROM</th>
        <th>BCS</th>
        <th>상태</th>
        <th>소견</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <h2>최신 측정 소견</h2>
  <div class="note-section">
    <div class="note-text">${mockAnalyses[0].note}</div>
    ${
      mockAnalyses[0].compensationPattern
        ? `<div class="note-text" style="margin-top:8px; color:#8e4e14; font-weight:600;">⚠ 보상 패턴: ${mockAnalyses[0].compensationPattern}</div>`
        : ""
    }
  </div>

  <div class="footer">
    본 리포트는 Petti 앱에서 자동 생성된 문서입니다. 의료적 진단을 대체하지 않으며, 정확한 진단은 수의사와 상담하시기 바랍니다.
  </div>
</body>
</html>`;
}

export default function HistoryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<Analysis | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 44) : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

  const selectAnalysis = (a: Analysis) => {
    Haptics.selectionAsync();
    setSelected(selected?.id === a.id ? null : a);
  };

  const handleSavePdf = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setPdfLoading(true);
      const html = buildPdfHtml();

      if (Platform.OS === "web") {
        const win = window.open("", "_blank");
        if (win) {
          win.document.write(html);
          win.document.close();
          win.focus();
          win.print();
        }
        return;
      }

      const { uri } = await Print.printToFileAsync({ html, base64: false });
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: "보행 분석 리포트 저장",
          UTI: "com.adobe.pdf",
        });
      } else {
        Alert.alert("PDF 생성 완료", `파일이 저장되었습니다.\n${uri}`);
      }
    } catch (e) {
      Alert.alert("오류", "PDF 생성 중 문제가 발생했습니다.");
    } finally {
      setPdfLoading(false);
    }
  };

  const handleHospital = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Linking.openURL(HOSPITAL_URL);
    } catch {
      Alert.alert("오류", "상담 페이지를 열 수 없습니다.");
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: topPad + 12,
            paddingBottom: insets.bottom + bottomPad + 120,
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

          {/* Action buttons */}
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.surfaceContainerLow }]}
              onPress={handleSavePdf}
              disabled={pdfLoading}
              activeOpacity={0.7}
            >
              {pdfLoading ? (
                <ActivityIndicator size={15} color={colors.primary} />
              ) : (
                <Feather name="file-text" size={15} color={colors.primary} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.secondaryFixed }]}
              onPress={handleHospital}
              activeOpacity={0.7}
            >
              <Feather name="phone" size={15} color={colors.secondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Title */}
        <View>
          <Text style={[styles.screenTitle, { color: colors.foreground }]}>
            분석 기록
          </Text>
          <Text style={[styles.screenSub, { color: colors.mutedForeground }]}>
            {mockAnalyses.length}건의 분석 결과
          </Text>
        </View>

        {/* Trend Chart */}
        <TrendChart data={mockTrend} />

        {/* Analyses list */}
        <View style={styles.listSection}>
          {mockAnalyses.map((a) => (
            <View key={a.id}>
              <AnalysisCard
                analysis={a}
                onPress={() => selectAnalysis(a)}
              />
              {selected?.id === a.id && (
                <View
                  style={[
                    styles.detailCard,
                    { backgroundColor: colors.surfaceContainerLow },
                  ]}
                >
                  <Text style={[styles.detailTitle, { color: colors.primary }]}>
                    분석 상세
                  </Text>
                  <Text style={[styles.detailNote, { color: colors.mutedForeground }]}>
                    {a.note}
                  </Text>
                  {a.compensationPattern && (
                    <View style={[styles.patternBox, { backgroundColor: colors.secondaryFixed }]}>
                      <Feather name="alert-circle" size={13} color={colors.secondary} />
                      <Text style={[styles.patternText, { color: colors.secondary }]}>
                        {a.compensationPattern}
                      </Text>
                    </View>
                  )}
                  <View style={styles.romRow}>
                    {[
                      { label: "좌측 ROM", value: `${a.leftRom}°`, accent: colors.primary },
                      { label: "우측 ROM", value: `${a.rightRom}°`, accent: colors.primary },
                      { label: "평균 ROM", value: `${a.averageRom}°`, accent: colors.primary },
                      { label: "BCS", value: a.bcs.toFixed(1), accent: colors.secondary },
                    ].map((r, i) => (
                      <View
                        key={i}
                        style={[
                          styles.romBox,
                          { backgroundColor: colors.surfaceContainerHighest },
                        ]}
                      >
                        <Text style={[styles.romLabel, { color: colors.mutedForeground }]}>
                          {r.label}
                        </Text>
                        <Text style={[styles.romValue, { color: r.accent }]}>
                          {r.value}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      <PettiTalk latestAnalysis={mockAnalyses[0]} />
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
  headerActions: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  screenSub: {
    fontSize: 13,
    fontWeight: "500",
    marginTop: 2,
  },
  listSection: {
    gap: 8,
  },
  detailCard: {
    borderRadius: 16,
    padding: 16,
    marginTop: 4,
    gap: 10,
  },
  detailTitle: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  detailNote: {
    fontSize: 13,
    lineHeight: 18,
  },
  patternBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  patternText: {
    fontSize: 12,
    fontWeight: "600",
    flex: 1,
  },
  romRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  romBox: {
    flexBasis: "47%",
    flexGrow: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    gap: 4,
  },
  romLabel: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  romValue: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
});

import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

type Step = "guide" | "recording" | "uploading" | "done";
type Side = "left" | "right";

export default function CameraScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<Step>("guide");
  const [side, setSide] = useState<Side>("left");
  const [progress, setProgress] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 44) : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

  const startRecording = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setStep("recording");

    setTimeout(() => {
      setStep("uploading");
      Animated.timing(progressAnim, {
        toValue: 100,
        duration: 3000,
        useNativeDriver: false,
      }).start(() => {
        setStep("done");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      });
    }, 3000);
  };

  const reset = () => {
    setStep("guide");
    setProgress(0);
    progressAnim.setValue(0);
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: topPad + 12,
            paddingBottom: insets.bottom + bottomPad + 100,
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
          <View style={styles.logoCircle} />
        </View>

        {step === "guide" && (
          <>
            {/* Phase label */}
            <View>
              <Text style={[styles.phaseLabel, { color: colors.secondary }]}>
                단계 01
              </Text>
              <View style={styles.phaseTitleRow}>
                <Text style={[styles.phaseTitle, { color: colors.primary }]}>
                  촬영 가이드
                </Text>
                <View style={[styles.stepBadge, { backgroundColor: colors.secondaryFixed }]}>
                  <Text style={[styles.stepBadgeText, { color: colors.secondary }]}>
                    1 / 2단계
                  </Text>
                </View>
              </View>
            </View>

            {/* Instruction Card */}
            <View style={[styles.instructCard, { backgroundColor: colors.surfaceContainerLow }]}>
              <View style={styles.instructContent}>
                <View style={styles.instructText}>
                  <Text style={[styles.instructBody, { color: colors.mutedForeground }]}>
                    반려견을{" "}
                    <Text style={{ fontWeight: "700", color: colors.foreground }}>
                      왼쪽을 향해
                    </Text>{" "}
                    세워 주세요. 정확한 보행 분석을 위해{" "}
                    <Text style={{ fontWeight: "700", color: colors.foreground }}>
                      무릎 높이
                    </Text>
                    에서 촬영하세요.
                  </Text>
                  <View style={styles.metaBadges}>
                    {[
                      { icon: "arrow-up", label: "무릎 높이" },
                      { icon: "maximize", label: "180cm 거리" },
                    ].map((m, i) => (
                      <View
                        key={i}
                        style={[
                          styles.metaBadge,
                          { backgroundColor: colors.surfaceContainerHighest },
                        ]}
                      >
                        <Feather name={m.icon as any} size={16} color={colors.primary} />
                        <Text style={[styles.metaLabel, { color: colors.foreground }]}>
                          {m.label}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={[styles.illustBox, { backgroundColor: colors.surfaceContainerHighest }]}>
                  <Feather name="smartphone" size={36} color={colors.primary} opacity={0.4} />
                  <View style={[styles.correctBadge, { backgroundColor: "rgba(255,255,255,0.9)" }]}>
                    <Feather name="check-circle" size={12} color={colors.primary} />
                    <Text style={[styles.correctText, { color: colors.primary }]}>올바른 각도</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Camera mock */}
            <View style={[styles.cameraBox, { backgroundColor: "#0a1a1a" }]}>
              <Text style={[styles.cameraHint, { color: "rgba(255,255,255,0.4)" }]}>
                카메라 영역
              </Text>

              {/* Guide overlay */}
              <View style={styles.guideOverlay}>
                <View style={[styles.guideFrame, { borderColor: "rgba(255,255,255,0.3)" }]} />
                <View style={[styles.alignLabel, { backgroundColor: "rgba(0,0,0,0.5)" }]}>
                  <Text style={styles.alignText}>다리를 여기에 맞추세요</Text>
                </View>
              </View>

              {/* Timer mock */}
              <View style={styles.topBar}>
                <View style={[styles.timerPill, { backgroundColor: "rgba(0,0,0,0.5)" }]}>
                  <View style={[styles.recDot, { backgroundColor: "#ba1a1a" }]} />
                  <Text style={styles.timerText}>00:00 / 00:15</Text>
                </View>
                <TouchableOpacity
                  style={[styles.flashBtn, { backgroundColor: "rgba(0,0,0,0.4)" }]}
                >
                  <Feather name="zap" size={18} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* Side toggle */}
              <View style={styles.sideToggleWrap}>
                <View style={[styles.sideToggle, { backgroundColor: "rgba(0,0,0,0.5)" }]}>
                  {(["left", "right"] as Side[]).map((s) => (
                    <TouchableOpacity
                      key={s}
                      style={[
                        styles.sideBtn,
                        side === s && { backgroundColor: colors.primary },
                      ]}
                      onPress={() => setSide(s)}
                    >
                      <Text style={[styles.sideBtnText, { color: side === s ? "#fff" : "rgba(255,255,255,0.6)" }]}>
                        {s === "left" ? "왼쪽" : "오른쪽"}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Record button */}
            <TouchableOpacity
              style={[styles.recordBtn, { backgroundColor: colors.primary }]}
              onPress={startRecording}
              activeOpacity={0.85}
            >
              <Text style={styles.recordBtnText}>촬영 시작</Text>
            </TouchableOpacity>
          </>
        )}

        {step === "recording" && (
          <View style={styles.centerSection}>
            <View style={[styles.recCircle, { borderColor: colors.destructive }]}>
              <View style={[styles.recInner, { backgroundColor: colors.destructive }]}>
                <Feather name="square" size={20} color="#fff" />
              </View>
            </View>
            <Text style={[styles.recordingTitle, { color: colors.foreground }]}>
              촬영 중...
            </Text>
            <Text style={[styles.recordingHint, { color: colors.mutedForeground }]}>
              15초 분량을 촬영합니다
            </Text>
          </View>
        )}

        {step === "uploading" && (
          <View style={[styles.uploadCard, { backgroundColor: colors.card }]}>
            <View style={[styles.uploadIconWrap, { backgroundColor: colors.primaryFixed }]}>
              <Feather name="upload-cloud" size={36} color={colors.primary} />
            </View>
            <Text style={[styles.uploadTitle, { color: colors.foreground }]}>
              업로드 중
            </Text>
            <Text style={[styles.uploadSub, { color: colors.mutedForeground }]}>
              생체역학 마커 및 보행 대칭성을 분석하고 있습니다...
            </Text>
            <View style={[styles.progressTrack, { backgroundColor: colors.surfaceContainerLow }]}>
              <Animated.View
                style={[
                  styles.progressFill,
                  { backgroundColor: colors.primary, width: progressWidth },
                ]}
              />
            </View>
          </View>
        )}

        {step === "done" && (
          <View style={[styles.uploadCard, { backgroundColor: colors.card }]}>
            <View style={[styles.uploadIconWrap, { backgroundColor: "#d4f7e8" }]}>
              <Feather name="check-circle" size={36} color="#00a86b" />
            </View>
            <Text style={[styles.uploadTitle, { color: colors.foreground }]}>
              분석 완료!
            </Text>
            <Text style={[styles.uploadSub, { color: colors.mutedForeground }]}>
              보행 분석 결과가 준비되었습니다. 기록 탭에서 확인하세요.
            </Text>
            <TouchableOpacity
              style={[styles.recordBtn, { backgroundColor: colors.primary }]}
              onPress={reset}
            >
              <Text style={styles.recordBtnText}>다시 촬영하기</Text>
            </TouchableOpacity>
          </View>
        )}
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
  phaseLabel: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  phaseTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  phaseTitle: {
    fontSize: 22,
    fontWeight: "800",
  },
  stepBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  stepBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  instructCard: {
    borderRadius: 20,
    padding: 20,
  },
  instructContent: {
    flexDirection: "row",
    gap: 12,
  },
  instructText: {
    flex: 1,
    gap: 12,
  },
  instructBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  metaBadges: {
    flexDirection: "row",
    gap: 8,
  },
  metaBadge: {
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    gap: 4,
  },
  metaLabel: {
    fontSize: 9,
    fontWeight: "700",
    textAlign: "center",
  },
  illustBox: {
    width: 100,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    paddingVertical: 20,
  },
  correctBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    right: 8,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  correctText: {
    fontSize: 9,
    fontWeight: "700",
  },
  cameraBox: {
    borderRadius: 20,
    aspectRatio: 9 / 14,
    overflow: "hidden",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraHint: {
    fontSize: 14,
  },
  guideOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  guideFrame: {
    width: "70%",
    height: "50%",
    borderWidth: 1.5,
    borderRadius: 12,
    borderStyle: "dashed",
  },
  alignLabel: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 12,
  },
  alignText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  topBar: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timerPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  recDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  timerText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  flashBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  sideToggleWrap: {
    position: "absolute",
    bottom: 80,
    alignItems: "center",
  },
  sideToggle: {
    flexDirection: "row",
    borderRadius: 999,
    padding: 3,
  },
  sideBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
  },
  sideBtnText: {
    fontSize: 12,
    fontWeight: "700",
  },
  recordBtn: {
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
  },
  recordBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  centerSection: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 16,
  },
  recCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  recInner: {
    width: 72,
    height: 72,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  recordingTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  recordingHint: {
    fontSize: 14,
  },
  uploadCard: {
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  uploadIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  uploadSub: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 16,
  },
  progressTrack: {
    width: "100%",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
  },
});

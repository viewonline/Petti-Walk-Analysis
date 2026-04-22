import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

const FEATURES = [
  {
    icon: "video",
    title: "영상 기반 보행 분석",
    desc: "스마트폰으로 촬영한 영상으로 관절 ROM을 자동 측정합니다",
  },
  {
    icon: "trending-up",
    title: "추세 리포트",
    desc: "치료 진행에 따라 좌·우 관절 회복 추이를 한눈에 확인하세요",
  },
  {
    icon: "clipboard",
    title: "수의사 연동 처방",
    desc: "분석 결과를 바탕으로 맞춤 재활 프로그램을 받아보세요",
  },
];

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 44) : insets.top;

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPad + 20, paddingBottom: insets.bottom + 40 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}
      <View style={styles.heroSection}>
        <View style={[styles.logoBg, { backgroundColor: colors.primaryFixed }]}>
          <Feather name="activity" size={36} color={colors.primary} />
        </View>
        <Text style={[styles.appTitle, { color: colors.primary }]}>Petti</Text>
        <Text style={[styles.tagline, { color: colors.foreground }]}>
          내 반려견의 건강한 걸음을{"\n"}지켜보세요
        </Text>
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>
          AI 관절 분석으로 수술 후 회복을 과학적으로 관리
        </Text>
      </View>

      {/* Feature Cards */}
      <View style={styles.features}>
        {FEATURES.map((f, i) => (
          <View
            key={i}
            style={[styles.featureCard, { backgroundColor: colors.card }]}
          >
            <View
              style={[
                styles.featureIconWrap,
                { backgroundColor: colors.primaryFixed },
              ]}
            >
              <Feather name={f.icon as any} size={20} color={colors.primary} />
            </View>
            <View style={styles.featureText}>
              <Text style={[styles.featureTitle, { color: colors.foreground }]}>
                {f.title}
              </Text>
              <Text style={[styles.featureDesc, { color: colors.mutedForeground }]}>
                {f.desc}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* CTA */}
      <View style={styles.ctaSection}>
        <TouchableOpacity
          style={[styles.kakaoBtn]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push("/(auth)/login");
          }}
          activeOpacity={0.85}
        >
          <Text style={styles.kakaoBtnText}>카카오로 시작하기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.emailBtn, { borderColor: colors.border }]}
          onPress={() => {
            Haptics.selectionAsync();
            router.push("/(auth)/login");
          }}
          activeOpacity={0.7}
        >
          <Text style={[styles.emailBtnText, { color: colors.foreground }]}>
            이메일로 로그인
          </Text>
        </TouchableOpacity>

        <Text style={[styles.terms, { color: colors.outlineVariant }]}>
          계속하면 이용약관 및 개인정보 처리방침에 동의하는 것으로 간주됩니다
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {
    paddingHorizontal: 24,
    gap: 32,
  },
  heroSection: {
    alignItems: "center",
    gap: 12,
    paddingTop: 20,
  },
  logoBg: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  appTitle: {
    fontSize: 40,
    fontWeight: "900",
    letterSpacing: -1.5,
  },
  tagline: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.8,
    textAlign: "center",
    lineHeight: 34,
  },
  sub: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 20,
  },
  features: { gap: 12 },
  featureCard: {
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  featureIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  featureText: { flex: 1, gap: 2 },
  featureTitle: { fontSize: 14, fontWeight: "700" },
  featureDesc: { fontSize: 12, lineHeight: 17 },
  ctaSection: { gap: 12 },
  kakaoBtn: {
    backgroundColor: "#FEE500",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  kakaoBtnText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#191919",
  },
  emailBtn: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1.5,
  },
  emailBtnText: {
    fontSize: 15,
    fontWeight: "600",
  },
  terms: {
    fontSize: 11,
    textAlign: "center",
    lineHeight: 16,
  },
});

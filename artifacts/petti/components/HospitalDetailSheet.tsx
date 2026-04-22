import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ConsultHospital, HospitalReview } from "@/data/hospitals";
import type { ColorTokens } from "@/constants/colors";

interface Props {
  hospital: ConsultHospital | null;
  initialTab?: "info" | "reviews" | "consult";
  colors: ColorTokens;
  onClose: () => void;
  onOpenCommunity?: (hospitalName: string) => void;
}

const SPECIALTY_COLORS: Record<string, { bg: string; fg: string; icon: string }> = {
  정형외과: { bg: "#e3f2fd", fg: "#1565c0", icon: "activity" },
  재활:    { bg: "#e8f5e9", fg: "#2e7d32", icon: "refresh-cw" },
  피부과:   { bg: "#fce4ec", fg: "#c62828", icon: "sun" },
  건강검진:  { bg: "#f3e5f5", fg: "#6a1b9a", icon: "clipboard" },
  중성화수술: { bg: "#fff8e1", fg: "#f57f17", icon: "scissors" },
  내과:    { bg: "#fff3e0", fg: "#e65100", icon: "heart" },
  치과:    { bg: "#e8eaf6", fg: "#283593", icon: "smile" },
};

const REPORT_ITEMS = [
  { key: "gait", label: "보행 분석 리포트", sub: "ROM · BCS · 상태 요약", icon: "file-text" as const },
  { key: "video", label: "관절 스켈레톤 영상", sub: "AI 분석 시각화 영상 링크", icon: "film" as const },
  { key: "note", label: "임상 소견 메모", sub: "수의사 전달용 요약 노트", icon: "clipboard" as const },
];

function buildBookingDays(count = 7) {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const label = i === 0 ? "오늘" : i === 1 ? "내일" : `${days[d.getDay()]}`;
    const mmdd = `${d.getMonth() + 1}/${d.getDate()}`;
    return { label, mmdd, dayIdx: d.getDay(), i };
  });
}

const BOOKING_DAYS = buildBookingDays(7);

const AM_SLOTS = ["09:00", "10:00", "11:00", "12:00"];
const PM_SLOTS = ["13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
const CLOSED_SLOTS = new Set(["09:00", "11:00", "14:00", "17:00"]);

function StarRating({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <View style={{ flexDirection: "row", gap: 1 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Text key={s} style={{ fontSize: size, color: s <= Math.round(rating) ? "#fbbf24" : "#d1d5db" }}>
          ★
        </Text>
      ))}
    </View>
  );
}

function ReviewCard({ review, colors }: { review: HospitalReview; colors: ColorTokens }) {
  return (
    <View style={[rstyles.reviewCard, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.border + "40" }]}>
      <View style={rstyles.reviewHeader}>
        <View style={[rstyles.reviewAvatar, { backgroundColor: colors.primaryFixed }]}>
          <Text style={{ fontSize: 14 }}>🐾</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text style={[rstyles.reviewPetName, { color: colors.foreground }]}>{review.petName}</Text>
            <Text style={[rstyles.reviewBreed, { color: colors.mutedForeground }]}>{review.petBreed}</Text>
          </View>
          <View style={[rstyles.conditionChip, { backgroundColor: colors.primaryFixed + "90" }]}>
            <Text style={[rstyles.conditionText, { color: colors.primary }]}>{review.condition}</Text>
          </View>
        </View>
        <View style={{ alignItems: "flex-end", gap: 3 }}>
          <StarRating rating={review.rating} size={11} />
          <Text style={[rstyles.reviewDate, { color: colors.mutedForeground }]}>{review.date}</Text>
        </View>
      </View>
      <Text style={[rstyles.reviewText, { color: colors.foreground }]}>{review.text}</Text>
      <View style={rstyles.reviewFooter}>
        <Feather name="thumbs-up" size={12} color={colors.mutedForeground} />
        <Text style={[rstyles.helpfulText, { color: colors.mutedForeground }]}>도움돼요 {review.helpful}</Text>
      </View>
    </View>
  );
}

export function HospitalDetailSheet({ hospital, initialTab = "info", colors, onClose, onOpenCommunity }: Props) {
  const [activeTab, setActiveTab] = useState<"info" | "reviews" | "consult">(initialTab);
  const [saved, setSaved] = useState(false);
  const [reportChecked, setReportChecked] = useState<Set<string>>(new Set(["gait"]));
  const [reportSent, setReportSent] = useState(false);
  const [bookingType, setBookingType] = useState<"초진" | "재진">("초진");
  const [bookingDay, setBookingDay] = useState(0);
  const [bookingSlot, setBookingSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<{ day: string; slot: string } | null>(null);
  const insets = useSafeAreaInsets();
  const tabBarH = Platform.OS === "web" ? 84 : 49;

  if (!hospital) return null;

  const matchColor =
    hospital.matchScore >= 90 ? "#00676a" : hospital.matchScore >= 75 ? "#8e4e14" : "#6b7280";

  const tabs = [
    { key: "info" as const, label: "정보" },
    { key: "reviews" as const, label: `후기 ${hospital.reviewCount}건` },
    { key: "consult" as const, label: "상담 예약" },
  ];

  const handleBook = () => {
    if (!bookingSlot) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const day = BOOKING_DAYS[bookingDay];
    setBookingConfirmed({ day: `${day.mmdd} (${day.label})`, slot: bookingSlot });
    setBooked(true);
  };

  const handleSendReport = () => {
    if (reportChecked.size === 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setReportSent(true);
  };

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 65 }]}>
      <Pressable style={dstyles.backdrop} onPress={onClose} />

      <View style={[dstyles.sheet, { backgroundColor: colors.background }]}>
        {/* Drag handle */}
        <View style={[dstyles.handle, { backgroundColor: colors.border }]} />

        {/* ── Header ── */}
        <View style={[dstyles.header, { borderBottomColor: colors.border + "30" }]}>
          <TouchableOpacity style={dstyles.backBtn} onPress={onClose} hitSlop={10}>
            <Feather name="chevron-down" size={22} color={colors.foreground} />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text style={[dstyles.hospitalName, { color: colors.foreground }]} numberOfLines={1}>
                {hospital.name}
              </Text>
              {hospital.recommended && (
                <View style={[dstyles.recBadge, { backgroundColor: colors.primaryFixed }]}>
                  <Text style={[dstyles.recText, { color: colors.primary }]}>Petti 추천</Text>
                </View>
              )}
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 3 }}>
              <StarRating rating={hospital.rating} size={12} />
              <Text style={[dstyles.ratingText, { color: colors.foreground }]}>{hospital.rating}</Text>
              <Text style={[dstyles.reviewCountText, { color: colors.mutedForeground }]}>
                ({hospital.reviewCount}건)
              </Text>
              <Text style={[dstyles.revisitText, { color: colors.mutedForeground }]}>
                · 재방문 {hospital.revisitRate}%
              </Text>
            </View>
          </View>

          {/* Match score chip */}
          <View style={[dstyles.matchChip, { backgroundColor: matchColor + "18", borderColor: matchColor + "40" }]}>
            <Text style={[dstyles.matchLabel, { color: matchColor }]}>매칭</Text>
            <Text style={[dstyles.matchScore, { color: matchColor }]}>{hospital.matchScore}%</Text>
          </View>
        </View>

        {/* ── Quick action row ── */}
        <View style={[dstyles.actionRow, { borderBottomColor: colors.border + "30" }]}>
          <TouchableOpacity
            style={dstyles.quickAction}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Linking.openURL(`tel:${hospital.phone}`);
            }}
            activeOpacity={0.7}
          >
            <View style={[dstyles.quickActionIcon, { backgroundColor: colors.primaryFixed }]}>
              <Feather name="phone" size={16} color={colors.primary} />
            </View>
            <Text style={[dstyles.quickActionLabel, { color: colors.mutedForeground }]}>전화하기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={dstyles.quickAction}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Linking.openURL(`https://map.kakao.com/link/search/${encodeURIComponent(hospital.name)}`);
            }}
            activeOpacity={0.7}
          >
            <View style={[dstyles.quickActionIcon, { backgroundColor: colors.primaryFixed }]}>
              <Feather name="map-pin" size={16} color={colors.primary} />
            </View>
            <Text style={[dstyles.quickActionLabel, { color: colors.mutedForeground }]}>위치보기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={dstyles.quickAction}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Share.share({
                title: hospital.name,
                message: `Petti 추천 병원\n${hospital.name}\n📍 ${hospital.address}\n📞 ${hospital.phone}\n⭐ ${hospital.rating} (${hospital.reviewCount}건) · Petti 매칭 ${hospital.matchScore}%`,
              });
            }}
            activeOpacity={0.7}
          >
            <View style={[dstyles.quickActionIcon, { backgroundColor: colors.primaryFixed }]}>
              <Feather name="share-2" size={16} color={colors.primary} />
            </View>
            <Text style={[dstyles.quickActionLabel, { color: colors.mutedForeground }]}>공유하기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={dstyles.quickAction}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSaved((v) => !v);
            }}
            activeOpacity={0.7}
          >
            <View style={[dstyles.quickActionIcon, { backgroundColor: saved ? colors.primary : colors.primaryFixed }]}>
              <Feather name={saved ? "bookmark" : "bookmark"} size={16} color={saved ? "#fff" : colors.primary} />
            </View>
            <Text style={[dstyles.quickActionLabel, { color: saved ? colors.primary : colors.mutedForeground }]}>
              {saved ? "저장됨" : "저장하기"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Tab bar ── */}
        <View style={[dstyles.tabBar, { borderBottomColor: colors.border + "40" }]}>
          {tabs.map((t) => (
            <TouchableOpacity
              key={t.key}
              style={[
                dstyles.tab,
                activeTab === t.key && { borderBottomColor: colors.primary, borderBottomWidth: 2.5 },
              ]}
              onPress={() => { Haptics.selectionAsync(); setActiveTab(t.key); }}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  dstyles.tabText,
                  { color: activeTab === t.key ? colors.primary : colors.mutedForeground },
                  activeTab === t.key && { fontWeight: "800" },
                ]}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Tab content ── */}
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + tabBarH + 24 }}
        >
          {/* ────────── 정보 탭 ────────── */}
          {activeTab === "info" && (
            <View style={dstyles.section}>
              {/* Match reason */}
              <View style={[dstyles.matchReasonCard, { backgroundColor: colors.primaryFixed + "60", borderColor: colors.primary + "30" }]}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <View style={[dstyles.matchIconWrap, { backgroundColor: colors.primary }]}>
                    <Text style={{ fontSize: 12, color: "#fff" }}>AI</Text>
                  </View>
                  <Text style={[dstyles.matchReasonTitle, { color: colors.primary }]}>
                    Petti 매칭 {hospital.matchScore}% — 이유
                  </Text>
                </View>
                <Text style={[dstyles.matchReasonText, { color: colors.foreground }]}>
                  {hospital.matchReason}
                </Text>
                <Text style={[dstyles.matchReasonSub, { color: colors.mutedForeground }]}>
                  · 반려견 보행 분석 데이터 기반 자동 산출
                </Text>
              </View>

              {/* Specialties */}
              <Text style={[dstyles.sectionLabel, { color: colors.mutedForeground }]}>전문 과목</Text>
              <View style={dstyles.specialtyGrid}>
                {hospital.specialties.map((sp) => {
                  const c = SPECIALTY_COLORS[sp] ?? { bg: "#f3f4f6", fg: "#374151", icon: "tag" };
                  return (
                    <View key={sp} style={[dstyles.specialtyItem, { backgroundColor: c.bg }]}>
                      <Feather name={c.icon as any} size={14} color={c.fg} />
                      <Text style={[dstyles.specialtyLabel, { color: c.fg }]}>{sp}</Text>
                    </View>
                  );
                })}
              </View>

              {/* Hours */}
              <Text style={[dstyles.sectionLabel, { color: colors.mutedForeground }]}>진료 시간</Text>
              <View style={[dstyles.hoursCard, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.border + "40" }]}>
                {hospital.detailedHours.map((h, idx) => {
                  const isToday = new Date().getDay() === ["일","월","화","수","목","금","토"].indexOf(h.day);
                  return (
                    <View
                      key={h.day}
                      style={[
                        dstyles.hoursRow,
                        idx < hospital.detailedHours.length - 1 && { borderBottomColor: colors.border + "25", borderBottomWidth: 1 },
                        isToday && { backgroundColor: colors.primaryFixed + "50" },
                      ]}
                    >
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                        {isToday && (
                          <View style={[dstyles.todayDot, { backgroundColor: colors.primary }]} />
                        )}
                        <Text style={[dstyles.hoursDay, { color: isToday ? colors.primary : colors.foreground, fontWeight: isToday ? "800" : "600" }]}>
                          {h.day}
                        </Text>
                      </View>
                      <Text style={[dstyles.hoursTime, { color: h.closed ? "#ef4444" : isToday ? colors.primary : colors.mutedForeground }]}>
                        {h.time}
                      </Text>
                    </View>
                  );
                })}
              </View>

              {/* Address & phone */}
              <Text style={[dstyles.sectionLabel, { color: colors.mutedForeground }]}>위치 · 연락처</Text>
              <View style={[dstyles.infoCard, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.border + "40" }]}>
                <View style={dstyles.infoRow}>
                  <Feather name="map-pin" size={14} color={colors.mutedForeground} />
                  <Text style={[dstyles.infoText, { color: colors.foreground }]}>{hospital.address}</Text>
                  <Text style={[dstyles.infoBadge, { color: colors.primary }]}>{hospital.distance}</Text>
                </View>
                <View style={[dstyles.infoDivider, { backgroundColor: colors.border + "40" }]} />
                <View style={dstyles.infoRow}>
                  <Feather name="phone" size={14} color={colors.mutedForeground} />
                  <Text style={[dstyles.infoText, { color: colors.foreground }]}>{hospital.phone}</Text>
                </View>
                <View style={[dstyles.infoDivider, { backgroundColor: colors.border + "40" }]} />
                <View style={dstyles.infoRow}>
                  <Feather name="credit-card" size={14} color={colors.mutedForeground} />
                  <Text style={[dstyles.infoText, { color: colors.foreground }]}>
                    Petti 상담 최대 {(hospital.maxFee / 1000).toFixed(0)}천원
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* ────────── 후기 탭 ────────── */}
          {activeTab === "reviews" && (
            <View style={dstyles.section}>
              {hospital.reviews.length === 0 ? (
                <View style={dstyles.emptyReviews}>
                  <Text style={{ fontSize: 36 }}>🐾</Text>
                  <Text style={[dstyles.emptyTitle, { color: colors.foreground }]}>아직 후기가 없어요</Text>
                  <Text style={[dstyles.emptySub, { color: colors.mutedForeground }]}>
                    이 병원을 다녀온 첫 번째 보호자가 되어주세요
                  </Text>
                </View>
              ) : (
                <>
                  {/* Summary */}
                  <View style={[dstyles.reviewSummary, { backgroundColor: colors.primaryFixed + "60", borderColor: colors.primary + "25" }]}>
                    <View style={{ alignItems: "center", gap: 4 }}>
                      <Text style={[dstyles.summaryScore, { color: colors.primary }]}>{hospital.rating}</Text>
                      <StarRating rating={hospital.rating} size={14} />
                      <Text style={[dstyles.summaryCount, { color: colors.mutedForeground }]}>
                        {hospital.reviewCount}건 기준
                      </Text>
                    </View>
                    <View style={[dstyles.summaryDivider, { backgroundColor: colors.primary + "20" }]} />
                    <View style={{ flex: 1, gap: 6 }}>
                      <View style={dstyles.summaryRow}>
                        <Feather name="repeat" size={12} color={colors.primary} />
                        <Text style={[dstyles.summaryText, { color: colors.foreground }]}>재방문율 {hospital.revisitRate}%</Text>
                      </View>
                      <View style={dstyles.summaryRow}>
                        <Feather name="users" size={12} color={colors.primary} />
                        <Text style={[dstyles.summaryText, { color: colors.foreground }]}>보행 회복 케어 후기 {hospital.reviews.length}건</Text>
                      </View>
                    </View>
                  </View>

                  {hospital.reviews.map((r) => (
                    <ReviewCard key={r.id} review={r} colors={colors} />
                  ))}
                </>
              )}

              {/* Community link */}
              <TouchableOpacity
                style={[dstyles.communityBtn, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.border + "60" }]}
                onPress={() => { Haptics.selectionAsync(); onOpenCommunity?.(hospital.name); }}
                activeOpacity={0.8}
              >
                <View style={[dstyles.communityIcon, { backgroundColor: colors.primaryFixed }]}>
                  <Feather name="message-circle" size={16} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[dstyles.communityTitle, { color: colors.foreground }]}>
                    이 병원 보호자들과 소통하기
                  </Text>
                  <Text style={[dstyles.communitySub, { color: colors.mutedForeground }]}>
                    보행 회복·재활 치료 경험을 나눠보세요
                  </Text>
                </View>
                <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>
          )}

          {/* ────────── 상담 예약 탭 ────────── */}
          {activeTab === "consult" && (
            <View style={dstyles.section}>

              {/* ── 리포트 전송 ── */}
              <View style={[dstyles.consultCard, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.border + "40" }]}>
                <View style={dstyles.consultCardHeader}>
                  <View style={[dstyles.consultCardIcon, { backgroundColor: colors.primaryFixed }]}>
                    <Feather name="file-text" size={15} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[dstyles.consultCardTitle, { color: colors.foreground }]}>리포트 전송</Text>
                    <Text style={[dstyles.consultCardSub, { color: colors.mutedForeground }]}>
                      보행 분석 데이터를 미리 전달하세요
                    </Text>
                  </View>
                  {reportSent && (
                    <View style={[dstyles.sentBadge, { backgroundColor: colors.primaryFixed }]}>
                      <Feather name="check" size={11} color={colors.primary} />
                      <Text style={[dstyles.sentText, { color: colors.primary }]}>전송됨</Text>
                    </View>
                  )}
                </View>

                {!reportSent ? (
                  <>
                    <View style={dstyles.reportList}>
                      {REPORT_ITEMS.map((item) => {
                        const checked = reportChecked.has(item.key);
                        return (
                          <TouchableOpacity
                            key={item.key}
                            style={[
                              dstyles.reportItem,
                              {
                                backgroundColor: checked ? colors.primaryFixed + "70" : colors.background,
                                borderColor: checked ? colors.primary + "50" : colors.border + "50",
                              },
                            ]}
                            onPress={() => {
                              Haptics.selectionAsync();
                              setReportChecked((prev) => {
                                const next = new Set(prev);
                                next.has(item.key) ? next.delete(item.key) : next.add(item.key);
                                return next;
                              });
                            }}
                            activeOpacity={0.75}
                          >
                            <View style={[dstyles.checkbox, { backgroundColor: checked ? colors.primary : "transparent", borderColor: checked ? colors.primary : colors.border }]}>
                              {checked && <Feather name="check" size={11} color="#fff" />}
                            </View>
                            <Feather name={item.icon} size={15} color={checked ? colors.primary : colors.mutedForeground} />
                            <View style={{ flex: 1 }}>
                              <Text style={[dstyles.reportLabel, { color: colors.foreground }]}>{item.label}</Text>
                              <Text style={[dstyles.reportSub, { color: colors.mutedForeground }]}>{item.sub}</Text>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                    <TouchableOpacity
                      style={[
                        dstyles.sendBtn,
                        { backgroundColor: reportChecked.size > 0 ? colors.primary : colors.surfaceContainerLow },
                        { opacity: reportChecked.size > 0 ? 1 : 0.5 },
                      ]}
                      disabled={reportChecked.size === 0}
                      onPress={handleSendReport}
                      activeOpacity={0.85}
                    >
                      <Feather name="send" size={14} color="#fff" />
                      <Text style={dstyles.sendBtnText}>
                        {reportChecked.size > 0 ? `${reportChecked.size}개 항목 전송하기` : "항목을 선택하세요"}
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <View style={[dstyles.sentConfirm, { backgroundColor: colors.primaryFixed + "60" }]}>
                    <Feather name="check-circle" size={20} color={colors.primary} />
                    <Text style={[dstyles.sentConfirmText, { color: colors.primary }]}>
                      {hospital.name}에 리포트가 전송되었습니다
                    </Text>
                  </View>
                )}
              </View>

              {/* ── 예약하기 ── */}
              {hospital.bookable && (
                <View style={[dstyles.consultCard, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.border + "40" }]}>
                  <View style={dstyles.consultCardHeader}>
                    <View style={[dstyles.consultCardIcon, { backgroundColor: colors.primaryFixed }]}>
                      <Feather name="calendar" size={15} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[dstyles.consultCardTitle, { color: colors.foreground }]}>예약하기</Text>
                      <Text style={[dstyles.consultCardSub, { color: colors.mutedForeground }]}>
                        원하는 날짜와 시간을 선택하세요
                      </Text>
                    </View>
                    {booked && (
                      <View style={[dstyles.sentBadge, { backgroundColor: colors.primaryFixed }]}>
                        <Feather name="check" size={11} color={colors.primary} />
                        <Text style={[dstyles.sentText, { color: colors.primary }]}>예약됨</Text>
                      </View>
                    )}
                  </View>

                  {!booked ? (
                    <>
                      {/* 방문 유형 */}
                      <View style={dstyles.visitTypeRow}>
                        {(["초진", "재진"] as const).map((t) => (
                          <TouchableOpacity
                            key={t}
                            style={[
                              dstyles.visitTypeChip,
                              {
                                backgroundColor: bookingType === t ? colors.primary : colors.background,
                                borderColor: bookingType === t ? colors.primary : colors.border + "60",
                              },
                            ]}
                            onPress={() => { Haptics.selectionAsync(); setBookingType(t); }}
                            activeOpacity={0.8}
                          >
                            <Text style={[dstyles.visitTypeText, { color: bookingType === t ? "#fff" : colors.foreground }]}>{t}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>

                      {/* 날짜 선택 – 7일 가로 스크롤 */}
                      <Text style={[dstyles.bookLabel, { color: colors.mutedForeground }]}>날짜 선택</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16 }} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
                        {BOOKING_DAYS.map((d, idx) => {
                          const active = bookingDay === idx;
                          const isSun = d.dayIdx === 0;
                          const isSat = d.dayIdx === 6;
                          const dayColor = isSun ? "#ef4444" : isSat ? "#3b82f6" : colors.foreground;
                          return (
                            <TouchableOpacity
                              key={idx}
                              style={[
                                dstyles.dayChip,
                                {
                                  backgroundColor: active ? colors.primary : colors.background,
                                  borderColor: active ? colors.primary : colors.border + "60",
                                },
                              ]}
                              onPress={() => { Haptics.selectionAsync(); setBookingDay(idx); setBookingSlot(null); }}
                              activeOpacity={0.8}
                            >
                              <Text style={[dstyles.dayLabel, { color: active ? "rgba(255,255,255,0.8)" : colors.mutedForeground }]}>
                                {d.label}
                              </Text>
                              <Text style={[dstyles.dayDate, { color: active ? "#fff" : dayColor, fontWeight: "800" }]}>
                                {d.mmdd}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>

                      {/* 시간 선택 – AM / PM 그룹 */}
                      <Text style={[dstyles.bookLabel, { color: colors.mutedForeground, marginTop: 4 }]}>오전</Text>
                      <View style={dstyles.slotGrid}>
                        {AM_SLOTS.map((slot) => {
                          const closed = CLOSED_SLOTS.has(slot);
                          const active = bookingSlot === slot;
                          return (
                            <TouchableOpacity
                              key={slot}
                              disabled={closed}
                              style={[
                                dstyles.slotChip,
                                {
                                  backgroundColor: closed ? colors.surfaceContainerLow : active ? colors.primary : colors.background,
                                  borderColor: closed ? colors.border + "40" : active ? colors.primary : colors.border + "70",
                                  opacity: closed ? 0.5 : 1,
                                },
                              ]}
                              onPress={() => { Haptics.selectionAsync(); setBookingSlot(slot); }}
                              activeOpacity={0.8}
                            >
                              <Text style={[dstyles.slotTime, { color: closed ? colors.mutedForeground : active ? "#fff" : colors.foreground }]}>
                                {slot}
                              </Text>
                              {closed && <Text style={[dstyles.slotClosed, { color: "#ef4444" }]}>마감</Text>}
                            </TouchableOpacity>
                          );
                        })}
                      </View>

                      <Text style={[dstyles.bookLabel, { color: colors.mutedForeground, marginTop: 4 }]}>오후</Text>
                      <View style={dstyles.slotGrid}>
                        {PM_SLOTS.map((slot) => {
                          const closed = CLOSED_SLOTS.has(slot);
                          const active = bookingSlot === slot;
                          return (
                            <TouchableOpacity
                              key={slot}
                              disabled={closed}
                              style={[
                                dstyles.slotChip,
                                {
                                  backgroundColor: closed ? colors.surfaceContainerLow : active ? colors.primary : colors.background,
                                  borderColor: closed ? colors.border + "40" : active ? colors.primary : colors.border + "70",
                                  opacity: closed ? 0.5 : 1,
                                },
                              ]}
                              onPress={() => { Haptics.selectionAsync(); setBookingSlot(slot); }}
                              activeOpacity={0.8}
                            >
                              <Text style={[dstyles.slotTime, { color: closed ? colors.mutedForeground : active ? "#fff" : colors.foreground }]}>
                                {slot}
                              </Text>
                              {closed && <Text style={[dstyles.slotClosed, { color: "#ef4444" }]}>마감</Text>}
                            </TouchableOpacity>
                          );
                        })}
                      </View>

                      {bookingSlot && (
                        <View style={[dstyles.bookSummary, { backgroundColor: colors.primaryFixed + "70", borderColor: colors.primary + "30" }]}>
                          <Feather name="check-circle" size={14} color={colors.primary} />
                          <Text style={[dstyles.bookSummaryText, { color: colors.primary }]}>
                            {BOOKING_DAYS[bookingDay].mmdd} · {bookingSlot} · {bookingType} 예약 예정
                          </Text>
                        </View>
                      )}

                      <TouchableOpacity
                        style={[
                          dstyles.bookBtn,
                          {
                            backgroundColor: bookingSlot ? colors.primary : colors.surfaceContainerLow,
                            opacity: bookingSlot ? 1 : 0.5,
                          },
                        ]}
                        disabled={!bookingSlot}
                        onPress={handleBook}
                        activeOpacity={0.85}
                      >
                        <Feather name="calendar" size={14} color="#fff" />
                        <Text style={dstyles.bookBtnText}>
                          {bookingSlot ? "예약 확정하기" : "시간을 선택하세요"}
                        </Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <View style={[dstyles.bookedConfirm, { backgroundColor: colors.primaryFixed + "60" }]}>
                      <Feather name="check-circle" size={20} color={colors.primary} />
                      <View style={{ flex: 1 }}>
                        <Text style={[dstyles.bookedTitle, { color: colors.primary }]}>예약이 완료되었습니다</Text>
                        <Text style={[dstyles.bookedSub, { color: colors.primary + "cc" }]}>
                          {bookingConfirmed?.day} {bookingConfirmed?.slot} · {bookingType}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              )}

              {/* ── 커뮤니티 연결 ── */}
              <TouchableOpacity
                style={[dstyles.communityBtn, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.border + "60" }]}
                onPress={() => { Haptics.selectionAsync(); onOpenCommunity?.(hospital.name); }}
                activeOpacity={0.8}
              >
                <View style={[dstyles.communityIcon, { backgroundColor: colors.primaryFixed }]}>
                  <Feather name="message-circle" size={16} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[dstyles.communityTitle, { color: colors.foreground }]}>
                    이 병원 보호자들에게 질문하기
                  </Text>
                  <Text style={[dstyles.communitySub, { color: colors.mutedForeground }]}>
                    진료비·재활 경험을 직접 물어보세요
                  </Text>
                </View>
                <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const dstyles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.45)" },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: 48,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
  },
  handle: { width: 42, height: 4, borderRadius: 2, alignSelf: "center", marginTop: 10, marginBottom: 2 },
  header: { paddingHorizontal: 16, paddingVertical: 12, flexDirection: "row", alignItems: "center", gap: 10, borderBottomWidth: 1 },
  backBtn: { padding: 4 },
  hospitalName: { fontSize: 17, fontWeight: "800", letterSpacing: -0.4 },
  recBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8 },
  recText: { fontSize: 10, fontWeight: "800" },
  ratingText: { fontSize: 13, fontWeight: "700" },
  reviewCountText: { fontSize: 12 },
  revisitText: { fontSize: 12 },
  matchChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, borderWidth: 1, alignItems: "center" },
  matchLabel: { fontSize: 9, fontWeight: "600" },
  matchScore: { fontSize: 17, fontWeight: "900" },

  actionRow: { flexDirection: "row", paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 1 },
  quickAction: { flex: 1, alignItems: "center", gap: 5 },
  quickActionIcon: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  quickActionLabel: { fontSize: 11, fontWeight: "500" },

  tabBar: { flexDirection: "row", borderBottomWidth: 1 },
  tab: { flex: 1, alignItems: "center", paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: "transparent" },
  tabText: { fontSize: 13, fontWeight: "600" },

  section: { padding: 16, gap: 16 },
  sectionLabel: { fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },

  matchReasonCard: { padding: 14, borderRadius: 16, borderWidth: 1, gap: 4 },
  matchIconWrap: { width: 24, height: 24, borderRadius: 7, alignItems: "center", justifyContent: "center" },
  matchReasonTitle: { fontSize: 13, fontWeight: "800" },
  matchReasonText: { fontSize: 14, fontWeight: "600", lineHeight: 20 },
  matchReasonSub: { fontSize: 11, marginTop: 2 },

  specialtyGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  specialtyItem: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  specialtyLabel: { fontSize: 13, fontWeight: "700" },

  hoursCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  hoursRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14, paddingVertical: 11 },
  todayDot: { width: 6, height: 6, borderRadius: 3 },
  hoursDay: { fontSize: 13 },
  hoursTime: { fontSize: 13 },

  infoCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 10, padding: 13 },
  infoText: { fontSize: 13, flex: 1 },
  infoBadge: { fontSize: 12, fontWeight: "700" },
  infoDivider: { height: 1, marginHorizontal: 13 },

  reviewSummary: { flexDirection: "row", borderRadius: 16, borderWidth: 1, padding: 16, gap: 16, alignItems: "center" },
  summaryScore: { fontSize: 32, fontWeight: "900" },
  summaryCount: { fontSize: 11 },
  summaryDivider: { width: 1, height: "80%", alignSelf: "center" },
  summaryRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  summaryText: { fontSize: 13, fontWeight: "500" },

  reviewCard: { borderRadius: 16, borderWidth: 1, padding: 14, gap: 10 },
  reviewHeader: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  reviewAvatar: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  reviewPetName: { fontSize: 14, fontWeight: "800" },
  reviewBreed: { fontSize: 12 },
  conditionChip: { alignSelf: "flex-start", paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6, marginTop: 3 },
  conditionText: { fontSize: 10, fontWeight: "700" },
  reviewDate: { fontSize: 11 },
  reviewText: { fontSize: 13, lineHeight: 19 },
  reviewFooter: { flexDirection: "row", alignItems: "center", gap: 5 },
  helpfulText: { fontSize: 12 },

  emptyReviews: { alignItems: "center", paddingVertical: 40, gap: 10 },
  emptyTitle: { fontSize: 16, fontWeight: "700" },
  emptySub: { fontSize: 13, textAlign: "center", lineHeight: 18 },

  communityBtn: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 16, borderWidth: 1 },
  communityIcon: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  communityTitle: { fontSize: 14, fontWeight: "700", marginBottom: 2 },
  communitySub: { fontSize: 12 },

  consultCard: { borderRadius: 18, borderWidth: 1, padding: 16, gap: 14 },
  consultCardHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  consultCardIcon: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  consultCardTitle: { fontSize: 15, fontWeight: "800" },
  consultCardSub: { fontSize: 12, marginTop: 1 },
  sentBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  sentText: { fontSize: 11, fontWeight: "700" },

  reportList: { gap: 8 },
  reportItem: { flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 1.5, borderRadius: 12, padding: 11 },
  checkbox: { width: 20, height: 20, borderRadius: 6, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  reportLabel: { fontSize: 13, fontWeight: "700" },
  reportSub: { fontSize: 11, marginTop: 1 },

  sendBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 14, paddingVertical: 14 },
  sendBtnText: { fontSize: 14, fontWeight: "800", color: "#fff" },
  sentConfirm: { flexDirection: "row", alignItems: "center", gap: 10, padding: 14, borderRadius: 14 },
  sentConfirmText: { fontSize: 13, fontWeight: "700", flex: 1 },

  visitTypeRow: { flexDirection: "row", gap: 8 },
  visitTypeChip: { flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 12, borderWidth: 1.5 },
  visitTypeText: { fontSize: 14, fontWeight: "700" },

  bookLabel: { fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.4 },
  dayChip: { alignItems: "center", paddingVertical: 10, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1.5, minWidth: 64, gap: 3 },
  dayLabel: { fontSize: 10, fontWeight: "600" },
  dayDate: { fontSize: 13 },

  slotGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  slotChip: { width: "22%", alignItems: "center", paddingVertical: 10, borderRadius: 12, borderWidth: 1, gap: 2 },
  slotTime: { fontSize: 13, fontWeight: "700" },
  slotClosed: { fontSize: 9, fontWeight: "700" },

  bookSummary: { flexDirection: "row", alignItems: "center", gap: 8, padding: 12, borderRadius: 12, borderWidth: 1 },
  bookSummaryText: { fontSize: 13, fontWeight: "600", flex: 1 },
  bookBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 14, paddingVertical: 14 },
  bookBtnText: { fontSize: 14, fontWeight: "800", color: "#fff" },

  bookedConfirm: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16, borderRadius: 14 },
  bookedTitle: { fontSize: 14, fontWeight: "800" },
  bookedSub: { fontSize: 12, marginTop: 2 },
});

const rstyles = StyleSheet.create({
  reviewCard: { borderRadius: 16, borderWidth: 1, padding: 14, gap: 10 },
  reviewHeader: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  reviewAvatar: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  reviewPetName: { fontSize: 14, fontWeight: "800" },
  reviewBreed: { fontSize: 12 },
  conditionChip: { alignSelf: "flex-start", paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6, marginTop: 3 },
  conditionText: { fontSize: 10, fontWeight: "700" },
  reviewDate: { fontSize: 11 },
  reviewText: { fontSize: 13, lineHeight: 19 },
  reviewFooter: { flexDirection: "row", alignItems: "center", gap: 5 },
  helpfulText: { fontSize: 12 },
});

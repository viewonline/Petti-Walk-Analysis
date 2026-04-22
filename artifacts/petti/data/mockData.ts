export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  weight: number;
  imageUrl?: string;
}

export interface Analysis {
  id: string;
  petId: string;
  date: string;
  averageRom: number;
  bcs: number;
  status: "good" | "attention" | "critical";
  label: string;
  note: string;
  leftRom: number;
  rightRom: number;
  compensationPattern?: string;
  videoUrl?: string;
}

export interface TrendPoint {
  date: string;
  rom: number;
  bcs: number;
}

export const mockPet: Pet = {
  id: "pet-1",
  name: "올리버",
  breed: "골든 리트리버",
  age: 6,
  weight: 28.5,
};

export const mockAnalyses: Analysis[] = [
  {
    id: "ana-1",
    petId: "pet-1",
    date: "2024년 10월 24일",
    averageRom: 132,
    bcs: 5.6,
    status: "good",
    label: "수술 후 회복 3단계",
    note: "이동성이 안정적입니다. 무릎 굴곡이 지난달보다 4% 개선되었습니다.",
    leftRom: 130,
    rightRom: 134,
    compensationPattern: "미미한 우측 보상 패턴 관찰됨",
  },
  {
    id: "ana-2",
    petId: "pet-1",
    date: "2024년 10월 12일",
    averageRom: 128,
    bcs: 5.5,
    status: "good",
    label: "수술 후 회복 2단계",
    note: "꾸준한 회복세를 보이고 있습니다. 좌우 균형이 향상되었습니다.",
    leftRom: 126,
    rightRom: 130,
    compensationPattern: "중등도 우측 보상 패턴",
  },
  {
    id: "ana-3",
    petId: "pet-1",
    date: "2024년 9월 28일",
    averageRom: 115,
    bcs: 5.4,
    status: "attention",
    label: "초기 기준 검사",
    note: "초기 관절 가동 범위가 제한적입니다. 물리치료를 권장합니다.",
    leftRom: 112,
    rightRom: 118,
    compensationPattern: "현저한 우측 체중 부하 감소",
  },
  {
    id: "ana-4",
    petId: "pet-1",
    date: "2024년 9월 14일",
    averageRom: 110,
    bcs: 5.2,
    status: "attention",
    label: "연간 건강 검진",
    note: "보행 시 약간의 비대칭이 관찰됩니다. 추적 관찰이 필요합니다.",
    leftRom: 108,
    rightRom: 112,
    compensationPattern: "좌측 과부하 패턴",
  },
  {
    id: "ana-5",
    petId: "pet-1",
    date: "2024년 8월 30일",
    averageRom: 120,
    bcs: 5.0,
    status: "good",
    label: "정기 검진",
    note: "전반적인 보행 상태가 양호합니다.",
    leftRom: 119,
    rightRom: 121,
    compensationPattern: "정상 보행 패턴",
  },
];

export const mockTrend: TrendPoint[] = [
  { date: "8/30", rom: 120, bcs: 5.0 },
  { date: "9/14", rom: 110, bcs: 5.2 },
  { date: "9/28", rom: 115, bcs: 5.4 },
  { date: "10/12", rom: 128, bcs: 5.5 },
  { date: "10/24", rom: 132, bcs: 5.6 },
];

export const STATUS_LABELS: Record<string, string> = {
  good: "양호",
  attention: "주의 필요",
  critical: "위험",
};

export const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  good: { bg: "#e8f5f5", text: "#00676a" },
  attention: { bg: "#ffdad6", text: "#ba1a1a" },
  critical: { bg: "#ffdad6", text: "#ba1a1a" },
};

export const OPTIMAL_ROM = { min: 125, max: 140 };

export interface PrescriptionItem {
  id: string;
  category: "kit" | "surgery" | "food" | "supplement" | "other";
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  icon: string;
  iconColor: string;
  iconBg: string;
  included: boolean;
}

export interface Prescription {
  id: string;
  petId: string;
  analysisId: string;
  date: string;
  vetName: string;
  vetTitle: string;
  hospital: string;
  clinicalNote: string;
  kitName: string;
  kitDescription: string;
  kitPrice: number;
  kitOriginalPrice: number;
  items: PrescriptionItem[];
  extraItems: PrescriptionItem[];
  stats: { label: string; value: string }[];
}

export const mockPrescription: Prescription = {
  id: "rx-1",
  petId: "pet-1",
  analysisId: "ana-1",
  date: "2024년 10월 24일",
  vetName: "김성민 수의사",
  vetTitle: "정형외과 전문의",
  hospital: "뷰 동물병원",
  clinicalNote:
    "올리버의 최신 보행 분석 결과를 검토했습니다. 슬개골 수술 후 회복 3단계로 관절 가동성은 안정적이나, 우측 보상 패턴 개선을 위해 전문 재활 키트 사용을 권장합니다. 꾸준한 홈케어가 완전 회복의 핵심입니다.",
  kitName: "펫티 재활 키트 Premium",
  kitDescription:
    "수의사 처방 기반 맞춤형 재활 패키지. 상세 진단 리포트 포함.",
  kitPrice: 249000,
  kitOriginalPrice: 300000,
  items: [
    {
      id: "item-1",
      category: "kit",
      name: "레이저 조사기",
      description: "심부 열 자극으로 염증 억제 및 통증 완화",
      price: 0,
      icon: "zap",
      iconColor: "#ef4444",
      iconBg: "#fef2f2",
      included: true,
    },
    {
      id: "item-2",
      category: "kit",
      name: "재활 짐볼",
      description: "코어 근력 및 균형 감각 강화 훈련",
      price: 0,
      icon: "circle",
      iconColor: "#3b82f6",
      iconBg: "#eff6ff",
      included: true,
    },
    {
      id: "item-3",
      category: "kit",
      name: "무릎 보조기",
      description: "비정상적 관절 가동 제한, 인대 보호",
      price: 0,
      icon: "shield",
      iconColor: "#d97706",
      iconBg: "#fffbeb",
      included: true,
    },
    {
      id: "item-4",
      category: "kit",
      name: "재활 전용 매트",
      description: "고탄성 미끄럼 방지, 관절 충격 최소화",
      price: 0,
      icon: "layers",
      iconColor: "#059669",
      iconBg: "#ecfdf5",
      included: true,
    },
  ],
  extraItems: [
    {
      id: "extra-1",
      category: "supplement",
      name: "관절 영양제 (글루코사민+MSM)",
      description: "연골 보호 및 관절 유연성 개선 · 60정 1개월분",
      price: 45000,
      icon: "package",
      iconColor: "#8b5cf6",
      iconBg: "#f5f3ff",
      included: false,
    },
    {
      id: "extra-2",
      category: "food",
      name: "관절 케어 처방 사료",
      description: "저인·고단백 처방식 · 오메가-3 강화 · 2kg",
      price: 89000,
      icon: "heart",
      iconColor: "#ec4899",
      iconBg: "#fdf2f8",
      included: false,
    },
  ],
  stats: [
    { label: "통증 완화 만족도", value: "92%" },
    { label: "활동성 개선 지표", value: "88%" },
    { label: "ROM 평균 향상", value: "35%" },
    { label: "임상 적용 환견", value: "100두" },
  ],
};

export const MOCK_CHAT_RESPONSES = [
  "올리버의 현재 ROM 수치와 보상 패턴을 분석했습니다. 꾸준한 회복세를 보이고 있어 긍정적입니다. 물리치료를 지속하시고, 다음 검진까지 무리한 운동은 피해주세요.",
  "ROM 132°는 정상 범위(125°–140°) 내에 있습니다. 현재의 재활 프로그램을 유지하시면 좋을 것 같습니다. 하루 2회, 10분씩 가벼운 보행 운동을 권장합니다.",
  "BCS(체중 점수) 변화를 보면 약간의 증가 추세가 있습니다. 관절 건강을 위해 적정 체중 유지가 중요합니다. 수의사 선생님과 식이 조절에 대해 상담해 보시겠어요?",
  "보상 패턴이 개선되고 있는 점은 매우 좋은 신호입니다. 다음 촬영 시에는 정면과 측면 모두 촬영해 주시면 더 정확한 분석이 가능합니다.",
  "궁금하신 점이 있으시면 언제든지 물어봐 주세요. 더 자세한 상담은 담당 수의사 선생님과 진행하시길 권장합니다.",
];

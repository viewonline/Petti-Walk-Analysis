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

export const MOCK_CHAT_RESPONSES = [
  "올리버의 현재 ROM 수치와 보상 패턴을 분석했습니다. 꾸준한 회복세를 보이고 있어 긍정적입니다. 물리치료를 지속하시고, 다음 검진까지 무리한 운동은 피해주세요.",
  "ROM 132°는 정상 범위(125°–140°) 내에 있습니다. 현재의 재활 프로그램을 유지하시면 좋을 것 같습니다. 하루 2회, 10분씩 가벼운 보행 운동을 권장합니다.",
  "BCS(체중 점수) 변화를 보면 약간의 증가 추세가 있습니다. 관절 건강을 위해 적정 체중 유지가 중요합니다. 수의사 선생님과 식이 조절에 대해 상담해 보시겠어요?",
  "보상 패턴이 개선되고 있는 점은 매우 좋은 신호입니다. 다음 촬영 시에는 정면과 측면 모두 촬영해 주시면 더 정확한 분석이 가능합니다.",
  "궁금하신 점이 있으시면 언제든지 물어봐 주세요. 더 자세한 상담은 담당 수의사 선생님과 진행하시길 권장합니다.",
];

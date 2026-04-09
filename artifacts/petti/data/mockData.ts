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
  videoUrl?: string;
}

export interface TrendPoint {
  date: string;
  rom: number;
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
  },
];

export const mockTrend: TrendPoint[] = [
  { date: "8/30", rom: 120 },
  { date: "9/14", rom: 110 },
  { date: "9/28", rom: 115 },
  { date: "10/12", rom: 128 },
  { date: "10/24", rom: 132 },
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

export interface Hospital {
  id: string;
  name: string;
  address: string;
}

export const MOCK_HOSPITALS: Hospital[] = [
  { id: "1", name: "행복 동물병원", address: "서울 강남구 테헤란로" },
  { id: "2", name: "사랑 동물병원", address: "서울 서초구 반포대로" },
  { id: "3", name: "튼튼 동물병원", address: "서울 송파구 올림픽로" },
  { id: "4", name: "믿음 동물병원", address: "서울 마포구 홍익로" },
  { id: "5", name: "한마음 동물병원", address: "서울 용산구 이태원로" },
  { id: "6", name: "굿모닝 동물병원", address: "서울 성동구 왕십리로" },
  { id: "7", name: "그린 동물병원", address: "서울 노원구 상계로" },
  { id: "8", name: "365 동물의료센터", address: "경기 성남시 분당구" },
  { id: "9", name: "블루크로스 동물병원", address: "경기 고양시 일산서구" },
  { id: "10", name: "VIP 동물의료센터", address: "서울 강서구 화곡로" },
];

export function searchHospitals(query: string): Hospital[] {
  if (!query.trim()) return [];
  const q = query.trim().toLowerCase();
  return MOCK_HOSPITALS.filter(
    (h) => h.name.toLowerCase().includes(q) || h.address.toLowerCase().includes(q)
  ).slice(0, 6);
}

export type Specialty =
  | "정형외과"
  | "재활"
  | "피부과"
  | "건강검진"
  | "중성화수술"
  | "내과"
  | "치과";

export interface HospitalReview {
  id: string;
  petName: string;
  petBreed: string;
  condition: string;
  rating: number;
  text: string;
  date: string;
  helpful: number;
}

export interface ConsultHospital {
  id: string;
  name: string;
  district: string;
  address: string;
  phone: string;
  rating: number;
  reviewCount: number;
  revisitRate: number;
  specialties: Specialty[];
  hours: string;
  detailedHours: { day: string; time: string; closed?: boolean }[];
  isOpen: boolean;
  distance: string;
  maxFee: number;
  kakaoChannel: string;
  bookable: boolean;
  recommended?: boolean;
  matchScore: number;
  matchReason: string;
  reviews: HospitalReview[];
}

export const CONSULT_HOSPITALS: ConsultHospital[] = [
  {
    id: "c1",
    name: "다터펫동물병원",
    district: "서울 양천구",
    address: "서울 양천구 목동중앙로 12",
    phone: "02-2645-7500",
    rating: 4.8,
    reviewCount: 23,
    revisitRate: 100,
    specialties: ["정형외과", "피부과", "중성화수술"],
    hours: "수요일 휴무",
    detailedHours: [
      { day: "월", time: "10:00~20:00" },
      { day: "화", time: "10:00~20:00" },
      { day: "수", time: "휴진", closed: true },
      { day: "목", time: "10:00~20:00" },
      { day: "금", time: "10:00~20:00" },
      { day: "토", time: "10:00~16:00" },
      { day: "일", time: "휴진", closed: true },
    ],
    isOpen: false,
    distance: "0.3km",
    maxFee: 25000,
    kakaoChannel: "https://pf.kakao.com/datervet",
    bookable: true,
    recommended: true,
    matchScore: 96,
    matchReason: "슬관절 정형외과 전문 + AI 보행 분석 협진 가능",
    reviews: [
      {
        id: "r1",
        petName: "초코",
        petBreed: "말티즈",
        condition: "슬개골 탈구 수술 후 재활",
        rating: 5,
        text: "수술 후 재활까지 꼼꼼하게 봐주셨어요. Petti 리포트 보내드렸더니 바로 확인하시고 맞춤 재활 계획을 잡아주셨습니다. 정말 감사해요!",
        date: "2025.04.10",
        helpful: 12,
      },
      {
        id: "r2",
        petName: "뽀리",
        petBreed: "포메라니안",
        condition: "전방십자인대 손상",
        rating: 5,
        text: "보행 영상 분석 결과를 보고 수술 필요 여부를 정확하게 설명해 주셨어요. 원장님 설명이 너무 친절하고 자세해서 불안감이 사라졌어요.",
        date: "2025.03.25",
        helpful: 8,
      },
      {
        id: "r3",
        petName: "루루",
        petBreed: "비숑프리제",
        condition: "관절 염증",
        rating: 4,
        text: "대기가 좀 있었지만 진료는 매우 꼼꼼했습니다. 다음 방문 때 Petti 앱으로 예약해볼 예정이에요.",
        date: "2025.03.18",
        helpful: 5,
      },
    ],
  },
  {
    id: "c2",
    name: "정말로동물병원",
    district: "서울 양천구",
    address: "서울 양천구 신정이펜1로 78",
    phone: "02-2698-2975",
    rating: 4.6,
    reviewCount: 14,
    revisitRate: 100,
    specialties: ["정형외과", "재활", "중성화수술", "건강검진"],
    hours: "10:00~20:00",
    detailedHours: [
      { day: "월", time: "10:00~20:00" },
      { day: "화", time: "10:00~20:00" },
      { day: "수", time: "10:00~20:00" },
      { day: "목", time: "10:00~20:00" },
      { day: "금", time: "10:00~20:00" },
      { day: "토", time: "10:00~15:00" },
      { day: "일", time: "휴진", closed: true },
    ],
    isOpen: true,
    distance: "3.0km",
    maxFee: 25000,
    kakaoChannel: "https://pf.kakao.com/jungmallo",
    bookable: true,
    matchScore: 91,
    matchReason: "재활 전문 + 수술 후 보행 회복 케어 특화",
    reviews: [
      {
        id: "r4",
        petName: "콩이",
        petBreed: "골든리트리버",
        condition: "고관절 이형성증 재활",
        rating: 5,
        text: "재활 치료 전문이라 매번 보행 상태를 체크해 주세요. Petti 앱으로 집에서 측정한 데이터도 함께 공유하니까 진료가 훨씬 효율적이에요.",
        date: "2025.04.05",
        helpful: 15,
      },
      {
        id: "r5",
        petName: "봄이",
        petBreed: "시바이누",
        condition: "슬개골 탈구 1기 보존치료",
        rating: 4,
        text: "수술 전 보존 치료를 먼저 시도해보자고 하셔서 믿음이 갔어요. 3개월째 재활 중인데 많이 나아졌습니다.",
        date: "2025.03.30",
        helpful: 9,
      },
    ],
  },
  {
    id: "c3",
    name: "리즈동물병원",
    district: "서울 양천구",
    address: "서울 양천구 목동동로 233",
    phone: "02-2649-0975",
    rating: 4.6,
    reviewCount: 2,
    revisitRate: 90,
    specialties: ["정형외과", "재활"],
    hours: "10:00~19:00",
    detailedHours: [
      { day: "월", time: "10:00~19:00" },
      { day: "화", time: "10:00~19:00" },
      { day: "수", time: "10:00~19:00" },
      { day: "목", time: "10:00~19:00" },
      { day: "금", time: "10:00~19:00" },
      { day: "토", time: "10:00~14:00" },
      { day: "일", time: "휴진", closed: true },
    ],
    isOpen: true,
    distance: "0.7km",
    maxFee: 25000,
    kakaoChannel: "https://pf.kakao.com/leedsvet",
    bookable: true,
    matchScore: 88,
    matchReason: "정형외과·재활 2개 전문과 보유",
    reviews: [
      {
        id: "r6",
        petName: "땅콩",
        petBreed: "닥스훈트",
        condition: "디스크 수술 후 재활",
        rating: 5,
        text: "디스크 수술 후 걷지 못하던 아이가 4주 만에 다시 걷게 되었어요. 선생님이 너무 열심히 봐주셨습니다.",
        date: "2025.04.01",
        helpful: 22,
      },
    ],
  },
  {
    id: "c4",
    name: "파리스동물병원",
    district: "서울 양천구",
    address: "서울 양천구 목동로 303",
    phone: "02-2642-3335",
    rating: 4.6,
    reviewCount: 71,
    revisitRate: 100,
    specialties: ["내과", "중성화수술"],
    hours: "10:00~21:00",
    detailedHours: [
      { day: "월", time: "10:00~21:00" },
      { day: "화", time: "10:00~21:00" },
      { day: "수", time: "10:00~21:00" },
      { day: "목", time: "10:00~21:00" },
      { day: "금", time: "10:00~21:00" },
      { day: "토", time: "10:00~18:00" },
      { day: "일", time: "10:00~15:00" },
    ],
    isOpen: true,
    distance: "0.8km",
    maxFee: 25000,
    kakaoChannel: "https://pf.kakao.com/parisvet",
    bookable: true,
    matchScore: 72,
    matchReason: "내과 전문 · 수술 후 컨디션 관리 가능",
    reviews: [
      {
        id: "r7",
        petName: "하루",
        petBreed: "푸들",
        condition: "정기 건강검진",
        rating: 4,
        text: "평일 저녁 늦게도 진료가 되어서 직장인 보호자에게 최고예요. 대기는 좀 있지만 진료는 꼼꼼합니다.",
        date: "2025.02.14",
        helpful: 18,
      },
    ],
  },
  {
    id: "c5",
    name: "해성동물병원",
    district: "서울 양천구",
    address: "서울 양천구 오목로 123",
    phone: "02-2645-1004",
    rating: 5.0,
    reviewCount: 0,
    revisitRate: 100,
    specialties: ["정형외과", "재활", "피부과"],
    hours: "09:30~19:00",
    detailedHours: [
      { day: "월", time: "09:30~19:00" },
      { day: "화", time: "09:30~19:00" },
      { day: "수", time: "09:30~19:00" },
      { day: "목", time: "09:30~19:00" },
      { day: "금", time: "09:30~19:00" },
      { day: "토", time: "09:30~14:00" },
      { day: "일", time: "휴진", closed: true },
    ],
    isOpen: true,
    distance: "1.3km",
    maxFee: 25000,
    kakaoChannel: "https://pf.kakao.com/haeseong",
    bookable: false,
    matchScore: 94,
    matchReason: "정형외과·재활·피부과 복합 전문 케어",
    reviews: [],
  },
  {
    id: "c6",
    name: "골멧동물병원목동점",
    district: "서울 양천구",
    address: "서울 양천구 목동서로 51",
    phone: "02-2644-8275",
    rating: 4.9,
    reviewCount: 13,
    revisitRate: 100,
    specialties: ["건강검진", "중성화수술", "내과"],
    hours: "10:00~20:00",
    detailedHours: [
      { day: "월", time: "10:00~20:00" },
      { day: "화", time: "10:00~20:00" },
      { day: "수", time: "10:00~20:00" },
      { day: "목", time: "10:00~20:00" },
      { day: "금", time: "10:00~20:00" },
      { day: "토", time: "10:00~17:00" },
      { day: "일", time: "10:00~14:00" },
    ],
    isOpen: true,
    distance: "0.2km",
    maxFee: 25000,
    kakaoChannel: "https://pf.kakao.com/goelmet",
    bookable: true,
    matchScore: 68,
    matchReason: "종합 건강 관리 · 수술 후 전신 컨디션 점검",
    reviews: [
      {
        id: "r8",
        petName: "복실이",
        petBreed: "진돗개",
        condition: "정기 건강검진",
        rating: 5,
        text: "체인 병원이라 시설이 깔끔하고 의료진이 친절해요. 건강검진 패키지가 합리적입니다.",
        date: "2025.01.20",
        helpful: 7,
      },
    ],
  },
  {
    id: "c7",
    name: "상아동물병원",
    district: "서울 양천구",
    address: "서울 양천구 신월로 388",
    phone: "02-2696-7585",
    rating: 5.0,
    reviewCount: 13,
    revisitRate: 90,
    specialties: ["정형외과", "재활", "건강검진"],
    hours: "10:00~21:00",
    detailedHours: [
      { day: "월", time: "10:00~21:00" },
      { day: "화", time: "10:00~21:00" },
      { day: "수", time: "10:00~21:00" },
      { day: "목", time: "10:00~21:00" },
      { day: "금", time: "10:00~21:00" },
      { day: "토", time: "10:00~17:00" },
      { day: "일", time: "휴진", closed: true },
    ],
    isOpen: true,
    distance: "0.7km",
    maxFee: 25000,
    kakaoChannel: "https://pf.kakao.com/sanga",
    bookable: true,
    matchScore: 90,
    matchReason: "정형외과·재활 전문 + 야간 진료 가능",
    reviews: [
      {
        id: "r9",
        petName: "몽이",
        petBreed: "보더콜리",
        condition: "슬관절 수술 후 재활",
        rating: 5,
        text: "밤늦게도 진료가 돼서 정말 도움이 많이 됐어요. 재활 치료 계획도 체계적으로 잡아주셨습니다.",
        date: "2025.04.08",
        helpful: 11,
      },
    ],
  },
  {
    id: "c8",
    name: "24시 로운동물의료센터",
    district: "서울 양천구",
    address: "서울 양천구 목동동로 88",
    phone: "02-2654-2475",
    rating: 4.7,
    reviewCount: 109,
    revisitRate: 90,
    specialties: ["정형외과", "재활", "내과", "치과", "건강검진"],
    hours: "24시간",
    detailedHours: [
      { day: "월", time: "24시간" },
      { day: "화", time: "24시간" },
      { day: "수", time: "24시간" },
      { day: "목", time: "24시간" },
      { day: "금", time: "24시간" },
      { day: "토", time: "24시간" },
      { day: "일", time: "24시간" },
    ],
    isOpen: true,
    distance: "1.1km",
    maxFee: 25000,
    kakaoChannel: "https://pf.kakao.com/rowun24",
    bookable: true,
    recommended: true,
    matchScore: 95,
    matchReason: "5개 전문과 + 24시간 응급 대응 가능",
    reviews: [
      {
        id: "r10",
        petName: "별이",
        petBreed: "라브라도",
        condition: "고관절 수술 후 재활",
        rating: 5,
        text: "24시간 운영이라 갑작스러운 상황에도 믿고 갈 수 있어요. Petti 리포트를 미리 전송했더니 원장님이 이미 검토해두셨더라고요. 진료 시간을 훨씬 효율적으로 쓸 수 있었습니다.",
        date: "2025.04.12",
        helpful: 34,
      },
      {
        id: "r11",
        petName: "두부",
        petBreed: "비글",
        condition: "전방십자인대 수술",
        rating: 5,
        text: "수술 전날 밤에 다리를 저는 게 심해져서 응급으로 갔는데 바로 처치해주셨어요. 수술도 잘 되어서 지금은 잘 뛰어놀아요.",
        date: "2025.03.22",
        helpful: 28,
      },
      {
        id: "r12",
        petName: "나비",
        petBreed: "페키니즈",
        condition: "디스크 내과 치료",
        rating: 4,
        text: "야간에 갑자기 뒷다리를 못 쓰게 되어서 방문했어요. 신속하게 처치해주셨고 입원 중 매일 상태를 문자로 알려줘서 안심이 됐습니다.",
        date: "2025.02.28",
        helpful: 19,
      },
    ],
  },
];

export const SPECIALTY_FILTERS: { key: Specialty | "전체"; label: string }[] = [
  { key: "전체", label: "전체" },
  { key: "정형외과", label: "정형외과" },
  { key: "재활", label: "재활" },
  { key: "피부과", label: "피부과" },
  { key: "건강검진", label: "건강검진" },
  { key: "중성화수술", label: "중성화수술" },
  { key: "내과", label: "내과" },
];

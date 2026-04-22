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
  { id: "11", name: "서울 동물병원", address: "서울 종로구 종로" },
  { id: "12", name: "미래 동물병원", address: "서울 동작구 사당로" },
  { id: "13", name: "우리 동물병원", address: "경기 수원시 영통구" },
  { id: "14", name: "더 케어 동물병원", address: "서울 강북구 수유로" },
  { id: "15", name: "닥터펫 동물병원", address: "경기 의정부시 의정부로" },
  { id: "16", name: "펫플러스 동물병원", address: "인천 남동구 구월로" },
  { id: "17", name: "희망 동물병원", address: "서울 은평구 연서로" },
  { id: "18", name: "온누리 동물병원", address: "경기 부천시 부천로" },
  { id: "19", name: "파란 동물병원", address: "서울 광진구 뚝섬로" },
  { id: "20", name: "별빛 동물병원", address: "경기 안양시 만안구" },
];

export function searchHospitals(query: string): Hospital[] {
  if (!query.trim()) return [];
  const q = query.trim().toLowerCase();
  return MOCK_HOSPITALS.filter(
    (h) =>
      h.name.toLowerCase().includes(q) ||
      h.address.toLowerCase().includes(q)
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

export interface ConsultHospital {
  id: string;
  name: string;
  district: string;
  address: string;
  rating: number;
  reviewCount: number;
  revisitRate: number;
  specialties: Specialty[];
  hours: string;
  isOpen: boolean;
  distance: string;
  maxFee: number;
  kakaoChannel: string;
  bookable: boolean;
  recommended?: boolean;
}

export const CONSULT_HOSPITALS: ConsultHospital[] = [
  {
    id: "c1",
    name: "다터펫동물병원",
    district: "서울 양천구",
    address: "서울 양천구 목동중앙로",
    rating: 4.8,
    reviewCount: 1,
    revisitRate: 100,
    specialties: ["정형외과", "피부과", "중성화수술"],
    hours: "수요일 휴무",
    isOpen: false,
    distance: "0.3km",
    maxFee: 25000,
    kakaoChannel: "https://pf.kakao.com/datervet",
    bookable: true,
    recommended: true,
  },
  {
    id: "c2",
    name: "정말로동물병원",
    district: "서울 양천구",
    address: "서울 양천구 신정이펜1로",
    rating: 4.6,
    reviewCount: 14,
    revisitRate: 100,
    specialties: ["정형외과", "재활", "중성화수술", "건강검진"],
    hours: "10:00~20:00",
    isOpen: true,
    distance: "3.0km",
    maxFee: 25000,
    kakaoChannel: "https://pf.kakao.com/jungmallo",
    bookable: true,
  },
  {
    id: "c3",
    name: "리즈동물병원",
    district: "서울 양천구",
    address: "서울 양천구 목동동로",
    rating: 4.6,
    reviewCount: 2,
    revisitRate: 90,
    specialties: ["정형외과", "재활"],
    hours: "10:00~19:00",
    isOpen: true,
    distance: "0.7km",
    maxFee: 25000,
    kakaoChannel: "https://pf.kakao.com/leedsvet",
    bookable: true,
  },
  {
    id: "c4",
    name: "파리스동물병원",
    district: "서울 양천구",
    address: "서울 양천구 목동로",
    rating: 4.6,
    reviewCount: 71,
    revisitRate: 100,
    specialties: ["내과", "중성화수술"],
    hours: "10:00~21:00",
    isOpen: true,
    distance: "0.8km",
    maxFee: 25000,
    kakaoChannel: "https://pf.kakao.com/parisvet",
    bookable: true,
  },
  {
    id: "c5",
    name: "해성동물병원",
    district: "서울 양천구",
    address: "서울 양천구 오목로",
    rating: 5.0,
    reviewCount: 0,
    revisitRate: 100,
    specialties: ["정형외과", "재활", "피부과"],
    hours: "09:30~19:00",
    isOpen: true,
    distance: "1.3km",
    maxFee: 25000,
    kakaoChannel: "https://pf.kakao.com/haeseong",
    bookable: false,
  },
  {
    id: "c6",
    name: "골멧동물병원목동점",
    district: "서울 양천구",
    address: "서울 양천구 목동서로",
    rating: 4.9,
    reviewCount: 13,
    revisitRate: 100,
    specialties: ["건강검진", "중성화수술", "내과"],
    hours: "10:00~20:00",
    isOpen: true,
    distance: "0.2km",
    maxFee: 25000,
    kakaoChannel: "https://pf.kakao.com/goelmet",
    bookable: true,
  },
  {
    id: "c7",
    name: "상아동물병원",
    district: "서울 양천구",
    address: "서울 양천구 신월로",
    rating: 5.0,
    reviewCount: 13,
    revisitRate: 90,
    specialties: ["정형외과", "재활", "건강검진"],
    hours: "10:00~21:00",
    isOpen: true,
    distance: "0.7km",
    maxFee: 25000,
    kakaoChannel: "https://pf.kakao.com/sanga",
    bookable: true,
  },
  {
    id: "c8",
    name: "24시 로운동물의료센터",
    district: "서울 양천구",
    address: "서울 양천구 목동동로",
    rating: 4.7,
    reviewCount: 109,
    revisitRate: 90,
    specialties: ["정형외과", "재활", "내과", "치과", "건강검진"],
    hours: "24시간",
    isOpen: true,
    distance: "1.1km",
    maxFee: 25000,
    kakaoChannel: "https://pf.kakao.com/rowun24",
    bookable: true,
    recommended: true,
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

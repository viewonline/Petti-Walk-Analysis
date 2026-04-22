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

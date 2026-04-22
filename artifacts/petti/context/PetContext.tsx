import React, { createContext, useContext, useState } from "react";

export interface PetInfo {
  name: string;
  breed: string;
  gender: "수컷" | "암컷" | "";
  neutered: "했음" | "안했음" | "";
  age: string;
  weight: string;
  owner: string;
  hospital: string;
}

const DEFAULT_PET: PetInfo = {
  name: "올리버",
  breed: "골든 리트리버",
  gender: "수컷",
  neutered: "했음",
  age: "6",
  weight: "28.5",
  owner: "김민준",
  hospital: "행복 동물병원",
};

interface PetContextValue {
  petInfo: PetInfo;
  setPetInfo: (info: PetInfo) => void;
}

const PetContext = createContext<PetContextValue>({
  petInfo: DEFAULT_PET,
  setPetInfo: () => {},
});

export function PetProvider({ children }: { children: React.ReactNode }) {
  const [petInfo, setPetInfo] = useState<PetInfo>(DEFAULT_PET);
  return (
    <PetContext.Provider value={{ petInfo, setPetInfo }}>
      {children}
    </PetContext.Provider>
  );
}

export function usePet() {
  return useContext(PetContext);
}

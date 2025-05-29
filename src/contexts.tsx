import { createContext, useContext } from "react";

type SelectedFarmContextType = [
  farm: string | null,
  setFarm: (farm: string | null) => void
]

export const SelectedFarmContext = createContext<SelectedFarmContextType | null>(null);

export function useSelectedFarmContext() {
  const context = useContext(SelectedFarmContext);
  if (context === null) {
    throw new Error("useSelectedFarmContext must be used within a SelectedFarmContext");
  }
  return context;
}
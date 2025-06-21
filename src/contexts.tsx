import { createContext, useContext } from "react";
import type { IRecursiveFarm } from "./models";

type SelectedFarmContextType = [
  farm: string | null,
  setFarm: (farm: string | null) => void
];

export const SelectedFarmContext =
  createContext<SelectedFarmContextType | null>(null);

export function useSelectedFarmContext() {
  const context = useContext(SelectedFarmContext);
  if (context === null) {
    throw new Error(
      "useSelectedFarmContext must be used within a SelectedFarmContext"
    );
  }
  return context;
}

interface FarmContextValue {
  farms: IRecursiveFarm[];
  loading: boolean;
}

export const FarmContext = createContext<FarmContextValue>({
  farms: [],
  loading: true,
});

export function useFarms() {
  const context = useContext(FarmContext);
  if (!context)
    throw new Error("useFarms must be using with FarmContext provider");
  return context;
}

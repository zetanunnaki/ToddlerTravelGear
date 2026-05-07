"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { TripType } from "@/data/trip-type-items";

interface PackingListContextValue {
  tripType: TripType;
  setTripType: (t: TripType) => void;
}

const PackingListContext = createContext<PackingListContextValue>({
  tripType: "all",
  setTripType: () => {},
});

const STORAGE_KEY = "ttg-trip-type";

export function PackingListProvider({ children }: { children: ReactNode }) {
  const [tripType, setTripTypeState] = useState<TripType>("all");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setTripTypeState(saved as TripType);
    } catch {}
  }, []);

  const setTripType = useCallback((t: TripType) => {
    setTripTypeState(t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {}
  }, []);

  return (
    <PackingListContext.Provider value={{ tripType, setTripType }}>
      {children}
    </PackingListContext.Provider>
  );
}

export function useTripType() {
  return useContext(PackingListContext);
}

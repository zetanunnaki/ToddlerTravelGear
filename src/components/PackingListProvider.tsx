"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { TripType } from "@/data/trip-type-items";

export const AGE_RANGES = ["0–12 Months", "1–2 Years", "2–4 Years"] as const;
export type AgeRange = (typeof AGE_RANGES)[number];

interface PackingListContextValue {
  tripType: TripType;
  setTripType: (t: TripType) => void;
  ageRange: AgeRange;
  setAgeRange: (a: AgeRange) => void;
}

const PackingListContext = createContext<PackingListContextValue>({
  tripType: "all",
  setTripType: () => {},
  ageRange: "0–12 Months",
  setAgeRange: () => {},
});

const TRIP_KEY = "ttg-trip-type";
const AGE_KEY = "ttg-age-range";

export function PackingListProvider({ children }: { children: ReactNode }) {
  const [tripType, setTripTypeState] = useState<TripType>("all");
  const [ageRange, setAgeRangeState] = useState<AgeRange>("0–12 Months");

  useEffect(() => {
    try {
      const savedTrip = localStorage.getItem(TRIP_KEY);
      if (savedTrip) setTripTypeState(savedTrip as TripType);
      const savedAge = localStorage.getItem(AGE_KEY);
      if (savedAge && AGE_RANGES.includes(savedAge as AgeRange)) {
        setAgeRangeState(savedAge as AgeRange);
      }
    } catch {}
  }, []);

  const setTripType = useCallback((t: TripType) => {
    setTripTypeState(t);
    try { localStorage.setItem(TRIP_KEY, t); } catch {}
  }, []);

  const setAgeRange = useCallback((a: AgeRange) => {
    setAgeRangeState(a);
    try { localStorage.setItem(AGE_KEY, a); } catch {}
  }, []);

  return (
    <PackingListContext.Provider value={{ tripType, setTripType, ageRange, setAgeRange }}>
      {children}
    </PackingListContext.Provider>
  );
}

export function usePackingList() {
  return useContext(PackingListContext);
}

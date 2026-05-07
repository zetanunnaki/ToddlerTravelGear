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

function ageSlug(ageRange: string) {
  return `${ageRange.replace(/\s+/g, "-").toLowerCase()}`;
}

function toBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  bytes.forEach(b => binary += String.fromCharCode(b));
  return btoa(binary);
}

function fromBase64(encoded: string): string {
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

export function encodeShareState(ageRange: string, tripType: string): string {
  const ageIdx = AGE_RANGES.indexOf(ageRange as AgeRange);
  let checked: number[] = [];
  let custom: string[] = [];
  try {
    const sc = localStorage.getItem(`ttg-checklist-${ageSlug(ageRange)}`);
    if (sc) checked = JSON.parse(sc);
    const sx = localStorage.getItem(`ttg-custom-${ageSlug(ageRange)}`);
    if (sx) custom = JSON.parse(sx);
  } catch {}
  const json = JSON.stringify({ a: ageIdx, t: tripType, c: checked, x: custom });
  return toBase64(json);
}

function decodeShareState(encoded: string) {
  try {
    const json = fromBase64(encoded);
    const data = JSON.parse(json);
    const age = AGE_RANGES[data.a] ?? AGE_RANGES[0];
    const slug = ageSlug(age);
    if (Array.isArray(data.c)) {
      localStorage.setItem(`ttg-checklist-${slug}`, JSON.stringify(data.c));
    }
    if (Array.isArray(data.x) && data.x.length > 0) {
      localStorage.setItem(`ttg-custom-${slug}`, JSON.stringify(data.x));
    }
    if (data.t) localStorage.setItem(TRIP_KEY, data.t);
    localStorage.setItem(AGE_KEY, age);
    window.history.replaceState({}, "", window.location.pathname);
  } catch {}
}

if (typeof window !== "undefined") {
  const params = new URLSearchParams(window.location.search);
  const shared = params.get("s");
  if (shared) decodeShareState(shared);
}

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

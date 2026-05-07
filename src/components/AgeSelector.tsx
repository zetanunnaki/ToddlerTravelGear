"use client";

import { usePackingList, AGE_RANGES, type AgeRange } from "@/components/PackingListProvider";

const AGE_OPTIONS: { value: AgeRange; label: string; subtitle: string }[] = [
  { value: "0–12 Months", label: "0–12 mo", subtitle: "The Baby Bag" },
  { value: "1–2 Years", label: "1–2 yr", subtitle: "The Tornado Kit" },
  { value: "2–4 Years", label: "2–4 yr", subtitle: "The Independent Traveler" },
];

export function AgeSelector() {
  const { ageRange, setAgeRange } = usePackingList();

  return (
    <div className="grid grid-cols-3 gap-2 mb-4">
      {AGE_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setAgeRange(opt.value)}
          className={`flex flex-col items-center px-2 py-3 rounded-xl text-sm font-semibold border-2 transition-colors min-h-[52px] ${
            ageRange === opt.value
              ? "bg-teal-600 text-white border-teal-600"
              : "bg-white text-gray-600 border-gray-200 hover:border-teal-400 hover:text-teal-700"
          }`}
        >
          <span>{opt.label}</span>
          <span className={`text-[10px] font-normal leading-tight ${ageRange === opt.value ? "text-teal-100" : "text-gray-400"}`}>
            {opt.subtitle}
          </span>
        </button>
      ))}
    </div>
  );
}

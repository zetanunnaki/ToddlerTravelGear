"use client";

import { usePackingList, type AgeRange } from "@/components/PackingListProvider";

const AGE_OPTIONS: { value: AgeRange; label: string; subtitle: string; icon: string }[] = [
  { value: "0–12 Months", label: "0–12 mo", subtitle: "Baby Bag", icon: "👶" },
  { value: "1–2 Years", label: "1–2 yr", subtitle: "Tornado Kit", icon: "🌪️" },
  { value: "2–4 Years", label: "2–4 yr", subtitle: "Independent", icon: "🎒" },
];

export function AgeSelector() {
  const { ageRange, setAgeRange } = usePackingList();

  return (
    <div className="grid grid-cols-3 gap-2 mb-4">
      {AGE_OPTIONS.map((opt) => {
        const active = ageRange === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => setAgeRange(opt.value)}
            className={`flex flex-col items-center gap-0.5 px-2 py-3 rounded-xl text-sm font-semibold border-2 transition-all duration-200 min-h-[56px] active:scale-[0.96] ${
              active
                ? "bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-200"
                : "bg-white text-gray-600 border-gray-200 hover:border-teal-300 hover:text-teal-700 hover:shadow-sm"
            }`}
          >
            <span className="text-base leading-none">{opt.icon}</span>
            <span className="text-xs font-bold">{opt.label}</span>
            <span className={`text-[10px] font-normal leading-tight ${active ? "text-teal-100" : "text-gray-400"}`}>
              {opt.subtitle}
            </span>
          </button>
        );
      })}
    </div>
  );
}

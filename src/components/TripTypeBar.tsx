"use client";

import { usePackingList } from "@/components/PackingListProvider";
import { TRIP_TYPES, type TripType } from "@/data/trip-type-items";

const OPTIONS: { value: TripType; label: string; icon: string }[] = [
  { value: "all", label: "All Items", icon: "\u{1F4CB}" },
  ...Object.entries(TRIP_TYPES).map(([key, config]) => ({
    value: key as TripType,
    label: config.label,
    icon: config.icon,
  })),
];

export function TripTypeBar() {
  const { tripType, setTripType } = usePackingList();

  return (
    <div className="grid grid-cols-3 gap-2 mb-6">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setTripType(opt.value)}
          className={`flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors min-h-[44px] ${
            tripType === opt.value
              ? "bg-teal-600 text-white border-teal-600"
              : "bg-white text-gray-600 border-gray-200 hover:border-teal-400 hover:text-teal-700"
          }`}
        >
          <span>{opt.icon}</span>
          {opt.label}
        </button>
      ))}
    </div>
  );
}

"use client";

import { usePackingList } from "@/components/PackingListProvider";
import { TRIP_TYPES, type TripType } from "@/data/trip-type-items";

const OPTIONS: { value: TripType; label: string; icon: string }[] = [
  { value: "all", label: "All Items", icon: "📋" },
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
      {OPTIONS.map((opt) => {
        const active = tripType === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => setTripType(opt.value)}
            className={`flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 min-h-[44px] active:scale-[0.96] ${
              active
                ? "bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-200"
                : "bg-white text-gray-600 border-gray-200 hover:border-teal-300 hover:text-teal-700 hover:shadow-sm"
            }`}
          >
            <span>{opt.icon}</span>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

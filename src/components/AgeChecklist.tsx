"use client";

import { useState, useEffect, useCallback } from "react";
import { PACKING_LIST_ITEMS } from "@/data/packing-list-items";
import { usePackingList } from "@/components/PackingListProvider";
import { TRIP_TYPES, type TripType } from "@/data/trip-type-items";

interface AgeChecklistProps {
  ageRange?: string;
  items?: string[];
}

const CATEGORIES: Record<string, string[]> = {
  "Diapering & Toileting": ["diaper", "wipe", "pull-up", "potty", "changing pad", "diaper cream", "training pants", "underwear"],
  "Feeding & Snacks": ["formula", "bottle", "nursing", "breast", "food", "snack", "sippy", "cup", "bib", "spoon", "water bottle"],
  "Sleep & Comfort": ["crib", "bassinet", "sleep sack", "swaddle", "blanket", "pillow", "lovey", "stuffed", "comfort", "white noise", "monitor", "pajama", "noise machine"],
  "Safety & Health": ["medicine", "tylenol", "motrin", "thermometer", "first aid", "band-aid", "saline", "nasal", "teething", "prescription", "insurance", "pediatrician", "sunscreen", "outlet", "cabinet lock", "hand sanitizer", "allergy"],
  "Clothing & Shoes": ["outfit", "clothes", "shoes", "jacket", "fleece", "hat", "layer", "warm", "rain", "swim", "sneaker", "sandal"],
  "Gear & Transport": ["car seat", "stroller", "carrier", "wrap"],
  "Entertainment & Activities": ["toy", "book", "tablet", "headphone", "sticker", "crayon", "coloring", "play-doh", "figurine", "audiobook", "podcast", "pad", "backpack"],
  "Organization & Misc": ["plastic bag", "packing cube", "organizer", "document"],
};

function categorizeItem(item: string): string {
  const lower = item.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORIES)) {
    if (keywords.some(kw => lower.includes(kw))) return category;
  }
  return "Organization & Misc";
}

const CATEGORY_ICONS: Record<string, string> = {
  "Diapering & Toileting": "🚼",
  "Feeding & Snacks": "🍼",
  "Sleep & Comfort": "🌙",
  "Safety & Health": "⚕️",
  "Clothing & Shoes": "👕",
  "Gear & Transport": "🚗",
  "Entertainment & Activities": "🎨",
  "Organization & Misc": "🏷️",
};

function renderItemText(text: string) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (match) {
      return (
        <a key={i} href={match[2]} className="text-teal-600 underline underline-offset-2 hover:text-teal-800 transition-colors">
          {match[1]}
        </a>
      );
    }
    return part;
  });
}

function shouldDimItem(text: string, tripType: TripType): boolean {
  if (tripType === "all") return false;
  const config = TRIP_TYPES[tripType];
  if (!config) return false;
  const lower = text.toLowerCase();
  return config.dim.some(pattern => lower.includes(pattern));
}

function getStorageKey(ageRange: string) {
  return `ttg-checklist-${ageRange.replace(/\s+/g, "-").toLowerCase()}`;
}

function getCustomItemsKey(ageRange: string) {
  return `ttg-custom-${ageRange.replace(/\s+/g, "-").toLowerCase()}`;
}

function getSectionId(ageRange: string) {
  return `checklist-${ageRange.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase()}`;
}

export function AgeChecklist({ ageRange: ageRangeProp, items }: AgeChecklistProps) {
  const { tripType, ageRange: ageRangeCtx } = usePackingList();
  const ageRange = ageRangeProp || ageRangeCtx;

  const baseItems = items && items.length > 0 ? items : PACKING_LIST_ITEMS[ageRange] ?? [];

  const tripExtras: string[] =
    tripType !== "all" && TRIP_TYPES[tripType]?.add[ageRange]
      ? TRIP_TYPES[tripType].add[ageRange]!
      : [];
  const tripExtraStartIndex = baseItems.length;

  const [customItems, setCustomItems] = useState<string[]>([]);
  const [newItemText, setNewItemText] = useState("");
  const customStartIndex = baseItems.length + tripExtras.length;

  const resolvedItems = [...baseItems, ...tripExtras, ...customItems];

  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [loaded, setLoaded] = useState(false);
  const [showByCategory, setShowByCategory] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(getStorageKey(ageRange));
      if (saved) {
        setChecked(new Set(JSON.parse(saved)));
      } else {
        setChecked(new Set());
      }
    } catch {
      setChecked(new Set());
    }
    try {
      const savedCustom = localStorage.getItem(getCustomItemsKey(ageRange));
      if (savedCustom) setCustomItems(JSON.parse(savedCustom));
      else setCustomItems([]);
    } catch {
      setCustomItems([]);
    }
    setLoaded(true);
  }, [ageRange]);

  const persist = useCallback((next: Set<number>) => {
    try {
      localStorage.setItem(getStorageKey(ageRange), JSON.stringify([...next]));
    } catch {}
  }, [ageRange]);

  const persistCustomItems = useCallback((items: string[]) => {
    try {
      localStorage.setItem(getCustomItemsKey(ageRange), JSON.stringify(items));
    } catch {}
  }, [ageRange]);

  if (baseItems.length === 0 && tripExtras.length === 0 && customItems.length === 0) return null;

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      persist(next);
      return next;
    });
  };

  const clearAll = () => {
    const empty = new Set<number>();
    setChecked(empty);
    persist(empty);
    setShowResetConfirm(false);
  };

  const addCustomItem = () => {
    const text = newItemText.trim();
    if (!text) return;
    const next = [...customItems, text];
    setCustomItems(next);
    persistCustomItems(next);
    setNewItemText("");
  };

  const removeCustomItem = (customIndex: number) => {
    const next = customItems.filter((_, i) => i !== customIndex);
    setCustomItems(next);
    persistCustomItems(next);
    setChecked((prev) => {
      const removedGlobalIndex = customStartIndex + customIndex;
      const updated = new Set<number>();
      for (const idx of prev) {
        if (idx === removedGlobalIndex) continue;
        if (idx > removedGlobalIndex) updated.add(idx - 1);
        else updated.add(idx);
      }
      persist(updated);
      return updated;
    });
  };

  const progress = resolvedItems.length > 0 ? Math.round((checked.size / resolvedItems.length) * 100) : 0;

  const categorized = resolvedItems.reduce<Record<string, { item: string; index: number }[]>>((acc, item, i) => {
    const cat = categorizeItem(item);
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push({ item, index: i });
    return acc;
  }, {});

  const categoryOrder = Object.keys(CATEGORIES).filter(c => categorized[c]);

  const renderItem = (item: string, i: number) => {
    const isTripExtra = i >= tripExtraStartIndex && i < customStartIndex;
    const isCustom = i >= customStartIndex;
    const isDimmed = !isTripExtra && !isCustom && shouldDimItem(item, tripType);
    const isChecked = checked.has(i);

    return (
      <li key={i} className="group list-none m-0 p-0">
        <label
          className={`flex items-start gap-3 cursor-pointer py-3 sm:py-2 px-3 -mx-1 rounded-lg transition-all duration-150 select-none ${
            isTripExtra
              ? "bg-teal-50 border-l-3 border-teal-400 ml-0 pl-3"
              : isCustom
              ? "border-l-2 border-dotted border-gray-300 ml-0 pl-3"
              : isChecked
              ? "bg-gray-50/50"
              : "hover:bg-gray-50 active:bg-teal-50"
          } ${isDimmed ? "opacity-35" : ""}`}
        >
          <span className={`relative flex-shrink-0 w-6 h-6 mt-0 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${
            isChecked
              ? "bg-teal-600 border-teal-600 scale-100"
              : "bg-white border-gray-300 hover:border-teal-400"
          }`}>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => toggle(i)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {isChecked && (
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </span>
          <span
            className={`text-sm leading-relaxed transition-all duration-200 flex-1 ${
              isChecked
                ? "line-through text-gray-400"
                : isDimmed
                ? "line-through text-gray-400"
                : "text-gray-700"
            }`}
          >
            {renderItemText(item)}
            {isTripExtra && tripType !== "all" && (
              <span className="ml-2 inline-block text-[10px] font-semibold uppercase tracking-wide text-teal-700 bg-teal-100 px-1.5 py-0.5 rounded">
                {TRIP_TYPES[tripType].label}
              </span>
            )}
          </span>
          {isCustom && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeCustomItem(i - customStartIndex);
              }}
              className="text-gray-400 hover:text-red-500 active:text-red-600 transition-all duration-150 sm:opacity-0 sm:group-hover:opacity-100 flex-shrink-0 print:hidden p-1.5 -mr-1 min-w-[32px] min-h-[32px] rounded-full hover:bg-red-50 active:bg-red-100 flex items-center justify-center"
              aria-label={`Remove custom item: ${item}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </label>
      </li>
    );
  };

  const sectionId = getSectionId(ageRange);

  const tripSubtitle =
    tripType !== "all" && tripExtras.length > 0
      ? `${TRIP_TYPES[tripType].icon} ${TRIP_TYPES[tripType].label} mode — ${tripExtras.length} added`
      : tripType !== "all"
      ? `${TRIP_TYPES[tripType].icon} ${TRIP_TYPES[tripType].label} mode`
      : null;

  return (
    <div id={sectionId} className="not-prose border-2 border-teal-200 rounded-2xl my-8 bg-white shadow-sm print:border print:border-gray-300 print:shadow-none overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-b from-teal-50 to-white px-4 sm:px-5 py-4 border-b border-teal-100 print:bg-white">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 print:text-base">
              {CATEGORY_ICONS["Gear & Transport"]} {ageRange}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {checked.size} of {resolvedItems.length} packed
              {tripSubtitle && (
                <span className="ml-2 text-teal-600 font-medium">{tripSubtitle}</span>
              )}
            </p>
          </div>
          {showResetConfirm ? (
            <div className="flex items-center gap-1.5 flex-shrink-0 print:hidden">
              <button
                onClick={clearAll}
                className="text-xs font-semibold text-white bg-red-500 px-3 py-2 rounded-lg hover:bg-red-600 active:scale-[0.96] transition-all duration-150 min-h-[36px]"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="text-xs font-medium text-gray-500 bg-white border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 active:scale-[0.96] transition-all duration-150 min-h-[36px]"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => checked.size > 0 ? setShowResetConfirm(true) : undefined}
              disabled={checked.size === 0}
              className="text-xs font-medium text-gray-500 bg-white border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 active:scale-[0.96] transition-all duration-150 flex-shrink-0 min-h-[36px] disabled:opacity-30 disabled:cursor-not-allowed print:hidden"
            >
              Reset
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-3 print:hidden">
          <div
            className="w-full bg-gray-200 rounded-full h-3 overflow-hidden"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Packing progress: ${checked.size} of ${resolvedItems.length} items packed`}
          >
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                progress === 100 ? "bg-emerald-500" : "bg-teal-500"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          {progress === 100 && (
            <p className="text-sm font-semibold text-emerald-600 mt-2 text-center animate-pulse">
              🎉 All packed! You are ready to go!
            </p>
          )}
        </div>

        {/* View toggle */}
        <div className="flex gap-2 mt-3 print:hidden">
          <button
            onClick={() => setShowByCategory(true)}
            className={`text-sm px-4 py-2 rounded-full transition-all duration-200 min-h-[40px] active:scale-[0.96] ${
              showByCategory
                ? "bg-teal-600 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            By Category
          </button>
          <button
            onClick={() => setShowByCategory(false)}
            className={`text-sm px-4 py-2 rounded-full transition-all duration-200 min-h-[40px] active:scale-[0.96] ${
              !showByCategory
                ? "bg-teal-600 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Full List
          </button>
        </div>
      </div>

      {/* Items */}
      <div className="px-4 sm:px-5 py-4">
        {loaded ? (
          showByCategory ? (
            <div className="space-y-6">
              {categoryOrder.map(cat => {
                const catItems = categorized[cat];
                const catChecked = catItems.filter(ci => checked.has(ci.index)).length;
                const catDone = catChecked === catItems.length;
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`text-sm font-semibold print:text-xs transition-colors duration-200 ${catDone ? "text-emerald-600" : "text-gray-800"}`}>
                        {CATEGORY_ICONS[cat] || ""} {cat}
                        {catDone && " ✓"}
                      </h4>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full print:hidden transition-all duration-300 ${
                        catDone
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {catChecked}/{catItems.length}
                      </span>
                    </div>
                    <ul className="list-none p-0 m-0 space-y-0 print:space-y-0">
                      {catItems.map(ci => renderItem(ci.item, ci.index))}
                    </ul>
                  </div>
                );
              })}
            </div>
          ) : (
            <ul className="list-none p-0 m-0 space-y-0 print:space-y-0">
              {resolvedItems.map((item, i) => renderItem(item, i))}
            </ul>
          )
        ) : (
          <div className="text-center py-12 text-gray-400 text-sm">Loading your checklist...</div>
        )}
      </div>

      {/* Custom item input */}
      <div className="px-4 sm:px-5 pb-4 print:hidden">
        <div className="flex gap-2">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustomItem();
              }
            }}
            placeholder="Add your own item..."
            className="flex-1 text-base sm:text-sm border-2 border-gray-200 rounded-xl px-3 py-3 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-400 placeholder-gray-400 transition-all duration-200"
          />
          <button
            onClick={addCustomItem}
            disabled={!newItemText.trim()}
            className="text-sm font-semibold text-white bg-teal-600 px-5 py-3 sm:py-2.5 rounded-xl hover:bg-teal-700 active:scale-[0.96] transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed min-h-[48px] sm:min-h-0"
          >
            + Add
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-4 sm:px-5 py-3 border-t border-gray-100 print:hidden">
        <p className="text-xs text-gray-400 text-center">
          Your progress saves automatically on this device.
        </p>
      </div>
    </div>
  );
}

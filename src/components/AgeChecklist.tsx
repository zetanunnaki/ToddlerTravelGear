"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { PACKING_LIST_ITEMS } from "@/data/packing-list-items";
import { useTripType } from "@/components/PackingListProvider";
import { TRIP_TYPES, type TripType } from "@/data/trip-type-items";

interface AgeChecklistProps {
  ageRange: string;
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

function printSection(el: HTMLElement, ageRange: string) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map(s => s.outerHTML)
    .join("\n");

  printWindow.document.write(`<!DOCTYPE html><html><head><title>Packing Checklist: ${ageRange}</title>${styles}
    <style>body{padding:24px}@media print{.print\\:hidden{display:none!important}}</style>
    </head><body>${el.outerHTML}</body></html>`);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
}

export function AgeChecklist({ ageRange, items }: AgeChecklistProps) {
  const { tripType } = useTripType();

  // Base items from props or data file
  const baseItems = items && items.length > 0 ? items : PACKING_LIST_ITEMS[ageRange] ?? [];

  // Trip extras: items added by the active trip type
  const tripExtras: string[] =
    tripType !== "all" && TRIP_TYPES[tripType]?.add[ageRange]
      ? TRIP_TYPES[tripType].add[ageRange]!
      : [];
  const tripExtraStartIndex = baseItems.length;

  // Custom items state
  const [customItems, setCustomItems] = useState<string[]>([]);
  const [newItemText, setNewItemText] = useState("");
  const customStartIndex = baseItems.length + tripExtras.length;

  // Combined resolved items
  const resolvedItems = [...baseItems, ...tripExtras, ...customItems];

  const sectionRef = useRef<HTMLDivElement>(null);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [loaded, setLoaded] = useState(false);
  const [showByCategory, setShowByCategory] = useState(true);

  // Load checked state and custom items from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(getStorageKey(ageRange));
      if (saved) setChecked(new Set(JSON.parse(saved)));
    } catch {}
    try {
      const savedCustom = localStorage.getItem(getCustomItemsKey(ageRange));
      if (savedCustom) setCustomItems(JSON.parse(savedCustom));
    } catch {}
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
  };

  const checkAll = () => {
    const all = new Set(resolvedItems.map((_, i) => i));
    setChecked(all);
    persist(all);
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
    // Also remove the checked state for the removed item and shift higher indices
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

    return (
      <li key={i} className="group">
        <label
          className={`flex items-start gap-3 cursor-pointer py-1.5 px-2 -mx-2 rounded-lg transition-colors ${
            isTripExtra
              ? "bg-teal-50 border-l-3 border-teal-400 ml-0 pl-3"
              : isCustom
              ? "border-l-2 border-dotted border-gray-300 ml-0 pl-3"
              : "hover:bg-gray-50"
          } ${isDimmed ? "opacity-35" : ""}`}
        >
          <input
            type="checkbox"
            checked={checked.has(i)}
            onChange={() => toggle(i)}
            className="w-5 h-5 mt-0.5 rounded border-gray-300 text-teal-600 focus:ring-teal-500 flex-shrink-0 print:w-4 print:h-4"
          />
          <span
            className={`text-sm leading-relaxed transition-colors flex-1 ${
              checked.has(i)
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
              className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0 print:hidden"
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

  // Subtitle info for trip mode
  const tripSubtitle =
    tripType !== "all" && tripExtras.length > 0
      ? `${TRIP_TYPES[tripType].icon} ${TRIP_TYPES[tripType].label} mode — ${tripExtras.length} added`
      : tripType !== "all"
      ? `${TRIP_TYPES[tripType].icon} ${TRIP_TYPES[tripType].label} mode`
      : null;

  const handleShare = async () => {
    const url = `${window.location.origin}${window.location.pathname}#${sectionId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Packing Checklist: ${ageRange}`,
          text: `Interactive packing checklist for ${ageRange} — check items off and your progress saves automatically.`,
          url,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied! Save it as a bookmark for quick access on your phone.");
    }
  };

  const handlePrint = () => {
    if (sectionRef.current) printSection(sectionRef.current, ageRange);
  };

  return (
    <div id={sectionId} ref={sectionRef} className="border-2 border-teal-200 rounded-xl my-8 bg-white shadow-sm print:border print:border-gray-300 print:shadow-none">
      {/* Header */}
      <div className="bg-teal-50 px-5 py-4 rounded-t-xl border-b border-teal-100 print:bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900 print:text-base">
              {CATEGORY_ICONS["Gear & Transport"]} Packing Checklist: {ageRange}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {checked.size} of {resolvedItems.length} items packed
              {tripSubtitle && (
                <span className="ml-2 text-teal-600 font-medium">{tripSubtitle}</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handleShare}
              className="text-xs font-medium text-white bg-teal-600 px-3 py-1.5 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Save / Share
            </button>
            <button
              onClick={handlePrint}
              className="text-xs font-medium text-teal-700 bg-white border border-teal-200 px-3 py-1.5 rounded-lg hover:bg-teal-50 transition-colors"
            >
              Print
            </button>
            <button
              onClick={clearAll}
              className="text-xs font-medium text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 print:hidden">
          <div
            className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden"
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
            <p className="text-sm font-semibold text-emerald-600 mt-2 text-center">
              All packed! You are ready to go!
            </p>
          )}
        </div>

        {/* View toggle */}
        <div className="flex gap-2 mt-3 print:hidden">
          <button
            onClick={() => setShowByCategory(true)}
            className={`text-xs px-3 py-1 rounded-full transition-colors ${
              showByCategory
                ? "bg-teal-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            By Category
          </button>
          <button
            onClick={() => setShowByCategory(false)}
            className={`text-xs px-3 py-1 rounded-full transition-colors ${
              !showByCategory
                ? "bg-teal-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Full List
          </button>
        </div>
      </div>

      {/* Items */}
      <div className="p-5">
        {loaded ? (
          showByCategory ? (
            <div className="space-y-6">
              {categoryOrder.map(cat => {
                const catItems = categorized[cat];
                const catChecked = catItems.filter(ci => checked.has(ci.index)).length;
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-800 print:text-xs">
                        {CATEGORY_ICONS[cat] || ""} {cat}
                      </h4>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full print:hidden ${
                        catChecked === catItems.length
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {catChecked}/{catItems.length}
                      </span>
                    </div>
                    <ul className="space-y-0.5 print:space-y-0">
                      {catItems.map(ci => renderItem(ci.item, ci.index))}
                    </ul>
                  </div>
                );
              })}
            </div>
          ) : (
            <ul className="space-y-0.5 print:space-y-0">
              {resolvedItems.map((item, i) => renderItem(item, i))}
            </ul>
          )
        ) : (
          <div className="text-center py-8 text-gray-500 text-sm">Loading your checklist...</div>
        )}
      </div>

      {/* Custom item input */}
      <div className="px-5 pb-4 print:hidden">
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
            className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400"
          />
          <button
            onClick={addCustomItem}
            disabled={!newItemText.trim()}
            className="text-xs font-medium text-white bg-teal-600 px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>

      {/* Footer — save hint */}
      <div className="bg-gray-50 px-5 py-3 rounded-b-xl border-t border-gray-100 print:hidden">
        <p className="text-xs text-gray-500 text-center">
          Your progress saves automatically on this device. Tap <strong>Save / Share</strong> to send this checklist to yourself or a travel partner.
          On iPhone: tap Share then "Add to Home Screen" for instant access like an app.
        </p>
      </div>
    </div>
  );
}

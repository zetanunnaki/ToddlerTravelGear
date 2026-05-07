"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { PACKING_LIST_ITEMS } from "@/data/packing-list-items";

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

function getStorageKey(ageRange: string) {
  return `ttg-checklist-${ageRange.replace(/\s+/g, "-").toLowerCase()}`;
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
  const resolvedItems = items && items.length > 0 ? items : PACKING_LIST_ITEMS[ageRange] ?? [];
  const sectionRef = useRef<HTMLDivElement>(null);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [loaded, setLoaded] = useState(false);
  const [showByCategory, setShowByCategory] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(getStorageKey(ageRange));
      if (saved) setChecked(new Set(JSON.parse(saved)));
    } catch {}
    setLoaded(true);
  }, [ageRange]);

  const persist = useCallback((next: Set<number>) => {
    try {
      localStorage.setItem(getStorageKey(ageRange), JSON.stringify([...next]));
    } catch {}
  }, [ageRange]);

  if (resolvedItems.length === 0) return null;

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

  const progress = resolvedItems.length > 0 ? Math.round((checked.size / resolvedItems.length) * 100) : 0;

  const categorized = resolvedItems.reduce<Record<string, { item: string; index: number }[]>>((acc, item, i) => {
    const cat = categorizeItem(item);
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push({ item, index: i });
    return acc;
  }, {});

  const categoryOrder = Object.keys(CATEGORIES).filter(c => categorized[c]);

  const renderItem = (item: string, i: number) => (
    <li key={i} className="group">
      <label className="flex items-start gap-3 cursor-pointer py-1.5 px-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors">
        <input
          type="checkbox"
          checked={checked.has(i)}
          onChange={() => toggle(i)}
          className="w-5 h-5 mt-0.5 rounded border-gray-300 text-teal-600 focus:ring-teal-500 flex-shrink-0 print:w-4 print:h-4"
        />
        <span
          className={`text-sm leading-relaxed transition-colors ${
            checked.has(i)
              ? "line-through text-gray-400"
              : "text-gray-700"
          }`}
        >
          {renderItemText(item)}
        </span>
      </label>
    </li>
  );

  const sectionId = getSectionId(ageRange);

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

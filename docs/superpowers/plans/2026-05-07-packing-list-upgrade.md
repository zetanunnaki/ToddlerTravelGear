# Packing List Upgrade v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add trip-type filtering (beach/winter/camping/city/road trip), custom items, and PDF export to the existing interactive packing list at `/guides/toddler-packing-list`.

**Architecture:** A React context provider (`PackingListProvider`) wraps the MDX packing list content, sharing trip-type state between a `TripTypeBar` selector and all `AgeChecklist` instances. Trip-specific items and dim patterns are defined in a data file. Custom items and PDF export are added directly to `AgeChecklist`. No new dependencies — pure React + localStorage + browser print.

**Tech Stack:** Next.js 16 (static export), React 19, Tailwind CSS 4, next-mdx-remote (RSC), localStorage

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/data/trip-type-items.ts` | Create | Trip type configurations: labels, icons, add-items, dim-patterns per age range |
| `src/components/PackingListProvider.tsx` | Create | React context for trip-type state + localStorage persistence |
| `src/components/TripTypeBar.tsx` | Create | Horizontal chip bar for selecting trip type |
| `src/components/AgeChecklist.tsx` | Modify | Consume trip context, render trip extras/dimmed items, custom items, PDF support |
| `src/components/mdx/MdxRenderer.tsx` | Modify | Register new components (PackingListProvider, TripTypeBar) |
| `src/content/guides/toddler-packing-list.mdx` | Modify | Wrap checklists in provider, add TripTypeBar and PDF button |

---

### Task 1: Create trip-type-items data file

**Files:**
- Create: `src/data/trip-type-items.ts`

- [ ] **Step 1: Create the data file with types and all trip configurations**

```typescript
// src/data/trip-type-items.ts

export type TripType = "all" | "beach" | "winter" | "camping" | "city" | "road-trip";

export interface TripTypeConfig {
  label: string;
  icon: string;
  add: Partial<Record<string, string[]>>;
  dim: string[];
}

export const TRIP_TYPES: Record<Exclude<TripType, "all">, TripTypeConfig> = {
  beach: {
    label: "Beach",
    icon: "\u{1F3D6}\u{FE0F}",
    add: {
      "0–12 Months": [
        "Rash guard or swim shirt UPF 50+",
        "Swim diapers — pack 6+ per beach day",
        "Pop-up beach tent or shade canopy for naps",
        "Reef-safe mineral sunscreen — reapply every 80 min in water",
      ],
      "1–2 Years": [
        "Rash guard UPF 50+ — easier than reapplying sunscreen every hour",
        "Reusable swim diapers — most pools require them",
        "Sand toys — bucket, shovel, and a few molds",
        "Pop-up beach tent or shade canopy",
        "Water shoes that actually stay on in waves",
      ],
      "2–4 Years": [
        "Rash guard UPF 50+",
        "Water shoes with grip for rocks and hot sand",
        "Sand toys and sand molds",
        "Beach tent or shade canopy",
        "Swim goggles for pool or calm water",
        "Mesh bag for sandy toys — sand stays at the beach",
      ],
    },
    dim: [
      "snow suit", "insulated", "hand warmers", "toe warmers",
      "fleece", "winter", "ski pants",
    ],
  },
  winter: {
    label: "Winter / Snow",
    icon: "\u{1F3D4}\u{FE0F}",
    add: {
      "0–12 Months": [
        "Insulated car seat cover or bunting — never put a puffy coat under car seat straps",
        "Warm hat that fully covers ears",
        "Baby mittens — 2 pairs, they get wet fast",
        "Warm fleece blanket for stroller",
      ],
      "1–2 Years": [
        "Snow suit or insulated one-piece — one-piece is easier than separates",
        "Waterproof mittens — 2 pairs minimum, one is always wet",
        "Warm hat that covers ears and stays on",
        "Insulated waterproof boots — test fit with thick socks before trip",
        "Hand warmers for the stroller handlebar",
      ],
      "2–4 Years": [
        "Snow suit or ski pants + jacket combo",
        "Waterproof mittens — 2 pairs minimum",
        "Warm hat and neck gaiter or balaclava",
        "Insulated waterproof boots",
        "Hand and toe warmers",
        "Thermos for warm drinks or soup on the slopes",
      ],
    },
    dim: [
      "swim diaper", "rash guard", "water shoes", "sand toys",
      "beach tent", "swimsuit", "reef-safe", "goggles",
    ],
  },
  camping: {
    label: "Camping",
    icon: "⛺",
    add: {
      "0–12 Months": [
        "Mosquito net for crib or carrier",
        "Baby-safe insect repellent (DEET-free, for 2+ months)",
        "Extra-large waterproof changing pad for ground changes",
        "Extra blankets — camping nights drop 20°F from daytime",
        "Clip-on stroller fan for warm days",
      ],
      "1–2 Years": [
        "Toddler headlamp — kids love having their own light",
        "Bug spray safe for toddlers + after-bite cream",
        "Extra warm layers — campsite temps drop fast after sunset",
        "Closed-toe shoes for campsite — sticks, rocks, hot embers",
        "Portable high chair or clip-on seat for campsite eating",
      ],
      "2–4 Years": [
        "Kids headlamp or flashlight — doubles as a toy",
        "Bug spray + after-bite cream",
        "Sturdy closed-toe shoes for hiking and campsite",
        "Extra warm layers for cool nights",
        "Kid-sized camp chair",
        "Nature scavenger hunt list — keeps them exploring for hours",
      ],
    },
    dim: [
      "outlet covers", "cabinet locks", "door knob",
    ],
  },
  city: {
    label: "City Break",
    icon: "\u{1F3D9}\u{FE0F}",
    add: {
      "0–12 Months": [
        "Baby carrier as stroller backup — cobblestones and subway stairs defeat wheels",
        "Rain cover for stroller",
        "Extra muslin blankets for over-air-conditioned museums",
      ],
      "1–2 Years": [
        "Most comfortable walking shoes they own — city trips mean miles of walking",
        "Rain jacket or packable poncho",
        "Small portable snack container for on-the-go munching",
        "Carrier as stroller backup for cobblestones, stairs, and crowded transit",
      ],
      "2–4 Years": [
        "Most comfortable walking shoes they own — break them in before the trip",
        "Packable rain jacket",
        "Small backpack they carry with their own snacks and water",
        "Kid-friendly city guidebook or scavenger hunt printout",
      ],
    },
    dim: [
      "potty seat",
    ],
  },
  "road-trip": {
    label: "Road Trip",
    icon: "\u{1F697}",
    add: {
      "0–12 Months": [
        "Extra change of clothes within arm’s reach — not buried in the trunk",
        "[Car window shades](/reviews/enovoe-car-window-shades) for rear windows",
        "Mirror to see rear-facing baby from driver seat",
        "[Backseat organizer](/reviews/helteko-backseat-organizer) for diapers, wipes, and toys",
      ],
      "1–2 Years": [
        "[Car window shades](/reviews/enovoe-car-window-shades) — sun on a sleeping toddler = meltdown",
        "[Backseat organizer](/reviews/helteko-backseat-organizer) for snacks and toys",
        "[Car seat travel tray](/reviews/pillani-travel-tray) for activities and snacks",
        "Extra drinks and snacks within driver’s reach",
        "Plastic bags for car sickness — just in case",
      ],
      "2–4 Years": [
        "[Car seat travel tray](/reviews/pillani-travel-tray) for drawing, snacks, and figurines",
        "[Car window shades](/reviews/enovoe-car-window-shades)",
        "[Backseat organizer](/reviews/helteko-backseat-organizer)",
        "Audiobooks and car-friendly road trip games",
        "Barf bags within reach — winding roads + screen time = trouble",
      ],
    },
    dim: [
      "gate-check", "stroller bag for airplane",
    ],
  },
};
```

- [ ] **Step 2: Verify the file compiles**

Run: `npx tsc --noEmit src/data/trip-type-items.ts`

If tsc isn't configured for standalone files, just verify no red squiggles in the editor and proceed.

- [ ] **Step 3: Commit**

```bash
git add src/data/trip-type-items.ts
git commit -m "feat: add trip-type items data for packing list"
```

---

### Task 2: Create PackingListProvider context

**Files:**
- Create: `src/components/PackingListProvider.tsx`

- [ ] **Step 1: Create the context provider with localStorage persistence**

```typescript
// src/components/PackingListProvider.tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PackingListProvider.tsx
git commit -m "feat: add PackingListProvider context for trip-type state"
```

---

### Task 3: Create TripTypeBar component

**Files:**
- Create: `src/components/TripTypeBar.tsx`

- [ ] **Step 1: Create the trip type selector chip bar**

```tsx
// src/components/TripTypeBar.tsx
"use client";

import { useTripType } from "@/components/PackingListProvider";
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
  const { tripType, setTripType } = useTripType();

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1 scrollbar-hide">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setTripType(opt.value)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap border-2 transition-colors ${
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/TripTypeBar.tsx
git commit -m "feat: add TripTypeBar chip selector component"
```

---

### Task 4: Modify AgeChecklist — trip-type filtering (extras + dimming)

**Files:**
- Modify: `src/components/AgeChecklist.tsx`

This is the largest task. The AgeChecklist component needs to:
1. Read trip type from context
2. Inject trip-specific extra items (highlighted with tag)
3. Dim irrelevant items (reduced opacity, strikethrough)
4. Update the subtitle to reflect trip mode

- [ ] **Step 1: Add imports for trip type context and data**

At the top of `src/components/AgeChecklist.tsx`, add these imports after the existing ones:

```typescript
import { useTripType } from "@/components/PackingListProvider";
import { TRIP_TYPES, type TripType } from "@/data/trip-type-items";
```

- [ ] **Step 2: Add helper function to check if an item should be dimmed**

Add this function after the existing `renderItemText` function (around line 54):

```typescript
function shouldDimItem(item: string, tripType: TripType): boolean {
  if (tripType === "all") return false;
  const config = TRIP_TYPES[tripType];
  if (!config) return false;
  const lower = item.toLowerCase();
  return config.dim.some(pattern => lower.includes(pattern));
}
```

- [ ] **Step 3: Add trip-type state and computed items inside the component**

Inside the `AgeChecklist` function body, after the line `const [showByCategory, setShowByCategory] = useState(true);` (around line 88), add:

```typescript
const { tripType } = useTripType();

const tripExtras: string[] =
  tripType !== "all" && TRIP_TYPES[tripType]
    ? TRIP_TYPES[tripType].add[ageRange] ?? []
    : [];
```

- [ ] **Step 4: Update the allItems array to include trip extras**

Replace the existing line:

```typescript
const resolvedItems = items && items.length > 0 ? items : PACKING_LIST_ITEMS[ageRange] ?? [];
```

With:

```typescript
const baseItems = items && items.length > 0 ? items : PACKING_LIST_ITEMS[ageRange] ?? [];
const resolvedItems = [...baseItems, ...tripExtras];
```

- [ ] **Step 5: Update subtitle to show trip mode status**

Find the subtitle paragraph inside the header (the `<p>` tag with `checked.size` text, around line 193):

```tsx
<p className="text-sm text-gray-500 mt-0.5">
  {checked.size} of {resolvedItems.length} items packed
</p>
```

Replace it with:

```tsx
<p className="text-sm text-gray-500 mt-0.5">
  {checked.size} of {resolvedItems.length} items packed
  {tripType !== "all" && tripExtras.length > 0 && (
    <span className="ml-2 text-teal-600 font-medium">
      &middot; {TRIP_TYPES[tripType]?.label} mode &mdash; {tripExtras.length} added
    </span>
  )}
</p>
```

- [ ] **Step 6: Update the renderItem function to handle trip extras and dimming**

Replace the existing `renderItem` function (around line 139) with:

```tsx
const tripExtraStartIndex = baseItems.length;

const renderItem = (item: string, i: number) => {
  const isTripExtra = i >= tripExtraStartIndex;
  const isDimmed = !isTripExtra && shouldDimItem(item, tripType);

  return (
    <li key={i} className="group">
      <label
        className={`flex items-start gap-3 cursor-pointer py-1.5 px-2 -mx-2 rounded-lg transition-colors ${
          isDimmed ? "opacity-35" : "hover:bg-gray-50"
        } ${isTripExtra ? "bg-teal-50 border-l-3 border-teal-400 ml-0 pl-4" : ""}`}
      >
        <input
          type="checkbox"
          checked={checked.has(i)}
          onChange={() => toggle(i)}
          className="w-5 h-5 mt-0.5 rounded border-gray-300 text-teal-600 focus:ring-teal-500 flex-shrink-0 print:w-4 print:h-4"
        />
        <span
          className={`text-sm leading-relaxed transition-colors ${
            checked.has(i) || isDimmed
              ? "line-through text-gray-400"
              : "text-gray-700"
          }`}
        >
          {renderItemText(item)}
          {isTripExtra && tripType !== "all" && (
            <span className="ml-1.5 inline-block text-[10px] font-bold bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded align-middle uppercase">
              {TRIP_TYPES[tripType]?.label}
            </span>
          )}
        </span>
      </label>
    </li>
  );
};
```

- [ ] **Step 7: Update progress calculation to exclude dimmed items from denominator (optional — keep simple)**

Keep the progress calculation as-is. Dimmed items still count because they are visible and checkable. No change needed.

- [ ] **Step 8: Verify build**

Run: `npm run build 2>&1 | tail -10`

Expected: Build succeeds, all 183 pages generated.

- [ ] **Step 9: Commit**

```bash
git add src/components/AgeChecklist.tsx
git commit -m "feat: add trip-type filtering to AgeChecklist (extras + dimming)"
```

---

### Task 5: Modify AgeChecklist — custom items

**Files:**
- Modify: `src/components/AgeChecklist.tsx`

- [ ] **Step 1: Add custom items state and localStorage persistence**

Inside the `AgeChecklist` function body, after the `tripExtras` declaration added in Task 4, add:

```typescript
const [customItems, setCustomItems] = useState<string[]>([]);
const [newItemText, setNewItemText] = useState("");

const customStorageKey = `ttg-custom-${ageRange.replace(/\s+/g, "-").toLowerCase()}`;

useEffect(() => {
  try {
    const saved = localStorage.getItem(customStorageKey);
    if (saved) setCustomItems(JSON.parse(saved));
  } catch {}
}, [customStorageKey]);

const persistCustom = useCallback((items: string[]) => {
  try {
    localStorage.setItem(customStorageKey, JSON.stringify(items));
  } catch {}
}, [customStorageKey]);

const addCustomItem = () => {
  const text = newItemText.trim();
  if (!text) return;
  const next = [...customItems, text];
  setCustomItems(next);
  persistCustom(next);
  setNewItemText("");
};

const removeCustomItem = (idx: number) => {
  const next = customItems.filter((_, i) => i !== idx);
  setCustomItems(next);
  persistCustom(next);
  const checkedIdx = resolvedItems.length + idx;
  if (checked.has(checkedIdx)) {
    const nextChecked = new Set(checked);
    nextChecked.delete(checkedIdx);
    persist(nextChecked);
    setChecked(nextChecked);
  }
};
```

- [ ] **Step 2: Include custom items in resolvedItems and progress**

Update the `resolvedItems` line to include custom items:

```typescript
const resolvedItems = [...baseItems, ...tripExtras, ...customItems];
```

Also update the `tripExtraStartIndex` and add a `customStartIndex`:

```typescript
const tripExtraStartIndex = baseItems.length;
const customStartIndex = baseItems.length + tripExtras.length;
```

- [ ] **Step 3: Update checkAll to include custom items**

The existing `checkAll` function already works because it uses `resolvedItems.map((_, i) => i)` which now includes custom items.

- [ ] **Step 4: Update renderItem to handle custom items**

In the `renderItem` function from Task 4, add custom item detection. Replace the first two lines of renderItem:

```typescript
const renderItem = (item: string, i: number) => {
  const isTripExtra = i >= tripExtraStartIndex && i < customStartIndex;
  const isCustom = i >= customStartIndex;
  const isDimmed = !isTripExtra && !isCustom && shouldDimItem(item, tripType);

  return (
    <li key={i} className="group">
      <label
        className={`flex items-start gap-3 cursor-pointer py-1.5 px-2 -mx-2 rounded-lg transition-colors ${
          isDimmed ? "opacity-35" : "hover:bg-gray-50"
        } ${isTripExtra ? "bg-teal-50 border-l-3 border-teal-400 ml-0 pl-4" : ""} ${
          isCustom ? "border-l-3 border-dashed border-gray-300 ml-0 pl-4" : ""
        }`}
      >
        <input
          type="checkbox"
          checked={checked.has(i)}
          onChange={() => toggle(i)}
          className="w-5 h-5 mt-0.5 rounded border-gray-300 text-teal-600 focus:ring-teal-500 flex-shrink-0 print:w-4 print:h-4"
        />
        <span
          className={`text-sm leading-relaxed transition-colors flex-1 ${
            checked.has(i) || isDimmed
              ? "line-through text-gray-400"
              : "text-gray-700"
          }`}
        >
          {renderItemText(item)}
          {isTripExtra && tripType !== "all" && (
            <span className="ml-1.5 inline-block text-[10px] font-bold bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded align-middle uppercase">
              {TRIP_TYPES[tripType]?.label}
            </span>
          )}
        </span>
        {isCustom && (
          <button
            onClick={(e) => {
              e.preventDefault();
              removeCustomItem(i - customStartIndex);
            }}
            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity flex-shrink-0 print:hidden"
            aria-label="Remove custom item"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </label>
    </li>
  );
};
```

- [ ] **Step 5: Add the custom item input UI**

Find the closing `</div>` for the items section (the `<div className="p-5">` block). After its closing tag and before the footer `<div className="bg-gray-50 ...">`, add:

```tsx
{/* Custom item input */}
<div className="px-5 pb-4 print:hidden">
  <div className="flex gap-2">
    <input
      type="text"
      value={newItemText}
      onChange={(e) => setNewItemText(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") addCustomItem();
      }}
      placeholder="Add your own item..."
      className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
    />
    <button
      onClick={addCustomItem}
      disabled={!newItemText.trim()}
      className="px-4 py-2 text-sm font-semibold bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    >
      + Add
    </button>
  </div>
</div>
```

- [ ] **Step 6: Verify build**

Run: `npm run build 2>&1 | tail -10`

Expected: Build succeeds.

- [ ] **Step 7: Commit**

```bash
git add src/components/AgeChecklist.tsx
git commit -m "feat: add custom items to AgeChecklist"
```

---

### Task 6: Add PDF export

**Files:**
- Modify: `src/components/AgeChecklist.tsx` (add a shared print-all function)
- Create: `src/components/PackingListPDF.tsx`

The PDF export opens a print-styled window with ALL age checklists combined, using the same technique as the existing per-section print.

- [ ] **Step 1: Create the PackingListPDF component**

```tsx
// src/components/PackingListPDF.tsx
"use client";

import { useTripType } from "@/components/PackingListProvider";
import { TRIP_TYPES } from "@/data/trip-type-items";

export function PackingListPDF() {
  const { tripType } = useTripType();

  const handlePDF = () => {
    const sections = document.querySelectorAll('[id^="checklist-"]');
    if (sections.length === 0) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
      .map(s => s.outerHTML)
      .join("\n");

    const tripLabel = tripType !== "all" && TRIP_TYPES[tripType]
      ? `${TRIP_TYPES[tripType].icon} ${TRIP_TYPES[tripType].label} Trip`
      : "All Items";

    const sectionsHtml = Array.from(sections).map(s => s.outerHTML).join("<hr style='margin:24px 0;border-color:#e5e7eb;'>");

    printWindow.document.write(`<!DOCTYPE html><html><head>
      <title>Packing Checklist — ToddlerTravelGear</title>
      ${styles}
      <style>
        body { padding: 24px; max-width: 800px; margin: 0 auto; }
        @media print {
          .print\\:hidden { display: none !important; }
          body { padding: 12px; }
        }
      </style>
    </head><body>
      <div style="text-align:center;margin-bottom:24px;">
        <h1 style="font-size:20px;font-weight:bold;margin:0;">Toddler Packing Checklist</h1>
        <p style="font-size:14px;color:#6b7280;margin:4px 0;">${tripLabel} — toddlertravelgear.com/guides/toddler-packing-list</p>
      </div>
      ${sectionsHtml}
    </body></html>`);

    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  };

  return (
    <button
      onClick={handlePDF}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-teal-700 bg-white border-2 border-teal-200 rounded-lg hover:bg-teal-50 hover:border-teal-300 transition-colors print:hidden"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Download PDF
    </button>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PackingListPDF.tsx
git commit -m "feat: add PackingListPDF component for full-page print export"
```

---

### Task 7: Register components and update MDX

**Files:**
- Modify: `src/components/mdx/MdxRenderer.tsx`
- Modify: `src/content/guides/toddler-packing-list.mdx`

- [ ] **Step 1: Register new components in MdxRenderer**

In `src/components/mdx/MdxRenderer.tsx`, add imports after the existing ones:

```typescript
import { PackingListProvider } from "@/components/PackingListProvider";
import { TripTypeBar } from "@/components/TripTypeBar";
import { PackingListPDF } from "@/components/PackingListPDF";
```

Add them to the `components` object:

```typescript
const components = {
  ProductCard,
  BuyBox,
  ComparisonTable,
  SafetyNote,
  AgeChecklist,
  FAQ,
  AffiliateDisclaimer,
  PackingListProvider,
  TripTypeBar,
  PackingListPDF,
};
```

- [ ] **Step 2: Update the packing list MDX**

Replace the content of `src/content/guides/toddler-packing-list.mdx` from the intro text through the first checklist section. The key changes:
- Wrap everything from the trip bar through the last checklist in `<PackingListProvider>`
- Add `<TripTypeBar />` and `<PackingListPDF />` after the intro
- Keep all existing prose content

The full updated MDX content:

```mdx
---
title: "Toddler Packing Checklist: The Interactive List Parents Actually Use (2026)"
seoTitle: "Toddler Packing Checklist by Age — Save & Print (2026) | ToddlerTravelGear"
description: "Interactive toddler packing checklist organized by age — check items off, save progress on your phone, and print a clean copy for your fridge."
category: "Packing"
type: "guide"
publishedAt: "2024-06-03"
updatedAt: "2026-05-07"
author: "ToddlerTravelGear Team"
featuredImage: "/images/covers/toddler-packing-list.jpg"
tags:
  - "packing"
  - "checklist"
  - "essentials"
  - "printable"
---

This is not a packing article. This is a tool.

Check items off as you pack — your progress saves automatically on your phone or computer. Come back tomorrow and your checks are still there. When you are done packing, hit print for a clean paper copy to toss in your bag for the return trip.

**How to use this checklist:**

1. Pick your trip type below — beach, winter, camping, city, or road trip — to see trip-specific items
2. Find your child's age group
3. Tap items as you pack them — the progress bar tracks what is left
4. Add your own items at the bottom of any section
5. Switch between "By Category" (grouped by type) and "Full List" (everything in order)
6. Hit "Download PDF" for a paper version or "Print" for a single section

Skip items that do not apply to your trip. Every family is different. This list is deliberately thorough so you can cross things off rather than wonder what you forgot.

<PackingListProvider>

<TripTypeBar />

<PackingListPDF />

---

## 0–12 Months: The Baby Bag

Babies need the most stuff. There is no shortcut. But this list is organized so you pack the critical items first and the nice-to-haves last.

<AgeChecklist ageRange="0–12 Months" />

**Carry-on must-haves for babies:** All medications, 4+ diapers, wipes, one full change of clothes, pacifiers, formula or nursing supplies, and the comfort items. If your checked bag is lost, you survive on your carry-on — pack it like it is your only bag.

---

## 1–2 Years: The Tornado Kit

Everything about this age is transitional. They are mobile enough to get into trouble but not old enough to reason with. They have strong opinions about their sippy cup but zero opinions about safety. Pack for chaos.

<AgeChecklist ageRange="1–2 Years" />

**The secret weapon at this age:** New toys they have never seen. Hide 3–4 dollar store items and reveal them one at a time on the plane. Each new item buys you 15–20 minutes.

---

## 2–4 Years: The Independent Traveler

Two-to-four-year-olds can carry their own backpack, choose their own snacks, and entertain themselves with activities. Packing gets lighter. Entertainment demands get heavier. The key shift: they can participate in packing — let them choose which stuffed animal comes and which toys go in their backpack. Ownership equals cooperation.

<AgeChecklist ageRange="2–4 Years" />

**Let them pack their own backpack.** Give them their backpack and 5 approved items. They pick which toys, which snacks, which coloring book. Kids who pack their own bag are invested in the trip from the start.

</PackingListProvider>

---

## What NOT to Pack — Buy It There

Stop filling your suitcase with things every grocery store sells:

- **Full diaper packs** — bring travel days only, buy the rest on arrival
- **Full-size sunscreen, shampoo, or lotion** — buy travel sizes or pick up full bottles at destination
- **More than 2 days of snacks** — every destination has grocery stores
- **Bulky toys** — kids play with hotel ice buckets and elevator buttons, they do not need their toy box
- **Stacks of physical books** — load stories on a tablet or bring one thin paperback
- **More than 2 pairs of shoes** — sneakers plus sandals covers every situation

## The Carry-On vs Checked Bag Rule

**In your carry-on (survive 24 hours if checked bag is lost — check the [TSA's full list of what you can bring](https://www.tsa.gov/travel/security-screening/whatcanibring/all) before packing):**
- All medications — you cannot replace prescriptions easily
- One full change of clothes per child in a ziplock bag
- Diapers and wipes for the flight plus a 4-hour delay buffer
- ALL comfort items — lovey, blanket, pacifier — a lost lovey is a multi-day crisis
- Snacks — double what you think you need
- Entertainment — tablet, headphones, [activity books](/best/travel-toys-activities)
- One warm layer per person — planes are cold
- Travel documents and insurance cards

**Everything else goes in checked luggage.** Split clothes across two checked bags if you have them — if one bag is lost, everyone still has something to wear.

## Pro Tips From Parents Who Learned the Hard Way

1. **Pack the night before, not the morning of.** Rushed packing = forgotten essentials
2. **Photograph your packed suitcase contents.** If luggage is lost, you need an itemized list for the airline claim
3. **Put your name and phone inside the suitcase** — exterior tags rip off
4. **Roll clothes, do not fold.** Rolls compress better and wrinkle less
5. **Put all liquids in a ziplock inside checked bags.** Altitude pressure changes cause leaks
6. **Wear your bulkiest items on the plane** — jackets and heavy shoes go on bodies, not in bags
7. **Bring an empty water bottle through security** — fill it at a fountain instead of paying $6 at the airport
8. **Take a photo of your child each travel morning** — if you are separated, you have a current photo with what they are wearing that day

---

## Related Guides

- [Flying With a Toddler: Complete Guide](/guides/flying-with-toddler-complete-guide) — what to expect at every stage from check-in to landing
- [Road Trip Survival Guide](/guides/road-trip-survival-guide) — packing, timing, and entertainment strategies for long drives
- [Hotel Room Baby-Proofing Checklist](/guides/hotel-room-baby-proofing-checklist) — the quick safety sweep every parent should do at check-in
- [Renting vs Bringing Gear](/guides/renting-vs-bringing-gear) — when it makes sense to rent strollers, cribs, and car seats at your destination
- [Feeding Your Toddler While Traveling](/guides/feeding-toddler-while-traveling) — meal planning, snack strategy, and finding toddler-friendly food anywhere
```

- [ ] **Step 3: Verify build**

Run: `npm run build 2>&1 | tail -10`

Expected: Build succeeds, all 183 pages generated.

- [ ] **Step 4: Test in browser**

Run `npm run dev` and open `http://localhost:3000/guides/toddler-packing-list`. Verify:
- Trip type bar appears with 6 chips (All Items + 5 trip types)
- Clicking "Beach" shows green-highlighted beach extras in each age section
- Irrelevant items appear dimmed when a trip type is selected
- "All Items" hides trip extras and removes dimming
- "Add your own item" input works — items appear with dotted border
- Custom items persist on page reload
- X button deletes custom items
- Download PDF opens a print window with all sections
- Per-section Print and Share still work
- Progress bars include trip extras and custom items
- Check All / Reset work correctly with all item types

- [ ] **Step 5: Commit**

```bash
git add src/components/mdx/MdxRenderer.tsx src/content/guides/toddler-packing-list.mdx
git commit -m "feat: wire up trip type bar, PDF export, and custom items in packing list"
```

---

### Task 8: Final build verification and cleanup

- [ ] **Step 1: Full production build**

Run: `npm run build 2>&1 | tail -15`

Expected: Build succeeds, 183 pages generated, no warnings about missing components.

- [ ] **Step 2: Verify packing list output HTML**

```bash
grep -c "TripTypeBar\|PackingListProvider\|trip-type" out/guides/toddler-packing-list.html
```

Expected: Non-zero count confirming trip type components are in the output.

- [ ] **Step 3: Clean up temporary files**

```bash
rm -f tmp-mockup.html
```

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: clean up mockup file"
git push
```

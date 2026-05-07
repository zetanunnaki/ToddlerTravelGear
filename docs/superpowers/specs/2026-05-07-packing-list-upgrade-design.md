# Packing List Upgrade v1 — Design Spec

**Date:** 2026-05-07
**Status:** Approved
**Page:** `/guides/toddler-packing-list`

## Goal

Upgrade the existing interactive packing list from a static age-based checklist into a trip-aware tool with custom items and PDF export — without breaking the proven structure parents already use.

## Approach

**Filter Layer (Approach A):** Add a trip-type selector on top of the existing age-based checklists. The age structure, category grouping, localStorage persistence, progress bars, and print/share features all stay intact. Trip types inject curated extras and dim irrelevant items.

**Item sourcing: Hybrid.** Tag existing items for trip relevance AND add curated trip-specific extras per type.

## Features

### 1. Trip Type Filter Bar

- Horizontal scrollable chip bar rendered ONCE above all age checklists
- Options: `All Items` (default) | `Beach` | `Winter / Snow` | `Camping` | `City Break` | `Road Trip`
- Default is "All Items" — zero friction for first-time visitors, page works exactly as before
- Selection persists in localStorage (key: `ttg-trip-type`)
- One global trip type for the entire page (not per-age-section)

### 2. Item Behavior When Trip Type Selected

Three item states:

| State | Condition | Visual |
|-------|-----------|--------|
| **Core** | No trip tag — universal items | Normal rendering (unchanged) |
| **Trip extra** | Curated item for active trip type | Highlighted row with teal left border + colored tag (e.g., `BEACH`) |
| **Dimmed** | Tagged as irrelevant to active trip type | 35% opacity, strikethrough, still visible and checkable |

- When "All Items" is selected: all items visible at full opacity, no tags shown, trip extras hidden
- Subtitle under each age section header updates dynamically: "Beach mode — 4 items added, 2 dimmed"

### 3. Custom Items

- "Add your own item" text input + "Add" button at the bottom of each age checklist section
- Custom items stored in localStorage keyed by age range (key: `ttg-custom-{age-range}`)
- Custom items appear at the end of the item list with a dotted left border to distinguish from built-in items
- Each custom item has an X (delete) button on hover — only custom items can be deleted
- Custom items persist across trip-type switches (they are not trip-specific)
- Custom items are included in progress count, print, and PDF

### 4. PDF Export

- "Download PDF" button in the page intro area alongside existing guidance text
- Generates a clean print-optimized view of ALL age checklists with current state:
  - Trip type label (if not "All Items")
  - Checked/unchecked items with checkbox visuals
  - Custom items included
  - Progress summary per section
  - Page title and URL at top
- Implementation: open a print-styled window (same technique as existing section print) but with ALL sections combined
- No server-side generation, no external libraries — pure browser print-to-PDF

## Data Model

### Trip type items data

New file: `src/data/trip-type-items.ts`

```typescript
type TripType = "beach" | "winter" | "camping" | "city" | "road-trip";
type AgeRange = "0–12 Months" | "1–3 Years" | "3–5 Years";

interface TripTypeConfig {
  label: string;
  icon: string;
  add: Partial<Record<AgeRange, string[]>>;
  dim: Partial<Record<AgeRange, string[]>>;
}

export const TRIP_TYPE_ITEMS: Record<TripType, TripTypeConfig> = { ... };
```

- `add`: items to inject when this trip type is active, keyed by age range
- `dim`: item text substrings to match for dimming when this trip type is active (matched against existing items)
- Using substring matching for `dim` avoids fragile index-based references

### Custom items storage

```
localStorage key: ttg-custom-0-12-months
localStorage value: JSON string array ["My custom item 1", "My custom item 2"]
```

### Trip type selection storage

```
localStorage key: ttg-trip-type
localStorage value: "beach" | "winter" | "camping" | "city" | "road-trip" | "all"
```

## Component Changes

### AgeChecklist.tsx (modified)

- Accept new optional prop: `tripType: string`
- Accept new optional prop: `onTripChange` callback (not needed if trip state is lifted)
- Resolve trip-specific items from TRIP_TYPE_ITEMS data
- Merge trip extras into the rendered list after core items in each category
- Apply dimming logic to items matching dim patterns for active trip type
- Render custom items section at the end
- Include custom items in progress calculation
- Update subtitle to show trip mode status

### New: TripTypeBar.tsx

- Client component rendering the horizontal chip bar
- Reads/writes trip type to localStorage
- Passes selected trip type up via callback or context

### Packing list page (MDX or page template)

- Trip type state lives at the page level (above all AgeChecklist instances)
- TripTypeBar and all AgeChecklist components share state
- PDF export button triggers full-page print function

## What Stays the Same

- Age-based checklist structure (0-12mo, 1-3yr, 3-5yr)
- Category grouping (Diapering, Feeding, Sleep, Safety, Clothing, Gear, Entertainment, Organization)
- localStorage persistence of checked items (existing keys unchanged)
- Progress bars per section with completion celebration
- Per-section Print and Share buttons
- "By Category" / "Full List" view toggle
- "Check All" / "Reset" buttons
- Markdown link rendering in item text

## Out of Scope (v2)

- Multiple saved/named trips with independent progress
- Trip departure date and countdown
- Weather API integration
- Collaborative checklists (real-time sync between partners)
- Item quantity tracking

# Product Requirements Document (PRD)
# ToddlerTravelGear.com — Travel Products for Parents of Young Kids

This PRD is written to be handed directly to Claude Code to build a high-converting affiliate website.

**Hard constraints (must follow):**

- **No database. No external CMS.** Do not use Prisma/Drizzle/Supabase/Firebase/Sanity/Contentful/Strapi.
- Use a **local, file-based CMS**:
  - **MDX** files for content (guides, roundups, reviews)
  - A **central JSON product catalog** for all affiliate product data/links
- Primary monetization: **Amazon Associates**
- Secondary (optional): Walmart/Target later, but MVP is Amazon-only.

---

## 1) Business Goal & Monetization Strategy

ToddlerTravelGear.com should generate affiliate revenue by ranking for high-intent search queries and converting anxious, research-heavy parents.

The conversion strategy is to combine:

- SEO-driven "best X for Y" roundups (highest volume + intent)
- Deep product reviews (supports rankings + trust)
- Checklists and guides (captures top-of-funnel traffic and internally links to money pages)
- Recurring internal linking loops (every guide points to at least one roundup and 2–3 relevant reviews)

Success metrics (MVP):

- 50+ indexed pages within 60–90 days of launch
- Average CTR > 2.5% on top pages
- Amazon outbound click-through rate > 10% on roundup pages
- RPM (revenue per 1,000 sessions) target: 25–120 USD depending on season

---

## 2) Target Audience

Primary user:

- Parents traveling with babies/toddlers (0–4 years)
- High anxiety about **safety**, airline rules, compatibility, and packing mistakes
- Will pay more for products that reduce stress (e.g., compact, lightweight, TSA/FAA-friendly)

Key user intents:

- "best travel stroller for flying"
- "FAA approved car seat for airplane"
- "portable crib for travel"
- "stroller travel bag gate check"
- "toddler airplane bed / seat extender"
- "packing list for toddler travel"

---

## 3) Brand Positioning & Voice

Brand promise: **"Travel lighter. Worry less."**

Voice:

- Calm, practical, safety-first, parent-to-parent
- Evidence-based and policy-aware (airline rules, FAA guidance)
- No fear-mongering; instead, clarity and reassurance

Design principles:

- Mobile-first, fast, readable
- Big tap targets, clear CTAs
- Accessibility: good contrast, semantic headings

---

## 4) Tech Stack & Non-Functional Requirements

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- MDX support (Next MDX or next-mdx-remote)
- Deployed on Vercel

Performance targets:

- Lighthouse 90+ (mobile)
- CLS minimized (explicit image sizes)
- All pages statically generated where possible

---

## 5) Information Architecture (Site Map)

### Core routes

- `/` Home
- `/best/` Roundups hub
- `/best/[slug]/` Roundup article (money page)
- `/reviews/` Reviews hub
- `/reviews/[slug]/` Product review
- `/guides/` Guides hub
- `/guides/[slug]/` Informational guide/checklist
- `/categories/[category]/` Category listing (optional MVP)
- `/about/`
- `/contact/` (simple form or mailto)
- `/affiliate-disclosure/` (required)
- `/privacy-policy/` (required)

Navigation (top): Home, Best Picks, Reviews, Guides, Packing Lists

---

## 6) Content Model (No-DB CMS)

### 6.1 Folder structure

- `src/content/best/` (roundups)
- `src/content/reviews/` (single product reviews)
- `src/content/guides/` (guides + checklists)
- `src/data/products.json` (central product catalog)
- `src/data/brands.json` (optional, for brand pages)

### 6.2 Central product catalog (products.json)

Single source of truth for:

- Product name, brand, category
- Amazon affiliate link (with tag)
- Images (local path), key specs, price range
- "Why parents buy it" bullet, safety notes
- Replacement/consumables links where applicable (recurring commission)

Example schema:

```json
{
  "gb-pockit-plus": {
    "name": "GB Pockit+ All-City Ultra Compact Stroller",
    "brand": "gb",
    "category": "Travel Strollers",
    "priceHint": "120-250 USD",
    "image": "/images/products/gb-pockit.jpg",
    "amazonUrl": "https://www.amazon.com/dp/ASIN?tag=toddlertravel-20",
    "keySpecs": {
      "weight": "~12 lb",
      "carryOn": "Often fits overhead (check airline)",
      "fold": "Ultra-compact",
      "ageRange": "6 months+"
    },
    "bestFor": ["frequent flyers", "city trips", "tight luggage space"],
    "pros": ["tiny fold", "lightweight"],
    "cons": ["small wheels", "limited storage basket"],
    "safetyNotes": ["Always follow airline gate-check rules", "Use stroller strap in crowded areas"]
  }
}
```

### 6.3 MDX content

All articles are MDX with frontmatter.

Frontmatter schema (common):

```yaml
---
title: "Best Travel Strollers for Flying (2026): Carry-On-Friendly Picks"
seoTitle: "Best Travel Strollers for Flying (2026) | ToddlerTravelGear"
description: "Carry-on and gate-check options parents love—plus what airlines actually allow."
category: "Travel Strollers"
type: "roundup"
publishedAt: "2026-04-28"
updatedAt: "2026-04-28"
author: "ToddlerTravelGear Team"
featuredImage: "/images/covers/travel-stroller.jpg"
productIds:
  - "gb-pockit-plus"
  - "summer-infant-3d-lite"
  - "babyzen-yoyo2"
---
```

---

## 7) High-Converting UI Components (Must Build)

These components are the conversion engine. They must pull data from `products.json` using `productId`.

1) `AffiliateDisclaimer`
- Display at top of all article templates.
- Text: "ToddlerTravelGear is reader-supported. We may earn a commission if you buy through links on our site—at no extra cost to you."

2) `ProductCard`
- Props: `productId`, `badge`, `reason`
- Renders: image, key specs, 2–3 pros/cons, short verdict, CTA button.

3) `BuyBox`
- Sticky sidebar on desktop; inline on mobile.
- Contains: best-for, quick pros, price hint, "Check price on Amazon" button.

4) `ComparisonTable`
- Compare 3–6 products for key parent decision factors:
  - Weight, fold size, airline friendliness, age range, recline, storage

5) `SafetyNote`
- Highlight critical safety info (FAA/airline notes, car seat fit, harness rules)

6) `AgeChecklist`
- For packing lists (0–12 months, 1–2 years, 2–4 years)

7) `FAQ`
- Render FAQ items with collapsible UI and output **FAQPage JSON-LD**.

---

## 8) SEO Requirements (Must Implement)

### 8.1 Metadata

- Use Next.js Metadata API.
- Title + description from frontmatter.
- OpenGraph + Twitter cards for every page.

### 8.2 JSON-LD (critical)

Implement JSON-LD generation per template:

- **Roundup pages:** `ItemList` schema + optional `Article`
- **Review pages:** `Review` + `Product` schema (ensure compliant, avoid fake ratings)
- **Guide pages:** `Article` schema
- **FAQ blocks:** `FAQPage` schema
- **Breadcrumbs:** `BreadcrumbList` schema site-wide

Rules:

- Only include ratings if you display them and they're editorial (avoid implying Amazon user ratings).
- Keep claims conservative; no medical promises.

### 8.3 Internal linking system

- Every guide links to at least one roundup and one review.
- Each roundup links out to 2–4 guides and 2–4 reviews.
- Auto-render "Related content" sections based on shared category/tags.

### 8.4 Sitemap & robots

- Auto-generate `sitemap.xml` by reading MDX directories.
- `robots.txt` references sitemap.

---

## 9) Content Plan (Money Pages First)

Seed content to ship with MVP (minimum):

Roundups (`/best/`):

- Best Travel Strollers for Flying
- Best FAA-Approved Car Seats for Airplanes
- Best Portable Cribs for Travel
- Best Stroller Travel Bags (Gate Check)
- Best Travel High Chairs
- Best Baby Carriers for Hiking & Travel
- Best Packing Organizers for Toddler Travel

Reviews (`/reviews/`): 10 starter reviews (choose products referenced by roundups)

Guides (`/guides/`):

- Airline Rules for Traveling With Car Seats (Plain-English)
- Toddler Packing List by Age (0–12m, 1–2, 2–4)
- Renting vs Bringing Baby Gear: Cost & Stress Tradeoffs
- Road Trip Survival Guide With a Toddler

---

## 10) Trust, Compliance, and Risk

- FTC affiliate disclosure present on every page with affiliate links.
- Create `/affiliate-disclosure/` and link it in footer.
- Avoid unsafe medical claims; focus on safety guidance and product usability.
- Add a "Last updated" date to all money pages.

---

## 11) Analytics & Tracking (MVP)

- Add Google Analytics 4 (env var placeholder)
- Track outbound affiliate clicks (event: `affiliate_click`, params: productId, placement, pageType)

---

## 12) Build Instructions for Claude Code (Step-by-Step)

Build in this order:

1) Initialize Next.js App Router + TS + Tailwind.
2) Add MDX pipeline + frontmatter parsing utilities.
3) Implement `products.json` data layer and helper `getProduct(productId)`.
4) Create page templates for best/reviews/guides using MDX content.
5) Build the conversion components (ProductCard, BuyBox, ComparisonTable, FAQ).
6) Implement JSON-LD generation per template (ItemList, Product, Review, Article, FAQPage, BreadcrumbList).
7) Implement sitemap.xml + robots.txt generation.
8) Seed the site with starter MDX pages and sample products.
9) Polish UI, ensure mobile usability, and confirm Lighthouse 90+.

**Do not introduce a database at any point.** All content and product data must remain in local files.

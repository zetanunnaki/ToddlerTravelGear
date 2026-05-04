import { getProduct } from "./products";

export type AffiliatePlatform = "amazon" | "shareasale" | "cj" | "direct";

export interface AffiliateEntry {
  url: string;
  platform: AffiliatePlatform;
}

// Per-platform CTA labels and button styles
const platformCta: Record<AffiliatePlatform, { label: string; shortLabel: string }> = {
  amazon: { label: "Check Price on Amazon", shortLabel: "View" },
  shareasale: { label: "Check Price", shortLabel: "View" },
  cj: { label: "Check Price", shortLabel: "View" },
  direct: { label: "Buy Direct from Brand", shortLabel: "Buy" },
};

// ──────────────────────────────────────────────────────────────────────
// OVERRIDES — add entries here to switch a product away from Amazon.
//
// Example:
//   "babyzen-yoyo2": {
//     url: "https://shareasale.com/r.cfm?b=...",
//     platform: "shareasale",
//     // ~8% commission via ShareASale, 30-day cookie
//   },
//
//   "ergobaby-omni": {
//     url: "https://www.ergobaby.com/omni-360?ref=ttg",
//     platform: "direct",
//     // 10% direct program, 45-day cookie, apply at ergobaby.com/affiliates
//   },
// ──────────────────────────────────────────────────────────────────────
const overrides: Record<string, AffiliateEntry> = {
  // All products currently use Amazon Associates (tag: toddlertravelgear.com-20)
  // ~4% commission on most baby/travel gear, 24-hour cookie
  //
  // To move a product to another network, add it here.
};

export function getAffiliateLink(productId: string): AffiliateEntry & {
  ctaLabel: string;
  shortCtaLabel: string;
} {
  const override = overrides[productId];
  if (override) {
    const cta = platformCta[override.platform];
    return { ...override, ctaLabel: cta.label, shortCtaLabel: cta.shortLabel };
  }

  const product = getProduct(productId);
  const url = product?.amazonUrl ?? "";
  const cta = platformCta.amazon;
  return { url, platform: "amazon", ctaLabel: cta.label, shortCtaLabel: cta.shortLabel };
}

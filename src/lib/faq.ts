import FAQ_DATA from "@/data/faq-data";
import type { FAQItem } from "@/data/faq-data";

export type { FAQItem };

export function getFAQBySlug(slug: string): FAQItem[] {
  return FAQ_DATA[slug] ?? [];
}

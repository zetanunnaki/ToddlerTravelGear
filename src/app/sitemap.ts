import type { MetadataRoute } from "next";
import { getAllRoundups, getAllReviews, getAllGuides } from "@/lib/mdx";

export const dynamic = "force-static";

const SITE_URL = "https://toddlertravelgear.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const roundups = getAllRoundups().map((item) => ({
    url: `${SITE_URL}/best/${item.meta.slug}`,
    lastModified: item.meta.updatedAt || now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const reviews = getAllReviews().map((item) => ({
    url: `${SITE_URL}/reviews/${item.meta.slug}`,
    lastModified: item.meta.updatedAt || now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const guides = getAllGuides().map((item) => ({
    url: `${SITE_URL}/guides/${item.meta.slug}`,
    lastModified: item.meta.updatedAt || now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/best`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/reviews`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/guides`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: "2026-01-01",
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: "2026-01-01",
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/affiliate-disclosure`,
      lastModified: "2026-01-01",
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: "2026-01-01",
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: "2026-01-01",
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  return [...staticPages, ...roundups, ...reviews, ...guides];
}

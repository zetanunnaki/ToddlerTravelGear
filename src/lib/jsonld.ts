import type { ContentMeta } from "./mdx";
import type { Product } from "./products";
import { getAffiliateLink } from "./affiliateConfig";
import { getSameAsUrls } from "./social";

const SITE_URL = "https://toddlertravelgear.com";

export function generateBreadcrumbJsonLd(
  items: { label: string; href?: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      ...items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: item.label,
        ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
      })),
    ],
  };
}

export function generateArticleJsonLd(meta: ContentMeta, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.description,
    author: {
      "@type": "Organization",
      name: meta.author,
    },
    datePublished: meta.publishedAt,
    dateModified: meta.updatedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}${path}`,
    },
    ...(meta.featuredImage
      ? { image: `${SITE_URL}${meta.featuredImage}` }
      : {}),
  };
}

export function generateItemListJsonLd(
  meta: ContentMeta,
  products: (Product & { id: string })[],
  path: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: meta.title,
    description: meta.description,
    url: `${SITE_URL}${path}`,
    numberOfItems: products.length,
    itemListElement: products.map((product, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: product.name,
      url: getAffiliateLink(product.id).url,
    })),
  };
}

function parsePrice(priceHint: string): string | null {
  const match = priceHint.match(/\$?([\d,]+(?:\.\d{2})?)/);
  return match ? match[1].replace(",", "") : null;
}

export function generateProductJsonLd(product: Product & { id: string }) {
  const price = parsePrice(product.priceHint);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    description: product.pros.join(". "),
    category: product.category,
    ...(product.image ? { image: `https://toddlertravelgear.com${product.image}` } : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      ...(price ? { price } : {}),
      availability: "https://schema.org/InStock",
      url: getAffiliateLink(product.id).url,
    },
  };
}

export function generateReviewJsonLd(
  meta: ContentMeta,
  product: Product & { id: string },
  path: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    name: meta.title,
    reviewBody: meta.description,
    author: {
      "@type": "Organization",
      name: meta.author,
    },
    datePublished: meta.publishedAt,
    dateModified: meta.updatedAt,
    itemReviewed: {
      "@type": "Product",
      name: product.name,
      brand: {
        "@type": "Brand",
        name: product.brand,
      },
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: 4,
      bestRating: 5,
      worstRating: 1,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}${path}`,
    },
  };
}

export function generateFAQJsonLd(
  items: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function generateWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ToddlerTravelGear",
    alternateName: "Toddler Travel Gear",
    url: SITE_URL,
    description:
      "Thoroughly researched gear reviews, FAA-approved car seat guides, and packing lists for parents traveling with babies and toddlers.",
    publisher: generateOrganizationJsonLd(),
  };
}

export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ToddlerTravelGear",
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    description:
      "Honest, safety-first gear recommendations for parents traveling with babies and toddlers.",
    sameAs: getSameAsUrls(),
  };
}

export function generateCollectionPageJsonLd(
  name: string,
  description: string,
  path: string,
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: `${SITE_URL}${path}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        url: item.url,
      })),
    },
  };
}

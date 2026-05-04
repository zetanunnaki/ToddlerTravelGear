import { Suspense } from "react";
import type { Metadata } from "next";
import { getAllReviews } from "@/lib/mdx";
import { getProduct } from "@/lib/products";
import { JsonLd } from "@/components/JsonLd";
import { generateCollectionPageJsonLd } from "@/lib/jsonld";
import { ReviewFilters } from "@/components/ReviewFilters";

export const metadata: Metadata = {
  title: "Product Reviews",
  description:
    "In-depth reviews of travel gear for babies and toddlers. Based on real parent reviews, for parents.",
  alternates: { canonical: "/reviews" },
};

export default function ReviewsPage() {
  const reviews = getAllReviews();

  const reviewItems = reviews.map((r) => {
    const productId = r.meta.productIds?.[0];
    const product = productId ? getProduct(productId) : null;
    return {
      slug: r.meta.slug,
      title: r.meta.title,
      description: r.meta.description,
      category: r.meta.category,
      featuredImage: r.meta.featuredImage,
      readingTime: r.meta.readingTime,
      priceHint: product?.priceHint ?? "",
    };
  });

  const categories = [
    ...new Set(reviews.map((r) => r.meta.category)),
  ].sort();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <JsonLd
        data={generateCollectionPageJsonLd(
          "Product Reviews",
          "In-depth reviews of travel gear for babies and toddlers.",
          "/reviews",
          reviews.map((r) => ({
            name: r.meta.title,
            url: `https://toddlertravelgear.com/reviews/${r.meta.slug}`,
          }))
        )}
      />
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wide mb-3">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          In-Depth
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy-900 mb-3">
          Product Reviews
        </h1>
        <p className="text-gray-500 max-w-2xl leading-relaxed">
          Detailed, honest reviews of travel gear based on real parent reviews
          and hands-on feedback.
        </p>
      </div>

      <Suspense fallback={null}>
        <ReviewFilters reviews={reviewItems} categories={categories} />
      </Suspense>
    </div>
  );
}

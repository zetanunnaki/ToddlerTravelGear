import Link from "next/link";
import type { Metadata } from "next";
import { getAllReviews } from "@/lib/mdx";
import { JsonLd } from "@/components/JsonLd";
import { generateCollectionPageJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Product Reviews",
  description:
    "In-depth reviews of travel gear for babies and toddlers. Based on real parent reviews, for parents.",
  alternates: { canonical: "/reviews" },
};

export default function ReviewsPage() {
  const reviews = getAllReviews();

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

      {reviews.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((item) => (
            <Link
              key={item.meta.slug}
              href={`/reviews/${item.meta.slug}`}
              className="group block border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 hover:border-teal-100 transition-all duration-300 bg-white"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  {item.meta.category}
                </span>
                <span className="text-xs text-gray-400">
                  {item.meta.readingTime}
                </span>
              </div>
              <h2 className="font-display font-bold text-navy-900 mb-2 group-hover:text-teal-700 transition-colors leading-snug">
                {item.meta.title}
              </h2>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                {item.meta.description}
              </p>
              <span className="text-xs text-teal-600 font-semibold uppercase tracking-wide">
                Read Review &rarr;
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">Reviews are coming soon.</p>
      )}
    </div>
  );
}

"use client";

import { useState, useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface ReviewItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  featuredImage?: string;
  readingTime: string;
  priceHint: string;
}

interface ReviewFiltersProps {
  reviews: ReviewItem[];
  categories: string[];
}

const priceRanges = [
  { label: "Under $25", min: 0, max: 25 },
  { label: "$25–$50", min: 25, max: 50 },
  { label: "$50–$100", min: 50, max: 100 },
  { label: "$100+", min: 100, max: Infinity },
];

function parsePrice(hint: string): number | null {
  const match = hint.match(/\$?([\d,]+(?:\.\d{2})?)/);
  return match ? parseFloat(match[1].replace(",", "")) : null;
}

export function ReviewFilters({ reviews, categories }: ReviewFiltersProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeCategory = searchParams.get("category") ?? "";
  const activePriceRange = searchParams.get("price") ?? "";

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  const clearAll = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  const activeCount =
    (activeCategory ? 1 : 0) + (activePriceRange ? 1 : 0);

  const filtered = useMemo(() => {
    let result = reviews;

    if (activeCategory) {
      result = result.filter((r) => r.category === activeCategory);
    }

    if (activePriceRange) {
      const range = priceRanges.find((r) => r.label === activePriceRange);
      if (range) {
        result = result.filter((r) => {
          const price = parsePrice(r.priceHint);
          if (price === null) return false;
          return price >= range.min && price < range.max;
        });
      }
    }

    return result;
  }, [reviews, activeCategory, activePriceRange]);

  const filterContent = (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Category
        </p>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                updateParams("category", activeCategory === cat ? "" : cat)
              }
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                activeCategory === cat
                  ? "bg-teal-600 text-white border-teal-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-teal-300 hover:text-teal-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Price Range
        </p>
        <div className="flex flex-wrap gap-2">
          {priceRanges.map((range) => (
            <button
              key={range.label}
              onClick={() =>
                updateParams(
                  "price",
                  activePriceRange === range.label ? "" : range.label
                )
              }
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                activePriceRange === range.label
                  ? "bg-teal-600 text-white border-teal-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-teal-300 hover:text-teal-700"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop filter bar */}
      <div className="hidden md:block mb-8 p-5 bg-gray-50 rounded-2xl border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-navy-900">Filters</p>
          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors"
            >
              Clear all ({activeCount})
            </button>
          )}
        </div>
        {filterContent}
      </div>

      {/* Mobile filter button */}
      <div className="md:hidden mb-6">
        <button
          onClick={() => setDrawerOpen(true)}
          className="inline-flex items-center gap-2 text-sm font-medium text-navy-900 bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filters
          {activeCount > 0 && (
            <span className="bg-teal-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <p className="font-semibold text-navy-900">Filters</p>
              <div className="flex items-center gap-3">
                {activeCount > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-xs text-teal-600 font-medium"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  aria-label="Close filters"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-5">{filterContent}</div>
            <div className="p-5 border-t border-gray-100">
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-full bg-teal-600 text-white font-semibold py-3 rounded-xl hover:bg-teal-500 transition-colors"
              >
                Show {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {filtered.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <Link
              key={item.slug}
              href={`/reviews/${item.slug}`}
              className="group block border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 hover:border-teal-100 transition-all duration-300 bg-white"
            >
              {item.featuredImage && (
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-50">
                  <Image
                    src={item.featuredImage}
                    alt={item.title}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                    {item.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {item.readingTime}
                  </span>
                </div>
                <h2 className="font-display font-bold text-navy-900 mb-2 group-hover:text-teal-700 transition-colors leading-snug">
                  {item.title}
                </h2>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                  {item.description}
                </p>
                <span className="text-xs text-teal-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Read Review &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-3">
            No reviews match your filters.
          </p>
          <button
            onClick={clearAll}
            className="text-sm text-teal-600 hover:text-teal-700 font-medium"
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}

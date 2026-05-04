import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getAllRoundups } from "@/lib/mdx";
import { JsonLd } from "@/components/JsonLd";
import { generateCollectionPageJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Best Picks — Roundups & Comparisons",
  description:
    "Thoroughly researched roundups of the best travel gear for babies and toddlers. Strollers, car seats, cribs, carriers, and more.",
  alternates: { canonical: "/best" },
};

export default function BestPage() {
  const roundups = getAllRoundups();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <JsonLd
        data={generateCollectionPageJsonLd(
          "Best Picks — Roundups & Comparisons",
          "Thoroughly researched roundups of the best travel gear for babies and toddlers.",
          "/best",
          roundups.map((r) => ({
            name: r.meta.title,
            url: `https://toddlertravelgear.com/best/${r.meta.slug}`,
          }))
        )}
      />
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full uppercase tracking-wide mb-3">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Roundups
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy-900 mb-3">
          Best Picks
        </h1>
        <p className="text-gray-500 max-w-2xl leading-relaxed">
          Our top-rated roundups compare the best travel gear for flying and road
          trips with babies and toddlers.
        </p>
      </div>

      {roundups.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {roundups.map((item) => (
            <Link
              key={item.meta.slug}
              href={`/best/${item.meta.slug}`}
              className="group block border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 hover:border-teal-100 transition-all duration-300 bg-white"
            >
              {item.meta.featuredImage && (
                <div className="relative w-full aspect-[3/2] overflow-hidden">
                  <Image
                    src={item.meta.featuredImage}
                    alt={item.meta.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              )}
              <div className="p-6">
                <span className="inline-block text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full mb-3">
                  {item.meta.category}
                </span>
                <h2 className="font-display font-bold text-lg text-navy-900 mb-2 group-hover:text-teal-700 transition-colors leading-snug">
                  {item.meta.title}
                </h2>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                  {item.meta.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {item.meta.readingTime} &middot; Updated{" "}
                    {item.meta.updatedAt}
                  </span>
                  <span className="text-xs text-teal-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Read &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Roundups are coming soon.</p>
      )}
    </div>
  );
}

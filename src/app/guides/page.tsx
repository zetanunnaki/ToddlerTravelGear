import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getAllGuides } from "@/lib/mdx";
import { JsonLd } from "@/components/JsonLd";
import { generateCollectionPageJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Travel Guides & Checklists",
  description:
    "Practical guides, packing lists, and checklists for traveling with babies and toddlers.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  const guides = getAllGuides();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <JsonLd
        data={generateCollectionPageJsonLd(
          "Travel Guides & Checklists",
          "Practical guides, packing lists, and checklists for traveling with babies and toddlers.",
          "/guides",
          guides.map((g) => ({
            name: g.meta.title,
            url: `https://toddlertravelgear.com/guides/${g.meta.slug}`,
          }))
        )}
      />
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wide mb-3">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Resources
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy-900 mb-3">
          Guides &amp; Checklists
        </h1>
        <p className="text-gray-500 max-w-2xl leading-relaxed">
          Everything you need to know before your next trip with little
          ones — from airline rules to packing lists.
        </p>
      </div>

      {guides.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {guides.map((item) => (
            <Link
              key={item.meta.slug}
              href={`/guides/${item.meta.slug}`}
              className="group block border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 hover:border-teal-100 transition-all duration-300 bg-white"
            >
              {item.meta.featuredImage ? (
                <div className="relative w-full aspect-[3/2] overflow-hidden">
                  <Image
                    src={item.meta.featuredImage}
                    alt={item.meta.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ) : (
                <div className="w-full aspect-[3/2] bg-gradient-to-br from-amber-50 to-cream-200 flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-amber-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
              )}
              <div className="p-6">
                <h2 className="font-display font-bold text-lg text-navy-900 mb-2 group-hover:text-teal-700 transition-colors leading-snug">
                  {item.meta.title}
                </h2>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                  {item.meta.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {item.meta.readingTime}
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
        <p className="text-gray-500">Guides are coming soon.</p>
      )}
    </div>
  );
}

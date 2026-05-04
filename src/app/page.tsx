import Link from "next/link";
import Image from "next/image";
import { getAllRoundups, getAllReviews, getAllGuides } from "@/lib/mdx";
import { JsonLd } from "@/components/JsonLd";
import { generateWebSiteJsonLd, generateOrganizationJsonLd } from "@/lib/jsonld";

export default function HomePage() {
  const roundups = getAllRoundups().slice(0, 4);
  const reviews = getAllReviews().slice(0, 3);
  const guides = getAllGuides().slice(0, 4);

  return (
    <>
      <JsonLd data={generateWebSiteJsonLd()} />
      <JsonLd data={generateOrganizationJsonLd()} />

      {/* Hero */}
      <section className="hero-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-teal-700 tracking-wide uppercase mb-4">
              Trusted by traveling parents since 2026
            </p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] mb-6">
              <span className="text-navy-900">Travel Lighter.</span>
              <br />
              <span className="text-teal-600">Worry Less.</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed mb-10 max-w-lg">
              Thoroughly researched gear reviews, FAA-approved car seat guides, and
              packing checklists that help families fly stress-free.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/best/travel-strollers-for-flying"
                className="inline-flex items-center gap-2 bg-teal-600 text-white font-semibold px-7 py-3.5 rounded-full hover:bg-teal-700 active:bg-teal-800 transition-colors text-sm shadow-lg shadow-teal-600/25"
              >
                Best Travel Strollers 2026
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/guides/toddler-packing-list"
                className="inline-flex items-center gap-2 bg-white text-gray-800 font-semibold px-7 py-3.5 rounded-full border border-gray-200 hover:border-teal-300 hover:bg-teal-50 transition-all text-sm"
              >
                <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Packing Checklist
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-navy-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-white">118+</p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">Products Reviewed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-white">13</p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">Gear Categories</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-teal-400">43</p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">In-Depth Articles</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-white">100%</p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">Research-Backed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-900 mb-3">
              Everything for Stress-Free Travel
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              From the airport to the hotel room, we have you covered with
              researched gear and practical advice.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Airplane Gear */}
            <Link
              href="/best"
              className="group bg-gradient-to-br from-teal-50 to-white rounded-2xl p-8 border border-teal-100/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-teal-600 group-hover:scale-110 transition-all duration-300">
                <svg className="w-7 h-7 text-teal-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-bold text-navy-900 mb-2">
                Airplane Gear
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                Compact strollers, FAA-approved car seats, and travel essentials
                that fit in overhead bins.
              </p>
              <span className="text-teal-600 text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Browse Gear
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>

            {/* Safety Guides */}
            <Link
              href="/guides"
              className="group bg-gradient-to-br from-amber-50 to-white rounded-2xl p-8 border border-amber-100/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-amber-500 group-hover:scale-110 transition-all duration-300">
                <svg className="w-7 h-7 text-amber-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-bold text-navy-900 mb-2">
                Safety Guides
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                Airline car seat rules, baby-proofing tips, and expert advice to
                keep little ones safe on the road.
              </p>
              <span className="text-amber-600 text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                View Guides
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>

            {/* Packing Lists */}
            <Link
              href="/guides/toddler-packing-list"
              className="group bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-8 border border-emerald-100/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:scale-110 transition-all duration-300">
                <svg className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-bold text-navy-900 mb-2">
                Packing Checklists
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                Interactive, printable checklists for every age group. Check off
                items, save progress, and never forget a thing.
              </p>
              <span className="text-emerald-600 text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Get the List
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Best Picks */}
      <section className="bg-cream-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">Roundups</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-900 mt-1">
                Latest Best Picks
              </h2>
              <p className="text-gray-500 mt-2">
                Updated for Summer 2026 travel season
              </p>
            </div>
            <Link
              href="/best"
              className="text-teal-600 font-semibold text-sm hover:text-teal-800 transition-colors hidden sm:inline-flex items-center gap-1"
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {roundups.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {roundups.map((item) => (
                <Link
                  key={item.meta.slug}
                  href={`/best/${item.meta.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                    {item.meta.featuredImage && (
                      <Image
                        src={item.meta.featuredImage}
                        alt={item.meta.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <span className="absolute top-3 left-3 inline-block text-xs font-bold text-teal-700 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full uppercase tracking-wide">
                      {item.meta.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-bold text-navy-900 mb-2 leading-snug group-hover:text-teal-700 transition-colors">
                      {item.meta.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                      {item.meta.description}
                    </p>
                    <span className="text-xs text-teal-600 font-semibold uppercase tracking-wide">
                      Read Guide &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <Link
            href="/best"
            className="text-teal-600 font-semibold text-sm hover:text-teal-800 transition-colors mt-8 inline-flex items-center gap-1 sm:hidden"
          >
            View All Roundups
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Latest Reviews */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Reviews</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-900 mt-1">
                Latest Reviews
              </h2>
              <p className="text-gray-500 mt-2">
                In-depth, parent-reviewed product reviews
              </p>
            </div>
            <Link
              href="/reviews"
              className="text-teal-600 font-semibold text-sm hover:text-teal-800 transition-colors hidden sm:inline-flex items-center gap-1"
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {reviews.length > 0 && (
            <div className="grid md:grid-cols-3 gap-5">
              {reviews.map((item) => (
                <Link
                  key={item.meta.slug}
                  href={`/reviews/${item.meta.slug}`}
                  className="group block bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 hover:border-teal-100 transition-all duration-300"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                      {item.meta.category}
                    </span>
                    <span className="text-xs text-gray-400">{item.meta.readingTime}</span>
                  </div>
                  <h3 className="font-display font-bold text-navy-900 mb-2 group-hover:text-teal-700 transition-colors leading-snug">
                    {item.meta.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                    {item.meta.description}
                  </p>
                  <span className="text-xs text-teal-600 font-semibold uppercase tracking-wide">
                    Read Review &rarr;
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Guides */}
      <section className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Resources</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-900 mt-1">
                Guides &amp; Checklists
              </h2>
              <p className="text-gray-500 mt-2">
                Everything you need before your next trip
              </p>
            </div>
            <Link
              href="/guides"
              className="text-teal-600 font-semibold text-sm hover:text-teal-800 transition-colors hidden sm:inline-flex items-center gap-1"
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {guides.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-5">
              {guides.map((item) => (
                <Link
                  key={item.meta.slug}
                  href={`/guides/${item.meta.slug}`}
                  className="group flex items-start gap-4 bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 hover:border-teal-100 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-amber-100 transition-colors">
                    <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display font-bold text-navy-900 mb-1 group-hover:text-teal-700 transition-colors leading-snug">
                      {item.meta.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                      {item.meta.description}
                    </p>
                    <span className="text-xs text-teal-600 font-semibold uppercase tracking-wide">
                      Read Guide &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="bg-teal-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
            Planning a Trip with Your Little One?
          </h2>
          <p className="text-teal-100 mb-8 max-w-lg mx-auto">
            Start with our interactive packing checklist — never forget a
            thing, and travel with peace of mind.
          </p>
          <Link
            href="/guides/toddler-packing-list"
            className="inline-flex items-center gap-2 bg-white text-teal-700 font-bold px-8 py-4 rounded-full hover:bg-teal-50 transition-colors text-sm shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Open Packing Checklist
          </Link>
        </div>
      </section>
    </>
  );
}

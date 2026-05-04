import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getContentBySlug,
  getAllReviews,
  getRelatedContent,
} from "@/lib/mdx";
import { getProductsByIds } from "@/lib/products";
import { parseHeadings, parseFAQItems } from "@/lib/headings";
import MdxRenderer from "@/components/mdx/MdxRenderer";
import TableOfContents from "@/components/TableOfContents";

import { RelatedContent } from "@/components/RelatedContent";
import { MentionedProducts } from "@/components/MentionedProducts";
import { ShareButtons } from "@/components/ShareButtons";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import {
  generateBreadcrumbJsonLd,
  generateReviewJsonLd,
  generateProductJsonLd,
  generateFAQJsonLd,
} from "@/lib/jsonld";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllReviews().map((item) => ({ slug: item.meta.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getContentBySlug("reviews", slug, "review");
  if (!item) return {};

  return {
    title: item.meta.seoTitle || item.meta.title,
    description: item.meta.description,
    authors: [{ name: item.meta.author }],
    alternates: { canonical: `/reviews/${slug}` },
    openGraph: {
      title: item.meta.seoTitle || item.meta.title,
      description: item.meta.description,
      type: "article",
      publishedTime: item.meta.publishedAt,
      modifiedTime: item.meta.updatedAt,
      images: [
        item.meta.featuredImage
          ? { url: item.meta.featuredImage, width: 1200, height: 630, alt: item.meta.title }
          : { url: "/opengraph-image", width: 1200, height: 630, alt: "ToddlerTravelGear" },
      ],
      authors: [item.meta.author],
      section: item.meta.category,
      tags: item.meta.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: item.meta.seoTitle || item.meta.title,
      description: item.meta.description,
      images: [item.meta.featuredImage || "/opengraph-image"],
    },
  };
}

export default async function ReviewPage({ params }: Props) {
  const { slug } = await params;
  const item = getContentBySlug("reviews", slug, "review");
  if (!item) notFound();

  const related = getRelatedContent(item.meta);
  const products = getProductsByIds(item.meta.productIds ?? []);
  const path = `/reviews/${slug}`;
  const headings = parseHeadings(item.content);
  const faqItems = parseFAQItems(item.content);
  const showToc = headings.length >= 4;

  const breadcrumbItems = [{ label: "Reviews", href: "/reviews" }, { label: item.meta.title }];

  return (
    <div className={`max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 ${showToc ? "lg:grid lg:grid-cols-[1fr_220px] lg:gap-10" : ""}`}>
      <article>
        <JsonLd data={generateBreadcrumbJsonLd(breadcrumbItems)} />
        {products[0] && (
          <>
            <JsonLd data={generateReviewJsonLd(item.meta, products[0], path)} />
            <JsonLd data={generateProductJsonLd(products[0])} />
          </>
        )}
        {faqItems.length > 0 && (
          <JsonLd data={generateFAQJsonLd(faqItems)} />
        )}

        <Breadcrumbs items={breadcrumbItems} />

        <header className="mb-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wide">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {item.meta.category} Review
          </span>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-navy-900 mt-3 mb-4 leading-tight">
            {item.meta.title}
          </h1>
          <p className="text-gray-500 text-base sm:text-lg leading-relaxed">{item.meta.description}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-5 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {item.meta.author}
            </span>
            <span className="hidden sm:inline text-gray-300">&middot;</span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {item.meta.readingTime}
            </span>
            <span className="hidden sm:inline text-gray-300">&middot;</span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Updated {item.meta.updatedAt}
            </span>
          </div>
        </header>

        {showToc && <TableOfContents headings={headings} />}

        <div className="prose">
          <MdxRenderer source={item.content} />
        </div>

        <ShareButtons title={item.meta.title} url={`https://toddlertravelgear.com${path}`} />

        {products.length > 0 && <MentionedProducts products={products} />}

        {related.length > 0 && <RelatedContent items={related} />}
      </article>

      {showToc && (
        <div className="hidden lg:block">
          <TableOfContents headings={headings} variant="sidebar" />
        </div>
      )}
    </div>
  );
}

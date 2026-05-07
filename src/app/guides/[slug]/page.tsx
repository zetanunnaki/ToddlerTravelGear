import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getContentBySlug,
  getAllGuides,
  getRelatedContent,
} from "@/lib/mdx";
import { getProductsByIds } from "@/lib/products";
import { parseHeadings } from "@/lib/headings";
import { getFAQBySlug } from "@/lib/faq";
import MdxRenderer from "@/components/mdx/MdxRenderer";
import TableOfContents from "@/components/TableOfContents";
import { RelatedContent } from "@/components/RelatedContent";
import { MentionedProducts } from "@/components/MentionedProducts";
import { ShareButtons } from "@/components/ShareButtons";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import {
  generateBreadcrumbJsonLd,
  generateArticleJsonLd,
  generateFAQJsonLd,
} from "@/lib/jsonld";
import { FAQ } from "@/components/FAQ";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllGuides().map((item) => ({ slug: item.meta.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getContentBySlug("guides", slug, "guide");
  if (!item) return {};

  return {
    title: item.meta.seoTitle || item.meta.title,
    description: item.meta.description,
    alternates: { canonical: `/guides/${slug}` },
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

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const item = getContentBySlug("guides", slug, "guide");
  if (!item) notFound();

  const related = getRelatedContent(item.meta);
  const products = getProductsByIds(item.meta.productIds ?? []);
  const path = `/guides/${slug}`;
  const headings = parseHeadings(item.content);
  const faqItems = getFAQBySlug(slug);
  const showToc = headings.length >= 4;

  const breadcrumbItems = [{ label: "Guides", href: "/guides" }, { label: item.meta.title }];

  return (
    <div className={`max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 ${showToc ? "lg:grid lg:grid-cols-[1fr_220px] lg:gap-10" : ""}`}>
      <article>
        <JsonLd data={generateBreadcrumbJsonLd(breadcrumbItems)} />
        <JsonLd data={generateArticleJsonLd(item.meta, path)} />
        {faqItems.length > 0 && (
          <JsonLd data={generateFAQJsonLd(faqItems)} />
        )}

        <Breadcrumbs items={breadcrumbItems} />

        <header className="mb-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wide">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Guide
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

        {faqItems.length > 0 && <FAQ items={faqItems} />}

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

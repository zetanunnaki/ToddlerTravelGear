import Image from "next/image";
import Link from "next/link";
import type { ContentMeta } from "@/lib/mdx";

const typeToPath: Record<string, string> = {
  roundup: "/best",
  review: "/reviews",
  guide: "/guides",
};

const typeLabel: Record<string, string> = {
  roundup: "Best Picks",
  review: "Review",
  guide: "Guide",
};

const typeColor: Record<string, string> = {
  roundup: "text-teal-700 bg-teal-50",
  review: "text-emerald-700 bg-emerald-50",
  guide: "text-amber-700 bg-amber-50",
};

export function RelatedContent({ items }: { items: ContentMeta[] }) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="related-content-heading" className="mt-12 pt-8 border-t border-gray-200">
      <h2 id="related-content-heading" className="font-display text-xl font-bold text-navy-900 mb-5">
        Related Content
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`${typeToPath[item.type]}/${item.slug}`}
            className="group block border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg hover:border-teal-100 hover:-translate-y-0.5 transition-all duration-300"
          >
            {item.featuredImage && (
              <div className="aspect-[4/3] relative bg-gray-50 overflow-hidden">
                <Image
                  src={item.featuredImage}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="p-4">
              <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${typeColor[item.type] ?? "text-teal-700 bg-teal-50"}`}>
                {typeLabel[item.type]}
              </span>
              <h3 className="font-semibold text-navy-900 mt-2 mb-1.5 text-sm group-hover:text-teal-700 transition-colors leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

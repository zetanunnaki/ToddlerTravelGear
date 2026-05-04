import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { getAllReviews } from "@/lib/mdx";

interface MentionedProductsProps {
  products: (Product & { id: string })[];
}

function ProductItem({ product, hasReview }: { product: Product & { id: string }; hasReview: boolean }) {
  const cardClass = `group block border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden ${hasReview ? "hover:shadow-lg hover:border-teal-100 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer" : ""}`;

  const inner = (
    <>
      {product.image && (
        <div className="aspect-square relative bg-gray-50 dark:bg-gray-800 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover ${hasReview ? "group-hover:scale-105 transition-transform duration-300" : ""}`}
          />
        </div>
      )}
      <div className="p-3">
        <p className="text-xs text-gray-500">{product.brand}</p>
        <p className="text-sm font-medium text-navy-900 dark:text-white leading-snug mt-0.5 line-clamp-2">
          {product.name}
        </p>
        {hasReview && (
          <p className="text-xs text-teal-600 font-medium mt-1.5 group-hover:text-teal-700 transition-colors">
            Read review &rarr;
          </p>
        )}
      </div>
    </>
  );

  if (hasReview) {
    return (
      <Link href={`/reviews/${product.id}`} className={cardClass}>
        {inner}
      </Link>
    );
  }

  return <div className={cardClass}>{inner}</div>;
}

export function MentionedProducts({ products }: MentionedProductsProps) {
  if (products.length === 0) return null;

  const reviewSlugs = new Set(getAllReviews().map((r) => r.meta.slug));

  return (
    <section aria-labelledby="mentioned-products-heading" className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
      <h2 id="mentioned-products-heading" className="font-display text-xl font-bold text-navy-900 dark:text-white mb-5 flex items-center gap-2">
        <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        Products Mentioned
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductItem
            key={product.id}
            product={product}
            hasReview={reviewSlugs.has(product.id)}
          />
        ))}
      </div>
    </section>
  );
}

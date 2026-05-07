import Image from "next/image";
import { getProduct } from "@/lib/products";
import { getAffiliateLink } from "@/lib/affiliateConfig";
import { AffiliateLink } from "./AffiliateLink";
import { CompareCheckbox } from "./CompareCheckbox";

interface ProductCardProps {
  productId: string;
  badge?: string;
  reason?: string;
}

export function ProductCard({ productId, badge, reason }: ProductCardProps) {
  const product = getProduct(productId);
  if (!product) return null;
  const affiliate = getAffiliateLink(productId);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-5 sm:p-6 my-6 bg-white dark:bg-gray-800/50 shadow-sm hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row gap-5 sm:gap-6">
        <div className="sm:w-48 flex-shrink-0">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden aspect-square relative">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, 192px"
              className="object-contain p-3"
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-display font-bold text-gray-900 dark:text-white text-lg leading-snug">{product.name}</h3>
            {badge && (
              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {badge}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm text-gray-500">
              {product.brand} &middot; {product.priceHint}
            </p>
            <CompareCheckbox product={{ ...product, id: productId }} />
          </div>
          <p className="text-xs text-gray-400 mb-2">Price may vary</p>

          {reason && (
            <p className="text-sm text-teal-700 font-medium mb-3 bg-teal-50 px-3 py-1.5 rounded-lg inline-block">{reason}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-sm mb-4">
            {Object.entries(product.keySpecs).map(([key, value]) => (
              <div key={key} className="flex items-baseline gap-1">
                <span className="text-gray-500 capitalize text-xs">
                  {key.replace(/([A-Z])/g, " $1").trim()}:
                </span>
                <span className="text-gray-700 font-medium">{value}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 text-sm mb-5">
            <div className="flex-1">
              <p className="font-semibold text-emerald-700 mb-1.5 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                Pros
              </p>
              <ul aria-label="Pros" className="space-y-1">
                {product.pros.map((pro) => (
                  <li key={pro} className="text-gray-600 flex items-start gap-1.5">
                    <span className="text-emerald-500 mt-0.5 flex-shrink-0" aria-hidden="true">&#10003;</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-red-600 mb-1.5 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-6h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                </svg>
                Cons
              </p>
              <ul aria-label="Cons" className="space-y-1">
                {product.cons.map((con) => (
                  <li key={con} className="text-gray-600 flex items-start gap-1.5">
                    <span className="text-red-400 mt-0.5 flex-shrink-0" aria-hidden="true">&times;</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <AffiliateLink
            href={affiliate.url}
            productId={productId}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm shadow-sm"
          >
            {affiliate.ctaLabel}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </AffiliateLink>
        </div>
      </div>
    </div>
  );
}

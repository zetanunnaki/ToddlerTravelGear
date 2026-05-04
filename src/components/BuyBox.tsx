import { getProduct } from "@/lib/products";
import { getAffiliateLink } from "@/lib/affiliateConfig";
import { AffiliateLink } from "./AffiliateLink";

interface BuyBoxProps {
  productId: string;
}

export function BuyBox({ productId }: BuyBoxProps) {
  const product = getProduct(productId);
  if (!product) return null;
  const affiliate = getAffiliateLink(productId);

  return (
    <div className="border-2 border-teal-200 dark:border-teal-800 rounded-2xl p-5 sm:p-6 my-6 bg-gradient-to-b from-teal-50 to-white dark:from-teal-900/30 dark:to-gray-800/50">
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className="font-display font-bold text-gray-900 dark:text-white text-lg">{product.name}</h3>
        <span className="text-sm font-bold text-teal-700 whitespace-nowrap">{product.priceHint}</span>
      </div>
      <p className="text-sm text-gray-500 mb-3">
        by {product.brand}
      </p>

      {product.bestFor.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Best For
          </p>
          <div className="flex flex-wrap gap-1.5">
            {product.bestFor.map((b) => (
              <span
                key={b}
                className="bg-white text-teal-700 text-xs font-medium px-2.5 py-1 rounded-full border border-teal-200"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      )}

      <ul className="space-y-1.5 text-sm text-gray-700 mb-5">
        {product.pros.slice(0, 3).map((pro) => (
          <li key={pro} className="flex items-start gap-2">
            <span className="text-emerald-500 mt-0.5 flex-shrink-0">&#10003;</span>
            {pro}
          </li>
        ))}
      </ul>

      <AffiliateLink
        href={affiliate.url}
        productId={productId}
        className="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-semibold px-5 py-3 rounded-xl transition-colors shadow-sm"
      >
        {affiliate.ctaLabel}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </AffiliateLink>

      <p className="text-xs text-gray-500 mt-2 text-center">
        Price as of last check: {product.priceHint}
      </p>
    </div>
  );
}

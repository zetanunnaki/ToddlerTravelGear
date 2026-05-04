import { getProductsByIds } from "@/lib/products";
import { getAffiliateLink } from "@/lib/affiliateConfig";
import { AffiliateLink } from "./AffiliateLink";

interface ComparisonTableProps {
  productIds: string[];
  columns?: string[];
}

const defaultColumns = ["weight", "fold", "carryOn", "ageRange"];

const columnLabels: Record<string, string> = {
  weight: "Weight",
  fold: "Fold",
  carryOn: "Airline Carry-On",
  ageRange: "Age Range",
  dimensions: "Dimensions",
  capacity: "Capacity",
};

export function ComparisonTable({
  productIds = [],
  columns = defaultColumns,
}: ComparisonTableProps) {
  if (!productIds || productIds.length === 0) return null;
  const products = getProductsByIds(productIds);
  if (products.length === 0) return null;

  return (
    <>
      {/* Mobile: stacked cards */}
      <div className="my-8 space-y-4 md:hidden">
        {products.map((product) => {
          const affiliate = getAffiliateLink(product.id);
          return (
          <div key={product.id} className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm">
            <h4 className="font-display font-bold text-gray-900 mb-1">{product.name}</h4>
            <p className="text-xs text-gray-500 mb-3">{product.brand} &middot; {product.priceHint}</p>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
              {columns.map((col) => (
                <div key={col}>
                  <dt className="text-gray-500 text-xs">{columnLabels[col] || col}</dt>
                  <dd className="text-gray-700 font-medium">{product.keySpecs[col] || "—"}</dd>
                </div>
              ))}
            </dl>
            <AffiliateLink
              href={affiliate.url}
              productId={product.id}
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              {affiliate.ctaLabel}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </AffiliateLink>
          </div>
          );
        })}
      </div>

      {/* Desktop: table */}
      <div className="my-8 overflow-x-auto hidden md:block rounded-2xl border border-gray-200 dark:border-gray-700">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th scope="col" className="text-left px-4 py-3 border-b border-gray-200 font-semibold text-gray-700 min-w-[140px]">
                Product
              </th>
              {columns.map((col) => (
                <th
                  scope="col"
                  key={col}
                  className="text-left px-4 py-3 border-b border-gray-200 font-semibold text-gray-700 min-w-[100px]"
                >
                  {columnLabels[col] || col}
                </th>
              ))}
              <th scope="col" className="text-left px-4 py-3 border-b border-gray-200 font-semibold text-gray-700 min-w-[80px]">
                Price
              </th>
              <th scope="col" className="px-4 py-3 border-b border-gray-200 min-w-[110px]">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, i) => {
              const affiliate = getAffiliateLink(product.id);
              return (
              <tr key={product.id} className={`hover:bg-teal-50/50 transition-colors ${i < products.length - 1 ? "border-b border-gray-100" : ""}`}>
                <td className="px-4 py-3 font-medium text-gray-900">
                  <div>{product.name}</div>
                  <div className="text-xs text-gray-500 font-normal">{product.brand}</div>
                </td>
                {columns.map((col) => (
                  <td key={col} className="px-4 py-3 text-gray-600">
                    {product.keySpecs[col] || "—"}
                  </td>
                ))}
                <td className="px-4 py-3 text-gray-700 font-medium">
                  {product.priceHint}
                </td>
                <td className="px-4 py-3 text-center">
                  <AffiliateLink
                    href={affiliate.url}
                    productId={product.id}
                    className="inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors"
                  >
                    {affiliate.shortCtaLabel}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </AffiliateLink>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

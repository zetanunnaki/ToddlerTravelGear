import productsData from "@/data/products.json";

export interface ProductSpecs {
  weight?: string;
  carryOn?: string;
  fold?: string;
  ageRange?: string;
  dimensions?: string;
  capacity?: string;
  [key: string]: string | undefined;
}

export interface Product {
  name: string;
  brand: string;
  category: string;
  priceHint: string;
  image: string;
  amazonUrl: string;
  keySpecs: ProductSpecs;
  bestFor: string[];
  pros: string[];
  cons: string[];
  safetyNotes: string[];
}

const products = productsData as Record<string, Product>;

export function getProduct(productId: string): Product | null {
  return products[productId] ?? null;
}

export function getProductsByIds(ids: string[]): (Product & { id: string })[] {
  return ids
    .map((id) => {
      const p = products[id];
      return p ? { ...p, id } : null;
    })
    .filter((p): p is Product & { id: string } => p !== null);
}

export function getProductsByCategory(
  category: string
): (Product & { id: string })[] {
  return Object.entries(products)
    .filter(([, p]) => p.category === category)
    .map(([id, p]) => ({ ...p, id }));
}

export function getAllProducts(): (Product & { id: string })[] {
  return Object.entries(products).map(([id, p]) => ({ ...p, id }));
}

export function getAllCategories(): string[] {
  const cats = new Set(Object.values(products).map((p) => p.category));
  return Array.from(cats).sort();
}

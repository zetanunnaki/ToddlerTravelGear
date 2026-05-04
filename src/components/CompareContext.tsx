"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Product } from "@/lib/products";

export interface CompareProduct extends Product {
  id: string;
}

interface CompareContextValue {
  selected: CompareProduct[];
  toggle: (product: CompareProduct) => void;
  isSelected: (id: string) => boolean;
  clear: () => void;
  showView: boolean;
  setShowView: (v: boolean) => void;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<CompareProduct[]>([]);
  const [showView, setShowView] = useState(false);

  const toggle = useCallback((product: CompareProduct) => {
    setSelected((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) return prev.filter((p) => p.id !== product.id);
      if (prev.length >= 3) return prev;
      return [...prev, product];
    });
  }, []);

  const isSelected = useCallback(
    (id: string) => selected.some((p) => p.id === id),
    [selected]
  );

  const clear = useCallback(() => {
    setSelected([]);
    setShowView(false);
  }, []);

  return (
    <CompareContext value={{ selected, toggle, isSelected, clear, showView, setShowView }}>
      {children}
    </CompareContext>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}

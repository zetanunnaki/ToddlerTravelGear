"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

interface ArticleResult {
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  type: "roundup" | "review" | "guide";
  slug: string;
  url: string;
}

interface ProductResult {
  name: string;
  brand: string;
  category: string;
  id: string;
  image: string;
  priceHint: string;
}

interface SearchIndex {
  articles: ArticleResult[];
  products: ProductResult[];
}

function highlightMatch(text: string, query: string) {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-teal-100 text-teal-900 rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

const typeLabels: Record<string, string> = {
  roundup: "Roundup",
  review: "Review",
  guide: "Guide",
};

const typeColors: Record<string, string> = {
  roundup: "bg-teal-50 text-teal-700",
  review: "bg-emerald-50 text-emerald-700",
  guide: "bg-amber-50 text-amber-700",
};

export default function SearchDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchIndex | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open && !index) {
      fetch("/search-index.json")
        .then((r) => r.json())
        .then(setIndex)
        .catch(() => {});
    }
    if (open) {
      setQuery("");
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, index]);

  const search = useCallback(
    (q: string) => {
      if (!index || q.length < 2) return { articles: [], products: [] };
      const lower = q.toLowerCase();
      const articles = index.articles.filter(
        (a) =>
          a.title.toLowerCase().includes(lower) ||
          a.excerpt.toLowerCase().includes(lower) ||
          a.category.toLowerCase().includes(lower) ||
          a.tags.some((t) => t.toLowerCase().includes(lower))
      );
      const products = index.products.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.brand.toLowerCase().includes(lower) ||
          p.category.toLowerCase().includes(lower)
      );
      return { articles: articles.slice(0, 8), products: products.slice(0, 8) };
    },
    [index]
  );

  const results = search(query);
  const allResults = [
    ...results.articles.map((a) => ({ kind: "article" as const, data: a })),
    ...results.products.map((p) => ({ kind: "product" as const, data: p })),
  ];

  const navigate = (url: string) => {
    onClose();
    router.push(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, allResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && allResults[activeIdx]) {
      e.preventDefault();
      const item = allResults[activeIdx];
      if (item.kind === "article") {
        navigate((item.data as ArticleResult).url);
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  useEffect(() => {
    if (!listRef.current) return;
    const active = listRef.current.querySelector("[data-active='true']");
    active?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  useEffect(() => {
    if (!open) return;
    const dialog = document.getElementById("search-dialog");
    if (!dialog) return;
    const focusable = dialog.querySelectorAll<HTMLElement>(
      'input, button, [tabindex]:not([tabindex="-1"]), a[href]'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    dialog.addEventListener("keydown", trap);
    return () => dialog.removeEventListener("keydown", trap);
  }, [open, allResults.length]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
      onClick={onClose}
      role="presentation"
    >
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
      <div
        id="search-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Search articles and products"
        className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <svg
            className="w-5 h-5 text-gray-500 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={allResults.length > 0}
            aria-controls="search-results"
            aria-activedescendant={allResults[activeIdx] ? `search-result-${activeIdx}` : undefined}
            aria-autocomplete="list"
            aria-label="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search articles, products, guides..."
            className="flex-1 text-sm text-gray-900 placeholder:text-gray-500 outline-none bg-transparent"
          />
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-semibold text-gray-500 bg-gray-100 rounded">
            ESC
          </kbd>
        </div>

        <div ref={listRef} id="search-results" role="listbox" aria-label="Search results" className="max-h-[60vh] overflow-y-auto">
          {query.length < 2 ? (
            <div className="px-4 py-10 text-center text-sm text-gray-500">
              Type at least 2 characters to search
            </div>
          ) : allResults.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-gray-500">
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <>
              {results.articles.length > 0 && (
                <div>
                  <div className="px-4 pt-3 pb-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    Articles
                  </div>
                  {results.articles.map((a, i) => {
                    const globalIdx = i;
                    return (
                      <button
                        key={a.url}
                        id={`search-result-${globalIdx}`}
                        role="option"
                        aria-selected={activeIdx === globalIdx}
                        data-active={activeIdx === globalIdx}
                        onClick={() => navigate(a.url)}
                        className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
                          activeIdx === globalIdx
                            ? "bg-teal-50"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                                typeColors[a.type] || ""
                              }`}
                            >
                              {typeLabels[a.type]}
                            </span>
                            <span className="text-[10px] text-gray-500">
                              {a.category}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-900 leading-snug">
                            {highlightMatch(a.title, query)}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                            {highlightMatch(a.excerpt.slice(0, 100), query)}
                          </p>
                        </div>
                        <svg
                          className="w-4 h-4 text-gray-300 mt-1 shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    );
                  })}
                </div>
              )}

              {results.products.length > 0 && (
                <div>
                  <div className="px-4 pt-3 pb-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-t border-gray-100">
                    Products
                  </div>
                  {results.products.map((p, i) => {
                    const globalIdx = results.articles.length + i;
                    return (
                      <div
                        key={p.id}
                        id={`search-result-${globalIdx}`}
                        role="option"
                        aria-selected={activeIdx === globalIdx}
                        data-active={activeIdx === globalIdx}
                        tabIndex={0}
                        className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                          activeIdx === globalIdx
                            ? "bg-teal-50"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 leading-snug">
                            {highlightMatch(p.name, query)}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {highlightMatch(p.brand, query)} &middot;{" "}
                            {p.category}
                            {p.priceHint && ` &middot; ${p.priceHint}`}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500">
          <span>
            <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px] font-mono">
              &uarr;
            </kbd>{" "}
            <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px] font-mono">
              &darr;
            </kbd>{" "}
            to navigate
          </span>
          <span>
            <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px] font-mono">
              Enter
            </kbd>{" "}
            to open
          </span>
        </div>
      </div>
    </div>
  );
}

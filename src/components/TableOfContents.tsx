"use client";

import { useState, useEffect, useRef } from "react";
import type { Heading } from "@/lib/headings";

export default function TableOfContents({
  headings,
  variant = "mobile",
}: {
  headings: Heading[];
  variant?: "mobile" | "sidebar";
}) {
  const [activeId, setActiveId] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const h2Ids = new Set(headings.filter((h) => h.level === 2).map((h) => h.id));
    const h3ToH2 = new Map<string, string>();
    let lastH2 = "";
    for (const h of headings) {
      if (h.level === 2) lastH2 = h.id;
      else if (h.level === 3 && lastH2) h3ToH2.set(h.id, lastH2);
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const id = visible[0].target.id;
          if (variant === "sidebar" && !h2Ids.has(id)) {
            setActiveId(h3ToH2.get(id) ?? id);
          } else {
            setActiveId(id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    elements.forEach((el) => observerRef.current!.observe(el));
    return () => observerRef.current?.disconnect();
  }, [headings, variant]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top: y, behavior: "smooth" });
    setActiveId(id);
    setMobileOpen(false);
  };

  const renderList = (items: Heading[]) => (
    <nav aria-label="Table of contents">
      <ul className="space-y-0.5">
        {items.map((h) => (
          <li key={h.id}>
            <button
              onClick={() => scrollTo(h.id)}
              className={`block w-full text-left text-sm leading-relaxed py-1 transition-colors ${
                h.level === 3 ? "pl-4" : ""
              } ${
                activeId === h.id
                  ? "text-teal-700 font-semibold"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {h.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );

  if (variant === "sidebar") {
    const h2Only = headings.filter((h) => h.level === 2);
    return (
      <div className="sticky top-24">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">
          On this page
        </p>
        {renderList(h2Only)}
      </div>
    );
  }

  return (
    <div className="lg:hidden mb-8 border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-expanded={mobileOpen}
        aria-controls="toc-mobile-panel"
        className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 text-sm font-semibold text-gray-700"
      >
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          Table of Contents
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${mobileOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div id="toc-mobile-panel" hidden={!mobileOpen} className={mobileOpen ? "px-4 py-3 border-t border-gray-100" : ""}>
        {mobileOpen && renderList(headings)}
      </div>
    </div>
  );
}

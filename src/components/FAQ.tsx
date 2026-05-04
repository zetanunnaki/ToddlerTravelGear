"use client";

import { useState } from "react";
import { generateFAQJsonLd } from "@/lib/jsonld";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
}

export function FAQ({ items = [] }: FAQProps) {
  const [open, setOpen] = useState<number | null>(null);
  if (!items || items.length === 0) return null;

  return (
    <div className="my-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQJsonLd(items)) }}
      />
      <h2 className="font-display text-xl font-bold text-gray-900 mb-4">
        Frequently Asked Questions
      </h2>
      <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden">
        {items.map((item, i) => (
          <div key={i} className={open === i ? "bg-gray-50" : ""}>
            <h3>
              <button
                id={`faq-question-${i}`}
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left px-5 sm:px-6 py-4 flex items-center justify-between gap-3 sm:gap-4 hover:bg-gray-50 transition-colors min-h-[48px]"
                aria-expanded={open === i}
                aria-controls={`faq-answer-${i}`}
              >
                <span className="font-semibold text-gray-900 text-sm">
                  {item.question}
                </span>
                <svg
                  className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${
                    open === i ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </h3>
            <div
              id={`faq-answer-${i}`}
              role="region"
              aria-labelledby={`faq-question-${i}`}
              hidden={open !== i}
              className={open === i ? "px-5 sm:px-6 pb-5 text-sm text-gray-600 leading-relaxed" : ""}
            >
              {open === i && item.answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

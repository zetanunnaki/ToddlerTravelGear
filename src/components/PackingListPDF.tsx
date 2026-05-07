"use client";

import { useState } from "react";
import { usePackingList, encodeShareState } from "@/components/PackingListProvider";
import { TRIP_TYPES } from "@/data/trip-type-items";

export function PackingListPDF() {
  const { tripType, ageRange } = usePackingList();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const encoded = encodeShareState(ageRange, tripType);
    const url = `${window.location.origin}${window.location.pathname}?s=${encoded}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Toddler Packing Checklist",
          text: `My packing checklist for ${ageRange} — tap the link to see what I've packed so far!`,
          url,
        });
        return;
      } catch {}
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handlePDF = () => {
    const sections = document.querySelectorAll('[id^="checklist-"]');
    if (sections.length === 0) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
      .map(s => s.outerHTML)
      .join("\n");

    const tripLabel = tripType !== "all" && TRIP_TYPES[tripType]
      ? `${TRIP_TYPES[tripType].icon} ${TRIP_TYPES[tripType].label} Trip`
      : "All Items";

    const sectionsHtml = Array.from(sections).map(s => s.outerHTML).join("<hr style='margin:24px 0;border-color:#e5e7eb;'>");

    printWindow.document.write(`<!DOCTYPE html><html><head>
      <title>Packing Checklist — ToddlerTravelGear</title>
      ${styles}
      <style>
        body { padding: 24px; max-width: 800px; margin: 0 auto; }
        @media print {
          .print\\:hidden { display: none !important; }
          body { padding: 12px; }
        }
      </style>
    </head><body>
      <div style="text-align:center;margin-bottom:24px;">
        <h1 style="font-size:20px;font-weight:bold;margin:0;">Toddler Packing Checklist</h1>
        <p style="font-size:14px;color:#6b7280;margin:4px 0;">${tripLabel} · ${ageRange} — toddlertravelgear.com</p>
      </div>
      ${sectionsHtml}
    </body></html>`);

    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  };

  return (
    <div className="grid grid-cols-2 gap-3 print:hidden">
      <button
        onClick={handleShare}
        className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors min-h-[48px]"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        {copied ? "Link Copied!" : "Save Progress"}
      </button>
      <button
        onClick={handlePDF}
        className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-teal-700 bg-white border-2 border-teal-200 rounded-lg hover:bg-teal-50 hover:border-teal-300 transition-colors min-h-[48px]"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Download PDF
      </button>
    </div>
  );
}

"use client";

import { usePackingList } from "@/components/PackingListProvider";
import { TRIP_TYPES } from "@/data/trip-type-items";

export function PackingListPDF() {
  const { tripType } = usePackingList();

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
        <p style="font-size:14px;color:#6b7280;margin:4px 0;">${tripLabel} — toddlertravelgear.com/guides/toddler-packing-list</p>
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
    <button
      onClick={handlePDF}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-teal-700 bg-white border-2 border-teal-200 rounded-lg hover:bg-teal-50 hover:border-teal-300 transition-colors print:hidden"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Download PDF
    </button>
  );
}

"use client";

import { useCompare } from "./CompareContext";
import { CompareView } from "./CompareView";

export function CompareBar() {
  const { selected, clear, showView, setShowView } = useCompare();

  if (selected.length < 2) return null;

  return (
    <>
      <div className="fixed bottom-0 inset-x-0 z-40 p-4" role="region" aria-label="Product comparison">
        <div className="max-w-3xl mx-auto bg-navy-900 text-white rounded-2xl shadow-2xl border border-gray-700 px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex -space-x-2" aria-hidden="true">
              {selected.map((p) => (
                <div
                  key={p.id}
                  className="w-8 h-8 rounded-full bg-teal-600 border-2 border-navy-900 flex items-center justify-center text-[10px] font-bold"
                  title={p.name}
                >
                  {p.name.charAt(0)}
                </div>
              ))}
            </div>
            <span className="text-sm font-medium truncate">
              {selected.length} product{selected.length > 1 ? "s" : ""} selected
            </span>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={clear}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Clear
            </button>
            <button
              onClick={() => setShowView(true)}
              className="text-sm font-semibold bg-teal-600 hover:bg-teal-500 text-white px-5 py-2 rounded-lg transition-colors"
            >
              Compare {selected.length} products
            </button>
          </div>
        </div>
      </div>

      {showView && <CompareView />}
    </>
  );
}

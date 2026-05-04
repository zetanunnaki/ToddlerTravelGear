"use client";

import { useCompare } from "./CompareContext";

export function CompareView() {
  const { selected, setShowView } = useCompare();

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-8" role="presentation">
      <div role="dialog" aria-modal="true" aria-labelledby="compare-dialog-title" className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 id="compare-dialog-title" className="font-display text-lg font-bold text-navy-900">
            Side-by-Side Comparison
          </h2>
          <button
            onClick={() => setShowView(false)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close comparison"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th scope="col" className="text-left px-5 py-3 text-gray-500 font-medium min-w-[120px]">
                  <span className="sr-only">Attribute</span>
                </th>
                {selected.map((p) => (
                  <th scope="col" key={p.id} className="text-left px-5 py-3 font-semibold text-navy-900 min-w-[200px]">
                    <div>{p.name}</div>
                    <div className="text-xs text-gray-500 font-normal">{p.brand}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <Row label="Price">
                {selected.map((p) => (
                  <td key={p.id} className="px-5 py-3 font-medium text-teal-700">
                    {p.priceHint}
                  </td>
                ))}
              </Row>
              <Row label="Weight">
                {selected.map((p) => (
                  <td key={p.id} className="px-5 py-3 text-gray-700">
                    {p.keySpecs.weight ?? "—"}
                  </td>
                ))}
              </Row>
              <Row label="Dimensions">
                {selected.map((p) => (
                  <td key={p.id} className="px-5 py-3 text-gray-700">
                    {p.keySpecs.dimensions ?? p.keySpecs.fold ?? "—"}
                  </td>
                ))}
              </Row>
              <Row label="Age Range">
                {selected.map((p) => (
                  <td key={p.id} className="px-5 py-3 text-gray-700">
                    {p.keySpecs.ageRange ?? "—"}
                  </td>
                ))}
              </Row>
              <Row label="Best For">
                {selected.map((p) => (
                  <td key={p.id} className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.bestFor.map((b) => (
                        <span key={b} className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">
                          {b}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </Row>
              <Row label="Pros">
                {selected.map((p) => (
                  <td key={p.id} className="px-5 py-3">
                    <ul className="space-y-1">
                      {p.pros.map((pro) => (
                        <li key={pro} className="text-gray-600 flex items-start gap-1.5">
                          <span className="text-emerald-500 mt-0.5 flex-shrink-0" aria-hidden="true">&#10003;</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </Row>
              <Row label="Cons">
                {selected.map((p) => (
                  <td key={p.id} className="px-5 py-3">
                    <ul className="space-y-1">
                      {p.cons.map((con) => (
                        <li key={con} className="text-gray-600 flex items-start gap-1.5">
                          <span className="text-red-400 mt-0.5 flex-shrink-0" aria-hidden="true">&times;</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </Row>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr className="border-b border-gray-50">
      <td className="px-5 py-3 text-gray-500 font-medium align-top">{label}</td>
      {children}
    </tr>
  );
}

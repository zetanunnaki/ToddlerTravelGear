interface SafetyNoteProps {
  children: React.ReactNode;
  title?: string;
}

export function SafetyNote({
  children,
  title = "Safety Note",
}: SafetyNoteProps) {
  return (
    <aside role="note" aria-label={title} className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-5 my-6">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0" aria-hidden="true">
          <svg
            className="w-5 h-5 text-amber-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div>
          <p className="font-bold text-amber-800 text-sm mb-1">{title}</p>
          <div className="text-sm text-amber-700 leading-relaxed [&>p]:mb-2 [&>ul]:list-disc [&>ul]:pl-4">
            {children}
          </div>
        </div>
      </div>
    </aside>
  );
}

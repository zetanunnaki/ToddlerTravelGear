export function AffiliateDisclaimer() {
  return (
    <div className="bg-teal-50 border border-teal-200 rounded-xl px-5 py-3.5 mb-6 text-sm text-teal-800 flex items-start gap-2.5">
      <svg className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p>
        <strong>Disclosure:</strong> ToddlerTravelGear is reader-supported. We may
        earn a commission if you buy through links on our site — at no extra cost to
        you.{" "}
        <a href="/affiliate-disclosure" className="underline underline-offset-2 hover:text-teal-900 transition-colors">
          Learn more
        </a>
      </p>
    </div>
  );
}

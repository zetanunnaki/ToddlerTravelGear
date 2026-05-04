import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about ToddlerTravelGear — who we are and why we review travel gear for families with young children.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">About Us</h1>
      <div className="prose max-w-none">
        <p>
          ToddlerTravelGear was created by parents who got tired of wading
          through generic &ldquo;best of&rdquo; lists that clearly never folded
          a stroller one-handed while holding a squirmy toddler at the airport
          gate.
        </p>
        <p>
          We focus exclusively on travel gear for families with babies and
          toddlers (ages 0–4). Every product we recommend has been evaluated
          against the real-world scenarios parents face: Will it fit in the
          overhead bin? Is it actually FAA-approved? Can you set it up in a dark
          hotel room without waking the baby?
        </p>
        <h2>Our approach</h2>
        <ul>
          <li>
            <strong>Safety first:</strong> We cross-reference airline rules, FAA
            guidance, and manufacturer specs so you don&apos;t have to.
          </li>
          <li>
            <strong>Honest trade-offs:</strong> No product is perfect. We tell
            you what works, what doesn&apos;t, and who each product is actually
            best for.
          </li>
          <li>
            <strong>Based on real parent reviews:</strong> Our recommendations come from
            real parent feedback, not spec-sheet comparisons.
          </li>
        </ul>
        <h2>How we make money</h2>
        <p>
          ToddlerTravelGear is reader-supported. When you buy through our links,
          we may earn a small affiliate commission at no extra cost to you. This
          supports the site and lets us keep testing gear. We never let affiliate
          relationships influence our recommendations.
        </p>
      </div>
    </div>
  );
}

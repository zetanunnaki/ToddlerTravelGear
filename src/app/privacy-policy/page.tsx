import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "ToddlerTravelGear privacy policy — how we collect, use, and protect your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Privacy Policy
      </h1>
      <div className="prose max-w-none">
        <p>
          <em>Last updated: April 2026</em>
        </p>
        <h2>Information we collect</h2>
        <p>
          ToddlerTravelGear.com collects limited information through standard
          web analytics (Google Analytics) to understand how visitors use our
          site. This may include:
        </p>
        <ul>
          <li>Pages visited and time on site</li>
          <li>Referring website or search terms</li>
          <li>Browser type and device information</li>
          <li>General geographic location (country/region level)</li>
        </ul>
        <p>
          We do not collect personally identifiable information unless you
          voluntarily provide it (e.g., by emailing us).
        </p>
        <h2>Cookies</h2>
        <p>
          This site uses cookies for analytics and to support affiliate tracking.
          Third-party services (Google Analytics, Amazon Associates) may set
          their own cookies. You can manage cookie preferences through your
          browser settings.
        </p>
        <h2>Affiliate links</h2>
        <p>
          When you click an affiliate link, the destination site (e.g.,
          Amazon.com) may collect information according to its own privacy
          policy. We encourage you to review those policies.
        </p>
        <h2>Third-party services</h2>
        <ul>
          <li>
            <strong>Google Analytics:</strong> Used for website traffic analysis.
            See Google&apos;s privacy policy for details.
          </li>
          <li>
            <strong>Amazon Associates:</strong> Used for affiliate tracking. See
            Amazon&apos;s privacy notice for details.
          </li>
        </ul>
        <h2>Children&apos;s privacy</h2>
        <p>
          Our site is intended for adult parents and caregivers. We do not
          knowingly collect information from children under 13.
        </p>
        <h2>Contact</h2>
        <p>
          For privacy-related questions, email us at{" "}
          <a href="mailto:hello@toddlertravelgear.com">
            hello@toddlertravelgear.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}

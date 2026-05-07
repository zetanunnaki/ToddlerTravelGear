import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for ToddlerTravelGear.com — please read these terms carefully before using our site.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Terms of Service
      </h1>
      <div className="prose dark:prose-invert max-w-none">
        <p>
          <em>Last updated: May 2026</em>
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using ToddlerTravelGear.com (&quot;the Site&quot;),
          you agree to be bound by these Terms of Service (&quot;Terms&quot;).
          If you do not agree to all of these Terms, do not use the Site. We
          reserve the right to modify these Terms at any time, and your
          continued use of the Site after any changes constitutes acceptance of
          the updated Terms.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          ToddlerTravelGear.com is an informational website that provides gear
          reviews, buying guides, packing lists, and recommendations for parents
          traveling with babies and toddlers. The Site publishes editorial
          content based on research, hands-on testing, and expert analysis. We
          do not sell products directly — instead, we link to third-party
          retailers where you can purchase the products we review.
        </p>

        <h2>3. Affiliate Disclosure</h2>
        <p>
          ToddlerTravelGear.com is a participant in affiliate programs,
          including the Amazon Services LLC Associates Program and other
          affiliate advertising programs. When you click on affiliate links on
          our Site and make a purchase, we may earn a commission at no additional
          cost to you. These commissions help fund the operation of this Site and
          allow us to continue providing free content.
        </p>
        <p>
          Affiliate relationships do not influence our editorial opinions or
          product rankings. We recommend products based on quality, safety, and
          value — not commission rates. For full details, see our{" "}
          <Link href="/affiliate-disclosure">Affiliate Disclosure</Link>.
        </p>

        <h2>4. Content Accuracy and Disclaimer</h2>
        <p>
          We strive to provide accurate, up-to-date information. However, all
          content on the Site is provided &quot;as is&quot; and &quot;as
          available&quot; without warranties of any kind, either express or
          implied. Specifically:
        </p>
        <ul>
          <li>
            <strong>Prices</strong> displayed are approximate and may change at
            any time. Always verify the current price at the retailer before
            purchasing.
          </li>
          <li>
            <strong>Product specifications</strong> (weight, dimensions, age
            ranges) are sourced from manufacturers and may be updated without
            notice.
          </li>
          <li>
            <strong>Safety information</strong> is provided for general guidance
            only. Always follow the manufacturer&apos;s instructions, check for
            recalls on the CPSC website, and consult your pediatrician for
            medical or safety concerns.
          </li>
          <li>
            <strong>Airline policies</strong> referenced in our guides may vary
            by carrier and change without notice. Verify directly with your
            airline before travel.
          </li>
        </ul>
        <p>
          ToddlerTravelGear.com is not a substitute for professional medical,
          safety, or legal advice.
        </p>

        <h2>5. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by applicable law,
          ToddlerTravelGear.com, its owners, authors, and affiliates shall not
          be liable for any direct, indirect, incidental, special,
          consequential, or punitive damages arising out of or related to:
        </p>
        <ul>
          <li>Your use of, or inability to use, the Site or its content</li>
          <li>
            Any product you purchase through affiliate links on the Site
          </li>
          <li>
            Any errors, inaccuracies, or omissions in our content
          </li>
          <li>
            Any personal injury or property damage resulting from products
            reviewed or recommended on the Site
          </li>
          <li>
            Any unauthorized access to or alteration of your data
          </li>
        </ul>
        <p>
          Your sole remedy for dissatisfaction with the Site is to stop using it.
        </p>

        <h2>6. Intellectual Property</h2>
        <p>
          All original content on ToddlerTravelGear.com — including text,
          graphics, logos, images, and the selection and arrangement thereof — is
          the property of ToddlerTravelGear.com and is protected by copyright
          and other intellectual property laws. You may not:
        </p>
        <ul>
          <li>
            Reproduce, distribute, or republish any content without prior
            written permission
          </li>
          <li>
            Use our content to train AI models or for automated scraping without
            authorization
          </li>
          <li>
            Remove any copyright, trademark, or other proprietary notices from
            our content
          </li>
        </ul>
        <p>
          Product names, brand names, and images referenced on the Site are
          trademarks of their respective owners and are used for identification
          and review purposes only.
        </p>

        <h2>7. User Conduct</h2>
        <p>
          When using the Site, you agree not to:
        </p>
        <ul>
          <li>
            Use the Site for any unlawful purpose or in violation of any
            applicable laws
          </li>
          <li>
            Attempt to interfere with or disrupt the operation of the Site
          </li>
          <li>
            Use automated tools (bots, scrapers, spiders) to access the Site
            without our express written permission
          </li>
          <li>
            Transmit any viruses, malware, or other harmful code
          </li>
          <li>
            Impersonate any person or entity, or misrepresent your affiliation
            with any person or entity
          </li>
        </ul>

        <h2>8. Third-Party Links</h2>
        <p>
          The Site contains links to third-party websites, including retailer
          product pages and manufacturer sites. These links are provided for
          your convenience and do not signify our endorsement of those sites. We
          have no control over and assume no responsibility for the content,
          privacy policies, or practices of any third-party sites. We encourage
          you to review the terms and privacy policies of any third-party site
          you visit.
        </p>

        <h2>9. Privacy</h2>
        <p>
          Your use of the Site is also governed by our{" "}
          <Link href="/privacy-policy">Privacy Policy</Link>, which describes
          how we collect, use, and protect your information. By using the Site,
          you consent to the practices described in the Privacy Policy.
        </p>

        <h2>10. Changes to These Terms</h2>
        <p>
          We reserve the right to update or modify these Terms at any time
          without prior notice. Changes will be effective immediately upon
          posting to the Site. The &quot;Last updated&quot; date at the top of
          this page indicates when these Terms were most recently revised. Your
          continued use of the Site after any modifications constitutes your
          acceptance of the revised Terms.
        </p>

        <h2>11. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the
          laws of [YOUR STATE/COUNTRY], without regard to its conflict of law
          provisions. Any disputes arising under these Terms shall be resolved in
          the courts of [YOUR STATE/COUNTRY].
        </p>

        <h2>12. Contact</h2>
        <p>
          If you have questions about these Terms, please contact us at{" "}
          <a href="mailto:hello@toddlertravelgear.com">
            hello@toddlertravelgear.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}

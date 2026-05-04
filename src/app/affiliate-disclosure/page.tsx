import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description:
    "ToddlerTravelGear affiliate disclosure — how we earn revenue and our commitment to honest recommendations.",
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Affiliate Disclosure
      </h1>
      <div className="prose max-w-none">
        <p>
          ToddlerTravelGear.com is a participant in the Amazon Services LLC
          Associates Program, an affiliate advertising program designed to
          provide a means for sites to earn advertising fees by advertising and
          linking to Amazon.com.
        </p>
        <p>
          When you click on product links on this site and make a purchase, we
          may receive a small commission at no additional cost to you. This
          commission helps us maintain the site, test new products, and produce
          free content for parents.
        </p>
        <h2>Our editorial independence</h2>
        <p>
          Affiliate relationships never influence our product recommendations.
          We recommend products based on our own research, analysis, and
          editorial judgment. Products that don&apos;t meet our standards are not
          featured, regardless of commission rates.
        </p>
        <h2>FTC compliance</h2>
        <p>
          In accordance with FTC guidelines, we disclose our affiliate
          relationships on every page that contains affiliate links. You will
          see a disclosure notice at the top of all our product roundups and
          reviews.
        </p>
        <p>
          If you have any questions about our affiliate program, please{" "}
          <a href="/contact">contact us</a>.
        </p>
      </div>
    </div>
  );
}

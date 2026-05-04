import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the ToddlerTravelGear team for questions, feedback, or partnership inquiries.",
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h1>
      <div className="prose max-w-none">
        <p>
          Have a question, suggestion, or product you think we should review?
          We&apos;d love to hear from you.
        </p>
        <p>
          Email us at{" "}
          <a href="mailto:hello@toddlertravelgear.com">
            hello@toddlertravelgear.com
          </a>
        </p>
        <p>
          We read every message and aim to respond within 2 business days.
        </p>
        <h2>For brands &amp; PR</h2>
        <p>
          If you have a product you think would be a good fit for our audience,
          please reach out at the email above. We only feature products that meet
          our editorial standards and are genuinely useful for traveling
          families.
        </p>
      </div>
    </div>
  );
}

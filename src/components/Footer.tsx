"use client";

import Link from "next/link";
import { getActiveSocialLinks } from "@/lib/social";

export default function Footer() {
  const socialLinks = getActiveSocialLinks();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-navy-900 text-gray-400 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-teal-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <div className="leading-tight">
                <span className="text-base font-bold text-white">ToddlerTravel</span>
                <br />
                <span className="text-[10px] font-bold text-teal-400 tracking-wider uppercase">GEAR.COM</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Travel lighter. Worry less. Honest, safety-first gear
              recommendations for parents of babies and toddlers.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Content</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/best" className="text-gray-400 hover:text-teal-400 transition-colors">
                  Best Picks
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="text-gray-400 hover:text-teal-400 transition-colors">
                  Reviews
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-gray-400 hover:text-teal-400 transition-colors">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/guides/toddler-packing-list" className="text-gray-400 hover:text-teal-400 transition-colors">
                  Packing Checklist
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-teal-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-teal-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/affiliate-disclosure" className="text-gray-400 hover:text-teal-400 transition-colors">
                  Affiliate Disclosure
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-teal-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-teal-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {socialLinks.length > 0 && (
          <div className="mt-8 flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="text-gray-500 hover:text-teal-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d={link.icon} />
                </svg>
              </a>
            ))}
          </div>
        )}

        <div className="mt-10 pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-xs text-gray-500 leading-relaxed max-w-xl">
                <strong className="text-gray-400">Disclosure:</strong> ToddlerTravelGear is reader-supported. We may earn a commission if you buy through our links — at no extra cost to you.{" "}
                <Link href="/affiliate-disclosure" className="text-teal-400 hover:text-teal-300 underline underline-offset-2 transition-colors">
                  Learn more
                </Link>
              </p>
              <p className="text-xs text-gray-500 mt-2">&copy; {new Date().getFullYear()} ToddlerTravelGear.com. All rights reserved.</p>
            </div>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-teal-400 transition-colors flex-shrink-0 group"
              aria-label="Back to top"
            >
              Back to top
              <svg className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Terms of Use",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="container-content max-w-2xl py-16">
      <h1 className="font-display text-3xl text-navy">Terms of Use</h1>
      <p className="mt-6 text-sm leading-relaxed text-stone-600">
        {/* [PLACEHOLDER] This page needs real terms of use before launch —
        covering acceptable use of the site, that property details are
        indicative and subject to change, and that {siteConfig.name} does
        not guarantee availability until confirmed directly. Have this
        drafted or reviewed by a professional before publishing. */}
      </p>
    </div>
  );
}

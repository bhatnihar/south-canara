import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container-content max-w-2xl py-16">
      <h1 className="font-display text-3xl text-navy">Privacy Policy</h1>
      <p className="mt-6 text-sm leading-relaxed text-stone-600">
        {/* [PLACEHOLDER] This page needs a real privacy policy before launch,
        describing what personal data {siteConfig.name} collects through
        enquiry forms (name, phone, email, message), how it is stored
        (Supabase, hosted in accordance with Supabase&rsquo;s own data policies),
        who can access it (authorized staff only), and how a visitor can
        request their data be corrected or deleted. Consider having this
        reviewed by a professional given applicable Indian data protection
        law (the Digital Personal Data Protection Act, 2023). */}
      </p>
    </div>
  );
}

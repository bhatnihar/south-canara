import type { Metadata } from "next";
import ContactSection from "@/components/contact-section/contact-section";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${siteConfig.name} — call, WhatsApp, or send an enquiry.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div>
      <div className="border-b border-stone-200 bg-ivory py-12">
        <div className="container-content">
          <h1 className="font-display text-3xl text-navy sm:text-4xl">Contact Us</h1>
          <p className="mt-3 max-w-lg text-stone-600">
            Questions about a property, pricing, or a site visit — reach out
            and we&rsquo;ll get back to you shortly.
          </p>
        </div>
      </div>
      <ContactSection />
    </div>
  );
}

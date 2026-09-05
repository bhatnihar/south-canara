import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig, telLink, whatsappLink } from "@/lib/config";

export default function FinalCTA() {
  return (
    <section className="bg-gold-50 py-16 lg:py-20">
      <div className="container-content flex flex-col items-center gap-6 text-center">
        <h2 className="max-w-xl font-display text-3xl text-navy sm:text-4xl">
          Ready to see a property in person?
        </h2>
        <p className="max-w-md text-stone-600">
          Enquire online, or reach {siteConfig.name} directly — we usually
          reply within the same business day.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-4">
          <Link href="/contact" className={buttonVariants({ size: "lg" })}>
            Enquire Now
          </Link>
          <a
            href={telLink()}
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            <Phone size={17} /> Call Us
          </a>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            <MessageCircle size={17} /> WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

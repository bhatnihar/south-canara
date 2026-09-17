import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { placeholderImageUrl } from "@/lib/placeholder";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${siteConfig.name}, a real estate company serving coastal Karnataka.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div>
      <div className="border-b border-stone-200 bg-ivory py-16">
        <div className="container-content max-w-2xl">
          <p className="mb-3 text-sm font-medium text-gold-700">About Us</p>
          <h1 className="font-display text-4xl text-navy">
            Your Trusted Partner in Real Estate. 🗺️
          </h1>
        <p className="mt-5 leading-relaxed text-stone-600">
  South Canara Real Estate is committed to helping you find the right property
  with honest guidance and local expertise. We make the process simple and
  transparent, whether you&apos;re looking for a home, land, or an investment opportunity.
        </p>
        </div>
      </div>

     
     <div className="container-content py-16">
  <div className="relative aspect-[21/9] w-full overflow-hidden rounded-sm">
    <Image
      src={placeholderImageUrl("sc-about-hero", 1400, 600)}
      alt="South Canara coastline"
      fill
      sizes="100vw"
      style={{ objectFit: "contain" }}
    />
  </div>
</div>


<div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-3">
  <div>
    <h2 className="font-display text-xl text-navy">Our Mission</h2>
    <p className="mt-3 text-sm leading-relaxed text-stone-600">
      Helping you find a place that feels like home. We make property search
      simple, transparent, and personal — helping you find spaces that match
      your needs and aspirations.
    </p>
  </div>

  <div>
    <h2 className="font-display text-xl text-navy">Our Approach</h2>
    <p className="mt-3 text-sm leading-relaxed text-stone-600">
      Local knowledge. Honest guidance. The right property. With a strong
      understanding of the South Canara region, we focus on carefully selected
      properties and straightforward communication.
    </p>
  </div>

  <div>
    <h2 className="font-display text-xl text-navy">Our Team</h2>
    <p className="mt-3 text-sm leading-relaxed text-stone-600">
      People who know the place. People who understand your needs. Our team
      brings local insight and a personal approach to every property journey,
      from the first conversation to the final decision.
    </p>
  </div>
</div>

        <div className="mt-16 rounded-sm border border-stone-200 bg-ivory p-10 text-center">
          <h2 className="font-display text-2xl text-navy">
            Ready to explore properties with us?
          </h2>
          <div className="mt-6 flex justify-center gap-4">
            <Link href="/properties" className={buttonVariants({ size: "lg" })}>
              View Properties
            </Link>
            <Link href="/contact" className={buttonVariants({ variant: "outline", size: "lg" })}>
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    
  );
}

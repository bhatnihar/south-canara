import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { placeholderImageUrl } from "@/lib/placeholder";
import { siteConfig } from "@/lib/config";

export default function Hero() {
  return (
    <section className="border-b border-stone-200 bg-ivory">
      <div className="container-content grid grid-cols-1 items-center gap-12 py-14 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-6">
          <p className="mb-4 text-sm font-medium text-gold-700">
            Serving Mangaluru · Udupi · Manipal
          </p>
          <h1 className="font-display text-4xl leading-[1.1] text-navy sm:text-5xl lg:text-[3.25rem]">
            {siteConfig.tagline}
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-stone-700">
            {siteConfig.name} helps you find a property along the coast that
            you can actually verify — clear pricing, real availability, and a
            team that picks up the phone.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href="/properties" className={buttonVariants({ size: "lg" })}>
              Explore Properties
            </Link>
            <Link
              href="/contact"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Talk to Us
            </Link>
          </div>
        </div>

        <div className="relative lg:col-span-6">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm sm:aspect-[5/4]">
            <Image
              src={placeholderImageUrl("sc-hero-main", 900, 720)}
              alt="A coastal Karnataka residential development"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          {/* <div className="absolute -bottom-6 -left-6 hidden w-52 rounded-sm border border-stone-200 bg-white p-4 shadow-card sm:block">
            <p className="font-display text-2xl text-navy">{siteConfig.locations.length}</p>
            <p className="text-xs text-stone-600">
              cross coastal Karnataka
            </p>
          </div> */}
        </div>
      </div>
    </section>
  );
}

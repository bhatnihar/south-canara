import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { placeholderImageUrl } from "@/lib/placeholder";
import { siteConfig } from "@/lib/config";

export default function AboutPreview() {
  return (
    <section className="border-b border-stone-200 bg-ivory py-16 lg:py-24">
      <div className="container-content grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <div className="relative lg:col-span-5">
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
            <Image
              src={placeholderImageUrl("sc-about-team", 700, 525)}
              alt={`${siteConfig.name} team at a site visit`}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="lg:col-span-7">
          <p className="mb-3 text-sm font-medium text-gold-700">About {siteConfig.name}</p>
          <h2 className="font-display text-3xl text-navy sm:text-4xl">
            A local team, built around one region.
          </h2>
          {/* <p className="mt-5 max-w-xl leading-relaxed text-stone-600">
            [COMPANY DESCRIPTION] — replace this paragraph with a short
            introduction to the company: when it was founded, what it
            specializes in, and why buyers in Mangaluru, Udupi, and Manipal
            choose to work with it.
          </p> */}
          <Link href="/about" className={buttonVariants({ variant: "outline", className: "mt-7" })}>
            More About Us
          </Link>
        </div>
      </div>
    </section>
  );
}

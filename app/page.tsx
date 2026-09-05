import Hero from "@/components/hero/hero";
import WhyChooseUs from "@/components/home/why-choose-us";
import AboutPreview from "@/components/home/about-preview";
import Locations from "@/components/home/locations";
import Testimonials from "@/components/testimonials/testimonials";
import FinalCTA from "@/components/home/final-cta";
import PropertyGrid from "@/components/property-grid/property-grid";
import { getFeaturedProperties } from "@/lib/data/properties";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default async function HomePage() {
  const featuredProperties = await getFeaturedProperties(6);

  return (
    <>
      <Hero />

      <section className="border-b border-stone-200 bg-white py-16 lg:py-24">
        <div className="container-content">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-display text-3xl text-navy sm:text-4xl">
                Featured Properties
              </h2>
              <p className="mt-3 max-w-md text-stone-600">
                A selection of our current listings across coastal Karnataka.
              </p>
            </div>
            <Link href="/properties" className={buttonVariants({ variant: "outline" })}>
              View All Properties
            </Link>
          </div>

          <div className="mt-12">
            <PropertyGrid
              properties={featuredProperties}
              emptyMessage="No featured properties yet — check back soon."
            />
          </div>
        </div>
      </section>

      <WhyChooseUs />
      <AboutPreview />
      <Locations />
      <Testimonials />
      <FinalCTA />
    </>
  );
}

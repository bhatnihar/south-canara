import type { Metadata } from "next";
import { getSoldProperties } from "@/lib/data/properties";
import PropertyGrid from "@/components/property-grid/property-grid";
import { siteConfig } from "@/lib/config";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Sold Properties",
  description: `A record of properties ${siteConfig.name} has successfully sold across coastal Karnataka.`,
  alternates: { canonical: "/sold-properties" },
};

export default async function SoldPropertiesPage() {
  const properties = await getSoldProperties();

  return (
    <div>
      <div className="border-b border-stone-200 bg-ivory py-12">
        <div className="container-content">
          <h1 className="font-display text-3xl text-navy sm:text-4xl">Sold Properties</h1>
          <p className="mt-3 max-w-lg text-stone-600">
            A track record of homes we&rsquo;ve helped find their owners.
            Looking for something similar?{" "}
            <a href="/properties" className="text-gold-700 hover:underline">
              Browse available properties
            </a>
            .
          </p>
        </div>
      </div>

      <div className="container-content py-12">
        <PropertyGrid
          properties={properties}
          emptyMessage="No sold properties to show yet."
        />
      </div>
    </div>
  );
}

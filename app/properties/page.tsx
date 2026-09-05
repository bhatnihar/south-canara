import type { Metadata } from "next";
import { getPublishedProperties, getUniqueCities } from "@/lib/data/properties";
import PropertyFilters from "@/components/property-filters/property-filters";
import PropertyGrid from "@/components/property-grid/property-grid";
import { siteConfig } from "@/lib/config";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Properties",
  description: `Browse available properties from ${siteConfig.name} across Mangaluru, Udupi, and Manipal.`,
  alternates: { canonical: "/properties" },
};

interface PropertiesPageProps {
  searchParams: {
    search?: string;
    city?: string;
    propertyType?: string;
    status?: string;
    bedrooms?: string;
    sort?: "newest" | "price_asc" | "price_desc";
  };
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const [properties, cities] = await Promise.all([
    getPublishedProperties({
      search: searchParams.search,
      city: searchParams.city,
      propertyType: searchParams.propertyType,
      status: searchParams.status,
      bedrooms: searchParams.bedrooms ? Number(searchParams.bedrooms) : undefined,
      sort: searchParams.sort,
    }),
    getUniqueCities(),
  ]);

  return (
    <div>
      <div className="border-b border-stone-200 bg-ivory py-12">
        <div className="container-content">
          <h1 className="font-display text-3xl text-navy sm:text-4xl">Properties</h1>
          <p className="mt-3 max-w-lg text-stone-600">
            {properties.length} {properties.length === 1 ? "property" : "properties"} available
            right now across coastal Karnataka.
          </p>
        </div>
      </div>

      <PropertyFilters cities={cities} />

      <div className="container-content py-12">
        <PropertyGrid properties={properties} />
      </div>
    </div>
  );
}

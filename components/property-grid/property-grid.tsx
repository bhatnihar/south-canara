import Link from "next/link";
import { SearchX } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import PropertyCard from "@/components/property-card/property-card";
import type { PropertyWithRelations } from "@/types";

export default function PropertyGrid({
  properties,
  emptyMessage = "No properties match your current filters.",
}: {
  properties: PropertyWithRelations[];
  emptyMessage?: string;
}) {
  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-sm border border-dashed border-stone-300 py-20 text-center">
        <SearchX size={32} className="mb-4 text-stone-400" aria-hidden="true" />
        <p className="text-base font-medium text-navy">{emptyMessage}</p>
        <p className="mt-1 text-sm text-stone-600">
          Try widening your search or clearing a filter.
        </p>
        <Link href="/properties" className={buttonVariants({ variant: "outline", className: "mt-6" })}>
          Reset filters
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}

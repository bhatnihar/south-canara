import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import PropertyForm from "@/components/admin/property-form/property-form";
import MediaManager from "@/components/admin/property-form/media-manager";
import { getPropertyByIdAdmin, getAllAmenities } from "@/lib/data/properties";

export default async function EditPropertyPage({ params }: { params: { id: string } }) {
  const [property, amenities] = await Promise.all([
    getPropertyByIdAdmin(params.id),
    getAllAmenities(),
  ]);

  if (!property) notFound();

  return (
    <div className="p-6 lg:p-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl text-navy">{property.title}</h1>
          <p className="mt-1 text-sm text-stone-500">Edit property details and media.</p>
        </div>
        {property.published && (
          <Link
            href={`/properties/${property.slug}`}
            target="_blank"
            className="flex items-center gap-1.5 text-sm font-medium text-gold-700 hover:underline"
          >
            View live <ExternalLink size={14} />
          </Link>
        )}
      </div>

      <div className="mt-6 max-w-3xl space-y-8">
        <MediaManager
          propertyId={property.id}
          images={property.property_images}
          brochureUrl={property.brochure_url}
        />
        <PropertyForm mode="edit" property={property} amenities={amenities} />
      </div>
    </div>
  );
}

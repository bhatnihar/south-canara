import Link from "next/link";
import Image from "next/image";
import { BedDouble, Ruler } from "lucide-react";
import { StatusBadge, Badge } from "@/components/ui/badge";
import { formatPriceINR, formatArea } from "@/lib/utils";
import { placeholderImageUrl } from "@/lib/placeholder";
import type { PropertyWithRelations } from "@/types";

export default function PropertyCard({ property }: { property: PropertyWithRelations }) {
  const coverImage = property.property_images.find((img) => !img.is_floor_plan);
  const imageUrl = coverImage?.image_url ?? placeholderImageUrl(property.slug, 640, 480);

  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group block overflow-hidden rounded-sm border border-stone-200 bg-white transition-shadow hover:shadow-card"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        <Image
          src={imageUrl}
          alt={coverImage?.alt_text ?? `${property.title} exterior`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          <StatusBadge status={property.status} />
          {property.featured && (
            <Badge className="bg-gold text-navy-900">Featured</Badge>
          )}
        </div>
      </div>

      <div className="p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-gold-700">
          {property.location}, {property.city}
        </p>
        <h3 className="mt-1.5 font-display text-lg leading-snug text-navy line-clamp-1">
          {property.title}
        </h3>

        <div className="mt-3 flex items-center gap-4 text-sm text-stone-600">
          {property.bedrooms !== null && (
            <span className="flex items-center gap-1.5">
              <BedDouble size={15} className="text-navy-400" />
              {property.bedrooms} BHK
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Ruler size={15} className="text-navy-400" />
            {formatArea(property.area_sqft)}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-4">
          <p className="font-display text-lg text-navy">
            {property.price_display || formatPriceINR(property.price)}
          </p>
          <span className="text-sm font-medium text-gold-700 group-hover:underline">
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
}

import * as Icons from "lucide-react";
import { Check, type LucideIcon } from "lucide-react";
import type { Amenity } from "@/types";

export default function Amenities({ amenities }: { amenities: Amenity[] }) {
  if (amenities.length === 0) return null;

  return (
    <div>
      <h2 className="font-display text-2xl text-navy">Amenities</h2>
      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {amenities.map((amenity) => {
          const IconComponent =
            ((Icons as unknown as Record<string, LucideIcon>)[amenity.icon]) ?? Check;
          return (
            <div
              key={amenity.id}
              className="flex items-center gap-3 rounded-sm border border-stone-200 bg-white px-4 py-3"
            >
              <IconComponent size={18} className="shrink-0 text-gold-600" />
              <span className="text-sm text-navy-800">{amenity.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

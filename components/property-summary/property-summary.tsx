import { BedDouble, Bath, Ruler, CalendarClock, Building2 } from "lucide-react";
import { formatArea } from "@/lib/utils";
import { PROPERTY_TYPE_LABELS } from "@/types";
import type { Property } from "@/types";

export default function PropertySummary({ property }: { property: Property }) {
  const items = [
    property.bedrooms !== null && {
      icon: BedDouble,
      label: `${property.bedrooms} BHK`,
    },
    property.bathrooms !== null && {
      icon: Bath,
      label: `${property.bathrooms} Bath`,
    },
    { icon: Ruler, label: formatArea(property.area_sqft) },
    { icon: Building2, label: PROPERTY_TYPE_LABELS[property.property_type] },
    property.possession_date && {
      icon: CalendarClock,
      label: `Possession ${new Date(property.possession_date).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      })}`,
    },
  ].filter(Boolean) as { icon: typeof BedDouble; label: string }[];

  return (
    <div className="grid grid-cols-2 gap-4 rounded-sm border border-stone-200 bg-white p-5 sm:grid-cols-3 lg:grid-cols-5">
      {items.map(({ icon: Icon, label }) => (
        <div key={label} className="flex items-center gap-2.5">
          <Icon size={17} className="shrink-0 text-gold-600" />
          <span className="text-sm text-navy-800">{label}</span>
        </div>
      ))}
    </div>
  );
}

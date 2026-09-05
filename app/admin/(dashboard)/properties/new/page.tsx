import PropertyForm from "@/components/admin/property-form/property-form";
import { getAllAmenities } from "@/lib/data/properties";

export default async function NewPropertyPage() {
  const amenities = await getAllAmenities();

  return (
    <div className="p-6 lg:p-10">
      <h1 className="font-display text-2xl text-navy">Add Property</h1>
      <p className="mt-1 text-sm text-stone-500">
        Save the property first, then upload photos and a brochure from the edit page.
      </p>
      <div className="mt-6 max-w-3xl">
        <PropertyForm mode="create" amenities={amenities} />
      </div>
    </div>
  );
}

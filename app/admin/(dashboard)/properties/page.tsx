import Link from "next/link";
import { Plus, Archive } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import PropertyTable from "@/components/admin/property-table/property-table";
import { getAllPropertiesAdmin, getSoldPropertiesAdmin } from "@/lib/data/properties";

export const dynamic = "force-dynamic";

export default async function AdminPropertiesPage() {
  const [availableProperties, soldProperties] = await Promise.all([
    getAllPropertiesAdmin(),
    getSoldPropertiesAdmin(),
  ]);

  const availableOnly = availableProperties.filter((p) => p.status !== "sold_out");

  return (
    <div className="p-6 lg:p-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl text-navy">Properties</h1>
          <p className="mt-1 text-sm text-stone-500">
            {availableOnly.length} available, {soldProperties.length} sold
          </p>
        </div>
        <Link href="/admin/properties/new" className={buttonVariants()}>
          <Plus size={16} /> Add Property
        </Link>
      </div>

      <div className="mt-8">
        <h2 className="font-display text-lg text-navy mb-4">Available Properties</h2>
        <PropertyTable properties={availableOnly} />
      </div>

      {soldProperties.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-4">
            <Archive size={20} className="text-stone-500" />
            <h2 className="font-display text-lg text-navy">Sold Properties</h2>
          </div>
          <PropertyTable properties={soldProperties} showSold />
        </div>
      )}
    </div>
  );
}

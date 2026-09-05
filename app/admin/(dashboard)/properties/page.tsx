import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import PropertyTable from "@/components/admin/property-table/property-table";
import { getAllPropertiesAdmin } from "@/lib/data/properties";

export const dynamic = "force-dynamic";

export default async function AdminPropertiesPage() {
  const properties = await getAllPropertiesAdmin();

  return (
    <div className="p-6 lg:p-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl text-navy">Properties</h1>
          <p className="mt-1 text-sm text-stone-500">
            {properties.length} {properties.length === 1 ? "property" : "properties"} total
          </p>
        </div>
        <Link href="/admin/properties/new" className={buttonVariants()}>
          <Plus size={16} /> Add Property
        </Link>
      </div>

      <div className="mt-6">
        <PropertyTable properties={properties} />
      </div>
    </div>
  );
}

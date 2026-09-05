import LeadTable from "@/components/admin/lead-table/lead-table";
import { getLeads } from "@/lib/data/leads";
import { LEAD_STATUS_LABELS } from "@/types";
import type { LeadStatus } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const statusFilter = searchParams.status as LeadStatus | undefined;
  const leads = await getLeads(statusFilter);

  return (
    <div className="p-6 lg:p-10">
      <h1 className="font-display text-2xl text-navy">Leads</h1>
      <p className="mt-1 text-sm text-stone-500">
        {leads.length} {leads.length === 1 ? "enquiry" : "enquiries"}
        {statusFilter ? ` · ${LEAD_STATUS_LABELS[statusFilter]}` : ""}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <a
          href="/admin/leads"
          className={`rounded-sm px-3 py-1.5 text-xs font-medium ${
            !statusFilter ? "bg-navy text-white" : "bg-white text-stone-600 border border-stone-200"
          }`}
        >
          All
        </a>
        {Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => (
          <a
            key={value}
            href={`/admin/leads?status=${value}`}
            className={`rounded-sm px-3 py-1.5 text-xs font-medium ${
              statusFilter === value ? "bg-navy text-white" : "bg-white text-stone-600 border border-stone-200"
            }`}
          >
            {label}
          </a>
        ))}
      </div>

      <div className="mt-6">
        <LeadTable leads={leads} />
      </div>
    </div>
  );
}

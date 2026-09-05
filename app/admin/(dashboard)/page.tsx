import Link from "next/link";
import { Building2, CheckCircle2, UserPlus, Clock, CalendarCheck, Plus } from "lucide-react";
import DashboardCard from "@/components/admin/dashboard-card/dashboard-card";
import { buttonVariants } from "@/components/ui/button";
import { getDashboardStats } from "@/lib/data/leads";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="p-6 lg:p-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl text-navy">Dashboard</h1>
          <p className="mt-1 text-sm text-stone-500">
            An overview of your listings and incoming leads.
          </p>
        </div>
        <Link href="/admin/properties/new" className={buttonVariants()}>
          <Plus size={16} /> Add Property
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <DashboardCard label="Total Properties" value={stats.totalProperties} icon={Building2} />
        <DashboardCard
          label="Published Properties"
          value={stats.publishedProperties}
          icon={CheckCircle2}
        />
        <DashboardCard label="New Leads" value={stats.newLeads} icon={UserPlus} />
        <DashboardCard label="Pending Follow-ups" value={stats.pendingFollowUps} icon={Clock} />
        <DashboardCard label="Site Visit Requests" value={stats.siteVisits} icon={CalendarCheck} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/admin/properties"
          className="rounded-sm border border-stone-200 bg-white p-6 transition-shadow hover:shadow-card"
        >
          <h2 className="font-display text-lg text-navy">Manage Properties</h2>
          <p className="mt-1.5 text-sm text-stone-500">
            Add, edit, publish, or remove listings.
          </p>
        </Link>
        <Link
          href="/admin/leads"
          className="rounded-sm border border-stone-200 bg-white p-6 transition-shadow hover:shadow-card"
        >
          <h2 className="font-display text-lg text-navy">Manage Leads</h2>
          <p className="mt-1.5 text-sm text-stone-500">
            Review enquiries and update follow-up status.
          </p>
        </Link>
      </div>
    </div>
  );
}

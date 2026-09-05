import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { LeadWithProperty, LeadStatus } from "@/types";

export async function getLeads(statusFilter?: LeadStatus): Promise<LeadWithProperty[]> {
  const supabase = createServerSupabaseClient();
  let query = supabase
    .from("leads")
    .select("*, property:properties ( id, title, slug )")
    .order("created_at", { ascending: false });

  if (statusFilter) query = query.eq("status", statusFilter);

  const { data, error } = await query;
  if (error) {
    console.error("getLeads error:", error.message);
    return [];
  }
  return (data as unknown as LeadWithProperty[]) ?? [];
}

export interface DashboardStats {
  totalProperties: number;
  publishedProperties: number;
  newLeads: number;
  pendingFollowUps: number;
  siteVisits: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createServerSupabaseClient();

  const [
    { count: totalProperties },
    { count: publishedProperties },
    { count: newLeads },
    { count: pendingFollowUps },
    { count: siteVisits },
  ] = await Promise.all([
    supabase.from("properties").select("*", { count: "exact", head: true }),
    supabase
      .from("properties")
      .select("*", { count: "exact", head: true })
      .eq("published", true),
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .in("status", ["new", "contacted", "interested"]),
    supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("interested_in_site_visit", true),
  ]);

  return {
    totalProperties: totalProperties ?? 0,
    publishedProperties: publishedProperties ?? 0,
    newLeads: newLeads ?? 0,
    pendingFollowUps: pendingFollowUps ?? 0,
    siteVisits: siteVisits ?? 0,
  };
}

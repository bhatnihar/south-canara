"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { LeadStatus } from "@/types";

async function requireAdmin() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("leads").update({ status }).eq("id", leadId);
  if (error) {
    console.error("updateLeadStatus error:", error.message);
    throw new Error("Could not update lead status.");
  }
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

export async function deleteLead(leadId: string) {
  const supabase = await requireAdmin();
  await supabase.from("leads").delete().eq("id", leadId);
  revalidatePath("/admin/leads");
}

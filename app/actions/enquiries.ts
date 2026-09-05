"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { enquirySchema } from "@/lib/validations";

export interface EnquiryActionState {
  success: boolean;
  message: string;
}

/**
 * Handles enquiry form submissions. Never trusts client-side validation —
 * every field is re-validated here with the same Zod schema.
 * RLS on the `leads` table allows this anon-key insert but blocks any
 * read/update/delete from the public, so this action can only ever add
 * a row, never see or change existing leads.
 */
export async function submitEnquiry(
  _prevState: EnquiryActionState,
  formData: FormData
): Promise<EnquiryActionState> {
  const raw = {
    name: formData.get("name")?.toString() ?? "",
    phone: formData.get("phone")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    message: formData.get("message")?.toString() ?? "",
    interested_in_site_visit: formData.get("interested_in_site_visit") === "on",
    property_id: formData.get("property_id")?.toString() || null,
    company_website: formData.get("company_website")?.toString() ?? "", // honeypot
  };

  const parsed = enquirySchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Please check the form and try again.",
    };
  }

  // Honeypot tripped — silently pretend success so bots don't learn anything.
  if (parsed.data.company_website) {
    return { success: true, message: "Thank you. Our team will contact you shortly." };
  }

  const supabase = createServerSupabaseClient();

  const { error } = await supabase.from("leads").insert({
    name: parsed.data.name,
    phone: parsed.data.phone,
    email: parsed.data.email || null,
    message: parsed.data.message || null,
    interested_in_site_visit: parsed.data.interested_in_site_visit,
    property_id: parsed.data.property_id,
    source: "website",
  });

  if (error) {
    // Never leak internal database errors to the user.
    console.error("Failed to insert lead:", error.message);
    return {
      success: false,
      message: "Something went wrong on our end. Please call or WhatsApp us directly.",
    };
  }

  return { success: true, message: "Thank you. Our team will contact you shortly." };
}

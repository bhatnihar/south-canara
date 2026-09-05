"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface LoginActionState {
  success: boolean;
  message: string;
}

export async function signIn(
  _prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const email = formData.get("email")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const next = formData.get("next")?.toString() || "/admin";

  if (!email || !password) {
    return { success: false, message: "Please enter your email and password." };
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, message: "Incorrect email or password." };
  }

  redirect(next);
}

export async function signOut() {
  const supabase = createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

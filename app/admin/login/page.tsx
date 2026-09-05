"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { AlertCircle } from "lucide-react";
import { signIn, type LoginActionState } from "@/app/actions/auth";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";

const initialState: LoginActionState = { success: false, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? "Signing in..." : "Sign In"}
    </Button>
  );
}

export default function AdminLoginPage() {
  const [state, formAction] = useFormState(signIn, initialState);
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin";

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-4">
      <div className="w-full max-w-sm rounded-sm bg-white p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <Image
            src="/images/logo.jpg"
            alt={`${siteConfig.name} logo`}
            width={56}
            height={56}
            className="h-14 w-14 rounded-full object-cover"
          />
          <h1 className="mt-4 font-display text-xl text-navy">Admin Sign In</h1>
          <p className="mt-1 text-sm text-stone-500">{siteConfig.name}</p>
        </div>

        <form action={formAction} className="space-y-5">
          <input type="hidden" name="next" value={next} />
          <div>
            <Label htmlFor="email" required>Email</Label>
            <Input id="email" name="email" type="email" required autoComplete="username" />
          </div>
          <div>
            <Label htmlFor="password" required>Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>

          {state.message && (
            <div className="flex items-start gap-2 rounded-sm border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <p>{state.message}</p>
            </div>
          )}

          <SubmitButton />
        </form>
      </div>
    </div>
  );
}

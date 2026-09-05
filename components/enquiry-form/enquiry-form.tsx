"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useRef } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { submitEnquiry, type EnquiryActionState } from "@/app/actions/enquiries";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: EnquiryActionState = { success: false, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={pending}>
      {pending ? "Sending..." : "Send Enquiry"}
    </Button>
  );
}

export default function EnquiryForm({
  propertyId,
  propertyName,
}: {
  propertyId?: string;
  propertyName?: string;
}) {
  const [state, formAction] = useFormState(submitEnquiry, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-5" noValidate>
      {propertyId && <input type="hidden" name="property_id" value={propertyId} />}

      {/* Honeypot — hidden from real users via CSS, off-screen for assistive tech. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="company_website">Leave this field empty</label>
        <input
          type="text"
          id="company_website"
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <Label htmlFor="name" required>
          Full Name
        </Label>
        <Input id="name" name="name" required minLength={2} maxLength={120} placeholder="Your name" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone" required>
            Phone Number
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="+91 90000 00000"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="you@example.com" />
        </div>
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          rows={4}
          maxLength={2000}
          placeholder={
            propertyName
              ? `I'm interested in ${propertyName}. Please share more details.`
              : "Tell us what you're looking for."
          }
        />
      </div>

      <label className="flex items-center gap-2.5 text-sm text-stone-700">
        <input
          type="checkbox"
          name="interested_in_site_visit"
          className="h-4 w-4 rounded-sm border-stone-300 text-navy focus:ring-navy"
        />
        I&rsquo;d like to schedule a site visit
      </label>

      {state.message && (
        <div
          role="status"
          className={`flex items-start gap-2.5 rounded-sm border p-3.5 text-sm ${
            state.success
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {state.success ? (
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          ) : (
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
          )}
          <p>{state.message}</p>
        </div>
      )}

      <SubmitButton />
    </form>
  );
}

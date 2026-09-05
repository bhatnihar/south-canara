"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Phone, Mail, Trash2, MessageCircle } from "lucide-react";
import { updateLeadStatus, deleteLead } from "@/app/actions/leads";
import { Select } from "@/components/ui/input";
import { LeadStatusBadge } from "@/components/ui/badge";
import { LEAD_STATUS_LABELS } from "@/types";
import { whatsappLink } from "@/lib/config";
import type { LeadWithProperty, LeadStatus } from "@/types";

export default function LeadTable({ leads }: { leads: LeadWithProperty[] }) {
  const [rows, setRows] = useState(leads);
  const [isPending, startTransition] = useTransition();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  function handleStatusChange(leadId: string, status: LeadStatus) {
    setRows((prev) => prev.map((l) => (l.id === leadId ? { ...l, status } : l)));
    startTransition(async () => {
      await updateLeadStatus(leadId, status);
    });
  }

  function handleDelete(leadId: string) {
    startTransition(async () => {
      await deleteLead(leadId);
      setRows((prev) => prev.filter((l) => l.id !== leadId));
      setConfirmDeleteId(null);
    });
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-stone-300 p-12 text-center text-sm text-stone-500">
        No leads yet. New enquiries will appear here automatically.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-sm border border-stone-200 bg-white">
      <table className="w-full min-w-[880px] text-left text-sm">
        <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Contact</th>
            <th className="px-4 py-3 font-medium">Property</th>
            <th className="px-4 py-3 font-medium">Received</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {rows.map((lead) => (
            <tr key={lead.id}>
              <td className="px-4 py-3 align-top">
                <p className="font-medium text-navy">{lead.name}</p>
                {lead.interested_in_site_visit && (
                  <span className="mt-1 inline-block rounded-sm bg-violet-50 px-2 py-0.5 text-[11px] text-violet-700">
                    Wants site visit
                  </span>
                )}
                {lead.message && (
                  <p className="mt-1 max-w-xs text-xs text-stone-500 line-clamp-2">{lead.message}</p>
                )}
              </td>
              <td className="px-4 py-3 align-top">
                <div className="flex flex-col gap-1 text-xs text-stone-600">
                  <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 hover:text-navy">
                    <Phone size={12} /> {lead.phone}
                  </a>
                  <a
                    href={whatsappLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-navy"
                  >
                    <MessageCircle size={12} /> WhatsApp
                  </a>
                  {lead.email && (
                    <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 hover:text-navy">
                      <Mail size={12} /> {lead.email}
                    </a>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 align-top text-stone-600">
                {lead.property ? (
                  <Link href={`/properties/${lead.property.slug}`} target="_blank" className="hover:text-navy hover:underline">
                    {lead.property.title}
                  </Link>
                ) : (
                  <span className="text-stone-400">General enquiry</span>
                )}
              </td>
              <td className="px-4 py-3 align-top text-xs text-stone-500">
                {new Date(lead.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="px-4 py-3 align-top">
                <div className="flex items-center gap-2">
                  <LeadStatusBadge status={lead.status} label={LEAD_STATUS_LABELS[lead.status]} />
                </div>
                <Select
                  value={lead.status}
                  onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                  disabled={isPending}
                  className="mt-2 w-auto text-xs"
                  aria-label={`Update status for ${lead.name}`}
                >
                  {Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </Select>
              </td>
              <td className="px-4 py-3 align-top text-right">
                {confirmDeleteId === lead.id ? (
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleDelete(lead.id)}
                      className="rounded-sm bg-red-600 px-2.5 py-1.5 text-xs font-medium text-white"
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      className="rounded-sm px-2.5 py-1.5 text-xs font-medium text-stone-500"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(lead.id)}
                    className="rounded-sm p-2 text-red-500 hover:bg-red-50"
                    aria-label={`Delete lead from ${lead.name}`}
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

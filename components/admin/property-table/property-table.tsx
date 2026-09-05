"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pencil, Trash2, Eye, EyeOff, Star } from "lucide-react";
import { deleteProperty, togglePublished } from "@/app/actions/properties";
import { StatusBadge } from "@/components/ui/badge";
import { formatPriceINR } from "@/lib/utils";
import type { Property } from "@/types";

export default function PropertyTable({ properties }: { properties: Property[] }) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [rows, setRows] = useState(properties);

  function handleTogglePublish(property: Property) {
    setPendingId(property.id);
    startTransition(async () => {
      await togglePublished(property.id, !property.published);
      setRows((prev) =>
        prev.map((p) => (p.id === property.id ? { ...p, published: !p.published } : p))
      );
      setPendingId(null);
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteProperty(id);
      setRows((prev) => prev.filter((p) => p.id !== id));
      setConfirmDeleteId(null);
    });
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-stone-300 p-12 text-center text-sm text-stone-500">
        No properties yet. Add your first property to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-sm border border-stone-200 bg-white">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
          <tr>
            <th className="px-4 py-3 font-medium">Property</th>
            <th className="px-4 py-3 font-medium">City</th>
            <th className="px-4 py-3 font-medium">Price</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Published</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {rows.map((property) => (
            <tr key={property.id}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2 font-medium text-navy">
                  {property.featured && (
                    <Star size={14} className="shrink-0 fill-gold-500 text-gold-500" />
                  )}
                  {property.title}
                </div>
                <p className="text-xs text-stone-500">/{property.slug}</p>
              </td>
              <td className="px-4 py-3 text-stone-600">{property.city}</td>
              <td className="px-4 py-3 text-stone-600">
                {property.price_display || formatPriceINR(property.price)}
              </td>
              <td className="px-4 py-3"><StatusBadge status={property.status} /></td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => handleTogglePublish(property)}
                  disabled={isPending && pendingId === property.id}
                  className={`inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-xs font-medium ${
                    property.published
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-stone-100 text-stone-600"
                  }`}
                >
                  {property.published ? <Eye size={13} /> : <EyeOff size={13} />}
                  {property.published ? "Published" : "Draft"}
                </button>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/admin/properties/${property.id}`}
                    className="rounded-sm p-2 text-navy-600 hover:bg-navy-50"
                    aria-label={`Edit ${property.title}`}
                  >
                    <Pencil size={15} />
                  </Link>
                  {confirmDeleteId === property.id ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleDelete(property.id)}
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
                      onClick={() => setConfirmDeleteId(property.id)}
                      className="rounded-sm p-2 text-red-500 hover:bg-red-50"
                      aria-label={`Delete ${property.title}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

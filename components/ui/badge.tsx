import { cn } from "@/lib/utils";
import type { PropertyStatus, LeadStatus } from "@/types";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2.5 py-1 text-xs font-medium tracking-wide",
        className
      )}
    >
      {children}
    </span>
  );
}

const statusStyles: Record<PropertyStatus, string> = {
  upcoming: "bg-navy-50 text-navy-700",
  ongoing: "bg-gold-100 text-gold-800",
  ready_to_move: "bg-emerald-50 text-emerald-700",
  sold_out: "bg-stone-200 text-stone-700",
};

const statusLabels: Record<PropertyStatus, string> = {
  upcoming: "Upcoming",
  ongoing: "Ongoing",
  ready_to_move: "Ready to Move",
  sold_out: "Sold Out",
};

export function StatusBadge({ status }: { status: PropertyStatus }) {
  return <Badge className={statusStyles[status]}>{statusLabels[status]}</Badge>;
}

const leadStatusStyles: Record<LeadStatus, string> = {
  new: "bg-navy-50 text-navy-700",
  contacted: "bg-sky-50 text-sky-700",
  interested: "bg-gold-100 text-gold-800",
  site_visit_scheduled: "bg-violet-50 text-violet-700",
  negotiation: "bg-amber-50 text-amber-700",
  converted: "bg-emerald-50 text-emerald-700",
  closed: "bg-stone-200 text-stone-700",
};

export function LeadStatusBadge({ status, label }: { status: LeadStatus; label: string }) {
  return <Badge className={leadStatusStyles[status]}>{label}</Badge>;
}

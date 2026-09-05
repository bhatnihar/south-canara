import type { LucideIcon } from "lucide-react";

export default function DashboardCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-sm border border-stone-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-stone-500">{label}</p>
        <Icon size={17} className="text-gold-600" />
      </div>
      <p className="mt-3 font-display text-3xl text-navy">{value}</p>
    </div>
  );
}

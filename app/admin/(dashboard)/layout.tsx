import AdminSidebar from "@/components/admin/sidebar/sidebar";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50 lg:flex-row">
      <AdminSidebar />
      <main className="min-w-0 flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}

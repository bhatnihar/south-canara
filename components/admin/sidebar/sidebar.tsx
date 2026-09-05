"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Building2,
  Users,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { signOut } from "@/app/actions/auth";
import { siteConfig } from "@/lib/config";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/properties", label: "Properties", icon: Building2, exact: false },
  { href: "/admin/leads", label: "Leads", icon: Users, exact: false },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {navItems.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname?.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium transition-colors ${
              active ? "bg-white/10 text-white" : "text-navy-200 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon size={17} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-navy-700 bg-navy px-4 py-3 lg:hidden">
        <Link href="/admin" className="flex items-center gap-2.5">
          <Image
            src="/images/logo.jpg"
            alt="Logo"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
          />
          <span className="text-sm font-medium text-white">Admin</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-sm p-2 text-white"
          aria-label="Open admin menu"
        >
          <Menu size={22} />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="w-72 bg-navy p-4">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm font-medium text-white">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-sm p-2 text-white"
                aria-label="Close admin menu"
              >
                <X size={20} />
              </button>
            </div>
            <NavLinks onNavigate={() => setOpen(false)} />
            <SidebarFooter />
          </div>
          <button
            className="flex-1 bg-navy-950/60"
            aria-label="Close menu overlay"
            onClick={() => setOpen(false)}
          />
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-navy-700 bg-navy lg:flex">
        <Link href="/admin" className="flex items-center gap-2.5 px-5 py-6">
          <Image
            src="/images/logo.jpg"
            alt="Logo"
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium text-white">{siteConfig.name}</p>
            <p className="text-xs text-navy-300">Admin Dashboard</p>
          </div>
        </Link>
        <NavLinks />
        <SidebarFooter />
      </aside>
    </>
  );
}

function SidebarFooter() {
  return (
    <div className="mt-auto space-y-1 border-t border-navy-700 px-3 py-4">
      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium text-navy-200 hover:bg-white/5 hover:text-white"
      >
        <ExternalLink size={17} />
        View Live Site
      </Link>
      <form action={signOut}>
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left text-sm font-medium text-navy-200 hover:bg-white/5 hover:text-white"
        >
          <LogOut size={17} />
          Sign Out
        </button>
      </form>
    </div>
  );
}

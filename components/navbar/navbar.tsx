"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Admin pages render their own chrome.
  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-ivory/95 backdrop-blur supports-[backdrop-filter]:bg-ivory/80">
      <div className="container-content flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3" aria-label={siteConfig.name}>
          <Image
            src="/images/logo.jpg"
            alt={`${siteConfig.name} logo`}
            width={48}
            height={48}
            className="h-11 w-11 rounded-full object-cover"
            priority
          />
          <span className="hidden font-display text-lg leading-tight text-navy sm:block">
            South Canara
            <span className="block text-xs font-sans font-medium tracking-wide text-gold-700">
              REAL ESTATE
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-gold-700 ${
                pathname === link.href ? "text-navy" : "text-navy-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link href="/contact" className={buttonVariants({ size: "md" })}>
            Enquire Now
          </Link>
        </div>

        <button
          type="button"
          className="rounded-sm p-2 text-navy md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="border-t border-stone-200 bg-ivory px-5 pb-6 pt-2 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-sm px-2 py-3 text-base font-medium text-navy-800 hover:bg-navy-50"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/contact" className={buttonVariants({ className: "mt-3 w-full" })}>
            Enquire Now
          </Link>
        </nav>
      )}
    </header>
  );
}

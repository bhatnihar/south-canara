"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Phone, Mail, MapPin, Instagram, Facebook, Linkedin, Youtube } from "lucide-react";
import { siteConfig, telLink, mailLink } from "@/lib/config";

export default function Footer() {
  const pathname = usePathname();
  const year = new Date().getFullYear();
  const { address } = siteConfig.contact;

  if (pathname?.startsWith("/admin")) return null;


  const socials = [
    { href: siteConfig.social.instagram, icon: Instagram, label: "Instagram" },
    { href: siteConfig.social.facebook, icon: Facebook, label: "Facebook" },
    { href: siteConfig.social.linkedin, icon: Linkedin, label: "LinkedIn" },
    { href: siteConfig.social.youtube, icon: Youtube, label: "YouTube" },
  ].filter((s) => s.href);

  return (
    <footer className="border-t border-navy-700 bg-navy text-navy-100">
      <div className="container-content grid grid-cols-1 gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link href="/" className="mb-4 flex items-center gap-3">
            <Image
              src="/images/logo.jpg"
              alt={`${siteConfig.name} logo`}
              width={44}
              height={44}
              className="h-11 w-11 rounded-full object-cover"
            />
            <span className="font-display text-lg text-white">{siteConfig.name}</span>
          </Link>
          <p className="max-w-sm text-sm leading-relaxed text-navy-200">
            {siteConfig.description}
          </p>
          {socials.length > 0 && (
            <div className="mt-6 flex gap-4">
              {socials.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-navy-200 transition-colors hover:text-gold-400"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-4 font-display text-base text-white">Navigate</h3>
          <ul className="space-y-3 text-sm text-navy-200">
            <li><Link href="/" className="hover:text-gold-400">Home</Link></li>
            <li><Link href="/properties" className="hover:text-gold-400">Properties</Link></li>
            <li><Link href="/about" className="hover:text-gold-400">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-gold-400">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-display text-base text-white">Contact</h3>
          <ul className="space-y-3 text-sm text-navy-200">
            <li className="flex items-start gap-2.5">
              <Phone size={16} className="mt-0.5 shrink-0 text-gold-400" />
              <a href={telLink()} className="hover:text-gold-400">
                {siteConfig.contact.phoneDisplay}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail size={16} className="mt-0.5 shrink-0 text-gold-400" />
              <a href={mailLink()} className="hover:text-gold-400">
                {siteConfig.contact.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gold-400" />
              <span>
                {address.line1}, {address.line2}
                <br />
                {address.city}, {address.state} {address.pincode}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-navy-700">
        <div className="container-content flex flex-col items-center justify-between gap-3 py-6 text-xs text-navy-300 sm:flex-row">
          <p>© {year} {siteConfig.name}. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy-policy" className="hover:text-gold-400">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gold-400">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { Home, Building2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-content flex flex-col items-center justify-center py-28 text-center">
      <p className="font-display text-6xl text-gold-500">404</p>
      <h1 className="mt-4 font-display text-2xl text-navy">Page not found</h1>
      <p className="mt-3 max-w-sm text-stone-600">
        The page you&rsquo;re looking for doesn&rsquo;t exist, or the property may have
        been unpublished or sold.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/" className={buttonVariants({ size: "lg" })}>
          <Home size={16} /> Go Home
        </Link>
        <Link href="/properties" className={buttonVariants({ variant: "outline", size: "lg" })}>
          <Building2 size={16} /> Browse Properties
        </Link>
      </div>
    </div>
  );
}

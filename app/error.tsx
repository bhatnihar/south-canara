"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-content flex flex-col items-center justify-center py-28 text-center">
      <AlertTriangle size={32} className="text-gold-500" />
      <h1 className="mt-4 font-display text-2xl text-navy">Something went wrong</h1>
      <p className="mt-3 max-w-sm text-stone-600">
        We hit an unexpected error loading this page. Please try again, or
        contact us directly if the problem continues.
      </p>
      <div className="mt-8 flex gap-4">
        <Button size="lg" onClick={reset}>Try Again</Button>
        <Link href="/" className={buttonVariants({ variant: "outline", size: "lg" })}>
          Go Home
        </Link>
      </div>
    </div>
  );
}

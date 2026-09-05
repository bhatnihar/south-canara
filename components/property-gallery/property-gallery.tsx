"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Expand } from "lucide-react";
import { placeholderImageUrl } from "@/lib/placeholder";
import type { PropertyImage } from "@/types";

export default function PropertyGallery({
  images,
  propertyTitle,
  fallbackSeed,
}: {
  images: PropertyImage[];
  propertyTitle: string;
  fallbackSeed: string;
}) {
  const photos = images.filter((img) => !img.is_floor_plan);
  const displayPhotos =
    photos.length > 0
      ? photos
      : [
          {
            id: "placeholder",
            property_id: "",
            image_url: placeholderImageUrl(fallbackSeed, 1200, 800),
            alt_text: `${propertyTitle} exterior`,
            display_order: 0,
            is_floor_plan: false,
            created_at: "",
          } as PropertyImage,
        ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const goTo = useCallback(
    (delta: number) => {
      setActiveIndex((i) => (i + delta + displayPhotos.length) % displayPhotos.length);
    },
    [displayPhotos.length]
  );

  useEffect(() => {
    if (!lightboxOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") goTo(-1);
      if (e.key === "ArrowRight") goTo(1);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxOpen, goTo]);

  const active = displayPhotos[activeIndex];

  return (
    <div>
      <div className="relative">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="group relative block aspect-[4/3] w-full overflow-hidden rounded-sm bg-stone-100 sm:aspect-[16/9]"
          aria-label="Open full-size image gallery"
        >
          <Image
            src={active.image_url}
            alt={active.alt_text ?? `${propertyTitle} photo ${activeIndex + 1}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover"
          />
          <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-sm bg-navy/80 px-3 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
            <Expand size={14} /> View full size
          </span>
        </button>

        {displayPhotos.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-sm bg-white/90 p-2 shadow-card hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft size={18} className="text-navy" />
            </button>
            <button
              type="button"
              onClick={() => goTo(1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm bg-white/90 p-2 shadow-card hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight size={18} className="text-navy" />
            </button>
          </>
        )}
      </div>

      {displayPhotos.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6">
          {displayPhotos.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`relative aspect-square overflow-hidden rounded-sm ring-offset-2 ${
                i === activeIndex ? "ring-2 ring-navy" : "opacity-80 hover:opacity-100"
              }`}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === activeIndex}
            >
              <Image
                src={img.image_url}
                alt={img.alt_text ?? `${propertyTitle} thumbnail ${i + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery, full size"
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 rounded-sm bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Close full-size image gallery"
          >
            <X size={22} />
          </button>

          <button
            type="button"
            onClick={() => goTo(-1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-sm bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Previous image"
          >
            <ChevronLeft size={26} />
          </button>

          <div className="relative h-[80vh] w-full max-w-5xl">
            <Image
              src={active.image_url}
              alt={active.alt_text ?? `${propertyTitle} photo ${activeIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          <button
            type="button"
            onClick={() => goTo(1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-sm bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Next image"
          >
            <ChevronRight size={26} />
          </button>

          <p className="absolute bottom-4 text-sm text-white/70">
            {activeIndex + 1} / {displayPhotos.length}
          </p>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useTransition, useRef } from "react";
import Image from "next/image";
import { Upload, Trash2, FileDown, AlertCircle } from "lucide-react";
import {
  uploadPropertyImage,
  deletePropertyImage,
  uploadBrochure,
} from "@/app/actions/properties";
import type { PropertyImage } from "@/types";

function UploadSection({
  title,
  helperText,
  accept,
  images,
  propertyId,
  isFloorPlan,
}: {
  title: string;
  helperText: string;
  accept: string;
  images: PropertyImage[];
  propertyId: string;
  isFloorPlan: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [localImages, setLocalImages] = useState(images);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    startTransition(async () => {
      for (let i = 0; i < files.length; i++) {
        try {
          await uploadPropertyImage(propertyId, files[i], isFloorPlan, localImages.length + i);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Upload failed.");
        }
      }
      if (inputRef.current) inputRef.current.value = "";
      // Optimistic-ish: rely on server revalidation on next navigation;
      // for immediate feedback we re-read from the DOM isn't possible here,
      // so we prompt a soft refresh via location reload of this section only
      // is avoided — parent page revalidatePath handles it on next load.
    });
  }

  function handleDelete(imageId: string) {
    startTransition(async () => {
      await deletePropertyImage(imageId, propertyId);
      setLocalImages((prev) => prev.filter((img) => img.id !== imageId));
    });
  }

  return (
    <div>
      <h3 className="font-medium text-navy">{title}</h3>
      <p className="mt-1 text-xs text-stone-500">{helperText}</p>

      <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {localImages.map((img) => (
          <div key={img.id} className="group relative aspect-square overflow-hidden rounded-sm border border-stone-200">
            <Image src={img.image_url} alt={img.alt_text ?? title} fill sizes="150px" className="object-cover" />
            <button
              type="button"
              onClick={() => handleDelete(img.id)}
              disabled={isPending}
              className="absolute inset-0 flex items-center justify-center bg-navy-950/0 text-white opacity-0 transition-all group-hover:bg-navy-950/50 group-hover:opacity-100"
              aria-label="Delete image"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}

        <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-sm border border-dashed border-stone-300 text-stone-400 hover:border-navy hover:text-navy">
          <Upload size={18} />
          <span className="text-xs">Upload</span>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple
            className="sr-only"
            onChange={(e) => handleUpload(e.target.files)}
            disabled={isPending}
          />
        </label>
      </div>

      {error && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle size={13} /> {error}
        </p>
      )}
    </div>
  );
}

function BrochureUpload({
  propertyId,
  brochureUrl,
}: {
  propertyId: string;
  brochureUrl: string | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleUpload(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setError(null);
    startTransition(async () => {
      try {
        await uploadBrochure(propertyId, file);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed.");
      }
    });
  }

  return (
    <div>
      <h3 className="font-medium text-navy">Brochure (PDF)</h3>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        {brochureUrl && (
          <a
            href={brochureUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-sm border border-stone-200 px-3 py-2 text-sm text-navy hover:bg-stone-50"
          >
            <FileDown size={15} /> Current brochure
          </a>
        )}
        <label>
          <span className="inline-block cursor-pointer rounded-sm border border-stone-300 px-3.5 py-2 text-sm font-medium text-navy hover:bg-stone-50">
            {isPending ? "Uploading..." : brochureUrl ? "Replace Brochure" : "Upload Brochure"}
          </span>
          <input
            type="file"
            accept="application/pdf"
            className="sr-only"
            onChange={(e) => handleUpload(e.target.files)}
            disabled={isPending}
          />
        </label>
      </div>
      {error && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle size={13} /> {error}
        </p>
      )}
    </div>
  );
}

export default function MediaManager({
  propertyId,
  images,
  brochureUrl,
}: {
  propertyId: string;
  images: PropertyImage[];
  brochureUrl: string | null;
}) {
  const photos = images.filter((img) => !img.is_floor_plan);
  const floorPlans = images.filter((img) => img.is_floor_plan);

  return (
    <div className="space-y-8 rounded-sm border border-stone-200 bg-white p-6">
      <h2 className="font-display text-lg text-navy">Media</h2>
      <UploadSection
        title="Gallery Photos"
        helperText="JPEG, PNG, or WEBP. Max 5MB each."
        accept="image/jpeg,image/png,image/webp"
        images={photos}
        propertyId={propertyId}
        isFloorPlan={false}
      />
      <UploadSection
        title="Floor Plans"
        helperText="JPEG, PNG, or WEBP. Max 5MB each."
        accept="image/jpeg,image/png,image/webp"
        images={floorPlans}
        propertyId={propertyId}
        isFloorPlan={true}
      />
      <BrochureUpload propertyId={propertyId} brochureUrl={brochureUrl} />
    </div>
  );
}

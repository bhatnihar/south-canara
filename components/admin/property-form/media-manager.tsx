"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, Trash2, FileDown, AlertCircle, Film } from "lucide-react";
import {
  createPropertyVideoUpload,
  deletePropertyMedia,
  savePropertyVideoRecord,
  uploadBrochure,
  uploadPropertyImage,
} from "@/app/actions/properties";
import { createClient } from "@/lib/supabase/client";
import { ALLOWED_VIDEO_TYPES, MAX_VIDEO_SIZE_BYTES } from "@/lib/validations";
import type { PropertyImage } from "@/types";

function UploadSection({ title, helperText, accept, images, propertyId, isFloorPlan }: { title: string; helperText: string; accept: string; images: PropertyImage[]; propertyId: string; isFloorPlan: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [localImages, setLocalImages] = useState(images);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleUpload(files: FileList | null) {
    if (!files?.length) return;
    setError(null);
    startTransition(async () => {
      for (let i = 0; i < files.length; i++) {
        try {
          const formData = new FormData();
          formData.append("propertyId", propertyId);
          formData.append("isFloorPlan", String(isFloorPlan));
          formData.append("displayOrder", String(localImages.length + i));
          formData.append("file", files[i]);
          await uploadPropertyImage(formData);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Upload failed.");
        }
      }
      if (inputRef.current) inputRef.current.value = "";
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      try {
        await deletePropertyMedia(id, propertyId);
        setLocalImages((prev) => prev.filter((img) => img.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Delete failed.");
      }
    });
  }

  return <div>
    <h3 className="font-medium text-navy">{title}</h3>
    <p className="mt-1 text-xs text-stone-500">{helperText}</p>
    <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
      {localImages.map((img) => <div key={img.id} className="group relative aspect-square overflow-hidden rounded-sm border border-stone-200">
        <Image src={img.image_url} alt={img.alt_text ?? title} fill sizes="150px" className="object-cover" />
        <button type="button" onClick={() => handleDelete(img.id)} disabled={isPending} className="absolute inset-0 flex items-center justify-center bg-navy-950/0 text-white opacity-0 transition-all group-hover:bg-navy-950/50 group-hover:opacity-100" aria-label="Delete image"><Trash2 size={18} /></button>
      </div>)}
      <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-sm border border-dashed border-stone-300 text-stone-400 hover:border-navy hover:text-navy">
        <Upload size={18} /><span className="text-xs">Upload</span>
        <input ref={inputRef} type="file" accept={accept} multiple className="sr-only" onChange={(e) => handleUpload(e.target.files)} disabled={isPending} />
      </label>
    </div>
    {error && <p role="alert" className="mt-2 flex items-center gap-1.5 text-xs text-red-600"><AlertCircle size={13} /> {error}</p>}
  </div>;
}

function VideoUploadSection({ videos, propertyId }: { videos: PropertyImage[]; propertyId: string }) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [localVideos, setLocalVideos] = useState(videos);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(files: FileList | null) {
    if (!files?.length || isUploading) return;
    const selectedFiles = Array.from(files);
    setError(null);
    setIsUploading(true);
    let completed = 0;

    try {
      const supabase = createClient();
      for (const file of selectedFiles) {
        if (!ALLOWED_VIDEO_TYPES.includes(file.type)) throw new Error(`${file.name}: Choose an MP4, WEBM, or MOV video.`);
        if (file.size === 0 || file.size > MAX_VIDEO_SIZE_BYTES) throw new Error(`${file.name}: Video must be larger than 0 and no bigger than 200MB.`);

        const { path, token } = await createPropertyVideoUpload(propertyId, file.type, file.size);
        const { error: uploadError } = await supabase.storage
          .from("property-videos")
          .uploadToSignedUrl(path, token, file, { contentType: file.type, cacheControl: "3600" });
        if (uploadError) throw new Error(`Storage upload failed for ${file.name}: ${uploadError.message}`);

        const video = await savePropertyVideoRecord(propertyId, path, localVideos.length + completed);
        setLocalVideos((previous) => [...previous, video as PropertyImage]);
        completed += 1;
      }

      if (inputRef.current) inputRef.current.value = "";
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Video upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  function handleDelete(id: string) {
    setError(null);
    startTransition(async () => {
      try {
        await deletePropertyMedia(id, propertyId);
        setLocalVideos((prev) => prev.filter((video) => video.id !== id));
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Delete failed.");
      }
    });
  }

  return <div>
    <h3 className="font-medium text-navy">Property Videos</h3>
    <p className="mt-1 text-xs text-stone-500">MP4, WEBM, or MOV. Max 200MB each.</p>
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {localVideos.map((video) => <div key={video.id} className="group relative aspect-video overflow-hidden rounded-sm border border-stone-200 bg-stone-100">
        <video src={video.video_url ?? undefined} className="h-full w-full object-cover" muted preload="metadata" />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-navy-950/20"><Film size={22} className="text-white" /></div>
        <button type="button" onClick={() => handleDelete(video.id)} disabled={isPending || isUploading} className="absolute inset-0 flex items-center justify-center bg-navy-950/0 text-white opacity-0 transition-all group-hover:bg-navy-950/60 group-hover:opacity-100" aria-label="Delete video"><Trash2 size={18} /></button>
      </div>)}
      <label className={`flex aspect-video flex-col items-center justify-center gap-1.5 rounded-sm border border-dashed border-stone-300 text-stone-400 ${isUploading ? "cursor-wait opacity-60" : "cursor-pointer hover:border-navy hover:text-navy"}`}>
        <Upload size={18} /><span className="text-xs">{isUploading ? "Uploading video..." : "Upload video"}</span>
        <input ref={inputRef} type="file" accept="video/mp4,video/webm,video/quicktime" multiple className="sr-only" onChange={(e) => handleUpload(e.target.files)} disabled={isUploading || isPending} />
      </label>
    </div>
    {isUploading && <p role="status" className="mt-2 text-xs text-stone-500">Uploading directly to storage. Keep this page open until the upload completes.</p>}
    {error && <p role="alert" className="mt-2 flex items-center gap-1.5 text-xs text-red-600"><AlertCircle size={13} /> {error}</p>}
  </div>;
}

function BrochureUpload({ propertyId, brochureUrl }: { propertyId: string; brochureUrl: string | null }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleUpload(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setError(null);
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("propertyId", propertyId);
        formData.append("file", file);
        await uploadBrochure(formData);
        if (inputRef.current) inputRef.current.value = "";
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed.");
      }
    });
  }

  return <div>
    <h3 className="font-medium text-navy">Brochure (PDF)</h3>
    <div className="mt-3 flex flex-wrap items-center gap-3">
      {brochureUrl && <a href={brochureUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-sm border border-stone-200 px-3 py-2 text-sm text-navy hover:bg-stone-50"><FileDown size={15} /> Current brochure</a>}
      <label><span className="inline-block cursor-pointer rounded-sm border border-stone-300 px-3.5 py-2 text-sm font-medium text-navy hover:bg-stone-50">{isPending ? "Uploading..." : brochureUrl ? "Replace Brochure" : "Upload Brochure"}</span><input ref={inputRef} type="file" accept="application/pdf" className="sr-only" onChange={(e) => handleUpload(e.target.files)} disabled={isPending} /></label>
    </div>
    {error && <p className="mt-2 flex items-center gap-1.5 text-xs text-red-600"><AlertCircle size={13} /> {error}</p>}
  </div>;
}

export default function MediaManager({ propertyId, images, brochureUrl }: { propertyId: string; images: PropertyImage[]; brochureUrl: string | null }) {
  const photos = images.filter((img) => !img.is_floor_plan && img.media_type !== "video");
  const floorPlans = images.filter((img) => img.is_floor_plan && img.media_type !== "video");
  const videos = images.filter((img) => img.media_type === "video");
  return <div className="space-y-8 rounded-sm border border-stone-200 bg-white p-6">
    <h2 className="font-display text-lg text-navy">Media</h2>
    <UploadSection title="Gallery Photos" helperText="JPEG, PNG, or WEBP. Max 5MB each." accept="image/jpeg,image/png,image/webp" images={photos} propertyId={propertyId} isFloorPlan={false} />
    <UploadSection title="Floor Plans" helperText="JPEG, PNG, or WEBP. Max 5MB each." accept="image/jpeg,image/png,image/webp" images={floorPlans} propertyId={propertyId} isFloorPlan={true} />
    <VideoUploadSection videos={videos} propertyId={propertyId} />
    <BrochureUpload propertyId={propertyId} brochureUrl={brochureUrl} />
  </div>;
}

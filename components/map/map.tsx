import { MapPin, ExternalLink } from "lucide-react";

/**
 * Renders a Google Maps embed when NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY
 * is configured. Falls back to a static card with an "Open in Google Maps"
 * link so the page still works (and never shows a broken iframe) before
 * that key is provided.
 */
export default function Map({
  latitude,
  longitude,
  label,
}: {
  latitude: number | null;
  longitude: number | null;
  label: string;
}) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY;
  const hasCoordinates = latitude !== null && longitude !== null;

  if (apiKey && hasCoordinates) {
    return (
      <div className="aspect-[16/9] w-full overflow-hidden rounded-sm border border-stone-200">
        <iframe
          title={`Map showing ${label}`}
          className="h-full w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${latitude},${longitude}`}
        />
      </div>
    );
  }

  const searchUrl = hasCoordinates
    ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(label)}`;

  return (
    <a
      href={searchUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-stone-300 bg-stone-50 text-center transition-colors hover:bg-stone-100"
    >
      <MapPin size={22} className="text-navy-400" />
      <span className="flex items-center gap-1.5 text-sm font-medium text-navy">
        Open {label} in Google Maps
        <ExternalLink size={14} />
      </span>
    </a>
  );
}

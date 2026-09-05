import { Phone, MessageCircle, MessageSquareText } from "lucide-react";
import { telLink, whatsappLink } from "@/lib/config";

/**
 * Sticky bottom action bar for mobile property detail pages, so the
 * three highest-intent actions stay reachable without scrolling back up.
 */
export default function StickyMobileCTA({
  propertyName,
  onEnquireHref = "#enquire",
}: {
  propertyName: string;
  onEnquireHref?: string;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex border-t border-stone-200 bg-white/95 backdrop-blur lg:hidden">
      <a
        href={telLink()}
        className="flex flex-1 flex-col items-center gap-1 py-3 text-navy"
        aria-label="Call us"
      >
        <Phone size={18} />
        <span className="text-xs font-medium">Call</span>
      </a>
      <a
        href={whatsappLink(propertyName)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 flex-col items-center gap-1 border-l border-stone-200 py-3 text-navy"
        aria-label="Message us on WhatsApp"
      >
        <MessageCircle size={18} />
        <span className="text-xs font-medium">WhatsApp</span>
      </a>
      <a
        href={onEnquireHref}
        className="flex flex-1 flex-col items-center gap-1 border-l border-stone-200 bg-navy py-3 text-white"
        aria-label="Jump to enquiry form"
      >
        <MessageSquareText size={18} />
        <span className="text-xs font-medium">Enquire</span>
      </a>
    </div>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Phone, MessageCircle, FileDown } from "lucide-react";
import { getPropertyBySlug } from "@/lib/data/properties";
import { formatPriceINR } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import PropertyGallery from "@/components/property-gallery/property-gallery";
import PropertySummary from "@/components/property-summary/property-summary";
import Amenities from "@/components/amenities/amenities";
import Map from "@/components/map/map";
import EnquiryForm from "@/components/enquiry-form/enquiry-form";
import StickyMobileCTA from "@/components/sticky-cta/sticky-mobile-cta";
import { siteConfig, telLink, whatsappLink } from "@/lib/config";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const property = await getPropertyBySlug(params.slug);
  if (!property) return { title: "Property Not Found" };

  const description = `${property.title} in ${property.location}, ${property.city}. ${
    property.bedrooms ? `${property.bedrooms} BHK, ` : ""
  }${property.area_sqft.toLocaleString("en-IN")} sq.ft. ${
    property.price_display || formatPriceINR(property.price)
  }.`;

  const coverImage = property.property_images.find((img) => !img.is_floor_plan)?.image_url;

  return {
    title: property.title,
    description,
    alternates: { canonical: `/properties/${property.slug}` },
    openGraph: {
      title: property.title,
      description,
      url: `${siteConfig.url}/properties/${property.slug}`,
      images: coverImage ? [{ url: coverImage }] : undefined,
    },
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const property = await getPropertyBySlug(params.slug);
  if (!property) notFound();

  const floorPlans = property.property_images.filter((img) => img.is_floor_plan);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: property.title,
    description: property.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: property.city,
      addressRegion: "Karnataka",
      addressCountry: "IN",
      streetAddress: property.location,
    },
    ...(property.latitude && property.longitude
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: property.latitude,
            longitude: property.longitude,
          },
        }
      : {}),
  };

  return (
    <div className="pb-24 lg:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container-content pt-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-stone-500">
          <Link href="/" className="hover:text-navy">Home</Link>
          <ChevronRight size={12} />
          <Link href="/properties" className="hover:text-navy">Properties</Link>
          <ChevronRight size={12} />
          <span className="text-navy-700">{property.title}</span>
        </nav>
      </div>

      <div className="container-content mt-4 grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <PropertyGallery
            images={property.property_images}
            propertyTitle={property.title}
            fallbackSeed={property.slug}
          />

          <div className="mt-8 flex flex-col gap-3 border-b border-stone-200 pb-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <StatusBadge status={property.status} />
              </div>
              <h1 className="font-display text-3xl text-navy sm:text-4xl">{property.title}</h1>
              <p className="mt-1.5 text-stone-600">{property.location}, {property.city}</p>
            </div>
            <p className="font-display text-2xl text-navy sm:text-3xl">
              {property.price_display || formatPriceINR(property.price)}
            </p>
          </div>

          <div className="mt-8">
            <PropertySummary property={property} />
          </div>

          <div className="mt-10 hidden gap-3 sm:flex">
            <a href="#enquire" className={buttonVariants({ size: "lg" })}>
              Enquire Now
            </a>
            <a href="#enquire" className={buttonVariants({ variant: "outline", size: "lg" })}>
              Schedule Site Visit
            </a>
            <a href={telLink()} className={buttonVariants({ variant: "outline", size: "lg" })}>
              <Phone size={16} /> Call
            </a>
            <a
              href={whatsappLink(property.title)}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              <MessageCircle size={16} /> WhatsApp
            </a>
          </div>

          <div className="mt-10 border-t border-stone-200 pt-10">
            <h2 className="font-display text-2xl text-navy">About this property</h2>
            <p className="mt-4 whitespace-pre-line leading-relaxed text-stone-700">
              {property.description}
            </p>
          </div>

          {property.amenities.length > 0 && (
            <div className="mt-10 border-t border-stone-200 pt-10">
              <Amenities amenities={property.amenities} />
            </div>
          )}

          {floorPlans.length > 0 && (
            <div className="mt-10 border-t border-stone-200 pt-10">
              <h2 className="font-display text-2xl text-navy">Floor Plans</h2>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {floorPlans.map((plan) => (
                  <a
                    key={plan.id}
                    href={plan.image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block aspect-[4/3] overflow-hidden rounded-sm border border-stone-200 bg-white"
                  >
                    <Image
                      src={plan.image_url}
                      alt={plan.alt_text ?? `${property.title} floor plan`}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-contain p-2"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {property.brochure_url && (
            <div className="mt-10 border-t border-stone-200 pt-10">
              <a
                href={property.brochure_url}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                <FileDown size={17} /> Download Brochure
              </a>
            </div>
          )}

          <div className="mt-10 border-t border-stone-200 pt-10">
            <h2 className="font-display text-2xl text-navy">Location</h2>
            <p className="mt-2 text-stone-600">{property.location}, {property.city}</p>
            <div className="mt-4">
              <Map
                latitude={property.latitude}
                longitude={property.longitude}
                label={property.title}
              />
            </div>
          </div>
        </div>

        <aside className="lg:col-span-4">
          <div
            id="enquire"
            className="sticky top-28 rounded-sm border border-stone-200 bg-white p-6 scroll-mt-28"
          >
            <h2 className="font-display text-xl text-navy">Interested in this property?</h2>
            <p className="mt-1.5 text-sm text-stone-600">
              Send an enquiry and our team will get back to you shortly.
            </p>
            <div className="mt-5">
              <EnquiryForm propertyId={property.id} propertyName={property.title} />
            </div>
          </div>
        </aside>
      </div>

      <StickyMobileCTA propertyName={property.title} />
    </div>
  );
}

"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { createProperty, updateProperty, type PropertyActionState } from "@/app/actions/properties";
import { Input, Textarea, Select, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/utils";
import { PROPERTY_STATUS_LABELS, PROPERTY_TYPE_LABELS } from "@/types";
import type { Amenity, PropertyWithRelations } from "@/types";

const initialState: PropertyActionState = { success: false, message: "" };

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? "Saving..." : label}
    </Button>
  );
}

export default function PropertyForm({
  mode,
  property,
  amenities,
}: {
  mode: "create" | "edit";
  property?: PropertyWithRelations;
  amenities: Amenity[];
}) {
  const router = useRouter();
  const action = mode === "create" ? createProperty : updateProperty.bind(null, property!.id);
  const [state, formAction] = useFormState(action, initialState);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [title, setTitle] = useState(property?.title ?? "");
  const [slug, setSlug] = useState(property?.slug ?? "");
  const selectedAmenityIds = new Set(property?.amenities.map((a) => a.id) ?? []);

  useEffect(() => {
    if (state.success && mode === "create" && state.propertyId) {
      router.push(`/admin/properties/${state.propertyId}`);
    }
  }, [state, mode, router]);

  return (
    <form action={formAction} className="space-y-8">
      <section className="rounded-sm border border-stone-200 bg-white p-6">
        <h2 className="font-display text-lg text-navy">Basic Information</h2>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="title" required>Property Name</Label>
            <Input
              id="title"
              name="title"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="slug" required>
              URL Slug
            </Label>
            <Input
              id="slug"
              name="slug"
              required
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
              }}
            />
            <p className="mt-1.5 text-xs text-stone-500">
              Appears in the URL: /properties/{slug || "your-property-slug"}
            </p>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="description" required>Description</Label>
            <Textarea
              id="description"
              name="description"
              required
              rows={6}
              defaultValue={property?.description}
            />
          </div>
          <div>
            <Label htmlFor="location" required>Location / Locality</Label>
            <Input id="location" name="location" required defaultValue={property?.location} />
          </div>
          <div>
            <Label htmlFor="city" required>City</Label>
            <Input id="city" name="city" required defaultValue={property?.city} />
          </div>
        </div>
      </section>

      <section className="rounded-sm border border-stone-200 bg-white p-6">
        <h2 className="font-display text-lg text-navy">Pricing &amp; Classification</h2>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="price" required>Price (₹)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min={0}
              step="0.01"
              required
              defaultValue={property?.price}
            />
          </div>
          <div>
            <Label htmlFor="price_display">Price Display Override</Label>
            <Input
              id="price_display"
              name="price_display"
              placeholder='e.g. "Starting ₹85 Lakhs"'
              defaultValue={property?.price_display ?? ""}
            />
          </div>
          <div>
            <Label htmlFor="property_type" required>Property Type</Label>
            <Select id="property_type" name="property_type" defaultValue={property?.property_type ?? "apartment"}>
              {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="status" required>Status</Label>
            <Select id="status" name="status" defaultValue={property?.status ?? "upcoming"}>
              {Object.entries(PROPERTY_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
          </div>
        </div>
      </section>

      <section className="rounded-sm border border-stone-200 bg-white p-6">
        <h2 className="font-display text-lg text-navy">Specifications</h2>
        <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-4">
          <div>
            <Label htmlFor="area_sqft" required>Area (sq.ft)</Label>
            <Input id="area_sqft" name="area_sqft" type="number" min={0} required defaultValue={property?.area_sqft} />
          </div>
          <div>
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Input id="bedrooms" name="bedrooms" type="number" min={0} defaultValue={property?.bedrooms ?? ""} />
          </div>
          <div>
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Input id="bathrooms" name="bathrooms" type="number" min={0} defaultValue={property?.bathrooms ?? ""} />
          </div>
          <div>
            <Label htmlFor="possession_date">Possession Date</Label>
            <Input
              id="possession_date"
              name="possession_date"
              type="date"
              defaultValue={property?.possession_date ?? ""}
            />
          </div>
        </div>
      </section>

      <section className="rounded-sm border border-stone-200 bg-white p-6">
        <h2 className="font-display text-lg text-navy">Map Coordinates</h2>
        <p className="mt-1 text-sm text-stone-500">
          Optional — right-click the location on Google Maps and copy the coordinates.
        </p>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="latitude">Latitude</Label>
            <Input id="latitude" name="latitude" type="number" step="any" defaultValue={property?.latitude ?? ""} />
          </div>
          <div>
            <Label htmlFor="longitude">Longitude</Label>
            <Input id="longitude" name="longitude" type="number" step="any" defaultValue={property?.longitude ?? ""} />
          </div>
        </div>
      </section>

      {amenities.length > 0 && (
        <section className="rounded-sm border border-stone-200 bg-white p-6">
          <h2 className="font-display text-lg text-navy">Amenities</h2>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {amenities.map((amenity) => (
              <label key={amenity.id} className="flex items-center gap-2.5 text-sm text-stone-700">
                <input
                  type="checkbox"
                  name="amenity_ids"
                  value={amenity.id}
                  defaultChecked={selectedAmenityIds.has(amenity.id)}
                  className="h-4 w-4 rounded-sm border-stone-300 text-navy focus:ring-navy"
                />
                {amenity.name}
              </label>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-sm border border-stone-200 bg-white p-6">
        <h2 className="font-display text-lg text-navy">Visibility</h2>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:gap-8">
          <label className="flex items-center gap-2.5 text-sm text-stone-700">
            <input
              type="checkbox"
              name="published"
              defaultChecked={property?.published ?? false}
              className="h-4 w-4 rounded-sm border-stone-300 text-navy focus:ring-navy"
            />
            Published (visible on the public site)
          </label>
          <label className="flex items-center gap-2.5 text-sm text-stone-700">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={property?.featured ?? false}
              className="h-4 w-4 rounded-sm border-stone-300 text-navy focus:ring-navy"
            />
            Featured on homepage
          </label>
        </div>
      </section>

      {state.message && (
        <div
          className={`flex items-start gap-2.5 rounded-sm border p-3.5 text-sm ${
            state.success
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {state.success ? (
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          ) : (
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
          )}
          <p>{state.message}</p>
        </div>
      )}

      <SubmitButton label={mode === "create" ? "Create Property" : "Save Changes"} />
    </form>
  );
}

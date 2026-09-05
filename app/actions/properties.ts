"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  propertySchema,
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  ALLOWED_BROCHURE_TYPES,
  MAX_BROCHURE_SIZE_BYTES,
} from "@/lib/validations";

export interface PropertyActionState {
  success: boolean;
  message: string;
  propertyId?: string;
}

async function requireAdmin() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/admin/login");
  }
  return supabase;
}

function parsePropertyForm(formData: FormData) {
  return propertySchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    location: formData.get("location"),
    city: formData.get("city"),
    price: formData.get("price"),
    price_display: formData.get("price_display"),
    property_type: formData.get("property_type"),
    status: formData.get("status"),
    area_sqft: formData.get("area_sqft"),
    bedrooms: formData.get("bedrooms") || undefined,
    bathrooms: formData.get("bathrooms") || undefined,
    possession_date: formData.get("possession_date"),
    latitude: formData.get("latitude") || undefined,
    longitude: formData.get("longitude") || undefined,
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    amenity_ids: formData.getAll("amenity_ids"),
  });
}

export async function createProperty(
  _prevState: PropertyActionState,
  formData: FormData
): Promise<PropertyActionState> {
  const supabase = await requireAdmin();
  const parsed = parsePropertyForm(formData);

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { amenity_ids, ...propertyData } = parsed.data;

  const { data: property, error } = await supabase
    .from("properties")
    .insert({ ...propertyData, possession_date: propertyData.possession_date || null })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { success: false, message: "A property with this slug already exists." };
    }
    console.error("createProperty error:", error.message);
    return { success: false, message: "Could not create property. Please try again." };
  }

  if (amenity_ids.length > 0) {
    await supabase
      .from("property_amenities")
      .insert(amenity_ids.map((amenity_id) => ({ property_id: property.id, amenity_id })));
  }

  revalidatePath("/admin/properties");
  revalidatePath("/properties");
  return { success: true, message: "Property created.", propertyId: property.id };
}

export async function updateProperty(
  propertyId: string,
  _prevState: PropertyActionState,
  formData: FormData
): Promise<PropertyActionState> {
  const supabase = await requireAdmin();
  const parsed = parsePropertyForm(formData);

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { amenity_ids, ...propertyData } = parsed.data;

  const { error } = await supabase
    .from("properties")
    .update({ ...propertyData, possession_date: propertyData.possession_date || null })
    .eq("id", propertyId);

  if (error) {
    if (error.code === "23505") {
      return { success: false, message: "A property with this slug already exists." };
    }
    console.error("updateProperty error:", error.message);
    return { success: false, message: "Could not save changes. Please try again." };
  }

  // Replace amenity associations wholesale — simplest correct approach for admin-scale data.
  await supabase.from("property_amenities").delete().eq("property_id", propertyId);
  if (amenity_ids.length > 0) {
    await supabase
      .from("property_amenities")
      .insert(amenity_ids.map((amenity_id) => ({ property_id: propertyId, amenity_id })));
  }

  revalidatePath("/admin/properties");
  revalidatePath(`/admin/properties/${propertyId}`);
  revalidatePath("/properties");
  revalidatePath(`/properties/${parsed.data.slug}`);
  return { success: true, message: "Changes saved.", propertyId };
}

export async function deleteProperty(propertyId: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("properties").delete().eq("id", propertyId);
  if (error) {
    console.error("deleteProperty error:", error.message);
    throw new Error("Could not delete property.");
  }
  revalidatePath("/admin/properties");
  revalidatePath("/properties");
}

export async function togglePublished(propertyId: string, published: boolean) {
  const supabase = await requireAdmin();
  await supabase.from("properties").update({ published }).eq("id", propertyId);
  revalidatePath("/admin/properties");
  revalidatePath("/properties");
}

export async function uploadPropertyImage(
  propertyId: string,
  file: File,
  isFloorPlan: boolean,
  displayOrder: number
) {
  const supabase = await requireAdmin();

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Only JPEG, PNG, or WEBP images are allowed.");
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error("Image must be smaller than 5MB.");
  }

  const extension = file.name.split(".").pop() ?? "jpg";
  const path = `${propertyId}/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("property-images")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    throw new Error("Image upload failed. Please try again.");
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("property-images").getPublicUrl(path);

  const { error: insertError } = await supabase.from("property_images").insert({
    property_id: propertyId,
    image_url: publicUrl,
    display_order: displayOrder,
    is_floor_plan: isFloorPlan,
  });

  if (insertError) {
    throw new Error("Could not save image record.");
  }

  revalidatePath(`/admin/properties/${propertyId}`);
}

export async function deletePropertyImage(imageId: string, propertyId: string) {
  const supabase = await requireAdmin();
  await supabase.from("property_images").delete().eq("id", imageId);
  revalidatePath(`/admin/properties/${propertyId}`);
}

export async function uploadBrochure(propertyId: string, file: File) {
  const supabase = await requireAdmin();

  if (!ALLOWED_BROCHURE_TYPES.includes(file.type)) {
    throw new Error("Brochure must be a PDF.");
  }
  if (file.size > MAX_BROCHURE_SIZE_BYTES) {
    throw new Error("Brochure must be smaller than 15MB.");
  }

  const path = `${propertyId}/brochure.pdf`;
  const { error: uploadError } = await supabase.storage
    .from("brochures")
    .upload(path, file, { contentType: file.type, upsert: true });

  if (uploadError) {
    throw new Error("Brochure upload failed. Please try again.");
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("brochures").getPublicUrl(path);

  await supabase.from("properties").update({ brochure_url: publicUrl }).eq("id", propertyId);
  revalidatePath(`/admin/properties/${propertyId}`);
}

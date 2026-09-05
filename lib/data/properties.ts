import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Property, PropertyWithRelations, Amenity, PropertyImage } from "@/types";

const PROPERTY_WITH_RELATIONS_SELECT = `
  *,
  property_images ( id, property_id, image_url, alt_text, display_order, is_floor_plan, created_at ),
  property_amenities ( amenities ( id, name, icon ) )
`;

interface PropertyAmenityJoinRow {
  amenities: Amenity | null;
}

interface PropertyRelationsRow extends Property {
  property_images: PropertyImage[];
  property_amenities: PropertyAmenityJoinRow[];
}

function normalizeRelations(row: PropertyRelationsRow): PropertyWithRelations {
  const amenities: Amenity[] =
    row.property_amenities?.map((pa) => pa.amenities).filter((a): a is Amenity => a !== null) ??
    [];
  const property_images = [...(row.property_images ?? [])].sort(
    (a, b) => a.display_order - b.display_order
  );
  return { ...row, amenities, property_images };
}

export interface PropertyFilters {
  search?: string;
  city?: string;
  propertyType?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  sort?: "newest" | "price_asc" | "price_desc";
}

export async function getPublishedProperties(
  filters: PropertyFilters = {}
): Promise<PropertyWithRelations[]> {
  const supabase = createServerSupabaseClient();
  let query = supabase
    .from("properties")
    .select(PROPERTY_WITH_RELATIONS_SELECT)
    .eq("published", true);

  if (filters.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,location.ilike.%${filters.search}%,city.ilike.%${filters.search}%`
    );
  }
  if (filters.city) query = query.eq("city", filters.city);
  if (filters.propertyType) query = query.eq("property_type", filters.propertyType);
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.minPrice !== undefined) query = query.gte("price", filters.minPrice);
  if (filters.maxPrice !== undefined) query = query.lte("price", filters.maxPrice);
  if (filters.bedrooms !== undefined) query = query.eq("bedrooms", filters.bedrooms);

  switch (filters.sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;
  if (error) {
    console.error("getPublishedProperties error:", error.message);
    return [];
  }
  return (data ?? []).map(normalizeRelations);
}

export async function getFeaturedProperties(limit = 6): Promise<PropertyWithRelations[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("properties")
    .select(PROPERTY_WITH_RELATIONS_SELECT)
    .eq("published", true)
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getFeaturedProperties error:", error.message);
    return [];
  }
  return (data ?? []).map(normalizeRelations);
}

export async function getPropertyBySlug(slug: string): Promise<PropertyWithRelations | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("properties")
    .select(PROPERTY_WITH_RELATIONS_SELECT)
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !data) return null;
  return normalizeRelations(data);
}

export async function getAllAmenities(): Promise<Amenity[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from("amenities").select("*").order("name");
  if (error) {
    console.error("getAllAmenities error:", error.message);
    return [];
  }
  return data ?? [];
}

// ---------------------------------------------------------------------
// Admin-facing reads (RLS still applies — caller must be authenticated)
// ---------------------------------------------------------------------

export async function getAllPropertiesAdmin(): Promise<Property[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAllPropertiesAdmin error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getPropertyByIdAdmin(id: string): Promise<PropertyWithRelations | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("properties")
    .select(PROPERTY_WITH_RELATIONS_SELECT)
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return normalizeRelations(data);
}

export async function getUniqueCities(): Promise<string[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("properties")
    .select("city")
    .eq("published", true);
  if (error || !data) return [];
  return Array.from(new Set(data.map((row) => row.city))).sort();
}

export type PropertyStatus =
  | "upcoming"
  | "ongoing"
  | "ready_to_move"
  | "sold_out";

export type PropertyType =
  | "apartment"
  | "villa"
  | "plot"
  | "commercial"
  | "row_house";

export type LeadStatus =
  | "new"
  | "contacted"
  | "interested"
  | "site_visit_scheduled"
  | "negotiation"
  | "converted"
  | "closed";

export interface Amenity {
  id: string;
  name: string;
  icon: string; // lucide-react icon name, e.g. "Waves", "Dumbbell"
}

export interface PropertyImage {
  id: string;
  property_id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
  is_floor_plan: boolean;
  created_at: string;
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  city: string;
  price: number;
  price_display: string | null; // optional override e.g. "Starting ₹85 Lakhs"
  property_type: PropertyType;
  status: PropertyStatus;
  area_sqft: number;
  bedrooms: number | null;
  bathrooms: number | null;
  possession_date: string | null;
  latitude: number | null;
  longitude: number | null;
  featured: boolean;
  published: boolean;
  brochure_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface PropertyWithRelations extends Property {
  property_images: PropertyImage[];
  amenities: Amenity[];
}

export interface Lead {
  id: string;
  property_id: string | null;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  interested_in_site_visit: boolean;
  source: string;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
}

export interface LeadWithProperty extends Lead {
  property: Pick<Property, "id" | "title" | "slug"> | null;
}

export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
  upcoming: "Upcoming",
  ongoing: "Ongoing",
  ready_to_move: "Ready to Move",
  sold_out: "Sold Out",
};

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  apartment: "Apartment",
  villa: "Villa",
  plot: "Plot",
  commercial: "Commercial",
  row_house: "Row House",
};

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  interested: "Interested",
  site_visit_scheduled: "Site Visit Scheduled",
  negotiation: "Negotiation",
  converted: "Converted",
  closed: "Closed",
};

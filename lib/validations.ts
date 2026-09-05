import { z } from "zod";

export const enquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(120, "Name is too long"),
  phone: z
    .string()
    .trim()
    .regex(/^[+]?[\d\s-]{7,20}$/, "Please enter a valid phone number"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  message: z.string().trim().max(2000, "Message is too long").optional().or(z.literal("")),
  interested_in_site_visit: z.boolean().optional().default(false),
  property_id: z.string().uuid().optional().nullable(),
  // Honeypot field — real users never fill this in; bots often do.
  company_website: z.string().max(0, "Spam detected").optional().or(z.literal("")),
});

export type EnquiryFormValues = z.infer<typeof enquirySchema>;

export const propertySchema = z.object({
  title: z.string().trim().min(3, "Title is required").max(200),
  slug: z
    .string()
    .trim()
    .min(3, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  description: z.string().trim().min(1, "Description is required"),
  location: z.string().trim().min(2, "Location is required"),
  city: z.string().trim().min(2, "City is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  price_display: z.string().trim().optional().or(z.literal("")),
  property_type: z.enum(["apartment", "villa", "plot", "commercial", "row_house"]),
  status: z.enum(["upcoming", "ongoing", "ready_to_move", "sold_out"]),
  area_sqft: z.coerce.number().positive("Area must be greater than 0"),
  bedrooms: z.coerce.number().int().min(0).optional().nullable(),
  bathrooms: z.coerce.number().int().min(0).optional().nullable(),
  possession_date: z.string().optional().or(z.literal("")),
  latitude: z.coerce.number().min(-90).max(90).optional().nullable(),
  longitude: z.coerce.number().min(-180).max(180).optional().nullable(),
  featured: z.boolean().optional().default(false),
  published: z.boolean().optional().default(false),
  amenity_ids: z.array(z.string().uuid()).optional().default([]),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
export const ALLOWED_BROCHURE_TYPES = ["application/pdf"];
export const MAX_BROCHURE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

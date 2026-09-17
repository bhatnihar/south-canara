import type { MetadataRoute } from "next";
import { getPublishedProperties, getSoldProperties } from "@/lib/data/properties";
import { siteConfig } from "@/lib/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [properties, soldProperties] = await Promise.all([
    getPublishedProperties(),
    getSoldProperties(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteConfig.url}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/properties`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteConfig.url}/sold-properties`, changeFrequency: "weekly", priority: 0.4 },
    { url: `${siteConfig.url}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteConfig.url}/contact`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const propertyRoutes: MetadataRoute.Sitemap = [...properties, ...soldProperties].map((p) => ({
    url: `${siteConfig.url}/properties/${p.slug}`,
    lastModified: p.updated_at,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...propertyRoutes];
}

"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition, useCallback } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input, Select, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PROPERTY_STATUS_LABELS, PROPERTY_TYPE_LABELS } from "@/types";

export default function PropertyFilters({ cities }: { cities: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [showFilters, setShowFilters] = useState(false);
  const [searchValue, setSearchValue] = useState(searchParams.get("search") ?? "");

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [pathname, router, searchParams]
  );

  const activeFilterCount = ["city", "propertyType", "status", "bedrooms"].filter((k) =>
    searchParams.get(k)
  ).length;

  return (
    <div className="border-b border-stone-200 bg-white py-5">
      <div className="container-content">
        <div className="flex flex-col gap-3 sm:flex-row">
          <form
            className="relative flex-1"
            onSubmit={(e) => {
              e.preventDefault();
              updateParams({ search: searchValue || null });
            }}
          >
            <Search
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search by name, location, or city"
              className="pl-10"
              aria-label="Search properties"
            />
          </form>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
            >
              <SlidersHorizontal size={16} />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 rounded-full bg-navy px-1.5 py-0.5 text-[11px] text-white">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            <Select
              value={searchParams.get("sort") ?? "newest"}
              onChange={(e) => updateParams({ sort: e.target.value })}
              aria-label="Sort properties"
              className="w-auto"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </Select>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 gap-4 rounded-sm border border-stone-200 p-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Label htmlFor="filter-city">City</Label>
              <Select
                id="filter-city"
                value={searchParams.get("city") ?? ""}
                onChange={(e) => updateParams({ city: e.target.value || null })}
              >
                <option value="">All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="filter-type">Property Type</Label>
              <Select
                id="filter-type"
                value={searchParams.get("propertyType") ?? ""}
                onChange={(e) => updateParams({ propertyType: e.target.value || null })}
              >
                <option value="">All Types</option>
                {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="filter-status">Status</Label>
              <Select
                id="filter-status"
                value={searchParams.get("status") ?? ""}
                onChange={(e) => updateParams({ status: e.target.value || null })}
              >
                <option value="">Any Status</option>
                {Object.entries(PROPERTY_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="filter-bedrooms">Bedrooms</Label>
              <Select
                id="filter-bedrooms"
                value={searchParams.get("bedrooms") ?? ""}
                onChange={(e) => updateParams({ bedrooms: e.target.value || null })}
              >
                <option value="">Any</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n} BHK</option>
                ))}
              </Select>
            </div>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={() =>
                  updateParams({ city: null, propertyType: null, status: null, bedrooms: null })
                }
                className="flex items-center gap-1.5 text-sm font-medium text-gold-700 hover:underline sm:col-span-2 lg:col-span-4"
              >
                <X size={14} /> Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

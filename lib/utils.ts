import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formats a price in rupees into Indian Lakh/Crore shorthand. */
export function formatPriceINR(price: number): string {
  if (price >= 10000000) {
    const crores = price / 10000000;
    return `₹${trimDecimal(crores)} Cr`;
  }
  if (price >= 100000) {
    const lakhs = price / 100000;
    return `₹${trimDecimal(lakhs)} Lakh`;
  }
  return `₹${price.toLocaleString("en-IN")}`;
}

function trimDecimal(value: number): string {
  return value % 1 === 0 ? value.toFixed(0) : value.toFixed(2).replace(/0$/, "");
}

export function formatArea(sqft: number): string {
  return `${sqft.toLocaleString("en-IN")} sq.ft`;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// src/lib/properties.ts
import { propertiesApi } from './api/properties-api';

export type ListingType = "rent" | "sale";

export interface Property {
  id: string;
  title: string;
  city: string;
  neighborhood?: string;
  address?: string;
  price: number;
  currency?: string;
  listingType: ListingType;
  beds: number;
  baths: number;
  areaSize: number;
  areaUnit?: "sqft" | "sqm";
  propertyType?: string;
  imageUrl: string;
  featured?: boolean;
  createdAt: string;
  lat?: number;
  lng?: number;
  description?: string;
  isNew?: boolean;
}

export type QueryOpts = {
  listingType?: ListingType;
  featured?: boolean;
  city?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  bedsMin?: number;
  sort?: "newest" | "price-asc" | "price-desc";
  limit?: number;
  page?: number;
};

const DEFAULT_NEW_DAYS = 30;

export function isNewListing(p: { createdAt: string }, days = DEFAULT_NEW_DAYS) {
  const ageDays = (Date.now() - new Date(p.createdAt).getTime()) / (1000 * 60 * 60 * 24);
  return ageDays <= days;
}

// Use API functions instead of local JSON
export async function listProperties(): Promise<Property[]> {
  const result = await propertiesApi.getProperties({ limit: 1000 }); // Get all properties
  return result.items;
}

export async function getPropertyById(id: string): Promise<Property | null> {
  return await propertiesApi.getPropertyById(id);
}

export async function queryProperties(opts: QueryOpts = {}) {
  return await propertiesApi.getProperties(opts);
}

// Featured listings
export async function getFeaturedProperties(limit?: number): Promise<Property[]> {
  return await propertiesApi.getFeaturedProperties(limit);
}

// New listings
export async function getNewListings(days = DEFAULT_NEW_DAYS, limit?: number): Promise<Property[]> {
  const allProperties = await listProperties();
  let items = allProperties.filter((p) => isNewListing(p, days));

  if (typeof limit === "number") {
    items = items.slice(0, limit);
  }

  return items;
}

// Map markers
export async function getMapMarkers(type: ListingType | "all" = "all") {
  const allProperties = await listProperties();

  return allProperties
    .filter((p) => (type === "all" ? true : p.listingType === type))
    .filter((p) => typeof p.lat === "number" && typeof p.lng === "number")
    .map((p) => ({
      id: p.id,
      title: p.title,
      lat: p.lat as number,
      lng: p.lng as number,
      price: p.price,
      currency: p.currency ?? "USD",
      listingType: p.listingType,
    }));
}

// Get available filters
export async function getAvailableFilters() {
  return await propertiesApi.getFilters();
}
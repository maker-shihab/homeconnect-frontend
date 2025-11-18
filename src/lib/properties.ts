import type { PropertyResponse } from "@/types/property.types";
import {
  PropertyResponse as ApiPropertyResponse,
  getFeaturedProperties,
  getPropertyById,
  isNewListing,
  propertiesApi,
  PropertyFilters,
  queryProperties,
} from "./api/properties-api";

/**
 * Fetch a list of properties using the public properties API.
 * Falls back to an empty array if the response payload is missing.
 */
export async function listProperties(
  filters: PropertyFilters = {}
): Promise<PropertyResponse[]> {
  const result = await propertiesApi.getProperties(filters);
  const properties = result?.properties ?? [];
  return properties as unknown as PropertyResponse[];
}

/**
 * Fetch the newest property listings within the supplied time window.
 * Defaults to the last 30 days and applies a sensible fetch limit.
 */
export async function getNewListings(
  days = 30,
  limit = 24
): Promise<PropertyResponse[]> {
  const result = await propertiesApi.getProperties({
    sortBy: "createdAt",
    sortOrder: "desc",
    limit,
  });

  const properties = (result?.properties ?? []) as ApiPropertyResponse[];

  return properties
    .filter((property) => isNewListing(property, days))
    .map((property) => ({
      ...property,
      isNew: true,
    })) as unknown as PropertyResponse[];
}

export { getFeaturedProperties, getPropertyById, queryProperties };

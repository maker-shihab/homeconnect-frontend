import data from "@/data/properties.json";

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
  createdAt: string; // ISO
  lat?: number;
  lng?: number;
  description?: string;
}

const PROPERTIES: Property[] = (data as Property[]).map((p) => ({
  currency: "USD",
  areaUnit: "sqft",
  ...p,
}));

export function listProperties(): Property[] {
  return [...PROPERTIES].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getPropertyById(id: string): Property | null {
  return PROPERTIES.find((p) => p.id === id) ?? null;
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

export function queryProperties(opts: QueryOpts = {}) {
  const {
    listingType,
    featured,
    city,
    q,
    minPrice,
    maxPrice,
    bedsMin = 0,
    sort = "newest",
    limit,
    page = 1,
  } = opts;

  let items = listProperties();

  if (listingType) items = items.filter((i) => i.listingType === listingType);
  if (featured !== undefined) items = items.filter((i) => !!i.featured === !!featured);
  if (city && city !== "all") items = items.filter((i) => i.city === city);
  if (bedsMin > 0) items = items.filter((i) => i.beds >= bedsMin);
  if (minPrice !== undefined) items = items.filter((i) => i.price >= minPrice);
  if (maxPrice !== undefined) items = items.filter((i) => i.price <= maxPrice);
  if (q && q.trim()) {
    const text = q.trim().toLowerCase();
    items = items.filter((i) =>
      [i.title, i.city, i.neighborhood, i.propertyType]
        .filter(Boolean)
        .some((s) => s!.toLowerCase().includes(text))
    );
  }

  switch (sort) {
    case "price-asc":
      items = items.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      items = items.sort((a, b) => b.price - a.price);
      break;
    case "newest":
    default:
      items = items.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  const total = items.length;
  if (limit && limit > 0) {
    const start = (page - 1) * limit;
    items = items.slice(start, start + limit);
  }
  return { items, total };
}
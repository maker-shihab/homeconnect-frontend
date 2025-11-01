import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { propertiesApi, PropertyFilters, PropertyResponse, PropertySearchResult } from "@/lib/api/properties-api";
import { Bath, Bed, MapPin, Ruler, ShieldCheck, ShieldOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type ListingType = "rent" | "sale";

export interface PropertyCardProps {
  property: PropertyResponse;
}

export interface PropertiesGridProps {
  listingType?: ListingType;
  filters?: PropertyFilters;
  limit?: number;
  featured?: boolean;
  city?: string;
  page?: number;
}

function formatPrice(price: number, currency = "BDT", listingType: ListingType) {
  try {
    const value = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(price);
    return listingType === "rent" ? `${value}/mo` : value;
  } catch {
    const fallback = `${currency} ${price.toLocaleString()}`;
    return listingType === "rent" ? `${fallback}/mo` : fallback;
  }
}

// Individual Property Card Component
export function PropertyCard({ property }: PropertyCardProps) {
  const {
    id,
    title,
    city,
    neighborhood,
    rentPrice,
    currency = "BDT",
    listingType,
    bedrooms,
    bathrooms,
    areaSize,
    areaUnit = "sqft",
    images,
    isVerified,
    featured,
    createdAt,
    isNew: propIsNew,
  } = property;

  const isNew = propIsNew || (() => {
    const createdDate = new Date(createdAt);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return createdDate > sevenDaysAgo;
  })();

  const convertRentPrise = Number(rentPrice);
  const priceLabel = formatPrice(convertRentPrise, currency, listingType);
  const imageUrl = images?.[0] || '/placeholder-property.jpg';

  return (
    <Link
      href={`/properties/${id}`}
      className="group block focus:outline-none"
      aria-label={`${title} in ${neighborhood ? `${neighborhood}, ` : ""}${city}`}
    >
      <Card
        className="
          relative overflow-hidden rounded-2xl border
          bg-background/60 supports-[backdrop-filter]:backdrop-blur
          shadow-sm transition-all
          hover:-translate-y-0.5 hover:shadow-xl
          ring-1 ring-black/5 dark:ring-white/10
          focus-within:ring-2 focus-within:ring-primary/50 pt-0
        "
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-indigo-500/50 via-blue-500/50 to-sky-500/50"
        />

        <div className="relative h-44 w-full">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width:768px) h-full w-full, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />

          <div className="absolute left-2 top-3 flex gap-2">
            <Badge
              variant="secondary"
              className="
                border border-white/30 bg-white/85 text-black shadow
                hover:bg-white/90
              "
            >
              {listingType === "rent" ? "For Rent" : "For Sale"}
            </Badge>
            {isNew && (
              <Badge className="border border-emerald-400/30 bg-emerald-500 text-white shadow">
                New
              </Badge>
            )}
            {featured && (
              <Badge className="border border-amber-400/30 bg-amber-500 text-white shadow">
                Featured
              </Badge>
            )}
          </div>
        </div>

        <div className="p-4">
          <div className="mb-1 flex items-center justify-between">
            <div className="text-base font-semibold">{priceLabel}</div>

            {isVerified ? (
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium text-emerald-700 bg-emerald-100/80 border border-emerald-200" title="Verified listing">
                <ShieldCheck className="h-3 w-3 text-emerald-600" aria-hidden="true" />
                Verified
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium text-red-700 bg-red-100/80 border border-red-200" title="Not verified">
                <ShieldOff className="h-3 w-3 text-red-600" aria-hidden="true" />
                Not Verified
              </span>
            )}
          </div>

          <h3 className="line-clamp-1 text-sm font-medium">{title}</h3>

          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Bed className="h-4 w-4" aria-hidden="true" /> {bedrooms} {bedrooms === 1 ? 'bd' : 'bds'}
            </span>
            <span className="inline-flex items-center gap-1">
              <Bath className="h-4 w-4" aria-hidden="true" /> {bathrooms} {bathrooms === 1 ? 'ba' : 'bas'}
            </span>
            <span className="inline-flex items-center gap-1">
              <Ruler className="h-4 w-4" aria-hidden="true" /> {areaSize.toLocaleString()} {areaUnit}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            <span className="line-clamp-1">
              {neighborhood ? `${neighborhood}, ` : ""}
              {city}
            </span>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300
            group-hover:opacity-100
            ring-1 ring-inset ring-transparent
            [background:radial-gradient(1200px_400px_at_100%_0%,rgba(99,102,241,0.10),transparent_40%),radial-gradient(1200px_400px_at_0%_100%,rgba(56,189,248,0.10),transparent_40%)]
          "
        />
      </Card>
    </Link>
  );
}

// Server Components for data fetching
export async function PropertiesGrid({
  listingType,
  filters = {},
  limit = 12,
  featured,
  city,
  page = 1
}: PropertiesGridProps) {
  try {
    const queryFilters: PropertyFilters = {
      ...filters,
      limit,
      page,
    };

    if (listingType) {
      queryFilters.listingType = listingType;
    }

    if (featured) {
      queryFilters.featured = true;
    }

    if (city) {
      queryFilters.city = city;
    }

    const propertiesData: PropertySearchResult = await propertiesApi.getProperties(queryFilters);
    const { properties } = propertiesData;
    if (!properties || properties.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No properties found matching your criteria.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    );
  } catch (error) {
    console.error('Error fetching properties:', error);
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load properties. Please try again later.</p>
      </div>
    );
  }
}

export async function PropertiesByCity({ city, limit = 8 }: { city: string; limit?: number }) {
  return <PropertiesGrid city={city} limit={limit} />;
}

export async function FeaturedProperties({ limit = 6 }: { limit?: number }) {
  return <PropertiesGrid featured={true} limit={limit} />;
}

export async function RentProperties({ limit = 12, filters = {}, page = 1 }: { limit?: number; filters?: PropertyFilters; page?: number }) {
  return <PropertiesGrid listingType="rent" limit={limit} filters={filters} page={page} />;
}

export async function SaleProperties({ limit = 12, filters = {}, page = 1 }: { limit?: number; filters?: PropertyFilters; page?: number }) {
  return <PropertiesGrid listingType="sale" limit={limit} filters={filters} page={page} />;
}

// Page-level server components
export async function HomepageFeaturedProperties() {
  return (
    <section className="py-12">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8">Featured Properties</h2>
        <FeaturedProperties limit={6} />
      </div>
    </section>
  );
}

export async function RentPageProperties({ filters = {}, limit = 24 }: { filters?: PropertyFilters; limit?: number }) {
  return (
    <section className="py-8">
      <RentProperties limit={limit} filters={filters} />
    </section>
  );
}

export async function SalePageProperties({ filters = {}, limit = 24 }: { filters?: PropertyFilters; limit?: number }) {
  return (
    <section className="py-8">
      <SaleProperties limit={limit} filters={filters} />
    </section>
  );
}

export async function CityProperties({ city, limit = 24 }: { city: string; limit?: number }) {
  return (
    <section className="py-8">
      <h1 className="text-3xl font-bold mb-8">Properties in {city}</h1>
      <PropertiesByCity city={city} limit={limit} />
    </section>
  );
}

export function PropertyCardWrapper({ property }: { property: PropertyResponse }) {
  return <PropertyCard property={property} />;
}
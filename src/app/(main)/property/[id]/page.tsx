// app/(main)/property/[id]/page.tsx
import { getPropertyById } from "@/lib/properties";
import { ArrowLeft, Bath, Bed, MapPin, Ruler } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// Skeleton component
function PropertyPageSkeleton() {
  return (
    <main className="py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb skeleton */}
        <div className="mb-4 flex items-center gap-2 text-sm">
          <div className="h-4 w-16 animate-pulse bg-muted rounded"></div>
          <span>/</span>
          <div className="h-4 w-20 animate-pulse bg-muted rounded"></div>
          <span>/</span>
          <div className="h-4 w-24 animate-pulse bg-muted rounded"></div>
        </div>

        {/* Title skeleton */}
        <div className="h-8 w-3/4 animate-pulse bg-muted rounded mb-2"></div>
        <div className="h-4 w-1/2 animate-pulse bg-muted rounded mb-6"></div>

        {/* Image skeleton */}
        <div className="aspect-[16/9] w-full animate-pulse bg-muted rounded-xl mb-6"></div>

        <div className="grid gap-6 md:grid-cols-12">
          <section className="md:col-span-8 space-y-6">
            {/* Stats skeleton */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-10 w-10 animate-pulse bg-muted rounded-full"></div>
                  <div className="space-y-1">
                    <div className="h-3 w-16 animate-pulse bg-muted rounded"></div>
                    <div className="h-4 w-8 animate-pulse bg-muted rounded"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Description skeleton */}
            <div className="space-y-3">
              <div className="h-6 w-32 animate-pulse bg-muted rounded"></div>
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse bg-muted rounded"></div>
                <div className="h-4 w-4/5 animate-pulse bg-muted rounded"></div>
                <div className="h-4 w-3/4 animate-pulse bg-muted rounded"></div>
              </div>
            </div>
          </section>

          {/* Sidebar skeleton */}
          <aside className="md:col-span-4">
            <div className="rounded-xl border p-5 space-y-4">
              <div className="h-8 w-32 animate-pulse bg-muted rounded"></div>
              <div className="h-4 w-24 animate-pulse bg-muted rounded"></div>
              <div className="space-y-2 pt-4">
                <div className="h-10 w-full animate-pulse bg-muted rounded"></div>
                <div className="h-10 w-full animate-pulse bg-muted rounded"></div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default async function PropertyPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const p = await getPropertyById(id);

  if (!p) return notFound();

  const currency = p.currency ?? "USD";
  const priceLabel = p.listingType === "rent"
    ? `${currency} ${p.price.toLocaleString()}/month`
    : `${currency} ${p.price.toLocaleString()}`;

  return (
    <main className="py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/search?lt=${p.listingType}`} className="hover:text-foreground transition-colors">
            {p.listingType === "rent" ? "Rent" : "Buy"}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground font-medium">{p.neighborhood ?? p.city}</span>
        </nav>

        {/* Title and Location */}
        <h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">{p.title}</h1>
        <div className="mt-2 flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{p.neighborhood ? `${p.neighborhood}, ` : ""}{p.city}</span>
          {p.address && (
            <>
              <span>•</span>
              <span className="text-sm">{p.address}</span>
            </>
          )}
        </div>

        {/* Main Image */}
        <div className="mt-6 overflow-hidden rounded-xl border">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={p.imageUrl}
              alt={p.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              priority
            />
          </div>
        </div>

        {/* Content Grid */}
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          {/* Main Content */}
          <section className="lg:col-span-8 space-y-8">
            {/* Property Stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                <Bed className="h-6 w-6 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Bedrooms</div>
                  <div className="text-lg font-semibold">{p.beds}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                <Bath className="h-6 w-6 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Bathrooms</div>
                  <div className="text-lg font-semibold">{p.baths}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                <Ruler className="h-6 w-6 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Area</div>
                  <div className="text-lg font-semibold">{p.areaSize.toLocaleString()} {p.areaUnit ?? "sqft"}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                <MapPin className="h-6 w-6 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Type</div>
                  <div className="text-lg font-semibold">{p.propertyType}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-4 text-xl font-semibold">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {p.description || "No description available for this property."}
              </p>
            </div>

            {/* Additional Info */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-4 text-xl font-semibold">Property Details</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-sm text-muted-foreground">Listing Type</div>
                  <div className="font-medium capitalize">{p.listingType}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Property Type</div>
                  <div className="font-medium">{p.propertyType}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">City</div>
                  <div className="font-medium">{p.city}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Neighborhood</div>
                  <div className="font-medium">{p.neighborhood || "Not specified"}</div>
                </div>
              </div>
            </div>
          </section>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 rounded-xl border bg-card p-6 space-y-6">
              {/* Price */}
              <div>
                <div className="text-3xl font-bold text-primary">{priceLabel}</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {p.listingType === "rent" ? "Monthly Rent" : "Sale Price"}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link
                  href="/search"
                  className="flex items-center justify-center gap-2 w-full rounded-md border border-input bg-background px-4 py-3 hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Search
                </Link>
                <Link
                  href={`/search?city=${p.city}&lt=${p.listingType}`}
                  className="flex items-center justify-center w-full rounded-md bg-primary px-4 py-3 text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  View Similar Properties
                </Link>
              </div>

              {/* Quick Info */}
              <div className="pt-4 border-t">
                <div className="text-sm text-muted-foreground">Property ID</div>
                <div className="font-mono text-sm">{p.id}</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    return {
      title: "Property Not Found",
    };
  }

  return {
    title: `${property.title} - ${property.city} | HomeConnect`,
    description: property.description || `Find this ${property.propertyType} in ${property.city} for ${property.listingType}.`,
  };
}
// src/app/new/page.tsx
import { PropertyCard } from "@/components/cards/PropertyCard";
import { getNewListings } from "@/lib/properties";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Listings | HomeConnect",
  description:
    "Fresh properties recently added to HomeConnect. Discover the latest rental and sale properties in your area.",
};

export default async function NewListingsPage() {
  const properties = await getNewListings(30); // last 30 days

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6 mt-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">New Listings</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Fresh properties added in the last 30 days
        </p>
      </div>

      {properties.length === 0 ? (
        <div className="rounded-xl border bg-background p-12 text-center">
          <div className="text-2xl font-semibold mb-2">No New Listings</div>
          <p className="text-muted-foreground mb-6">
            There are no new properties added in the last 30 days.
          </p>
          <a
            href="/search"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Browse All Properties
          </a>
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {properties.length} new propert
              {properties.length !== 1 ? "ies" : "y"} added recently
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {/* Stats section */}
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-4">
            <div className="rounded-lg border bg-card p-6 text-center">
              <div className="text-2xl font-bold text-primary">
                {properties.length}
              </div>
              <div className="text-sm text-muted-foreground">
                New Properties
              </div>
            </div>
            <div className="rounded-lg border bg-card p-6 text-center">
              <div className="text-2xl font-bold text-primary">
                {properties.filter((p) => p.listingType === "rent").length}
              </div>
              <div className="text-sm text-muted-foreground">New Rentals</div>
            </div>
            <div className="rounded-lg border bg-card p-6 text-center">
              <div className="text-2xl font-bold text-primary">
                {properties.filter((p) => p.listingType === "sale").length}
              </div>
              <div className="text-sm text-muted-foreground">New For Sale</div>
            </div>
            <div className="rounded-lg border bg-card p-6 text-center">
              <div className="text-2xl font-bold text-primary">
                {Math.round(
                  (properties.filter((p) => p.isNew).length /
                    properties.length) *
                    100
                )}
                %
              </div>
              <div className="text-sm text-muted-foreground">
                Fresh Listings
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

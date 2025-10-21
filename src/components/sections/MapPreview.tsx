// components/MapPreview.tsx (Alternative version)
"use client";

import type { Property } from "@/components/cards/PropertyCard";
import type { BaseMapItem } from "@/components/maps/LeafletMap";
import { Button } from "@/components/ui/button";
import { getFeaturedProperties } from "@/lib/properties";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";

const LeafletMap = dynamic(() => import("@/components/maps/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] items-center justify-center text-sm text-muted-foreground">
      Loading map…
    </div>
  ),
});

type MapItem = Property & { lat: number; lng: number };

export default function MapPreview({
  title = "Map Preview",
  viewFullMapHref = "/map",
}: {
  title?: string;
  viewFullMapHref?: string;
}) {
  const [mapItems, setMapItems] = useState<BaseMapItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProperties() {
      try {
        setIsLoading(true);
        const properties = await getFeaturedProperties(30); // Get featured properties
        const itemsWithCoords = properties
          .filter((p): p is MapItem => !!(p.lat && p.lng))
          .map((p) => ({
            id: p.id,
            title: p.title,
            city: p.city,
            neighborhood: p.neighborhood,
            price: p.price,
            currency: p.currency,
            listingType: p.listingType,
            lat: p.lat,
            lng: p.lng,
          }));
        setMapItems(itemsWithCoords);
      } catch (err) {
        setError("Failed to load properties");
        console.error("Error loading properties:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadProperties();
  }, []);

  if (error) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="rounded-xl border bg-background p-8 text-center">
            <div className="text-muted-foreground">{error}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-2xl font-bold">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Explore properties on the map
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-[#2563eb]" />
                <span>For Rent</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-[#dc2626]" />
                <span>For Sale</span>
              </div>
            </div>

            <Button asChild variant="default" size="sm">
              <Link href={viewFullMapHref}>
                Open Full Map
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl border bg-card">
          {isLoading ? (
            <div className="flex h-[420px] items-center justify-center">
              <div className="text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-2"></div>
                <div className="text-sm text-muted-foreground">Loading map data...</div>
              </div>
            </div>
          ) : mapItems.length === 0 ? (
            <div className="flex h-[420px] items-center justify-center">
              <div className="text-center text-muted-foreground">
                <div className="mb-2">No properties with location data available</div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/search">Browse All Properties</Link>
                </Button>
              </div>
            </div>
          ) : (
            <LeafletMap
              items={mapItems}
              heightClass="h-[420px] md:h-[520px]"
              className="rounded-xl"
            />
          )}
        </div>

        {!isLoading && mapItems.length > 0 && (
          <div className="mt-4 flex justify-center">
            <div className="text-sm text-muted-foreground">
              Showing {mapItems.length} propert{mapItems.length !== 1 ? 'ies' : 'y'} on map
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
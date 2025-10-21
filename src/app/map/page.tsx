// app/map/page.tsx
"use client";

import { listProperties } from "@/lib/properties";
import { useEffect, useState } from "react";
import MapSearchClient from "./MapSearchClient";

type MapItem = {
  id: string;
  title: string;
  city: string;
  neighborhood?: string;
  price: number;
  currency?: string;
  listingType: "rent" | "sale";
  beds: number;
  baths: number;
  areaSize: number;
  areaUnit?: string;
  propertyType?: string;
  imageUrl: string;
  featured?: boolean;
  createdAt: string;
  lat: number;
  lng: number;
  description?: string;
  isNew?: boolean;
};

export default function MapPage() {
  const [mapItems, setMapItems] = useState<MapItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProperties() {
      try {
        setIsLoading(true);
        const items = await listProperties();
        const itemsWithCoords = items.filter(p => p.lat && p.lng);
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
      <main className="py-6">
        <div className="container mx-auto px-4">
          <div className="rounded-xl border bg-background p-8 text-center">
            <div className="text-xl font-semibold mb-2">Failed to load map</div>
            <div className="text-muted-foreground mb-4">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="py-6">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-12 mt-20">
            {/* Map skeleton */}
            <section className="md:col-span-7 lg:col-span-8">
              <div className="h-[70vh] md:h-[80vh] rounded-xl border bg-muted animate-pulse"></div>
            </section>

            {/* Sidebar skeleton */}
            <aside className="md:col-span-5 lg:col-span-4">
              <div className="rounded-xl border bg-background p-6 space-y-6 h-[80vh]">
                <div className="space-y-4">
                  <div className="h-8 w-3/4 bg-muted rounded animate-pulse"></div>
                  <div className="h-4 w-1/2 bg-muted rounded animate-pulse"></div>
                  <div className="h-10 bg-muted rounded animate-pulse"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-16 bg-muted rounded animate-pulse"></div>
                    <div className="h-16 bg-muted rounded animate-pulse"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-12 bg-muted rounded animate-pulse"></div>
                    <div className="h-12 bg-muted rounded animate-pulse"></div>
                    <div className="h-12 bg-muted rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-6">
      <div className="container mx-auto px-4">
        <MapSearchClient items={mapItems} />
      </div>
    </main>
  );
}
"use client";

import type { Property } from "@/components/cards/PropertyCard";
import type { BaseMapItem } from "@/components/maps/LeafletMap";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import Link from "next/link";

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
  items,
  viewFullMapHref = "/map",
}: {
  title?: string;
  items: MapItem[];
  viewFullMapHref?: string;
}) {
  const mapItems: BaseMapItem[] = items.map((p) => ({
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

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-2xl font-bold">{title}</h3>
          <div className="flex items-center gap-3 rounded-md bg-white/90 p-2 text-xs shadow">
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-[#2563eb]" /> Rent
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-[#dc2626]" /> Buy
            </div>
            <Button asChild>
              <Link href={viewFullMapHref}>Open map search</Link>
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl border">
          <LeafletMap items={mapItems} heightClass="h-[420px] md:h-[520px]" />
        </div>
      </div>
    </section>
  );
}
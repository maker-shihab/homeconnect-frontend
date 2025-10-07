"use client";

import PropertyCard, { Property } from "@/components/cards/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useRef, useState } from "react";

type MapItem = Property & { lat: number; lng: number };

const colorByType = (t: "rent" | "sale") => (t === "rent" ? "#2563eb" : "#dc2626");
const DEFAULT_CENTER: [number, number] = [23.8103, 90.4125];

// Build bounds without importing Leaflet types on the server
function computeBounds(points: { lat: number; lng: number }[]) {
  if (!points.length) return null;
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  const southWest: [number, number] = [Math.min(...lats), Math.min(...lngs)];
  const northEast: [number, number] = [Math.max(...lats), Math.max(...lngs)];
  return [southWest, northEast] as [[number, number], [number, number]];
}

export default function MapSearchClient({ items }: { items: MapItem[] }) {
  // Filters
  const cities = useMemo(() => Array.from(new Set(items.map((i) => i.city))).sort(), [items]);
  const [listingType, setListingType] = useState<"all" | "rent" | "sale">("all");
  const [city, setCity] = useState<string>("all");
  const [q, setQ] = useState<string>("");

  // Derived results
  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    return items.filter((i) => {
      const ltOk = listingType === "all" ? true : i.listingType === listingType;
      const cityOk = city === "all" ? true : i.city === city;
      const textOk =
        text === "" ||
        [i.title, i.city, i.neighborhood].filter(Boolean).some((s) => s!.toLowerCase().includes(text));
      return ltOk && cityOk && textOk;
    });
  }, [items, listingType, city, q]);

  // Selection state
  const [selectedId, setSelectedId] = useState<string | null>(null);
  useEffect(() => {
    if (selectedId && !filtered.find((f) => f.id === selectedId)) {
      setSelectedId(null);
    }
  }, [filtered, selectedId]);

  // Map refs
  const mapElRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(
    null
  );
  const LRef = useRef<typeof L | null>(null);
  const [tileError, setTileError] = useState<string | null>(null);

  // Initialize Leaflet map (run once on mount)
  useEffect(() => {
    let destroyed = false;
    async function init() {
      const L = (await import("leaflet")).default;
      LRef.current = L;

      if (!mapElRef.current || destroyed) return;

      // Safety: if a map instance exists, remove it
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      const initialCenter: [number, number] =
        items.length ? [items[0].lat, items[0].lng] : DEFAULT_CENTER;

      const map = L.map(mapElRef.current, {
        center: initialCenter,
        zoom: 12,
        zoomControl: true,
      });
      mapRef.current = map;

      const tileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OSM</a> contributors',
        maxZoom: 19,
      });
      tileLayer
        .on("tileerror", () => setTileError("Failed to load map tiles (network or provider blocked)."))
        .on("tileload", () => setTileError(null))
        .addTo(map);

      // Ensure map sizes correctly
      const onResize = () => map.invalidateSize();
      window.addEventListener("resize", onResize);
      // After first paint
      setTimeout(() => map.invalidateSize(), 50);

      return () => {
        window.removeEventListener("resize", onResize);
        map.remove();
        mapRef.current = null;
      };
    }
    init();

    return () => {
      destroyed = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  // Update markers when filtered results or selection change
  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!L || !map) return;

    // Clear old markers layer
    if (markersGroupRef.current) {
      markersGroupRef.current.removeFrom(map);
      markersGroupRef.current = null;
    }

    const group = L.featureGroup();
    filtered.forEach((p: MapItem) => {
      const selected = selectedId === p.id;
      const color = selected ? "#16a34a" : colorByType(p.listingType);
      const marker = L.circleMarker([p.lat, p.lng], {
        radius: selected ? 12 : 9,
        color,
        fillColor: color,
        fillOpacity: 0.95,
        weight: 2,
      });

      const html = `
        <div style="font-size:12px; line-height:1.2">
          <div style="font-weight:600; margin-bottom:2px;">${p.title}</div>
          <div style="color:#6b7280">${p.neighborhood ? `${p.neighborhood}, ` : ""}${p.city}</div>
          <div style="margin-top:4px;">
            ${p.currency ?? "USD"} ${p.price.toLocaleString()}${p.listingType === "rent" ? "/mo" : ""}
          </div>
          <a href="/property/${p.id}" style="color:#2563eb; text-decoration:underline; font-size:11px; display:inline-block; margin-top:4px;">View details</a>
        </div>
      `;
      marker.bindPopup(html, { closeButton: true });
      marker.on("click", () => setSelectedId(p.id));
      group.addLayer(marker);
    });

    group.addTo(map);
    markersGroupRef.current = group;

    // Fit bounds to filtered items
    const b = computeBounds(filtered);
    if (b) {
      map.fitBounds(b, { padding: [40, 40], animate: false });
    } else {
      map.setView(DEFAULT_CENTER, 12);
    }

    // Ensure size updates after layout
    setTimeout(() => map.invalidateSize(), 50);
  }, [filtered, selectedId]);

  // Controls: reset + fit
  const fitToMarkers = () => {
    const map = mapRef.current;
    if (!map) return;
    const b = computeBounds(filtered);
    if (b) map.fitBounds(b, { padding: [40, 40], animate: true });
  };

  return (
    <div className="grid gap-4 md:grid-cols-12">
      {/* Sidebar */}
      <aside className="md:block md:col-span-7 lg:col-span-7">
        <div className="rounded-xl border bg-background p-4 flex flex-col">
          <div className="space-y-3">
            <div className="text-lg font-semibold">Map Search</div>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title, city, neighborhood…" />
              <Button type="submit">Go</Button>
            </form>

            <div>
              <div className="mb-2 text-sm font-medium">Listing type</div>
              <ToggleGroup
                type="single"
                value={listingType}
                onValueChange={(v: string) => setListingType((v as "all" | "rent" | "sale") || "all")}
                className="rounded-md bg-muted p-1"
              >
                <ToggleGroupItem value="all" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">All</ToggleGroupItem>
                <ToggleGroupItem value="rent" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">Rent</ToggleGroupItem>
                <ToggleGroupItem value="sale" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">Buy</ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div>
              <div className="mb-2 text-sm font-medium">City</div>
              <Select value={city} onValueChange={(v) => setCity(v)}>
                <SelectTrigger><SelectValue placeholder="All cities" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {cities.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">{filtered.length} results</div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={fitToMarkers}>Fit</Button>
                <Button variant="link" className="px-0" onClick={() => { setQ(""); setCity("all"); setListingType("all"); }}>
                  Reset
                </Button>
              </div>
            </div>
          </div>

          {/* Results list */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 pr-1">
            {filtered.length === 0 ? (
              <div className="col-span-full rounded-lg border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
                No results. Try adjusting filters.
              </div>
            ) : (
              filtered.map((p) => (
                <div
                  key={p.id}
                  className={`rounded-xl border transition-shadow ${selectedId === p.id ? "ring-2 ring-primary" : ""}`}
                  onClick={() => setSelectedId(p.id)}
                >
                  <PropertyCard property={p} />
                </div>
              ))
            )}
          </div>
        </div>
      </aside>

      {/* Map */}
      <section className="md:col-span-5 lg:col-span-5">
        {/* EXPLICIT HEIGHT and absolute-fill child */}
        <div className="relative overflow-hidden rounded-xl border h-[70vh] md:h-[78vh]">
          <div ref={mapElRef} className="absolute inset-0" />
          {/* Legend overlay */}
          <div className="pointer-events-none absolute right-3 top-3 z-[1000] rounded-md bg-white/90 p-2 text-xs shadow">
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-[#2563eb]" /> Rent
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-[#dc2626]" /> Buy
            </div>
          </div>
          {tileError && (
            <div className="pointer-events-none absolute inset-x-0 bottom-2 mx-auto w-max rounded bg-red-600/90 px-3 py-1 text-xs text-white shadow">
              {tileError}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
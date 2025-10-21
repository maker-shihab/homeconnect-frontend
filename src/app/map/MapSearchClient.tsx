"use client";

import PropertyCard, { Property } from "@/components/cards/PropertyCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Filter, Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";

type MapItem = Property & { lat: number; lng: number };

const colorByType = (t: "rent" | "sale") => (t === "rent" ? "#2563eb" : "#dc2626");
const DEFAULT_CENTER: [number, number] = [23.8103, 90.4125];

function computeBounds(points: { lat: number; lng: number }[]) {
  if (!points.length) return null;
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  const southWest: [number, number] = [Math.min(...lats), Math.min(...lngs)];
  const northEast: [number, number] = [Math.max(...lats), Math.max(...lngs)];
  return [southWest, northEast] as [[number, number], [number, number]];
}

// Safe map invalidation function
const safeInvalidateSize = (map: L.Map | null) => {
  if (map && !map._leaflet_pos) {
    try {
      map.invalidateSize();
    } catch (error) {
      console.warn("Map invalidateSize failed:", error);
    }
  }
};

export default function MapSearchClient({ items }: { items: MapItem[] }) {
  // All available filters
  const cities = useMemo(() => Array.from(new Set(items.map((i) => i.city))).sort(), [items]);
  const neighborhoods = useMemo(() =>
    Array.from(new Set(items.map((i) => i.neighborhood).filter(Boolean))).sort() as string[],
    [items]
  );
  const propertyTypes = useMemo(() =>
    Array.from(new Set(items.map((i) => i.propertyType).filter(Boolean))).sort() as string[],
    [items]
  );

  // Filter states
  const [listingType, setListingType] = useState<"all" | "rent" | "sale">("all");
  const [city, setCity] = useState<string>("all");
  const [neighborhood, setNeighborhood] = useState<string>("all");
  const [propertyType, setPropertyType] = useState<string>("all");
  const [bedsMin, setBedsMin] = useState<number>(0);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(Math.max(...items.map(p => p.price)));
  const [searchInput, setSearchInput] = useState<string>("");
  const [isMapReady, setIsMapReady] = useState(false);

  // Debounced search
  const debouncedSearch = useDebounce(searchInput, 300);

  // Price bounds
  const { minPrice: absoluteMinPrice, maxPrice: absoluteMaxPrice, currency } = useMemo(() => {
    if (!items.length) return { minPrice: 0, maxPrice: 0, currency: "USD" };
    const prices = items.map((i) => i.price);
    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      currency: items[0]?.currency ?? "USD",
    };
  }, [items]);

  // Initialize price range
  useEffect(() => {
    setMinPrice(absoluteMinPrice);
    setMaxPrice(absoluteMaxPrice);
  }, [absoluteMinPrice, absoluteMaxPrice]);

  // Derived results with complete filtering
  const filtered = useMemo(() => {
    const text = debouncedSearch.trim().toLowerCase();

    return items.filter((item) => {
      // Listing type filter
      if (listingType !== "all" && item.listingType !== listingType) return false;

      // City filter
      if (city !== "all" && item.city !== city) return false;

      // Neighborhood filter
      if (neighborhood !== "all" && item.neighborhood !== neighborhood) return false;

      // Property type filter
      if (propertyType !== "all" && item.propertyType !== propertyType) return false;

      // Beds filter
      if (bedsMin > 0 && item.beds < bedsMin) return false;

      // Price filter
      if (item.price < minPrice || item.price > maxPrice) return false;

      // Search filter
      if (text) {
        const searchableFields = [
          item.title,
          item.city,
          item.neighborhood,
          item.propertyType,
          item.description
        ].filter(Boolean);

        if (!searchableFields.some(field => field!.toLowerCase().includes(text))) {
          return false;
        }
      }

      return true;
    });
  }, [items, listingType, city, neighborhood, propertyType, bedsMin, minPrice, maxPrice, debouncedSearch]);

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
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const LRef = useRef<typeof L | null>(null);
  const [tileError, setTileError] = useState<string | null>(null);

  // Safe map operations
  const safeMapOperation = useCallback((operation: (map: L.Map) => void) => {
    if (mapRef.current && mapRef.current._leaflet_pos) {
      try {
        operation(mapRef.current);
      } catch (error) {
        console.warn("Map operation failed:", error);
      }
    }
  }, []);

  // Initialize Leaflet map - FIXED VERSION
  useEffect(() => {
    let destroyed = false;
    let resizeTimer: NodeJS.Timeout;

    async function init() {
      const L = (await import("leaflet")).default;
      LRef.current = L;

      if (!mapElRef.current || destroyed) return;

      // Clean existing map
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      const initialCenter: [number, number] =
        items.length ? [items[0].lat, items[0].lng] : DEFAULT_CENTER;

      // Create map with proper options
      const map = L.map(mapElRef.current, {
        center: initialCenter,
        zoom: 12,
        zoomControl: true,
        // Prevent premature initialization
        preferCanvas: true,
        fadeAnimation: false,
        markerZoomAnimation: false
      });

      mapRef.current = map;

      // Add tiles with error handling
      const tileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OSM</a> contributors',
        maxZoom: 19,
        errorTileUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
      });

      tileLayer
        .on("tileerror", () => setTileError("Failed to load map tiles"))
        .on("tileload", () => setTileError(null))
        .addTo(map);

      // Safe resize handler
      const onResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          safeInvalidateSize(map);
        }, 100);
      };

      window.addEventListener("resize", onResize);

      // Wait for map to be fully initialized
      setTimeout(() => {
        if (!destroyed) {
          safeInvalidateSize(map);
          setIsMapReady(true);
        }
      }, 100);

      return () => {
        window.removeEventListener("resize", onResize);
        clearTimeout(resizeTimer);
        if (map && !destroyed) {
          map.remove();
        }
      };
    }

    init();

    return () => {
      destroyed = true;
      setIsMapReady(false);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [items]);

  // Update markers when filtered results or selection change - FIXED
  useEffect(() => {
    if (!isMapReady) return;

    const L = LRef.current;
    const map = mapRef.current;
    if (!L || !map) return;

    // Clear old markers safely
    if (markersGroupRef.current) {
      try {
        markersGroupRef.current.removeFrom(map);
      } catch (error) {
        console.warn("Error removing markers:", error);
      }
      markersGroupRef.current = null;
    }

    const group = L.featureGroup();

    filtered.forEach((p: MapItem) => {
      const selected = selectedId === p.id;
      const color = selected ? "#16a34a" : colorByType(p.listingType);

      try {
        const marker = L.circleMarker([p.lat, p.lng], {
          radius: selected ? 14 : 10,
          color,
          fillColor: color,
          fillOpacity: 0.95,
          weight: selected ? 3 : 2,
        });

        const html = `
          <div style="font-size:12px; line-height:1.2; max-width:250px">
            <div style="font-weight:600; margin-bottom:2px;">${p.title}</div>
            <div style="color:#6b7280">${p.neighborhood ? `${p.neighborhood}, ` : ""}${p.city}</div>
            <div style="margin-top:4px; font-weight:500">
              ${p.currency ?? "USD"} ${p.price.toLocaleString()}${p.listingType === "rent" ? "/mo" : ""}
            </div>
            <div style="margin-top:2px; font-size:11px; color:#6b7280">
              ${p.beds} bed • ${p.baths} bath • ${p.areaSize.toLocaleString()} ${p.areaUnit ?? "sqft"}
            </div>
            <a href="/property/${p.id}" style="color:#2563eb; text-decoration:underline; font-size:11px; display:inline-block; margin-top:4px;">View details</a>
          </div>
        `;

        marker.bindPopup(html, { closeButton: true });
        marker.on("click", () => setSelectedId(p.id));
        group.addLayer(marker);
      } catch (error) {
        console.warn("Error creating marker:", error);
      }
    });

    try {
      group.addTo(map);
      markersGroupRef.current = group;

      // Fit bounds safely
      const b = computeBounds(filtered);
      if (b && b[0] && b[1]) {
        setTimeout(() => {
          safeMapOperation(map => {
            map.fitBounds(b, { padding: [40, 40], animate: false });
          });
        }, 50);
      } else {
        safeMapOperation(map => {
          map.setView(DEFAULT_CENTER, 12);
        });
      }

      // Safe size invalidation
      setTimeout(() => {
        safeInvalidateSize(map);
      }, 100);
    } catch (error) {
      console.warn("Error updating map:", error);
    }
  }, [filtered, selectedId, isMapReady, safeMapOperation]);

  // Controls
  const fitToMarkers = () => {
    safeMapOperation((map) => {
      const b = computeBounds(filtered);
      if (b && b[0] && b[1]) {
        map.fitBounds(b, { padding: [40, 40], animate: true });
      }
    });
  };

  const resetAllFilters = useCallback(() => {
    setListingType("all");
    setCity("all");
    setNeighborhood("all");
    setPropertyType("all");
    setBedsMin(0);
    setMinPrice(absoluteMinPrice);
    setMaxPrice(absoluteMaxPrice);
    setSearchInput("");
  }, [absoluteMinPrice, absoluteMaxPrice]);

  // Active filters for chips
  const activeFilters = useMemo(() => {
    const filters = [];

    if (listingType !== "all") filters.push({ key: "type", label: listingType === "rent" ? "Rent" : "Buy", onClear: () => setListingType("all") });
    if (city !== "all") filters.push({ key: "city", label: city, onClear: () => setCity("all") });
    if (neighborhood !== "all") filters.push({ key: "neighborhood", label: neighborhood, onClear: () => setNeighborhood("all") });
    if (propertyType !== "all") filters.push({ key: "propertyType", label: propertyType, onClear: () => setPropertyType("all") });
    if (bedsMin > 0) filters.push({ key: "beds", label: `${bedsMin}+ beds`, onClear: () => setBedsMin(0) });
    if (minPrice !== absoluteMinPrice || maxPrice !== absoluteMaxPrice) {
      filters.push({
        key: "price",
        label: `${currency} ${minPrice.toLocaleString()} - ${currency} ${maxPrice.toLocaleString()}`,
        onClear: () => {
          setMinPrice(absoluteMinPrice);
          setMaxPrice(absoluteMaxPrice);
        }
      });
    }
    if (debouncedSearch) filters.push({ key: "search", label: `"${debouncedSearch}"`, onClear: () => setSearchInput("") });

    return filters;
  }, [listingType, city, neighborhood, propertyType, bedsMin, minPrice, maxPrice, debouncedSearch, currency, absoluteMinPrice, absoluteMaxPrice]);

  const formatPrice = (n: number) => `${currency} ${n.toLocaleString()}`;

  return (
    <div className="grid gap-6 md:grid-cols-12 mt-20">
      {/* Map */}
      <section className="md:col-span-7 lg:col-span-8">
        <div className="overflow-hidden rounded-xl border h-[70vh] md:h-[80vh] sticky top-20">
          <div
            ref={mapElRef}
            className="absolute inset-0 z-10"
            style={{ visibility: isMapReady ? 'visible' : 'hidden' }}
          />

          {/* Loading overlay */}
          {!isMapReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-20">
              <div className="text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-2"></div>
                <div className="text-sm text-muted-foreground">Loading map...</div>
              </div>
            </div>
          )}

          {/* Legend overlay */}
          {isMapReady && (
            <div className="pointer-events-none absolute right-3 top-3 z-20 rounded-md bg-white/90 p-3 text-xs shadow space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-[#2563eb]" /> Rent
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-[#dc2626]" /> Buy
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-[#16a34a]" /> Selected
              </div>
            </div>
          )}

          {tileError && isMapReady && (
            <div className="pointer-events-none absolute inset-x-0 bottom-2 mx-auto w-max rounded bg-red-600/90 px-3 py-1 text-xs text-white shadow">
              {tileError}
            </div>
          )}
        </div>
      </section>

      {/* Sidebar */}
      <aside className="md:col-span-5 lg:col-span-4">
        <div className="rounded-xl border bg-background p-6 space-y-6 sticky top-20 max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold mb-2">Map Search</h1>
            <div className="text-sm text-muted-foreground">
              {filtered.length} property{filtered.length !== 1 ? 'ies' : ''} found
            </div>
          </div>

          {/* Search */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search properties..."
                className="pl-10"
              />
            </div>

            {/* Quick Filters */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="mb-2 text-sm font-medium">Type</div>
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
                <div className="mb-2 text-sm font-medium">Beds</div>
                <Select value={String(bedsMin)} onValueChange={(v) => setBedsMin(Number(v))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location Filters */}
            <div className="space-y-3">
              <div>
                <div className="mb-2 text-sm font-medium">City</div>
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="All cities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {cities.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {neighborhoods.length > 0 && (
                <div>
                  <div className="mb-2 text-sm font-medium">Neighborhood</div>
                  <Select value={neighborhood} onValueChange={setNeighborhood}>
                    <SelectTrigger>
                      <SelectValue placeholder="All areas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Areas</SelectItem>
                      {neighborhoods.map((n) => (
                        <SelectItem key={n} value={n}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {propertyTypes.length > 0 && (
                <div>
                  <div className="mb-2 text-sm font-medium">Property Type</div>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {propertyTypes.map((pt) => (
                        <SelectItem key={pt} value={pt}>{pt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Price Range */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-medium">Price Range</div>
                <div className="text-xs text-muted-foreground">
                  {formatPrice(minPrice)} — {formatPrice(maxPrice)}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    placeholder="Min"
                    className="text-sm"
                  />
                  <Input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    placeholder="Max"
                    className="text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">Active Filters</div>
                  <Button variant="link" className="text-xs h-auto p-0" onClick={resetAllFilters}>
                    Clear All
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeFilters.map((filter) => (
                    <Badge key={filter.key} variant="secondary" className="pl-2 pr-1 py-1">
                      {filter.label}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-3 w-3 ml-1 hover:bg-transparent"
                        onClick={filter.onClear}
                      >
                        <X className="h-2 w-2" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button onClick={fitToMarkers} variant="outline" className="flex-1">
                Fit to Markers
              </Button>
              <Button onClick={resetAllFilters} variant="outline" className="flex-1">
                Reset All
              </Button>
            </div>
          </div>

          {/* Results List */}
          <div className="border-t pt-4">
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {filtered.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <div>No properties found</div>
                  <div className="text-sm">Try adjusting your filters</div>
                </div>
              ) : (
                filtered.map((property) => (
                  <div
                    key={property.id}
                    className={`rounded-lg border p-3 cursor-pointer transition-all ${selectedId === property.id
                      ? "ring-2 ring-primary border-primary bg-primary/5"
                      : "hover:border-primary/50"
                      }`}
                    onClick={() => setSelectedId(property.id)}
                  >
                    <PropertyCard property={property} compact />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
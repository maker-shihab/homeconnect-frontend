"use client";

import PropertyCard, { Property } from "@/components/cards/PropertyCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Link from "next/link";
import { useMemo, useState } from "react";

type PropertyWithMeta = Property & { createdAt?: string | number | Date };

type SortKey = "newest" | "price-asc" | "price-desc";
type ListingFilter = "all" | "rent" | "sale";

interface NewListingsGridProps {
  title?: string;
  items: PropertyWithMeta[];
  viewAllHref: string;
  initialType?: ListingFilter;
}

export default function NewListingsGrid({
  title = "New Listings",
  items,
  viewAllHref,
  initialType = "all",
}: NewListingsGridProps) {
  const currency = items[0]?.currency ?? "USD";

  // Price bounds
  const [minPrice, maxPrice] = useMemo(() => {
    if (!items.length) return [0, 0];
    const prices = items.map((i) => i.price);
    return [Math.min(...prices), Math.max(...prices)];
  }, [items]);

  const [listingType, setListingType] = useState<ListingFilter>(initialType);
  const [bedsMin, setBedsMin] = useState<number>(0);
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
  const [sortBy, setSortBy] = useState<SortKey>("newest");

  // Dynamic slider step
  const step = useMemo(() => {
    const span = Math.max(1, maxPrice - minPrice);
    const rough = Math.round(span / 50); // ~50 steps
    return Math.max(1, rough);
  }, [minPrice, maxPrice]);

  const filtered = useMemo(() => {
    const inType = (t: ListingFilter, p: Property) =>
      t === "all" ? true : p.listingType === t;

    const inBeds = (min: number, p: Property) => p.beds >= min;

    const inPrice = ([min, max]: [number, number], p: Property) =>
      p.price >= min && p.price <= max;

    const getCreatedAt = (p: PropertyWithMeta) => {
      const v = p.createdAt;
      if (!v) return 0;
      if (v instanceof Date) return v.getTime();
      if (typeof v === "string") return new Date(v).getTime();
      return v;
    };

    let r = items
      .filter((p) => inType(listingType, p))
      .filter((p) => inBeds(bedsMin, p))
      .filter((p) => inPrice(priceRange, p as Property));

    switch (sortBy) {
      case "newest":
        r = r.sort((a, b) => getCreatedAt(b) - getCreatedAt(a));
        break;
      case "price-asc":
        r = r.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        r = r.sort((a, b) => b.price - a.price);
        break;
    }
    return r;
  }, [items, listingType, bedsMin, priceRange, sortBy]);

  const resetFilters = () => {
    setListingType("all");
    setBedsMin(0);
    setPriceRange([minPrice, maxPrice]);
    setSortBy("newest");
  };

  const formatPrice = (n: number) =>
    `${currency} ${n.toLocaleString()}`;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-2xl font-bold">{title}</h3>
            <p className="text-sm text-muted-foreground">{filtered.length} results</p>
          </div>
          <Button asChild variant="ghost" className="px-2 h-8">
            <Link href={viewAllHref}>View all</Link>
          </Button>
        </div>

        {/* Controls */}
        <div className="mb-6 grid gap-3 rounded-xl border bg-background p-4 md:grid-cols-12">
          {/* Type */}
          <div className="md:col-span-4">
            <label className="mb-2 block text-sm font-medium">Type</label>
            <ToggleGroup
              type="single"
              value={listingType}
              onValueChange={(v) => v && setListingType(v as ListingFilter)}
              className="rounded-md bg-muted p-1"
            >
              <ToggleGroupItem value="all" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">All</ToggleGroupItem>
              <ToggleGroupItem value="rent" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">Rent</ToggleGroupItem>
              <ToggleGroupItem value="sale" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">Buy</ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Beds */}
          <div className="md:col-span-4">
            <label className="mb-2 block text-sm font-medium">Beds (min)</label>
            <ToggleGroup
              type="single"
              value={String(bedsMin)}
              onValueChange={(v) => v && setBedsMin(Number(v))}
              className="rounded-md bg-muted p-1"
            >
              <ToggleGroupItem value="0" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">Any</ToggleGroupItem>
              <ToggleGroupItem value="1" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">1+</ToggleGroupItem>
              <ToggleGroupItem value="2" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">2+</ToggleGroupItem>
              <ToggleGroupItem value="3" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">3+</ToggleGroupItem>
              <ToggleGroupItem value="4" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">4+</ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Sort */}
          <div className="md:col-span-4">
            <label className="mb-2 block text-sm font-medium">Sort by</label>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortKey)}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-asc">Price: Low → High</SelectItem>
                <SelectItem value="price-desc">Price: High → Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price range (full width) */}
          <div className="md:col-span-12">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium">Price range</label>
              <div className="text-xs text-muted-foreground">
                {formatPrice(priceRange[0])} — {formatPrice(priceRange[1])}
              </div>
            </div>
            <div className="mt-3 px-1">
              <Slider
                min={minPrice}
                max={maxPrice}
                step={step}
                value={priceRange}
                onValueChange={(v) => setPriceRange([v[0]!, v[1]!] as [number, number])}
                className="w-full"
              />
            </div>
          </div>

          {/* Reset */}
          <div className="md:col-span-12 flex justify-end">
            <Button type="button" variant="outline" onClick={resetFilters} size="sm">
              Reset filters
            </Button>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="rounded-xl border bg-background p-8 text-center text-muted-foreground">
            No listings match these filters.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
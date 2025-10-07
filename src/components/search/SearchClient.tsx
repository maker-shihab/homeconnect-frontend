"use client";

import { PropertyIndex } from "@/app/(main)/search/page";
import PropertyCard, { Property } from "@/components/cards/PropertyCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Filter, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

type SortKey = "newest" | "price-asc" | "price-desc";

export default function SearchClient({ items }: { items: PropertyIndex[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  // Canonical cities and property types from data
  const cities = useMemo(() => Array.from(new Set(items.map((i) => i.city))).sort(), [items]);
  const propertyTypes = useMemo(
    () => Array.from(new Set(items.map((i) => i.propertyType).filter(Boolean))) as string[],
    [items]
  );

  // Price bounds
  const { minPrice, maxPrice, currency } = useMemo(() => {
    if (!items.length) return { minPrice: 0, maxPrice: 0, currency: "USD" };
    const prices = items.map((i) => i.price);
    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      currency: items[0]?.currency ?? "USD",
    };
  }, [items]);

  // Helpers to read params
  const get = (k: string) => sp.get(k);
  const getAll = (k: string) => sp.getAll(k);

  // Interpret listing type from params:
  // - lt=rent|sale is canonical
  // - type=rent|buy also supported (buy -> sale)
  // - type=apartment/house acts as property type (see below)
  const rawLt = get("lt") ?? get("type");
  const listingType: "rent" | "sale" | "all" =
    rawLt === "rent" ? "rent" : rawLt === "sale" || rawLt === "buy" ? "sale" : "all";

  const q = get("q")?.trim() ?? "";
  const city = get("city") ?? "all";

  const bedsMin = Number(get("beds") ?? "0");
  const sortBy = (get("sort") as SortKey) ?? "newest";

  const urlMin = Number(get("min") ?? `${minPrice}`);
  const urlMax = Number(get("max") ?? `${maxPrice}`);
  const [localPrice, setLocalPrice] = useState<[number, number]>([urlMin, urlMax]);

  // Property type(s): pt=Apartment&pt=House or type=apartment (back-compat)
  const ptFromParams = getAll("pt");
  const maybeTypeAsPt = get("type");
  const normalizedPt = useMemo(() => {
    if (ptFromParams.length) {
      return ptFromParams;
    }
    if (propertyTypes.includes(capitalize(maybeTypeAsPt ?? ""))) {
      return [capitalize(maybeTypeAsPt!)];
    }
    return [];
  }, [ptFromParams, propertyTypes, maybeTypeAsPt]);
  const selectedPT = useMemo(() => new Set(normalizedPt), [normalizedPt]);

  // Pagination
  const page = Math.max(1, Number(get("page") ?? "1"));
  const pageSize = Math.max(1, Number(get("pageSize") ?? "12"));

  // Update URL helpers
  const pushParams = (next: URLSearchParams) => {
    router.push(`${pathname}?${next.toString()}`, { scroll: true });
  };

  const setParam = (k: string, v?: string) => {
    const next = new URLSearchParams(sp);
    if (v === undefined || v === "" || v === "all") {
      next.delete(k);
    } else {
      next.set(k, v);
    }
    // Reset page on filter change
    next.delete("page");
    pushParams(next);
  };

  const setMulti = (k: string, values: string[]) => {
    const next = new URLSearchParams(sp);
    next.delete(k);
    values.forEach((v) => next.append(k, v));
    next.delete("page");
    pushParams(next);
  };

  const clearAll = () => {
    router.push(pathname, { scroll: true });
  };

  // Filtering
  const filtered = useMemo(() => {
    const ltMatch = (i: Property) =>
      listingType === "all" ? true : i.listingType === listingType;

    const cityMatch = (i: PropertyIndex) =>
      city === "all" ? true : i.city === city;

    const bedsMatch = (i: Property) => i.beds >= bedsMin;

    const priceMatch = (i: Property) =>
      i.price >= localPrice[0] && i.price <= localPrice[1];

    const ptMatch = (i: PropertyIndex) =>
      selectedPT.size === 0 ? true : (i.propertyType && selectedPT.has(i.propertyType));

    const text = q.toLowerCase();
    const qMatch = (i: PropertyIndex) =>
      text === ""
        ? true
        : [i.title, i.city, i.neighborhood, i.propertyType]
          .filter(Boolean)
          .some((s) => s!.toLowerCase().includes(text));

    let r = items.filter((i) => ltMatch(i) && cityMatch(i) && bedsMatch(i) && priceMatch(i) && ptMatch(i) && qMatch(i));

    switch (sortBy) {
      case "newest":
        r = r.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "price-asc":
        r = r.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        r = r.sort((a, b) => b.price - a.price);
        break;
    }
    return r;
  }, [items, listingType, city, bedsMin, localPrice, selectedPT, q, sortBy]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  const formatPrice = (n: number) => `${currency} ${n.toLocaleString()}`;

  // UI: Filter content (reused in desktop aside and mobile sheet)
  const FiltersUI = (
    <div className="space-y-4">
      {/* Listing type */}
      <div>
        <div className="mb-2 text-sm font-medium">Listing type</div>
        <ToggleGroup
          type="single"
          value={listingType}
          onValueChange={(v) => setParam("lt", v || undefined)}
          className="rounded-md bg-muted p-1"
        >
          <ToggleGroupItem value="all" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">All</ToggleGroupItem>
          <ToggleGroupItem value="rent" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">Rent</ToggleGroupItem>
          <ToggleGroupItem value="sale" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">Buy</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* City */}
      <div>
        <div className="mb-2 text-sm font-medium">City</div>
        <Select value={city} onValueChange={(v) => setParam("city", v)}>
          <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {cities.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Beds */}
      <div>
        <div className="mb-2 text-sm font-medium">Beds (min)</div>
        <ToggleGroup
          type="single"
          value={String(bedsMin)}
          onValueChange={(v) => setParam("beds", v || undefined)}
          className="rounded-md bg-muted p-1"
        >
          <ToggleGroupItem value="0" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">Any</ToggleGroupItem>
          <ToggleGroupItem value="1" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">1+</ToggleGroupItem>
          <ToggleGroupItem value="2" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">2+</ToggleGroupItem>
          <ToggleGroupItem value="3" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">3+</ToggleGroupItem>
          <ToggleGroupItem value="4" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">4+</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Price range */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <div className="text-sm font-medium">Price range</div>
          <div className="text-xs text-muted-foreground">
            {formatPrice(localPrice[0])} — {formatPrice(localPrice[1])}
          </div>
        </div>
        <div className="mt-3 px-1">
          <Slider
            min={minPrice}
            max={maxPrice}
            step={Math.max(1, Math.round((maxPrice - minPrice) / 50))}
            value={localPrice}
            onValueChange={(v) => setLocalPrice([v[0]!, v[1]!] as [number, number])}
            onValueCommit={(v) => {
              setParam("min", String(v[0]));
              // setParam resets page; ensure max set in same URL change:
              const next = new URLSearchParams(sp);
              next.set("min", String(v[0]));
              next.set("max", String(v[1]));
              next.delete("page");
              pushParams(next);
            }}
          />
        </div>
      </div>

      {/* Property type */}
      <div>
        <div className="mb-2 text-sm font-medium">Property type</div>
        <div className="space-y-2">
          {propertyTypes.map((pt) => {
            const checked = selectedPT.has(pt);
            return (
              <label key={pt} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={checked}
                  onCheckedChange={(v) => {
                    const arr = new Set(selectedPT);
                    if (v) arr.add(pt);
                    else arr.delete(pt);
                    setMulti("pt", Array.from(arr));
                  }}
                />
                <span>{pt}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="pt-2">
        <Button variant="outline" size="sm" onClick={clearAll}>Reset all</Button>
      </div>
    </div>
  );

  // Active filter chips
  const chips: { key: string; label: string; onClear: () => void }[] = [];
  if (q) chips.push({ key: "q", label: `“${q}”`, onClear: () => setParam("q") });
  if (listingType !== "all") chips.push({ key: "lt", label: listingType === "rent" ? "Rent" : "Buy", onClear: () => setParam("lt") });
  if (city !== "all") chips.push({ key: "city", label: city, onClear: () => setParam("city") });
  if (bedsMin > 0) chips.push({ key: "beds", label: `${bedsMin}+ beds`, onClear: () => setParam("beds") });
  if (localPrice[0] !== minPrice || localPrice[1] !== maxPrice)
    chips.push({
      key: "price",
      label: `${formatPrice(localPrice[0])} — ${formatPrice(localPrice[1])}`,
      onClear: () => {
        setLocalPrice([minPrice, maxPrice]);
        const next = new URLSearchParams(sp);
        next.delete("min");
        next.delete("max");
        next.delete("page");
        pushParams(next);
      },
    });
  if (selectedPT.size > 0)
    chips.push({
      key: "pt",
      label: Array.from(selectedPT).join(", "),
      onClear: () => setMulti("pt", []),
    });

  // Search bar submit handler
  const onSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const term = (data.get("q") as string)?.trim() ?? "";
    setParam("q", term || undefined);
  };

  return (
    <div className="grid gap-6 md:grid-cols-12">
      {/* Sidebar (desktop) */}
      <aside className="md:col-span-3 lg:col-span-3 hidden md:block">
        <div className="rounded-xl border bg-background p-4 sticky top-4">
          <div className="mb-3 text-lg font-semibold">Filters</div>
          {FiltersUI}
        </div>
      </aside>

      {/* Main */}
      <section className="md:col-span-9 lg:col-span-9">
        {/* Top controls */}
        <div className="rounded-xl border bg-background p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* Search input */}
            <form onSubmit={onSearchSubmit} className="flex w-full gap-2 md:max-w-md">
              <Input name="q" defaultValue={q} placeholder="City, neighborhood, or keywords" />
              <Button type="submit">Search</Button>
            </form>

            {/* Right controls: sort + mobile filters */}
            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={(v) => setParam("sort", v)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-asc">Price: Low → High</SelectItem>
                  <SelectItem value="price-desc">Price: High → Low</SelectItem>
                </SelectContent>
              </Select>

              {/* Mobile filters */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[90vw] sm:w-[420px]">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">{FiltersUI}</div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Active chips */}
          {chips.length > 0 && (
            <>
              <Separator className="my-4" />
              <div className="flex flex-wrap items-center gap-2">
                {chips.map((c) => (
                  <Badge key={c.key} variant="secondary" className="pr-0">
                    <span className="mr-1">{c.label}</span>
                    <Button variant="ghost" size="icon" className="h-5 w-5 hover:bg-transparent" onClick={c.onClear} aria-label={`Clear ${c.key}`}>
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
                <Button variant="link" className="text-sm" onClick={clearAll}>
                  Clear all
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Results summary */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {total} result{total !== 1 ? "s" : ""}{q ? ` for “${q}”` : ""}{city !== "all" ? ` in ${city}` : ""}
          </div>
          <div className="text-xs text-muted-foreground">Page {safePage} of {totalPages}</div>
        </div>

        {/* Grid */}
        {total === 0 ? (
          <div className="mt-4 rounded-xl border bg-background p-10 text-center text-muted-foreground">
            No listings match your filters.
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pageItems.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              disabled={safePage <= 1}
              onClick={() => setParam("page", String(safePage - 1))}
            >
              Previous
            </Button>
            <div className="text-sm">
              {start + 1}–{Math.min(start + pageSize, total)} of {total}
            </div>
            <Button
              variant="outline"
              disabled={safePage >= totalPages}
              onClick={() => setParam("page", String(safePage + 1))}
            >
              Next
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}

function capitalize(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
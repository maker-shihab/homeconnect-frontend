"use client";

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
import { useDebounce } from "@/hooks/useDebounce";
import { Filter, Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

type SortKey = "newest" | "price-asc" | "price-desc";
type ListingFilter = "all" | "rent" | "sale";

// Skeleton loader component
function PropertyCardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border bg-background overflow-hidden">
      <div className="aspect-[4/3] bg-muted"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-3 bg-muted rounded w-1/2"></div>
        <div className="h-3 bg-muted rounded w-1/3"></div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 bg-muted rounded w-1/4"></div>
          <div className="h-8 bg-muted rounded w-1/3"></div>
        </div>
      </div>
    </div>
  );
}

export default function SearchClient({ items }: { items: Property[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const [searchInput, setSearchInput] = useState(sp.get("q") || "");
  const [isLoading, setIsLoading] = useState(false);

  // Debounced search for instant results
  const debouncedSearch = useDebounce(searchInput, 300);

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

  // Interpret listing type from params
  const rawLt = get("lt") ?? get("type");
  const listingType: ListingFilter =
    rawLt === "rent" ? "rent" : rawLt === "sale" || rawLt === "buy" ? "sale" : "all";

  const q = get("q")?.trim() ?? "";
  const city = get("city") ?? "all";
  const bedsMin = Number(get("beds") ?? "0");
  const sortBy = (get("sort") as SortKey) ?? "newest";

  const urlMin = Number(get("min") ?? `${minPrice}`);
  const urlMax = Number(get("max") ?? `${maxPrice}`);
  const [localPrice, setLocalPrice] = useState<[number, number]>([urlMin, urlMax]);

  // Property type(s)
  const ptFromParams = getAll("pt");
  const selectedPT = useMemo(() => new Set(ptFromParams), [ptFromParams]);

  // Pagination
  const page = Math.max(1, Number(get("page") ?? "1"));
  const pageSize = Math.max(1, Number(get("pageSize") ?? "12"));

  // SIMPLE URL update - No complex logic
  const updateURL = useCallback((updates: Record<string, string | undefined>) => {
    const next = new URLSearchParams(sp);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === "" || value === "all") {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });

    // Always remove page when filters change
    next.delete("page");

    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  }, [router, pathname, sp]);

  // SIMPLE Clear all function
  const clearAll = useCallback(() => {
    setSearchInput("");
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  // Sync local price with URL params
  useEffect(() => {
    setLocalPrice([urlMin, urlMax]);
  }, [urlMin, urlMax]);

  // Sync search input with URL
  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  // SIMPLE Instant search effect
  useEffect(() => {
    if (debouncedSearch !== q) {
      setIsLoading(true);

      const timer = setTimeout(() => {
        updateURL({ q: debouncedSearch.trim() || undefined });
        setIsLoading(false);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [debouncedSearch, q, updateURL]);

  // SIMPLE Filtering logic - No complex conditions
  const filtered = useMemo(() => {
    if (!items.length) return [];

    let result = [...items];

    // Apply filters one by one - SIMPLE LOGIC
    if (listingType !== "all") {
      result = result.filter(i => i.listingType === listingType);
    }

    if (city !== "all") {
      result = result.filter(i => i.city === city);
    }

    if (bedsMin > 0) {
      result = result.filter(i => i.beds >= bedsMin);
    }

    if (localPrice[0] !== minPrice || localPrice[1] !== maxPrice) {
      result = result.filter(i => i.price >= localPrice[0] && i.price <= localPrice[1]);
    }

    if (selectedPT.size > 0) {
      result = result.filter(i => i.propertyType && selectedPT.has(i.propertyType));
    }

    if (q) {
      const searchLower = q.toLowerCase();
      result = result.filter(i =>
        [i.title, i.city, i.neighborhood, i.propertyType, i.description]
          .filter(Boolean)
          .some(field => field!.toLowerCase().includes(searchLower))
      );
    }

    // Sorting
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return result;
  }, [items, listingType, city, bedsMin, localPrice, selectedPT, q, sortBy, minPrice, maxPrice]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  const formatPrice = (n: number) => `${currency} ${n.toLocaleString()}`;

  // SIMPLE Search submit
  const onSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const term = (data.get("q") as string)?.trim() ?? "";
    updateURL({ q: term || undefined });
  };

  // SIMPLE Filter handlers
  const handleListingTypeChange = (value: string) => {
    updateURL({ lt: value === "all" ? undefined : value });
  };

  const handleCityChange = (value: string) => {
    updateURL({ city: value === "all" ? undefined : value });
  };

  const handleBedsChange = (value: string) => {
    updateURL({ beds: value === "0" ? undefined : value });
  };

  const handlePropertyTypeChange = (pt: string, checked: boolean) => {
    const newPT = new Set(selectedPT);
    if (checked) {
      newPT.add(pt);
    } else {
      newPT.delete(pt);
    }

    if (newPT.size === 0) {
      updateURL({ pt: undefined });
    } else {
      // Remove all existing pt params and add new ones
      const next = new URLSearchParams(sp);
      next.delete("pt");
      Array.from(newPT).forEach(pt => next.append("pt", pt));
      next.delete("page");
      router.push(`${pathname}?${next.toString()}`, { scroll: false });
    }
  };

  const handlePriceChange = (value: number[]) => {
    const next = new URLSearchParams(sp);
    next.set("min", String(value[0]));
    next.set("max", String(value[1]));
    next.delete("page");
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const handleSortChange = (value: string) => {
    updateURL({ sort: value });
  };

  // SIMPLE Chip clear handlers
  const clearSearch = () => {
    setSearchInput("");
    updateURL({ q: undefined });
  };

  const clearListingType = () => {
    updateURL({ lt: undefined });
  };

  const clearCity = () => {
    updateURL({ city: undefined });
  };

  const clearBeds = () => {
    updateURL({ beds: undefined });
  };

  const clearPrice = () => {
    updateURL({ min: undefined, max: undefined });
  };

  const clearPropertyTypes = () => {
    updateURL({ pt: undefined });
  };

  // UI: Filter content
  const FiltersUI = (
    <div className="space-y-6">
      {/* Listing type */}
      <div>
        <div className="mb-3 text-sm font-medium">Listing Type</div>
        <div className="flex gap-1 rounded-md bg-muted p-1">
          {["all", "rent", "sale"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleListingTypeChange(type)}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${listingType === type
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {type === "all" ? "All" : type === "rent" ? "Rent" : "Buy"}
            </button>
          ))}
        </div>
      </div>

      {/* City */}
      <div>
        <div className="mb-3 text-sm font-medium">City</div>
        <Select value={city} onValueChange={handleCityChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select city" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {cities.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Beds */}
      <div>
        <div className="mb-3 text-sm font-medium">Beds (Minimum)</div>
        <div className="flex gap-1 rounded-md bg-muted p-1">
          {[0, 1, 2, 3, 4].map((beds) => (
            <button
              key={beds}
              type="button"
              onClick={() => handleBedsChange(String(beds))}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${bedsMin === beds
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {beds === 0 ? "Any" : `${beds}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-medium">Price Range</div>
          <div className="text-xs text-muted-foreground">
            {formatPrice(localPrice[0])} — {formatPrice(localPrice[1])}
          </div>
        </div>
        <div className="px-1">
          <Slider
            min={minPrice}
            max={maxPrice}
            step={Math.max(1, Math.round((maxPrice - minPrice) / 50))}
            value={localPrice}
            onValueChange={setLocalPrice}
            onValueCommit={handlePriceChange}
          />
        </div>
      </div>

      {/* Property type */}
      {propertyTypes.length > 0 && (
        <div>
          <div className="mb-3 text-sm font-medium">Property Type</div>
          <div className="space-y-3">
            {propertyTypes.map((pt) => (
              <label key={pt} className="flex items-center gap-3 text-sm cursor-pointer">
                <Checkbox
                  checked={selectedPT.has(pt)}
                  onCheckedChange={(checked) => handlePropertyTypeChange(pt, checked as boolean)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <span>{pt}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={clearAll}
          className="w-full"
        >
          Reset All Filters
        </Button>
      </div>
    </div>
  );

  // Active filter chips
  const chips = [
    q && { key: "q", label: `"${q}"`, onClear: clearSearch },
    listingType !== "all" && { key: "lt", label: listingType === "rent" ? "Rent" : "Buy", onClear: clearListingType },
    city !== "all" && { key: "city", label: city, onClear: clearCity },
    bedsMin > 0 && { key: "beds", label: `${bedsMin}+ beds`, onClear: clearBeds },
    (localPrice[0] !== minPrice || localPrice[1] !== maxPrice) && {
      key: "price",
      label: `${formatPrice(localPrice[0])} — ${formatPrice(localPrice[1])}`,
      onClear: clearPrice
    },
    selectedPT.size > 0 && {
      key: "pt",
      label: `Types: ${Array.from(selectedPT).join(", ")}`,
      onClear: clearPropertyTypes
    },
  ].filter(Boolean) as { key: string; label: string; onClear: () => void }[];

  return (
    <div className="grid gap-6 md:grid-cols-12">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:block md:col-span-3">
        <div className="rounded-xl border bg-background p-6 sticky top-24">
          <div className="mb-6 text-xl font-semibold">Filters</div>
          {FiltersUI}
        </div>
      </aside>

      {/* Main */}
      <section className="md:col-span-9">
        {/* Top controls */}
        <div className="rounded-xl border bg-background p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search input */}
            <form onSubmit={onSearchSubmit} className="flex w-full gap-3 md:max-w-md relative">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  name="q"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search city, neighborhood, or keywords..."
                  className="pl-10 pr-4 h-11"
                />
                {isLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  </div>
                )}
              </div>
              <Button type="submit" disabled={isLoading} className="h-11 px-6">
                Search
              </Button>
            </form>

            {/* Right controls: sort + mobile filters */}
            <div className="flex items-center gap-3">
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px] h-11">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              {/* Mobile filters */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden h-11">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                    {chips.length > 0 && (
                      <span className="ml-2 bg-primary text-primary-foreground rounded-full h-5 w-5 text-xs flex items-center justify-center">
                        {chips.length}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[90vw] sm:w-[420px] overflow-y-auto">
                  <SheetHeader className="border-b pb-4">
                    <SheetTitle className="text-xl">Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 pb-8">{FiltersUI}</div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Active chips */}
          {chips.length > 0 && (
            <>
              <Separator className="my-6" />
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-sm text-muted-foreground mr-2">Active filters:</div>
                {chips.map((c) => (
                  <Badge key={c.key} variant="secondary" className="pl-3 pr-1 py-1.5">
                    <span className="mr-1">{c.label}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 hover:bg-transparent"
                      onClick={c.onClear}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
                <Button variant="link" className="text-sm h-auto px-2" onClick={clearAll}>
                  Clear all
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Results summary */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {isLoading ? "Searching..." : `${total} property${total !== 1 ? 'ies' : ''} found`}
            {q && !isLoading && ` for "${q}"`}
            {city !== "all" && !isLoading && ` in ${city}`}
          </div>
          {!isLoading && totalPages > 1 && (
            <div className="text-xs text-muted-foreground">Page {safePage} of {totalPages}</div>
          )}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        ) : total === 0 ? (
          <div className="mt-8 rounded-xl border bg-background p-12 text-center">
            <div className="text-2xl mb-2">No properties found</div>
            <div className="text-muted-foreground mb-6">
              {chips.length > 0
                ? "Try adjusting your filters to see more results."
                : "No properties available at the moment."}
            </div>
            {chips.length > 0 && (
              <Button onClick={clearAll} variant="outline">
                Clear All Filters
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  disabled={safePage <= 1}
                  onClick={() => updateURL({ page: String(safePage - 1) })}
                >
                  Previous
                </Button>
                <div className="text-sm text-muted-foreground">
                  Page {safePage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  disabled={safePage >= totalPages}
                  onClick={() => updateURL({ page: String(safePage + 1) })}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
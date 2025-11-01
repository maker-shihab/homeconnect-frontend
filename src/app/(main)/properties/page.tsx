/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PropertyCard } from '@/components/cards/Property-card-client';
import { ProtectedRoute } from '@/components/protected-route';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { propertiesApi } from '@/lib/api/properties-api';
import { Property } from '@/types/dashboard';
import { Building, Filter, Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

// Filter types
interface FilterState {
  searchTerm: string;
  propertyType: string;
  status: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: string;
  city: string;
  tags: string[];
}

export default function DashboardPropertiesPage() {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    propertyType: '',
    status: '',
    minPrice: 0,
    maxPrice: 500000,
    bedrooms: '',
    city: '',
    tags: []
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch all properties
  const fetchAllProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await propertiesApi.getAllProperties();
      console.log(result);
      setAllProperties(result.properties || result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchAllProperties();
  }, []);

  // Filter properties client-side
  const filteredProperties = useMemo(() => {
    return allProperties.filter(property => {
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch =
          property.title?.toLowerCase().includes(searchLower) ||
          property.description?.toLowerCase().includes(searchLower) ||
          property.address?.toLowerCase().includes(searchLower) ||
          property.city?.toLowerCase().includes(searchLower) ||
          property.tags?.some(tag => tag.toLowerCase().includes(searchLower));

        if (!matchesSearch) return false;
      }

      // Property type filter
      if (filters.propertyType && property.propertyType !== filters.propertyType) {
        return false;
      }

      // Status filter
      if (filters.status && property.status !== filters.status) {
        return false;
      }

      // Price filter
      const price = property.rentPrice || property.price || 0;
      if (price < filters.minPrice || price > filters.maxPrice) {
        return false;
      }

      // Bedrooms filter
      if (filters.bedrooms) {
        if (filters.bedrooms === '4+' && property.bedrooms < 4) return false;
        if (filters.bedrooms !== '4+' && property.bedrooms !== parseInt(filters.bedrooms)) return false;
      }

      // City filter
      if (filters.city && property.city !== filters.city) {
        return false;
      }

      // Tags filter
      if (filters.tags.length > 0 && !filters.tags.some(tag => property.tags?.includes(tag))) {
        return false;
      }

      return true;
    });
  }, [allProperties, filters]);

  // Get unique values for filters
  const uniqueCities = useMemo(() => {
    return [...new Set(allProperties.map(p => p.city).filter(Boolean))];
  }, [allProperties]);

  const uniqueTags = useMemo(() => {
    const allTags = allProperties.flatMap(p => p.tags || []);
    return [...new Set(allTags)];
  }, [allProperties]);

  // Reset filters
  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      propertyType: '',
      status: '',
      minPrice: 0,
      maxPrice: 500000,
      bedrooms: '',
      city: '',
      tags: []
    });
  };

  // Check if any filter is active
  const hasActiveFilters = Object.values(filters).some(value =>
    Array.isArray(value) ? value.length > 0 : value !== '' && value !== 0
  );

  if (loading && allProperties.length === 0) {
    return <LoadingState />;
  }

  if (error && allProperties.length === 0) {
    return <ErrorState error={error} onRetry={fetchAllProperties} />;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-6 pt-28">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
              <p className="text-gray-600">
                {filteredProperties.length} of {allProperties.length} properties
                {hasActiveFilters && ' (filtered)'}
              </p>
            </div>
            <Button onClick={() => setShowFilters(!showFilters)}>
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2 bg-blue-500 text-white">
                  Active
                </Badge>
              )}
            </Button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search properties by title, description, location, or tags..."
                value={filters.searchTerm}
                onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="pl-10 pr-4 py-2"
              />
              {filters.searchTerm && (
                <button
                  onClick={() => setFilters(prev => ({ ...prev, searchTerm: '' }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <Card className="mb-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Property Type */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Property Type</label>
                  <Select
                    value={filters.propertyType}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, propertyType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All types</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="condo">Condo</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Status */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All status</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="rented">Rented</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Bedrooms</label>
                  <Select
                    value={filters.bedrooms}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, bedrooms: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any</SelectItem>
                      <SelectItem value="1">1 Bedroom</SelectItem>
                      <SelectItem value="2">2 Bedrooms</SelectItem>
                      <SelectItem value="3">3 Bedrooms</SelectItem>
                      <SelectItem value="4+">4+ Bedrooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* City */}
                <div>
                  <label className="text-sm font-medium mb-2 block">City</label>
                  <Select
                    value={filters.city}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, city: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All cities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All cities</SelectItem>
                      {uniqueCities.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block">
                    Price Range: ${filters.minPrice} - ${filters.maxPrice}
                  </label>
                  <Slider
                    value={[filters.minPrice, filters.maxPrice]}
                    min={0}
                    max={500000}
                    step={5000}
                    onValueChange={([min, max]) => setFilters(prev => ({
                      ...prev,
                      minPrice: min,
                      maxPrice: max
                    }))}
                    className="my-4"
                  />
                </div>

                {/* Tags */}
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {uniqueTags.slice(0, 10).map(tag => (
                      <Badge
                        key={tag}
                        variant={filters.tags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          setFilters(prev => ({
                            ...prev,
                            tags: prev.tags.includes(tag)
                              ? prev.tags.filter(t => t !== tag)
                              : [...prev.tags, tag]
                          }));
                        }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t">
                <Button variant="outline" onClick={resetFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Reset Filters
                </Button>
                <Button onClick={() => setShowFilters(false)}>
                  Apply Filters
                </Button>
              </div>
            </Card>
          )}

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mb-6 flex flex-wrap gap-2">
              {filters.searchTerm && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: {filters.searchTerm}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setFilters(prev => ({ ...prev, searchTerm: '' }))}
                  />
                </Badge>
              )}
              {filters.propertyType && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Type: {filters.propertyType}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setFilters(prev => ({ ...prev, propertyType: '' }))}
                  />
                </Badge>
              )}
              {filters.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  Tag: {tag}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setFilters(prev => ({
                      ...prev,
                      tags: prev.tags.filter(t => t !== tag)
                    }))}
                  />
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-blue-600 hover:text-blue-800"
              >
                Clear All
              </Button>
            </div>
          )}

          {/* Properties Grid */}
          {filteredProperties.length === 0 ? (
            <EmptyState hasFilters={hasActiveFilters} onReset={resetFilters} />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property, index) => (
                  <PropertyCard key={index} property={property as any} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

// Loading State Component
function LoadingState() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
              <p className="text-gray-600">Manage your properties and listings</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-44 bg-muted" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

// Error State Component
function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
              <p className="text-gray-600">Manage your properties and listings</p>
            </div>
          </div>
          <div className="text-center py-12">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={onRetry}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

// Empty State Component
function EmptyState({ hasFilters, onReset }: { hasFilters: boolean; onReset: () => void }) {
  return (
    <div className="text-center py-12">
      <div className="max-w-md mx-auto">
        <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {hasFilters ? 'No properties match your filters' : 'No properties found'}
        </h3>
        <p className="text-gray-600 mb-4">
          {hasFilters
            ? 'Try adjusting your filters to see more results.'
            : 'Get started by adding your first property.'
          }
        </p>
        {hasFilters && (
          <Button onClick={onReset}>
            Clear All Filters
          </Button>
        )}
      </div>
    </div>
  );
}
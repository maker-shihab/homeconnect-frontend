/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PropertyCard } from '@/components/cards/Property-card-client';
import { ProtectedRoute } from '@/components/protected-route';
import { Card } from '@/components/ui/card';
import { propertiesApi } from '@/lib/api/properties-api';
import { Property } from '@/types/dashboard';
import { useEffect, useState } from 'react';

export default function DashboardPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch properties
  const fetchUserProperties = async (page: number = 1, limit: number = 10) => {
    try {
      setLoading(true);
      setError(null);

      const result = await propertiesApi.getUserProperties(page, limit);

      setProperties(prev => page === 1 ? result.properties : [...prev, ...result.properties]);
      setHasMore(result.hasNext);
      setCurrentPage(result.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchUserProperties(1, 10);
  }, []);

  // Load more function
  const loadMore = () => {
    if (!loading && hasMore) {
      fetchUserProperties(currentPage + 1, 10);
    }
  };

  if (loading && properties.length === 0) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="px-6">
            {/* Dashboard Properties Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
                <p className="text-gray-600">Manage your properties and listings</p>
              </div>
            </div>
            {/* Loading Skeleton */}
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

  // Error state
  if (error && properties.length === 0) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="px-6">
            {/* Dashboard Properties Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
                <p className="text-gray-600">Manage your properties and listings</p>
              </div>
            </div>
            {/* Error State */}
            <div className="text-center py-12">
              <p className="text-destructive">{error}</p>
              <button
                onClick={() => fetchUserProperties(1, 10)}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Empty state
  if (properties.length === 0) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="px-6">
            {/* Dashboard Properties Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
                <p className="text-gray-600">Manage your properties and listings</p>
              </div>
            </div>
            {/* Empty State */}
            <div className="text-center py-12">
              <p className="text-muted-foreground">No properties found.</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="px-6">
          {/* Dashboard Properties Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
              <p className="text-gray-600">Manage your properties and listings</p>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property as any} />
            ))}
          </div>

          {/* Load More Section */}
          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}

          {/* Loading more skeletons */}
          {loading && properties.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={`loading-${i}`} className="animate-pulse">
                  <div className="h-44 bg-muted" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
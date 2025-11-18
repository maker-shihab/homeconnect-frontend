/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PropertyCard } from '@/components/cards/PropertyCard';
import { Card } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { PropertySearchResult } from '@/types/property.types';
import { Building, ServerCrash } from 'lucide-react';

interface PropertyGridProps {
  searchResult?: PropertySearchResult;
  isLoading: boolean;
  isError: boolean;
  error: any;
  onPageChange: (newPage: number) => void;
}

export function PropertyGrid({
  searchResult,
  isLoading,
  isError,
  error,
  onPageChange,
}: PropertyGridProps) {

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError) {
    return <ErrorState error={error} />;
  }

  if (
    !searchResult ||
    !searchResult.properties ||
    searchResult.properties.length === 0
  ) {
    return <EmptyState />;
  }

  const { properties, total, page, hasNext, hasPrev } = searchResult;

  return (
    <>
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {isLoading ? "Searching..." : `${total} property${total !== 1 ? 'ies' : ''} found`}
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>

      <div className="mt-12">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (hasPrev) onPageChange(page - 1);
                }}
                className={!hasPrev ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>

            <PaginationItem>
              <PaginationLink href="#" isActive>
                {page}
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (hasNext) onPageChange(page + 1);
                }}
                className={!hasNext ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
}

function LoadingSkeleton() {
  return (
    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="animate-pulse pt-0">
          <div className="h-56 bg-gray-200 rounded-t-lg" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </div>
        </Card>
      ))}
    </div>
  );
}

function ErrorState({ error }: { error: any }) {
  return (
    <div className="mt-8 rounded-xl border bg-background p-12 text-center">
      <ServerCrash className="w-16 h-16 text-red-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Failed to Load Properties
      </h3>
      <p className="text-gray-600 mb-4">
        {error?.data?.message || 'An unexpected error occurred.'}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-8 rounded-xl border bg-background p-12 text-center">
      <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-2xl mb-2">No properties found</h3>
      <div className="text-muted-foreground mb-6">
        Try adjusting your filters to see more results.
      </div>
    </div>
  );
}
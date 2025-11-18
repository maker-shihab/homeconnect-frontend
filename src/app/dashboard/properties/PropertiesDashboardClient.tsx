/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMyPropertiesQuery } from "@/redux/features/property/propertyApiSlice";
import { Building, Plus, ServerCrash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PropertiesListTable } from "./PropertiesListTable";

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

function ErrorState({ error }: { error: any }) {
  return (
    <div className="text-center py-20 bg-white rounded-lg shadow-sm border">
      <ServerCrash className="w-16 h-16 text-red-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Failed to Load Properties
      </h3>
      <p className="text-gray-600 mb-4">
        {error?.data?.message || "An unexpected error occurred."}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20 bg-white rounded-lg shadow-sm border">
      <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        You haven&apos;t listed any properties yet.
      </h3>
      <p className="text-gray-600 mb-4">
        Get started by adding your first property.
      </p>
      <Button asChild>
        <Link href="/dashboard/add-property">
          <Plus className="mr-2 h-4 w-4" />
          Add New Property
        </Link>
      </Button>
    </div>
  );
}

export function PropertiesDashboardClient() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const {
    data: searchResult,
    isLoading,
    isError,
    error,
  } = useGetMyPropertiesQuery({
    page,
    limit,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

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

  const { properties, total, hasNext, hasPrev } = searchResult;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
          <p className="text-gray-600">
            You have {total} {total === 1 ? "property" : "properties"}{" "}
            listed.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/add-property">
            <Plus className="mr-2 h-4 w-4" />
            Add New Property
          </Link>
        </Button>
      </div>

      <PropertiesListTable properties={properties} />

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (hasPrev) handlePageChange(page - 1);
              }}
              className={!hasPrev ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          <PaginationItem>
            <span className="text-sm font-medium px-4">
              Page {page} of {searchResult.totalPages}
            </span>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (hasNext) handlePageChange(page + 1);
              }}
              className={!hasNext ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
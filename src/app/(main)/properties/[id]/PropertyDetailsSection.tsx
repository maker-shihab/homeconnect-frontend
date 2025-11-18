"use client";

import { Card } from "@/components/ui/card";
import {
  isRentalResponse,
  PropertyResponse,
} from "@/types/property.types";
import { Check } from "lucide-react";

interface PropertyDetailsSectionProps {
  property: PropertyResponse;
}

interface DetailItem {
  label: string;
  value: string | number | undefined;
  transform?: "capitalize";
}

export function PropertyDetailsSection({
  property,
}: PropertyDetailsSectionProps) {
  const { description, amenities } = property;

  const details: DetailItem[] = [
    {
      label: "Property Type",
      value: property.propertyType,
      transform: "capitalize",
    },
    { label: "Status", value: property.status, transform: "capitalize" },
    { label: "Bedrooms", value: property.bedrooms },
    { label: "Bathrooms", value: property.bathrooms },
    { label: "Area Size", value: `${property.areaSize} ${property.areaUnit}` },
    { label: "Year Built", value: property.yearBuilt || "N/A" },
  ];

  if (isRentalResponse(property)) {
    details.push(
      { label: "Furnished", value: property.isFurnished ? "Yes" : "No" },
      { label: "Minimum Stay", value: `${property.minimumStay} months` },
      {
        label: "Pet Policy",
        value: property.petPolicy,
        transform: "capitalize",
      },
      {
        label: "Smoking Policy",
        value: property.smokingPolicy,
        transform: "capitalize",
      }
    );
  } else {
    details.push(
      {
        label: "Condition",
        value: property.propertyCondition,
        transform: "capitalize",
      },
      {
        label: "Ownership",
        value: property.ownershipType,
        transform: "capitalize",
      },
      {
        label: "Mortgage",
        value: property.mortgageAvailable ? "Available" : "Not Available",
      }
    );
  }

  return (
    <Card className="p-6 md:p-8 border-none shadow-none">
      <h2 className="text-2xl font-semibold mb-4">About this property</h2>
      <p className="text-gray-600 leading-relaxed">{description}</p>

      <h3 className="text-xl font-semibold mt-8 mb-4">Details</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3">
        {details.map((item) => (
          <div key={item.label}>
            <dt className="text-sm font-medium text-gray-500">{item.label}</dt>
            <dd
              className={`text-gray-900 font-semibold ${item.transform || ""
                }`}
            >
              {item.value}
            </dd>
          </div>
        ))}
      </div>

      <h3 className="text-xl font-semibold mt-8 mb-4">Amenities</h3>
      {amenities.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3">
          {amenities.map((amenity) => (
            <div key={amenity} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-gray-700">{amenity}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No amenities listed.</p>
      )}
    </Card>
  );
}
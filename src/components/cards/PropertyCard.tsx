import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Bath, Bed, MapPin, Ruler } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type ListingType = "rent" | "sale";

export interface Property {
  id: string;
  title: string;
  city: string;
  neighborhood?: string;
  price: number; // e.g. 1500 or 320000
  currency?: string; // e.g. USD
  listingType: ListingType; // "rent" | "sale"
  beds: number;
  baths: number;
  areaSize: number; // 1200
  areaUnit?: "sqft" | "sqm";
  imageUrl: string;
  isNew?: boolean;
}

export default function PropertyCard({ property }: { property: Property }) {
  const {
    id, title, city, neighborhood, price, currency = "USD",
    listingType, beds, baths, areaSize, areaUnit = "sqft", imageUrl, isNew,
  } = property;

  const priceLabel =
    listingType === "rent"
      ? `${currency} ${price.toLocaleString()}/mo`
      : `${currency} ${price.toLocaleString()}`;

  return (
    <Link href={`/property/${id}`} className="block">
      <Card className="overflow-hidden rounded-xl transition-shadow hover:shadow-lg">
        <div className="relative h-44 w-full">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width:768px) 100vw, 33vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          <div className="absolute left-2 top-2 flex gap-2">
            <Badge variant="default" className="bg-white text-black hover:bg-white">
              {listingType === "rent" ? "For Rent" : "For Sale"}
            </Badge>
            {isNew && <Badge className="bg-emerald-500 text-white">New</Badge>}
          </div>
        </div>

        <div className="p-4">
          <div className="mb-1 text-base font-semibold">{priceLabel}</div>
          <div className="line-clamp-1 text-sm">{title}</div>

          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Bed className="h-4 w-4" /> {beds} bd
            </span>
            <span className="inline-flex items-center gap-1">
              <Bath className="h-4 w-4" /> {baths} ba
            </span>
            <span className="inline-flex items-center gap-1">
              <Ruler className="h-4 w-4" /> {areaSize.toLocaleString()} {areaUnit}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{neighborhood ? `${neighborhood}, ` : ""}{city}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
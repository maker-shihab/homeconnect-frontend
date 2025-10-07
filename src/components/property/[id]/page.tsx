import ContactCard from "@/components/property/ContactCard";
import PropertyGallery from "@/components/property/PropertyGallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bath, Bed, CheckCircle2, Home, MapPin, Ruler } from "lucide-react";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// If you already have a Property type, extend it here.
export type ListingType = "rent" | "sale";

export interface PropertyDetails {
  id: string;
  title: string;
  city: string;
  neighborhood?: string;
  address?: string;
  price: number;
  currency?: string;
  listingType: ListingType;
  beds: number;
  baths: number;
  areaSize: number;
  areaUnit?: "sqft" | "sqm";
  propertyType?: string;
  yearBuilt?: number;
  images: string[];
  description?: string;
  amenities?: string[];
  lat: number;
  lng: number;
  isNew?: boolean;
}

// Dynamic import for Leaflet map (client-only)
const LeafletMap = dynamic(() => import("@/components/maps/LeafletMap"), { ssr: false });

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const p = await getProperty(params.id);
  if (!p) return {};
  return {
    title: `${p.title} • ${p.city} | Home Connect`,
    description: `${p.beds} bed · ${p.baths} bath · ${p.areaSize} ${p.areaUnit ?? "sqft"} • ${p.neighborhood ?? p.city}`,
  };
}

// Mock data for now (replace with DB call later)
const MOCK: PropertyDetails[] = [
  {
    id: "s1",
    title: "Contemporary 3BR Condo",
    city: "Dhaka",
    neighborhood: "Banani",
    address: "House 12, Road 23",
    price: 320000,
    currency: "USD",
    listingType: "sale",
    beds: 3,
    baths: 2,
    areaSize: 1550,
    areaUnit: "sqft",
    propertyType: "Condo",
    yearBuilt: 2019,
    images: ["/properties/9.jpg", "/properties/10.jpg", "/properties/11.jpg", "/properties/12.jpg"],
    description:
      "Spacious and sunlit condo with open-plan living, modern kitchen, and a private balcony. Close to shopping and public transport.",
    amenities: ["Balcony", "Elevator", "Parking", "24/7 Security", "Gym", "Backup Power"],
    lat: 23.7945,
    lng: 90.4043,
    isNew: true,
  },
  {
    id: "r1",
    title: "Modern 2BR Apartment with City View",
    city: "Dhaka",
    neighborhood: "Gulshan",
    address: "Road 36, Gulshan-2",
    price: 1200,
    currency: "USD",
    listingType: "rent",
    beds: 2,
    baths: 2,
    areaSize: 950,
    areaUnit: "sqft",
    propertyType: "Apartment",
    yearBuilt: 2021,
    images: ["/properties/1.jpg", "/properties/2.jpg", "/properties/3.jpg", "/properties/4.jpg"],
    description:
      "Stylish 2-bedroom apartment with floor-to-ceiling windows and panoramic city views. Fully equipped kitchen and secure access.",
    amenities: ["Furnished", "Elevator", "Parking", "CCTV", "Generator", "Fire Safety"],
    lat: 23.7925,
    lng: 90.4078,
    isNew: true,
  },
];

async function getProperty(id: string): Promise<PropertyDetails | null> {
  // Replace with DB fetch later
  return MOCK.find((p) => p.id === id) ?? null;
}

export default async function PropertyPage({ params }: { params: { id: string } }) {
  const property = await getProperty(params.id);
  if (!property) return notFound();

  const {
    id,
    title,
    city,
    neighborhood,
    address,
    price,
    currency = "USD",
    listingType,
    beds,
    baths,
    areaSize,
    areaUnit = "sqft",
    propertyType,
    yearBuilt,
    images,
    description,
    amenities = [],
    lat,
    lng,
    isNew,
  } = property;

  const priceLabel =
    listingType === "rent"
      ? `${currency} ${price.toLocaleString()}/mo`
      : `${currency} ${price.toLocaleString()}`;

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="mb-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:underline">Home</Link>
          <span> / </span>
          <Link href={`/search?type=${listingType}`} className="hover:underline">
            {listingType === "rent" ? "Rent" : "Buy"}
          </Link>
          <span> / </span>
          <span className="text-foreground">{neighborhood ?? city}</span>
        </nav>

        {/* Title + location */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{listingType === "rent" ? "For Rent" : "For Sale"}</Badge>
            {isNew && <Badge className="bg-emerald-500 text-white">New</Badge>}
          </div>
        </div>
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{address ? `${address}, ` : ""}{neighborhood ? `${neighborhood}, ` : ""}{city}</span>
        </div>

        {/* Gallery */}
        <PropertyGallery images={images} alt={title} />

        {/* Key facts */}
        <div className="mt-6 grid grid-cols-2 gap-3 rounded-xl border bg-background p-4 md:grid-cols-4">
          <div className="flex items-center gap-2">
            <Bed className="h-5 w-5 text-primary" />
            <div>
              <div className="text-sm text-muted-foreground">Bedrooms</div>
              <div className="font-medium">{beds}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Bath className="h-5 w-5 text-primary" />
            <div>
              <div className="text-sm text-muted-foreground">Bathrooms</div>
              <div className="font-medium">{baths}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Ruler className="h-5 w-5 text-primary" />
            <div>
              <div className="text-sm text-muted-foreground">Area</div>
              <div className="font-medium">{areaSize.toLocaleString()} {areaUnit}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" />
            <div>
              <div className="text-sm text-muted-foreground">Type</div>
              <div className="font-medium">{propertyType ?? "Property"}</div>
            </div>
          </div>
        </div>

        {/* Main layout */}
        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          {/* Main column */}
          <div className="space-y-6 lg:col-span-8">
            {/* Description */}
            <Card className="rounded-xl border p-5">
              <h3 className="mb-2 text-xl font-semibold">Description</h3>
              <p className="text-muted-foreground">{description}</p>
            </Card>

            {/* Amenities */}
            <Card className="rounded-xl border p-5">
              <h3 className="mb-4 text-xl font-semibold">Amenities</h3>
              {amenities.length === 0 ? (
                <p className="text-sm text-muted-foreground">No amenities listed.</p>
              ) : (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                  {amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Map */}
            <Card className="overflow-hidden rounded-xl border">
              <div className="flex items-center justify-between p-5">
                <h3 className="text-xl font-semibold">Location</h3>
                <Link
                  href={`/search?city=${encodeURIComponent(city)}`}
                  className="text-sm text-primary underline"
                >
                  View nearby
                </Link>
              </div>
              {/* Reuse LeafletMap with a single marker */}
              <LeafletMap
                items={[
                  {
                    ...property,
                    lat,
                    lng,
                    imageUrl: images[0], // Use the first image as imageUrl
                  },
                ]}
                heightClass="h-64 md:h-80"
              />
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-4">
            {/* Price and actions */}
            <Card className="rounded-xl border p-5">
              <div className="mb-1 text-2xl font-bold">{priceLabel}</div>
              <div className="text-sm text-muted-foreground">
                {neighborhood ? `${neighborhood}, ` : ""}{city}
              </div>
              <div className="mt-4 flex gap-2">
                <Button className="flex-1">Schedule a tour</Button>
                <Button variant="outline" className="flex-1" asChild>
                  <Link href="#contact">Message</Link>
                </Button>
              </div>
              {yearBuilt && (
                <div className="mt-4 rounded-md bg-muted p-3 text-sm text-muted-foreground">
                  Built in {yearBuilt} • {propertyType ?? "Property"}
                </div>
              )}
            </Card>

            {/* Contact card */}
            <div id="contact">
              <ContactCard propertyId={id} />
            </div>

            {/* Listing agent/landlord placeholder (optional) */}
            <Card className="rounded-xl border p-5">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full bg-muted">
                  <Image src="/avatar-placeholder.png" alt="Agent" fill className="object-cover" />
                </div>
                <div>
                  <div className="text-sm font-medium">Home Connect Team</div>
                  <div className="text-xs text-muted-foreground">Verified partner</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                We’ll help you schedule a viewing and answer any questions.
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
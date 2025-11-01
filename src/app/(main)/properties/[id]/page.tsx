"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyResponse } from "@/lib/api/properties-api";
import { useAuth } from "@/lib/auth-context";
import { getPropertyById } from "@/lib/properties";
import {
  ArrowLeft,
  Bath,
  Bed,
  Calendar,
  Car,
  Coffee,
  Heart,
  Mail,
  MapPin,
  Microwave,
  Phone,
  Ruler,
  Share2,
  Snowflake,
  Star,
  Tv,
  User,
  WashingMachine,
  Wifi
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export type ListingType = "rent" | "sale";

function formatPrice(price: number, currency = "BDT", listingType: ListingType) {
  try {
    const value = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(price);
    return listingType === "rent" ? `${value}/mo` : value;
  } catch {
    const fallback = `${currency} ${price.toLocaleString()}`;
    return listingType === "rent" ? `${fallback}/mo` : fallback;
  }
}

export default function SinglePropertyPage() {
  const [property, setProperty] = useState<PropertyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const { user } = useAuth();
  const params = useParams();
  const propertyId = params.id as string;

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const result = await getPropertyById(propertyId);
      setProperty(result);
    } catch (err) {
      toast.error("Failed to load property details");
      console.error("Error fetching property:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  if (loading) {
    return <PropertySkeleton />;
  }

  if (!property) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
            <p className="text-gray-600 mb-6">The property you are looking for does not exist or has been removed.</p>
            <Link href="/properties">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Properties
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const {
    title,
    description,
    rentPrice,
    currency = "BDT",
    listingType,
    type,
    status,
    bedrooms,
    bathrooms,
    area,
    address,
    images,
    amenities = [],
    landlord,
    createdAt,
    parkingSpaces
  } = property;

  const mainAmenities = [
    { icon: Wifi, label: 'WiFi', value: amenities.includes('wifi') },
    { icon: Snowflake, label: 'Air Conditioning', value: amenities.includes('airConditioning') },
    { icon: Tv, label: 'TV', value: amenities.includes('tv') },
    { icon: WashingMachine, label: 'Washing Machine', value: amenities.includes('washingMachine') },
    { icon: Microwave, label: 'Microwave', value: amenities.includes('microwave') },
    { icon: Coffee, label: 'Coffee Maker', value: amenities.includes('coffeeMaker') },
  ].filter(amenity => amenity.value);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'rented': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const convertRentPrise = Number(rentPrice);
  const priceLabel = formatPrice(convertRentPrise, currency, listingType);

  return (
    <div className="min-h-screen bg-gray-50 pt-28">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/properties">
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Properties
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Save
              </Button>
              {user?.role === 'tenant' && (
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Viewing
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="py-0">
              <CardContent className="p-0">
                <div className="relative aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden">
                  {images && images.length > 0 ? (
                    <>
                      <Image
                        src={images[activeImage]}
                        alt={title}
                        fill
                        className="object-cover"
                        priority
                      />
                      {/* Image Navigation */}
                      {images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                          {images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setActiveImage(index)}
                              className={`w-3 h-3 rounded-full transition-all ${activeImage === index
                                ? 'bg-white'
                                : 'bg-white/50'
                                }`}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image Available
                    </div>
                  )}
                </div>

                {/* Thumbnail Strip */}
                {images && images.length > 1 && (
                  <div className="p-4 flex gap-2 overflow-x-auto">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImage(index)}
                        className={`flex-shrink-0 w-20 h-16 relative rounded-md overflow-hidden border-2 transition-all ${activeImage === index
                          ? 'border-blue-500'
                          : 'border-transparent'
                          }`}
                      >
                        <Image
                          src={image}
                          alt={`${title} ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Property Details Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{description}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Property Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <Bed className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                        <p className="font-semibold text-lg">{bedrooms}</p>
                        <p className="text-sm text-gray-600">Bedrooms</p>
                      </div>
                      <div className="text-center">
                        <Bath className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                        <p className="font-semibold text-lg">{bathrooms}</p>
                        <p className="text-sm text-gray-600">Bathrooms</p>
                      </div>
                      <div className="text-center">
                        <Ruler className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                        <p className="font-semibold text-lg">{area} sqft</p>
                        <p className="text-sm text-gray-600">Area</p>
                      </div>
                      <div className="text-center">
                        <Car className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                        <p className="font-semibold text-lg">{parkingSpaces || 0}</p>
                        <p className="text-sm text-gray-600">Parking</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="amenities" className="pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Amenities</CardTitle>
                    <CardDescription>Features included with this property</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {mainAmenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <amenity.icon className="w-5 h-5 text-blue-600" />
                          <span className="font-medium">{amenity.label}</span>
                        </div>
                      ))}
                    </div>
                    {mainAmenities.length === 0 && (
                      <p className="text-center text-gray-500 py-8">No amenities listed</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="location" className="pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Location</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-3 mb-4">
                      <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
                      <div>
                        <p className="font-semibold">{address?.street}</p>
                        <p className="text-gray-600">
                          {address?.city}, {address?.state} {address?.zipCode}
                        </p>
                      </div>
                    </div>
                    {/* Map placeholder */}
                    <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                      Map View Coming Soon
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="pt-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Reviews</CardTitle>
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">4.8</span>
                        <span className="text-gray-500">(24 reviews)</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-gray-500">No reviews yet</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Be the first to review this property
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Price & Action Card */}
            <Card className="sticky top-24 z-10">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">
                      {priceLabel}
                    </p>
                    <p className="text-gray-600">per month</p>
                  </div>
                  <Badge className={getStatusColor(status)}>
                    {status}
                  </Badge>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Property Type</span>
                    <span className="font-medium capitalize">{type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Available From</span>
                    <span className="font-medium">Immediately</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Minimum Stay</span>
                    <span className="font-medium">12 months</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {user?.role === 'tenant' ? (
                    <>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Viewing
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Mail className="w-4 h-4 mr-2" />
                        Contact Landlord
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" className="w-full">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact for More Info
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Landlord Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Landlord Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold">{landlord?.name || 'Property Owner'}</p>
                    <p className="text-sm text-gray-600">Landlord</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Landlord
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700 text-center">
                    Response time: Usually within 1 hour
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card>
              <CardHeader>
                <CardTitle>Property Facts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Property ID</span>
                  <span className="font-mono">#{propertyId.slice(-8)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Listed</span>
                  <span className="font-medium">
                    {new Date(createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-medium">
                    {new Date(createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton Loader Component
function PropertySkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="aspect-[4/3] w-full rounded-lg" />

            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-20 h-16 rounded-md" />
              ))}
            </div>

            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
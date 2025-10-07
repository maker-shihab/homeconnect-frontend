import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import CityGrid from "@/components/sections/CityGrid";
import FeaturedListings from "@/components/sections/FeaturedListings";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import LandlordCTA from "@/components/sections/LandlordCTA";
import MapPreview from "@/components/sections/MapPreview";
import NewListingsGrid from "@/components/sections/NewListings";
import Newsletter from "@/components/sections/Newsletter";
import PropertyTypeGrid from "@/components/sections/PropertyTypeGrid";
import TrustBadges from "@/components/sections/TrustBadges";
import { listProperties, queryProperties } from "@/lib/properties";

export default function Home() {
  const { items: featuredRentals } = queryProperties({ listingType: "rent", featured: true, limit: 8 });
  const { items: featuredSales } = queryProperties({ listingType: "sale", featured: true, limit: 8 });
  const { items: newListings } = queryProperties({ sort: "newest", limit: 8 });
  const mapItems = listProperties().slice(0, 8).filter(p => p.lat && p.lng) as any[];

  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustBadges />

        <FeaturedListings title="Featured Rentals" items={featuredRentals as any} viewAllHref="/search?lt=rent" />
        <FeaturedListings title="Featured For Sale" items={featuredSales as any} viewAllHref="/search?lt=sale" />
        <NewListingsGrid title="New Listings Near You" items={newListings as any} viewAllHref="/search?sort=newest" />

        <MapPreview title="Map preview" items={mapItems as any} viewFullMapHref="/map" />
        <PropertyTypeGrid />
        <CityGrid />
        <HowItWorks />
        <LandlordCTA />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}

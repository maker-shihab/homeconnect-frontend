import { HomepageFeaturedProperties } from "@/components/cards/PropertyCard";
import CityGrid from "@/components/sections/CityGrid";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import LandlordCTA from "@/components/sections/LandlordCTA";
import MapPreview from "@/components/sections/MapPreview";
import Newsletter from "@/components/sections/Newsletter";
import PropertyTypeGrid from "@/components/sections/PropertyTypeGrid";
import TrustBadges from "@/components/sections/TrustBadges";

export default function Home() {

  return (
    <>
      <main>
        <Hero />
        <TrustBadges />
        <HomepageFeaturedProperties />
        <MapPreview
          title="Explore Properties on Map"
          viewFullMapHref="/map"
        />
        <PropertyTypeGrid />
        <CityGrid />
        <HowItWorks />
        <LandlordCTA />
        <Newsletter />
      </main>
    </>
  );
}

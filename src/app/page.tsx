
import { FeaturedProperties } from "@/components/property/FeaturedProperties";
import CityGrid from "@/components/sections/CityGrid";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import LandlordCTA from "@/components/sections/LandlordCTA";
import Newsletter from "@/components/sections/Newsletter";
import PropertyTypeGrid from "@/components/sections/PropertyTypeGrid";
import TrustBadges from "@/components/sections/TrustBadges";

export default function Home() {

  return (
    <>
      <main>
        <Hero />
        <TrustBadges />
        <FeaturedProperties />
        <PropertyTypeGrid />
        <CityGrid />
        <HowItWorks />
        <LandlordCTA />
        <Newsletter />
      </main>
    </>
  );
}

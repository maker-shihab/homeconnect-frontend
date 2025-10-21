"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, Home, MapPin, Search, Shield, Star, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

const heroImages = ["/hero/1.jpg", "/hero/2.jpg", "/hero/3.jpg"];

export default function Hero() {
  const [listingType, setListingType] = useState<"buy" | "rent">("buy");

  return (
    <section className="pt-6 relative w-full min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Carousel
          opts={{ loop: true }}
          plugins={[
            Autoplay({
              delay: 6000,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
            }),
          ]}
          className="h-full w-full"
        >
          <CarouselContent className="h-full">
            {heroImages.map((src, idx) => (
              <CarouselItem key={idx} className="relative h-screen p-0">
                <div className="relative h-full w-full">
                  <Image
                    src={src}
                    alt={`Luxury property ${idx + 1}`}
                    fill
                    priority={idx === 0}
                    className="object-cover scale-105 animate-zoom"
                    sizes="100vw"
                    quality={90}
                  />
                  {/* Enhanced Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-cyan-400 rounded-full opacity-60 animate-float" />
      <div className="absolute top-40 right-20 w-6 h-6 bg-blue-400 rounded-full opacity-40 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-40 left-20 w-3 h-3 bg-white rounded-full opacity-50 animate-pulse" />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Hero Content */}
            <div className="text-white space-y-8">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Trusted by 5,000+ Users</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-3 h-3 text-amber-400 fill-current" />
                  ))}
                  <span className="text-sm ml-1">4.9/5</span>
                </div>
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-none">
                  Find Your
                  <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Dream Home
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-white/90 leading-tight max-w-lg">
                  Discover exceptional properties with AI-powered search and virtual tours
                </p>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-cyan-400">500+</div>
                  <div className="text-white/80 text-sm">Premium Properties</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-blue-400">15+</div>
                  <div className="text-white/80 text-sm">Cities Covered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-indigo-400">24/7</div>
                  <div className="text-white/80 text-sm">Support</div>
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-white/90">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm">Verified Listings</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  <span className="text-sm">Price Alerts</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Home className="w-5 h-5 text-indigo-400" />
                  <span className="text-sm">Virtual Tours</span>
                </div>
              </div>
            </div>

            {/* Right: Search Card */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8 transform hover:scale-[1.02] transition-all duration-500">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Find Your Perfect Property
                </h2>
                <p className="text-gray-600">Search across thousands of verified listings</p>
              </div>

              <form action="/search" className="space-y-4">
                {/* Location Input */}
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    name="q"
                    placeholder="Enter city, neighborhood, or address"
                    className="pl-11 py-3 text-lg border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  />
                </div>

                {/* Buy/Rent Toggle */}
                <div className="bg-gray-100 rounded-xl p-1">
                  <ToggleGroup
                    type="single"
                    value={listingType}
                    onValueChange={(v) => v && setListingType(v as "buy" | "rent")}
                    className="grid grid-cols-2 gap-1"
                  >
                    <ToggleGroupItem
                      value="buy"
                      className="data-[state=on]:bg-gradient-to-r data-[state=on]:from-cyan-500 data-[state=on]:to-blue-500 data-[state=on]:text-white py-3 font-semibold"
                    >
                      Buy
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="rent"
                      className="data-[state=on]:bg-gradient-to-r data-[state=on]:from-cyan-500 data-[state=on]:to-blue-500 data-[state=on]:text-white py-3 font-semibold"
                    >
                      Rent
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                {/* Hidden input */}
                <input type="hidden" name="type" value={listingType} />

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 text-lg font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search Properties
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </form>

              {/* Quick Links */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 mb-3">Popular searches:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Downtown', 'University', 'Waterfront', 'Luxury'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className="text-xs bg-cyan-50 text-cyan-600 px-3 py-1 rounded-full hover:bg-cyan-100 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 animate-bounce">
        <div className="flex flex-col items-center">
          <span className="text-sm mb-2">Explore More</span>
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
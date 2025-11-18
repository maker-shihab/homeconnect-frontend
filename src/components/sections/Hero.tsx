"use client";

import { ArrowRight, Heart, Home, MapPin, Search, Shield, Star, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

const heroImages = [
  {
    src: "/hero/1.jpg",
    title: "Best Apartments",
    subtitle: "Premium apartments in Dhaka city"
  },
  {
    src: "/hero/2.jpg",
    title: "Quality Homes",
    subtitle: "New houses with modern design"
  },
  {
    src: "/hero/3.jpg",
    title: "Comfort Flats",
    subtitle: "Flats in good Dhaka locations"
  }
];

export default function Hero() {
  const [listingType, setListingType] = useState<"buy" | "rent">("buy");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Auto slide transition
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* Background Slides with Smooth Transitions */}
      <div className="absolute inset-0 -z-10">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
          >
            <Image
              src={image.src}
              alt={image.title}
              fill
              priority={index === 0}
              className="object-cover"
              sizes="100vw"
              quality={100}
            />
            {/* Enhanced Gradient Overlay for Better Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
          </div>
        ))}
      </div>

      {/* Subtle Floating Elements */}
      <div className="absolute top-1/4 left-10 w-3 h-3 bg-cyan-400 rounded-full opacity-60 animate-pulse" />
      <div className="absolute bottom-1/3 right-16 w-4 h-4 bg-blue-400 rounded-full opacity-40 animate-bounce" />
      <div className="absolute top-1/2 left-20 w-2 h-2 bg-white rounded-full opacity-30 animate-ping" />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Left: Hero Content - More Width */}
            <div className="lg:col-span-7 text-white space-y-8">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-4 bg-white/15 backdrop-blur-md border border-white/30 rounded-2xl px-6 py-4 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-base font-semibold">Trusted by 10,000+ Clients</span>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-amber-400 fill-current" />
                  ))}
                  <span className="text-base font-semibold ml-2">4.9/5</span>
                </div>
              </div>

              {/* Dynamic Text Content */}
              <div className="space-y-6">
                <div className="overflow-hidden">
                  <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-none transform transition-all duration-700">
                    <div className="block text-white">Discover</div>
                    <div className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent py-2">
                      {heroImages[currentSlide].title}
                    </div>
                  </h1>
                </div>

                <div className="overflow-hidden">
                  <p className="text-2xl md:text-3xl text-white/95 leading-relaxed font-light max-w-2xl transform transition-all duration-700">
                    {heroImages[currentSlide].subtitle}
                  </p>
                </div>
              </div>

              {/* Stats Section */}
              <div className="flex flex-wrap gap-8 pt-4">
                <div className="text-center transform hover:scale-110 transition-transform duration-300">
                  <div className="text-3xl md:text-4xl font-bold text-cyan-400">1,000+</div>
                  <div className="text-white/90 text-lg font-medium">Premium Properties</div>
                </div>
                <div className="text-center transform hover:scale-110 transition-transform duration-300">
                  <div className="text-3xl md:text-4xl font-bold text-blue-400">25+</div>
                  <div className="text-white/90 text-lg font-medium">Cities in Bangladesh</div>
                </div>
                <div className="text-center transform hover:scale-110 transition-transform duration-300">
                  <div className="text-3xl md:text-4xl font-bold text-purple-400">24/7</div>
                  <div className="text-white/90 text-lg font-medium">Expert Support</div>
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-3 text-white/95 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl">
                  <Shield className="w-6 h-6 text-cyan-400" />
                  <span className="text-lg font-medium">Verified Properties</span>
                </div>
                <div className="flex items-center gap-3 text-white/95 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                  <span className="text-lg font-medium">Best Price Guarantee</span>
                </div>
                <div className="flex items-center gap-3 text-white/95 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl">
                  <Home className="w-6 h-6 text-purple-400" />
                  <span className="text-lg font-medium">Virtual Tours</span>
                </div>
              </div>
            </div>

            {/* Right: Search Card - Smaller Width */}
            <div className="lg:col-span-5">
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 transform hover:scale-[1.01] transition-all duration-500">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    Find Your Dream Property
                  </h2>
                  <p className="text-gray-600 text-lg">Search thousands of verified listings across Bangladesh</p>
                </div>

                <form action="/search" className="space-y-6">
                  {/* Location Input */}
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-6 h-6" />
                    <Input
                      name="q"
                      placeholder="Enter area, city, or landmark..."
                      className="pl-14 py-4 text-lg border-2 border-gray-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 rounded-xl transition-all duration-300"
                    />
                  </div>

                  {/* Buy/Rent Toggle */}
                  <div className="bg-gray-100 rounded-2xl p-2">
                    <ToggleGroup
                      type="single"
                      value={listingType}
                      onValueChange={(v) => v && setListingType(v as "buy" | "rent")}
                      className="grid grid-cols-2 gap-2"
                    >
                      <ToggleGroupItem
                        value="buy"
                        className="data-[state=on]:bg-gradient-to-r data-[state=on]:from-cyan-500 data-[state=on]:to-blue-500 data-[state=on]:text-white data-[state=on]:shadow-lg py-4 text-lg font-bold rounded-xl transition-all duration-300"
                      >
                        Buy Property
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="rent"
                        className="data-[state=on]:bg-gradient-to-r data-[state=on]:from-cyan-500 data-[state=on]:to-blue-500 data-[state=on]:text-white data-[state=on]:shadow-lg py-4 text-lg font-bold rounded-xl transition-all duration-300"
                      >
                        Rent Property
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>

                  <input type="hidden" name="type" value={listingType} />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-4 text-xl font-bold shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 rounded-xl group"
                  >
                    <Search className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                    Explore Properties
                    <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>

                {/* Quick Links */}
                <div className="mt-8 text-center">
                  <p className="text-gray-600 mb-4 font-medium">Popular in Bangladesh:</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {['Gulshan', 'Banani', 'Uttara', 'Dhanmondi', 'Bashundhara'].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        className="bg-cyan-50 text-cyan-700 px-4 py-2 rounded-full hover:bg-cyan-100 hover:scale-105 transition-all duration-300 font-medium shadow-sm"
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
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
              ? "bg-white w-8"
              : "bg-white/50 hover:bg-white/80"
              }`}
          />
        ))}
      </div>

      {/* Perfect Scroll Indicator */}
      <div className="absolute bottom-16 right-8 z-20">
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-3 rounded-full backdrop-blur-md border border-white/30 transition-all duration-300 cursor-pointer ${isLiked
              ? 'bg-red-500/20 text-red-400 border-red-400/30'
              : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
          >
            <Heart
              className={`w-5 h-5 transition-all duration-300 ${isLiked ? 'fill-current scale-110' : ''
                }`}
            />
          </button>

          {/* Scroll Indicator */}
          <div className="flex flex-col gap-2 items-center text-white/80 pt-3">
            <span className="text-sm mb-3 font-medium tracking-wider rotate-90 origin-center whitespace-nowrap">
              SCROLL
            </span>
            <div className="w-px h-20 bg-white/30 rounded-full overflow-hidden">
              <div className="w-full h-8 bg-white animate-bounce rounded-full" />
            </div>
            <span className="text-xs mt-2 font-light tracking-widest">EXPLORE</span>
          </div>
        </div>
      </div>
    </section>
  );
}
"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

const heroImages = ["/hero/1.jpg", "/hero/2.jpg", "/hero/3.jpg"];

export default function Hero() {
  const [listingType, setListingType] = useState<"buy" | "rent">("buy");
  return (
    <section className="relative w-full h-[90vh] md:h-[90vh] overflow-hidden rounded-b-xl pt-40 pb-20">
      <div className="absolute inset-0 -z-10">
        <Carousel
          opts={{ loop: true }}
          plugins={[
            Autoplay({
              delay: 8000,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
            }),
          ]}
          className="h-full w-full"
        >
          <CarouselContent className="h-full">
            {heroImages.map((src, idx) => (
              <CarouselItem key={idx} className="relative h-[90vh] md:h-[90vh] p-0">
                <div className="relative h-full w-full">
                  <Image
                    src={src}
                    alt={`Hero slide ${idx + 1}`}
                    fill
                    priority={idx === 0}
                    className="object-cover"
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 h-full container mx-auto px-4 flex flex-col justify-center">
        <div className="max-w-3xl text-white space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-14">
            Find your next home <br /> With Home Connect
          </h1>
          <p className="text-base md:text-lg text-white/90">
            Search properties to buy or rent in your favorite neighborhoods.
          </p>
          {/* Search: Input → Buy/Rent → Button */}
          <form
            action="/search"
            className="mt-4 flex flex-col gap-2 rounded-lg bg-white/90 p-3 backdrop-blur md:flex-row md:items-center"
          >
            {/* Query input */}
            <Input
              name="q"
              placeholder="City, neighborhood, or address"
              className="bg-white"
            />

            {/* Buy/Rent segmented toggle (controls a hidden input) */}
            <ToggleGroup
              type="single"
              value={listingType}
              onValueChange={(v) => v && setListingType(v as "buy" | "rent")}
              className="rounded-md bg-black/5 p-1"
            >
              <ToggleGroupItem
                value="buy"
                aria-label="Buy"
                className="text-black data-[state=on]:bg-primary data-[state=on]:text-white"
              >
                Buy
              </ToggleGroupItem>
              <ToggleGroupItem
                value="rent"
                aria-label="Rent"
                className="text-black data-[state=on]:bg-primary data-[state=on]:text-white"
              >
                Rent
              </ToggleGroupItem>
            </ToggleGroup>

            {/* Hidden input to submit selected type */}
            <input type="hidden" name="type" value={listingType} />

            {/* Submit */}
            <Button type="submit" className="md:min-w-[120px]">
              Search
            </Button>
          </form>

        </div>
      </div>
    </section>
  )
}

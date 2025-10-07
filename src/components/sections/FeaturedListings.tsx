"use client";

import PropertyCard, { Property } from "@/components/cards/PropertyCard";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";

interface FeaturedListingsProps {
  title: string;
  items: Property[];
  viewAllHref: string;
  autoplay?: boolean;
}

export default function FeaturedListings({
  title,
  items,
  viewAllHref,
  autoplay = true,
}: FeaturedListingsProps) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-2xl font-bold">{title}</h3>
          <Button asChild variant="ghost">
            <Link href={viewAllHref}>View all</Link>
          </Button>
        </div>

        <div className="relative">
          <Carousel
            opts={{ loop: true, align: "start" }}
            plugins={
              autoplay
                ? [Autoplay({ delay: 4500, stopOnMouseEnter: true, stopOnInteraction: false })]
                : []
            }
          >
            <CarouselContent>
              {items.map((p) => (
                <CarouselItem
                  key={p.id}
                  className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <PropertyCard property={p} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
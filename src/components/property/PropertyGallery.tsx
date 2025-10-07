"use client";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function PropertyGallery({
  images,
  alt = "Property image",
}: {
  images: string[];
  alt?: string;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  if (!images?.length) return null;

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-xl border">
        <Carousel setApi={setApi} opts={{ loop: true }}>
          <CarouselContent>
            {images.map((src, idx) => (
              <CarouselItem key={idx} className="p-0">
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={src}
                    alt={`${alt} ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority={idx === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
          <div className="pointer-events-none absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-1 text-xs text-white">
            {current + 1} / {images.length}
          </div>
        </Carousel>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto">
        {images.map((src, idx) => (
          <button
            key={idx}
            onClick={() => api?.scrollTo(idx)}
            className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-md border ${current === idx ? "ring-2 ring-primary" : ""
              }`}
            aria-label={`View image ${idx + 1}`}
          >
            <Image src={src} alt={`${alt} thumbnail ${idx + 1}`} fill className="object-cover" sizes="96px" />
          </button>
        ))}
      </div>
    </div>
  );
}
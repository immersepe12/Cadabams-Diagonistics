"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { HomeFeature } from "@/lib/data/homepages";

function FeatureBadge({ feature }: { feature: HomeFeature }) {
  return (
    <div className="flex items-center gap-1.5 justify-center lg:justify-start">
      <div className="relative w-9 h-9 lg:w-10 lg:h-10 flex-shrink-0">
        <Image
          src={feature.icon}
          alt=""
          fill
          className="object-contain"
          sizes="40px"
        />
      </div>
      <p className="text-body font-semibold text-white whitespace-nowrap">
        {feature.title}
      </p>
    </div>
  );
}

export function HeroFeatures({ features }: { features: HomeFeature[] }) {
  const [autoplay] = React.useState(() =>
    Autoplay({
      delay: 2000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );

  if (features.length === 0) return null;

  return (
    <div className="mt-5 lg:mt-6 pt-4 border-t border-white/20">
      {/* Mobile: infinite moving carousel */}
      <Carousel
        opts={{ loop: true, align: "start", dragFree: true }}
        plugins={[autoplay]}
        className="sm:hidden"
      >
        <CarouselContent className="-ml-4">
          {features.map((f) => (
            <CarouselItem key={f.id} className="basis-full pl-4">
              <FeatureBadge feature={f} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Tablet & up: static grid */}
      <div className="hidden sm:grid sm:grid-cols-3 gap-6">
        {features.map((f) => (
          <FeatureBadge key={f.id} feature={f} />
        ))}
      </div>
    </div>
  );
}

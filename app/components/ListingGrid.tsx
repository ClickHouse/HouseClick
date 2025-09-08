'use client';

import { LinkQP } from "@/components/LinkQP";
import type { Listing } from "@/lib/types";
import Image from "next/image";
import { Badge, Icon } from "@clickhouse/click-ui";
import { Suspense } from "react";


interface ListingGridProps {
  listings: Listing[];
  isLoading: boolean;
}

export default function ListingGrid({ listings, isLoading }: ListingGridProps) {
  if (isLoading) {
    return (
      <div className="mb-8 grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 xl:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="group relative flex flex-col overflow-hidden rounded-lg"
          >
            <div className="h-52 w-full animate-pulse bg-neutral-800" />
            <div className="p-4">
              <div className="h-5 w-3/4 animate-pulse bg-neutral-800 rounded" />
              <div className="mt-2 h-4 w-1/2 animate-pulse bg-neutral-800 rounded" />
              <div className="mt-2 h-16 w-full animate-pulse bg-neutral-800 rounded" />
              <div className="mt-2 h-6 w-1/3 animate-pulse bg-neutral-800 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="mb-8 flex h-32 w-full items-center justify-center rounded-md border-neutral-750">
        <p className="text-neutral-200">No listings found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="mb-8 grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {listings.map((listing) => (
        <div
          key={listing.id}
          className="group relative flex flex-col overflow-hidden"
        >
          <Suspense>
          <LinkQP href={`/listings/listing/${listing.id}`}>
            <div className="flex flex-col min-w-3xs items-center">
              <div className="w-full">
                <Image
                  // fill
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: "100%", height: "240px" }}
                  src={listing.urls[0]}
                  alt={listing.title}
                  className="rounded-lg"
                />
              </div>
              <div className="flex flex-col gap-16 py-4 items-start self-stretch">
                <div className="flex items-start content-start self-stretch gap-x-4 gap-y-8">
                  <p className="min-w-[160px] text-[#FFF] text-(length:--typography-font-sizes-1,13px) leading-[150%] font-medium font-inter">
                    {listing.title}
                  </p>
                  <p className="text-[#FFF] text-lg leading-[normal] font-semibold font-[family-name:var(--typography-font-families-regular,'Test Söhne')]">{listing.price_formatted}</p>
                </div>
              </div>
              <div className="flex gap-2  items-start self-stretch">
                <div className="flex py-1 px-2 items-start gap-2 rounded border border-[#323232] bg-[#282828]">
                  <Icon height="16px"
                    name="home"
                    size="md"
                    width="16px"
                    color="yellow"
                  />
                  <p className="text-[#B3B6BD] text-(length:--typography-font-sizes-1,12px) leading-[150%] font-normal font-inter">{listing.type}</p>
                </div>
                <div className="flex py-1 px-2 items-start gap-2 rounded border border-[#323232] bg-[#282828]">
                  <Image
                    src="/icons/bed.svg"
                    alt="bed"
                    width={16}
                    height={16} />
                  <p className="text-[#B3B6BD] text-(length:--typography-font-sizes-1,12px) leading-[150%] font-normal font-inter">{listing.rooms}</p>
                </div>
                <div className="flex py-1 px-2 items-start gap-2 rounded border border-[#323232] bg-[#282828]">
                  <Image
                    src="/icons/bathtub.svg"
                    alt="bathrooms"
                    width={16}
                    height={16} />
                  <p className="text-[#B3B6BD] text-(length:--typography-font-sizes-1,12px) leading-[150%] font-normal font-inter">{listing.bathrooms}</p>
                </div>
              </div>
            </div>

          
          </LinkQP>
          </Suspense>
        </div>
      ))}
    </div>
  );
}

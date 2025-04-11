'use client';

import Link from "next/link";
import { FaBed } from "react-icons/fa";
import type { Listing } from "@/lib/types";
import ReactMarkdown from 'react-markdown';
import GcsImage from "./GCSImage";

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
            className="group relative flex flex-col overflow-hidden rounded-lg  bg-neutral-900"
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
      <div className="mb-8 flex h-32 w-full items-center justify-center rounded-md border-neutral-750 bg-neutral-900">
        <p className="text-neutral-200">No listings found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="mb-8 grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 xl:grid-cols-3">
      {listings.map((listing) => (
        <div
          key={listing.id}
          className="group relative flex flex-col overflow-hidden rounded-lg border-neutral-750 bg-neutral-900"
        >
          <Link href={`/listings/listing/${listing.id}`}>
            <div className="aspect-h-3 aspect-w-3 bg-gray-200 sm:aspect-none group-hover:opacity-75 sm:h-52">
              <GcsImage
                width={204}
                height={41}
                filename={listing.urls[0]}
                alt={listing.title}
                className="h-full w-full object-cover object-center sm:h-full sm:w-full"
              />
            </div>
            <div className="flex flex-1 flex-col space-y-2 p-4 hover:cursor-pointer">
              <h3 className="text-sm font-medium text-neutral-100">
                {listing.title}
              </h3>
              <div className="flex">
                <p className="mr-4 text-xs italic text-neutral-100">
                  {listing.date}
                </p>
                <FaBed className="mr-2" />
                <p className="mr-4 text-xs text-neutral-100">
                  {listing.rooms}
                </p>
                <span
                  className={`-mt-1 inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${listing.duration === "leasehold"
                      ? "bg-blue-50 text-blue-700 ring-blue-700/10"
                      : "bg-green-50 text-green-700 ring-green-600/20"
                    } ring-1 ring-inset`}
                >
                  {listing.duration}
                </span>
              </div>
              <ReactMarkdown>{listing.description.substring(0, 200) + "..."}</ReactMarkdown>
              <div className="flex flex-1 flex-col justify-end">
                <div className="flex justify-between">
                  <p className="text-base font-medium text-primary-300">
                    {listing.price}
                  </p>
                  <div className="flex justify-end">
                    {listing.sold ? (
                      <span className="mr-1 inline-flex items-center rounded-md bg-red-100 px-2.5 py-0.5 text-sm font-medium text-red-800">
                        Sold
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

"use client";
import { LinkQP } from "@/components/LinkQP";
import ListingDetails from "@/components/listing/details";
import { Icon } from "@clickhouse/click-ui";
import { Suspense } from "react";

export default function Listing({ listing }: { listing: any }) {
    return (
        <div className="px-20">
            <div className="py-6">
                <Suspense>
                <LinkQP href="/listings/search" className="flex text-sm text-primary-300 gap-4 font-normal">
                    <Icon color="yellow" name="arrow-left" /><p>Back</p> 
                </LinkQP>
                </Suspense>
            </div>
            <div>
            <ListingDetails {...listing} />
            {/* <ListingAnalytics {...listing} /> */}
            </div>
        </div>
    )
}

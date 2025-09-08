"use client"

import React, {useState, useEffect, Suspense} from "react";
import { Listing } from "@/lib/types";

import Image from "next/image";
import { Badge, Button, Text } from "@clickhouse/click-ui";
import PriceComparisonChart from "@/components/listing/PriceComparisonChart";
import Loading from "../Loading";
import ImageGallery from "./imageGallery";
import { fetchPriceComparison } from "@/app/actions/analyticsActions";
import { useRouter, useSearchParams } from "next/navigation";
import { customHref } from "../utils";

interface Prices {
    min_price: number;
    max_price: number;
}

export default function ListingDetails(listing: Listing) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [prices, setPrices] = useState<Prices>();
    const [metadata, setMetadata] = useState<any>();

    useEffect(() => {
        fetchPriceComparison(listing.postcode1).then
            ((result: any) => {
                setPrices(result.data[0]);
                setMetadata(result.metadata);
            });
    }, []);

    const handleNavigate = () => {
        const customParams = new URLSearchParams();
        customParams.set('town', listing.town);
        customParams.set('district', listing.district);
        customParams.set('postcode', listing.postcode1);
        const resolvedHref = customHref(searchParams, '/analytics', customParams);
        router.push(resolvedHref)
    }


    return (
        <div className="flex gap-8 pb-8">
            {/* Image gallery */}
            <ImageGallery {...listing} />
            
            {/* Product info */}
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                    <div><Badge state='success' text={listing.type} className="capitalize" /></div>
                    <p className="text-[#DCDCDC] text-(length:--typography-font-sizes-6,32px) leading-[150%] font-semibold font-inter">
                        {listing.title}</p>
                    <p className="text-[#FFF] text-(length:--typography-font-sizes-6,48px) leading-[normal] font-semibold font-[family-name:var(--typography-font-families-regular,'Test Söhne')]">
                        {listing.price_formatted}
                    </p>
                    <div className="flex pt-[24px] gap-2 items-start self-stretch">
                        <div className="flex flex-col py-1 px-2 w-[120px] items-start gap-2 rounded border border-[#323232] bg-[#282828]">
                            <Image
                                src="/icons/bed.svg"
                                alt="bed"
                                width={24}
                                height={24} />
                            <p className="text-[#B3B6BD] text-(length:--typography-font-sizes-1,12px) leading-[150%] font-normal font-inter">{listing.rooms} bedrooms</p>
                        </div>
                        <div className="flex flex-col py-1 px-2 w-[120px] items-start gap-2 rounded border border-[#323232] bg-[#282828]">
                            <Image
                                src="/icons/bathtub.svg"
                                alt="bathrooms"
                                width={24}
                                height={24} />
                            <p className="text-[#B3B6BD] text-(length:--typography-font-sizes-1,12px) leading-[150%] font-normal font-inter">{listing.bathrooms} bathrooms</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <Text size="lg" weight="bold">Description</Text>
                    <Text size="md" weight="normal">{listing.description}</Text>
                </div>

                <div className="flex gap-6">
                    <div className="h[40px] w-[200px]">
                        <Button
                            fillWidth
                            type="primary"
                            label='Book a visit' ></Button>
                    </div>
                    <div className="h[40px] w-[200px]">
                        <Button
                            fillWidth
                            type="secondary"
                            label='Calculate mortgage' ></Button>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <Text size="lg" weight="bold">Basic characteristics</Text>
                    <Text size="md" weight="normal" className="whitespace-pre-line">{listing.features.trim()}</Text>
                </div>
                <div className="flex flex-col gap-6">
                    <Text size="lg" weight="bold">Price comparison</Text>
                   {prices ? 
                   <PriceComparisonChart value={listing.price} min={prices.min_price} max={prices.max_price} metadata={metadata}  />: <Loading />}
                </div>
                <div className="flex gap-6">
                    <Button type="primary" className="h[40px] w-[200px]" label="View analytics for property area" onClick={handleNavigate}/>
                </div>
            </div> 
        </div>
    )

}

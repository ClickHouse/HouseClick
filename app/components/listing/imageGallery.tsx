"use client"
import { TabList, TabGroup, Tab, TabPanels, TabPanel } from "@headlessui/react";
import { Listing } from "@/lib/types";
import Image from "next/image";

export default function ImageGallery(listing: Listing) {

    return (
        <div>
            {/* Image gallery */}
            <div className="min-w-[480px]">
                <TabGroup as="div" className="flex flex-col gap-8">
                    {/* Image selector */}
                    <TabPanels className="h-[360px]">
                        {listing.images?.map((image) => (
                            <TabPanel key={image.id} >
                                <Image
                                    className="rounded-md"
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    style={{ width: "100%", height: "360px" }}
                                    src={image.src}
                                    alt={image.alt}
                                />
                            </TabPanel>
                        ))}
                    </TabPanels>
                    <TabList className="grid grid-cols-3 gap-6">
                        {listing.images?.map((image) => (
                            <Tab
                                key={image.id}
                                className="relative flex h-32 cursor-pointer items-center justify-center rounded-md text-sm font-medium uppercase text-neutral-100 hover:bg-gray-50"
                            >
                                <span className="absolute inset-0 overflow-hidden rounded-md">
                                    <Image
                                        width={0}
                                        height={0}
                                        sizes="100vw"
                                        style={{ width: "100%" }}
                                        src={image.src}
                                        alt=""
                                    />
                                </span>
                            </Tab>
                        ))}
                    </TabList>
                </TabGroup>
            </div>
        </div>
    )
}

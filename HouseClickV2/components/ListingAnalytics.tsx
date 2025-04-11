"use client";

import { Disclosure } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Listing } from "@/lib/types";
import Analytics from "@/components/Analytics";


function classNames(...classes: (string | boolean | undefined | null)[]): string {
    return classes.filter(Boolean).join(" ");
}

export default function ListingAnalytics(listing: Listing) {

    return (
        <section aria-labelledby="details-heading" className="mt-12">
            <div className="divide-y divide-gray-200 border-t">
                {/* <Analytics
                    filters={[
                        {
                            id: "postcode",
                            value: listing.postcode1,
                            name: `Postcode (${listing.postcode1})`,
                        },
                        {
                            id: "district",
                            name: `District (${listing.district
                                .toLowerCase()
                                .split(" ")
                                .map(
                                    (word) =>
                                        word.charAt(0).toUpperCase() + word.slice(1)
                                )
                                .join(" ")})`,
                            value: listing.district,
                        },
                        {
                            id: "town",
                            name: `Town (${listing.town
                                .toLowerCase()
                                .split(" ")
                                .map(
                                    (word) =>
                                        word.charAt(0).toUpperCase() + word.slice(1)
                                )
                                .join(" ")})`,
                            value: listing.town,
                        },
                    ]}
                />  */}
                 <Disclosure as="div">
                    {({ open }) => (
                        <>
                            <h3>
                                <Disclosure.Button className="group relative flex w-full items-center justify-between py-6 text-left">
                                    <span
                                        className={classNames(
                                            open ? "text-neutral-100" : "text-neutral-100",
                                            "text-sm font-medium"
                                        )}
                                    >
                                        Property Analytics
                                    </span>
                                    <span className="ml-6 flex items-center">
                                        {open ? (
                                            <MinusIcon
                                                className="block h-6 w-6 text-primary-300"
                                                aria-hidden="true"
                                            />
                                        ) : (
                                            <PlusIcon
                                                className="group- block h-6 w-6 text-primary-300"
                                                aria-hidden="true"
                                            />
                                        )}
                                    </span>
                                </Disclosure.Button>
                            </h3>
                            <Disclosure.Panel as="div" className=" prose-sm w-full pb-6">
                                <Analytics
                                    filters={[
                                        {
                                            id: "postcode",
                                            value: listing.postcode1,
                                            name: `Postcode (${listing.postcode1})`,
                                        },
                                        {
                                            id: "district",
                                            name: `District (${listing.district
                                                .toLowerCase()
                                                .split(" ")
                                                .map(
                                                    (word) =>
                                                        word.charAt(0).toUpperCase() + word.slice(1)
                                                )
                                                .join(" ")})`,
                                            value: listing.district,
                                        },
                                        {
                                            id: "town",
                                            name: `Town (${listing.town
                                                .toLowerCase()
                                                .split(" ")
                                                .map(
                                                    (word) =>
                                                        word.charAt(0).toUpperCase() + word.slice(1)
                                                )
                                                .join(" ")})`,
                                            value: listing.town,
                                        },
                                    ]}
                                />
                            </Disclosure.Panel>
                        </>
                    )}
                </Disclosure> 
            </div>
        </section>
    )
}

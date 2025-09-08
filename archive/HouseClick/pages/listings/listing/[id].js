import { getAllListings, getListing } from "../../../lib/listing";
import Footer from "@/components/navigation/footer";
import { Disclosure, Tab } from "@headlessui/react";
import { HeartIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import Header from "@/components/navigation/header";
import Head from "next/head";
import { FaBed } from "react-icons/fa";
import Analytics from "../../../components/analytics";
import Link from "next/link";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Listing({ listing }) {
  return (
    <div>
      <Head>
        <title>Listing</title>
      </Head>
      <Header />
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="py-6">
          <Link href="/listings/search" className="text-sm text-primary-300">
            &laquo; Back to listings
          </Link>
        </div>
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image gallery */}
          <Tab.Group as="div" className="flex flex-col-reverse">
            {/* Image selector */}
            <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
              <Tab.List className="grid grid-cols-4 gap-6">
                {listing.images.map((image) => (
                  <Tab
                    key={image.id}
                    className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-neutral-100 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                  >
                    {({ selected }) => (
                      <>
                        <span className="sr-only"> {image.name} </span>
                        <span className="absolute inset-0 overflow-hidden rounded-md">
                          <img
                            src={image.src}
                            alt=""
                            className="h-full w-full object-cover object-center"
                          />
                        </span>
                        <span
                          className={classNames(
                            selected ? "ring-indigo-500" : "ring-transparent",
                            "pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2"
                          )}
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </Tab>
                ))}
              </Tab.List>
            </div>

            <Tab.Panels className="aspect-h-1 aspect-w-1 w-full">
              {listing.images.map((image) => (
                <Tab.Panel key={image.id}>
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="h-full w-full object-cover object-center sm:rounded-lg"
                  />
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-neutral-100">
              {listing.name} ({listing.postcode1} {listing.postcode2})
            </h1>

            <div className="mt-3 flex items-center">
              <p className="mr-4 text-3xl tracking-tight text-primary-300">
                {listing.price}
              </p>
              <div>
                {listing.sold ? (
                  <span className="mr-1 inline-flex items-center rounded-md bg-red-100 px-2.5 py-0.5 text-sm font-medium text-red-800">
                    Sold
                  </span>
                ) : null}
              </div>
            </div>

            {/* Details */}
            <div className="mt-3">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  <time
                    className="mr-4 text-xs italic text-neutral-100"
                    dateTime={listing.date}
                  >
                    Available Since: {listing.date}
                  </time>
                  <FaBed className="mr-2" />
                  <p className="mr-4 text-xs text-neutral-100">
                    {listing.rooms}
                  </p>
                  <span
                    className={`-mt-1 inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                      listing.duration === "leasehold"
                        ? "bg-blue-50 text-blue-700 ring-blue-700/10"
                        : "bg-green-50 text-green-700 ring-green-600/20"
                    } ring-1 ring-inset`}
                  >
                    {listing.duration}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>

              <div
                className="space-y-6 text-base text-neutral-200"
                dangerouslySetInnerHTML={{ __html: listing.description }}
              />
            </div>

            <div className="sm:flex-col1 mt-10 flex">
              <button
                type="submit"
                className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-primary-300 px-8 py-3 text-base font-medium text-black hover:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:w-full"
              >
                Book viewing
              </button>
            </div>

            <section aria-labelledby="details-heading" className="mt-12">
              <div className="divide-y divide-gray-200 border-t">
                {listing.details.map((detail) => (
                  <Disclosure as="div" key={detail.name}>
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
                              {detail.name}
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
                        <Disclosure.Panel
                          as="div"
                          className="prose prose-sm pb-6"
                        >
                          <ul role="list">
                            {detail.items.map((item) => (
                              <li className="text-neutral-200" key={item}>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </div>
            </section>
          </div>
        </div>
        {/* Analytics */}
        <section aria-labelledby="details-heading" className="mt-12">
          <div className="divide-y divide-gray-200 border-t">
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
      </div>

      <Footer />
    </div>
  );
}

export async function getStaticProps({ params }) {
  return getListing(params.id).then((listing) => {
    return {
      props: {
        listing,
      },
    };
  });
}

export async function getStaticPaths() {
  const listings = getAllListings();
  return listings.then((paths) => {
    return {
      paths,
      fallback: false,
    };
  });
}

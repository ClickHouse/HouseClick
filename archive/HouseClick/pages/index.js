import Footer from "@/components/navigation/footer";
import Header from "@/components/navigation/header";
import Head from "next/head";
import Link from "next/link";

import { getNewListings } from "../lib/listing";

const ownerships = [
  {
    name: "Leasehold",
    href: "/listings/search?duration=leasehold",
    imageSrc:
      "https://images.unsplash.com/photo-1622374634302-b15fb01fcfde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1325&q=80",
  },
  {
    name: "Freehold",
    href: "/listings/search?duration=freehold",
    imageSrc:
      "https://images.unsplash.com/photo-1564357645071-9726b526a8f2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1351&q=80",
  },
];

const types = [
  {
    name: "Detached",
    href: "/listings/search?type=detached",
    imageSrc:
      "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
    imageAlt: "Detached houses",
    description:
      "The ultimate symbol of homeownership, offering unparalleled privacy, space, and freedom",
  },
  {
    name: "Semi-detached",
    href: "/listings/search?type=semi-detached",
    imageSrc:
      "https://images.unsplash.com/photo-1496320540980-6957e6d80966?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
    imageAlt: "Semi-detached houses",
    description:
      "A popular choice for homebuyers looking for the perfect blend of privacy, affordability, and community living. ",
  },
  {
    name: "Terraced",
    href: "/listings/search?type=terraced",
    imageSrc:
      "https://images.unsplash.com/photo-1510265236892-329bfd7de7a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    imageAlt: "Terraced houses",
    description:
      "A popular choice for homebuyers who are looking for a balance of affordability, convenience, and community living.",
  },
  {
    name: "Flats",
    href: "/listings/search?type=flat",
    imageSrc:
      "https://images.unsplash.com/photo-1614538568306-e1cc224a52f2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fGZsYXRzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=600&q=60",
    imageAlt: "Flats.",
    description:
      "An excellent option for homebuyers who are looking for convenience, low-maintenance living, and a more affordable option.",
  },
];

export async function getStaticProps() {
  return getNewListings().then((newProperties) => {
    return {
      props: {
        newProperties,
      },
    };
  });
}

export default function Main({ newProperties }) {
  return (
    <>
      <Head>
        <title>HouseClick | Find your dream home with a Click!</title>
      </Head>
      <div>
        <Header />
        {/* Hero section */}
        <div className="relative">
          {/* Decorative image and overlay */}
          <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1581453846805-3c72cb48be71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
              alt=""
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gray-900 opacity-60"
          />

          {/*navigation*/}
          <div className="relative mx-auto flex max-w-2xl flex-col px-24 pt-32 text-center sm:pt-64 lg:px-0">
            <h1 className="text-4xl font-bold tracking-tight text-white lg:text-6xl -ml-24">
              HouseClick
            </h1>
            <p className="mt-2 text-xl text-white -ml-24">
              The fastest place to buy and sell your home. Find your dream home with a Click!
            </p>

            <p className="mt-10 text-lg text-white -ml-24">
              Search properties for sale in the UK
            </p>
          </div>
          <div className="relative mx-auto max-w-2xl px-4 pb-64 pt-4">
            <form className="md:flex md:space-x-6" action="/listings/search">
              <div className="w-full">
                <input
                  type="search"
                  name="search"
                  id="search"
                  className="w-full rounded-md border border-neutral-725 bg-neutral-900 px-5 py-2 text-neutral-200  placeholder:text-gray-400 md:text-lg"
                  placeholder="e.g. 'York', 'NW3', 'NW3 5TY' or 'Waterloo Station'"
                  autoComplete="off"
                />
              </div>
              <button
                type="submit"
                className="text-md mt-2 inline-flex w-full items-center justify-center rounded-md bg-primary-300 px-5 py-2 font-semibold text-neutral-900 hover:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 md:mt-0 md:w-52 md:flex-initial"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        <main>
          {/* Promoted properties */}
          <section aria-labelledby="trending-heading">
            <div className="px-8 py-16 sm:py-24 lg:mx-auto lg:max-w-7xl lg:py-16">
              <div className="flex items-center justify-between">
                <h2
                  id="trending-heading"
                  className="text-2xl font-bold tracking-tight text-neutral-200"
                >
                  New listings
                </h2>
                <Link
                  href="/listings/search?sort=date:false"
                  className="hidden text-sm font-semibold text-primary-300 hover:underline sm:block"
                >
                  Browse all new listings
                  <span aria-hidden="true"> &rarr;</span>
                </Link>
              </div>
              <div className="relative mt-8">
                <div className="relative">
                  <ul
                    role="list"
                    className="grid grid-cols-2 gap-6 md:grid-cols-4"
                  >
                    {newProperties.map((listing) => (
                      <li key={listing.id} className="text-center">
                        <div className="group relative">
                          <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200">
                            <img
                              src={listing.imageSrc}
                              alt={listing.imageAlt}
                              className="h-full w-full object-cover object-center group-hover:opacity-75"
                            />
                          </div>
                          <div className="mt-6">
                            <h3 className="mt-1 font-semibold text-neutral-200 line-clamp-2">
                              <Link href={listing.href}>
                                <span className="absolute inset-0 " />
                                {listing.name}
                              </Link>
                            </h3>
                            <p className="mt-1 text-primary-300">
                              {listing.price}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-12 sm:hidden">
                <a
                  href="#"
                  className="text-sm font-semibold text-primary-300 hover:underline"
                >
                  See everything
                  <span aria-hidden="true"> &rarr;</span>
                </a>
              </div>
            </div>
          </section>

          {/* Ownership section */}
          <section
            aria-labelledby="category-heading"
            className="px-8 lg:mx-auto lg:max-w-7xl"
          >
            <div className="sm:flex sm:items-center sm:justify-between">
              <h2
                id="category-heading"
                className="text-2xl font-bold tracking-tight text-neutral-200"
              >
                Find a House by Ownership
              </h2>
              <Link
                href="/listings/search"
                className="hidden text-sm font-semibold text-primary-300 hover:underline sm:block"
              >
                Browse all properties
                <span aria-hidden="true"> &rarr;</span>
              </Link>
            </div>

            <div className="relative mt-8 box-content">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {ownerships.map((ownership) => (
                  <div className="text-center" key={ownership.name}>
                    <Link
                      key={ownership.name}
                      href={ownership.href}
                      className="relative flex h-80 w-full overflow-hidden rounded-lg p-6 hover:opacity-75 xl:w-auto"
                    >
                      <span aria-hidden="true" className="absolute inset-0">
                        <img
                          src={ownership.imageSrc}
                          alt=""
                          className="h-full w-full object-cover object-center"
                        />
                      </span>
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-gray-800 opacity-50"
                      />
                    </Link>
                    <span className="relative mt-auto text-center text-xl font-bold text-white">
                      {ownership.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 sm:hidden">
              <Link
                href="/listings/search"
                className="block text-sm font-semibold text-primary-300 hover:underline"
              >
                Browse all properties
                <span aria-hidden="true"> &rarr;</span>
              </Link>
            </div>
          </section>

          {/* Types section */}
          <section
            aria-labelledby="collection-heading"
            className="px-8 pt-16 lg:mx-auto lg:max-w-7xl"
          >
            <h2
              id="collection-heading"
              className="text-2xl font-bold tracking-tight text-neutral-200"
            >
              House by type
            </h2>
            <p className="mt-4 text-base text-neutral-200">
              Find your perfect home by type
            </p>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {types.map((collection) => (
                <Link
                  key={collection.name}
                  href={collection.href}
                  className="group block"
                >
                  <div
                    aria-hidden="true"
                    className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg lg:aspect-h-6 lg:aspect-w-5 group-hover:opacity-75"
                  >
                    <img
                      src={collection.imageSrc}
                      alt={collection.imageAlt}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-neutral-200">
                    {collection.name}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-200">
                    {collection.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
          <section
            aria-labelledby="collection-heading"
            className="mx-auto max-w-xl px-4 pt-24 sm:px-6 sm:pt-32 lg:max-w-7xl lg:px-8"
          ></section>
        </main>

        <Footer />
      </div>
    </>
  );
}

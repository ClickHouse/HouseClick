import { Fragment, useState } from "react";
import { Dialog, Popover, Tab, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

const navigation = {
  categories: [
    {
      name: "Freehold",
      featured: [],
      href: "/listings/search?ownership=freehold",
    },
    {
      name: "Leasehold",
      featured: [],
      href: "/listings/search?ownership=leasehold",
    },
    {
      name: "Detached",
      featured: [],
      href: "/listings/search?type=detached",
    },
    {
      name: "Semi-detached",
      featured: [],
      href: "/listings/search?type=semi-detached",
    },
    {
      name: "Terraced",
      featured: [],
      href: "/listings/search?type=terraced",
    },
    {
      name: "Flats",
      featured: [],
      href: "/listings/search?type=flat",
    },
  ],
  pages: [{ name: "Company", href: "/" }],
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile menu */}
      <Transition.Root show={mobileMenuOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40 lg:hidden"
          onClose={setMobileMenuOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-neutral-900 bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full flex-col overflow-y-auto bg-neutral-725/95 pb-12 shadow-xl">
                <div className="flex px-4 pb-2 pt-5">
                  <button
                    type="button"
                    className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-neutral-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Links */}
                <Tab.Group as="div" className="mt-2">
                  <div>
                    <Tab.List className="-mb-px grid grid-cols-1">
                      {navigation.categories.map((category) => (
                        <Tab
                          key={category.name}
                          className={({ selected }) =>
                            classNames(
                              selected
                                ? "border-primary-600 text-primary-300"
                                : "border-transparent text-neutral-200",
                              "flex-1 whitespace-nowrap px-1 py-4 text-base font-medium"
                            )
                          }
                        >
                          <Link href={category.href}>{category.name} </Link>
                        </Tab>
                      ))}
                    </Tab.List>
                  </div>
                </Tab.Group>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      {/* Navigation */}
      <header className="relative z-10">
        <nav aria-label="Top">
          {/* Secondary navigation */}
          <div className="fixed w-full bg-neutral-900 backdrop-blur-md backdrop-filter">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div>
                <div className="flex h-16 items-center justify-between">
                  {/* Logo (lg+) */}
                  <div className="hidden lg:flex lg:flex-1 lg:items-center">
                    <Link href="/">
                      <span className="sr-only">HouseClick</span>
                      <Image
                        src="/images/HouseClick.png"
                        height={41}
                        width={204}
                        alt="HouseClick"
                      />
                    </Link>
                  </div>
                  <div className="hidden h-full lg:flex">
                    {/* Flyout menus */}
                    <Popover.Group className="inset-x-0 bottom-0 px-4">
                      <div className="flex h-full justify-center space-x-8">
                        {navigation.categories.map((category) => (
                          <Popover key={category.name} className="flex">
                            {({ open }) => (
                              <>
                                <div className="relative flex">
                                  <Link
                                    href={category.href}
                                    className="relative z-10 flex items-center justify-center text-sm font-medium text-neutral-200 transition-colors duration-200 ease-out"
                                  >
                                    {category.name}
                                    <span
                                      className={classNames(
                                        open ? "bg-white" : "",
                                        "absolute inset-x-0 -bottom-px h-0.5 transition duration-200 ease-out"
                                      )}
                                      aria-hidden="true"
                                    />
                                  </Link>
                                </div>
                              </>
                            )}
                          </Popover>
                        ))}

                        {navigation.pages.map((page) => (
                          <a
                            key={page.name}
                            href={page.href}
                            className="flex items-center text-sm font-medium text-white"
                          >
                            {page.name}
                          </a>
                        ))}
                      </div>
                    </Popover.Group>
                  </div>
                  {/* Mobile menu and search (lg-) */}
                  <div className="flex flex-1 items-center lg:hidden">
                    <button
                      type="button"
                      className="-ml-2 p-2 text-white"
                      onClick={() => setMobileMenuOpen(true)}
                    >
                      <span className="sr-only">Open menu</span>
                      <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    {/* Search */}
                    <Link
                      href="/listings/search"
                      className="ml-2 p-2 text-white"
                    >
                      <span className="sr-only">Search</span>
                      <MagnifyingGlassIcon
                        className="h-6 w-6"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                  {/* Logo (lg-) */}
                  <Link href="/" className="lg:hidden">
                    <span className="sr-only">HouseClick</span>
                    <Image
                      src="/images/HouseClick.png"
                      height={144}
                      width={144}
                      alt="HouseClick"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

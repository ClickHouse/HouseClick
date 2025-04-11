'use client;'
import {
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

interface Category {
  name: string;
  featured: any[];
  href: string;
}

interface Page {
  name: string;
  href: string;
}

const navigation: { categories: Category[]; pages: Page[] } = {
  categories: [
    { name: "Freehold", featured: [], href: "/listings/search?ownership=freehold" },
    { name: "Leasehold", featured: [], href: "/listings/search?ownership=leasehold" },
    { name: "Detached", featured: [], href: "/listings/search?type=detached" },
    { name: "Semi-detached", featured: [], href: "/listings/search?type=semi-detached" },
    { name: "Terraced", featured: [], href: "/listings/search?type=terraced" },
    { name: "Flats", featured: [], href: "/listings/search?type=flat" },
  ],
  pages: [{ name: "Company", href: "/" }],
};

export default function Header() {

  return (
    <>
      {/* Navigation */}
      <header className="relative z-10">
        <nav aria-label="Top">
          <div className="fixed w-full bg-neutral-900 backdrop-blur-md backdrop-filter">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div>
                <div className="flex h-16 items-center justify-between">
                  <div className="hidden lg:flex lg:flex-1 lg:items-center">
                    <Link href="/">
                      <span className="sr-only">HouseClick</span>
                      <Image src="/images/HouseClick.png" height={41} width={204} alt="HouseClick" />
                    </Link>
                  </div>
                  <div className="hidden h-full lg:flex">
                      <div className="flex h-full justify-center space-x-8">
                        {/* {navigation.categories.map((category) => (
                          <Popover key={category.name} className="flex">
                            {({ open }) => (
                              <>
                                <div className="relative flex">
                                  <Link href={category.href} className="relative z-10 flex items-center justify-center text-sm font-medium text-neutral-200 transition-colors duration-200 ease-out">
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
                        ))} */}
                        {navigation.pages.map((page) => (
                          <a key={page.name} href={page.href} className="flex items-center text-sm font-medium text-white">
                            {page.name}
                          </a>
                        ))}
                      </div>
                  </div>
                  <div className="flex flex-1 items-center lg:hidden">
                    <Link href="/listings/search" className="ml-2 p-2 text-white">
                      <span className="sr-only">Search</span>
                      <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

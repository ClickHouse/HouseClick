"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";

export default function Main() {  
    // const listings = await getDefaultListings();
    const router = useRouter();

    // Function to handle search
    const handleSearch = (searchTerm: string) => {
        // Redirect to the search results page with the search term
        router.push(`/listings/search?q=${encodeURIComponent(searchTerm)}`);
    };

    return (
        <div className="relative">
        {/* Decorative image and overlay */}
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
          <Image
          

            src="https://images.unsplash.com/photo-1581453846805-3c72cb48be71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
            alt="UK Houses background"
            fill
            priority
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gray-900 opacity-60"
        />

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
          <SearchBar onSearch={handleSearch}/>
        </div>
      </div>
    )
}

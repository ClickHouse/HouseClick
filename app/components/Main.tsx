"use client";
import { useRouter, useSearchParams } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import { customHref } from "./utils";
import { Suspense } from "react";

function Search() {
  const router = useRouter();
  const searchParams = useSearchParams()

    // Function to handle search
    const handleSearch = (searchTerm: string) => {
    
      // Redirect to the search results page with the search term
      const searchQuery = new URLSearchParams();
      searchQuery.set('q', searchTerm);
      const resolvedHref = customHref(searchParams, `/listings/search`, searchQuery );
  
      router.push(resolvedHref);
    };
 
  return <SearchBar onSearch={handleSearch} />
}


export default function Main() {
 



  return (
<main>
    <div className="flex flex-col items-center justify-around bg-[url('/landing.jpg')] aspect-16/10 bg-contain bg-no-repeat">
      <div className="flex flex-col px-6 sm:pt-8 lg:px-0 ">
        <div className="flex flex-col gap-8 text-center">
          <p className="custom-title-1 font-inter">
            House click
            </p>
          {/* <div className="m-auto bg-[url('/house_click.png')] bg-no-repeat bg-[length: 100% 100%] w-[653px] h-[68px]"></div>
          <div className="m-auto bg-[url('/uk_properties.png')] bg-no-repeat bg-[length: 100% 100%] w-[229px] h-[19px]"></div> */}
          <p className="custom-title-2 font-inter">
            Find your dream home
          </p>
        </div>

      </div>
      <div className="px-24 gap-2 pb-12 pt-12 w-2/3">
          <Suspense ><Search /></Suspense>
      </div>
      <div></div>
    </div>
    </main>

  )
}

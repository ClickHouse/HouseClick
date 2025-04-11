'use client';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SearchFilter, SortItem, SearchResults, QueryState } from "@/lib/types";
import { filterConfig, sortItems } from "@/lib/searchConfig";
import SearchBar from "./SearchBar";
import FilterPanel from "./FilterPanel";
import ListingGrid from "./ListingGrid";
import Pagination from "@/components/Pagination";
// Import the server action
import { searchListings } from "@/app/actions/searchActions";

interface SearchResultsProps {
  initialState: QueryState;
  initialResults?: SearchResults;
}

export default function SearchResultsPanel({ initialState, initialResults }: SearchResultsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [isLoading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<SearchResults>(initialResults || { results: [], count: 0 });
  const [query, setQuery] = useState<QueryState>(initialState);

  // Effect to search when query changes, but not during sliding
  useEffect(() => {
    const is_sliding = query.filters.findIndex((filter: SearchFilter) => {
      return filter.type === "range" && filter.changing;
    });
    
    if (is_sliding === -1) {
      setLoading(true);
      console.log("Searching with query:", query);
      // Use the server action instead of direct DB call
      searchListings(query).then((data) => {
        setResults({ results: data.results, count: data.count });
        setLoading(false);
      });
    }
  }, [query]);

  // Update URL when query changes
  useEffect(() => {
    // Skip during the initial render or when filters are changing
    const is_sliding = query.filters.findIndex((filter: SearchFilter) => {
      return filter.type === "range" && filter.changing;
    });
    
    if (is_sliding !== -1) return;
    
    // Create a new URLSearchParams object
    const params = new URLSearchParams();
    
    // Add search term
    if (query.searchTerm) {
      params.set('q', query.searchTerm);
    }
    
    // Add sort
    params.set('sort', `${query.sort.column}:${query.sort.ascending}`);
    
    // Add page
    if (query.page > 1) {
      params.set('page', query.page.toString());
    }
    
    // Add filters
    query.filters.forEach(filter => {
      if (filter.type === 'check' && filter.options) {
        const checkedOptions = filter.options
          .filter(option => option.checked)
          .map(option => option.value);
        
        if (checkedOptions.length > 0) {
          params.set(filter.id, checkedOptions.join(','));
        }
      } else if (filter.type === 'range' && filter.values) {
        const [min, max] = filter.values;
        // Only add if different from default
        if (min !== filter.min || max !== filter.max) {
          params.set(filter.id, `${min},${max}`);
        }
      }
    });
    
    // Update the URL
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [query, pathname, router]);
  
  // Handler functions for updating query state
  const handleCheckFilter = (id: string, optionIdx: number): void => {
    const idx = query.filters.findIndex((filter) => filter.id === id);
    const checked = query.filters[idx]?.options?.[optionIdx]?.checked ?? false;
    
    const newFilters = query.filters.map((filter, filterIndex) => {
      if (filterIndex === idx) {
        return {
          ...filter,
          options: filter.options?.map((option, optionIndex) => {
            if (optionIndex === optionIdx) {
              return { ...option, checked: !checked };
            }
            return option;
          }),
        };
      }
      return filter;
    });
    
    setQuery({
      ...query,
      filters: newFilters,
      page: 1, // Reset to page 1 when filter changes
    });
  };

  const handleRangeFilterSlide = (id: string, values: number[]): void => {
    const idx = query.filters.findIndex((filter) => filter.id === id);
    
    const newFilters = query.filters.map((filter, filterIndex) => {
      if (filterIndex === idx) {
        return {
          ...filter,
          values: [values[0], values[1]] as [number, number],
          changing: true,
        };
      }
      return filter;
    });
    
    setQuery({
      ...query,
      filters: newFilters,
      page: 1,
    });
  };

  const handleRangeFilterEnd = (id: string): void => {
    const idx = query.filters.findIndex((filter) => filter.id === id);
    
    const newFilters = query.filters.map((filter, filterIndex) => {
      if (filterIndex === idx) {
        return { ...filter, changing: false };
      }
      return filter;
    });
    
    setQuery({
      ...query,
      filters: newFilters,
    });
  };

  const handleSearch = (searchTerm: string): void => {
    setQuery({
      ...query,
      searchTerm,
      page: 1,
    });
  };

  const handleSort = (sort: SortItem): void => {
    setQuery({
      ...query,
      sort,
      page: 1,
    });
  };

  const handlePageChange = (page: number): void => {
    setQuery({
      ...query,
      page,
    });
  };
  const num_pages = Math.ceil(results.count / 9);

  return (
    <>
      <SearchBar 
        // searchTerm={query.searchTerm}
        onSearch={handleSearch}
        // sort={query.sort}
        // sortItems={sortItems}
        // onSort={handleSort}
        // isLoading={isLoading}
        defaultValue={query.searchTerm}
      />

      <div className="pb-24 pt-12 lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
        <aside>
          <h2 className="sr-only">Filters</h2>
          <div className="hidden lg:block">
            <FilterPanel 
              filters={query.filters}
              onCheckFilter={handleCheckFilter}
              onRangeFilterSlide={handleRangeFilterSlide}
              onRangeFilterEnd={handleRangeFilterEnd}
            />
          </div>
        </aside>

        <section
          aria-labelledby="product-heading"
          className="mt-6 lg:col-span-2 lg:mt-0 xl:col-span-3"
        >
          <h2 id="product-heading" className="sr-only">
            Listings
          </h2>

          <h3 className="pb-3 text-lg font-medium tracking-tight text-neutral-100">
            {isLoading ? "Loading..." : `${results.count} results`}
          </h3>

          <ListingGrid listings={results.results} isLoading={isLoading} />
          
          <Pagination
            num_pages={num_pages}
            selected={query.page}
            onChange={handlePageChange}
          />
        </section>
      </div>
    </>
  );
}

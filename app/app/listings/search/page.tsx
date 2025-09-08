import { Suspense } from 'react';
import { SearchFilter, SortItem, QueryState } from "@/lib/types";
import SearchResultsPanel from '@/components/SearchResultsPanel';
import { filterConfig, sortItems } from '@/lib/searchConfig';
import { searchListings } from "@/app/actions/searchActions";
import Header from '@/components/Header';

// Parse query parameters from URL and transform into filter configuration
function parseParams(
  searchParams: {
    searchTerm?: string;
    sort?: string;
    page?: string;
    [key: string]: string | undefined;
  }
): QueryState {
  const filters: SearchFilter[] = filterConfig.map((filter) => {
    const paramValue = searchParams[filter.id];

    if (paramValue) {
      const values = paramValue.split(',');

      if (filter.type === "check") {
        return {
          ...filter,
          options: filter.options?.map((option) => ({
            ...option,
            checked: values.includes(option.value),
          })),
        };
      } else if (filter.type === "range" && values.length === 2) {
        return {
          ...filter,
          values: [
            parseIntWithRange(filter.min, filter.max, values[0], filter.min),
            parseIntWithRange(filter.max, filter.max, values[1], filter.max),
          ],
        };
      }
    }

    return filter;
  });

  // Parse sort parameter
  let sort: SortItem = sortItems[0]; // Default sort
  const sortParam = searchParams.sort;

  if (sortParam) {
    const sortOrder = sortParam.split(":");
    if (sortOrder.length === 2) {
      const [column, ascStr] = sortOrder;
      const ascending = ascStr === "true";

      const foundSort = sortItems.find(
        (item) => item.column === column && item.ascending === ascending
      );

      if (foundSort) {
        sort = foundSort;
      }
    }
  }
  const searchTerm = searchParams.q ?? '';
  const page = searchParams.page ? parseInt(searchParams.page, 10) || 1 : 1;

  return {
    filters,
    searchTerm,
    page,
    sort,
  };
}

// Helper function to parse integer with range checking
function parseIntWithRange(min: number | undefined, max: number | undefined, value: string, defaultValue: number | undefined): number {
  const i = parseInt(value);
  if (min && max && !isNaN(i) && i > min && i < max) {
    return i;
  }
  return defaultValue || 0;
}

export default async function SearchPage({
  searchParams
}: {
  searchParams: any;
}) {
  const queryState = parseParams(await searchParams);
  // Get initial results
  const initialResults = await searchListings(queryState);
  
  return (

      <div>
        <Header />
        <div className="px-20 py-6">
          <Suspense fallback={<div>Loading search results...</div>}>
          <SearchResultsPanel
            initialState={queryState}
            initialResults={initialResults}
          />
           </Suspense>
        </div>
       
      </div>
  );
}

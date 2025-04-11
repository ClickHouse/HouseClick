'use server';

import { SearchParams, Listing } from "@/lib/types";
import { search } from "@/lib/db";

export async function searchListings(query: SearchParams) {
  try {
    const results = await search(query);
    return {
      results,
      count: results.length
    };
  } catch (error) {
    console.error("Error searching listings:", error);
    return {
      results: [],
      count: 0
    };
  }
}

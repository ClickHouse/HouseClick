'use server';

import { AnalyticFilter } from "@/lib/types";
import { getAnalytics } from "@/lib/analytics";

export async function fetchAnalytics(filter: AnalyticFilter) {
  try {
    return await getAnalytics(filter);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return {};
  }
}

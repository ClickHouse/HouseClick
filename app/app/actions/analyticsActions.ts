'use server';

import { getMinMax, getPopularDistricts, getPopularPostcodes, getPopularTowns, getPriceEvolution, getHouseSoldOverTime, getTransactionsByOwnership, getPriceIncrease, getPriceByType, getSoldByType, getHouseSalesComparison } from "@/lib/analytics";
import { revalidatePath } from "next/cache";


export async function fetchPriceComparison(postcode1: string) { 
  try {
    return await getMinMax({ postcode1 });
  } catch (error) {
    console.error("Error fetching price comparison by postcode:", error);
    return {};
  }
}

export async function getDefaultDatabase() {
  return process.env.ANALYTICAL_DATABASE;
}

export async function getDefaultDataset() {
  return 'normal';
}

export async function invalidateCache() {
  revalidatePath('/analytics');
}

export async function fetchPopularTowns(district: string) {
  try {
    return await getPopularTowns(district);
  } catch (error) {
    console.error("Error fetching analytics", error);
    return {};
  }
}

export async function fetchPopularDistricts() {
  try {
    return await getPopularDistricts();
  } catch (error) {
    console.error("Error fetching analytics", error);
    return {};
  }
}
export async function fetchPopularPostcodes(town: string, district: string) {
  try {
    return await getPopularPostcodes(town, district);
  } catch (error) {
    console.error("Error fetching analytics", error);
    return {};
  }
}

export async function fetchPriceEvolution(params) {
  try {
    return await getPriceEvolution({ town: params.town, district: params.district, postcode: params.postcode });
  } catch (error) {
    console.error("Error fetching analytics", error);
    throw error;
  }
}


export async function fetchHouseSoldOverTime(params) {
  try {
    return await getHouseSoldOverTime({ town: params.town, district: params.district, postcode: params.postcode });
  } catch (error) {
    console.error("Error fetching analytics", error);
    throw error;
  }
}

export async function fetchTransactionsByOwnership(params) {
  try {
    return await getTransactionsByOwnership({ town: params.town, district: params.district, postcode: params.postcode });
  } catch (error) {
    console.error("Error fetching analytics", error);
    throw error;
  }
}

export async function fetchPriceIncrease(params) {
  try {
    return await getPriceIncrease({ town: params.town, district: params.district, postcode: params.postcode });
  } catch (error) {
    console.error("Error fetching analytics", error);
    throw error;
  }
}

export async function fetchPriceByType(params) {
  try {
    return await getPriceByType({ town: params.town, district: params.district, postcode: params.postcode });
  } catch (error) {
    console.error("Error fetching analytics", error);
    throw error;
  }
}

export async function fetchSoldByType(params) {
  try {
    return await getSoldByType({ town: params.town, district: params.district, postcode: params.postcode });
  } catch (error) {
    console.error("Error fetching analytics", error);
    throw error;
  }
}

export async function fetchHouseSalesComparison(params) {
  try {
    return await getHouseSalesComparison({ town: params.town, district: params.district, postcode: params.postcode });
  } catch (error) {
    console.error("Error fetching analytics", error);
    throw error;
  }
}


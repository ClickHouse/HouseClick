
export interface Listing {
  id: number;
  date: string;
  addr1: string;
  addr2: string | null;
  street: string;
  locality: string | null;
  town: string;
  district: string;
  county: string;
  postcode1: string;
  postcode2: string;
  type: string;
  duration: string;
  is_new: number;
  price: number;
  price_formatted: string;
  rooms: number;
  bathrooms: number;
  title: string;
  description: string;
  urls: string[];
  sold: boolean;
  sold_date: string | null;
  features: string;
  details?: Array<{ name: string, items: string[] }>;
  images?: Array<{ id: number, name: string, src: string, alt: string }>;
}

export interface SearchParams {
  searchTerm?: string;
  page: number;
  type?: string;
  filters: SearchFilter[];
  sort: SortItem;
}

export interface SearchResults {
  results: Listing[];
  count: number;
}

export interface QueryState {
  filters: SearchFilter[];
  searchTerm: string;
  page: number;
  sort: SortItem;
}

export interface SortItem {
  name: string;
  id: number;
  column: string;
  ascending: boolean;
}

export interface SearchFilter {
  id: string;
  name: string;
  type: 'check' | 'range';
  options?: { value: string; operator: string; checked: boolean, label: string }[]; // Add options for 'check' type
  values?: [number, number]; // Add values for 'range' type
  min?: number; // Add min for 'range' type
  max?: number; // Add max for 'range' type
  changing?: boolean; // Add changing for 'range' type
}


export interface AnalyticsData {
  sold_by_duration: any; 
  price_over_time: any; 
  sales_over_time: any; 
  stats: any; 
  price_change: any; 
  ranks: any; 
  sales_by_type: any; 
  price_by_type: any; 
  sold_by_period: any; 
  sales_by_day: any; 
}

export interface AnalyticFilter {
  id: string;
  value: string;
  name: string;
}

export interface ResultsMetadata {
  query: string;
  elapsedTime: number;
  queryString: string;
}

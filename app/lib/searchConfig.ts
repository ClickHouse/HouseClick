import { SearchFilter, SortItem } from "@/lib/types";

// Filter configuration - moved from the original component to a separate config file
export const filterConfig: SearchFilter[] = [
  {
    id: "price",
    name: "Price range",
    type: "range",
    min: 50000,
    max: 800000,
    values: [50000, 800000],
    changing: false,
  },
  
  {
    id: "type",
    name: "Property type",
    type: "check",
    options: [
      { value: "detached", label: "Detached", checked: false, operator: "eq" },
      {
        value: "semi-detached",
        label: "Semi-detached",
        checked: false,
        operator: "eq",
      },
      { value: "terraced", label: "Terraced", checked: false, operator: "eq" },
      { value: "flat", label: "Flat", checked: false, operator: "eq" },
      { value: "other", label: "Others", checked: false, operator: "eq" },
    ],
  },
  {
    id: "duration",
    name: "Ownership",
    type: "check",
    options: [
      {
        value: "leasehold",
        label: "Leasehold",
        checked: false,
        operator: "eq",
      },
      { value: "freehold", label: "Freehold", checked: false, operator: "eq" },
    ],
  },
  {
    id: "rooms",
    name: "Bedrooms",
    type: "check",
    options: [
      { value: "1", label: "1", checked: false, operator: "eq" },
      { value: "2", label: "2", checked: false, operator: "eq" },
      { value: "3", label: "3", checked: false, operator: "eq" },
      { value: "4", label: "4", checked: false, operator: "eq" },
      { value: "5", label: "5", checked: false, operator: "eq" },
      { value: "5", label: "5+", checked: false, operator: "gt" },
    ],
  },
];

// Sort configuration - moved from the original component
export const sortItems: SortItem[] = [
  { name: "Newest Listed", id: 1, column: "date", ascending: false },
  { name: "Oldest Listed", id: 2, column: "date", ascending: true },
  { name: "Lowest Price", id: 3, column: "price", ascending: true },
  { name: "Highest Price", id: 4, column: "price", ascending: false },
];

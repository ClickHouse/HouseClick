import { useState, useEffect } from "react";
import Immutable from "immutable";
import { List } from "immutable";
import Pagination from "../../components/pagination";
import Filter from "../../components/filter";
import Header from "@/components/navigation/header";
import Footer from "@/components/navigation/footer";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import Link from "next/link";
import { search } from "../../lib/listing";
import { FaBed } from "react-icons/fa";
import Head from "next/head";

function parseIntWithRange(min, max, value, defaultValue) {
  let i = parseInt(value);
  if (!isNaN(i) && i > min && i < max) {
    return i;
  }
  return defaultValue;
}

const filterConfig = [
  {
    id: "sold",
    name: "Availability",
    type: "check",
    options: [
      { value: "false", label: "Not Sold", checked: false, operator: "eq" }
    ]
  },
  {
    id: "price",
    name: "Price",
    type: "range",
    // currently static but could be dynamic
    min: 50000,
    max: 2000000,
    values: [50000, 2000000],
    changing: false,
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
    id: "type",
    name: "Type",
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

const sortItems = [
  { name: "Newest Listed", id: 1, column: "date", ascending: false },
  { name: "Oldest Listed", id: 2, column: "date", ascending: true },
  { name: "Lowest Price", id: 3, column: "price", ascending: true },
  { name: "Highest Price", id: 4, column: "price", ascending: false },
];

export default function Search(context) {
  const [isLoading, setLoading] = useState(false);
  const [results, setResults] = useState({ results: [], count: 0 });

  const [query, setQuery] = useState({
    filters: Immutable.fromJS(context.filters),
    searchTerm: context.search,
    page: 1,
    sort: context.sort,
  });

  useEffect(() => {
    // don't reload if slides being moved - reduce network requests
    const is_sliding = query.filters.findIndex((filter) => {
      return filter.get("type") === "range" && filter.get("changing");
    });
    if (is_sliding === -1) {
      setLoading(true);
      search(query).then((results) => {
        setResults(results);
        setLoading(false);
      });
    }
  }, [query]);

  const handleCheckFilter = (id, optionIdx) => {
    const idx = query.filters.findIndex((filter) => {
      return filter.get("id") === id;
    });
    const checked = query.filters.getIn([idx, "options", optionIdx, "checked"]);
    const newFilters = query.filters.setIn(
      [idx, "options", optionIdx, "checked"],
      !checked
    );
    setQuery({
      filters: newFilters,
      searchTerm: query.searchTerm,
      page: 1,
      sort: query.sort,
    });
  };

  const handleRangeFilterSlide = (id, values) => {
    const idx = query.filters.findIndex((filter) => {
      return filter.get("id") === id;
    });
    const newFilters = query.filters
      .setIn([idx, "values"], List(values))
      .setIn([idx, "changing"], true);
    setQuery({
      filters: newFilters,
      searchTerm: query.searchTerm,
      page: 1,
      sort: query.sort,
    });
  };

  const handleRangeFilterEnd = (id) => {
    const idx = query.filters.findIndex((filter) => {
      return filter.get("id") === id;
    });
    const newFilters = query.filters.setIn([idx, "changing"], false);
    setQuery({
      filters: newFilters,
      searchTerm: query.searchTerm,
      page: 1,
      sort: query.sort,
    });
  };

  const handleSearch = () => {
    setLoading(true);
    search(query).then((results) => {
      setResults(results);
      setLoading(false);
    });
  };

  const handleChangeSearchTerm = (event) => {
    setQuery({
      filters: query.filters,
      searchTerm: event.target.value,
      page: 1,
      sort: query.sort,
    });
  };

  const handleKeyDownOnSearch = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleSort = (event) => {
    setQuery({
      filters: query.filters,
      searchTerm: query.searchTerm,
      page: 1,
      sort: event,
    });
  };

  const handlePageChange = (page) => {
    setQuery({
      filters: query.filters,
      searchTerm: query.searchTerm,
      page: page,
      sort: query.sort,
    });
  };
  const num_pages = Math.ceil(results.count / 9);

  return (
    <div>
      {/* Navigation */}
      <Head>
        <title>Search</title>
      </Head>
      <Header />
      <div className="pt-20">
        <main className="mx-auto max-w-2xl px-4 lg:max-w-7xl lg:px-8">
          <div className="md:flex md:space-x-6">
            <input
              type="search"
              name="search"
              id="search"
              autoComplete={"off"}
              value={query.searchTerm}
              className="w-full rounded-md border border-neutral-725 bg-neutral-900 px-5 py-2 text-neutral-200  placeholder:text-gray-400 md:text-lg"
              placeholder="e.g. 'York', 'NW3', 'NW3 5TY' or 'Waterloo Station'"
              onChange={(event) => handleChangeSearchTerm(event)}
              onKeyDown={(event) => handleKeyDownOnSearch(event)}
            />
            <Filter
              items={sortItems}
              selected={query.sort}
              onChange={handleSort}
            />
            <button
              type="submit"
              onClick={handleSearch}
              className="text-md mt-2 inline-flex w-full items-center justify-center rounded-md bg-primary-300 px-5 py-2 font-semibold text-neutral-900 hover:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 md:mt-0 md:w-52 md:flex-initial"
            >
              Search
            </button>
          </div>

          {/* Filters */}
          <div className="pb-24 pt-12 lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
            <aside>
              <h2 className="sr-only">Filters</h2>
              <div className="hidden lg:block">
                <form className="space-y-10 divide-y divide-gray-200">
                  {query.filters.map((filter, filterIdx) => (
                    <div
                      key={filter.get("id")}
                      className={filterIdx === 0 ? null : "pt-10"}
                    >
                      <fieldset>
                        <legend className="block text-sm font-medium text-neutral-100">
                          {filter.get("name")}
                        </legend>
                        {filter.get("type") === "check" ? (
                          <div className="space-y-3 pt-6">
                            {filter.get("options").map((option, optionIdx) => (
                              <div
                                key={`${option.get("value")}-${optionIdx}`}
                                className="flex items-center"
                              >
                                <input
                                  id={`${filter.get("id")}-${option.get(
                                    "value"
                                  )}-${optionIdx}`}
                                  name={`${filter.get("id")}[]`}
                                  type="checkbox"
                                  checked={option.get("checked")}
                                  value={option.get("value")}
                                  className="h-4 w-4 rounded border-gray-300 text-primary-300 focus:ring-indigo-500"
                                  onChange={(_) =>
                                    handleCheckFilter(
                                      filter.get("id"),
                                      optionIdx
                                    )
                                  }
                                />
                                <label
                                  htmlFor={`${filter.get("id")}-${optionIdx}`}
                                  className="ml-3 text-sm text-neutral-200"
                                >
                                  {option.get("label")}
                                </label>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="range-slider-sidebar">
                            <RangeSlider
                              thumbsDisabled={[false, false]}
                              min={filter.get("min")}
                              max={filter.get("max")}
                              value={[
                                filter.get("values").get(0),
                                filter.get("values").get(1),
                              ]}
                              className="mt-6"
                              onThumbDragEnd={(_) =>
                                handleRangeFilterEnd(filter.get("id"))
                              }
                              onInput={(event) =>
                                handleRangeFilterSlide(filter.get("id"), event)
                              }
                            />
                            <div className="mt-3 flex justify-between">
                              <label className="text-sm text-neutral-200">{`£${filter
                                .get("values")
                                .get(0)
                                .toLocaleString("en-US")}`}</label>
                              <label className="text-sm text-neutral-200">{`£${filter
                                .get("values")
                                .get(1)
                                .toLocaleString("en-US")}`}</label>
                            </div>
                          </div>
                        )}
                      </fieldset>
                    </div>
                  ))}
                </form>
              </div>
            </aside>

            {/* Listings */}
            <section
              aria-labelledby="product-heading"
              className="mt-6 lg:col-span-2 lg:mt-0 xl:col-span-3"
            >
              <h2 id="product-heading" className="sr-only">
                Listings
              </h2>

              <h3 className="pb-3 text-lg font-medium tracking-tight text-neutral-100">
                {results.count} results
              </h3>

              <div className="mb-8 grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 xl:grid-cols-3">
                {results.results.map((listing) => (
                  <div
                    key={listing.id}
                    className="group relative flex flex-col overflow-hidden rounded-lg border border-neutral-750 bg-neutral-900"
                  >
                    <Link href={`/listings/listing/${listing.id}`}>
                      <div className="aspect-h-3 aspect-w-3 bg-gray-200 sm:aspect-none group-hover:opacity-75 sm:h-52">
                        <img
                          src={listing.imageSrc}
                          alt={listing.imageAlt}
                          className="h-full w-full object-cover object-center sm:h-full sm:w-full"
                        />
                      </div>
                      <div className="flex flex-1 flex-col space-y-2 p-4 hover:cursor-pointer">
                        <h3 className="text-sm font-medium text-neutral-100">
                          {listing.name}
                        </h3>
                        <div className="flex">
                          <p className="mr-4 text-xs italic text-neutral-100">
                            {listing.date}
                          </p>
                          <FaBed className="mr-2" />
                          <p className="mr-4 text-xs text-neutral-100">
                            {listing.rooms}
                          </p>
                          <span
                            className={`-mt-1 inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                              listing.duration === "leasehold"
                                ? "bg-blue-50 text-blue-700 ring-blue-700/10"
                                : "bg-green-50 text-green-700 ring-green-600/20"
                            } ring-1 ring-inset`}
                          >
                            {listing.duration}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-200">
                          {listing.description.substring(0, 200) + "..."}
                        </p>
                        <div className="flex flex-1 flex-col justify-end">
                          <p className="text-sm italic text-neutral-200">
                            {listing.options}
                          </p>
                          <div className="flex justify-between">
                            <p className="text-base font-medium text-primary-300">
                              {listing.price}
                            </p>
                            <div className="flex justify-end">
                              {listing.sold ? (
                                <span className="mr-1 inline-flex items-center rounded-md bg-red-100 px-2.5 py-0.5 text-sm font-medium text-red-800">
                                  Sold
                                </span>
                              ) : null}
                              <span className="inline-flex items-center rounded-md bg-yellow-100 px-2.5 py-0.5 text-sm font-medium text-yellow-800">
                                {listing.postcode ? listing.postcode : "NA"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
              <Pagination
                num_pages={num_pages}
                selected={query.page}
                onChange={handlePageChange}
              />
            </section>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const filters = filterConfig.map((filter) => {
    if (filter.id in context.query) {
      const values = context.query[filter.id].split(",");
      if (filter.type === "check") {
        return {
          ...filter,
          options: filter.options.map((option) => {
            return {
              ...option,
              checked: values.includes(option.value),
            };
          }),
        };
      } else if (filter.type === "range" && values.length === 2) {
        let newFilter = {
          ...filter,
          values: [
            parseIntWithRange(filter.min, filter.max, values[0], filter.min),
            parseIntWithRange(filter.min, filter.max, values[1], filter.max),
          ],
        };
        return newFilter;
      }
    }
    return filter;
  });
  let sort = undefined;

  if (context.query["sort"]) {
    const sortOrder = context.query["sort"].split(":");
    if (sortOrder.length === 2) {
      sort = sortItems.find((item) => {
        if (sortOrder[1] === "true") {
          return item.column === sortOrder[0] && item.ascending;
        }
        return item.column === sortOrder[0] && !item.ascending;
      });
    }
  }
  sort = sort ? sort : sortItems[0];
  return {
    props: {
      filters: filters,
      search: context.query.search ? context.query.search : "",
      sort: {
        column: sort.column,
        ascending: sort.ascending,
        id: sort.id,
      },
    },
  };
}

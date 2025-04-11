'use client';

import { SearchFilter } from "@/lib/types";
import "react-range-slider-input/dist/style.css";
import RangeSlider from "react-range-slider-input";

interface FilterPanelProps {
  filters: SearchFilter[];
  onCheckFilter: (id: string, optionIdx: number) => void;
  onRangeFilterSlide: (id: string, values: number[]) => void;
  onRangeFilterEnd: (id: string) => void;
}

export default function FilterPanel({ 
  filters, 
  onCheckFilter, 
  onRangeFilterSlide, 
  onRangeFilterEnd 
}: FilterPanelProps) {
  return (
    <form className="space-y-10 divide-y divide-gray-200">
      {filters.map((filter, filterIdx) => (
        <div
          key={filter.id}
          className={filterIdx === 0 ? undefined : "pt-4"}
        >
          <fieldset>
            <legend className="block text-sm font-medium text-neutral-100">
              {filter.name}
            </legend>
            {filter.type === "check" ? (
              <div className="space-y-3 pt-4 pb-8">
                {filter.options?.map((option, optionIdx) => (
                  <div
                    key={`${option.value}-${optionIdx}`}
                    className="flex items-center"
                  >
                    <input
                      id={`${filter.id}-${option.value}-${optionIdx}`}
                      name={`${filter.id}[]`}
                      type="checkbox"
                      checked={option.checked}
                      value={option.value}
                      className="h-4 w-4 rounded border-gray-300 text-primary-300 focus:ring-indigo-500"
                      onChange={(_) => onCheckFilter(filter.id, optionIdx)}
                    />
                    <label
                      htmlFor={`${filter.id}-${optionIdx}`}
                      className="ml-3 text-sm text-neutral-200"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3 pt-4 pb-8">
                <RangeSlider
                  thumbsDisabled={[false, false]}
                  min={filter.min}
                  max={filter.max}
                  value={[
                    (filter.values?.[0] ?? filter.min) || 0,
                    (filter.values?.[1] ?? filter.max) || 0,
                  ]}
                  className="mt-2"
                  onThumbDragEnd={() => onRangeFilterEnd(filter.id)}
                  onInput={(event: any) => 
                    onRangeFilterSlide(filter.id, event.detail)
                  }
                />
                <div className="mt-3 flex justify-between">
                  <label className="text-sm text-neutral-200">{`£${filter
                    .values && filter
                      .values[0].toLocaleString("en-US")}`}</label>
                  <label className="text-sm text-neutral-200">{`£${filter
                    .values && filter
                      .values[1]
                      .toLocaleString("en-US")}`}</label>
                </div>
              </div>
            )}
          </fieldset>
        </div>
      ))}
    </form>
  );
}

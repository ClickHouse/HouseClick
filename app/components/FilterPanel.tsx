'use client';

import { SearchFilter } from "@/lib/types";
import "react-range-slider-input/dist/style.css";
// import RangeSlider from "react-range-slider-input";
import { Checkbox, NumberField, Text } from "@clickhouse/click-ui";
import { RangeSlider } from "./RangeSlider";


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
    <div className="w-[200px]" >
    <form >
      {filters.map((filter, filterIdx) => (
        <div
          key={filter.id}
          className={filterIdx === 0 ? undefined : "pt-8"}
        >
          <fieldset>
          <span className="self-stretch">
            <p className="text-[#B3B6BD] text-(length:--typography-font-sizes-1,12px) leading-[150%] font-medium font-inter">{filter.name}</p></span>
            {filter.type === "check" ? (
              <div className="space-y-3 pt-4">
                {filter.options?.map((option, optionIdx) => (
                  <div
                    key={`${option.value}-${optionIdx}`}
                    className="flex items-center"
                  >
                    <Checkbox
                      label={option.label}
                      onCheckedChange={() => onCheckFilter(filter.id, optionIdx)}
                      value={option.value}
                      disabled={false}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3 pt-4">

                <RangeSlider id={filter.id} minPrice={filter
                      .values[0]} maxPrice={filter
                        .values[1]} onChange={onRangeFilterSlide}  onCommit={onRangeFilterEnd}/>
                <div className="w-[180px] flex items-center self-stretch gap-2 border rounded-sm border-[#323232] bg-[#2D2D2D] py-2 px-3">
                  <Text size="sm" color='muted' align="left">Min</Text>
                  <Text size="md" align="left" className="w-32">{`${filter
                    .values && filter
                      .values[0].toLocaleString("en-US")}`}</Text>
                  <Text size="sm" color='muted' align="right" >£</Text>
                </div>
                <div className="w-[180px] flex items-center self-stretch gap-2 border rounded-sm border-[#323232] bg-[#2D2D2D] py-2 px-3">
                  <Text size="sm" color='muted' align="left">Min</Text>
                  <Text size="md" align="left" className="w-32">{`${filter
                    .values && filter
                      .values[1].toLocaleString("en-US")}`}</Text>
                  <Text size="sm" color='muted' align="right" >£</Text>
                </div>
                
                {/* <RangeSlider
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
                    onRangeFilterSlide(filter.id, event)
                  }
                /> */}
               
              </div>
            )}
          </fieldset>
        </div>
      ))}
    </form>
    </div>
  );
}

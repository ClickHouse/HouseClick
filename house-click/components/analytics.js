import { RiMoneyPoundCircleLine } from "react-icons/ri";
import { BsFillHouseDoorFill } from "react-icons/bs";
import { AiOutlineLineChart } from "react-icons/ai";
import { MdOutlineHomeWork, MdOutlinePercent } from "react-icons/md";
import { TfiStatsUp } from "react-icons/tfi";
import { GiHouseKeys, GiHourglass } from "react-icons/gi";
import { GoCalendar } from "react-icons/go";
import useSwr from "swr";
import ReactECharts from "echarts-for-react";
import { Suspense, useState } from "react";
import theme from "../lib/theme";
import { time } from "echarts";
import Filter from "./filter";
import Loading from "./loading";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Analytics({ filters }) {
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);

  const { data, error, isLoading } = useSwr(
    `/api/analytics?filter=${selectedFilter.id}:${selectedFilter.value}`,
    fetcher
  );

  return (
    <div className="grid grid-cols-1 gap-y-4">
      <div className="flex justify-end">
        <Filter
          items={filters}
          selected={selectedFilter}
          onChange={setSelectedFilter}
        />
      </div>
      <Suspense fallback={Loading}>
        {data === undefined ? (
          <Loading />
        ) : (
          <div>
            <div className="mb-8 grid grid-cols-4 gap-x-6 gap-y-8">
              <div className="overflow-hidden rounded-xl border border-neutral-725 ">
                <div className="flex items-center gap-x-4 border-b border-neutral-700 bg-primary-300 p-3">
                  <RiMoneyPoundCircleLine
                    className="text-black"
                    size={"1.5em"}
                  />
                  <div className="text-sm font-medium leading-6 text-gray-900">
                    Price stats
                  </div>
                </div>
                <dl className="flex flex-col">
                  <div className="flex justify-evenly divide-gray-100 py-2">
                    <div className="flex flex-col items-center gap-x-2 ">
                      <p className="text-base">Area average</p>
                      {data ? (
                        <>
                          <p className="-mt-3 text-2xl">
                            £{data.ranks.filtered_avg.toLocaleString("en-US")}
                          </p>
                        </>
                      ) : null}
                    </div>
                    <p>vs</p>
                    <div className="flex flex-col items-center gap-x-2 ">
                      <p className="text-base">National average</p>
                      {data ? (
                        <>
                          <p className="-mt-3 text-2xl">
                            £{data.ranks.avg.toLocaleString("en-US")}
                          </p>
                        </>
                      ) : null}
                    </div>
                  </div>
                  <div className="-mt-6 flex  flex-col items-center gap-x-2 ">
                    <p className="text-s">Top 5% in area</p>
                    {data ? (
                      <>
                        <p className="-mt-3 text-3xl">
                          £{data.stats["95th"].toLocaleString("en-US")}
                        </p>
                      </>
                    ) : null}
                  </div>
                  <div className="-mt-6 flex flex-col items-center gap-x-2 ">
                    <p className="text-s">Top 1% in area</p>
                    {data ? (
                      <>
                        <p className="-mt-3 text-3xl">
                          £{data.stats["99th"].toLocaleString("en-US")}
                        </p>
                      </>
                    ) : null}
                  </div>
                </dl>
              </div>

              <div className="overflow-hidden rounded-xl border border-neutral-725 ">
                <div className="flex items-center gap-x-4 border-b border-neutral-700 bg-primary-300 p-3">
                  <MdOutlinePercent className="text-black" size={"1.5em"} />
                  <div className="text-sm font-medium leading-6 text-gray-900">
                    Price comparison
                  </div>
                </div>
                <dl className="-my-3 flex justify-center divide-y divide-gray-100">
                  <div className="flex h-96 w-full justify-between gap-x-4 py-3">
                    {data ? (
                      <ReactECharts
                        option={{
                          series: [
                            {
                              type: "gauge",
                              radius: "90%",
                              axisLine: {
                                lineStyle: {
                                  width: 20,
                                  color: [
                                    [0.25, "#ffffe8"],
                                    [0.5, "#feffba"],
                                    [0.75, "#fcff74"],
                                    [1.0, "#eef400"],
                                  ],
                                },
                              },
                              pointer: {
                                itemStyle: {
                                  color: "inherit",
                                },
                              },
                              axisTick: {
                                distance: -20,
                                length: 4,
                                lineStyle: {
                                  color: "#fff",
                                  width: 1,
                                },
                              },
                              axisLabel: {
                                color: "inherit",
                                distance: 25,
                                fontSize: 10,
                              },
                              detail: {
                                valueAnimation: true,
                                formatter: "{value} %",
                                color: "inherit",
                                fontSize: 30,
                              },
                              data: [
                                {
                                  value: data.ranks.quantile,
                                },
                              ],
                            },
                          ],
                        }}
                        notMerge={true}
                        lazyUpdate={true}
                        style={{ width: "100%", height: "100%" }}
                        theme={"ClickTheme"}
                      />
                    ) : null}
                  </div>
                </dl>
              </div>

              <div className="overflow-hidden rounded-xl border border-neutral-725 ">
                <div className="flex items-center gap-x-4 border-b border-neutral-700 bg-primary-300 p-3">
                  <GiHourglass className="text-black" size={"1.5em"} />
                  <div className="text-sm font-medium leading-6 text-gray-900">
                    Property Durations
                  </div>
                </div>
                <dl className="-my-3 flex justify-center divide-y divide-gray-100">
                  <div className="flex h-96 w-full justify-between gap-x-4 py-3">
                    {data ? (
                      <ReactECharts
                        option={{
                          tooltip: {
                            trigger: "item",
                          },
                          series: [
                            {
                              name: "Durations",
                              type: "pie",
                              radius: "90%",
                              data: data.sold_by_duration,
                              label: {
                                position: "inner",
                              },
                              emphasis: {
                                itemStyle: {
                                  shadowBlur: 10,
                                  shadowOffsetX: 0,
                                  shadowColor: "rgba(0, 0, 0, 0.5)",
                                },
                              },
                            },
                          ],
                        }}
                        notMerge={true}
                        lazyUpdate={true}
                        style={{ width: "100%", height: "100%" }}
                        theme={"ClickTheme"}
                      />
                    ) : null}
                  </div>
                </dl>
              </div>

              <div className="overflow-hidden rounded-xl border border-neutral-725 ">
                <div className="flex items-center gap-x-4 border-b border-neutral-700 bg-primary-300 p-3">
                  <GiHouseKeys className="text-black" size={"1.5em"} />
                  <div className="text-sm font-medium leading-6 text-gray-900">
                    Houses sold
                  </div>
                </div>
                <dl className="-my-3 flex justify-center divide-y divide-gray-100 px-2 py-1">
                  <div className="flex h-96 w-full justify-between gap-x-4 py-3">
                    {data ? (
                      <ReactECharts
                        option={{
                          tooltip: {
                            trigger: "axis",
                            axisPointer: {
                              // Use axis to trigger tooltip
                              type: "shadow", // 'shadow' as default; can also be 'line' or 'shadow'
                            },
                          },
                          color: ["#85cdf9", "#6c9af3", "#135be6", "#092e73"],
                          grid: {
                            left: "3%",
                            right: "4%",
                            bottom: "3%",
                            top: "6%",
                            containLabel: true,
                          },
                          yAxis: {
                            type: "value",
                          },
                          xAxis: {
                            type: "category",
                            data: ["Number Sold"],
                          },
                          series: data.sold_by_period.map((period, i) => {
                            return {
                              name: period.name,
                              type: "bar",
                              stack: "total",
                              label: {
                                show: true,
                                formatter: function (d) {
                                  return `last ${d.seriesName}`;
                                },
                              },
                              emphasis: {
                                focus: "series",
                              },
                              data: [period.value],
                              tooltip: {
                                valueFormatter: function (d) {
                                  return data.sold_by_period
                                    .slice(0, i + 1)
                                    .map((period) => period.value)
                                    .reduce(
                                      (partialSum, a) => partialSum + a,
                                      0
                                    );
                                },
                              },
                            };
                          }),
                        }}
                        notMerge={true}
                        lazyUpdate={true}
                        style={{ width: "100%", height: "100%" }}
                        theme={"ClickTheme"}
                      />
                    ) : null}
                  </div>
                </dl>
              </div>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-2 xl:gap-x-8">
              <div className="overflow-hidden rounded-xl border border-neutral-725 ">
                <div className="flex items-center gap-x-4 border-b border-neutral-700 bg-primary-300 p-3">
                  <RiMoneyPoundCircleLine
                    className="text-black"
                    size={"1.5em"}
                  />
                  <div className="text-sm font-medium leading-6 text-gray-900">
                    Price over time
                  </div>
                </div>
                <dl className="-my-3 divide-y divide-gray-100 px-2 py-2 text-sm leading-6">
                  <div className="flex h-96 w-full justify-between gap-x-4 py-3">
                    {data ? (
                      <ReactECharts
                        option={{
                          xAxis: {
                            type: "category",
                            data: data.price_over_time.x,
                            boundaryGap: false,
                          },
                          yAxis: {
                            type: "value",
                            axisLine: {
                              lineStyle: {
                                color: "#fff",
                              },
                            },
                            axisLabel: {
                              textStyle: {
                                color: "#fff",
                              },
                            },
                          },
                          series: [
                            {
                              name: "National average",
                              data: data.price_over_time.price,
                              smooth: true,
                              type: "line",
                              lineStyle: {
                                width: 0,
                              },
                              showSymbol: false,
                              areaStyle: {
                                opacity: 0.6,
                              },
                            },
                            {
                              name: `${selectedFilter.id} (${selectedFilter.value})`,
                              data: data.price_over_time.filtered_price,
                              type: "line",
                              smooth: true,
                            },
                          ],
                          tooltip: {
                            trigger: "axis",
                            axisPointer: {
                              type: "cross",
                              label: {
                                backgroundColor: "#6a7985",
                              },
                            },
                          },
                          grid: {
                            top: "6%",
                            left: "2%",
                            right: "6%",
                            bottom: "3%",
                            containLabel: true,
                          },
                        }}
                        notMerge={true}
                        lazyUpdate={false}
                        style={{ width: "100%", height: "100%" }}
                        theme={"ClickTheme"}
                      />
                    ) : null}
                  </div>
                </dl>
              </div>

              <div className="overflow-hidden rounded-xl border border-neutral-725">
                <div className="flex items-center gap-x-4 border-b border-neutral-700 bg-primary-300 p-3">
                  <BsFillHouseDoorFill className="text-black" size={"1.5em"} />
                  <div className="text-sm font-medium leading-6 text-gray-900">
                    Houses sold over time
                  </div>
                </div>
                <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                  <div className="flex h-96 w-full justify-between gap-x-4 py-3">
                    {data ? (
                      <ReactECharts
                        theme={"ClickTheme"}
                        option={{
                          xAxis: {
                            type: "category",
                            data: data.sales_over_time.x,
                            boundaryGap: false,
                            axisLabel: {
                              textStyle: {
                                color: "#fff",
                              },
                            },
                            axisLine: {
                              lineStyle: {
                                color: "#fff",
                                width: 1,
                              },
                            },
                          },
                          yAxis: {
                            type: "value",
                            axisLine: {
                              lineStyle: {
                                color: "#fff",
                                width: 1,
                              },
                            },
                            axisLabel: {
                              textStyle: {
                                color: "#fff",
                              },
                            },
                          },
                          series: [
                            {
                              name: `National average`,
                              data: data.sales_over_time.total,
                              smooth: true,
                              type: "bar",
                              lineStyle: {
                                width: 0,
                              },
                              axisLine: {
                                lineStyle: {
                                  color: "#fff",
                                },
                              },
                              showSymbol: false,
                            },
                            {
                              name: `${selectedFilter.id} (${selectedFilter.value})`,
                              data: data.sales_over_time.filtered_total,
                              smooth: true,
                              type: "line",
                            },
                          ],
                          tooltip: {
                            trigger: "axis",
                            axisPointer: {
                              type: "cross",
                              label: {
                                backgroundColor: "#6a7985",
                              },
                            },
                          },
                          grid: {
                            top: "6%",
                            left: "2%",
                            right: "6%",
                            bottom: "3%",
                            containLabel: true,
                          },
                        }}
                        notMerge={true}
                        lazyUpdate={true}
                        style={{ width: "100%", height: "100%" }}
                      />
                    ) : null}
                  </div>
                </dl>
              </div>

              <div className="overflow-hidden rounded-xl border border-neutral-725">
                <div className="flex items-center gap-x-4 border-b border-neutral-700 bg-primary-300 p-3">
                  <TfiStatsUp className="text-black" size={"1.5em"} />
                  <div className="text-sm font-medium leading-6 text-gray-900">
                    Price increases
                  </div>
                </div>
                <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                  <div className="flex h-96 w-full justify-between gap-x-4 py-3">
                    {data ? (
                      <ReactECharts
                        theme={"ClickTheme"}
                        option={{
                          tooltip: {
                            trigger: "axis",
                            axisPointer: {
                              type: "shadow",
                            },
                          },
                          axisPointer: [
                            {
                              label: {
                                color: "#fff",
                              },
                            },
                          ],
                          grid: {
                            left: "1%",
                            right: "1%",
                            bottom: "0%",
                            top: "0%",
                            containLabel: true,
                          },
                          xAxis: [
                            {
                              type: "value",
                              splitLine: {
                                lineStyle: {
                                  color: "#fff",
                                },
                              },
                              axisLine: {
                                lineStyle: {
                                  color: "#fff",
                                },
                              },
                              axisLabel: {},
                            },
                          ],
                          yAxis: [
                            {
                              type: "category",
                              axisTick: {
                                show: false,
                              },
                              data: data.price_change.map((change) =>
                                change.year > 1
                                  ? `${change.year} years`
                                  : `${change.year} year`
                              ),
                              axisLine: {
                                lineStyle: {
                                  color: "#fff",
                                },
                              },
                            },
                          ],
                          series: [
                            {
                              name: "National",
                              type: "bar",
                              label: {
                                show: true,
                                position: "inside",
                              },
                              emphasis: {
                                focus: "series",
                              },
                              data: data.price_change.map(
                                (change) => change.national
                              ),
                            },
                            {
                              name: `${selectedFilter.id} (${selectedFilter.value})`,
                              type: "bar",
                              stack: "Total",
                              label: {
                                show: true,
                              },
                              emphasis: {
                                focus: "series",
                              },
                              data: data.price_change.map(
                                (change) => change.regional
                              ),
                            },
                          ],
                        }}
                        notMerge={true}
                        lazyUpdate={true}
                        style={{ width: "100%", height: "100%" }}
                      />
                    ) : null}
                  </div>
                </dl>
              </div>

              <div className="overflow-hidden rounded-xl border border-neutral-725">
                <div className="flex items-center gap-x-4 border-b border-neutral-700 bg-primary-300 p-3">
                  <MdOutlineHomeWork className="text-black" size={"1.5em"} />
                  <div className="text-sm font-medium leading-6 text-gray-900">
                    House type distribution
                  </div>
                </div>
                <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                  <div className="flex h-96 w-full justify-between gap-x-4 py-3">
                    {data ? (
                      <ReactECharts
                        theme={"ClickTheme"}
                        option={{
                          radar: {
                            indicator: data.sales_by_type.map((type) => {
                              return {
                                name: type.type,
                                max:
                                  type.filtered_count > type.count
                                    ? type.filtered_count
                                    : type.count,
                              };
                            }),
                          },
                          tooltip: {
                            trigger: "axis",
                          },
                          series: [
                            {
                              name: `${selectedFilter.value} vs Natonal`,
                              type: "radar",
                              tooltip: {
                                trigger: "item",
                              },
                              areaStyle: {},
                              data: [
                                {
                                  value: data.sales_by_type.map((type) => {
                                    return type.filtered_count;
                                  }),
                                  name: `${selectedFilter.id} (${selectedFilter.value})`,
                                },
                                {
                                  value: data.sales_by_type.map((type) => {
                                    return type.count;
                                  }),
                                  name: "National",
                                },
                              ],
                            },
                          ],
                        }}
                        notMerge={true}
                        lazyUpdate={true}
                        style={{ width: "100%", height: "100%" }}
                      />
                    ) : null}
                  </div>
                </dl>
              </div>
            </div>
            <div className="mb-8 grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-1 xl:gap-x-8">
              <div className="overflow-hidden rounded-xl border border-neutral-725">
                <div className="flex items-center gap-x-4 border-b border-neutral-700 bg-primary-300 p-3">
                  <AiOutlineLineChart className="text-black" size={"1.5em"} />
                  <div className="text-sm font-medium leading-6 text-gray-900">
                    House type prices
                  </div>
                </div>
                <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                  <div className="flex h-96 w-full justify-between gap-x-4 py-3">
                    {data ? (
                      <ReactECharts
                        option={{
                          tooltip: {
                            trigger: "axis",
                          },
                          xAxis: {
                            scale: true,
                            logBase: 2,
                            type: "log",
                            axisLabel: {
                              formatter: function (value) {
                                return `£${Math.round(value).toLocaleString(
                                  "en-US"
                                )}`;
                              },
                            },
                            axisLine: {
                              lineStyle: {
                                color: "#fff",
                              },
                            },
                          },
                          yAxis: {
                            type: "category",
                            data: data.price_by_type.all.map(
                              (type) => type.name
                            ),
                            axisLine: {
                              lineStyle: {
                                color: "#fff",
                              },
                            },
                          },
                          grid: {
                            top: "6%",
                            left: "2%",
                            right: "6%",
                            bottom: "3%",
                            containLabel: true,
                          },
                          series: [
                            {
                              name: "National average",
                              type: "boxplot",
                              tooltip: {
                                trigger: "item",
                              },
                              itemStyle: {
                                color: "#fac858",
                                borderColor: "#fac858",
                              },
                              data: data.price_by_type.all,
                            },
                            {
                              name: `${selectedFilter.id} (${selectedFilter.value})`,
                              type: "boxplot",
                              tooltip: {
                                trigger: "item",
                              },
                              itemStyle: {
                                color: "#5470c6",
                              },
                              data: data.price_by_type.filtered,
                            },
                          ],
                        }}
                        notMerge={true}
                        lazyUpdate={true}
                        style={{ width: "100%", height: "100%" }}
                      />
                    ) : null}
                  </div>
                </dl>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-1 xl:gap-x-8">
              <div className="overflow-hidden rounded-xl border border-neutral-725">
                <div className="flex items-center gap-x-4 border-b border-neutral-700 bg-primary-300 p-3">
                  <GoCalendar className="text-black" size={"1.5em"} />
                  <div className="text-sm font-medium leading-6 text-gray-900">
                    Sales last year
                  </div>
                </div>
                <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                  <div className="flex h-96 w-full justify-between gap-x-4 py-3">
                    {data ? (
                      <ReactECharts
                        option={{
                          tooltip: {
                            position: "top",
                            formatter: function (p) {
                              return p.data[0] + ": " + p.data[1];
                            },
                          },
                          gradientColor: [
                            "#292924",
                            "#91B3F6",
                            "#135BE6",
                            "#092E73",
                          ],
                          visualMap: {
                            show: true,
                            min: 1,
                            max: data.sales_by_day.reduce(
                              (a, b) =>
                                Math.max(
                                  a,
                                  b.values.reduce(
                                    (a, b) => Math.max(a, b[1]),
                                    -Infinity
                                  )
                                ),
                              -Infinity
                            ),
                            calculable: true,
                            orient: "horizontal",
                            left: "0",
                            textStyle: {
                              color: "#fff",
                            },

                            top: data.sales_by_day.length * 160,
                          },
                          calendar: data.sales_by_day.map((year, i) => {
                            return {
                              top: 160 * i + 20,
                              range: year.year,
                              monthLabel: {
                                show: i === 0 ? true : false,
                                color: "#fff",
                              },
                              splitLine: {
                                show: true,
                                lineStyle: {
                                  color: "#fff",
                                  width: 1.5,
                                },
                              },
                            };
                          }),
                          series: data.sales_by_day.map((year, i) => {
                            return {
                              type: "heatmap",
                              coordinateSystem: "calendar",
                              calendarIndex: i,
                              data: year.values.map((value) => {
                                return [
                                  time.format(
                                    value[0],
                                    "{yyyy}-{MM}-{dd}",
                                    false
                                  ),
                                  value[1],
                                ];
                              }),
                            };
                          }),
                        }}
                        notMerge={true}
                        lazyUpdate={true}
                        style={{ width: "100%", height: "100%" }}
                      />
                    ) : null}
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}
      </Suspense>
    </div>
  );
}

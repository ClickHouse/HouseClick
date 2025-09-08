'use client';
import React, { useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import Loading from '@/components/Loading';
import DebugQuery from '@/components/DebugQuery';

export default function PriceByType({ data, metadata, debug }) {
    const [loading, setLoading] = useState(true);
    const chartRef = useRef(null);
    const colors = [
        '#FAFF69',
        '#FC74FF',
        '#74ACFF',
        '#74FFD5',
        '#FF7C74',
        '#74FF9B',
        '#FFE074',
        '#CF4B4B'
    ];
    const mappedColors = {};
    
    const options = {
        // backgroundColor: '#282828',
        animation: false,
        grid: {
            left: '24px',
            right: '42px',
            bottom: 50,
            containLabel: true
        },
        tooltip: {
            trigger: 'item',
            textStyle: {
                color: '#FAFF69',
                // fontWeight: 'bold',
                // fontSize: 16,
                // lineHeight: 24
            },
            backgroundColor: '#181818',
            borderWidth: 0
        },
        xAxis: {
            scale: true,
            logBase: 2,
            type: "log",
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#808691',
                    opacity: 0.3
                }
            },
            axisLabel: {
                formatter: function (value) {
                    return `£${Math.round(value).toLocaleString(
                        "en-US"
                    )}`;
                },
            },
            axisLine: {
                lineStyle: {
                    color: '#808691',
                    width: 1,
                    type: 'solid'
                }
            },
        },
        legend: {
            orient: 'horizontal',
            icon: 'circle',
            textStyle: {
                color: '#FFFFFFF',
                fontSize: 16
            },
            bottom: '5%',
        },
        yAxis: {
            type: "category",
            data: data.all.map(
                (type) => type.name
            ),
            axisLine: {
                lineStyle: {
                    color: '#808691',
                    width: 1,
                    type: 'solid'
                }
            },
        },
        series: [
            {
                name: "National average",
                type: "boxplot",
                tooltip: {
                    trigger: "item",
                },
                itemStyle: {
                    color: "#FAFF69",
                    borderColor: "#FAFF69",
                },
                data: data.all,
            },
            {
                name: `Area average`,
                type: "boxplot",
                tooltip: {
                    trigger: "item",
                },
                itemStyle: {
                    color: "#FC74FF",
                    borderColor: "#FC74FF",
                },
                data: data.filtered,
            },
        ]
    };

    const onMouseOver = () => {
        const echartsInstance = chartRef.current.getEchartsInstance();
        echartsInstance.dispatchAction({
            type: 'takeGlobalCursor',
            key: 'brush',
            brushOption: {
                brushType: 'lineX'
            }
        });
    };

    const onChartReady = (echarts) => {
        setLoading(false);
    };

    return (
        <div
            className='relative rounded-lg bg-slate-850 border border-[#414141] h-full justify-between flex flex-col rounded-lg bg-[#282828]'
            onMouseOver={onMouseOver}>
             {debug && <div className='flex justify-end items-center pt-2 px-2'><DebugQuery metadata={metadata} /></div>}
            <ReactECharts
                ref={chartRef}
                option={options}
                style={{ width: '100%',  height: '300px' }}
                lazyUpdate
                onChartReady={onChartReady}
            />
            {loading && <Loading height={36} />}
        </div>
    )

}

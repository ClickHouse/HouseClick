'use client';
import React, { useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import Loading from '@/components/Loading';
import DebugQuery from '@/components/DebugQuery';

export default function SoldByType({ data, metadata, debug  }) {
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
        color: colors,
        radar: {
            indicator: data.map((type) => {
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

        legend: {
            orient: 'horizontal',
            icon: 'circle',
            textStyle: {
                color: '#FFFFFFF',
                fontSize: 16
            },
            bottom: 0,
        },

        series: [
            {
                name: `Area vs Natonal`,
                type: "radar",
                tooltip: {
                    trigger: "item",
                },
                colorBy: "data",
                data: [
                    {
                        value: data.map((type) => {
                            return type.count;
                        }),
                        name: "National",
                    },
                    {
                        value: data.map((type) => {
                            return type.filtered_count;
                        }),
                        name: `Area`,
                    },
                    
                ],
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
            className='relative rounded-lg bg-slate-850 border border-[#414141] h-full justify-between flex flex-col rounded-lg bg-[#282828]'>
             {debug && <div className='flex justify-end items-center pt-2 px-2'><DebugQuery metadata={metadata} /></div>}
            <ReactECharts
                ref={chartRef}
                option={options}
                lazyUpdate={true}
                style={{ width: '100%', height: '300px' }}
                onChartReady={onChartReady}
            />
            {loading && <Loading height={36} />}
        </div>
    )

}

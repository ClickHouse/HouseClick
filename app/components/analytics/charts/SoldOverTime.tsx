'use client';
import React, { useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import isEqual from 'lodash/isEqual';
import Loading from '@/components/Loading';
import DebugQuery from '@/components/DebugQuery';

export default function SoldOverTime({ data, stack, fill, onSelect, metadata, debug  }) {
    const [loading, setLoading] = useState(true);

    const xAxis = Array.from(new Set(data.map((p) => p.year)));


    let values = {};
    values['National average'] = { name: "National average", data: [] };
    values['Area average'] = { name: "Area average", data: [] };
    data.forEach((p) => {
        values['National average'].data.push(p.count);
        if (p.filtered_count === null) {
            values['Area average'].data.push(0);
        } else {
            values['Area average'].data.push(p.filtered_count);
        }
    })

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
    const series = Object.values(values).map((series: { name: string; data: number[] }, i) => {
        let color = colors[i % colors.length];
        if (series.name in mappedColors) {
            color = mappedColors[series.name];
        } else {
            mappedColors[series.name] = color;
        }
        return stack
            ? {
                type: 'bar',
                name: series.name,
                data: series.data,
                color: color,
                stack: 'series'
            }
            : {
                type: 'bar',
                name: series.name,
                data: series.data,
                color: color
            };
    });

    const options = {
        // backgroundColor: '#282828',
        animation: false,
        grid: {
            left: '24px',
            right: '36px',
            containLabel: true
        },
        tooltip: {
            trigger: 'item',
            textStyle: {
                color: '#FAFF69',
                fontWeight: 'bold',
                fontSize: 16,
                lineHeight: 24
            },
            backgroundColor: '#181818',
            borderWidth: 0
        },
        xAxis: {
            show: true,
            type: 'category',
            data: xAxis
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
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#808691',
                    opacity: 0.3
                }
            }
        },
        series: series,
    
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

    const onBrushEnd = (params) => {
        if (params.areas.length > 0) {
            const echartsInstance = chartRef.current.getEchartsInstance();
            let start = echartsInstance.convertFromPixel(
                { xAxisIndex: 0 },
                params.areas[0].range[0]
            );
            let end = echartsInstance.convertFromPixel(
                { xAxisIndex: 0 },
                params.areas[0].range[1]
            );
            start = start > 0 ? start : 0;
            end = end < xAxis.length ? end : xAxis.length - 1;
            onSelect && onSelect(xAxis[start], xAxis[end]);
        }
    };

    const onChartReady = (echarts) => {
        setLoading(false);
    };

    return (
        <div
            className='relative rounded-lg bg-slate-850 border border-[#414141] h-full justify-between flex flex-col rounded-lg bg-[#282828]'
            onMouseOver={onMouseOver}>
            {debug ? <div className='flex justify-end items-center pt-2 px-2'><DebugQuery metadata={metadata} /></div>:<div className="h-[28px]"></div>}

            <ReactECharts
                ref={chartRef}
                option={options}
                style={{ width: '100%', height: '100%' }}
                lazyUpdate
                onChartReady={onChartReady}
                onEvents={{
                    brushEnd: onBrushEnd
                }}
                shouldSetOption={(prevProps, currentProps) => {
                    const shouldRender = !isEqual(prevProps, currentProps);
                    if (shouldRender) {
                        setLoading(true);
                    }

                    return shouldRender;
                }}
            />
            {loading && <Loading />}
        </div>
    );
}

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports', 'echarts'], factory);
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        factory(exports, require('echarts'));
    } else {
        // Browser globals
        factory({}, root.echarts);
    }
}(this, function (exports, echarts) {
    var log = function (msg) {
        if (typeof console !== 'undefined') {
            console && console.error && console.error(msg);
        }
    };
    if (!echarts) {
        log('ECharts is not Loaded');
        return;
    }
    echarts.registerTheme('ClickTheme', {
        color: [
            '#fac858',
            '#5470c6',
            '#91cc75',
            '#ee6666',
            '#73c0de',
            '#3ba272',
            '#fc8452',
            '#9a60b4',
            '#ea7ccc'
        ],
        backgroundColor: '#1f1f1c',
        textStyle: {},
        title: {
            textStyle: {
                color: '#ffffff'
            },
            subtextStyle: {
                color: '#cccfd3'
            }
        },
        line: {
            itemStyle: {
                borderWidth: '3'
            },
            lineStyle: {
                'width': '2'
            },
            symbolSize: '5',
            symbol: 'circle',
            smooth: false
        },
        radar: {
            itemStyle: {
                borderWidth: '3'
            },
            lineStyle: {
                width: '2'
            },
            symbolSize: '5',
            symbol: 'circle',
            smooth: false
        },
        bar: {
            itemStyle: {
                barBorderWidth: '0',
                barBorderColor: '#ccc'
            }
        },
        pie: {
            itemStyle: {
                borderWidth: '0',
                borderColor: '#ccc'
            }
        },
        scatter: {
            itemStyle: {
                borderWidth: '0',
                borderColor: '#ccc'
            }
        },
        boxplot: {
            itemStyle: {
                borderWidth: '1',
                borderColor: '#ccc'
            }
        },
        parallel: {
            itemStyle: {
                borderWidth: '0',
                borderColor: '#ccc'
            }
        },
        sankey: {
            itemStyle: {
                borderWidth: '0',
                borderColor: '#ccc'
            }
        },
        funnel: {
            itemStyle: {
                borderWidth: '0',
                borderColor: '#ccc'
            }
        },
        gauge: {
            itemStyle: {
                borderWidth: '0',
                borderColor: '#ccc'
            }
        },
        candlestick: {
            itemStyle: {
                color: '#eb5454',
                color0: '#47b262',
                borderColor: '#eb5454',
                borderColor0: '#47b262',
                borderWidth: 1
            }
        },
        graph: {
            itemStyle: {
                borderWidth: '0',
                borderColor: '#ccc'
            },
            lineStyle: {
                'width': 1,
                color: '#aaaaaa'
            },
            symbolSize: '5',
            symbol: 'circle',
            smooth: false,
            color: [
                '#5470c6',
                '#91cc75',
                '#fac858',
                '#ee6666',
                '#73c0de',
                '#3ba272',
                '#fc8452',
                '#9a60b4',
                '#ea7ccc'
            ],
            label: {
                color: '#eeeeee'
            }
        },
        map: {
            itemStyle: {
                areaColor: '#eee',
                borderColor: '#444',
                borderWidth: 0.5
            },
            label: {
                color: '#000'
            },
            emphasis: {
                itemStyle: {
                    areaColor: 'rgba(255,215,0,0.8)',
                    borderColor: '#444',
                    borderWidth: 1
                },
                label: {
                    color: 'rgb(100,0,0)'
                }
            }
        },
        geo: {
            itemStyle: {
                areaColor: '#eee',
                borderColor: '#444',
                borderWidth: 0.5
            },
            label: {
                color: '#000'
            },
            emphasis: {
                itemStyle: {
                    areaColor: 'rgba(255,215,0,0.8)',
                    borderColor: '#444',
                    borderWidth: 1
                },
                label: {
                    color: 'rgb(100,0,0)'
                }
            }
        },
        categoryAxis: {
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#6E7079'
                }
            },
            axisTick: {
                show: true,
                lineStyle: {
                    color: '#6E7079'
                }
            },
            axisLabel: {
                show: true,
                color: '#e3e3e3'
            },
            splitLine: {
                show: false,
                lineStyle: {
                    color: [
                        '#E0E6F1'
                    ]
                }
            },
            splitArea: {
                show: false,
                areaStyle: {
                    color: [
                        'rgba(250,250,250,0.2)',
                        'rgba(210,219,238,0.2)'
                    ]
                }
            }
        },
        valueAxis: {
            axisLine: {
                show: false,
                lineStyle: {
                    color: '#6E7079'
                }
            },
            axisTick: {
                show: false,
                lineStyle: {
                    color: '#6E7079'
                }
            },
            axisLabel: {
                show: true,
                color: '#6e7079'
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: [
                        '#2f2f2f'
                    ]
                }
            },
            splitArea: {
                show: false,
                areaStyle: {
                    color: [
                        'rgba(250,250,250,0.2)',
                        'rgba(210,219,238,0.2)'
                    ]
                }
            }
        },
        logAxis: {
            axisLine: {
                show: false,
                lineStyle: {
                    color: '#6E7079'
                }
            },
            axisTick: {
                show: false,
                lineStyle: {
                    color: '#6E7079'
                }
            },
            axisLabel: {
                show: true,
                color: '#6e7079'
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: [
                        '#2f2f2f'
                    ]
                }
            },
            splitArea: {
                show: false,
                areaStyle: {
                    color: [
                        'rgba(250,250,250,0.2)',
                        'rgba(210,219,238,0.2)'
                    ]
                }
            }
        },
        timeAxis: {
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#6E7079'
                }
            },
            axisTick: {
                show: true,
                lineStyle: {
                    color: '#6E7079'
                }
            },
            axisLabel: {
                show: true,
                color: '#6e7079'
            },
            splitLine: {
                show: false,
                lineStyle: {
                    color: [
                        '#E0E6F1'
                    ]
                }
            },
            splitArea: {
                show: false,
                areaStyle: {
                    color: [
                        'rgba(250,250,250,0.2)',
                        'rgba(210,219,238,0.2)'
                    ]
                }
            }
        },
        toolbox: {
            iconStyle: {
                borderColor: '#999999'
            },
            emphasis: {
                iconStyle: {
                    borderColor: '#666666'
                }
            }
        },
        legend: {
            textStyle: {
                color: '#6e7079'
            }
        },
        tooltip: {
            axisPointer: {
                lineStyle: {
                    color: '#cccccc',
                    width: '1'
                },
                crossStyle: {
                    color: '#cccccc',
                    width: '1'
                }
            }
        },
        timeline: {
            lineStyle: {
                color: '#dae1f5',
                width: 2
            },
            itemStyle: {
                color: '#a4b1d7',
                borderWidth: '0'
            },
            controlStyle: {
                color: '#a4b1d7',
                borderColor: '#a4b1d7',
                borderWidth: '0'
            },
            checkpointStyle: {
                color: '#316bf3',
                borderColor: '#ffffff'
            },
            label: {
                color: '#a4b1d7'
            },
            emphasis: {
                itemStyle: {
                    color: '#ffffff'
                },
                controlStyle: {
                    color: '#a4b1d7',
                    borderColor: '#a4b1d7',
                    borderWidth: '0'
                },
                label: {
                    color: '#a4b1d7'
                }
            }
        },
        visualMap: {
            color: [
                '#bf444c',
                '#d88273',
                '#f6efa6'
            ]
        },
        dataZoom: {
            handleSize: 'undefined%',
            textStyle: {}
        },
        markPoint: {
            label: {
                color: '#eeeeee'
            },
            emphasis: {
                label: {
                    color: '#eeeeee'
                }
            }
        }
    });
}));

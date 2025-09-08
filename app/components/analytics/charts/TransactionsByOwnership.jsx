import ReactECharts from 'echarts-for-react';
import Loading from '@/components/Loading';
import isEqual from 'lodash/isEqual';
import { useState } from 'react';
import DebugQuery from '@/components/DebugQuery';


export default function TransactionsByOwnership({ data, onClick, metadata, debug  }) {
  const [loading, setLoading] = useState(true);
  const options = {
    // backgroundColor: '#282828',
    animation: false,
    grid: {
      left: 0,
      right: 0
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
    legend: {
      bottom: '5%',
      textStyle: {
        color: '#FFFFFFF',
        fontSize: 18
      },
      icon: 'circle',
      icon: 'circle',

    },
    series: [
      {
        name: 'Distribution types',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: true,
        center: ['50%', '40%'],
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: false
          }
        },
        labelLine: {
          show: true
        },
        z: 2,
        itemStyle: {},
        color: [
          '#FAFF69',
          '#FC74FF',
          '#74ACFF',
          '#74FFD5',
          '#FF7C74',
          '#74FF9B',
          '#FFE074',
          '#CF4B4B'
        ],
        data: data
      }
    ]
  };

  const select = (params) => {
    onClick && onClick(params.name);
  };

  const onChartReady = (echarts) => {
    setLoading(false);
  };

  return (
    <div className='relative rounded-lg bg-slate-850 border border-[#414141] h-full rounded-lg bg-[#282828]'>
      {debug ? <div className='flex justify-end items-center pt-2 px-2'><DebugQuery metadata={metadata} /></div>:<div className="h-[28px]"></div>}
      <ReactECharts
        option={options}
        notMerge={true}
        style={{ width: '100%', height: '300px' }}
        lazyUpdate={true}
        onChartReady={onChartReady}
        onEvents={{ click: select }}
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

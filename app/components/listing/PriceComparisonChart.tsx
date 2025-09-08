import React from 'react';

import DebugQuery from '../DebugQuery';
import { useSearchParams } from 'next/navigation';

export default function PriceComparisonChart({ value, min, max, metadata }: {  value: number, min: number, max: number, metadata: any }) {

  const searchParams = useSearchParams();
  const debug = searchParams.get('debug') === 'true';
  const position = ((value - min) / (max - min)) * 100;


  return (
    <div className="w-full">
      {debug && <div className='flex justify-end items-center pb-2 px-2'><DebugQuery metadata={metadata} /></div>}
      <div className="relative mb-1">
        <div
          className="absolute bottom-full mb-1"
          style={{
            left: `${position}%`,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="bg-yellow-200 text-black px-3 py-1 rounded-md font-medium mb-1 whitespace-nowrap">
            This property
          </div>
          <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-yellow-200 mx-auto"></div>
        </div>
        <div className="h-2 w-full rounded-full bg-gradient-to-r from-green-400 via-yellow-500 to-red-500"></div>
        <div
          className="absolute top-0 w-4 h-4 bg-white rounded-full border-2 border-yellow-400"
          style={{
            left: `${position}%`,
            transform: 'translate(-50%, -25%)',
          }}
        ></div>
      </div>
      <div className="flex justify-between mt-2 text-sm">
        <div>Least expensive</div>
        <div>Most expensive</div>
      </div>
    </div>
  );
}


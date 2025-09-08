'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

import PriceOverTime from './PriceOverTime'
import SoldOverTime from './SoldOverTime'
import TransactionsByOwnership from './TransactionsByOwnership'
import PriceIncrease from './PriceIncrease'
import PriceByType from './PriceByType'
import SoldByType from './SoldByType'
import HouseSalesComparison from './HouseSalesComparison'

export default function ClientComponent({ type, data = [], options = {}, metadata, debug }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const current = new URLSearchParams(searchParams.toString())
  return {

    'priceOverTime': (
      <PriceOverTime
        data={data}
        stack={false}
        fill={false}
        onSelect={(min_date, max_date) => {
          current.set('min_date', min_date)
          current.set('max_date', max_date)
          router.push(`${pathname}?${current.toString()}`, { scroll: false })
        }}
        metadata={metadata}
        debug={debug}
      />
    ),
    'houseSoldOverTime': (
      <SoldOverTime
        data={data}
        stack={false}
        fill={false}
        onSelect={(min_date, max_date) => {
          current.set('min_date', min_date)
          current.set('max_date', max_date)
          router.push(`${pathname}?${current.toString()}`, { scroll: false })
        }}
        metadata={metadata}
        debug={debug}
      />
    ),
    'transactionsByOwnership': (
      <TransactionsByOwnership
        data={data}
        onClick={(name) => { console.log(name) }}
        metadata={metadata}
        debug={debug}
      />
    ),
    'priceIncrease': (
      <PriceIncrease
        data={data}
        metadata={metadata}
        debug={debug}
      />
    ),
    'priceByType': (
      <PriceByType
        data={data}
        metadata={metadata}
        debug={debug}
      />
    ),
    'soldByType': (
      <SoldByType
        data={data}
        metadata={metadata}
        debug={debug}
      />
    ),
    'houseSalesComparison': (
      <HouseSalesComparison
        data={data}
        metadata={metadata}
        debug={debug} />
    ),

  }[type]
}

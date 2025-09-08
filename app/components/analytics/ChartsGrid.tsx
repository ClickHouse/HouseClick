import { Suspense } from "react"
import Chart from "./Chart"
import Loading from "../Loading"
import { fetchPriceEvolution, fetchHouseSoldOverTime, fetchTransactionsByOwnership, fetchPriceIncrease, fetchPriceByType, fetchSoldByType, fetchHouseSalesComparison } from "@/app/actions/analyticsActions"



interface ChartsGridProps {
    town: string | null
    district: string | null
    postcode: string | null
    database: string | null
    dataset: string | null
    debug: boolean
}



export default function ChartsGrid(params: ChartsGridProps) {
    const { town, district, postcode, database, dataset } = params
    // const t = new Date().getTime().toString()
    const key = JSON.stringify(params)
    const valid = params.town || params.district || params.postcode
    return (
        valid?
        <div className=" grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-[360px] flex flex-col gap-1">
                <p className="text-[#FFF] text-(length:--typography-font-sizes-1,20px) leading-[150%] font-bold font-inter">House sales comparison</p>
                <Suspense key={key} fallback={<div className="h-full"><Loading /></div>}>
                    <Chart
                        type='houseSalesComparison'
                        getData={fetchHouseSalesComparison}
                        params={params}
                    />
                </Suspense>
               
            </div>
            <div className="h-[360px] flex flex-col gap-1">
                <p className="text-[#FFF] text-(length:--typography-font-sizes-1,20px) leading-[150%] font-bold font-inter">Price evolution over time</p>
                <Suspense key={key} fallback={<div className="h-full"><Loading /></div>}>
                    <Chart
                        type='priceOverTime'
                        getData={fetchPriceEvolution}
                        params={params}
                    />
                </Suspense>
               
            </div>
            <div className="h-[360px] flex flex-col gap-1">
                <p className="text-[#FFF] text-(length:--typography-font-sizes-1,20px) leading-[150%] font-bold font-inter">House sold over time</p>
                <Suspense key={key} fallback={<div className="h-full"><Loading /></div>}>
                    <Chart
                        type='houseSoldOverTime'
                        getData={fetchHouseSoldOverTime}
                        params={params}
                    />
                </Suspense>
            </div>
            <div className="h-[360px] flex flex-col gap-1">
                <p className="text-[#FFF] text-(length:--typography-font-sizes-1,20px) leading-[150%] font-bold font-inter">Transactions by ownership</p>
                <Suspense key={key} fallback={<div className="h-full"><Loading /></div>}>
                    <Chart
                        type='transactionsByOwnership'
                        getData={fetchTransactionsByOwnership}
                        params={params}
                    />
                </Suspense>
            </div>
            <div className="h-[360px] flex flex-col gap-1">
                <p className="text-[#FFF] text-(length:--typography-font-sizes-1,20px) leading-[150%] font-bold font-inter">Price change</p>
                <Suspense key={key} fallback={<div className="h-full"><Loading /></div>}>
                    <Chart
                        type='priceIncrease'
                        getData={fetchPriceIncrease}
                        params={params}
                    />
                </Suspense>
            </div>
            <div className="h-[360px] flex flex-col gap-1">
                <p className="text-[#FFF] text-(length:--typography-font-sizes-1,20px) leading-[150%] font-bold font-inter">Price by type</p>
                <Suspense key={key} fallback={<div className="h-full"><Loading /></div>}>
                    <Chart
                        type='priceByType'
                        getData={fetchPriceByType}
                        params={params}
                    />
                </Suspense>
            </div>
            {/* <div className="h-[360px] flex flex-col gap-4">
                <div className="flex gap-2">
                <p className="text-[#FFF] text-(length:--typography-font-sizes-1,20px) leading-[150%] font-bold font-inter">Sold by type</p>
                </div>
                <Suspense key={key} fallback={<div className="h-full"><Loading /></div>}>
                    <Chart
                        type='soldByType'
                        getData={fetchSoldByType}
                        params={params}
                    />
                </Suspense>
            </div> */}
            
        </div>:<div className="h-full text-center text-xl">Please select a district, town or post code</div>
    )
}


import React from "react";
import SelectArea from "./SelectArea";
import ChartsGrid from "./ChartsGrid";


interface AnalyticsProps {
    postcode?: string;
    district?: string;
    town?: string;
    database?: string;
    dataset?: string;
    debug?: boolean;
}

export default function Analytics({ postcode, district, town, database, dataset, debug }: AnalyticsProps) {
    const chartsKey = `${database}-${dataset}`;

    return (
        <div className="flex flex-col gap-12 w-full">
            <div className="flex flex-col gap-4 w-full pt-8">
                <SelectArea postCode={postcode} district={district} town={town} database={database} dataset={dataset} debug={debug} />
            </div>
            <ChartsGrid key={chartsKey} town={town} district={district} postcode={postcode} database={database} debug={debug} dataset={dataset} />
        </div>
    )
}

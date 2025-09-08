import Analytics from "@/components/analytics/index";
import Header from "@/components/Header";
import { getDefaultDatabase, getDefaultDataset } from "@/app/actions/analyticsActions";
import AnalyticsSwitch from "@/components/AnalyticsSwitch";
import AnalyticsAi from "@/components/analytics/ai/index";

export default async function AnalyticsPage(props: {
    searchParams?: Promise<{
        postcode?: string;
        district?: string;
        town?: string;
        database?: string;
        dataset?: string;
        debug?: string;
        analyticsAI?: string;
    }>;
}) {

    const searchParams = await props.searchParams;
    const postcode = searchParams?.postcode;
    const district = searchParams?.district;
    const town = searchParams?.town;
    const debug = searchParams?.debug == 'false' ? false : true;
    const analyticsAIChecked = searchParams?.analyticsAI == 'true' ? true : false;
    let database = searchParams?.database;
    let dataset = searchParams?.dataset;

    if (!database) {
        database = await getDefaultDatabase();
    }

    if (!dataset) {
        dataset = await getDefaultDataset();
    }

    return (
        <div>
            <Header />
            <div className="px-20 py-6">
                <div className="flex flex-col gap-4 w-full">
                    <span className="flex gap-8"><p className="text-[#FFF] text-(length:--typography-font-sizes-6,32px) leading-[150%] font-medium font-inter">UK property analytics</p>
                        <AnalyticsSwitch checked={analyticsAIChecked}  />
                    </span>
                </div>
                {analyticsAIChecked? 
                <AnalyticsAi postcode={postcode} district={district} town={town} database={database} dataset={dataset} debug={debug} />:
                <Analytics postcode={postcode} district={district} town={town} database={database} dataset={dataset} debug={debug} />
                }
                
            </div>
        </div>
    );
}

import Analytics from "@/components/analytics/index";
import AnalyticsAi from "@/components/analytics/ai/index";
import Header from "@/components/Header";
import { getDefaultDatabase, getDefaultDataset } from "@/app/actions/analyticsActions";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";

export default async function AnalyticsPage(props: {
    searchParams?: Promise<{
        postcode?: string;
        district?: string;
        town?: string;
        database?: string;
        dataset?: string;
        debug?: string;
    }>;
}) {

    const searchParams = await props.searchParams;
    const postcode = searchParams?.postcode;
    const district = searchParams?.district;
    const town = searchParams?.town;
    const debug = searchParams?.debug == 'true'? true :  false;
    let database = searchParams?.database;
    let dataset = searchParams?.dataset;

    if (!database) {
        database = await getDefaultDatabase();
    }

    if (!dataset) {
        dataset = await getDefaultDataset();
    }
    // Where CopilotKit will proxy requests to. If you're using Copilot Cloud, this environment variable will be empty.
    const runtimeUrl = process.env.NEXT_PUBLIC_COPILOTKIT_RUNTIME_URL
    // When using Copilot Cloud, all we need is the publicApiKey.
    const publicApiKey = process.env.NEXT_PUBLIC_COPILOT_API_KEY;

    return (
        <CopilotKit
      runtimeUrl={runtimeUrl}
      publicApiKey={publicApiKey}
    >
        <div>
            
            <div>
                <AnalyticsAi postcode={postcode} district={district} town={town} database={database} dataset={dataset} debug={debug} />
                {/* <Analytics postcode={postcode} district={district} town={town} database={database} dataset={dataset} debug={debug} /> */}
            </div>
        </div>
        </CopilotKit>
    );
}

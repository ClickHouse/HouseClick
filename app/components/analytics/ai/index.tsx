
"use client";
import React, { useEffect } from "react";
import ChartsGrid from "./ChartsGrid";
import { useCopilotChat, useCopilotAction, CatchAllActionRenderProps } from "@copilotkit/react-core";
import { CopilotSidebar, useCopilotChatSuggestions } from "@copilotkit/react-ui";
import { DefaultToolRender } from "./DefaultToolRenderer";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";
import "./copilotkit.css";
import { CopilotKitCSSProperties } from "@copilotkit/react-ui";


interface AnalyticsProps {
    postcode?: string;
    district?: string;
    town?: string;
    database?: string;
    dataset?: string;
    debug?: boolean;
}

// Where CopilotKit will proxy requests to. If you're using Copilot Cloud, this environment variable will be empty.
const runtimeUrl = process.env.NEXT_PUBLIC_COPILOTKIT_RUNTIME_URL
// When using Copilot Cloud, all we need is the publicApiKey.
const publicApiKey = process.env.NEXT_PUBLIC_COPILOT_API_KEY;

export default function Analytics(analyticsProps: AnalyticsProps) {
    return (
        <CopilotKit
            runtimeUrl={runtimeUrl}
            publicApiKey={publicApiKey}
        >
            <main className="pt-8">
                <CopilotSidebar
                    Header={SideBarHeader}
                    // Input={SideBarInput}
                    clickOutsideToClose={true}
                    defaultOpen={true}
                    instructions="You are a helpful assistant that helps the user analyze the UK real estate market. You can help them generate charts, analyze data, and provide insights. For the charts generation, make sure to keep title below 30 characters."
                    labels={{
                        title: "Popup Assistant",
                        initial: "👋 Hi, there! I'm here to help you analyze the UK real estate market."
                    }}
                ><MainContent {...analyticsProps} /></CopilotSidebar>
            </main>
        </CopilotKit>
    )
}

function SideBarHeader() {
    const { reset } = useCopilotChat();
    return (
        <div className="flex justify-between p-4">
            <p className="text-white content-center font-inter font-bold text-lg">Explorer assistant</p>
            <button
                className="px-6 py-3 hover:cursor-pointer text-[#FAFF69]"
                onClick={() => reset()}
            >
                Clear
            </button>
        </div>
    );
}

function MainContent({ postcode, district, town, database, dataset, debug }: AnalyticsProps) {
    const { mcpServers, setMcpServers } = useCopilotChat();

    useEffect(() => {
        setMcpServers([
            // Add any initial MCP servers here, find more at https://mcp.composio.dev or https://actions.zapier.com!
            {
                // Try a sample MCP server at https://mcp.composio.dev/
                endpoint: process.env.NEXT_PUBLIC_MCP_ENDPOINT || "http://localhost:8000/sse",
            },
        ]);
    }, []);

    // 🪁 Copilot Suggestions: https://docs.copilotkit.ai/guides/copilot-suggestions
    useCopilotChatSuggestions({
        maxSuggestions: 0,
        instructions: "Give the user a short and concise suggestion of charts they can generate based on the UK real estate transaction dataset.",
    })

    // 🪁 Catch-all Action for rendering MCP tool calls: https://docs.copilotkit.ai/guides/generative-ui?gen-ui-type=Catch+all+renders
    useCopilotAction({
        name: "*",
        render: ({ name, status, args, result }: CatchAllActionRenderProps<[]>) => (
            <DefaultToolRender status={status} name={name} args={args} result={result} />
        ),
    });

    useCopilotAction({
        name: "clearContext",
        description: "Clear the context of the chat.",
        handler: async () => {
            const { reset } = useCopilotChat();
            reset();
        }
    });

    const classes = {
        wrapper: "w-full flex flex-col transition-colors duration-300",
        container: "backdrop-blur-md p-8 rounded-2xl shadow-xl max-w-2xl w-full",
        server: "p-4 rounded-xl relative group hover:bg-white/20 transition-all",
        deleteButton: "absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center",
        input: "bg-white/20 p-4 rounded-xl relative group hover:bg-white/30 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500",
        submitButton: "w-full p-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 transition-all"
    }

    return (

        <div className={classes.wrapper}>
                <ChartsGrid town={town} district={district} postcode={postcode} database={database} debug={debug} dataset={dataset} />
        </div>

    )

}

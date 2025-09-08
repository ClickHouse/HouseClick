

"use client"
import { Icon } from "@clickhouse/click-ui"
import Link from "next/link"
import { usePathname, useSearchParams } from 'next/navigation';

export default function DebugIcon() {

    const pathname = usePathname();
    const searchParams = useSearchParams();

    const isDebug = searchParams.get('debug') === 'true';

    return (
        <Link
            href={{
                pathname: pathname,
                query: { ...Object.fromEntries(searchParams), debug: isDebug? "false": "true" },
            }}
        ><Icon name="lightening" size="xl" color="#FAFF69" /></Link>
    )
}

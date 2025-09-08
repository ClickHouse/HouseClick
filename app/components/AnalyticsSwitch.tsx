

"use client"
import { Switch } from "@clickhouse/click-ui"
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

interface AnalyticsSwitchProps {
    checked: boolean
}

export default function AnalyticsSwitch({ checked }: AnalyticsSwitchProps) {

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    const onCheckedChange = (checked: boolean) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('analyticsAI', checked ? 'true' : 'false');
        router.push(`${pathname}?${params.toString()}`);
    }

    return (
        <Switch
            checked={checked}
            dir="end"
            orientation="horizontal"
            label="Build your own"
            onCheckedChange={onCheckedChange}
        />
    )
}

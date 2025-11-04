"use client";

import { Button, Select, SelectOptionListItem, Switch, Icon, IconButton, Popover, Title, Checkbox, Text } from "@clickhouse/click-ui";
import { fetchPopularDistricts, fetchPopularPostcodes, fetchPopularTowns, invalidateCache } from "@/app/actions/analyticsActions";
import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { customHref } from "../utils";
import DebugIcon from "../DebugIcon";
import Image from "next/image";


interface SelectAreaProps {
    postCode?: string;
    district?: string;
    town?: string;
    database?: string;
    dataset?: string;
    debug?: boolean;

}

export default function SelectArea({ postCode, district, town, database, dataset, debug }: SelectAreaProps) {

    const router = useRouter();
    const searchParams = useSearchParams();
    const [towns, setTowns] = useState<Array<SelectOptionListItem>>([]);
    const [districts, setDistricts] = useState<Array<SelectOptionListItem>>([]);
    const [postcodes, setPostcodes] = useState<Array<SelectOptionListItem>>([]);


    const [selectedPostcode, setSelectedPostcode] = useState<string | null>(postCode || null);
    const [selectedDistrict, setSelectedDistrict] = useState<string | null>(district || null);
    const [selectedTown, setSelectedTown] = useState<string | null>(town || null);


    const createQueryString = useCallback(
        (data: Array<{ key: string; value: string }>) => {
            const params = new URLSearchParams(searchParams.toString());
            data.forEach(({ key, value }) => {
                params.set(key, value);
            });

            return params.toString();
        },
        [searchParams]
    )


    const onViewAnalytics = (town: string | null, district: string | null, postcode: string | null) => {
        const queryParams = new URLSearchParams(Array.from(searchParams.entries()));

        if (town) {
            queryParams.set('town', town);
        }
        if (district) {
            queryParams.set('district', district);
        }
        if (postcode) {
            queryParams.set('postcode', postcode);
        }
        const resolvedHref = customHref(searchParams, `/analytics`, queryParams);
        router.replace(resolvedHref);
    }

    useEffect(() => {
        fetchPopularTowns(selectedDistrict).then((results: { data: any }) => setTowns(results?.data?.map((item) => { return { value: item.town, label: item.town } })))
    }, [selectedDistrict]);

    useEffect(() => {
        fetchPopularDistricts().then((results: { data: any }) => setDistricts(results?.data?.map((item) => { return { value: item.district, label: item.district } })))
    }, [database]);

    useEffect(() => {
        fetchPopularPostcodes(selectedTown, selectedDistrict).then((results: { data: any }) => setPostcodes(results?.data?.map((item) => { return { value: item.postcode1, label: item.postcode1 } })))
    }, [selectedTown]);



    const handleDatabaseChange = (value: string) => {
        console.log("handleDatabaseChange", value)
        
        if (value == 'clickhouse') {
            // invalidateCache()
            router.replace('/analytics?' + createQueryString([{"key": 'database', "value": "clickhouse"}, {"key": 't', "value": new Date().getTime().toString()}]));
        } else {
            // invalidateCache()
            const val = value == 'fdw' ? 'fdw' : 'postgres'
            router.replace('/analytics?' + createQueryString([{"key": 'database', "value": val}, {"key": 't', "value": new Date().getTime().toString()}]));
        }
    }

    const labelSwitchDatabase = () => {
        if (database === 'postgres') {
            return (<Image
                        src="/icons/postgres.svg"
                        alt="postgres"
                        width={24}
                        height={24} />
                    )
        } else if (database === 'clickhouse') {
            return (<Image
                src="/icons/clickhouse.svg"
                alt="clickhouse"
                width={24}
                height={24} />
            )
        }

    }

    const handleDatasetChange = (value: string) => {
        // invalidateCache()
        if (value == 'large') {
            // invalidateCache()
            router.replace('/analytics?' + createQueryString([{"key": 'dataset', "value": "large"}, {"key": 't', "value": new Date().getTime().toString()}]));
        } else {
            // invalidateCache()
            router.replace('/analytics?' + createQueryString([{"key": 'dataset', "value": "normal"}, {"key": 't', "value": new Date().getTime().toString()}]));
        }
    }

    const handleDebug = (value: string) => {
        if (value == 'true') {
            router.replace('/analytics?' + createQueryString([{"key": 'debug', "value": "true"}]));
        } else {
            router.replace('/analytics?' + createQueryString([{"key": 'debug', "value": "false"}]));
        }
    }


    const labelSwitchDataset = () => {
        if (dataset === 'normal') {
            return (<Image
                        src="/icons/medium.png"
                        alt="medium"
                        width={24}
                        height={24} />
                    )
        } else if (dataset === 'large') {
            return (<Image
                src="/icons/xl.png"
                alt="xl"
                width={24}
                height={24} />
            )
        }

    }

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex gap-4">
                <Select
                    label="Select district"
                    value={selectedDistrict}
                    defaultValue="All"
                    options={districts}
                    onSelect={(district) => {
                        setSelectedDistrict(district);
                        setSelectedTown('All');
                        setSelectedPostcode('All')
                    }} />
                <Select
                    label="Select town"
                    value={selectedTown}
                    defaultValue="All"
                    options={towns}
                    onSelect={(town) => {
                        setSelectedTown(town);
                        setSelectedPostcode('All');
                    }} />
                <Select
                    label="Post code"
                    value={selectedPostcode}
                    defaultValue="All"
                    options={postcodes}
                    onSelect={(postcode) => {
                        setSelectedPostcode(postcode);

                    }} />

                <Button type="primary" className="w-[31px] self-end" onClick={() => {
                    onViewAnalytics(selectedTown, selectedDistrict, selectedPostcode);
                }
                }>View analytics</Button>
           
                  <div className="self-end">
                    <Popover
                        
                        modal={true}
                        >
                        <Popover.Trigger>
                            <IconButton icon="dots-vertical" type="secondary" />
                        </Popover.Trigger>
                        <Popover.Content
                            side={"top"}
                            showArrow={true}
                            showClose={false}
                            
                        >
                            <Title align="center" type="h3">Advanced settings</Title>
                            <br />
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <Text className="w-[82px] text-[12px]">Database</Text>
                                    <div className="flex border rounded-md border-[#323232] w-[220px] h-[28px]">
                                        <button
                                            className={`hover:cursor-pointer flex items-center w-[72px] gap-1 px-3 py-1  ${database === 'postgres'
                                                ? 'bg-[#2D2D2D] rounded-lg border border-[#FAFF69] text-white'
                                                : 'border rounded-md bg-transparent border-transparent'
                                                }`}
                                            onClick={() => handleDatabaseChange('postgres')}
                                        ><div className="flex items-center justify-center gap-2 px-[16px]">
                                                <Image
                                                    src="/icons/postgres.svg"
                                                    alt="postgres"
                                                    width={16}
                                                    height={16} />
                                            </div>
                                        </button>

                                        <button
                                            className={`hover:cursor-pointer flex items-center w-[72px] gap-1 px-3 py-1  ${database === 'fdw'
                                                ? 'bg-[#2D2D2D] rounded-lg border border-[#FAFF69] text-white'
                                                : 'border rounded-md bg-transparent border-transparent'
                                                }`}
                                            onClick={() => handleDatabaseChange('fdw')}
                                        ><div className="flex items-end justify-center gap-1 px-[16px]">
                                                <Image
                                                    src="/icons/postgres.svg"
                                                    alt="postgres"
                                                    width={16}
                                                    height={16} />
                                                <p className="text-[8px] font-extralight">fdw</p>
                                            </div>
                                        </button>

                                        <button
                                            className={`hover:cursor-pointer flex items-center w-[72px] gap-1 px-3 py-1  ${database === 'clickhouse'
                                                ? 'bg-[#2D2D2D] rounded-lg border border-[#FAFF69] text-white'
                                                : 'border rounded-md bg-transparent border-transparent'
                                                }`}
                                            onClick={() => handleDatabaseChange('clickhouse')}
                                        >
                                            <div className="flex items-center justify-center gap-2 px-[16px]">
                                                <Image
                                                    src="/icons/clickhouse.svg"
                                                    alt="clickhouse"
                                                    width={16}
                                                    height={16} />
                                            </div>
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Text className="w-[82px] text-[12px]">Debug</Text>
                                    <div className="flex border rounded-md border-[#323232] w-[220px] h-[28px]">
                                        <button
                                            className={`hover:cursor-pointer flex grow items-center gap-1 px-3 py-1  ${!debug
                                                ? 'bg-[#2D2D2D] rounded-lg border border-[#FAFF69] text-white'
                                                : 'border rounded-md bg-transparent border-transparent'
                                                }`}
                                            onClick={() => handleDebug('false')}
                                        ><div className="flex grow items-center justify-center gap-2  px-[16px]">
                                                <p className="text-xs">Off</p>
                                            </div>
                                        </button>

                                        <button
                                            className={`hover:cursor-pointer flex grow items-center gap-1 px-3 py-1   ${debug
                                                ? 'bg-[#2D2D2D] rounded-lg border border-[#FAFF69] text-white'
                                                : 'border rounded-md bg-transparent border-transparent'
                                                }`}
                                            onClick={() => handleDebug('true')}
                                        >
                                            <div className="flex grow items-center justify-center gap-2 px-[16px]">
                                                <p className="text-xs">On</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Text className="w-[82px] text-[12px]">Dataset size</Text>
                                    <div className="flex border rounded-md border-[#323232] w-[220px] h-[28px]">
                                        <button
                                            disabled={database === 'postgres'}
                                            className={`flex grow items-center gap-1 px-3 py-1 
                                            ${dataset === 'normal' || database === 'postgres'
                                                    ? 'bg-[#2D2D2D] rounded-lg border border-[#FAFF69] text-white'
                                                    : 'border rounded-md bg-transparent border-transparent'}
                                            ${database === 'postgres' ? 'opacity-50 cursor-not-allowed' : 'hover:cursor-pointer'}
                                        `}
                                            onClick={() => handleDatasetChange('normal')}
                                        >
                                            <div className="flex grow items-center justify-center gap-2 px-[16px]">
                                                <Image
                                                    src="/icons/medium.png"
                                                    alt="medium"
                                                    width={16}
                                                    height={16}
                                                />
                                            </div>
                                        </button>

                                        <button
                                            disabled={database === 'postgres'}
                                            className={`flex grow items-center gap-1 px-3 py-1 
                                            ${dataset === 'large' && database === 'clickhouse'
                                                    ? 'bg-[#2D2D2D] rounded-lg border border-[#FAFF69] text-white'
                                                    : 'border rounded-md bg-transparent border-transparent'}
                                            ${database === 'postgres' ? 'opacity-50 cursor-not-allowed' : 'hover:cursor-pointer'}
                                        `}
                                            onClick={() => handleDatasetChange('large')}
                                        >
                                            <div className="flex grow items-center justify-center gap-2 px-[16px]">
                                                <Image
                                                    src="/icons/xl.png"
                                                    alt="x-large"
                                                    width={16}
                                                    height={16}
                                                />
                                            </div>
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </Popover.Content>
                    </Popover>
                    {/* <DebugIcon /> */}
                    </div>
                  {/* {debug &&
                  <div className="w-[300px] self-end">
                    <Switch
                        checked={database === 'clickhouse'}
                        dir="end"
                        label={labelSwitchDatabase()}
                        onCheckedChange={handleDatabaseChange}
                        orientation="horizontal"
                    /></div>}
                    {debug && database === 'clickhouse' && 
                    <div className="w-[300px] self-end">
                    <Switch
                        checked={dataset === 'large'}
                        dir="end"
                        label={labelSwitchDataset()}
                        onCheckedChange={handleDatasetChange}
                        orientation="horizontal"
                    /></div>} */}
            </div>
            
        </div>
    )
}

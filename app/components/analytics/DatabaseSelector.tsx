"use client";
import { Checkbox } from '@clickhouse/click-ui';
import Image from 'next/image';

interface DatabaseSelectorProps {
    database: string;
    dataset: string;
    handleDatabaseChange: (database: string) => void;
    handleDatasetChange: (value: boolean) => void;
}

const DatabaseSelector = ({ database, dataset, handleDatabaseChange, handleDatasetChange }: DatabaseSelectorProps) => {
    const checked = dataset === 'normal' ? false : true;

    return (
        <div className="flex items-center gap-2 p-2">
            <div className="flex border rounded-md border-[#323232]">
                <button
                    className={`hover:cursor-pointer flex items-center gap-1 px-3 py-1  ${database === 'postgres'
                        ? 'bg-[#2D2D2D] rounded-lg border border-[#FAFF69] text-white'
                        : 'border rounded-md bg-transparent border-transparent'
                        }`}
                    onClick={() => handleDatabaseChange('postgres')}
                ><div className="flex items-center justify-center gap-2 py-[4px] px-[16px]">
                        <Image
                            src="/icons/postgres.svg"
                            alt="postgres"
                            width={24}
                            height={24} />
                        <span className="text-sm font-inter">Postgres</span></div>
                </button>

                <button
                    className={`hover:cursor-pointer flex items-center gap-1 px-3 py-1  ${database === 'clickhouse'
                        ? 'bg-[#2D2D2D] rounded-lg border border-[#FAFF69] text-white'
                        : 'border rounded-md bg-transparent border-transparent'
                        }`}
                    onClick={() => handleDatabaseChange('clickhouse')}
                >
                    <div className="flex items-center justify-center gap-2 py-[4px] px-[16px]">
                        <Image
                            src="/icons/clickhouse.svg"
                            alt="clickhouse"
                            width={24}
                            height={24} />
                        <span className="text-sm font-inter">ClickHouse</span>
                    </div>
                </button>
            </div>

            <div className="flex items-center gap-1 ml-4">
                {database === 'clickhouse' &&
                <Checkbox
                    label="Large dataset"
                    onCheckedChange={handleDatasetChange}
                    checked={checked}
                    disabled={false}
                />}
            </div>
        </div>
    );
};

export default DatabaseSelector;

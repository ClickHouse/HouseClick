'use client';

import { useState, FormEvent } from 'react';
import { SearchField, Button, Select } from "@clickhouse/click-ui";

interface SearchBarProps {
    defaultValue?: string;
    onSearch: (searchTerm: string) => void;

}

export default function SearchBar({ defaultValue = '', onSearch }: SearchBarProps) {
    const [searchTerm, setSearchTerm] = useState<string>(defaultValue);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSearch(searchTerm.trim());
    };

    return (

        <form onSubmit={handleSubmit} className="flex space-x-6">  
            <div className="w-full flex gap-8">
                <SearchField
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e)
                    } }
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            onSearch(searchTerm.trim());
                        }
                    }}
                    placeholder="Search for a postcode, district or town"
                    autoComplete="off"
                    className="rounded-md border-neutral-725 bg-neutral-900 px-5 py-2 text-neutral-200  placeholder:text-gray-400 font-inter"
                    aria-label="Search properties"
                    
                />
                <Button
                    id="submit"
                    type="primary"
                    label='Search'
                    className="self-end text-md mt-2 inline-flex items-center justify-center rounded-md bg-primary-300 px-5 py-2 font-semibold text-neutral-900 hover:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "
                />
            </div>
            
                
        </form>
    );
}


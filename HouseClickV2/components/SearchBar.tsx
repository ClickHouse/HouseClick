'use client';

import { useState, FormEvent } from 'react';

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
        <form onSubmit={handleSubmit} className="w-full md:flex md:space-x-6">  
            <div className="w-full">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="e.g. 'York', 'NW3', 'NW3 5TY' or 'Waterloo Station'"
                    autoComplete="off"
                    className="w-full rounded-md border-neutral-725 bg-neutral-900 px-5 py-2 text-neutral-200  placeholder:text-gray-400 md:text-lg"
                    aria-label="Search properties"
                />
            </div>
                <button
                    type="submit"
                    className="text-md mt-2 inline-flex w-full items-center justify-center rounded-md bg-primary-300 px-5 py-2 font-semibold text-neutral-900 hover:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 md:mt-0 md:w-52 md:flex-initial"
                >
                    Search
                </button>
        </form>
    );
}


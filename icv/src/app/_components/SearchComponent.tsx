"use client";

import { useState, useEffect } from "react";
import { searchByKeyword } from "../../lib/firestoreUtils";
import { NewClient } from "@/types/client-types";
import Link from "next/link";
import { Card } from "@/components/ui/card";

interface SearchComponentProps {
    clients: NewClient[];
}

const SearchComponent = ({ clients }: SearchComponentProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState<NewClient[]>([]);
    const [loading, setLoading] = useState(false);
    const [initialPage, setInitialPage] = useState(true);
    const [filters, setFilters] = useState({
        program: ''
    });

    // Set initial results
    useEffect(() => {
        setResults(clients);
    }, [clients]);

    // Debounced search effect
    useEffect(() => {
        const performSearch = async () => {
            if (searchTerm.trim() === "") {
                if (!initialPage) {
                    setResults(clients);
                }
                return;
            }

            setLoading(true);
            try {
                let data: NewClient[] = await searchByKeyword(searchTerm);
                setResults(data);
                setInitialPage(false);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => {
            performSearch();
        }, 500);


        return () => clearTimeout(timer);
    }, [searchTerm, initialPage]);

    const filteredResults = results.filter(user => {
        if (filters.program && user.program !== filters.program) return false;
        return true;
    });

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto pt-8">
            {/* Search Input and Filters */}
            <h1 className="text-4xl font-bold w-full mb-6">Clients</h1>
            
            <div className="w-full flex items-center gap-x-4">
                {/* Search Input */}
                <div className="flex-1">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search..."
                            className="w-full h-10 pl-8 pr-3 py-1.5 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#DBD8E4] text-black placeholder:text-[#5C5A65]"
                        />
                        <svg
                            className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5C5A65]"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>

                {/* program Filter Dropdown */}
                <select 
                    value={filters.program}
                    onChange={(e) => setFilters({...filters, program: e.target.value})}
                    className="h-10 px-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#ffffff] min-w-[150px]"
                >
                    <option value="">All Programs</option>
                    <option value="Homeless Department">Homeless Department</option>
                    <option value="School Outreach">School Outreach</option>
                    <option value="No Program">No Program</option>
                </select>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="w-full text-center text-gray-500 mt-4">
                    Searching...
                </div>
            )}

            {/* Results */}
            <div className="w-full mt-4">
                {filteredResults.length > 0 ? (
                    <div className="grid gap-4 grid-cols-3">
                        {filteredResults.map((user) => (
                            <Link key={user.id}
                            href={`/clients/${user.id}`} 
                            className="text-lg font-medium text-blue-600 hover:text-blue-800">
                            <Card className="flex h-[88px] w-full p-4 bg-white hover:bg-gray-50">
                                <div className="flex items-start w-full gap-3">
                                    <svg 
                                        viewBox="0 0 24 24" 
                                        fill="currentColor" 
                                        className="w-10 h-10 flex-shrink-0 text-gray-300"
                                    >
                                        <path 
                                            fillRule="evenodd" 
                                            d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" 
                                            clipRule="evenodd" 
                                        />
                                    </svg>
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="text-base font-medium text-gray-900">
                                                    {user.firstName} {user.lastName}
                                                </div>
                                                <div className="text-sm text-gray-500 mt-0.5">
                                                    {user.id}
                                                </div>
                                            </div>
                                            <span className="bg-gray-900 text-white text-xs px-2 py-0.5 rounded-full">
                                                {user.program || 'Housing'}
                                            </span>
                                        </div>
                                        <div className="mt-2 text-sm text-gray-500">
                                                <span className="text-gray-400">Last check-in</span>
                                                `<div className="flex justify-end ">
                                                    {/* TODO: Add last check-in date */}
                                                    <span className="ml-2">02/13/25</span>
                                                </div>
                                            </div>
                                        </div>
                                </div>
                            </Card>
                            </Link>
                        ))}
                    </div>
                ) : (
                    !loading && (
                        <div className="text-center text-gray-500">
                            {searchTerm.trim() ? 'No results found' : ""}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default SearchComponent;

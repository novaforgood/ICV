'use client'

import { Card } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select'
import { NewClient } from '@/types/client-types'
import { SelectValue } from '@radix-ui/react-select'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { searchByKeyword } from '../../lib/firestoreUtils'

interface SearchComponentProps {
    clients: NewClient[]
}

const SearchComponent = ({ clients }: SearchComponentProps) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [results, setResults] = useState<NewClient[]>([])
    const [loading, setLoading] = useState(false)
    const [initialPage, setInitialPage] = useState(true)
    const [filters, setFilters] = useState({
        program: 'All Programs',
    })

    // Set initial results
    useEffect(() => {
        setResults(clients)
    }, [clients])

    // Debounced search effect
    useEffect(() => {
        const performSearch = async () => {
            if (searchTerm.trim() === '') {
                if (!initialPage) {
                    setResults(clients)
                }
                return
            }

            setLoading(true)
            try {
                let data: NewClient[] = await searchByKeyword(searchTerm)
                setResults(data)
                setInitialPage(false)
            } catch (error) {
                console.error('Search error:', error)
            } finally {
                setLoading(false)
            }
        }

        const timer = setTimeout(() => {
            performSearch()
        }, 500)

        return () => clearTimeout(timer)
    }, [searchTerm, initialPage])

    const filteredResults = results.filter((user) => {
        if (filters.program === 'All Programs') return true
        if (filters.program && user.program !== filters.program) return false
        return true
    })

    return (
        <>
            {/* Search Input and Filters */}

            <div className="flex w-full items-center gap-x-4">
                {/* Search Input */}
                <div className="flex-1">
                    <div className="bg-midground flex w-full flex-row items-center gap-2 rounded px-4 py-2 text-black">
                        <svg
                            className="h-4 w-4 flex-shrink-0 -translate-y-[1px] text-gray-700"
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
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search..."
                            className="w-full bg-transparent text-base outline-none placeholder:text-gray-700"
                        />
                    </div>
                </div>

                {/* program Filter Dropdown */}
                <Select
                    value={filters.program}
                    onValueChange={(e) =>
                        setFilters({ ...filters, program: e.valueOf() })
                    }
                >
                    <SelectTrigger className="w-64">
                        <SelectValue placeholder="All Programs" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All Programs">
                            All Programs
                        </SelectItem>
                        <SelectItem value="Homeless Department">
                            Homeless Department
                        </SelectItem>
                        <SelectItem value="School Outreach">
                            School Outreach
                        </SelectItem>
                        <SelectItem value="No Program">No Program</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Loading State */}
            {/* {loading && (
                <div className="mt-4 w-full text-center text-gray-500">
                    Searching...
                </div>
            )} */}

            {/* Results */}
            <div className="mt-4 w-full">
                {filteredResults.length > 0 ? (
                    <div className="grid grid-cols-3 gap-4">
                        {filteredResults.map((user) => (
                            <Link
                                key={user.id}
                                href={`/clients/${user.id}`}
                                className="text-lg font-medium text-blue-600 hover:text-blue-800"
                            >
                                <Card className="flex min-h-24 w-full bg-white p-4 hover:bg-gray-50">
                                    <div className="flex w-full items-start gap-3">
                                        <img
                                            src={
                                                user.clientImage?.[0] ||
                                                '/cavediva.jpeg'
                                            }
                                            alt="client"
                                            className="h-16 w-16 rounded-full"
                                        />
                                        {/* {user.clientImage?.length &&
                                        user.clientImage[0] ? (
                                        ) : (
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                className="h-10 w-10 flex-shrink-0 text-gray-300"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        )} */}
                                        <div className="flex min-w-0 flex-1 flex-col">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="text-base font-medium text-gray-900">
                                                        {user.firstName}{' '}
                                                        {user.lastName}
                                                    </div>
                                                    <div className="mt-0.5 text-sm text-gray-500">
                                                        {user.clientCode ||
                                                            user.id}
                                                    </div>
                                                </div>
                                                <span className="flex max-w-24 items-center justify-center rounded-full bg-gray-900 px-3 py-1 text-xs text-white">
                                                    {truncateText(
                                                        user.program ||
                                                            'Housing',
                                                        7,
                                                    )}
                                                </span>
                                            </div>
                                            <div className="mt-2 flex flex-row items-center justify-between text-sm text-gray-500">
                                                <span className="text-gray-400">
                                                    Last check-in
                                                </span>

                                                <div className="flex justify-end">
                                                    {/* TODO: Add last check-in date */}
                                                    <span className="ml-2">
                                                        02/13/25
                                                    </span>
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
                            {searchTerm.trim() ? 'No results found' : ''}
                        </div>
                    )
                )}
            </div>
        </>
    )
}

function truncateText(text: string, length: number) {
    return text.length > length ? text.slice(0, length) + '...' : text
}

export default SearchComponent

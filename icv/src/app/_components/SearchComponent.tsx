'use client'

import { getClientByCaseManager } from '@/api/clients'
import ClientCard from '@/app/_components/ClientCard'
import FilterPanel from '@/app/_components/FilterPanel'
import { useUser } from '@/hooks/useUser'
import { searchByKeyword } from '@/lib/firestoreUtils'
import type { NewClient } from '@/types/client-types'
import Link from 'next/link'
import { useEffect, useState } from 'react'

// Extended client type with lastCheckinDate
interface ClientWithLastCheckin extends NewClient {
    lastCheckinDate?: string
}

const SearchComponent = () => {
    const { user } = useUser()
    const [searchTerm, setSearchTerm] = useState('')
    const [results, setResults] = useState<ClientWithLastCheckin[]>([])
    const [loading, setLoading] = useState(false)
    const [initialPage, setInitialPage] = useState(true)
    const [managerClients, setManagerClients] = useState<
        ClientWithLastCheckin[]
    >([])
    const [isLoadingManagerClients, setIsLoadingManagerClients] =
        useState(false)
    const [managerClientsError, setManagerClientsError] = useState<
        string | null
    >(null)
    const [sortBy, setSortBy] = useState<'asc' | 'desc' | null>(null)
    const [sortedClients, setSortedClients] = useState<ClientWithLastCheckin[]>(
        [],
    )
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [filters, setFilters] = useState<{
        selectedDates: string[]
        dateType: string
    }>({
        selectedDates: [],
        dateType: 'Month',
    })

    // console.log(managerClients)

    useEffect(() => {
        const fetchManagerClients = async () => {
            if (!user?.uid) return

            setIsLoadingManagerClients(true)
            setManagerClientsError(null)
            try {
                const clients = await getClientByCaseManager()
                setManagerClients(clients as ClientWithLastCheckin[])
            } catch (err) {
                console.error('Error fetching manager clients:', err)
                setManagerClientsError('Failed to load assigned clients')
            } finally {
                setIsLoadingManagerClients(false)
            }
        }

        fetchManagerClients()
    }, [user?.uid])

    useEffect(() => {
        const performSearch = async () => {
            if (!searchTerm.trim()) {
                setResults([])
                setInitialPage(true)
                return
            }

            setLoading(true)
            setInitialPage(false)
            try {
                const searchResults = await searchByKeyword(searchTerm)
                setResults(searchResults as ClientWithLastCheckin[])
            } catch (err) {
                console.error('Error searching clients:', err)
            } finally {
                setLoading(false)
            }
        }

        const debounceTimer = setTimeout(performSearch, 300)
        return () => clearTimeout(debounceTimer)
    }, [searchTerm, managerClients])

    useEffect(() => {
        const sorted = [...managerClients].sort((a, b) => {
            const dateA = a.lastCheckinDate
                ? new Date(a.lastCheckinDate).getTime()
                : 0
            const dateB = b.lastCheckinDate
                ? new Date(b.lastCheckinDate).getTime()
                : 0
            return dateB - dateA // Default to newest first
        })
        setSortedClients(sorted)
    }, [managerClients])

    useEffect(() => {
        if (sortBy === 'asc') {
            setSortedClients((prev) => [...prev].reverse())
        } else if (sortBy === 'desc') {
            setSortedClients((prev) => [...prev].reverse())
        }
    }, [sortBy])

    // Filter the clients based on selected dates
    const filteredClients = sortedClients.filter((client) => {
        if (filters.selectedDates.length === 0) return true

        const clientDate = new Date(client.lastCheckinDate || '')
        if (isNaN(clientDate.getTime())) return false

        switch (filters.dateType) {
            case 'Month':
                const month = clientDate.toLocaleString('default', {
                    month: 'long',
                })
                return filters.selectedDates.includes(month)
            case 'Quarter':
                const quarter = Math.floor(clientDate.getMonth() / 3) + 1
                return filters.selectedDates.includes(`Q${quarter}`)
            case 'Year':
            case 'Fiscal Year':
                const year = clientDate.getFullYear().toString()
                return filters.selectedDates.includes(year)
            default:
                return true
        }
    })

    return (
        <div className="mx-auto w-full max-w-6xl p-4">
            <h1 className="mx-auto mb-4 mt-6 w-full max-w-6xl text-6xl font-bold">
                My Clients
            </h1>
            <div className="mb-8 flex items-center gap-4">
                <div className="flex flex-1 flex-row items-center gap-2 rounded bg-midground px-4 py-2 text-black">
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
                        placeholder="Search clients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-transparent text-base outline-none placeholder:text-gray-700"
                    />
                </div>
                <button
                    className="flex w-[170px] items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                        setSortBy((prev) => (prev === 'asc' ? 'desc' : 'asc'))
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-4 w-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                        />
                    </svg>
                    {sortBy === 'asc' ? 'Sort by newest' : 'Sort by oldest'}
                </button>
                <button
                    className="flex w-[200px] items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsFilterOpen(true)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-4 w-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
                        />
                    </svg>
                    Filter intake date
                </button>
            </div>

            {isFilterOpen && (
                <FilterPanel
                    currentFilters={filters}
                    onClose={() => {
                        setIsFilterOpen(false)
                        console.log('closed without applying filters')
                    }}
                    onFilter={(newFilters) => {
                        setFilters(newFilters)
                        setIsFilterOpen(false)
                        console.log('applied filters:', newFilters)
                    }}
                />
            )}

            {loading && (
                <div className="mt-4 w-full text-center text-gray-500">
                    Searching...
                </div>
            )}
            {managerClientsError && (
                <div className="mb-4 text-center text-red-500">
                    {managerClientsError}
                </div>
            )}

            <div className="grid gap-4">
                {initialPage ? (
                    <div className="mb-4">
                        {isLoadingManagerClients ? (
                            <div className="text-center text-gray-500">
                                Loading assigned clients...
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                {filteredClients.map((client) => (
                                    <Link
                                        key={`${client.id}-${client.firstName}-${client.dateOfBirth}`}
                                        href={`/clients/${client.id}`}
                                        className="text-lg font-medium text-blue-600 hover:text-blue-800"
                                    >
                                        <ClientCard
                                            client={client}
                                            showLastCheckin={true}
                                        />
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <h2 className="mb-4 font-['Epilogue'] text-3xl font-semibold text-black">
                            Search Results
                        </h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {results.map((client) => (
                                <Link
                                    key={`${client.id}-${client.firstName}-${client.dateOfBirth}`}
                                    href={`/clients/${client.id}`}
                                    className="text-lg font-medium text-blue-600 hover:text-blue-800"
                                >
                                    <ClientCard
                                        client={client}
                                        showLastCheckin={true}
                                    />
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

// function truncateText(text: string, length: number) {
//     return text.length > length ? text.slice(0, length) + '...' : text
// }

export default SearchComponent

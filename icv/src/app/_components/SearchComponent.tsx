'use client'

import { getClientByCaseManager, getAllClientsByLastCheckinDate } from '@/api/clients'
import ClientCard from '@/app/_components/ClientCard'
import FilterPanel from '@/app/_components/FilterPanel'
import { useUser } from '@/hooks/useUser'
import { searchByKeyword } from '@/lib/firestoreUtils'
import type { NewClient } from '@/types/client-types'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

// Extended client type with lastCheckinDate
interface ClientWithLastCheckin extends NewClient {
    lastCheckinDate?: string
}

const ITEMS_PER_PAGE = 12

const SearchComponent = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { user } = useUser()
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(false)
    const [managerClients, setManagerClients] = useState<ClientWithLastCheckin[]>([])
    const [allClients, setAllClients] = useState<ClientWithLastCheckin[]>([])
    const [sortedManagerClients, setSortedManagerClients] = useState<ClientWithLastCheckin[]>([])
    const [sortedAllClients, setSortedAllClients] = useState<ClientWithLastCheckin[]>([])
    const [isLoadingManagerClients, setIsLoadingManagerClients] = useState(false)
    const [managerClientsError, setManagerClientsError] = useState<string | null>(null)
    const [sortBy, setSortBy] = useState<'asc' | 'desc' | null>(null)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [activeTab, setActiveTab] = useState<'my' | 'all'>('my')
    const [displayedClients, setDisplayedClients] = useState<ClientWithLastCheckin[]>([])
    const [filters, setFilters] = useState<{
        selectedDates: string[]
        dateType: string
    }>({
        selectedDates: [],
        dateType: 'Month',
    })
    const [myClientsPage, setMyClientsPage] = useState(1)
    const [allClientsPage, setAllClientsPage] = useState(1)
    const [searchResults, setSearchResults] = useState<ClientWithLastCheckin[]>([])
    const isSearchMode = searchTerm.trim().length > 0
    const [pageNumber, setPageNumber] = useState(1)

    // Get initial page from URL
    useEffect(() => {
        const page = searchParams.get('page')
        if (page) {
            const pageNum = parseInt(page, 10)
            if (!isNaN(pageNum) && pageNum > 0) {
                if (activeTab === 'my') {
                    setMyClientsPage(pageNum)
                } else {
                    setAllClientsPage(pageNum)
                }
            }
        }
    }, [searchParams, activeTab])

    // Update URL when page changes
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString())
        const currentPage = activeTab === 'my' ? myClientsPage : allClientsPage
        if (currentPage > 1) {
            params.set('page', currentPage.toString())
        } else {
            params.delete('page')
        }
        router.push(`?${params.toString()}`, { scroll: false })
    }, [myClientsPage, allClientsPage, activeTab, router, searchParams])

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

            const fetchAllClients = async () => {
                try {
                    const clients = await getAllClientsByLastCheckinDate()
                    setAllClients(clients as ClientWithLastCheckin[])
                } catch (err) {
                    console.error('Error fetching all clients:', err)
                }
            }

            fetchAllClients()
        }

        fetchManagerClients()
    }, [user?.uid])

    useEffect(() => {
        const performSearch = async () => {
            setLoading(true)
            try {
                const searchResults = await searchByKeyword(searchTerm)
                // Filter search results based on active tab
                const filteredResults = activeTab === 'my' 
                    ? searchResults.filter(client => managerClients.some(mc => mc.id === client.id))
                    : searchResults
                setSearchResults(filteredResults as ClientWithLastCheckin[])
                // Reset to first page when search results change
                setPageNumber(1)
            } catch (err) {
                console.error('Error searching clients:', err)
            } finally {
                setLoading(false)
            }
        }

        const debounceTimer = setTimeout(performSearch, 300)
        return () => clearTimeout(debounceTimer)
    }, [searchTerm, managerClients, activeTab])

    // Sort manager clients
    useEffect(() => {
        const withDates = managerClients.filter(client => client.lastCheckinDate);
        const withoutDates = managerClients.filter(client => !client.lastCheckinDate);
        
        const sortedWithDates = [...withDates].sort((a, b) => {
            const dateA = a.lastCheckinDate ? new Date(a.lastCheckinDate).getTime() : 0;
            const dateB = b.lastCheckinDate ? new Date(b.lastCheckinDate).getTime() : 0;
            return sortBy === 'asc' ? dateA - dateB : dateB - dateA;
        });
        
        setSortedManagerClients([...sortedWithDates, ...withoutDates]);
    }, [managerClients, sortBy]);

    // Sort all clients
    useEffect(() => {
        const withDates = allClients.filter(client => client.lastCheckinDate);
        const withoutDates = allClients.filter(client => !client.lastCheckinDate);
        
        const sortedWithDates = [...withDates].sort((a, b) => {
            const dateA = a.lastCheckinDate ? new Date(a.lastCheckinDate).getTime() : 0;
            const dateB = b.lastCheckinDate ? new Date(b.lastCheckinDate).getTime() : 0;
            return sortBy === 'asc' ? dateA - dateB : dateB - dateA;
        });
        
        setSortedAllClients([...sortedWithDates, ...withoutDates]);
    }, [allClients, sortBy]);

    // Apply filters to a list of clients
    const applyFilters = (clients: ClientWithLastCheckin[]) => {
        return clients.filter((client) => {
            // Apply date filter if dates are selected
            if (filters.selectedDates.length > 0) {
                const clientDate = new Date(client.lastCheckinDate || '')
                if (isNaN(clientDate.getTime())) return false

                switch (filters.dateType) {
                    case 'Month':
                        const month = clientDate.toLocaleString('default', { month: 'long' })
                        if (!filters.selectedDates.includes(month)) return false
                        break
                    case 'Quarter':
                        const quarter = Math.floor(clientDate.getMonth() / 3) + 1
                        if (!filters.selectedDates.includes(`Q${quarter}`)) return false
                        break
                    case 'Year':
                    case 'Fiscal Year':
                        const year = clientDate.getFullYear().toString()
                        if (!filters.selectedDates.includes(year)) return false
                        break
                }
            }

            // Apply search term filter if search term exists
            if (searchTerm.trim()) {
                const searchLower = searchTerm.toLowerCase()
                const matchesSearch = 
                    client.firstName?.toLowerCase().includes(searchLower) ||
                    client.lastName?.toLowerCase().includes(searchLower) ||
                    client.id?.toLowerCase().includes(searchLower)
                if (!matchesSearch) return false
            }

            // If we get here, the client passes all filters
            return true
        })
    }

    const updateDisplayedClients = () => {
        // Get the correct client list based on active tab and search mode
        const baseClients = isSearchMode
            ? searchResults
            : (activeTab === 'my' ? sortedManagerClients : sortedAllClients)

        const filtered = applyFilters(baseClients)
        setDisplayedClients(filtered)
        
        // Reset to first page if needed
        const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
        if (pageNumber > totalPages && totalPages > 0) {
            setPageNumber(1)
        }
    }

    // Update displayed clients whenever relevant state changes
    useEffect(() => {
        updateDisplayedClients()
    }, [
        activeTab,
        sortedManagerClients,
        sortedAllClients,
        filters.selectedDates,
        filters.dateType,
        searchTerm,
        sortBy,
        searchResults,
        isSearchMode,
        pageNumber
    ])

    // Handle tab changes
    const handleTabChange = (tab: 'my' | 'all') => {
        setActiveTab(tab)
        setPageNumber(1)
        // Clear search results when changing tabs
        setSearchResults([])
        setSearchTerm('')
    }

    // Calculate paginated results
    const getPaginatedResults = (items: ClientWithLastCheckin[]) => {
        const startIndex = (pageNumber - 1) * ITEMS_PER_PAGE
        const endIndex = startIndex + ITEMS_PER_PAGE
        return items.slice(startIndex, endIndex)
    }

    // Calculate total pages based on displayed clients
    const totalPages = Math.ceil(displayedClients.length / ITEMS_PER_PAGE)

    return (
        <div className="mx-auto w-full max-w-6xl p-4">
            <div className="flex justify-between items-center mb-4 mt-6">
                <h1 className="text-6xl font-bold">
                    My Clients
                </h1>
                <div className="relative bg-zinc-200 rounded-[20px] inline-flex justify-start items-center p-1">
                    <div 
                        className={`absolute transition-all duration-300 ease-in-out ${activeTab === 'my' ? 'left-1' : 'left-[calc(100%-50%-4px)]'} w-[calc(50%-4px)] h-[calc(100%-8px)] bg-black rounded-[16px]`}
                    />
                    <button
                        onClick={() => handleTabChange('my')}
                        className={`relative px-5 py-2 rounded-[16px] flex justify-center items-center gap-2.5 transition-colors duration-300 ${
                            activeTab === 'my' ? 'text-white' : 'text-black'
                        }`}
                    >
                        <div className="justify-center text-base font-normal font-['Epilogue'] leading-none">
                            My clients
                        </div>
                    </button>
                    <button
                        onClick={() => handleTabChange('all')}
                        className={`relative px-5 py-2 rounded-[16px] flex justify-center items-center gap-2.5 transition-colors duration-300 ${
                            activeTab === 'all' ? 'text-white' : 'text-black'
                        }`}
                    >
                        <div className="justify-center text-base font-normal font-['Epilogue'] leading-none">
                            All clients
                        </div>
                    </button>
                </div>
            </div>

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

            <div className="width-full flex flex-wrap gap-2 mt-0 mb-4">
                {filters.selectedDates.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {filters.selectedDates.map((date) => (
                            <div 
                                key={date} 
                                className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm text-black border-spacing-0 border-gray-300 border-2"
                            >
                                <div
                                    onClick={() => {
                                        const newSelectedDates = filters.selectedDates.filter(d => d !== date);
                                        setFilters(prev => ({
                                            ...prev,
                                            selectedDates: newSelectedDates
                                        }));
                                    }}
                                    className="mr-1 rounded-full hover:bg-gray-300 cursor-pointer"
                                >
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className="h-4 w-4" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <span>{date}</span>
                            </div>
                        ))}
                    </div>
                )}
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
                {!isSearchMode ? (
                    <div className="mb-4">
                        {isLoadingManagerClients ? (
                            <div className="text-center text-gray-500">
                                Loading assigned clients...
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                    {getPaginatedResults(displayedClients).map((client) => (
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
                                {displayedClients.length > 0 && totalPages > 1 && (
                                    <div className="mt-8 flex justify-center gap-2">
                                        <button
                                            onClick={() => setPageNumber(pageNumber - 1)}
                                            disabled={pageNumber === 1}
                                            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            Previous
                                        </button>
                                        <span className="flex items-center px-4 py-2 text-sm font-medium text-gray-700">
                                            Page {pageNumber} of {totalPages}
                                        </span>
                                        <button
                                            onClick={() => setPageNumber(pageNumber + 1)}
                                            disabled={pageNumber === totalPages}
                                            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ) : (
                    <div>
                        <h2 className="mb-4 font-['Epilogue'] text-3xl font-semibold text-black">
                            Search Results
                        </h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {getPaginatedResults(displayedClients).map((client) => (
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
                        {displayedClients.length > 0 && totalPages > 1 && (
                            <div className="mt-8 flex justify-center gap-2">
                                <button
                                    onClick={() => setPageNumber(pageNumber - 1)}
                                    disabled={pageNumber === 1}
                                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span className="flex items-center px-4 py-2 text-sm font-medium text-gray-700">
                                    Page {pageNumber} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setPageNumber(pageNumber + 1)}
                                    disabled={pageNumber === totalPages}
                                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                        {displayedClients.length === 0 && !loading && (
                            <div className="mt-8 text-center text-gray-500">
                                No results found
                            </div>
                        )}
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

'use client'

import {
    getAllClientsByLastCheckinDate,
    getClientByCaseManager,
} from '@/api/clients'
import ClientCard from '@/app/_components/ClientCard'
import FilterPanel from '@/app/_components/FilterPanel'
import { useUser } from '@/hooks/useUser'
import type { NewClient } from '@/types/client-types'
import Link from 'next/link'
import { useEffect, useState } from 'react'
interface ClientWithLastCheckin extends NewClient {
    lastCheckinDate?: string
}

const ITEMS_PER_PAGE = 12

const SearchComponent = () => {
    // const router = useRouter()
    // const searchParams = useSearchParams()
    const { user } = useUser()
    const [searchTerm, setSearchTerm] = useState('')
    const [managerClients, setManagerClients] = useState<
        ClientWithLastCheckin[]
    >([])
    const [allClients, setAllClients] = useState<ClientWithLastCheckin[]>([])
    const [sortedManagerClients, setSortedManagerClients] = useState<
        ClientWithLastCheckin[]
    >([])
    const [sortedAllClients, setSortedAllClients] = useState<
        ClientWithLastCheckin[]
    >([])
    const [isLoadingPage, setIsLoadingPage] = useState(false)
    const [sortBy, setSortBy] = useState<'asc' | 'desc' | null>(null)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [activeTab, setActiveTab] = useState<'my' | 'all'>('my')
    const [displayedClients, setDisplayedClients] = useState<
        ClientWithLastCheckin[]
    >([])
    const [filters, setFilters] = useState<{
        selectedDates: string[]
        dateType: string
    }>({
        selectedDates: [],
        dateType: 'Month',
    })
    const [pageNumber, setPageNumber] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [currentPageItems, setCurrentPageItems] = useState<
        ClientWithLastCheckin[]
    >([])

    useEffect(() => {
        const fetchClients = async () => {
            if (!user?.uid) return

            setIsLoadingPage(true)
            try {
                const [managerClientsData, allClientsData] = await Promise.all([
                    getClientByCaseManager(),
                    getAllClientsByLastCheckinDate(),
                ])

                setManagerClients(managerClientsData as ClientWithLastCheckin[])
                setAllClients(allClientsData as ClientWithLastCheckin[])
            } catch (err) {
                console.error('Error fetching clients:', err)
            } finally {
                setIsLoadingPage(false)
            }
        }

        fetchClients()
    }, [user?.uid])

    // Sort clients
    useEffect(() => {
        const sortClients = (clients: ClientWithLastCheckin[]) => {
            const withDates = clients.filter((client) => client.lastCheckinDate)
            const withoutDates = clients.filter(
                (client) => !client.lastCheckinDate,
            )

            const sortedWithDates = [...withDates].sort((a, b) => {
                const dateA = a.lastCheckinDate
                    ? new Date(a.lastCheckinDate).getTime()
                    : 0
                const dateB = b.lastCheckinDate
                    ? new Date(b.lastCheckinDate).getTime()
                    : 0
                return sortBy === 'asc' ? dateA - dateB : dateB - dateA
            })

            return [...sortedWithDates, ...withoutDates]
        }

        setSortedManagerClients(sortClients(managerClients))
        setSortedAllClients(sortClients(allClients))
    }, [managerClients, allClients])

    // Apply filters to a list of clients
    const applyFilters = (clients: ClientWithLastCheckin[]) => {
        return clients.filter((client) => {
            // Apply date filter if dates are selected
            if (filters.selectedDates.length > 0) {
                const clientDate = new Date(client.lastCheckinDate || '')
                if (isNaN(clientDate.getTime())) return false

                switch (filters.dateType) {
                    case 'Month':
                        const month = clientDate.toLocaleString('default', {
                            month: 'long',
                        })
                        if (!filters.selectedDates.includes(month)) return false
                        break
                    case 'Quarter':
                        const quarter =
                            Math.floor(clientDate.getMonth() / 3) + 1
                        if (!filters.selectedDates.includes(`Q${quarter}`))
                            return false
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

    const updateDisplayedClients = async () => {
        // Get the base client list based on active tab
        const baseClients =
            activeTab === 'my' ? sortedManagerClients : sortedAllClients

        // If there's a search term, perform the search on the base clients
        if (searchTerm.trim()) {
            setIsLoadingPage(true)
            try {
                // Apply filters to search results
                const filtered = applyFilters(
                    baseClients as ClientWithLastCheckin[],
                )
                setDisplayedClients(filtered)
                setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE))

                console.log('filtered length:', filtered.length)
                console.log('ITEMS_PER_PAGE:', ITEMS_PER_PAGE)
                console.log(
                    'total pages:',
                    Math.ceil(filtered.length / ITEMS_PER_PAGE),
                )
                setPageNumber(1)
            } catch (err) {
                console.error('Error searching clients:', err)
                setDisplayedClients([])
            } finally {
                setIsLoadingPage(false)
            }
        } else {
            // If no search term, apply filters to base clients
            const filtered = applyFilters(baseClients)
            setDisplayedClients(filtered)
            setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE))

            console.log('filtered length:', filtered.length)
            console.log('ITEMS_PER_PAGE:', ITEMS_PER_PAGE)
            console.log(
                'total pages:',
                Math.ceil(filtered.length / ITEMS_PER_PAGE),
            )
            setPageNumber(1)
        }

        console.log('displayedClients:', displayedClients)
        console.log('totalPages:', totalPages)
        console.log('pageNumber:', pageNumber)
        console.log('searchTerm:', searchTerm)
        console.log('activeTab:', activeTab)
        console.log('filters:', filters)
        console.log('sortBy:', sortBy)
    }

    // Update displayed clients whenever relevant state changes
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            updateDisplayedClients()
        }, 300)

        return () => clearTimeout(debounceTimer)
    }, [
        activeTab,
        filters.selectedDates,
        filters.dateType,
        sortBy,
        searchTerm,
        sortedManagerClients,
        sortedAllClients,
    ])

    // Handle tab changes
    const handleTabChange = (tab: 'my' | 'all') => {
        setActiveTab(tab)
        setPageNumber(1)
    }

    // Calculate paginated results
    useEffect(() => {
        const getPaginatedResults = (items: ClientWithLastCheckin[]) => {
            const startIndex = (pageNumber - 1) * ITEMS_PER_PAGE
            const endIndex = startIndex + ITEMS_PER_PAGE
            console.log('items', items.slice(startIndex, endIndex))
            console.log('items list', items)
            setCurrentPageItems(items.slice(startIndex, endIndex))
        }
        getPaginatedResults(displayedClients)
    }, [pageNumber, displayedClients])

    return (
        <div className="mx-auto w-full max-w-6xl p-4">
            <div className="mb-4 mt-6 flex items-center justify-between">
                <h1 className="text-6xl font-bold">My Clients</h1>
                <div className="relative inline-flex items-center justify-start rounded-[20px] bg-zinc-200 p-1">
                    <div
                        className={`absolute transition-all duration-300 ease-in-out ${activeTab === 'my' ? 'left-1' : 'left-[calc(100%-50%-4px)]'} h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-[16px] bg-black`}
                    />
                    <button
                        onClick={() => handleTabChange('my')}
                        className={`relative flex items-center justify-center gap-2.5 rounded-[16px] px-5 py-2 transition-colors duration-300 ${
                            activeTab === 'my' ? 'text-white' : 'text-black'
                        }`}
                    >
                        <div className="justify-center font-['Epilogue'] text-base font-normal leading-none">
                            My clients
                        </div>
                    </button>
                    <button
                        onClick={() => handleTabChange('all')}
                        className={`relative flex items-center justify-center gap-2.5 rounded-[16px] px-5 py-2 transition-colors duration-300 ${
                            activeTab === 'all' ? 'text-white' : 'text-black'
                        }`}
                    >
                        <div className="justify-center font-['Epilogue'] text-base font-normal leading-none">
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
                    Filter check-in date
                </button>
            </div>

            <div className="width-full mb-4 mt-0 flex flex-wrap gap-2">
                {filters.selectedDates.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {filters.selectedDates.map((date) => (
                            <div
                                key={date}
                                className="flex border-spacing-0 items-center gap-1 rounded-full border-2 border-gray-300 bg-white px-3 py-1 text-sm text-black"
                            >
                                <div
                                    onClick={() => {
                                        const newSelectedDates =
                                            filters.selectedDates.filter(
                                                (d) => d !== date,
                                            )
                                        setFilters((prev) => ({
                                            ...prev,
                                            selectedDates: newSelectedDates,
                                        }))
                                    }}
                                    className="mr-1 cursor-pointer rounded-full hover:bg-gray-300"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
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
            <div className="grid gap-4">
                <div className="mb-4">
                    {isLoadingPage ? (
                        <div className="text-center text-gray-500">
                            Loading assigned clients...
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                {currentPageItems.map((client) => (
                                    <Link
                                        key={`${client.id}-${client.firstName}-${client.dateOfBirth}`}
                                        href={`/clients/${client.id}`}
                                        className="text-blue-600 hover:text-blue-800 text-lg font-medium"
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
                                        onClick={() =>
                                            setPageNumber(pageNumber - 1)
                                        }
                                        disabled={pageNumber === 1}
                                        className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <span className="flex items-center px-4 py-2 text-sm font-medium text-gray-700">
                                        Page {pageNumber} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() =>
                                            setPageNumber(pageNumber + 1)
                                        }
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
            </div>
        </div>
    )
}
export default SearchComponent

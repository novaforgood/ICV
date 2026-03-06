'use client'

import {
    getAllClientsByLastCheckinDate,
    getClientByCaseManager,
} from '@/api/clients'
import ClientCard from '@/app/_components/ClientCard'
import { YearFilter } from '@/app/_components/dateFilters/yearFilter'
import { useUser } from '@/hooks/useUser'
import { NewClient } from '@/types/client-types'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

const ITEMS_PER_PAGE = 12

const QUARTERS = [
    { label: 'Q1: JUL-SEP', months: ['7', '8', '9'] },
    { label: 'Q2: OCT-DEC', months: ['10', '11', '12'] },
    { label: 'Q3: JAN-MAR', months: ['1', '2', '3'] },
    { label: 'Q4: APR-JUN', months: ['4', '5', '6'] },
]

const SearchComponent = () => {
    const { user } = useUser()
    const [searchTerm, setSearchTerm] = useState('')
    const [managerClients, setManagerClients] = useState<NewClient[]>([])
    const [allClients, setAllClients] = useState<NewClient[]>([])
    const [sortedManagerClients, setSortedManagerClients] = useState<
        NewClient[]
    >([])
    const [sortedAllClients, setSortedAllClients] = useState<NewClient[]>([])
    const [isLoadingPage, setIsLoadingPage] = useState(false)
    const [sortBy, setSortBy] = useState<'asc' | 'desc' | null>(null)
    const [isFilterVisible, setIsFilterVisible] = useState(false)
    const [activeTab, setActiveTab] = useState<'my' | 'all'>('my')
    const [displayedClients, setDisplayedClients] = useState<NewClient[]>([])
    const [filters, setFilters] = useState<{
        dateFilterType: 'calendar' | 'fiscal'
        selectedYear: string
        selectedMonths: string[]
        selectedQuarters: string[]
    }>({
        dateFilterType: 'calendar',
        selectedYear: 'all',
        selectedMonths: [
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12',
        ],
        selectedQuarters: [],
    })
    const [pageNumber, setPageNumber] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [currentPageItems, setCurrentPageItems] = useState<NewClient[]>([])

    useEffect(() => {
        const fetchClients = async () => {
            if (!user?.uid) return

            setIsLoadingPage(true)
            try {
                const [managerClientsData, allClientsData] = await Promise.all([
                    getClientByCaseManager(),
                    getAllClientsByLastCheckinDate(),
                ])

                setManagerClients(managerClientsData as NewClient[])
                setAllClients(allClientsData as NewClient[])
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
        const sortClients = (clients: NewClient[]) => {
            const withDates = clients.filter((client) => client.intakeDate)
            const withoutDates = clients.filter((client) => !client.intakeDate)

            const sortedWithDates = [...withDates].sort((a, b) => {
                const dateA = a.intakeDate
                    ? new Date(a.intakeDate).getTime()
                    : 0
                const dateB = b.intakeDate
                    ? new Date(b.intakeDate).getTime()
                    : 0
                return sortBy === 'asc' ? dateA - dateB : dateB - dateA
            })

            return [...sortedWithDates, ...withoutDates]
        }

        setSortedManagerClients(sortClients(managerClients))
        setSortedAllClients(sortClients(allClients))
    }, [managerClients, allClients, sortBy])

    const handleMonthToggle = (month: string) => {
        setFilters((prev) => ({
            ...prev,
            selectedMonths: prev.selectedMonths.includes(month)
                ? prev.selectedMonths.filter((m) => m !== month)
                : [...prev.selectedMonths, month],
        }))
    }

    const handleQuarterToggle = (quarter: string) => {
        setFilters((prev) => ({
            ...prev,
            selectedQuarters: prev.selectedQuarters.includes(quarter)
                ? prev.selectedQuarters.filter((q) => q !== quarter)
                : [...prev.selectedQuarters, quarter],
        }))
    }

    // Apply filters to a list of clients
    const applyFilters = (clients: NewClient[]) => {
        return clients.filter((client) => {
            // Apply date filter if dates are selected
            if (
                filters.selectedYear !== 'all' ||
                filters.selectedMonths.length > 0 ||
                filters.selectedQuarters.length > 0
            ) {
                const clientDate = new Date(client.intakeDate || '')
                if (isNaN(clientDate.getTime())) return false

                const clientYear = clientDate.getFullYear().toString()
                const clientMonth = (clientDate.getMonth() + 1).toString()

                // Filter by year
                if (
                    filters.selectedYear !== 'all' &&
                    clientYear !== filters.selectedYear
                ) {
                    return false
                }

                // Filter by months or quarters based on date filter type
                if (filters.dateFilterType === 'calendar') {
                    if (
                        filters.selectedMonths.length > 0 &&
                        !filters.selectedMonths.includes(clientMonth)
                    ) {
                        return false
                    }
                } else {
                    if (filters.selectedQuarters.length > 0) {
                        const isInSelectedQuarter =
                            filters.selectedQuarters.some((quarter) => {
                                const quarterMonths = QUARTERS.find(
                                    (q) => q.label === quarter,
                                )?.months
                                if (!quarterMonths) return false
                                return quarterMonths.includes(clientMonth)
                            })
                        if (!isInSelectedQuarter) return false
                    }
                }
            }

            // Apply search term filter if search term exists
            if (searchTerm.trim()) {
                const searchLower = searchTerm.trim().toLowerCase()
                const fullName =
                    client.fullNameLower ??
                    `${client.firstName ?? ''} ${client.lastName ?? ''}`.toLowerCase()
                const clientCode = (client.clientCode ?? '').toLowerCase()

                const matches =
                    fullName.includes(searchLower) ||
                    clientCode.includes(searchLower)
                if (!matches) return false
            }

            return true
        })
    }

    const updateDisplayedClients = async () => {
        // Get the base client list based on active tab
        const baseClients =
            activeTab === 'my' ? sortedManagerClients : sortedAllClients

        // Apply filters to base clients
        const filtered = applyFilters(baseClients)
        const newTotalPages = Math.max(
            1,
            Math.ceil(filtered.length / ITEMS_PER_PAGE),
        )

        setDisplayedClients(filtered)
        setTotalPages(newTotalPages)

        // Ensure current page is valid for new total
        if (pageNumber > newTotalPages) {
            setPageNumber(newTotalPages)
        } else {
            setPageNumber(1)
        }
    }

    // Update displayed clients whenever relevant state changes
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            updateDisplayedClients()
        }, 300)

        return () => clearTimeout(debounceTimer)
    }, [
        activeTab,
        filters.dateFilterType,
        filters.selectedYear,
        filters.selectedMonths,
        filters.selectedQuarters,
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
        if (!displayedClients.length) {
            setCurrentPageItems([])
            return
        }

        // Ensure page number is within valid range
        const maxPage = Math.max(
            1,
            Math.ceil(displayedClients.length / ITEMS_PER_PAGE),
        )
        const validPageNumber = Math.min(Math.max(1, pageNumber), maxPage)

        if (validPageNumber !== pageNumber) {
            setPageNumber(validPageNumber)
            return
        }

        const startIndex = (validPageNumber - 1) * ITEMS_PER_PAGE
        const endIndex = Math.min(
            startIndex + ITEMS_PER_PAGE,
            displayedClients.length,
        )
        const newPageItems = displayedClients.slice(startIndex, endIndex)
        setCurrentPageItems(newPageItems)
    }, [pageNumber, displayedClients])

    // Calculate available years
    const years = Array.from(
        new Set(
            allClients.map((client) =>
                client.intakeDate
                    ? new Date(client.intakeDate).getFullYear()
                    : NaN,
            ),
        ),
    ).sort((a, b) => b - a)

    return (
        <div className="m-[48px] space-y-[40px]">
            <div className="mb-4 mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <h1 className="text-6xl font-bold">Clients</h1>

                {/* Toggle - row below title on screens smaller than lg */}
                <div className="relative inline-flex w-fit items-center justify-start self-start rounded-[20px] bg-zinc-200 p-1 lg:self-center">
                    <div
                        className={`absolute transition-all duration-300 ease-in-out ${activeTab === 'my' ? 'left-1' : 'left-[calc(100%-50%-4px)]'} h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-[16px] bg-black`}
                    />
                    <button
                        onClick={() => handleTabChange('my')}
                        className={`relative flex w-[140px] items-center justify-center gap-2.5 rounded-[16px] px-5 py-2 transition-colors duration-300 ${
                            activeTab === 'my' ? 'text-white' : 'text-black'
                        }`}
                    >
                        <div className="w-full justify-center text-center font-['Epilogue'] text-base font-normal leading-none">
                            My clients
                        </div>
                    </button>
                    <button
                        onClick={() => handleTabChange('all')}
                        className={`relative flex w-[140px] items-center justify-center gap-2.5 rounded-[16px] px-5 py-2 transition-colors duration-300 ${
                            activeTab === 'all' ? 'text-white' : 'text-black'
                        }`}
                    >
                        <div className="w-full justify-center text-center font-['Epilogue'] text-base font-normal leading-none">
                            All clients
                        </div>
                    </button>
                </div>
            </div>

            <div className="mb-8 mt-8 flex items-center gap-4">
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
                        placeholder="Search by name or client code..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-transparent text-base outline-none placeholder:text-gray-700"
                    />
                </div>
                <button
                    className="flex items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
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
                    {sortBy === 'asc' ? 'Newest' : 'Oldest'}
                </button>
                <button
                    className="flex items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsFilterVisible(!isFilterVisible)}
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

            {/* Count display */}
            <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
                <div>
                    <strong>{displayedClients.length}</strong> ICV clients
                </div>
                <span className="text-gray-400">/</span>
                <div>
                    <strong>
                        {displayedClients.reduce((total, client) => {
                            const familyMembers = parseInt(
                                client.familyMembersServiced || '1',
                            )
                            return (
                                total +
                                (isNaN(familyMembers) ? 1 : familyMembers)
                            )
                        }, 0)}
                    </strong>{' '}
                    Total clients
                </div>
            </div>

            {/* Side popup for intake date filters */}
            {isFilterVisible &&
                typeof document !== 'undefined' &&
                createPortal(
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-50 bg-black bg-opacity-50"
                            onClick={() => setIsFilterVisible(false)}
                        />
                        {/* Side menu */}
                        <div className="fixed right-0 top-0 z-50 h-full w-[400px] bg-white px-6 pb-6 pt-4 shadow-xl">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-xl font-semibold">
                                    Filter
                                </h2>
                                <button
                                    onClick={() => setIsFilterVisible(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="h-6 w-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <YearFilter
                                calendarYears={years}
                                fiscalYears={years}
                                isFilterVisible={isFilterVisible}
                                setIsFilterVisible={setIsFilterVisible}
                                dateFilterType={filters.dateFilterType}
                                setDateFilterType={(type) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        dateFilterType: type,
                                        selectedMonths:
                                            type === 'calendar'
                                                ? [
                                                      '1',
                                                      '2',
                                                      '3',
                                                      '4',
                                                      '5',
                                                      '6',
                                                      '7',
                                                      '8',
                                                      '9',
                                                      '10',
                                                      '11',
                                                      '12',
                                                  ]
                                                : [],
                                        selectedQuarters:
                                            type === 'fiscal'
                                                ? [
                                                      'Q1: JUL-SEP',
                                                      'Q2: OCT-DEC',
                                                      'Q3: JAN-MAR',
                                                      'Q4: APR-JUN',
                                                  ]
                                                : [],
                                    }))
                                }
                                selectedYear={filters.selectedYear}
                                setSelectedYear={(year) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        selectedYear: year,
                                    }))
                                }
                                selectedMonths={filters.selectedMonths}
                                handleMonthToggle={handleMonthToggle}
                                selectedQuarters={filters.selectedQuarters}
                                handleQuarterToggle={handleQuarterToggle}
                                layout="vertical"
                                showToggle={false}
                            />
                        </div>
                    </>,
                    document.body,
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
                                        key={`${client.docId}-${client.firstName}-${client.dateOfBirth}`}
                                        href={`/clients/${client.docId}`}
                                        className="text-blue-600 hover:text-blue-800 text-lg font-medium"
                                    >
                                        <ClientCard
                                            client={client}
                                            showLastCheckin={true}
                                            docID={client.docId}
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

'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Symbol from '../../components/Symbol'

// Define props interface
interface ClientCalendarSearchProps {
    onSearchChange: (searchText: string) => void
}

const ClientCalendarSearch = ({
    onSearchChange,
}: ClientCalendarSearchProps) => {
    // Get the current pathname
    const pathname = usePathname()
    const [clientSearch, setClientSearch] = useState('')

    // Only render if we're on a check-ins page
    if (!pathname?.includes('/checkins')) {
        return null
    }

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setClientSearch(newValue)
        onSearchChange(newValue)
    }

    return (
        <div className="flex w-full flex-col items-center justify-center gap-4 pb-6 sm:flex-row">
            <div className="relative w-full max-w-[800px]">
                <input
                    type="text"
                    placeholder="Search clients..."
                    value={clientSearch}
                    onChange={handleSearchChange}
                    className="w-full rounded-md bg-gray-200 py-2 pl-10 pr-4 text-base outline-none placeholder:text-gray-400"
                />
                <Symbol
                    symbol="search"
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-2/3 text-gray-500"
                />
            </div>
            <div className="flex w-full flex-row gap-2 sm:w-auto">
                <button
                    className="flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-[170px] sm:flex-none"
                    // onClick={() => {
                    //     setSortBy((prev) => (prev === 'asc' ? 'desc' : 'asc'))
                    // }}
                >
                    <Symbol
                        symbol="swap_vert"
                        className="h-4 w-4 -translate-y-1/4"
                    />
                    {/* {sortBy === 'asc' ? 'Sort by newest' : 'Sort by oldest'} */}
                </button>
                <button
                    className="flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-[200px] sm:flex-none"
                    // onClick={() => setIsFilterOpen(true)}
                >
                    <Symbol
                        symbol="filter_list"
                        className="h-4 w-4 pb-7 pr-7"
                    />
                    <span className="hidden sm:inline">Filter intake date</span>
                </button>
            </div>
        </div>
    )
}

export default ClientCalendarSearch

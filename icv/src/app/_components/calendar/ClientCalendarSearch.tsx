'use client'

import Symbol from '@/components/Symbol'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import useSWR from 'swr'
import { getAllClients } from '@/api/clients'
import { NewClient } from '@/types/client-types'
import ClientCard from '../ClientCard'

// Define props interface
interface ClientCalendarSearchProps {
    onSearchChange?: (searchText: string) => void
    onSelect?: (clientId: string) => void
}

const ClientCalendarSearch = ({
    onSearchChange,
    onSelect,
}: ClientCalendarSearchProps) => {
    const pathname = usePathname()
    const [clientSearch, setClientSearch] = useState('')
    const { data: clients } = useSWR<NewClient[]>(onSelect ? 'clients' : null, getAllClients)

    // Only apply pathname check when in search-only mode (no onSelect)
    const isSelectionMode = !!onSelect
    if (!isSelectionMode && !pathname?.includes('/checkins')) {
        return null
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setClientSearch(newValue)
        onSearchChange?.(newValue)
    }

    const searchLower = clientSearch.trim().toLowerCase()
    const filteredClients =
        clients?.filter((client) => {
            if (!searchLower) return true
            const fullName =
                client.fullNameLower ??
                `${client.firstName ?? ''} ${client.lastName ?? ''}`.toLowerCase()
            const clientCode = (client.clientCode ?? '').toLowerCase()
            return (
                fullName.includes(searchLower) ||
                clientCode.includes(searchLower)
            )
        }) ?? []

    if (isSelectionMode) {
        return (
            <div className="min-w-0 w-full max-w-full space-y-2">
                <div className="flex min-w-0 flex-1 flex-row items-center gap-2 rounded bg-midground px-4 py-2 text-black">
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
                        value={clientSearch}
                        onChange={handleSearchChange}
                        autoComplete="off"
                        className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-gray-700"
                    />
                </div>
                <div className="min-w-0 max-h-96 space-y-2 overflow-y-auto">
                    {clients === undefined ? (
                        <p className="py-4 text-center text-sm text-gray-500">
                            Loading clients...
                        </p>
                    ) : filteredClients.length === 0 ? (
                        <p className="py-4 text-center text-sm text-gray-500">
                            {clientSearch.trim()
                                ? 'No clients match your search.'
                                : 'No clients found.'}
                        </p>
                    ) : (
                        filteredClients.map((client) => (
                            <div
                                key={client.docId}
                                onClick={() => client.docId && onSelect?.(client.docId)}
                                className="min-w-0 cursor-pointer"
                            >
                                <ClientCard client={client} showLastCheckin={false} />
                            </div>
                        ))
                    )}
                </div>
            </div>
        )
    }

    // Search-only mode: search input + filter/sort buttons (for checkins page)
    return (
        <div className="flex w-full flex-col items-center justify-center gap-4 p-4 sm:flex-row">
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
                >
                    <Symbol
                        symbol="swap_vert"
                        className="h-4 w-4 -translate-y-1/4"
                    />
                </button>
                <button
                    className="flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-[200px] sm:flex-none"
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

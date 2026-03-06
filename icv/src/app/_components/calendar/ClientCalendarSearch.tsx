'use client'

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
    const [clientSearch, setClientSearch] = useState('')
    const { data: clients } = useSWR<NewClient[]>(onSelect ? 'clients' : null, getAllClients)

    if (!onSelect) return null

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

export default ClientCalendarSearch

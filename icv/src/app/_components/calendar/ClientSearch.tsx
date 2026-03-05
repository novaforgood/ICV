import { getAllClients } from '@/api/clients'
import { NewClient } from '@/types/client-types'
import React, { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import ClientCard from '../ClientCard'

interface ClientSearchProps {
    onSelect: (clientId: string) => void
    initialSearch?: string
}

const ClientSearch: React.FC<ClientSearchProps> = ({
    onSelect,
    initialSearch = '',
}) => {
    const { data: clients } = useSWR<NewClient[]>('clients', getAllClients)
    const [search, setSearch] = useState(() => initialSearch ?? '')
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (initialSearch != null) {
            setSearch(initialSearch)
        }
    }, [initialSearch])

    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    const searchLower = search.trim().toLowerCase()
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
        <div className="space-y-2">
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
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or client code..."
                autoComplete="off"
                className="w-full bg-transparent text-base outline-none placeholder:text-gray-700"
            />
            </div>
            <div className="max-h-96 space-y-2 overflow-y-auto">
                {clients === undefined ? (
                    <p className="py-4 text-center text-sm text-gray-500">
                        Loading clients...
                    </p>
                ) : filteredClients.length === 0 ? (
                    <p className="py-4 text-center text-sm text-gray-500">
                        {search.trim()
                            ? 'No clients match your search.'
                            : 'No clients found.'}
                    </p>
                ) : (
                filteredClients.map((client) => (
                    <div
                        key={client.docId}
                        onClick={() => onSelect(client.docId!)}
                        className="cursor-pointer"
                    >
                        <ClientCard client={client} showLastCheckin={false} />
                    </div>
                ))
                )}
            </div>
        </div>
    )
}

export default React.memo(ClientSearch)

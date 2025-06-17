import { getAllClients } from '@/api/clients'
import { NewClient } from '@/types/client-types'
import React, { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import ClientCard from './ClientCard'

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

    const filteredClients =
        clients?.filter((client) => {
            const fullName =
                `${client.firstName ?? ''} ${client.lastName ?? ''}`.toLowerCase()
            return fullName.includes(search.toLowerCase())
        }) ?? []

    return (
        <div>
            <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name"
                className="mb-4 w-full rounded border border-gray-300 p-2"
            />
            <div className="max-h-96 space-y-2 overflow-y-auto">
                {filteredClients.map((client) => (
                    <div
                        key={client.docId}
                        onClick={() => onSelect(client.docId!)}
                        className="cursor-pointer"
                    >
                        <ClientCard client={client} showLastCheckin={false} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default React.memo(ClientSearch)

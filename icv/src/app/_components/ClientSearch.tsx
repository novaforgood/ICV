import React, { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import { getAllClients } from '@/api/clients'
import { NewClient } from '@/types/client-types' // Update path to where you defined your schema

interface ClientSearchProps {
  onSelect: (clientId: string) => void
}

const ClientSearch: React.FC<ClientSearchProps> = ({ onSelect }) => {
  const { data: clients } = useSWR<NewClient[]>('clients', getAllClients)
  const [search, setSearch] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [search])

  const filteredClients = clients?.filter((client) => {
    const fullName = `${client.firstName ?? ''} ${client.lastName ?? ''}`.toLowerCase()
    return fullName.includes(search.toLowerCase())
  }) ?? []

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">Choose A Client</h2>
      <input
        ref={inputRef}
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name"
        className="mb-2 w-full rounded border border-gray-300 p-2"
      />
      <ul className="max-h-48 overflow-y-auto">
        {filteredClients.map((client) => (
          <li
            key={client.docId}
            onClick={() => onSelect(client.docId!)}
            className="cursor-pointer p-2 hover:bg-gray-200"
          >
            {client.firstName} {client.lastName}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default React.memo(ClientSearch)
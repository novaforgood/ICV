'use client'

import { NewClient } from '@/types/client-types'
import React from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'

interface ClientsTableProps {
    clients: NewClient[]
}

const ClientsTable: React.FC<ClientsTableProps> = ({ clients }) => {
    if (!clients?.length) {
        return (
            <div className="text-center p-8 text-gray-500">
                No clients found.
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {clients.map((client) => (
                <div key={client.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="space-y-3">
                        <div className="text-xl font-semibold">
                            <Link href={`/clients/${client.id}`} className="text-blue-600 hover:text-blue-800">
                                {client.firstName} {client.lastName}
                            </Link>
                        </div>
                        <Card className="flex flex-1 flex-row justify-between">
                            <h1>{client.firstName} {client.lastName}</h1>
                            
                        </Card>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ClientsTable

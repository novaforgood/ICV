// app/components/ClientsTable.tsx
import { Client } from '@/types/client-types'
import React from 'react'

interface ClientsTableProps {
    clients: Client[]
}

const ClientsTable: React.FC<ClientsTableProps> = ({ clients }) => {
    return (
        <div>
            <h1>Clients Table</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        {/* Add more headers as needed */}
                    </tr>
                </thead>
                <tbody>
                    {clients.map((client) => (
                        <tr key={client.id}>
                            {' '}
                            {/* Use a unique key here */}
                            <td>
                                {client.firstName} {client.lastName}
                            </td>
                            <td>{client.email}</td>
                            {/* Render other client details */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ClientsTable

// app/components/ClientsTable.tsx
import React from 'react'
import Link from 'next/link'
import { ClientSchema } from '@/types/case-types'

interface ClientsTableProps {
    clients: ClientSchema[];
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
                        <tr key={client.id}> {/* Use a unique key here */}
                            <td>{client.firstName} {client.lastName}</td>
                            <td>{client.email}</td>
                            {/* Render other client details */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ClientsTable;


"use client";

import Link from 'next/link';
import React, { useMemo } from 'react';
import { NewClient } from '@/types/client-types'
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Card } from '@/components/ui/card'

interface ClientsTableProps {
    clients: NewClient[];
}

const ClientsTable: React.FC<ClientsTableProps> = ({ clients }) => {
    // Define table columns
    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
                cell: ({ row }: any) => (
                    <Link href={`/clients/${row.original.id}`} className="text-blue-600 hover:underline">
                        {row.original.firstName} {row.original.lastName}
                    </Link>
                ),
            },
            {
                accessorKey: 'id',
                header: 'Id',
                cell: ({ row }: any) => <div>{row.original.id}</div>
            }
        ],
        []
    );

    // Table instance
    const table = useReactTable({
        data: clients || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div>
            <h1>Clients</h1>
            <table>
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ClientsTable;

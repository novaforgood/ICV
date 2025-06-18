"use client";

import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import { NewClient } from '@/types/client-types'
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    getFilteredRowModel,
} from '@tanstack/react-table';
import { Card } from '@/components/ui/card'

interface ClientsTableProps {
    clients: NewClient[];
}

const ClientsTable: React.FC<ClientsTableProps> = ({ clients }) => {
    const [globalFilter, setGlobalFilter] = useState('');

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
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: (row, columnId, filterValue) => {
            const firstName = row.original.firstName?.toLowerCase() || '';
            return firstName.includes(filterValue.toLowerCase());
        },
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Clients</h1>
                <div className="flex items-center gap-2">
                    <input
                        value={globalFilter ?? ''}
                        onChange={e => setGlobalFilter(e.target.value)}
                        className="rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                        placeholder="Search by first name..."
                    />
                </div>
            </div>
            <div className="rounded-md border">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id} className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-50">
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClientsTable;

'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { NewClient } from '@/types/client-types'
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table'
import React, { useState } from 'react'

import Symbol from '@/components/Symbol'
import { Button } from '@/components/ui/button'
import { CLIENT_TABLE_COLUMNS } from './client-table-columns'

interface ClientsTableProps {
    clients: NewClient[]
}

const ClientsTable: React.FC<ClientsTableProps> = ({ clients }) => {
    const [globalFilter, setGlobalFilter] = useState('')
    const [sorting, setSorting] = useState<SortingState>([])

    const table = useReactTable({
        data: clients,
        columns: CLIENT_TABLE_COLUMNS,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            globalFilter,
        },
    })

    return (
        <div>
            {/* Search Input */}
            {/* <div className="mb-4 flex gap-2">
                <input
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search clients..."
                    className="w-64"
                />
                <Button onClick={() => setGlobalFilter('')}>Clear</Button>
            </div> */}

            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                const canSort = header.column.getCanSort()
                                const sortOrder = header.column.getIsSorted()

                                return (
                                    <TableHead key={header.id}>
                                        <div className="flex items-center gap-1">
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                            {canSort && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        header.column.toggleSorting()
                                                    }
                                                >
                                                    {sortOrder === 'asc' ? (
                                                        <Symbol symbol="keyboard_arrow_up" />
                                                    ) : sortOrder === 'desc' ? (
                                                        <Symbol symbol="keyboard_arrow_down" />
                                                    ) : (
                                                        <Symbol symbol="filter_list" />
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && 'selected'}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={CLIENT_TABLE_COLUMNS.length}
                                className="h-24 text-center"
                            >
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default ClientsTable

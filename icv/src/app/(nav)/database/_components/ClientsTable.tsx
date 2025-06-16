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
    getFacetedRowModel,
    getFacetedUniqueValues,
} from '@tanstack/react-table'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import Symbol from '@/components/Symbol'
import { Button } from '@/components/ui/button'
import { CLIENT_TABLE_COLUMNS } from './client-table-columns'

interface ClientsTableProps {
    clients: NewClient[]
}

const ClientsTable: React.FC<ClientsTableProps> = ({ clients }) => {
    const [globalFilter, setGlobalFilter] = useState('')
    const [sorting, setSorting] = useState<SortingState>([])
    const [currentPage, setCurrentPage] = useState(1)
    const rowsPerPage = 50

    const table = useReactTable({
        data: clients,
        columns: CLIENT_TABLE_COLUMNS,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        enableMultiSort: false,
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            globalFilter,
        },
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedRowModel: getFacetedRowModel(),
    })

    const pageCount = Math.ceil(table.getRowModel().rows.length / rowsPerPage)
    const paginatedRows = table
        .getRowModel()
        .rows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

    // Reset page when sorting or filtering changes
    useEffect(() => {
        setCurrentPage(1)
    }, [globalFilter, sorting])

    return (
        <div className="space-y-[20px]">
            {/* Search Input */}
            <div className="flex flex-row items-center justify-between">
                <div>
                    <strong>{table.getFilteredRowModel().rows.length}</strong> ICV clients
                </div>
                <input
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search..."
                    className="w-[40%] rounded-[5px] bg-[#D8DDE7] px-[12px] py-[6px]"
                />
            </div>

            <div className="space-y-[16px]">
                {/* Pagination Controls */}
                <div className="flex items-center justify-end gap-2 text-neutral-800">
                    <button
                        onClick={() =>
                            setCurrentPage((p) => Math.max(p - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="text-[16px] disabled:cursor-not-allowed disabled:text-gray-300"
                    >
                        <ChevronLeft />
                    </button>
                    <div className="w-[120px] text-center tabular-nums">
                        {table.getFilteredRowModel().rows.length === 0 ? (
                            "0 of 0"
                        ) : (
                            `${(currentPage - 1) * rowsPerPage + 1}–${Math.min(
                                currentPage * rowsPerPage,
                                table.getFilteredRowModel().rows.length,
                            )} of ${table.getFilteredRowModel().rows.length}`
                        )}
                    </div>
                    <button
                        onClick={() =>
                            setCurrentPage((p) => Math.min(p + 1, pageCount))
                        }
                        disabled={currentPage === pageCount}
                        className="text-xl disabled:cursor-not-allowed disabled:text-gray-300"
                    >
                        <ChevronRight />
                    </button>
                </div>

                {/* Table */}
                <Table className="table-fixed">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    const canSort = header.column.getCanSort()
                                    const sortOrder =
                                        header.column.getIsSorted()

                                    return (
                                        <TableHead
                                            key={header.id}
                                            style={{
                                                width: header.column.getSize(),
                                            }}
                                        >
                                            <div className="flex items-center justify-between">
                                                {flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext(),
                                                )}
                                            </div>
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {paginatedRows.length ? (
                            paginatedRows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            style={{
                                                width: cell.column.getSize(),
                                            }}
                                        >
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
        </div>
    )
}

export default ClientsTable

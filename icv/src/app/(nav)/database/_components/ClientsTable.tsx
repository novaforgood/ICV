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
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { YearFilter } from '@/app/_components/dateFilters/yearFilter'
import { CLIENT_TABLE_COLUMNS } from './client-table-columns'

interface ClientsTableProps {
    clients: NewClient[]
}

const ClientsTable: React.FC<ClientsTableProps> = ({ clients }) => {
    const [globalFilter, setGlobalFilter] = useState('')
    const [sorting, setSorting] = useState<SortingState>([])
    const [currentPage, setCurrentPage] = useState(1)
    const rowsPerPage = 50

    // Date filter state
    const [dateFilterType, setDateFilterType] = useState<'calendar' | 'fiscal'>(
        'calendar',
    )
    const [selectedYear, setSelectedYear] = useState<string>('all')
    const [selectedMonths, setSelectedMonths] = useState<string[]>([
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
    ])
    const [selectedQuarters, setSelectedQuarters] = useState<string[]>([
        'Q1: JUL-SEP',
        'Q2: OCT-DEC',
        'Q3: JAN-MAR',
        'Q4: APR-JUN',
    ])
    const [isFilterVisible, setIsFilterVisible] = useState(true)

    const QUARTERS = [
        { label: 'Q1: JUL-SEP', months: ['7', '8', '9'] },
        { label: 'Q2: OCT-DEC', months: ['10', '11', '12'] },
        { label: 'Q3: JAN-MAR', months: ['1', '2', '3'] },
        { label: 'Q4: APR-JUN', months: ['4', '5', '6'] },
    ]

    // Filtering logic
    const [filteredClients, setFilteredClients] = useState<NewClient[]>(clients)
    // Toggle month selection
    const handleMonthToggle = (month: string) => {
        setSelectedMonths((prev) =>
            prev.includes(month)
                ? prev.filter((m) => m !== month)
                : [...prev, month],
        )
    }

    // Toggle quarter selection
    const handleQuarterToggle = (quarter: string) => {
        setSelectedQuarters((prev) =>
            prev.includes(quarter)
                ? prev.filter((q) => q !== quarter)
                : [...prev, quarter],
        )
    }

    const years = Array.from(
        new Set(
            clients.map((record) =>
                record.intakeDate
                    ? new Date(record.intakeDate).getFullYear()
                    : NaN,
            ),
        ),
    ).sort((a, b) => b - a)

    useEffect(() => {
        let filtered = [...clients]

        filtered = filtered.filter((record) => {
            const recordDate = new Date(
                record.intakeDate || record.intakeDate || new Date(),
            ) // adjust field!
            const recordYear = recordDate.getFullYear()
            const recordMonth = (recordDate.getMonth() + 1).toString()

            if (
                selectedYear !== 'all' &&
                recordYear !== parseInt(selectedYear)
            ) {
                return false
            }

            if (dateFilterType === 'calendar') {
                if (
                    selectedMonths.length > 0 &&
                    !selectedMonths.includes(recordMonth)
                ) {
                    return false
                }
            } else {
                if (selectedQuarters.length > 0) {
                    const isInSelectedQuarter = selectedQuarters.some(
                        (quarter) => {
                            const quarterMonths =
                                QUARTERS.find((q) => q.label === quarter)
                                    ?.months || []
                            return quarterMonths.includes(recordMonth)
                        },
                    )
                    if (!isInSelectedQuarter) return false
                }
            }

            return true
        })

        setFilteredClients(filtered)
        setCurrentPage(1)
    }, [
        clients,
        dateFilterType,
        selectedYear,
        selectedMonths,
        selectedQuarters,
    ])

    const table = useReactTable({
        data: filteredClients,
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
            <YearFilter
                years={years}
                isFilterVisible={isFilterVisible}
                setIsFilterVisible={setIsFilterVisible}
                dateFilterType={dateFilterType}
                setDateFilterType={setDateFilterType}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                selectedMonths={selectedMonths}
                handleMonthToggle={handleMonthToggle}
                selectedQuarters={selectedQuarters}
                handleQuarterToggle={handleQuarterToggle}
            />

            <div className="flex flex-row justify-between">
                {/* Search Input */}
                <div className="flex flex-row items-center justify-between">
                    <div>
                        <strong>
                            {table.getFilteredRowModel().rows.length}
                        </strong>{' '}
                        ICV clients
                    </div>
                </div>

                <div className="space-y-[16px]">
                    {/* Pagination Controls */}
                    <div className="flex items-center gap-2 text-neutral-800">
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
                            {table.getFilteredRowModel().rows.length === 0
                                ? '0 of 0'
                                : `${(currentPage - 1) * rowsPerPage + 1}–${Math.min(
                                      currentPage * rowsPerPage,
                                      table.getFilteredRowModel().rows.length,
                                  )} of ${table.getFilteredRowModel().rows.length}`}
                        </div>
                        <button
                            onClick={() =>
                                setCurrentPage((p) =>
                                    Math.min(p + 1, pageCount),
                                )
                            }
                            disabled={currentPage === pageCount}
                            className="text-[16px] disabled:cursor-not-allowed disabled:text-gray-300"
                        >
                            <ChevronRight />
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <Table className="table-fixed">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead
                                        key={header.id}
                                        style={{
                                            width: header.column.getSize(),
                                        }}
                                    >
                                        <div className="flex items-center justify-between">
                                            {flexRender(
                                                header.column.columnDef.header,
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
                                data-state={row.getIsSelected() && 'selected'}
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
    )
}

export default ClientsTable

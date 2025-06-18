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
    SortingState,
    useReactTable,
} from '@tanstack/react-table'
import {
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    Eye,
    EyeOff,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { YearFilter } from '@/app/_components/dateFilters/yearFilter'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select'
import { CLIENT_TABLE_COLUMNS } from './client-table-columns'

interface ClientsTableProps {
    clients: NewClient[]
    isLoading?: boolean
}

const ClientsTable: React.FC<ClientsTableProps> = ({
    clients,
    isLoading = false,
}) => {
    const [globalFilter, setGlobalFilter] = useState('')
    const [sorting, setSorting] = useState<SortingState>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [sortField, setSortField] = useState<string>('intakeDate')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
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
            )
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

        // Apply sorting
        filtered.sort((a, b) => {
            const aValue = a[sortField as keyof NewClient]
            const bValue = b[sortField as keyof NewClient]

            if (aValue === undefined || aValue === null) return 1
            if (bValue === undefined || bValue === null) return -1

            if (sortField === 'intakeDate') {
                const dateA = new Date(aValue as string)
                const dateB = new Date(bValue as string)
                return sortDirection === 'asc'
                    ? dateA.getTime() - dateB.getTime()
                    : dateB.getTime() - dateA.getTime()
            }

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue)
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortDirection === 'asc'
                    ? aValue - bValue
                    : bValue - aValue
            }

            return 0
        })

        setFilteredClients(filtered)
        setCurrentPage(1)
    }, [
        clients,
        dateFilterType,
        selectedYear,
        selectedMonths,
        selectedQuarters,
        sortField,
        sortDirection,
    ])

    const [hiddenColumns, setHiddenColumns] = useState<string[]>([])

    // Helper to reorder columns: visible first, then hidden
    const getOrderedColumns = (columns: any[]) => {
        const visible = columns.filter((col) => !hiddenColumns.includes(col.id))
        const hidden = columns.filter((col) => hiddenColumns.includes(col.id))
        return [...visible, ...hidden]
    }

    const orderedColumns = React.useMemo(
        () => getOrderedColumns(CLIENT_TABLE_COLUMNS),
        [hiddenColumns],
    )

    const table = useReactTable({
        data: filteredClients,
        columns: orderedColumns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        state: {
            sorting,
            globalFilter,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: (row, columnId, filterValue) => {
            const searchTerms = filterValue.toLowerCase().split(' ')
            const firstName = row.original.firstName?.toLowerCase() || ''
            const lastName = row.original.lastName?.toLowerCase() || ''

            // If there's only one search term, check both first and last name
            if (searchTerms.length === 1) {
                return (
                    firstName.includes(searchTerms[0]) ||
                    lastName.includes(searchTerms[0])
                )
            }

            // If there are two search terms, first term should match firstName and second term should match lastName
            if (searchTerms.length === 2) {
                return (
                    firstName.includes(searchTerms[0]) &&
                    lastName.includes(searchTerms[1])
                )
            }

            return false
        },
    })

    const pageCount = Math.ceil(table.getRowModel().rows.length / rowsPerPage)
    const paginatedRows = table
        .getRowModel()
        .rows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

    // Reset page when sorting or filtering changes
    useEffect(() => {
        setCurrentPage(1)
    }, [globalFilter, sortField, sortDirection])

    return (
        <div className="space-y-4">
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

            {isLoading ? (
                <div className="flex h-[400px] items-center justify-center text-lg">
                    Loading clients...
                </div>
            ) : (
                <>
                    <div className="flex flex-row justify-between gap-12">
                        {/* Search Input */}

                        <div className="flex flex-1 flex-row items-center gap-2 rounded bg-midground px-4 py-2 text-black">
                            <svg
                                className="h-4 w-4 flex-shrink-0 -translate-y-[1px] text-gray-700"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search clients..."
                                value={globalFilter}
                                onChange={(e) =>
                                    setGlobalFilter(e.target.value)
                                }
                                className="w-full bg-transparent text-base outline-none placeholder:text-gray-700"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Sort Controls */}
                            <div className="flex items-center gap-2">
                                <Select
                                    value={sortField}
                                    onValueChange={setSortField}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <span>Sort by</span>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="intakeDate">
                                            Intake Date
                                        </SelectItem>
                                        <SelectItem value="firstName">
                                            First Name
                                        </SelectItem>
                                        <SelectItem value="lastName">
                                            Last Name
                                        </SelectItem>
                                        <SelectItem value="age">Age</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setSortDirection((prev) =>
                                            prev === 'asc' ? 'desc' : 'asc',
                                        )
                                    }
                                    className="flex items-center gap-2"
                                >
                                    <ArrowUpDown className="h-4 w-4" />
                                    {sortField === 'intakeDate'
                                        ? sortDirection === 'asc'
                                            ? 'Oldest'
                                            : 'Newest'
                                        : sortField === 'age'
                                          ? sortDirection === 'asc'
                                              ? 'Lowest'
                                              : 'Highest'
                                          : sortDirection === 'asc'
                                            ? 'A-Z'
                                            : 'Z-A'}
                                </Button>
                            </div>

                            {/* Pagination Controls */}
                            <div className="flex items-center gap-2 text-neutral-800">
                                <button
                                    onClick={() =>
                                        setCurrentPage((p) =>
                                            Math.max(p - 1, 1),
                                        )
                                    }
                                    disabled={currentPage === 1}
                                    className="text-[16px] disabled:cursor-not-allowed disabled:text-gray-300"
                                >
                                    <ChevronLeft />
                                </button>
                                <div className="w-[120px] text-center tabular-nums">
                                    {table.getFilteredRowModel().rows.length ===
                                    0
                                        ? '0 of 0'
                                        : `${(currentPage - 1) * rowsPerPage + 1}–${Math.min(
                                              currentPage * rowsPerPage,
                                              table.getFilteredRowModel().rows
                                                  .length,
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
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div>
                                    <strong>
                                        {
                                            table.getFilteredRowModel().rows
                                                .length
                                        }
                                    </strong>{' '}
                                    ICV clients
                                </div>
                                <span className="text-gray-400">/</span>
                                <div>
                                    <strong>
                                        {table
                                            .getFilteredRowModel()
                                            .rows.reduce((total, row) => {
                                                const serviced = parseInt(
                                                    row.original
                                                        .familyMembersServiced ||
                                                        '1',
                                                )
                                                return (
                                                    total +
                                                    (isNaN(serviced)
                                                        ? 1
                                                        : serviced)
                                                )
                                            }, 0)}
                                    </strong>{' '}
                                    Total clients
                                </div>
                            </div>
                        </div>
                        {hiddenColumns.length > 0 && (
                            <button
                                className="text-blue-600 hover:text-blue-800 ml-4 text-sm font-medium underline transition-colors"
                                onClick={() => setHiddenColumns([])}
                                type="button"
                            >
                                Unhide all
                            </button>
                        )}
                    </div>

                    {/* Table */}
                    <Table className="table-fixed">
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map(
                                        (header, index) => {
                                            const isHidden =
                                                hiddenColumns.includes(
                                                    header.column.id,
                                                )
                                            const isLastColumn =
                                                index ===
                                                headerGroup.headers.length - 1
                                            return (
                                                <TableHead
                                                    key={header.id}
                                                    style={{
                                                        width: header.column.getSize(),
                                                        background: isHidden
                                                            ? '#f3f4f6'
                                                            : undefined,
                                                        color: isHidden
                                                            ? '#a3a3a3'
                                                            : undefined,
                                                        opacity: isHidden
                                                            ? 0.5
                                                            : 1,
                                                        pointerEvents: isHidden
                                                            ? 'none'
                                                            : 'auto',
                                                        position: 'relative',
                                                    }}
                                                    className={
                                                        isLastColumn
                                                            ? 'border-r border-gray-200'
                                                            : ''
                                                    }
                                                >
                                                    <div className="flex items-center justify-between">
                                                        {flexRender(
                                                            header.column
                                                                .columnDef
                                                                .header,
                                                            header.getContext(),
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                setHiddenColumns(
                                                                    (prev) =>
                                                                        isHidden
                                                                            ? prev.filter(
                                                                                  (
                                                                                      id,
                                                                                  ) =>
                                                                                      id !==
                                                                                      header
                                                                                          .column
                                                                                          .id,
                                                                              )
                                                                            : [
                                                                                  ...prev,
                                                                                  header
                                                                                      .column
                                                                                      .id,
                                                                              ],
                                                                )
                                                            }}
                                                            style={{
                                                                marginLeft: 8,
                                                                pointerEvents:
                                                                    'auto',
                                                                background:
                                                                    'none',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                color: isHidden
                                                                    ? '#a3a3a3'
                                                                    : '#6b7280',
                                                            }}
                                                            title={
                                                                isHidden
                                                                    ? 'Unhide column'
                                                                    : 'Hide column'
                                                            }
                                                        >
                                                            {isHidden ? (
                                                                <Eye className="h-4 w-4" />
                                                            ) : (
                                                                <EyeOff className="h-4 w-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </TableHead>
                                            )
                                        },
                                    )}
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
                                        {row
                                            .getVisibleCells()
                                            .map((cell, index) => {
                                                const isHidden =
                                                    hiddenColumns.includes(
                                                        cell.column.id,
                                                    )
                                                const isLastColumn =
                                                    index ===
                                                    row.getVisibleCells()
                                                        .length -
                                                        1
                                                return (
                                                    <TableCell
                                                        key={cell.id}
                                                        style={{
                                                            width: cell.column.getSize(),
                                                            background: isHidden
                                                                ? '#f3f4f6'
                                                                : undefined,
                                                            color: isHidden
                                                                ? '#a3a3a3'
                                                                : undefined,
                                                            opacity: isHidden
                                                                ? 0.5
                                                                : 1,
                                                            pointerEvents:
                                                                isHidden
                                                                    ? 'none'
                                                                    : 'auto',
                                                        }}
                                                        className={
                                                            isLastColumn
                                                                ? 'border-r border-gray-200'
                                                                : ''
                                                        }
                                                    >
                                                        <div
                                                            style={{
                                                                pointerEvents:
                                                                    isHidden
                                                                        ? 'none'
                                                                        : 'auto',
                                                            }}
                                                        >
                                                            {flexRender(
                                                                cell.column
                                                                    .columnDef
                                                                    .cell,
                                                                cell.getContext(),
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                )
                                            })}
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
                </>
            )}
        </div>
    )
}

export default ClientsTable

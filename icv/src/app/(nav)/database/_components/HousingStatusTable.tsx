'use client'

import { getAllHousing } from '@/api/make-cases/make-housing'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// Constants for month display and selection
const MONTHS = [
    { full: 'January', short: 'JAN' },
    { full: 'February', short: 'FEB' },
    { full: 'March', short: 'MAR' },
    { full: 'April', short: 'APR' },
    { full: 'May', short: 'MAY' },
    { full: 'June', short: 'JUN' },
    { full: 'July', short: 'JUL' },
    { full: 'August', short: 'AUG' },
    { full: 'September', short: 'SEP' },
    { full: 'October', short: 'OCT' },
    { full: 'November', short: 'NOV' },
    { full: 'December', short: 'DEC' },
]

// Constants for quarter display and selection
const QUARTERS = [
    { label: 'Q1', months: ['1', '2', '3'] },
    { label: 'Q2', months: ['4', '5', '6'] },
    { label: 'Q3', months: ['7', '8', '9'] },
    { label: 'Q4', months: ['10', '11', '12'] },
]

// Available housing status options
const HOUSING_STATUSES = [
    'Homeless',
    'At risk',
    'Vehicle',
    'Sheltered',
    'Transitional housing',
    'Rehabilitation',
    'Permanently housed',
]

const HousingStatusTable = () => {
    // State management for data and UI
    const [housingData, setHousingData] = useState<any[]>([]) // Raw housing data
    const [filteredData, setFilteredData] = useState<any[]>([]) // Filtered data for display
    const [currentPage, setCurrentPage] = useState(1) // Current page number
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest') // Sort direction
    const [statusFilter, setStatusFilter] = useState<string>('all') // Selected housing status
    const [isDateFilterOpen, setIsDateFilterOpen] = useState(false) // Filter panel visibility
    const [dateFilterType, setDateFilterType] = useState<'calendar' | 'fiscal'>(
        'calendar',
    ) // Date filter type
    const [selectedYear, setSelectedYear] = useState<string>('all') // Selected year
    const [selectedMonths, setSelectedMonths] = useState<string[]>(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']) // All months selected by default
    const [selectedQuarters, setSelectedQuarters] = useState<string[]>(['Q1', 'Q2', 'Q3', 'Q4']) // All quarters selected by default

    const itemsPerPage = 20 // Number of items to display per page
    const router = useRouter()

    // Fetch housing data on component mount
    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllHousing()
            setHousingData(data)
        }
        fetchData()
    }, [])

    // Apply filters and sorting whenever relevant state changes
    useEffect(() => {
        if (housingData.length === 0) return

        let filtered = [...housingData]

        // Apply housing status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(
                (record) => record.housing_status === statusFilter,
            )
        }

        // Apply date filters (year, months, quarters)
        if (
            selectedYear !== 'all' ||
            selectedMonths.length > 0 ||
            selectedQuarters.length > 0
        ) {
            filtered = filtered.filter((record) => {
                const recordDate = new Date(record.date)
                const recordYear = recordDate.getFullYear()
                const recordMonth = (recordDate.getMonth() + 1).toString()

                // Filter by year
                if (
                    selectedYear !== 'all' &&
                    recordYear !== parseInt(selectedYear)
                ) {
                    return false
                }

                // Filter by months or quarters based on date filter type
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
        }

        // Apply sorting by date
        filtered.sort((a, b) => {
            const dateA = new Date(a.date)
            const dateB = new Date(b.date)
            return sortOrder === 'newest'
                ? dateB.getTime() - dateA.getTime()
                : dateA.getTime() - dateB.getTime()
        })

        setFilteredData(filtered)
        setCurrentPage(1) // Reset to first page when filters change
    }, [
        housingData,
        statusFilter,
        sortOrder,
        dateFilterType,
        selectedYear,
        selectedMonths,
        selectedQuarters,
    ])

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

    // Get unique years from housing data for year filter
    const years = Array.from(
        new Set(
            housingData.map((record) => new Date(record.date).getFullYear()),
        ),
    ).sort((a, b) => b - a)

    // Pagination calculations
    const totalPages = Math.ceil(filteredData.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentData = filteredData.slice(startIndex, endIndex)

    return (
        <div className="flex flex-col gap-8">
            {/* Main content area */}
            <div className="flex-1 space-y-[20px]">
                {/* Filter panel - at the top */}
                <div className="w-full pb-8">
                    <div className="space-y-6">
                        {/* Year type selection - horizontal layout */}
                        <div className="flex gap-8">
                            {/* Calendar year filter section */}
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        checked={dateFilterType === 'calendar'}
                                        onChange={() =>
                                            setDateFilterType('calendar')
                                        }
                                        className="h-4 w-4"
                                    />
                                    <label className="text-sm font-medium">
                                        Calendar Year
                                    </label>
                                </div>
                                <div
                                    className={`space-y-4 pl-6 ${dateFilterType === 'fiscal' ? 'pointer-events-none opacity-50' : ''}`}
                                >
                                    {/* Year selection */}
                                    <div>
                                        <label className="mb-2 block text-sm font-medium">
                                            Year
                                        </label>
                                        <Select
                                            value={selectedYear}
                                            onValueChange={setSelectedYear}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select year" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    All Years
                                                </SelectItem>
                                                {years.map((year) => (
                                                    <SelectItem
                                                        key={year}
                                                        value={year.toString()}
                                                    >
                                                        {year}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {/* Month selection */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">
                                            Months
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex gap-2">
                                                    {MONTHS.slice(0, 3).map(
                                                        (month, index) => (
                                                            <button
                                                                key={month.full}
                                                                onClick={() =>
                                                                    handleMonthToggle(
                                                                        (
                                                                            index +
                                                                            1
                                                                        ).toString(),
                                                                    )
                                                                }
                                                                className={`rounded-full px-1.5 py-0.5 text-sm transition-colors whitespace-nowrap w-12 ${
                                                                    dateFilterType === 'calendar' && selectedMonths.includes(
                                                                        (
                                                                            index +
                                                                            1
                                                                        ).toString(),
                                                                    )
                                                                        ? 'bg-black text-white'
                                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                                }`}
                                                            >
                                                                {month.short}
                                                            </button>
                                                        ),
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    {MONTHS.slice(3, 6).map(
                                                        (month, index) => (
                                                            <button
                                                                key={month.full}
                                                                onClick={() =>
                                                                    handleMonthToggle(
                                                                        (
                                                                            index +
                                                                            4
                                                                        ).toString(),
                                                                    )
                                                                }
                                                                className={`rounded-full px-1.5 py-0.5 text-sm transition-colors whitespace-nowrap w-12 ${
                                                                    dateFilterType === 'calendar' && selectedMonths.includes(
                                                                        (
                                                                            index +
                                                                            4
                                                                        ).toString(),
                                                                    )
                                                                        ? 'bg-black text-white'
                                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                                }`}
                                                            >
                                                                {month.short}
                                                            </button>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex gap-2">
                                                    {MONTHS.slice(6, 9).map(
                                                        (month, index) => (
                                                            <button
                                                                key={month.full}
                                                                onClick={() =>
                                                                    handleMonthToggle(
                                                                        (
                                                                            index +
                                                                            7
                                                                        ).toString(),
                                                                    )
                                                                }
                                                                className={`rounded-full px-1.5 py-0.5 text-sm transition-colors whitespace-nowrap w-12 ${
                                                                    dateFilterType === 'calendar' && selectedMonths.includes(
                                                                        (
                                                                            index +
                                                                            7
                                                                        ).toString(),
                                                                    )
                                                                        ? 'bg-black text-white'
                                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                                }`}
                                                            >
                                                                {month.short}
                                                            </button>
                                                        ),
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    {MONTHS.slice(9).map(
                                                        (month, index) => (
                                                            <button
                                                                key={month.full}
                                                                onClick={() =>
                                                                    handleMonthToggle(
                                                                        (
                                                                            index +
                                                                            10
                                                                        ).toString(),
                                                                    )
                                                                }
                                                                className={`rounded-full px-1.5 py-0.5 text-sm transition-colors whitespace-nowrap w-12 ${
                                                                    dateFilterType === 'calendar' && selectedMonths.includes(
                                                                        (
                                                                            index +
                                                                            10
                                                                        ).toString(),
                                                                    )
                                                                        ? 'bg-black text-white'
                                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                                }`}
                                                            >
                                                                {month.short}
                                                            </button>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Fiscal year filter section */}
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        checked={dateFilterType === 'fiscal'}
                                        onChange={() =>
                                            setDateFilterType('fiscal')
                                        }
                                        className="h-4 w-4"
                                    />
                                    <label className="text-sm font-medium">
                                        Fiscal Year
                                    </label>
                                </div>
                                <div
                                    className={`space-y-4 pl-6 ${dateFilterType === 'calendar' ? 'pointer-events-none opacity-50' : ''}`}
                                >
                                    {/* Year selection */}
                                    <div>
                                        <label className="mb-2 block text-sm font-medium">
                                            Year
                                        </label>
                                        <Select
                                            value={selectedYear}
                                            onValueChange={setSelectedYear}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select year" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    All Years
                                                </SelectItem>
                                                {years.map((year) => (
                                                    <SelectItem
                                                        key={year}
                                                        value={year.toString()}
                                                    >
                                                        {year}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {/* Quarter selection */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">
                                            Quarters
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {QUARTERS.map((quarter) => (
                                                <button
                                                    key={quarter.label}
                                                    onClick={() =>
                                                        handleQuarterToggle(
                                                            quarter.label,
                                                        )
                                                    }
                                                    className={`rounded-full px-3 py-1 text-sm transition-colors ${
                                                        dateFilterType === 'fiscal' && selectedQuarters.includes(
                                                            quarter.label,
                                                        )
                                                            ? 'bg-black text-white'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    {quarter.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Header with record count and filter controls */}
                <div className="flex flex-row items-center justify-between">
                    <div>
                        <strong>{filteredData.length}</strong> Housing Records
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Housing status filter dropdown */}
                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Statuses
                                </SelectItem>
                                {HOUSING_STATUSES.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Sort order toggle button */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                setSortOrder(
                                    sortOrder === 'newest'
                                        ? 'oldest'
                                        : 'newest',
                                )
                            }
                            className="flex items-center gap-2"
                        >
                            <ArrowUpDown className="h-4 w-4" />
                            {sortOrder === 'newest' ? 'Oldest' : 'Newest'}
                        </Button>

                        {/* Pagination controls */}
                        <div className="flex items-center gap-2 text-neutral-800">
                            <button
                                onClick={() =>
                                    setCurrentPage((p) => Math.max(p - 1, 1))
                                }
                                disabled={currentPage === 1}
                                className="text-[16px] disabled:cursor-not-allowed disabled:text-gray-300"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>

                            <div className="w-[120px] text-center text-sm tabular-nums">
                                {filteredData.length === 0
                                    ? '0 of 0'
                                    : `${startIndex + 1}–${Math.min(endIndex, filteredData.length)} of ${filteredData.length}`}
                            </div>

                            <button
                                onClick={() =>
                                    setCurrentPage((p) =>
                                        Math.min(p + 1, totalPages),
                                    )
                                }
                                disabled={currentPage === totalPages}
                                className="text-[16px] disabled:cursor-not-allowed disabled:text-gray-300"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Data table */}
                <div className="space-y-[16px]">
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Housing Status</TableHead>
                                    <TableHead>Housed by ICV</TableHead>
                                    <TableHead>Client Profile</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentData.map((record, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            {record.date &&
                                            !isNaN(
                                                new Date(record.date).getTime(),
                                            )
                                                ? new Date(
                                                      record.date,
                                                  ).toLocaleDateString()
                                                : 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            {record.housingStatus}
                                        </TableCell>
                                        <TableCell>
                                            {record.housed_by_icv
                                                ? 'Yes'
                                                : 'No'}
                                        </TableCell>
                                        <TableCell>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    router.push(
                                                        `/clients/${record.clientID}`,
                                                    )
                                                }
                                            >
                                                View
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HousingStatusTable

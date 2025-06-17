'use client'

import { getAllHousing } from '@/api/make-cases/make-housing'
import { YearFilter } from '@/app/_components/dateFilters/yearFilter'
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
    { label: 'Q1: JUL-SEP', months: ['1', '2', '3'] },
    { label: 'Q2: OCT-DEC', months: ['4', '5', '6'] },
    { label: 'Q3: JAN-MAR', months: ['7', '8', '9'] },
    { label: 'Q4: APR-JUN', months: ['10', '11', '12'] },
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
    const [housingData, setHousingData] = useState<any[]>([])
    const [filteredData, setFilteredData] = useState<any[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [dateFilterType, setDateFilterType] = useState<'calendar' | 'fiscal'>(
        'calendar',
    ) // default selection to calendar year
    const [selectedYear, setSelectedYear] = useState<string>('all') // default select all years
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
    ]) // default select all months
    const [selectedQuarters, setSelectedQuarters] = useState<string[]>([
        'Q1: JUL-SEP',
        'Q2: OCT-DEC',
        'Q3: JAN-MAR',
        'Q4: APR-JUN',
    ]) // default select all quarters
    const [isFilterVisible, setIsFilterVisible] = useState(true)

    const itemsPerPage = 20
    const router = useRouter()

    // fetch housing status data on component mount
    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllHousing()
            setHousingData(data)
        }
        fetchData()
    }, [])

    // applies filters + sorting to housing data
    useEffect(() => {
        if (housingData.length === 0) return

        let filtered = [...housingData]

        // choose what housing status to see
        if (statusFilter !== 'all') {
            filtered = filtered.filter(
                (record) =>
                    record.housingStatus?.toLowerCase() ===
                    statusFilter.toLowerCase(),
            )
        }

        // apply date filters (year, months, quarters)
        if (
            selectedYear !== 'all' ||
            selectedMonths.length > 0 ||
            selectedQuarters.length > 0
        ) {
            filtered = filtered.filter((record) => {
                const recordDate = new Date(record.date)
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
        }

        filtered.sort((a, b) => {
            const dateA = new Date(a.date)
            const dateB = new Date(b.date)
            return sortOrder === 'newest'
                ? dateB.getTime() - dateA.getTime()
                : dateA.getTime() - dateB.getTime()
        })

        setFilteredData(filtered)
        setCurrentPage(1) // reset to page 1 when filters change
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

    // show all years available in the data
    const years = Array.from(
        new Set(
            housingData.map((record) => new Date(record.date).getFullYear()),
        ),
    ).sort((a, b) => b - a)

    const totalPages = Math.ceil(filteredData.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentData = filteredData.slice(startIndex, endIndex)

    return (
        <div className="flex flex-col gap-8">
            <div className="flex-1 space-y-[20px]">
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

                {/* record count and filter controls */}
                <div className="flex flex-row items-center justify-between">
                    <div>
                        <strong>{filteredData.length}</strong> Housing Records
                    </div>
                    <div className="flex items-center gap-2">
                        {/* housing status filter dropdown */}
                        <Select
                            value={statusFilter}
                            onValueChange={(value) => setStatusFilter(value)}
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

                        {/* sort order toggle button */}
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

                        {/* pagination controls */}
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

                {/* data table */}
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

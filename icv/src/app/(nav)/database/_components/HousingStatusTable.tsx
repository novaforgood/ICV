'use client'

import { getAllHousing } from '@/api/make-cases/make-housing'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { ChevronLeft, ChevronRight, ArrowUpDown, Calendar } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import FilterPanel from '@/components/ui/filter-panel'

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
    { full: 'December', short: 'DEC' }
]

const QUARTERS = [
    { label: 'Q1', months: ['1', '2', '3'] },
    { label: 'Q2', months: ['4', '5', '6'] },
    { label: 'Q3', months: ['7', '8', '9'] },
    { label: 'Q4', months: ['10', '11', '12'] }
]

const HOUSING_STATUSES = [
    'Homeless',
    'At risk',
    'Vehicle',
    'Sheltered',
    'Transitional housing',
    'Rehabilitation',
    'Permanently housed'
]

const HousingStatusTable = () => {
    const [housingData, setHousingData] = useState<any[]>([])
    const [filteredData, setFilteredData] = useState<any[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [isDateFilterOpen, setIsDateFilterOpen] = useState(false)
    const [dateFilterType, setDateFilterType] = useState<'calendar' | 'fiscal'>('calendar')
    const [selectedYear, setSelectedYear] = useState<string>('all')
    const [selectedMonths, setSelectedMonths] = useState<string[]>([])
    const [selectedQuarters, setSelectedQuarters] = useState<string[]>([])

    const itemsPerPage = 10

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllHousing()
            setHousingData(data)
        }
        fetchData()
    }, [])

    useEffect(() => {
        if (housingData.length === 0) return

        let filtered = [...housingData]

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(record => record.housing_status === statusFilter)
        }

        // Apply date filters
        if (selectedYear !== 'all' || selectedMonths.length > 0 || selectedQuarters.length > 0) {
            filtered = filtered.filter(record => {
                const recordDate = new Date(record.date)
                const recordYear = recordDate.getFullYear()
                const recordMonth = (recordDate.getMonth() + 1).toString()

                if (selectedYear !== 'all' && recordYear !== parseInt(selectedYear)) {
                    return false
                }

                if (dateFilterType === 'calendar') {
                    if (selectedMonths.length > 0 && !selectedMonths.includes(recordMonth)) {
                        return false
                    }
                } else {
                    if (selectedQuarters.length > 0) {
                        const isInSelectedQuarter = selectedQuarters.some(quarter => {
                            const quarterMonths = QUARTERS.find(q => q.label === quarter)?.months || []
                            return quarterMonths.includes(recordMonth)
                        })
                        if (!isInSelectedQuarter) return false
                    }
                }

                return true
            })
        }

        // Apply sorting
        filtered.sort((a, b) => {
            const dateA = new Date(a.date)
            const dateB = new Date(b.date)
            return sortOrder === 'newest' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime()
        })

        setFilteredData(filtered)
        setCurrentPage(1)
    }, [housingData, statusFilter, sortOrder, dateFilterType, selectedYear, selectedMonths, selectedQuarters])

    const handleMonthToggle = (month: string) => {
        setSelectedMonths(prev =>
            prev.includes(month)
                ? prev.filter(m => m !== month)
                : [...prev, month]
        )
    }

    const handleQuarterToggle = (quarter: string) => {
        setSelectedQuarters(prev =>
            prev.includes(quarter)
                ? prev.filter(q => q !== quarter)
                : [...prev, quarter]
        )
    }

    const years = Array.from(
        new Set(
            housingData.map(record => new Date(record.date).getFullYear())
        )
    ).sort((a, b) => b - a)

    const totalPages = Math.ceil(filteredData.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentData = filteredData.slice(startIndex, endIndex)

    return (
        <div className="space-y-[20px]">
            <div className="flex flex-row items-center justify-between">
                <div>
                    <strong>{filteredData.length}</strong> Housing Records
                </div>
                <div className="flex items-center gap-2">
                    <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            {HOUSING_STATUSES.map((status) => (
                                <SelectItem key={status} value={status}>
                                    {status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsDateFilterOpen(true)}
                        className="flex items-center gap-2"
                    >
                        <Calendar className="h-4 w-4" />
                        Filter by Log Date
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
                        className="flex items-center gap-2"
                    >
                        <ArrowUpDown className="h-4 w-4" />
                        Sort by {sortOrder === 'newest' ? 'Oldest' : 'Newest'}
                    </Button>
                </div>
            </div>

            <FilterPanel
                isOpen={isDateFilterOpen}
                onClose={() => setIsDateFilterOpen(false)}
                title="Filter by Date"
            >
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <input
                                type="radio"
                                checked={dateFilterType === 'calendar'}
                                onChange={() => setDateFilterType('calendar')}
                                className="h-4 w-4"
                            />
                            <label className="text-sm font-medium">Calendar Year</label>
                        </div>
                        <div className={`pl-6 space-y-4 ${dateFilterType === 'fiscal' ? 'opacity-50 pointer-events-none' : ''}`}>
                            <div>
                                <label className="block text-sm font-medium mb-2">Year</label>
                                <Select
                                    value={selectedYear}
                                    onValueChange={setSelectedYear}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Years</SelectItem>
                                        {years.map((year) => (
                                            <SelectItem key={year} value={year.toString()}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Months</label>
                                <div className="flex flex-wrap gap-2">
                                    {MONTHS.map((month, index) => (
                                        <button
                                            key={month.full}
                                            onClick={() => handleMonthToggle((index + 1).toString())}
                                            className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                                selectedMonths.includes((index + 1).toString())
                                                    ? 'bg-black text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            {month.short}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <input
                                type="radio"
                                checked={dateFilterType === 'fiscal'}
                                onChange={() => setDateFilterType('fiscal')}
                                className="h-4 w-4"
                            />
                            <label className="text-sm font-medium">Fiscal Year</label>
                        </div>
                        <div className={`pl-6 space-y-4 ${dateFilterType === 'calendar' ? 'opacity-50 pointer-events-none' : ''}`}>
                            <div>
                                <label className="block text-sm font-medium mb-2">Year</label>
                                <Select
                                    value={selectedYear}
                                    onValueChange={setSelectedYear}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Years</SelectItem>
                                        {years.map((year) => (
                                            <SelectItem key={year} value={year.toString()}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Quarters</label>
                                <div className="flex flex-wrap gap-2">
                                    {QUARTERS.map((quarter) => (
                                        <button
                                            key={quarter.label}
                                            onClick={() => handleQuarterToggle(quarter.label)}
                                            className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                                selectedQuarters.includes(quarter.label)
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
            </FilterPanel>

            <div className="space-y-[16px]">
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Client ID</TableHead>
                                <TableHead>Housing Status</TableHead>
                                <TableHead>Housed by ICV</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentData.map((record, index) => (
                                <TableRow key={index}>
                                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{record.client_id}</TableCell>
                                    <TableCell>{record.housing_status}</TableCell>
                                    <TableCell>{record.housed_by_icv ? 'Yes' : 'No'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} records
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HousingStatusTable

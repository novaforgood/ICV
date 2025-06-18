import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { ChevronDown, ChevronUp } from 'lucide-react'

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

interface YearFilterProps {
    years: number[]
    isFilterVisible: boolean
    setIsFilterVisible: (visible: boolean) => void
    dateFilterType: 'calendar' | 'fiscal'
    setDateFilterType: (type: 'calendar' | 'fiscal') => void
    selectedYear: string
    setSelectedYear: (year: string) => void
    selectedMonths?: string[]
    handleMonthToggle: (month: string) => void
    selectedQuarters?: string[]
    handleQuarterToggle: (quarter: string) => void
    layout?: 'horizontal' | 'vertical'
    showToggle?: boolean
}

export const YearFilter: React.FC<YearFilterProps> = ({
    years,
    isFilterVisible,
    setIsFilterVisible,
    dateFilterType,
    setDateFilterType,
    selectedYear,
    setSelectedYear,
    selectedMonths = [],
    handleMonthToggle,
    selectedQuarters = [],
    handleQuarterToggle,
    layout = 'horizontal',
    showToggle = true,
}) => {
    return (
        <div className="flex-1 space-y-[20px]">
            {/* Filter toggle button */}
            {showToggle && (
                <button
                    onClick={() => setIsFilterVisible(!isFilterVisible)}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                >
                    {isFilterVisible ? (
                        <>
                            <ChevronUp className="h-4 w-4" />
                            Hide Filters
                        </>
                    ) : (
                        <>
                            <ChevronDown className="h-4 w-4" />
                            Show Filters
                        </>
                    )}
                </button>
            )}

            {/* filter panel */}
            {isFilterVisible && (
                <div className="w-full pb-8">
                    <div className="space-y-6">
                        <div
                            className={`flex ${layout === 'vertical' ? 'flex-col md:flex-row lg:flex-col' : 'gap-8'}`}
                        >
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center justify-between space-x-2">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            checked={dateFilterType === 'calendar'}
                                            onChange={() => setDateFilterType('calendar')}
                                            className="h-4 w-4"
                                        />
                                        <label className="ml-2 text-sm font-medium">
                                            Calendar Year
                                        </label>
                                    </div>
                                </div>
                                <div
                                    className={`space-y-4 pl-6 ${dateFilterType === 'fiscal' ? 'pointer-events-none opacity-50' : ''}`}
                                >
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
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label className="block text-sm font-medium">
                                                Months
                                            </label>
                                            {dateFilterType === 'calendar' && (
                                                selectedMonths.length === 12 ? (
                                                    <button
                                                        type="button"
                                                        className="text-xs text-blue-600 hover:underline"
                                                        onClick={() => selectedMonths.forEach(m => handleMonthToggle(m))}
                                                    >
                                                        Deselect all
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        className="text-xs text-blue-600 hover:underline"
                                                        onClick={() => {
                                                            for (let i = 1; i <= 12; i++) {
                                                                const monthStr = i.toString();
                                                                if (!selectedMonths.includes(monthStr)) {
                                                                    handleMonthToggle(monthStr);
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        Select all
                                                    </button>
                                                )
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-2 sm:hidden">
                                            {MONTHS.map((month, index) => (
                                                <button
                                                    key={month.full}
                                                    onClick={() =>
                                                        handleMonthToggle(
                                                            (
                                                                index + 1
                                                            ).toString(),
                                                        )
                                                    }
                                                    className={`w-12 whitespace-nowrap rounded-full px-1.5 py-0.5 text-sm transition-colors ${
                                                        dateFilterType ===
                                                            'calendar' &&
                                                        selectedMonths.includes(
                                                            (
                                                                index + 1
                                                            ).toString(),
                                                        )
                                                            ? 'bg-black text-white'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    {month.short}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="hidden gap-2 sm:grid sm:grid-cols-2">
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
                                                                className={`w-12 whitespace-nowrap rounded-full px-1.5 py-0.5 text-sm transition-colors ${
                                                                    dateFilterType ===
                                                                        'calendar' &&
                                                                    selectedMonths.includes(
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
                                                                className={`w-12 whitespace-nowrap rounded-full px-1.5 py-0.5 text-sm transition-colors ${
                                                                    dateFilterType ===
                                                                        'calendar' &&
                                                                    selectedMonths.includes(
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
                                                                className={`w-12 whitespace-nowrap rounded-full px-1.5 py-0.5 text-sm transition-colors ${
                                                                    dateFilterType ===
                                                                        'calendar' &&
                                                                    selectedMonths.includes(
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
                                                                className={`w-12 whitespace-nowrap rounded-full px-1.5 py-0.5 text-sm transition-colors ${
                                                                    dateFilterType ===
                                                                        'calendar' &&
                                                                    selectedMonths.includes(
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

                            <div
                                className={`flex-1 space-y-4 ${layout === 'vertical' ? 'mt-8 md:mt-0 lg:mt-8' : ''}`}
                            >
                                <div className="flex items-center justify-between space-x-2">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            checked={dateFilterType === 'fiscal'}
                                            onChange={() => setDateFilterType('fiscal')}
                                            className="h-4 w-4"
                                        />
                                        <label className="ml-2 text-sm font-medium">
                                            Fiscal Year
                                        </label>
                                    </div>
                                </div>
                                <div
                                    className={`space-y-4 pl-6 ${dateFilterType === 'calendar' ? 'pointer-events-none opacity-50' : ''}`}
                                >
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
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label className="block text-sm font-medium">
                                                Quarters
                                            </label>
                                            {dateFilterType === 'fiscal' && (
                                                selectedQuarters.length === 4 ? (
                                                    <button
                                                        type="button"
                                                        className="text-xs text-blue-600 hover:underline"
                                                        onClick={() => selectedQuarters.forEach(q => handleQuarterToggle(q))}
                                                    >
                                                        Deselect all
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        className="text-xs text-blue-600 hover:underline"
                                                        onClick={() => {
                                                            const allQuarters = [
                                                                'Q1: JUL-SEP',
                                                                'Q2: OCT-DEC',
                                                                'Q3: JAN-MAR',
                                                                'Q4: APR-JUN',
                                                            ];
                                                            allQuarters.forEach(q => {
                                                                if (!selectedQuarters.includes(q)) {
                                                                    handleQuarterToggle(q);
                                                                }
                                                            });
                                                        }}
                                                    >
                                                        Select all
                                                    </button>
                                                )
                                            )}
                                        </div>
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
                                                        dateFilterType ===
                                                            'fiscal' &&
                                                        selectedQuarters.includes(
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
            )}
        </div>
    )
}

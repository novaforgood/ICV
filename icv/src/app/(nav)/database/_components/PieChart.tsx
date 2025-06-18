'use client'

import { YearFilter } from '@/app/_components/dateFilters/yearFilter'
import { fetchCheckInCounterData } from '@/lib/firestoreUtils'
import { useEffect, useState } from 'react'
import {
    Cell,
    Pie,
    PieChart as RechartsPieChart,
    ResponsiveContainer,
    Tooltip,
} from 'recharts'

const COLORS = ['#B6CCE2', '#4A7CA5', '#23425B', '#1A2633']

type ChartData = {
    name: string
    value: number
}

type CheckInCounterEntry = {
    docId: string
    data: Record<string, number>
}

const QUARTERS = [
    { label: 'Q1: JUL-SEP', months: ['7', '8', '9'] },
    { label: 'Q2: OCT-DEC', months: ['10', '11', '12'] },
    { label: 'Q3: JAN-MAR', months: ['1', '2', '3'] },
    { label: 'Q4: APR-JUN', months: ['4', '5', '6'] },
]

const PieChart = () => {
    const [entries, setEntries] = useState<CheckInCounterEntry[]>([])
    const [years, setYears] = useState<number[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const [data, setData] = useState<ChartData[]>([
        { name: 'Hygiene Kits', value: 0 },
        { name: 'Hot Meals', value: 0 },
        { name: 'Snack Packs', value: 0 },
        { name: 'Client Check-Ins', value: 0 },
    ])

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

    const [isLargeScreen, setIsLargeScreen] = useState(false)

    // Track screen size for layout switching
    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 1024px)')
        setIsLargeScreen(mediaQuery.matches)

        const handler = (event: MediaQueryListEvent) =>
            setIsLargeScreen(event.matches)
        mediaQuery.addEventListener('change', handler)

        return () => {
            mediaQuery.removeEventListener('change', handler)
        }
    }, [])

    // Set all quarters as selected when switching to fiscal year
    useEffect(() => {
        if (dateFilterType === 'fiscal') {
            setSelectedQuarters([
                'Q1: JUL-SEP',
                'Q2: OCT-DEC',
                'Q3: JAN-MAR',
                'Q4: APR-JUN',
            ])
        }
    }, [dateFilterType])

    // Fetch data once
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const fetchedEntries = await fetchCheckInCounterData()
                setEntries(fetchedEntries)

                const uniqueYears = Array.from(
                    new Set(
                        fetchedEntries.map((entry) =>
                            parseInt(entry.docId.split('-')[0]),
                        ),
                    ),
                )
                    .filter((year): year is number => !isNaN(year))
                    .sort((a, b) => b - a)

                setYears(uniqueYears)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    // Apply filters to compute pie data
    useEffect(() => {
        const totals = { 'Hygiene Kits': 0, 'Hot Meals': 0, 'Snack Packs': 0 }
        let checkInCount = 0

        entries.forEach(({ docId, data }) => {
            const [year, monthStr] = docId.split('-')
            const recordYear = parseInt(year)
            const recordMonth = parseInt(monthStr).toString()

            if (selectedYear !== 'all' && recordYear !== parseInt(selectedYear))
                return

            if (dateFilterType === 'calendar') {
                if (!selectedMonths.includes(recordMonth)) return
            } else {
                const isInSelectedQuarter = selectedQuarters.some((quarter) => {
                    const quarterMonths =
                        QUARTERS.find((q) => q.label === quarter)?.months || []
                    return quarterMonths.includes(recordMonth)
                })
                if (!isInSelectedQuarter) return
            }

            totals['Hygiene Kits'] += data['Hygiene Kit'] || 0
            totals['Hot Meals'] += data['Hot Meal'] || 0
            totals['Snack Packs'] += data['Snack Pack'] || 0
            checkInCount += 1
        })

        setData([
            { name: 'Hygiene Kits', value: totals['Hygiene Kits'] },
            { name: 'Hot Meals', value: totals['Hot Meals'] },
            { name: 'Snack Packs', value: totals['Snack Packs'] },
            { name: 'Client Check-Ins', value: checkInCount },
        ])
    }, [
        entries,
        dateFilterType,
        selectedYear,
        selectedMonths,
        selectedQuarters,
    ])

    const total = data.reduce((sum, d) => sum + d.value, 0)

    const handleMonthToggle = (month: string) => {
        setSelectedMonths((prev) =>
            prev.includes(month)
                ? prev.filter((m) => m !== month)
                : [...prev, month],
        )
    }

    const handleQuarterToggle = (quarter: string) => {
        setSelectedQuarters((prev) =>
            prev.includes(quarter)
                ? prev.filter((q) => q !== quarter)
                : [...prev, quarter],
        )
    }

    return (
        <div className="flex w-full flex-col lg:flex-row lg:justify-between">
            {/* Pie Chart */}
            <div className="order-2 flex flex-col items-center lg:order-1">
                <div className="self-start">
                    <h2 className="text-2xl font-bold">Check-Ins</h2>
                </div>

                {isLoading ? (
                    <div className="flex h-[500px] w-[500px] items-center justify-center text-lg">
                        Loading data...
                    </div>
                ) : (
                    <>
                        <div className="relative h-[500px] w-[500px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsPieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={120}
                                        outerRadius={240}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {data.map((entry, idx) => (
                                            <Cell
                                                key={entry.name}
                                                fill={COLORS[idx % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </RechartsPieChart>
                            </ResponsiveContainer>
                            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                <span className="mb-1 text-lg font-bold tracking-widest text-gray-400">
                                    TOTAL
                                </span>
                                <span className="text-6xl font-extrabold">
                                    {total.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Custom Legend */}
                        <div className="mt-12 flex justify-center gap-16">
                            {data.map((entry, idx) => {
                                const percent = total
                                    ? Math.round((entry.value / total) * 100)
                                    : 0
                                return (
                                    <div
                                        key={entry.name}
                                        className="flex flex-col items-center"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="inline-block h-4 w-4 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        COLORS[idx % COLORS.length],
                                                }}
                                            />
                                            <span className="font-semibold text-gray-700">
                                                {entry.name}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {entry.value.toLocaleString()} ({percent}%)
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}
            </div>

            {/* Filter Panel */}
            <div className="order-1 mb-8 w-full lg:order-2 lg:mb-0 lg:w-[400px]">
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
                    layout={isLargeScreen ? 'vertical' : 'horizontal'}
                />
            </div>
        </div>
    )
}

export default PieChart

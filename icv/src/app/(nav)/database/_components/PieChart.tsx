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

// Constants for quarters
const QUARTERS = [
    { label: 'Q1: JUL-SEP', months: ['7', '8', '9'] },
    { label: 'Q2: OCT-DEC', months: ['10', '11', '12'] },
    { label: 'Q3: JAN-MAR', months: ['1', '2', '3'] },
    { label: 'Q4: APR-JUN', months: ['4', '5', '6'] },
]

const PieChart = () => {
    const [data, setData] = useState<ChartData[]>([
        { name: 'Hygiene Kits', value: 0 },
        { name: 'Hot Meals', value: 0 },
        { name: 'Snack Packs', value: 0 },
        { name: 'Client Check-Ins', value: 0 },
    ])

    const [entries, setEntries] = useState<CheckInCounterEntry[]>([])
    const [dateFilterType, setDateFilterType] = useState<'calendar' | 'fiscal'>('calendar')
    const [selectedYear, setSelectedYear] = useState<string>('all')
    const [selectedMonths, setSelectedMonths] = useState<string[]>([
        '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'
    ])
    const [selectedQuarters, setSelectedQuarters] = useState<string[]>([
        'Q1: JAN-MAR', 'Q2: APR-JUN', 'Q3: JUL-SEP', 'Q4: OCT-DEC'
    ])
    const [isFilterVisible, setIsFilterVisible] = useState(true)

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

    useEffect(() => {
        const fetchData = async () => {
            const fetchedEntries = await fetchCheckInCounterData()
            setEntries(fetchedEntries)
        }
        fetchData()
    }, [])

    // Apply filters when entries change or filter state changes
    useEffect(() => {
        const totals = { 'Hygiene Kits': 0, 'Hot Meals': 0, 'Snack Packs': 0 }
        let checkInCount = 0

        entries.forEach(({ docId, data }) => {
            const [year, monthStr] = docId.split('-')
            const recordYear = parseInt(year)
            const recordMonth = parseInt(monthStr).toString()

            if (selectedYear !== 'all' && recordYear !== parseInt(selectedYear)) return

            if (dateFilterType === 'calendar') {
                if (!selectedMonths.includes(recordMonth)) return
            } else {
                // For fiscal year, we need to check if the month is in any of the selected quarters
                const isInSelectedQuarter = selectedQuarters.some((quarter) => {
                    const quarterMonths = QUARTERS.find((q) => q.label === quarter)?.months || []
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
    }, [entries, dateFilterType, selectedYear, selectedMonths, selectedQuarters])

    const total = data.reduce((sum, d) => sum + d.value, 0)

    // Unique years from the data
    const years = Array.from(
        new Set(entries.map((entry) => parseInt(entry.docId.split('-')[0]))),
    ).filter((year): year is number => !isNaN(year)).sort((a, b) => b - a)

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
        <div className="flex flex-col items-left w-full px-10">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Check-In Pie Chart</h2>
            </div>

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

            <div className="relative mt-8 h-[420px] w-[420px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={100}
                            outerRadius={200}
                            fill="#8884d8"
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, idx) => (
                                <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </RechartsPieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-gray-400 font-bold tracking-widest text-lg mb-1">TOTAL</span>
                    <span className="text-5xl font-extrabold">{total.toLocaleString()}</span>
                </div>
            </div>

            {/* Custom Legend */}
            <div className="flex justify-left gap-10 mt-8">
                {data.map((entry, idx) => {
                    const percent = total ? Math.round((entry.value / total) * 100) : 0
                    return (
                        <div key={entry.name} className="flex flex-col items-center">
                            <div className="flex items-center gap-2">
                                <span
                                    className="inline-block w-4 h-4 rounded-full"
                                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                                />
                                <span className="font-semibold text-gray-700">{entry.name}</span>
                            </div>
                            <div className="text-gray-500 text-sm">
                                {entry.value.toLocaleString()} ({percent}%)
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default PieChart 
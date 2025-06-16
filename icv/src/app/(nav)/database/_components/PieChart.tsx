'use client'

import { useEffect, useState } from 'react'
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import FilterPanel from '@/app/_components/FilterPanel'
import { fetchCheckInCounterData } from '@/lib/firestoreUtils'

const COLORS = ['#B6CCE2', '#4A7CA5', '#23425B', '#1A2633']

type Filters = {
    selectedDates: string[];
    dateType: string;
}

type ChartData = {
    name: string;
    value: number;
}

type CheckInCounterEntry = {
    docId: string;
    data: Record<string, number>;
}

const PieChart = () => {
    const [data, setData] = useState<ChartData[]>([
        { name: 'Hygiene Kits', value: 0 },
        { name: 'Hot Meals', value: 0 },
        { name: 'Snack Packs', value: 0 },
        { name: 'Client Check-Ins', value: 0 },
    ])
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [filters, setFilters] = useState<Filters>({
        selectedDates: [],
        dateType: 'Month',
    })

    const applyDateFilter = (docId: string) => {
        if (filters.selectedDates.length === 0) return true;
        const [year, monthNum] = docId.split('-');
        const date = new Date(Number(year), Number(monthNum) - 1, 1);
        switch (filters.dateType) {
            case 'Month':
                return filters.selectedDates.includes(date.toLocaleString('default', { month: 'long' }));
            case 'Quarter': {
                const quarter = Math.floor(date.getMonth() / 3) + 1;
                return filters.selectedDates.includes(`Q${quarter}`);
            }
            case 'Year':
            case 'Fiscal Year':
                return filters.selectedDates.includes(year);
            default:
                return true;
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const entries: CheckInCounterEntry[] = await fetchCheckInCounterData();
            const totals = { 'Hygiene Kits': 0, 'Hot Meals': 0, 'Snack Packs': 0 };
            let checkInCount = 0;
            entries.forEach(({ docId, data }) => {
                if (applyDateFilter(docId)) {
                    totals['Hygiene Kits'] += data['Hygiene Kit'] || 0;
                    totals['Hot Meals'] += data['Hot Meal'] || 0;
                    totals['Snack Packs'] += data['Snack Pack'] || 0;
                    checkInCount += 1;
                }
            });
            setData([
                { name: 'Hygiene Kits', value: totals['Hygiene Kits'] },
                { name: 'Hot Meals', value: totals['Hot Meals'] },
                { name: 'Snack Packs', value: totals['Snack Packs'] },
                { name: 'Client Check-Ins', value: checkInCount },
            ]);
        };
        fetchData();
    }, [filters]);

    const total = data.reduce((sum, d) => sum + d.value, 0);

    return (
        <div className="flex flex-col items-left w-full px-10">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Pie Chart</h2>
                <div className="flex items-center gap-2">
                    {filters.selectedDates.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {filters.selectedDates.map((date) => (
                                <div 
                                    key={date} 
                                    className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm text-black border-spacing-0 border-gray-300 border-2"
                                >
                                    <div
                                        onClick={() => {
                                            const newSelectedDates = filters.selectedDates.filter(d => d !== date);
                                            setFilters(prev => ({
                                                ...prev,
                                                selectedDates: newSelectedDates
                                            }));
                                        }}
                                        className="mr-1 rounded-full hover:bg-gray-300 cursor-pointer"
                                    >
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            className="h-4 w-4" 
                                            fill="none" 
                                            viewBox="0 0 24 24" 
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                    <span>{date}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    <button
                        className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsFilterOpen(true)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="h-4 w-4"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
                            />
                        </svg>
                        Filter date
                    </button>
                </div>
            </div>
            {isFilterOpen && (
                <FilterPanel
                    currentFilters={filters}
                    onClose={() => setIsFilterOpen(false)}
                    onFilter={(newFilters: Filters) => {
                        setFilters(newFilters)
                        setIsFilterOpen(false)
                    }}
                />
            )}
            <div className="relative w-[420px] h-[420px]">
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
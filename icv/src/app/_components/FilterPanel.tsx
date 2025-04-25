'use client'

import { useState } from 'react'

interface FilterPanelProps {
    currentFilters: { selectedDates: string[]; dateType: string }
    onClose: () => void
    onFilter: (filters: { selectedDates: string[]; dateType: string }) => void
}

type DateType = 'Month' | 'Quarter' | 'Year' | 'Fiscal Year'

export default function FilterPanel({ currentFilters, onClose, onFilter }: FilterPanelProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [selectedDateType, setSelectedDateType] = useState<DateType>(currentFilters.dateType as DateType)
    const [selectedDates, setSelectedDates] = useState<string[]>(currentFilters.selectedDates)

    const dateTypes = ['Month', 'Quarter', 'Year', 'Fiscal Year'] as const

    const dateTypeLists = {
        'Month': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        'Quarter': ['Q1', 'Q2', 'Q3', 'Q4'],
        'Year': ['2024', '2025', '2026', '2027', '2028', '2029', '2030'],
        'Fiscal Year': ['2024', '2025', '2026', '2027', '2028', '2029', '2030']
    }

    const handleFilter = () => {
        onFilter({ selectedDates, dateType: selectedDateType })
    }

    const toggleDateSelection = (date: string) => {
        setSelectedDates(prev => 
            prev.includes(date) 
                ? prev.filter(d => d !== date)
                : [...prev, date]
        )
    }

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div 
                className="w-72 bg-white rounded-[5px] shadow-[0px_2px_16px_0px_rgba(0,0,0,0.10)] inline-flex flex-col justify-start items-start overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="self-stretch px-3 py-2 bg-white inline-flex justify-between items-center">
                    <div className="justify-center text-black text-base font-normal font-['Epilogue'] leading-none">
                        Filter by
                    </div>
                    <div className="w-48 inline-flex justify-start items-start">
                        <button 
                            className="h-9 px-3 py-2 bg-white rounded-[5px] outline outline-2 outline-offset-[-2px] outline-slate-400 inline-flex justify-between items-center w-full"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <div className="justify-center text-black text-base font-normal font-['Epilogue'] leading-none">
                                {selectedDateType}
                            </div>
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {isDropdownOpen && (
                    <div className="w-full px-3 py-2">
                        <div className="w-full bg-white rounded-[5px] shadow-[0px_2px_16px_0px_rgba(0,0,0,0.10)]">
                            {dateTypes.map((type) => (
                                <div
                                    key={type}
                                    className={`w-full h-9 px-3 py-2 inline-flex items-center gap-2 cursor-pointer hover:bg-gray-50 ${
                                        selectedDateType === type ? 'bg-white' : ''
                                    }`}
                                    onClick={() => {
                                        setSelectedDateType(type)
                                        setIsDropdownOpen(false)
                                        setSelectedDates([])
                                    }}
                                >
                                    <div className="size-6 relative overflow-hidden">
                                        <div className="size-4 left-[3.50px] top-[3.50px] absolute border border-black" />
                                        {selectedDateType === type && (
                                            <div className="w-2.5 h-2 left-[7px] top-[8px] absolute bg-black" />
                                        )}
                                    </div>
                                    <div className={`justify-center text-base font-normal font-['Epilogue'] leading-none ${
                                        selectedDateType === type ? 'text-black' : 'text-black'
                                    }`}>
                                        {type}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="w-full px-3 py-2 max-h-[300px] overflow-auto">
                    {dateTypeLists[selectedDateType].map((date) => (
                        <div 
                            key={date}
                            className="w-full h-9 px-3 py-2 inline-flex items-center gap-2 cursor-pointer hover:bg-gray-50"
                            onClick={() => toggleDateSelection(date)}
                        >
                            <div className="size-6 relative overflow-hidden">
                                <div className="size-4 left-[3.50px] top-[3.50px] absolute border border-black" />
                                {selectedDates.includes(date) && (
                                    <div className="w-2.5 h-2 left-[7px] top-[8px] absolute bg-black" />
                                )}
                            </div>
                            <div className={`justify-center text-base font-normal font-['Epilogue'] leading-none ${
                                selectedDates.includes(date) ? 'text-black' : 'text-black'
                            }`}>
                                {date}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="self-stretch px-3 py-4 bg-white inline-flex justify-between items-center border-t">
                    
                    <button
                        onClick={handleFilter}
                        className={`h-8 min-w-24 px-3 py-2 rounded-[5px] flex justify-center items-center gap-1 mx-auto ${
                            'bg-black hover:bg-gray-700'
                        }`}
                    >
                        <div className="text-center justify-center text-white text-sm font-normal font-['Epilogue'] leading-none">
                            Apply Filter
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}
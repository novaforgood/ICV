'use client'

import { getAllCheckInCounts, incrementCheckInCount } from '@/api/events'
import { CheckInCategory } from '@/types/event-types'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectViewport,
} from '@radix-ui/react-select'
import React, { useEffect, useState } from 'react'
import Symbol from '../../components/Symbol'

const CheckInCounter: React.FC = () => {
    const [timeFrame, setTimeFrame] = useState<string>('day')
    const [isLoading, setIsLoading] = useState(true)

    const [hygieneKits, setHygieneKits] = useState<{ [key: string]: number }>({
        day: 0,
        month: 0,
        year: 0,
    })
    const [hotMeals, setHotMeals] = useState<{ [key: string]: number }>({
        day: 0,
        month: 0,
        year: 0,
    })
    const [snackPacks, setSnackPacks] = useState<{ [key: string]: number }>({
        day: 0,
        month: 0,
        year: 0,
    })

    const handleIncrement = (
        item: 'hygieneKits' | 'hotMeals' | 'snackPacks',
    ) => {
        const now = new Date()
        if (item === 'hygieneKits') {
            setHygieneKits((prev) => ({
                day: prev.day + 1,
                month: prev.month + 1,
                year: prev.year + 1,
            }))
            incrementCheckInCount(CheckInCategory.enum['Hygiene Kit'], now)
        } else if (item === 'hotMeals') {
            setHotMeals((prev) => ({
                day: prev.day + 1,
                month: prev.month + 1,
                year: prev.year + 1,
            }))
            incrementCheckInCount(CheckInCategory.enum['Hot Meal'], now)
        } else if (item === 'snackPacks') {
            setSnackPacks((prev) => ({
                day: prev.day + 1,
                month: prev.month + 1,
                year: prev.year + 1,
            }))
            incrementCheckInCount(CheckInCategory.enum['Snack Pack'], now)
        }
    }

    const handleDecrement = (
        item: 'hygieneKits' | 'hotMeals' | 'snackPacks',
    ) => {
        const now = new Date()
        if (item === 'hygieneKits') {
            setHygieneKits((prev) => ({
                day: prev.day - 1,
                month: prev.month - 1,
                year: prev.year - 1,
            }))
            incrementCheckInCount(CheckInCategory.enum['Hygiene Kit'], now, -1)
        } else if (item === 'hotMeals') {
            setHotMeals((prev) => ({
                day: prev.day - 1,
                month: prev.month - 1,
                year: prev.year - 1,
            }))
            incrementCheckInCount(CheckInCategory.enum['Hot Meal'], now, -1)
        } else if (item === 'snackPacks') {
            setSnackPacks((prev) => ({
                day: prev.day - 1,
                month: prev.month - 1,
                year: prev.year - 1,
            }))
            incrementCheckInCount(CheckInCategory.enum['Snack Pack'], now, -1)
        }
    }

    useEffect(() => {
        const date = new Date()

        async function updateCounts() {
            try {
                const data = await getAllCheckInCounts(date)

                setHygieneKits({
                    day: data.day['Hygiene Kit'] || 0,
                    month: data.month['Hygiene Kit'] || 0,
                    year: data.year['Hygiene Kit'] || 0,
                })

                setHotMeals({
                    day: data.day['Hot Meal'] || 0,
                    month: data.month['Hot Meal'] || 0,
                    year: data.year['Hot Meal'] || 0,
                })

                setSnackPacks({
                    day: data.day['Snack Pack'] || 0,
                    month: data.month['Snack Pack'] || 0,
                    year: data.year['Snack Pack'] || 0,
                })

                setIsLoading(false)
            } catch (error) {
                console.error('Failed to fetch check-in counts:', error)
            }
        }

        updateCounts()
    }, [])

    return (
        <div>
            <div className="mb-4 flex w-full items-center justify-between">
                <h2 className="text-2xl font-semibold">Check-Ins</h2>
                <select
                    value={timeFrame}
                    onChange={(e) => setTimeFrame(e.target.value)}
                    className="w-40 rounded-md border border-gray-300 bg-white px-3 py-2"
                >
                    <option value="day">Day</option>
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                </select>
            </div>

            {isLoading ? (
                <div className="flex h-[300px] items-center justify-center text-2xl text-gray-500">
                    Loading...
                </div>
            ) : (
                <>
                    <h2 className="font-epilogue self-stretch text-center text-[22px] font-medium leading-[24px] text-[#246F95]">
                        Total
                    </h2>
                    <h2 className="font-epilogue self-stretch text-center text-[40px] font-bold not-italic leading-[56px] text-[#246f95]">
                        {hygieneKits[timeFrame] +
                            hotMeals[timeFrame] +
                            snackPacks[timeFrame]}
                    </h2>

                    <div className="grid grid-cols-3 gap-1 md:grid-cols-1">
                        {/* Hygiene Kits */}
                        <div className="mb-4 flex items-center justify-between rounded-lg bg-sky p-4 shadow-md">
                            <div>
                                <p className="text-background">Hygiene Kits</p>
                                <h1 className="text-4xl font-bold text-background">
                                    {hygieneKits[timeFrame]}
                                </h1>
                            </div>
                            <div className="flex items-center space-x-1">
                                {hygieneKits['day'] > 0 && (
                                    <button
                                        onClick={() =>
                                            handleDecrement('hygieneKits')
                                        }
                                        className="flex h-6 w-6 items-center justify-center rounded-full border-foreground bg-background text-foreground"
                                    >
                                        -
                                    </button>
                                )}
                                <button
                                    onClick={() =>
                                        handleIncrement('hygieneKits')
                                    }
                                    className="flex h-6 w-6 items-center justify-center rounded-full border-foreground bg-background text-foreground"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Hot Meals */}
                        <div className="mb-4 flex items-center justify-between rounded-lg bg-blue p-4 shadow-md">
                            <div>
                                <p className="text-background">Hot Meals</p>
                                <h1 className="text-4xl font-bold text-background">
                                    {hotMeals[timeFrame]}
                                </h1>
                            </div>
                            <div className="flex items-center space-x-1">
                                {hotMeals['day'] > 0 && (
                                    <button
                                        onClick={() =>
                                            handleDecrement('hotMeals')
                                        }
                                        className="flex h-6 w-6 items-center justify-center rounded-full border-foreground bg-background text-foreground"
                                    >
                                        -
                                    </button>
                                )}
                                <button
                                    onClick={() => handleIncrement('hotMeals')}
                                    className="flex h-6 w-6 items-center justify-center rounded-full border-foreground bg-background text-foreground"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Snack Packs */}
                        <div className="mb-4 flex items-center justify-between rounded-lg bg-navy p-4 shadow-md">
                            <div>
                                <p className="text-background">Snack Packs</p>
                                <h1 className="text-4xl font-bold text-background">
                                    {snackPacks[timeFrame]}
                                </h1>
                            </div>
                            <div className="flex items-center space-x-1">
                                {snackPacks['day'] > 0 && (
                                    <button
                                        onClick={() =>
                                            handleDecrement('snackPacks')
                                        }
                                        className="flex h-6 w-6 items-center justify-center rounded-full border-foreground bg-background text-foreground"
                                    >
                                        -
                                    </button>
                                )}
                                <button
                                    onClick={() =>
                                        handleIncrement('snackPacks')
                                    }
                                    className="flex h-6 w-6 items-center justify-center rounded-full border-foreground bg-background text-foreground"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default CheckInCounter

import React, { useState, useEffect } from 'react';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectViewport,
    SelectItem,
} from '@radix-ui/react-select';
import { format, set } from 'date-fns';
import Symbol from '../../components/Symbol';
import { Card } from '@/components/ui/card';
import { incrementCheckInCount, getCheckInCountYear, getCheckInCountMonth, getCheckInCountDay } from '@/api/events'; // Adjust the import path as necessary
import { CheckInCategory } from '@/types/event-types'; // Adjust the import path as necessary
import { Check } from 'lucide-react';
import { time } from 'console';

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

const CheckInCounter: React.FC = () => {
    const [timeFrame, setTimeFrame] = useState<string>('day');

    // States for each item count
    const [hygieneKits, setHygieneKits] = useState<{ [key: string]: number }>({
        "day": 0,
        "month": 0,
        "year": 0,
    });
    const [hotMeals, setHotMeals] = useState<{ [key: string]: number }>({
        "day": 0,
        "month": 0,
        "year": 0,
    });
    const [snackPacks, setSnackPacks] = useState<{ [key: string]: number }>({
        "day": 0,
        "month": 0,
        "year": 0,
    });

    // A common increment handler based on an identifier
    const handleIncrement = (item: 'hygieneKits' | 'hotMeals' | 'snackPacks') => {
        if (item === 'hygieneKits') {
            setHygieneKits(prev => ({
                day: prev.day + 1,
                month: prev.month + 1,
                year: prev.year + 1,
              }));
            incrementCheckInCount(CheckInCategory.enum["Hygiene Kit"], new Date())
        } else if (item === 'hotMeals') {
            setHotMeals(prev => ({
                day: prev.day + 1,
                month: prev.month + 1,
                year: prev.year + 1,
              }));
            incrementCheckInCount(CheckInCategory.enum["Hot Meal"], new Date())
        } else if (item === 'snackPacks') {
            setSnackPacks(prev => ({
                day: prev.day + 1,
                month: prev.month + 1,
                year: prev.year + 1,
              }));
            incrementCheckInCount(CheckInCategory.enum["Snack Pack"], new Date())
        }
    };

    const handleDecrement = (item: 'hygieneKits' | 'hotMeals' | 'snackPacks') => {
        if (item === 'hygieneKits') {
            setHygieneKits(prev => ({
                day: prev.day - 1,
                month: prev.month - 1,
                year: prev.year - 1,
              }));
            incrementCheckInCount(CheckInCategory.enum["Hygiene Kit"], new Date(), -1);
        } else if (item === 'hotMeals') {
            setHotMeals(prev => ({
                day: prev.day - 1,
                month: prev.month - 1,
                year: prev.year - 1,
              }));
            incrementCheckInCount(CheckInCategory.enum["Hot Meal"], new Date(), -1)
        } else if (item === 'snackPacks') {
            setSnackPacks(prev => ({
                day: prev.day - 1,
                month: prev.month - 1,
                year: prev.year - 1,
              }));
            incrementCheckInCount(CheckInCategory.enum["Snack Pack"], new Date(), -1)
        }
    };

    useEffect(() => {
        const date = new Date();
        async function updateCounts() {
            try {
                // Hygiene Kits counts
                const hygieneDay = await getCheckInCountDay(CheckInCategory.enum["Hygiene Kit"], date);
                const hygieneMonth = await getCheckInCountMonth(CheckInCategory.enum["Hygiene Kit"], date);
                const hygieneYear = await getCheckInCountYear(CheckInCategory.enum["Hygiene Kit"], date);
                setHygieneKits({ day: hygieneDay, month: hygieneMonth, year: hygieneYear });

                // Hot Meals counts
                const hotMealDay = await getCheckInCountDay(CheckInCategory.enum["Hot Meal"], date);
                const hotMealMonth = await getCheckInCountMonth(CheckInCategory.enum["Hot Meal"], date);
                const hotMealYear = await getCheckInCountYear(CheckInCategory.enum["Hot Meal"], date);
                setHotMeals({ day: hotMealDay, month: hotMealMonth, year: hotMealYear });

                // Snack Packs counts
                const snackPackDay = await getCheckInCountDay(CheckInCategory.enum["Snack Pack"], date);
                const snackPackMonth = await getCheckInCountMonth(CheckInCategory.enum["Snack Pack"], date);
                const snackPackYear = await getCheckInCountYear(CheckInCategory.enum["Snack Pack"], date);
                setSnackPacks({ day: snackPackDay, month: snackPackMonth, year: snackPackYear });
            } catch (error) {
                console.error('Error fetching check-in counts:', error);
            }
        }
        updateCounts();
    }, []) ;

    return (
        <div>
            <div className="flex items-center gap-10 mb-4">
                <h2 className="text-2xl font-semibold">Check-Ins</h2>
                <Select value={timeFrame} onValueChange={setTimeFrame}>
                    <SelectTrigger className="flex justify-between items-center bg-white w-40 rounded-md border border-gray-300 px-3 py-2">
                        <SelectValue>{timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)}</SelectValue>
                        <Symbol symbol="arrow_drop_down" className="ml-2" />
                    </SelectTrigger>
                    <SelectContent
                        className="bg-white rounded-md border border-gray-200 shadow-md"
                        align="center"
                        sideOffset={4}
                    >
                        <SelectViewport>
                            <SelectItem
                                value="day"
                                className="px-3 py-2 hover:bg-blue-100 focus:bg-blue-100"
                            >
                                Day
                            </SelectItem>
                            <SelectItem
                                value="month"
                                className="px-3 py-2 hover:bg-blue-100 focus:bg-blue-100"
                            >
                                Month
                            </SelectItem>
                            <SelectItem
                                value="year"
                                className="px-3 py-2 hover:bg-blue-100 focus:bg-blue-100"
                            >
                                Year
                            </SelectItem>
                        </SelectViewport>
                    </SelectContent>
                </Select>
            </div>

            <h2 className="self-stretch text-[#246F95] text-center font-epilogue text-[22px] font-medium leading-[24px]">
                Total
            </h2>
            <h2 className="self-stretch text-[#246f95] text-center font-epilogue text-[40px] not-italic font-bold leading-[56px]">
                {hygieneKits[timeFrame] + hotMeals[timeFrame] + snackPacks[timeFrame]}
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-1 gap-4">
                {/* Hygiene Kits Card */}
                <div className="flex items-center justify-between mb-4 p-4 rounded-lg shadow-md bg-sky">
                    <div>
                        <p className="text-background">Hygiene Kits</p>
                        <h1 className="text-4xl font-bold text-background">{hygieneKits[timeFrame]}</h1>
                    </div>
                    <div className="flex items-center space-x-1">
                        {hygieneKits['day'] > 0 && (
                            <button
                            onClick={() => handleDecrement('hygieneKits')}
                            className="bg-background border-foreground text-foreground w-6 h-6 flex items-center justify-center rounded-full"
                            >
                            -
                            </button>
                        )}
                        <button
                        onClick={() => handleIncrement('hygieneKits')}
                        className="bg-background border-foreground text-foreground w-6 h-6 flex items-center justify-center rounded-full"
                        >
                        +
                        </button>
                    </div>
                </div>

                {/* Hot Meals Card */}
                <div className="flex items-center justify-between mb-4 p-4 rounded-lg shadow-md bg-blue">
                    <div>
                        <p className="text-background">Hot Meals</p>
                        <h1 className="text-4xl font-bold text-background">{hotMeals[timeFrame]}</h1>
                    </div>
                    <div className="flex items-center space-x-1">
                        {hotMeals['day'] > 0 && (
                            <button
                            onClick={() => handleDecrement('hotMeals')}
                            className="bg-background border-foreground text-foreground w-6 h-6 flex items-center justify-center rounded-full"
                            >
                            -
                            </button>
                        )}
                        <button
                        onClick={() => handleIncrement('hotMeals')}
                        className="bg-background border-foreground text-foreground w-6 h-6 flex items-center justify-center rounded-full"
                        >
                        +
                        </button>
                    </div>
                </div>

                {/* Snack Packs Card */}
                <div className="flex items-center justify-between mb-4 p-4 rounded-lg shadow-md bg-navy">
                    <div>
                        <p className="text-background">Snack Packs</p>
                        <h1 className="text-4xl font-bold text-background">{snackPacks[timeFrame]}</h1>
                    </div>
                    <div className="flex items-center space-x-1">
                        {snackPacks['day'] > 0 && (
                            <button
                            onClick={() => handleDecrement('snackPacks')}
                            className="bg-background border-foreground text-foreground w-6 h-6 flex items-center justify-center rounded-full"
                            >
                            -
                            </button>
                        )}
                        <button
                        onClick={() => handleIncrement('snackPacks')}
                        className="bg-background border-foreground text-foreground w-6 h-6 flex items-center justify-center rounded-full"
                        >
                        +
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckInCounter;
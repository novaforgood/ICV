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
    const [hygieneKits, setHygieneKits] = useState<number>(0);
    const [hotMeals, setHotMeals] = useState<number>(0);
    const [snackPacks, setSnackPacks] = useState<number>(0);

    // A common increment handler based on an identifier
    const handleIncrement = (item: 'hygieneKits' | 'hotMeals' | 'snackPacks') => {
        if (item === 'hygieneKits') {
            setHygieneKits(prev => prev + 1);
            incrementCheckInCount(CheckInCategory.enum["Hygiene Kit"], new Date());
        } else if (item === 'hotMeals') {
            setHotMeals(prev => prev + 1);
            incrementCheckInCount(CheckInCategory.enum["Hot Meal"], new Date());
        } else if (item === 'snackPacks') {
            setSnackPacks(prev => prev + 1);
            incrementCheckInCount(CheckInCategory.enum["Snack Pack"], new Date());
        }
    };

    const handleDecrement = (item: 'hygieneKits' | 'hotMeals' | 'snackPacks') => {
        if (item === 'hygieneKits' && hygieneKits > 0) {
            setHygieneKits(prev => Math.max(0, prev - 1));
            incrementCheckInCount(CheckInCategory.enum["Hygiene Kit"], new Date(), -1);
        } else if (item === 'hotMeals' && hotMeals > 0) {
            setHotMeals(prev => Math.max(0, prev - 1));
            incrementCheckInCount(CheckInCategory.enum["Hot Meal"], new Date(), -1);
        } else if (item === 'snackPacks' && snackPacks > 0) {
            setSnackPacks(prev => Math.max(0, prev - 1));
            incrementCheckInCount(CheckInCategory.enum["Snack Pack"], new Date(), -1);
        }
    };

    useEffect(() => {
        const date = new Date();
        console.log('time frame '+ timeFrame);

        try {
            if (timeFrame === 'day') {
                getCheckInCountDay(CheckInCategory.enum["Hygiene Kit"], date).then((count) => {
                    setHygieneKits(count);
                })    
                getCheckInCountDay(CheckInCategory.enum["Hot Meal"], date).then((count) => {
                    setHotMeals(count);
                })   
                getCheckInCountDay(CheckInCategory.enum["Snack Pack"], date).then((count) => {
                    setSnackPacks(count);
                })   
            } else if (timeFrame === 'month') {
                getCheckInCountMonth(CheckInCategory.enum["Hygiene Kit"], date).then((count) => {
                    setHygieneKits(count);
                })    
                getCheckInCountMonth(CheckInCategory.enum["Hot Meal"], date).then((count) => {
                    setHotMeals(count);
                })   
                getCheckInCountMonth(CheckInCategory.enum["Snack Pack"], date).then((count) => {
                    setSnackPacks(count);
                })   
            } else if (timeFrame === 'year'){
                getCheckInCountYear(CheckInCategory.enum["Hygiene Kit"], date).then((count) => {
                    setHygieneKits(count);
                })    
                getCheckInCountYear(CheckInCategory.enum["Hot Meal"], date).then((count) => {
                    setHotMeals(count);
                })   
                getCheckInCountYear(CheckInCategory.enum["Snack Pack"], date).then((count) => {
                    setSnackPacks(count);
                })   
            }
        } catch (error) {
            console.error('Error fetching check-in counts:', error);
        }

    }, [timeFrame]);

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
                {hygieneKits + hotMeals + snackPacks}
            </h2>
            <div className="grid grid-cols-1 gap-4">
                {/* Hygiene Kits Card */}
                <div className="flex items-center justify-between mb-4 p-4 rounded-lg shadow-md bg-white">
                    <div>
                        <p className="text-gray-600">Hygiene Kits</p>
                        <h1 className="text-4xl font-bold">{hygieneKits}</h1>
                    </div>
                    <div className="flex items-center space-x-1">
                        <button
                        onClick={() => handleDecrement('hygieneKits')}
                        className="bg-background border-foreground text-foreground w-6 h-6 flex items-center justify-center rounded-full"
                        >
                        -
                        </button>
                        <button
                        onClick={() => handleIncrement('hygieneKits')}
                        className="bg-background border-foreground text-foreground w-6 h-6 flex items-center justify-center rounded-full"
                        >
                        +
                        </button>
                    </div>
                </div>

                {/* Hot Meals Card */}
                <div className="flex items-center justify-between mb-4 p-4 rounded-lg shadow-md bg-white">
                    <div>
                        <p className="text-gray-600">Hot Meals</p>
                        <h1 className="text-4xl font-bold">{hotMeals}</h1>
                    </div>
                    <div className="flex items-center space-x-1">
                        <button
                        onClick={() => handleDecrement('hotMeals')}
                        className="bg-background border-foreground text-foreground w-6 h-6 flex items-center justify-center rounded-full"
                        >
                        -
                        </button>
                        <button
                        onClick={() => handleIncrement('hotMeals')}
                        className="bg-background border-foreground text-foreground w-6 h-6 flex items-center justify-center rounded-full"
                        >
                        +
                        </button>
                    </div>
                </div>

                {/* Snack Packs Card */}
                <div className="flex items-center justify-between mb-4 p-4 rounded-lg shadow-md bg-white">
                    <div>
                        <p className="text-gray-600">Snack Packs</p>
                        <h1 className="text-4xl font-bold">{snackPacks}</h1>
                    </div>
                    <div className="flex items-center space-x-1">
                        <button
                        onClick={() => handleDecrement('snackPacks')}
                        className="bg-background border-foreground text-foreground w-6 h-6 flex items-center justify-center rounded-full"
                        >
                        -
                        </button>
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
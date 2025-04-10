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
import { incrementCheckInCount, getCheckInCount } from '@/api/events'; // Adjust the import path as necessary
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
    const [selectedMonth, setSelectedMonth] = useState<string>(
        format(new Date(), 'MMMM')
    );

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

    useEffect(() => {
        const monthIndex = months.findIndex((m) => m === selectedMonth);
        if (monthIndex === -1) {
          throw new Error('Invalid month');
        }
        const year = new Date().getFullYear();
        // Creates a date at noon on the 1st day of the given month
        const monthDate =  new Date(year, monthIndex, 1, 12, 0, 0);

        getCheckInCount(CheckInCategory.enum["Hygiene Kit"], monthDate).then((count) => {
            setHygieneKits(count);
        }).catch((error) => {
            console.error('Error fetching hygiene kits count:', error);
        });

        getCheckInCount(CheckInCategory.enum["Hot Meal"], monthDate).then((count) => {
            setHotMeals(count);
        }).catch((error) => {
            console.error('Error fetching hot meals count:', error);
        });

        getCheckInCount(CheckInCategory.enum["Snack Pack"], monthDate).then((count) => {
            setSnackPacks(count);
        }).catch((error) => {
            console.error('Error fetching snack packs count:', error);
        });
        console.log(`Selected month is: ${selectedMonth}`);

    }, [selectedMonth]);

    return (
        <div>
            {/* Header and dropdown in flex container */}
            <div className="flex items-center gap-10 mb-4">
                <h2 className="text-2xl font-semibold">Check-Ins</h2>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="flex justify-between items-center bg-white w-40 rounded-md border border-gray-300 px-3 py-2">
                        <SelectValue>{selectedMonth || 'Month'}</SelectValue>
                        <Symbol symbol="arrow_drop_down" className="ml-2" />
                    </SelectTrigger>
                    <SelectContent
                        className="bg-white rounded-md border border-gray-200 shadow-md"
                        align="center"
                        sideOffset={4}
                    >
                        <SelectViewport>
                            {months.map((month) => (
                                <SelectItem
                                    key={month}
                                    value={month}
                                    className="px-3 py-2 hover:bg-blue-100 focus:bg-blue-100"
                                >
                                    {month}
                                </SelectItem>
                            ))}
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
                    <button
                        onClick={() => handleIncrement('hygieneKits')}
                        className="bg-background border-foreground text-foreground w-6 h-6 flex items-center justify-center rounded-full"
                    >
                        +
                    </button>
                </div>

                {/* Hot Meals Card */}
                <div className="flex items-center justify-between mb-4 p-4 rounded-lg shadow-md bg-white">
                    <div>
                        <p className="text-gray-600">Hot Meals</p>
                        <h1 className="text-4xl font-bold">{hotMeals}</h1>
                    </div>
                    <button
                        onClick={() => handleIncrement('hotMeals')}
                        className="bg-background border-foreground text-foreground w-6 h-6 flex items-center justify-center rounded-full"
                    >
                        +
                    </button>
                </div>

                {/* Snack Packs Card */}
                <div className="flex items-center justify-between mb-4 p-4 rounded-lg shadow-md bg-white">
                    <div>
                        <p className="text-gray-600">Snack Packs</p>
                        <h1 className="text-4xl font-bold">{snackPacks}</h1>
                    </div>
                    <button
                        onClick={() => handleIncrement('snackPacks')}
                        className="bg-background border-foreground text-foreground w-6 h-6 flex items-center justify-center rounded-full"
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckInCounter;
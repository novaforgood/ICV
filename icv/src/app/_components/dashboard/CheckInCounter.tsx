'use client'

import React from 'react'
import { useTimeFrame } from '../../_context/TimeFrameContext'
import { useCheckInCount } from '../../_context/CheckInCountContext'

const CheckInCounter: React.FC = () => {
    const { timeFrame, setTimeFrame } = useTimeFrame()
    const {
        hygieneKits,
        hotMeals,
        snackPacks,
        isLoading,
        increment,
        decrement,
    } = useCheckInCount()

    return (
        <div>
            <div className="mb-4 flex w-full items-center justify-between">
                <h2 className="text-2xl font-semibold">Check-Ins</h2>
                <select
                    value={timeFrame}
                    onChange={(e) => setTimeFrame(e.target.value as 'day' | 'month' | 'year')}
                    className="w-25 rounded-md border border-gray-300 bg-white px-3 py-2"
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
                {/* Total */}
                <h2 className="font-epilogue self-stretch text-center text-[22px] font-medium leading-[24px] text-[#246F95]">
                  Total
                </h2>
                <h2 className="font-epilogue self-stretch text-center text-[40px] font-bold leading-[56px] text-[#246f95]">
                  {hygieneKits[timeFrame] +
                    hotMeals[timeFrame] +
                    snackPacks[timeFrame]}
                </h2>
              
                {/* Cards — ALWAYS stacked */}
                <div className="flex flex-col gap-3">
                  {/* Hygiene Kits */}
                  <div className="flex w-full items-center justify-between rounded-lg bg-sky p-4 shadow-md">
                    {/* Left: text */}
                    <div className="text-left">
                      <p className="text-background">Hygiene Kits</p>
                      <h1 className="text-4xl font-bold text-background">
                        {hygieneKits[timeFrame]}
                      </h1>
                    </div>
              
                    {/* Right: buttons */}
                    <div className="flex items-center gap-2">
                      {hygieneKits[timeFrame] > 0 && (
                        <button
                          onClick={() => decrement('hygieneKits')}
                          className="flex h-12 w-12 items-center justify-center rounded-[100%] bg-background text-foreground text-4xl font-medium"
                        >
                          −
                        </button>
                      )}
                      <button
                        onClick={() => increment('hygieneKits')}
                        className="flex h-12 w-12 items-center justify-center rounded-[100%] bg-background text-foreground text-4xl font-medium"
                      >
                        +
                      </button>
                    </div>
                  </div>
              
                  {/* Hot Meals */}
                  <div className="flex w-full items-center justify-between rounded-lg bg-blue p-4 shadow-md">
                    <div className="text-left">
                      <p className="text-background">Hot Meals</p>
                      <h1 className="text-4xl font-bold text-background">
                        {hotMeals[timeFrame]}
                      </h1>
                    </div>
              
                    <div className="flex items-center gap-2">
                      {hotMeals[timeFrame] > 0 && (
                        <button
                          onClick={() => decrement('hotMeals')}
                          className="flex h-12 w-12 items-center justify-center rounded-[100%] bg-background text-foreground text-4xl font-medium"
                        >
                          −
                        </button>
                      )}
                      <button
                        onClick={() => increment('hotMeals')}
                        className="flex h-12 w-12 items-center justify-center rounded-[100%] bg-background text-foreground text-4xl font-medium"
                      >
                        +
                      </button>
                    </div>
                  </div>
              
                  {/* Snack Packs */}
                  <div className="flex w-full items-center justify-between rounded-lg bg-navy p-4 shadow-md">
                    <div className="text-left">
                      <p className="text-background">Snack Packs</p>
                      <h1 className="text-4xl font-bold text-background">
                        {snackPacks[timeFrame]}
                      </h1>
                    </div>
              
                    <div className="flex items-center gap-2">
                      {snackPacks[timeFrame] > 0 && (
                        <button
                          onClick={() => decrement('snackPacks')}
                          className="flex h-12 w-12 items-center justify-center rounded-[100%] bg-background text-foreground text-4xl font-medium"
                        >
                          −
                        </button>
                      )}
                      <button
                        onClick={() => increment('snackPacks')}
                        className="flex h-12 w-12 items-center justify-center rounded-[100%] bg-background text-foreground text-4xl font-medium"
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

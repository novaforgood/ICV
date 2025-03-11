'use client'

import { CaseEventType } from '@/types/event-types'
import {
    addDays,
    addWeeks,
    format,
    isAfter,
    isBefore,
    setHours,
    setMinutes,
    startOfWeek,
    subWeeks,
} from 'date-fns'
import { useState } from 'react'

const WeeklyCalendar = ({ events = [] }: { events: CaseEventType[] }) => {
    const [currentDate, setCurrentDate] = useState(new Date())

    // Calculate the first day of the current week (Sunday by default)
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 })

    // Create an array of the 7 days in the current week
    const daysOfWeek = Array.from({ length: 7 }, (_, i) =>
        addDays(weekStart, i),
    )

    // Hours of the day (0–23). You can expand to half-hours if you like.
    const hours = Array.from({ length: 24 }, (_, i) => i)

    // Navigation handlers
    const handlePrevWeek = () => setCurrentDate(subWeeks(currentDate, 1))
    const handleNextWeek = () => setCurrentDate(addWeeks(currentDate, 1))
    const handleCurrentWeek = () => setCurrentDate(new Date())

    /**
     * Utility to check if a given hour-block on a day intersects with an event
     * This is a simplistic approach: we consider an event to occupy the hour-block
     * if (start < hour-block-end) && (end > hour-block-start).
     *
     * hour-block start = dayWithHour (00 minutes)
     * hour-block end   = dayWithHour + 1 hour
     */
    const doesEventIntersectHour = (event, day, hour) => {
        const eventStart = new Date(event.startDate)
        const eventEnd = new Date(event.endDate)

        // Start of this hour block
        const hourStart = setMinutes(setHours(day, hour), 0)
        // End of this hour block
        const hourEnd = setMinutes(setHours(day, hour + 1), 0)

        // Overlaps if eventStart < hourEnd AND eventEnd > hourStart
        return isBefore(eventStart, hourEnd) && isAfter(eventEnd, hourStart)
    }

    return (
        <div className="flex max-w-6xl flex-1 flex-col p-4">
            {/* Header with Prev / Today / Next */}
            <div className="mb-4 flex items-center justify-between">
                <button
                    onClick={handlePrevWeek}
                    className="rounded bg-blue-500 px-3 py-1 text-white"
                >
                    Prev
                </button>
                <div className="text-lg font-bold">
                    {format(weekStart, 'MMM d')} -{' '}
                    {format(addDays(weekStart, 6), 'MMM d, yyyy')}
                </div>
                <div className="space-x-2">
                    <button
                        onClick={handleCurrentWeek}
                        className="rounded bg-gray-300 px-3 py-1"
                    >
                        This Week
                    </button>
                    <button
                        onClick={handleNextWeek}
                        className="rounded bg-blue-500 px-3 py-1 text-white"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Column headers for each day (plus optional time column on the left) */}
            <div className="grid grid-cols-8 border-b">
                {/* Time column header (blank or label) */}
                <div className="border-r p-2 text-center font-semibold">
                    Time
                </div>
                {daysOfWeek.map((day) => (
                    <div
                        key={day}
                        className="border-r p-2 text-center font-semibold"
                    >
                        {format(day, 'EEE, MMM d')}
                    </div>
                ))}
            </div>

            <div className="flex flex-1 flex-col overflow-scroll">
                {/* {hours.map((hour) => (
                    <div
                        key={hour}
                        className="grid min-h-[3rem] grid-cols-8 border-b"
                    >
                        <div className="border-r p-1 text-center text-sm text-gray-500">
                            {format(setHours(new Date(), hour), 'h aa')}
                        </div>

                        {daysOfWeek.map((day) => {
                            // Get all events that intersect this day & hour
                            const hourEvents = events.filter((event) =>
                                doesEventIntersectHour(event, day, hour),
                            )

                            return (
                                <div
                                    key={day}
                                    className="relative border-r p-1"
                                >
                                    {hourEvents.map((event, idx) => (
                                        <div
                                            key={idx}
                                            className="absolute bottom-0 left-1 right-1 top-0 rounded bg-green-200 p-1 text-xs shadow"
                                        >
                                            <div className="font-semibold">
                                                {event.title ||
                                                    'Untitled Event'}
                                            </div>
                                            <div>
                                                {format(
                                                    new Date(event.startDate),
                                                    'p',
                                                )}{' '}
                                                -{' '}
                                                {format(
                                                    new Date(event.endDate),
                                                    'p',
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        })}
                    </div>
                ))} */}
            </div>
        </div>
    )
}

export default WeeklyCalendar

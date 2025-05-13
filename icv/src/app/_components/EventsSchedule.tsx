'use client'

import { getAllEvents, getScheduledEvents } from '@/api/events'
import Symbol from '@/components/Symbol'
import { Card } from '@/components/ui/card'
import { CheckInType } from '@/types/event-types'
import { format, isValid } from 'date-fns'
import React, { useMemo, useState } from 'react'
import useSWR from 'swr'
import EventCard from './EventsCard'

// Fetcher function for events
const fetchEvents = async (): Promise<CheckInType[]> => {
    const events = await getScheduledEvents()
    return events
}

const EventsSchedule: React.FC = () => {
    const { data: events, error, isLoading } = useSWR('events', fetchEvents)

    // State to track selected day (YYYY-MM-DD string)
    const [selectedDate, setSelectedDate] = useState<string | null>(() =>
        format(new Date(), 'yyyy-MM-dd'),
    )

    // State to track the start of the current week view.
    // Initialized so that the week view starts 3 days before today.
    const [weekStart, setWeekStart] = useState<Date>(() => {
        const now = new Date()
        now.setDate(now.getDate() - 3)
        return now
    })

    // Generate date options for the week view based on weekStart
    const weekDays = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => {
            const day = new Date(weekStart)
            day.setDate(weekStart.getDate() + i)
            return day
        })
    }, [weekStart])

    // Filter events by selected date and ensure event.date is valid
    const filteredEvents = useMemo(() => {
        console.log('Selected Date:', selectedDate)
        if (!selectedDate || !events) return events || []
        return events.filter((event) => {
            const eventDate = new Date(event.startTime)
            console.log('Event name: ', event.name, 'Event Date:', event.startTime)
            if (!isValid(eventDate)) return false
            return format(eventDate, 'yyyy-MM-dd') === selectedDate
        })
    }, [selectedDate, events])

    // Handle loading and error states
    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error loading data: {error.message}</div>

    return (
        <div className="-m-2 flex flex-1 flex-col gap-6 overflow-hidden p-2 pb-4">
            <h2 className="text-3xl font-semibold">Schedule</h2>

            {/* Date Selector */}
            <Card className="flex flex-col gap-4">
                <div className="flex items-center justify-end gap-3 self-stretch">
                    <button
                        className="h-6 w-6 flex-shrink-0 text-sm"
                        onClick={() => {
                            const newWeekStart = new Date(weekStart)
                            newWeekStart.setDate(newWeekStart.getDate() - 7)
                            setWeekStart(newWeekStart)
                            setSelectedDate(format(newWeekStart, 'yyyy-MM-dd'))
                        }}
                    >
                        <Symbol symbol="keyboard_arrow_left" />
                    </button>
                    <div className="text-lg">
                        {`${format(weekDays[0], 'MMM d')} - ${format(
                            weekDays[weekDays.length - 1],
                            'MMM d',
                        )}`}
                    </div>
                    <button
                        className="h-6 w-6 flex-shrink-0 text-sm"
                        onClick={() => {
                            const newWeekStart = new Date(weekStart)
                            newWeekStart.setDate(newWeekStart.getDate() + 7)
                            setWeekStart(newWeekStart)
                            setSelectedDate(format(newWeekStart, 'yyyy-MM-dd'))
                        }}
                    >
                        <Symbol symbol="keyboard_arrow_right" />
                    </button>
                </div>
                <div className="flex items-center justify-between self-stretch px-6">
                    {weekDays.map((day) => {
                        const formattedDate = format(day, 'yyyy-MM-dd')
                        const isSelected = selectedDate === formattedDate
                        return (
                            <div
                                key={formattedDate}
                                className="flex flex-col items-center"
                            >
                                <button
                                    onClick={() =>
                                        setSelectedDate(formattedDate)
                                    }
                                >
                                    <div
                                        className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                                            isSelected
                                                ? 'bg-foreground text-secondary'
                                                : 'bg-background text-primary'
                                        } font-epilogue text-[22px] font-medium leading-[24px]`}
                                    >
                                        {format(day, 'd')}
                                    </div>
                                    <div
                                        className={`flex h-12 w-12 items-center justify-center rounded-full bg-background text-primary transition-colors ${
                                            isSelected ? 'font-bold' : ''
                                        }`}
                                    >
                                        {format(day, 'E')}
                                    </div>
                                </button>
                            </div>
                        )
                    })}
                </div>
            </Card>

            {/* Event Cards */}
            <div className="bottom-0 -m-2 flex flex-1 flex-col space-y-4 overflow-scroll p-2">
                {filteredEvents.length === 0 ? (
                    <p className="py-8 text-center text-gray-700">
                        No events for this day.
                    </p>
                ) : (
                    filteredEvents.map((event) => (
                        <EventCard
                            key={String(event.id)}
                            event={event}
                        />
                    )) 
                )}
            </div>
        </div>
    )
}

export default EventsSchedule

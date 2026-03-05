'use client'

import Symbol from '@/components/Symbol'
import { Card } from '@/components/ui/card'
import { CheckInType } from '@/types/event-types'
import { addDays, format, isValid, parseISO, subDays } from 'date-fns'
import React, { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import EventCard from '../dashboard/EventsCard'
import { useUser } from '@/hooks/useUser'

// Fetcher function for events - uses API route to avoid server action serialization issues
const fetchEvents = async (): Promise<CheckInType[]> => {
    const res = await fetch('/api/events/scheduled')
    if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `Failed to fetch events (${res.status})`)
    }
    return res.json()
}

const EventsSchedule: React.FC = () => {
    const { user, loading: authLoading } = useUser()
    const { data: events, error, isLoading } = useSWR(
        user ? 'events' : null,
        fetchEvents,
    )

    // State to track selected day (YYYY-MM-DD string)
    const [selectedDate, setSelectedDate] = useState<string | null>(() =>
        format(new Date(), 'yyyy-MM-dd'),
    )

    // State to track the start of the current week view.
    // Initialized so that the week view starts 3 days before today.
    const [weekStart, setWeekStart] = useState<Date>(() => {
        const now = new Date()
        const day = now.getDay() // 0 (Sunday) to 6 (Saturday)
        now.setDate(now.getDate() - day) // go back to previous Sunday
        return now
    })

    const getStartOfWeek = (date: Date) => {
        const result = new Date(date)
        result.setDate(date.getDate() - date.getDay())
        return result
    }

    // Detect sm screens (below 640px) for compact date picker
    const [isSmScreen, setIsSmScreen] = useState(false)
    useEffect(() => {
        const mq = window.matchMedia('(max-width: 639px)')
        const handler = () => setIsSmScreen(mq.matches)
        handler()
        mq.addEventListener('change', handler)
        return () => mq.removeEventListener('change', handler)
    }, [])

    // On sm: sliding 3-day window. smOffset shifts the window (0 = yesterday/today/tomorrow)
    const [smOffset, setSmOffset] = useState(0)
    const smDays = useMemo(() => {
        const t = new Date()
        const center = addDays(t, smOffset)
        return [subDays(center, 1), center, addDays(center, 1)]
    }, [smOffset])

    // Generate date options for the week view based on weekStart
    const weekDays = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => {
            const day = new Date(weekStart)
            day.setDate(weekStart.getDate() + i)
            return day
        })
    }, [weekStart])

    const displayDays = isSmScreen ? smDays : weekDays

    // Filter events by selected date and ensure event.date is valid
    const filteredEvents = useMemo(() => {
        if (!selectedDate || !events) return events || []
        return events.filter((event) => {
            const eventDate = new Date(event.startTime)
            if (!isValid(eventDate)) return false
            return format(eventDate, 'yyyy-MM-dd') === selectedDate
        })
    }, [selectedDate, events])

    // Handle loading and error states (wait for auth before fetching to avoid race)
    if (authLoading || isLoading) return <div>Loading...</div>
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
                            if (isSmScreen) {
                                setSmOffset((o) => o - 1)
                            } else {
                                const newSelectedDate = parseISO(selectedDate!)
                                newSelectedDate.setDate(
                                    newSelectedDate.getDate() - 7,
                                )
                                setSelectedDate(
                                    format(newSelectedDate, 'yyyy-MM-dd'),
                                )
                                setWeekStart(getStartOfWeek(newSelectedDate))
                            }
                        }}
                    >
                        <Symbol symbol="keyboard_arrow_left" />
                    </button>
                    <div className="text-lg">
                        {`${format(displayDays[0], 'MMM d')} - ${format(
                            displayDays[displayDays.length - 1],
                            'MMM d',
                        )}`}
                    </div>
                    <button
                        className="h-6 w-6 flex-shrink-0 text-sm"
                        onClick={() => {
                            if (isSmScreen) {
                                setSmOffset((o) => o + 1)
                            } else {
                                const newSelectedDate = parseISO(selectedDate!)
                                newSelectedDate.setDate(
                                    newSelectedDate.getDate() + 7,
                                )
                                setSelectedDate(
                                    format(newSelectedDate, 'yyyy-MM-dd'),
                                )
                                setWeekStart(getStartOfWeek(newSelectedDate))
                            }
                        }}
                    >
                        <Symbol symbol="keyboard_arrow_right" />
                    </button>
                </div>
                <div
                    className={`flex items-center self-stretch px-6 ${
                        isSmScreen ? 'justify-between gap-2' : 'justify-between'
                    }`}
                >
                    {displayDays.map((day) => {
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
                                                ? 'bg-sky text-secondary'
                                                : 'bg-background text-primary'
                                        } font-epilogue text-[22px] font-medium leading-[24px]`}
                                    >
                                        {format(day, 'd')}
                                    </div>
                                    <div
                                        className={`flex h-12 w-12 items-center justify-center rounded-full bg-background text-primary transition-colors ${
                                            isSelected ? 'font-bold' : ''
                                        } ${isSmScreen ? 'text-sm' : ''}`}
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
                        <EventCard key={String(event.id)} event={event} />
                    ))
                )}
            </div>
        </div>
    )
}

export default EventsSchedule

'use client'

import { getAllEvents } from '@/api/events'
import { Card } from '@/components/ui/card'
import { CaseEventType } from '@/types/event-types'
import { format, isValid } from 'date-fns'
import React, { useMemo, useState } from 'react'
import useSWR from 'swr'

// Fetcher function for events
const fetchEvents = async (): Promise<CaseEventType[]> => {
    const events = await getAllEvents()
    return events
}

const EventsSchedule: React.FC = () => {
    const { data: events, error, isLoading } = useSWR('events', fetchEvents)

  // State to track selected day (YYYY-MM-DD string)
  const [selectedDate, setSelectedDate] = useState<string | null>(() => format(new Date(), "yyyy-MM-dd"))

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
            const eventDate = new Date(event.date)
            if (!isValid(eventDate)) return false
            console.log('Event Date:', format(eventDate, 'yyyy-MM-dd'))
            return format(eventDate, 'yyyy-MM-dd') === selectedDate
        })
    }, [selectedDate, events])

    // Handle loading and error states
    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error loading data: {error.message}</div>

    return (
        <div className="flex flex-col gap-6 pt-12">
            <h2 className="text-3xl font-semibold">Schedule</h2>

            {/* Date Selector */}
            <Card>
                <div className="flex items-center justify-end gap-3 self-stretch">
                    <button
                        className="h-6 w-6 flex-shrink-0"
                        onClick={() => {
                            const newWeekStart = new Date(weekStart)
                            newWeekStart.setDate(newWeekStart.getDate() - 7)
                            setWeekStart(newWeekStart)
                            setSelectedDate(format(newWeekStart, 'yyyy-MM-dd'))
                        }}
                    >
                        {'<'}
                    </button>
                    <div className="text-lg">
                        {`${format(weekDays[0], 'MMM d')} - ${format(
                            weekDays[weekDays.length - 1],
                            'MMM d',
                        )}`}
                    </div>
                    <button
                        className="h-6 w-6 flex-shrink-0"
                        onClick={() => {
                            const newWeekStart = new Date(weekStart)
                            newWeekStart.setDate(newWeekStart.getDate() + 7)
                            setWeekStart(newWeekStart)
                            setSelectedDate(format(newWeekStart, 'yyyy-MM-dd'))
                        }}
                    >
                        {'>'}
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
      {/* <div className="fixed flex-col space-y-4 bottom-0 max-h-60 overflow-auto bg-gray-100 border-t border-gray-300 p-4 shadow-lg"> */}
      <div className="grid bottom-0 flex-col space-y-4 xoverflow-auto max-h-80 overflow-x-visible over">
        {filteredEvents.length === 0 ? (
          <p>No events for this day.</p>
        ) : (
          filteredEvents.map((event) => {
            const eventDate = new Date(event.date)
            if (!isValid(eventDate)) return null

                        const startTime = eventDate.getTime()
                        const endTime = new Date(
                            startTime + (event.duration || 0) * 60 * 60 * 1000,
                        )
                        const eventName = String(event.name) || 'Loading...'
                        const eventLocation =
                            String(event.location) || 'Loading...'
                        const eventAsignee =
                            String(event.assigneeId) || 'Loading...'

            return (
                <>
              <Card
                key={String(event.id)}
                className="flex justify-between items-center shrink-0 self-stretch grid grid-cols-3 gap-4"
              >
                <div className="text-sm text-gray-500">
                  <span>{format(startTime, "p")}</span>
                  <br />
                  <span>{format(endTime, "p")}</span>
                </div>
                <div>
                  <h2 className="font-bold text-lg">{eventName}</h2>
                  <p className="text-gray-600">{eventLocation}</p>
                </div>
                <div>
                  <h2 className="flex items-center gap-3 text-lg">
                    {eventAsignee}
                  </h2>
                </div>
              </Card>
              <Card
                key={String(event.id)}
                className="flex justify-between items-center shrink-0 self-stretch grid grid-cols-3 gap-4"
              >
                <div className="text-sm text-gray-500">
                  <span>{format(startTime, "p")}</span>
                  <br />
                  <span>{format(endTime, "p")}</span>
                </div>
                <div>
                  <h2 className="font-bold text-lg">{eventName}</h2>
                  <p className="text-gray-600">{eventLocation}</p>
                </div>
                <div>
                  <h2 className="flex items-center gap-3 text-lg">
                    {eventAsignee}
                  </h2>
                </div>
              </Card>
              <Card
                key={String(event.id)}
                className="flex justify-between items-center shrink-0 self-stretch grid grid-cols-3 gap-4"
              >
                <div className="text-sm text-gray-500">
                  <span>{format(startTime, "p")}</span>
                  <br />
                  <span>{format(endTime, "p")}</span>
                </div>
                <div>
                  <h2 className="font-bold text-lg">{eventName}</h2>
                  <p className="text-gray-600">{eventLocation}</p>
                </div>
                <div>
                  <h2 className="flex items-center gap-3 text-lg">
                    {eventAsignee}
                  </h2>
                </div>
              </Card>
              <Card
                key={String(event.id)}
                className="flex justify-between items-center shrink-0 self-stretch grid grid-cols-3 gap-4"
              >
                <div className="text-sm text-gray-500">
                  <span>{format(startTime, "p")}</span>
                  <br />
                  <span>{format(endTime, "p")}</span>
                </div>
                <div>
                  <h2 className="font-bold text-lg">{eventName}</h2>
                  <p className="text-gray-600">{eventLocation}</p>
                </div>
                <div>
                  <h2 className="flex items-center gap-3 text-lg">
                    {eventAsignee}
                  </h2>
                </div>
              </Card>
              </>
            )
          })
        )}
      </div>
    </div>
  )
}

export default EventsSchedule

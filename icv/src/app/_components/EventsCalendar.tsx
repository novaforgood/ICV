'use client'

import React, { useMemo, useState } from 'react'
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import { getScheduledEvents } from '@/api/events'
import { CheckInType } from '@/types/event-types'

import {
  format,
  getDay,
  isValid,
  parse,
  startOfWeek,
  startOfDay,
  endOfDay,
} from 'date-fns'

import enUS from 'date-fns/locale/en-US'
import useSWR from 'swr'

// Localizer setup
const locales = { 'en-US': enUS }
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const fetchEvents = async (): Promise<CheckInType[]> => {
  return await getScheduledEvents()
}

const EventsCalendar: React.FC = () => {
  const [scheduleType, setScheduleType] = useState<'my' | 'team'>('my')
  const { data: rawEvents, error, isLoading } = useSWR('calendar-events', fetchEvents)
  const [currentDate, setCurrentDate] = useState(new Date())

  const events = useMemo(() => {
    if (!rawEvents) return []
    return rawEvents
      .filter((e) => isValid(new Date(e.startTime)))
      .map((e) => ({
        id: e.id,
        title: e.name || 'Untitled',
        start: new Date(e.startTime),
        end: e.endTime
          ? new Date(e.endTime)
          : new Date(new Date(e.startTime).getTime() + 30 * 60 * 1000),
        location: e.location,
      }))
  }, [rawEvents])

  if (isLoading) return <div className="p-4">Loading calendar...</div>
  if (error) return <div className="p-4 text-red-500">Error loading events: {error.message}</div>

  return (
    <div className="p-6 min-h-screen bg-white relative">
        <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold mb-4">
                Calendar
            </h1>
            <div className="flex gap-2">
            <button
                onClick={() => setScheduleType('my')}
                className={`px-4 py-1 rounded-full ${
                scheduleType === 'my'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
            >
                My schedule
            </button>
            <button
                onClick={() => setScheduleType('team')}
                className={`px-4 py-1 rounded-full ${
                scheduleType === 'team'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
            >
                Team schedule
            </button>
        </div>

        </div>

      {/* Calendar */}
      <div className="border rounded overflow-hidden h-[75vh]">
        <Calendar
          localizer={localizer}
          events={events}
          defaultView={Views.WEEK}
          views={['week']}
          date={currentDate}
          onNavigate={(date) => setCurrentDate(date)}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          timeslots={1}
          step={60}
          defaultDate={new Date()}
          tooltipAccessor="location"
          eventPropGetter={() => ({
            style: {
              backgroundColor: '#4EA0C9',
              borderRadius: '6px',
              padding: '4px',
              color: 'white',
              border: 'none',
            },
          })}
        />
      </div>
    </div>
  )
}

export default EventsCalendar

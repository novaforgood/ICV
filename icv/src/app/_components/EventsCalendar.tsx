'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getMyScheduledEvents, getScheduledEvents } from '@/api/events'
import { CheckInType } from '@/types/event-types'
import EditScheduledCheckIn from '@/app/_components/EditScheduledCheckIn'

import { format, getDay, isValid, parse, startOfWeek } from 'date-fns'
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

interface EventsCalendarProps {
  newEvents: boolean
  onReloadEvents: () => void
}

const EventsCalendar: React.FC<EventsCalendarProps> = ({ newEvents, onReloadEvents }) => {
  const [scheduleType, setScheduleType] = useState<'my' | 'team'>('my')
  const [rawEvents, setRawEvents] = useState<CheckInType[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [assigneeId, setAssigneeId] = useState('')
  const [error, setError] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null)
  const [reloadEvents, setReloadEvents] = useState(false)

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.displayName) setAssigneeId(user.displayName)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      try {
        const data =
          scheduleType === 'my' && assigneeId
            ? await getMyScheduledEvents(assigneeId)
            : await getScheduledEvents()
        setRawEvents(data)
      } catch (err) {
        console.error('Failed to fetch events:', err)
      } finally {
        setLoading(false)
      }
    }

    if (scheduleType === 'team' ||assigneeId) {
      fetchEvents()
    }

    setReloadEvents(false)
    onReloadEvents()
  }, [scheduleType, assigneeId, reloadEvents, newEvents])

  const events = useMemo(() => {
    if (!rawEvents) return []
    return rawEvents
      .filter((e) => isValid(new Date(e.startTime)))
      .map((e) => ({
        ...e,
        id: e.id,
        title: e.name || 'Untitled',
        start: new Date(e.startTime),
        end: e.endTime
          ? new Date(e.endTime)
          : new Date(new Date(e.startTime).getTime() + 30 * 60 * 1000),
      }))
  }, [rawEvents])

  if (loading) return <div className="p-4">Loading calendar...</div>
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
          onSelectEvent={(event) => setSelectedEvent(event)}
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
        <EditScheduledCheckIn
            selectedEvent={selectedEvent}
            onClose={() => {setSelectedEvent(null)}}
            onUpdatedEvent={() => setReloadEvents(true)}
        />
    </div>
  )
}

export default EventsCalendar

// const EventsCalendar = () => {
//     return (
//         <div>
//             <h1>Events Calendar</h1>
//             <p>This is the Events Calendar component.</p>
//         </div>
//     )
// }

// export default EventsCalendar

'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getMyScheduledEvents, getScheduledEvents } from '@/api/events'
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

const EventsCalendar: React.FC = () => {
  const [scheduleType, setScheduleType] = useState<'my' | 'team'>('my')
  const [rawEvents, setRawEvents] = useState<CheckInType[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [assigneeId, setAssigneeId] = useState('')
  const [error, setError] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null)

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
  }, [scheduleType, assigneeId])

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
        clientName: e.clientName,
        clientId: e.clientId,
        contactCode: e.contactCode,
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
      {selectedEvent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                <div className="relative bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
                {/* Close, Edit, Delete Icons */}
                <div className="absolute top-4 right-4 flex gap-3 text-gray-600">
                    <button><span className="material-symbols-outlined">edit</span></button>
                    <button><span className="material-symbols-outlined">delete</span></button>
                    <button onClick={() => setSelectedEvent(null)}><span className="material-symbols-outlined">close</span></button>
                </div>
                
                <h2 className="text-2xl font-semibold">{selectedEvent.clientName}</h2>
                <p className="text-gray-500 mb-4">{selectedEvent.clientId}</p>

                {/* Date & Time */}
                <div className="flex items-center gap-2 text-gray-800 mb-2">
                    <span className="material-symbols-outlined">calendar_today</span>
                    <p>
                    {new Date(selectedEvent.start).toLocaleDateString(undefined, {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                    })} · {new Date(selectedEvent.start).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} – {new Date(selectedEvent.end).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                    </p>
                </div>

                {/* Contact Code / Tag */}
                <span className="inline-block bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                    {selectedEvent.contactCode}
                </span>

                {/* Assignee */}
                <div className="flex items-center gap-2 text-gray-800 mb-2">
                    <span className="material-symbols-outlined">person</span>
                    <p>{selectedEvent.assigneeId}</p>
                </div>

                {/* Location */}
                {selectedEvent.location && (
                    <div className="flex items-center gap-2 text-gray-800 mb-2">
                    <span className="material-symbols-outlined">location_on</span>
                    <p>{selectedEvent.location}</p>
                    </div>
                )}

                {/* Case Notes Link */}
                <div className="flex items-center gap-2 text-blue-700 mt-4 underline cursor-pointer">
                    <span className="material-symbols-outlined">description</span>
                    <p>View case notes</p>
                </div>
                </div>
            </div>
          )}
    </div>
  )
}

export default EventsCalendar

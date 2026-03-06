'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar'
// @ts-expect-error TimeGrid is not in the package's public exports
import TimeGrid from 'react-big-calendar/lib/TimeGrid'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getMyScheduledEvents, getScheduledEvents } from '@/api/events'
import { CheckInType } from '@/types/event-types'
import EditScheduledCheckIn from '@/app/_components/calendar/EditScheduledCheckIn'
import { getUserColor } from '@/utils/colorUtils'

import {
  format,
  getDay,
  isValid,
  parse,
  startOfWeek,
  startOfDay,
  addDays,
} from 'date-fns'

import { enUS } from 'date-fns/locale'

function useIsSmallScreen() {
  const [isSmall, setIsSmall] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)')
    const handler = () => setIsSmall(mq.matches)
    handler()
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isSmall
}

// 3-day view for small screens (uses same API as Week: range, navigate, title)
function ThreeDayView(props: any) {
  const { date, localizer, min, max, scrollToTime, enableAutoScroll, ...rest } = props
  const range = ThreeDayView.range(date)
  const minProp = min ?? localizer.startOf(new Date(), 'day')
  const maxProp = max ?? localizer.endOf(new Date(), 'day')
  const scrollToTimeProp = scrollToTime ?? localizer.startOf(new Date(), 'day')
  const enableAutoScrollProp = enableAutoScroll ?? true
  return (
    <TimeGrid
      {...rest}
      range={range}
      eventOffset={15}
      localizer={localizer}
      min={minProp}
      max={maxProp}
      scrollToTime={scrollToTimeProp}
      enableAutoScroll={enableAutoScrollProp}
    />
  )
}
ThreeDayView.range = function (date: Date, _opts?: unknown) {
  const start = startOfDay(date)
  return [start, addDays(start, 1), addDays(start, 2)]
}
ThreeDayView.navigate = function (date: Date, action: string, _props?: unknown) {
  switch (action) {
    case 'PREV':
      return addDays(date, -3)
    case 'NEXT':
      return addDays(date, 3)
    default:
      return date
  }
}
ThreeDayView.title = function (date: Date, options: any) {
  const [start, , end] = ThreeDayView.range(date)
  return options?.localizer?.format({ start, end }, 'dayRangeHeaderFormat') ?? ''
}

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
  const isSmallScreen = useIsSmallScreen()
  const [scheduleType, setScheduleType] = useState<'my' | 'team'>('my')
  const [rawEvents, setRawEvents] = useState<CheckInType[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [assigneeId, setAssigneeId] = useState('')
  const [error, setError] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null)
  const [reloadEvents, setReloadEvents] = useState(false)

  // Create a Date object set to the current time
  const scrollTime = useMemo(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 0)
  }, [])

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
  if (error) return <div className="p-4 text-red-500">Error loading events</div>

  const CustomToolbar = (toolbar: any) => {
    const goToBack = () => {
      toolbar.onNavigate('PREV')
    }

    const goToNext = () => {
      toolbar.onNavigate('NEXT')
    }

    const label = () => {
      const date = toolbar.date
      return format(date, 'MMM dd, yyyy')
    }

    return (
      <div className="flex items-center justify-center px-4 py-3 border-b">
        <button
          onClick={goToBack}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="text-lg font-medium text-gray-900 px-3">{label()}</span>
        <button
          onClick={goToNext}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    )
  }

  const CustomEvent = ({ event }: { event: any }) => {
    return (
      <div className="h-full p-1 space-y-[8px]">
        <div className="font-medium text-foreground text-[16px]">{event.title}</div>
        <div className="text-[12px] text-foreground/80">
          {format(new Date(event.start), 'h:mm a')} - {format(new Date(event.end), 'h:mm a')}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-6xl font-bold">Calendar</h1>

        {/* Toggle - row below title on screens smaller than lg, same width at all breakpoints */}
        <div className="relative inline-flex w-fit items-center justify-start self-start rounded-[20px] bg-zinc-200 p-1 lg:self-center">
          <div
              className={`absolute transition-all duration-300 ease-in-out ${scheduleType === 'my' ? 'left-1' : 'left-[calc(100%-50%-4px)]'} h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-[16px] bg-black`}
          />
            <button
                onClick={() => setScheduleType('my')}
                className={`relative flex items-center justify-center gap-2.5 rounded-[16px] px-5 py-2 transition-colors duration-300 w-[170px] ${
                    scheduleType === 'my' ? 'text-white' : 'text-black'
                }`}
            >
                <div className="justify-center font-['Epilogue'] text-base font-normal leading-none text-center w-full">
                    My schedule
                </div>
            </button>
            <button
                onClick={() => setScheduleType('team')}
                className={`relative flex items-center justify-center gap-2.5 rounded-[16px] px-5 py-2 transition-colors duration-300 w-[170px] ${
                    scheduleType === 'team' ? 'text-white' : 'text-black'
                }`}
            >
                <div className="justify-center font-['Epilogue'] text-base font-normal leading-none text-center w-full">
                    Team schedule
                </div>
            </button>
        </div>
      </div>

      {/* Calendar */}
      <div className="overflow-hidden h-[calc(100vh-12rem)] min-h-[400px] [&_.rbc-header]:py-3 [&_.rbc-header]:font-medium [&_.rbc-header]:bg-gray-50 [&_.rbc-header]:border-b-0 [&_.rbc-time-gutter_.rbc-timeslot-group]:border-r [&_.rbc-timeslot-group]:border-gray-200 [&_.rbc-time-content]:border-t [&_.rbc-time-content]:border-gray-200 [&_.rbc-time-header]:border-gray-200">
        <Calendar<any>
          localizer={localizer}
          events={events}
          defaultView={Views.WEEK}
          views={{ week: (isSmallScreen ? ThreeDayView : true) as any }}
          date={currentDate}
          onNavigate={(date) => setCurrentDate(date)}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          className="[&_.rbc-timeslot-group]:!min-h-[100px] [&_.rbc-event-label]:hidden"
          timeslots={1}
          step={60}
          defaultDate={new Date()}
          scrollToTime={scrollTime}
          tooltipAccessor="location"
          onSelectEvent={(event) => setSelectedEvent(event)}
          components={{
            toolbar: CustomToolbar,
            event: CustomEvent
          }}
          eventPropGetter={(event) => ({
            className: 'rounded-md border-none bg-background',
            style: {
              backgroundColor: event.assigneeId ? getUserColor(event.assigneeId) : '#4EA0C9'
            }
          })}
        />
      </div>

      <EditScheduledCheckIn
        selectedEvent={selectedEvent}
        onClose={() => {setSelectedEvent(null)}}
        onUpdatedEvent={() => setReloadEvents(true)}
        fromEvent={false}
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

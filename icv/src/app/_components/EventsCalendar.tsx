// 'use client'

// import React, { useMemo, useState } from 'react'
// import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar'
// import 'react-big-calendar/lib/css/react-big-calendar.css'

// import { getScheduledEvents } from '@/api/events'
// import { CheckInType } from '@/types/event-types'

// import { format, parse, startOfWeek, getDay, isValid } from 'date-fns'
// import enUS from 'date-fns/locale/en-US'
// import useSWR from 'swr'

// // Localizer setup
// const locales = { 'en-US': enUS }
// const localizer = dateFnsLocalizer({
//   format,
//   parse,
//   startOfWeek,
//   getDay,
//   locales,
// })

// // SWR fetcher
// const fetchEvents = async (): Promise<CheckInType[]> => {
//   return await getScheduledEvents()
// }

// const EventsCalendar: React.FC = () => {
//   const { data: rawEvents, error, isLoading } = useSWR('calendar-events', fetchEvents)

//   // Convert CheckInType[] to calendar-compatible format
//   const events = useMemo(() => {
//     if (!rawEvents) return []

//     return rawEvents
//       .filter((e) => isValid(new Date(e.startTime)))
//       .map((e) => ({
//         id: e.id,
//         title: e.name || 'Untitled',
//         start: new Date(e.startTime),
//         end: e.endTime ? new Date(e.endTime) : new Date(new Date(e.startTime).getTime() + 30 * 60 * 1000),
//         location: e.location,
//       }))
//   }, [rawEvents])

//   if (isLoading) return <div>Loading calendar...</div>
//   if (error) return <div>Error loading events: {error.message}</div>

//   return (
//     <div style={{ height: '90vh', padding: '1rem' }}>
//       <Calendar
//         localizer={localizer}
//         events={events}
//         defaultView={Views.WEEK}
//         views={['week']}
//         startAccessor="start"
//         endAccessor="end"
//         style={{ height: '100%' }}
//         timeslots={2} // 30-minute slots
//         step={30} // step size in minutes
//         defaultDate={new Date()}
//         tooltipAccessor="location"
//       />
//     </div>
//   )
// }

// export default EventsCalendar

const EventsCalendar = () => {
    return (
        <div>
            <h1>Events Calendar</h1>
            <p>This is the Events Calendar component.</p>
        </div>
    )
}

export default EventsCalendar

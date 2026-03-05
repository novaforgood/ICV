'use client'

import ScheduledCheckInCreation from '@/app/_components/calendar/ScheduledCheckInCreation'
import EventsCalendar from '@/app/_components/calendar/EventsCalendar'
import { useState } from 'react'

const Page = () => {
  const [newEvents, setNewEvents] = useState(false)

  return (
    <div className="relative min-h-screen w-full">
      {/* Full calendar view */}
      <EventsCalendar 
        onReloadEvents = {() => setNewEvents(false)}
        newEvents = {newEvents}
      />

      {/* Floating button overlaid on calendar */}
      <div className="fixed bottom-6 right-6 z-50">
        <ScheduledCheckInCreation 
          onNewEvent = {() => setNewEvents(true)}
        />
      </div>
    </div>
  )
}

export default Page

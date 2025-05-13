'use client'

import ScheduledCheckInCreation from '@/app/_components/ScheduledCheckInCreation'
import EventsCalendar from '@/app/_components/EventsCalendar'
import { useState } from 'react'

interface Props {}

const Page = (props: Props) => {
  const [newEvents, setNewEvents] = useState(false)

  return (
    <div className="relative min-h-screen w-full">
      {/* Full calendar view */}
      <EventsCalendar 
        onReloadEvents = {() => setNewEvents(false)}
        newEvents = {newEvents}
      />

      {/* Floating popup trigger button in bottom-right */}
      <div className="absolute bottom-6 right-6 z-50">
        <ScheduledCheckInCreation 
          onNewEvent = {() => setNewEvents(true)}
        />
      </div>
    </div>
  )
}

export default Page

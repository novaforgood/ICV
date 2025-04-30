'use client'

import ScheduledCheckInCreation from '@/app/_components/ScheduledCheckInCreation'
import EventsCalendar from '@/app/_components/EventsCalendar'

interface Props {}

const Page = (props: Props) => {
  return (
    <div className="relative min-h-screen w-full">
      {/* Full calendar view */}
      <EventsCalendar />

      {/* Floating popup trigger button in bottom-right */}
      <div className="absolute bottom-6 right-6 z-50">
        <ScheduledCheckInCreation />
      </div>
    </div>
  )
}

export default Page

'use client'

import ScheduledCheckInCreation from '@/app/_components/calendar/ScheduledCheckInCreation'
import EventsCalendar from '@/app/_components/calendar/EventsCalendar'
import { useCallback, useState } from 'react'

const Page = () => {
    const [newEvents, setNewEvents] = useState(false)

    const handleReloadEvents = useCallback(() => {
        setNewEvents(false)
    }, [])

    const handleNewEvent = useCallback(() => {
        setNewEvents(true)
    }, [])

    return (
        <div className="relative m-[48px] min-h-screen overflow-x-hidden">
            {/* Full calendar view */}
            <EventsCalendar
                onReloadEvents={handleReloadEvents}
                newEvents={newEvents}
            />

            {/* Floating button overlaid on calendar */}
            <div className="fixed bottom-6 right-6 z-50">
                <ScheduledCheckInCreation onNewEvent={handleNewEvent} />
            </div>
        </div>
    )
}

export default Page

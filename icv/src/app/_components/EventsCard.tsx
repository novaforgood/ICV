//for use in client profile checkins tab (sorts by client id) as well as Home Dashboard page (sorts by specific date)
import { Card } from '@/components/ui/card'
import { useUser } from '@/hooks/useUser'
import { CheckInType } from '@/types/event-types'
import { format, isValid } from 'date-fns'
import React from 'react'

interface EventCardProps {
    event: CheckInType
    className?: string
}

//dict for colors associated with each category
const categoryColors: { [key: string]: string } = {
    T: 'bg-teal-200',
    W: 'bg-red-200',
    'Wellness-Check': 'bg-amber-300',
}

const EventCard: React.FC<EventCardProps> = ({ event, className = '' }) => {
    // Parse the event date
    const eventDate = new Date(event.startTime)
    if (!isValid(eventDate)) return null

    // Format times
    const startTime = eventDate.getTime()
    const endTime = event.endTime ? new Date(event.endTime).getTime() : null

    // Format event details with fallbacks
    const eventName = String(event.name) || 'unnamed check-in'
    const eventLocation = String(event.location) || ''
    const eventAssignee = String(event.assigneeId) || ''
    const eventCategory = String(event.contactCode) || ''
    const colorClass = categoryColors[String(event.contactCode)]

 

    const { user } = useUser()

    return (
        <Card
            key={String(event.id)}
            className={`flex min-h-[100px] items-center justify-between gap-4 ${className}`}
        >
            {/* Time Column */}
            <div className="w-[80px] text-center text-sm text-gray-500">
                <span>{format(startTime, 'p')}</span>
                <br />
                <span>{endTime && format(endTime, 'p')}</span>
            </div>

            {/* Event Details Column */}
            <div className="min-w-0 flex-1">
                <h2 className="truncate text-lg font-bold">{eventName}</h2>
                <p className="truncate text-gray-600">{eventLocation}</p>
            </div>
            {/* category */}
            <div
                className={` ${colorClass} outline-solid flex h-[30px] items-center justify-center rounded-full border p-2`}
            >
                <h2 className="truncate text-sm font-medium">
                    {eventCategory}
                </h2>
            </div>

            {/* Assignee Column */}
            <div className="flex w-[300px] flex-row items-center justify-center text-center">
                <img
                    src={user?.photoURL || '/cavediva.jpeg'}
                    alt="logo"
                    className="h-10 w-10 rounded-full"
                />
                <h2 className="flex-2 ml-2 text-lg">{eventAssignee || '-'}</h2>
            </div>
        </Card>
    )
}

export default EventCard

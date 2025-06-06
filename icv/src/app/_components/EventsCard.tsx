//for use in client profile checkins tab (sorts by client id) as well as Home Dashboard page (sorts by specific date)
import { Card } from '@/components/ui/card'
import { useUser } from '@/hooks/useUser'
import { CheckInType } from '@/types/event-types'
import { format, isValid } from 'date-fns'
import { useRouter } from 'next/navigation'
import React from 'react'
import categoryColors from './categoryColors'

interface EventCardProps {
    event: CheckInType
    className?: string
    variant?: 'default' | 'checkins-page'
}

const EventsCard: React.FC<EventCardProps> = ({
    event,
    className = '',
    variant = 'default',
}) => {
    const router = useRouter()

    const eventDate = new Date(event.startTime)
    if (!isValid(eventDate)) return null

    const startTime = eventDate.getTime()
    const date = format(eventDate, 'MMMM d, yyyy')
    const endTime = event.endTime ? new Date(event.endTime).getTime() : null

    const eventName = String(event.name) || 'unnamed check-in'
    const eventLocation = String(event.location) || ''
    const eventAssignee = String(event.assigneeId) || ''
    const eventCategory = String(event.contactCode) || ''
    const colorClass = categoryColors[String(event.contactCode)]

    const { user } = useUser()

    // Handle card click to navigate to event details
    const handleCardClick = () => {
        if (event.id) {
            router.push(`/events/${event.id}`)
        }
    }

    return (
        <Card
            key={String(event.id)}
            className={`flex min-h-[100px] items-center justify-between gap-4 ${className} cursor-pointer transition-colors hover:bg-gray-50`}
            onClick={handleCardClick}
        >
            {/* Time Column */}
            <div className="w-[90px] text-center text-sm text-black">
                <span>{date}</span>
            </div>
            <div className="w-[80px] text-center text-sm text-gray-500">
                <span>{format(startTime, 'p')}</span>
                <br />
                <span>{endTime && format(endTime, 'p')}</span>
            </div>

            {/* Event Details Column */}
            {variant === 'default' && (
                <div className="min-w-0 flex-1">
                    <h2 className="truncate text-lg font-bold">{eventName}</h2>
                    <p className="truncate text-gray-600">{eventLocation}</p>
                </div>
            )}
            {/* category */}
            <div
                className={` ${colorClass} outline-solid mr-auto flex h-[30px] items-center rounded-full border p-2`}
            >
                <h2 className="truncate text-sm font-medium">
                    {eventCategory}
                </h2>
            </div>

            {/* Assignee Column */}
            <div className="flex max-w-[300px] flex-row items-center text-center">
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

export default EventsCard

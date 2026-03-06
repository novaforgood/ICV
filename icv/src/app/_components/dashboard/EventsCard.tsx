//for use in client profile checkins tab (sorts by client id) as well as Home Dashboard page (sorts by specific date)
import { Card } from '@/components/ui/card'
import { useUser } from '@/hooks/useUser'
import { CheckInType } from '@/types/event-types'
import { format, isValid } from 'date-fns'
import { useRouter } from 'next/navigation'
import React from 'react'
import categoryColors from '../categoryColors'

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
    const { user } = useUser()

    const eventDate = new Date(event.startTime)
    const startTime = eventDate.getTime()
    const endTime = event.endTime ? new Date(event.endTime).getTime() : null

    const eventAssignee =
        String(
            (event as { assigneeId?: string }).assigneeId ??
                event.asigneeId ??
                '',
        ) || '-'
    const eventCategory = String(event.contactCode) || ''
    const clientName = String(event.clientName ?? '') || '-'
    const clientId = String(event.clientId ?? '') || '-'
    const colorClass = categoryColors[String(event.contactCode)]

    // Handle card click to navigate to event details
    const handleCardClick = () => {
        if (event.id) {
            router.push(`/events/${event.id}`)
        }
    }

    if (!isValid(eventDate)) return null

    return (
        <Card
            key={String(event.id)}
            className={`flex min-h-[100px] w-full flex-col flex-wrap gap-4 p-4 sm:flex-row sm:items-center sm:justify-between ${className} cursor-pointer transition-colors hover:bg-gray-50`}
            onClick={handleCardClick}
        >
            {/* Group 1: Time + Client (fixed gap) */}
            <div className="flex min-w-0 flex-1 items-center gap-6 overflow-hidden sm:min-w-[140px]">
                <div className="flex shrink-0 flex-col gap-1 text-sm text-gray-600">
                    <span>{format(startTime, 'p')}</span>
                    <span>{endTime ? format(endTime, 'p') : '-'}</span>
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1 overflow-hidden text-start">
                    <span className="truncate font-medium">{clientName}</span>
                    <span className="truncate text-sm text-gray-600">
                        {clientId}
                    </span>
                </div>
            </div>

            {/* Group 2: Category + Assignee (fixed gap) */}
            <div className="flex min-w-0 shrink-0 flex-col items-start gap-2 overflow-hidden sm:min-w-[140px] sm:flex-row sm:items-center sm:gap-6">
                <div
                    className={`${colorClass} flex h-[30px] min-w-0 max-w-full items-center overflow-hidden rounded-full px-3 py-1`}
                >
                    <span className="truncate text-sm font-medium">
                        {eventCategory}
                    </span>
                </div>
                <div className="flex min-w-0 items-center gap-2 overflow-hidden">
                    <img
                        src={user?.photoURL || '/icv.png'}
                        alt="assignee"
                        className="h-8 w-8 shrink-0 rounded-full"
                    />
                    <span className="min-w-0 truncate text-sm">
                        {eventAssignee}
                    </span>
                </div>
            </div>
        </Card>
    )
}

export default EventsCard

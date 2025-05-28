'use client'

import { getEventById } from '@/api/events'
import EditScheduledCheckIn from '@/app/_components/EditScheduledCheckIn'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckInType } from '@/types/event-types'
import { format } from 'date-fns'
import { ArrowLeft } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function EventDetailPage() {
    const { eventId } = useParams()
    const router = useRouter()
    const [event, setEvent] = useState<CheckInType | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                if (typeof eventId === 'string') {
                    const eventData = await getEventById(eventId)
                    setEvent(eventData)
                }
            } catch (error) {
                console.error('Error fetching event:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchEvent()
    }, [eventId])

    if (loading) {
        return <div className="p-8">Loading...</div>
    }

    if (!event) {
        return <div className="p-8">Event not found</div>
    }

    return (
        <div className="p-8">
            <div className="mb-6 flex items-center gap-4">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>
                <h1 className="text-2xl font-bold">Event Details</h1>
            </div>

            <Card className="p-6">
                <div className="space-y-4">
                    <div>
                        <h2 className="text-xl font-semibold">
                            {event.name || 'Unnamed Event'}
                        </h2>
                        <p className="text-gray-500">{event.clientName}</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <h3 className="font-medium text-gray-700">
                                Date & Time
                            </h3>
                            <p>
                                {format(
                                    new Date(event.startTime),
                                    'MMMM d, yyyy',
                                )}
                                <br />
                                {format(new Date(event.startTime), 'h:mm a')}
                                {event.endTime &&
                                    ` - ${format(new Date(event.endTime), 'h:mm a')}`}
                            </p>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-700">
                                Location
                            </h3>
                            <p>{event.location || 'No location specified'}</p>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-700">
                                Contact Type
                            </h3>
                            <p>{event.contactCode || 'Not specified'}</p>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-700">
                                Assignee
                            </h3>
                            <p>{event.assigneeId || 'Not assigned'}</p>
                        </div>

                        {event.description && (
                            <div className="md:col-span-2">
                                <h3 className="font-medium text-gray-700">
                                    Description
                                </h3>
                                <p>{event.description}</p>
                            </div>
                        )}

                        {event.caseNotes && (
                            <div className="md:col-span-2">
                                <h3 className="font-medium text-gray-700">
                                    Case Notes
                                </h3>
                                <p>{event.caseNotes}</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex gap-4">
                        <Button onClick={() => setIsEditing(true)}>
                            Edit Event
                        </Button>
                    </div>
                </div>
            </Card>

            {isEditing && (
                <EditScheduledCheckIn
                    selectedEvent={{
                        ...event,
                        start: new Date(event.startTime).getTime(),
                        end: event.endTime
                            ? new Date(event.endTime).getTime()
                            : new Date(event.startTime).getTime() +
                              30 * 60 * 1000,
                    }}
                    onClose={() => setIsEditing(false)}
                    onUpdatedEvent={() => {
                        setIsEditing(false)
                        // Refresh the event data
                        if (typeof eventId === 'string') {
                            getEventById(eventId).then(setEvent)
                        }
                    }}
                />
            )}
        </div>
    )
}

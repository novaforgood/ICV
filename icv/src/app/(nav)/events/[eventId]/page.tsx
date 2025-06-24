'use client'

import { getEventById } from '@/api/events'
import categoryColors, {
    ContactTypeKey,
} from '@/app/_components/categoryColors'
import { ContactTypeBadge } from '@/app/_components/ContactTypeBadge'
import EditCaseNotes from '@/app/_components/EditCaseNotes'
import EditScheduledCheckIn from '@/app/_components/EditScheduledCheckIn'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckInType } from '@/types/event-types'
import { format } from 'date-fns'
import { ArrowLeft, Edit2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function EventDetailPage() {
    const { eventId } = useParams()
    const router = useRouter()
    const [event, setEvent] = useState<CheckInType | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [isEditingCaseNotes, setIsEditingCaseNotes] = useState(false)
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
    //ONLY WORKS with contactcode, not event.category
    function isContactTypeKey(value: any): value is ContactTypeKey {
        return typeof value === 'string' && value in categoryColors
    }

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
                    <div className="flex flex-row gap-4">
                        <h2 className="text-xl font-bold">
                            {format(new Date(event.startTime), 'MMMM d, yyyy')}
                        </h2>
                        {isContactTypeKey(event.contactCode) ? (
                            <ContactTypeBadge
                                type={event.contactCode as ContactTypeKey}
                            />
                        ) : (
                            <ContactTypeBadge type="Other" />
                        )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <h3 className="font-bold text-gray-700">
                                Start Time
                            </h3>
                            <p>{format(new Date(event.startTime), 'h:mm a')}</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-700">
                                Location
                            </h3>
                            <p>{event.location || 'No location specified'}</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-700">
                                End Time
                            </h3>
                            <p>
                                {event.endTime &&
                                    `${format(new Date(event.endTime), 'h:mm a')}`}
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-700">Staff</h3>
                            <p>{String(event.assigneeId || 'Not assigned')}</p>
                        </div>

                        {event.description && (
                            <div className="md:col-span-2">
                                <h3 className="font-bold text-gray-700">
                                    Description
                                </h3>
                                <p>{event.description}</p>
                            </div>
                        )}

                        <div className="md:col-span-2">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-gray-700">
                                    Case Notes
                                </h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsEditingCaseNotes(true)}
                                    className="flex items-center gap-2"
                                >
                                    <Edit2 className="h-4 w-4" />
                                    Edit Notes
                                </Button>
                            </div>
                            <p className="mt-2 whitespace-pre-wrap">
                                {event.caseNotes || 'No case notes available.'}
                            </p>
                        </div>
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
                    fromEvent={true}
                />
            )}

            {isEditingCaseNotes && (
                <EditCaseNotes
                    eventId={event.id!}
                    initialNotes={event.caseNotes || ''}
                    onClose={() => setIsEditingCaseNotes(false)}
                    onSave={(notes) => {
                        setEvent({ ...event, caseNotes: notes })
                        setIsEditingCaseNotes(false)
                    }}
                />
            )}
        </div>
    )
}

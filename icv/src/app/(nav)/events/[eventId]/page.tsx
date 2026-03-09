'use client'

import { getEventById } from '@/api/events'
import { getAllUsers } from '@/api/clients'
import categoryColors, {
    ContactTypeKey,
} from '@/app/_components/categoryColors'
import { ContactTypeBadge } from '@/app/_components/ContactTypeBadge'
import EditCaseNotes from '@/app/_components/EditCaseNotes'
import EditScheduledCheckIn from '@/app/_components/calendar/EditScheduledCheckIn'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckInType } from '@/types/event-types'
import { Users } from '@/types/user-types'
import { format } from 'date-fns'
import { ArrowLeft, Edit2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

export default function EventDetailPage() {
    const { eventId } = useParams()
    const router = useRouter()
    const [event, setEvent] = useState<CheckInType | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [isEditingCaseNotes, setIsEditingCaseNotes] = useState(false)
    const [loading, setLoading] = useState(true)
    const { data: users } = useSWR<Users[]>('users', getAllUsers)

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

    const rawAssigneeId = String(
        (event as { assigneeId?: string } | null)?.assigneeId ??
            (event as { asigneeId?: string } | null)?.asigneeId ??
            '',
    )

    const assigneeUser =
        users?.find(
            (staff) =>
                staff.uid === rawAssigneeId ||
                staff.id === rawAssigneeId ||
                staff.name === rawAssigneeId,
        ) ?? null

    const assigneeDisplayName =
        assigneeUser?.name || (rawAssigneeId || 'Not assigned')

    if (loading) {
        return <div className="m-[48px]">Loading...</div>
    }

    if (!event) {
        return <div className="m-[48px]">Event not found</div>
    }

    return (
        <div className="m-[48px]">
            <div className="mb-6 flex items-center gap-4">
            <button type="button" onClick={() => router.back()}>
                        {'<'} Exit Case Notes
                    </button>
            </div>

                <div className="space-y-[24px]">

                    <div className="flex flex-col space-y-[24px] md:flex-row md:justify-between">
                    <div className="flex sm:flex-row md:gap-[12px] sm:gap-[8px] items-center flex-col">
                        <label className="text-[24px] font-bold font-['Epilogue']">
                            {format(new Date(event.startTime), 'MMMM d, yyyy')}
                        </label>
                        {isContactTypeKey(event.contactCode) ? (
                            <ContactTypeBadge
                                type={event.contactCode as ContactTypeKey}
                            />
                        ) : (
                            <ContactTypeBadge type="Other" />
                        )}
                    </div>
                                    {isEditingCaseNotes && <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex flex-row space-x-[8px] self-end rounded-[5px] bg-black px-[12px] py-[8px] text-[14px] text-white"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="20px"
                                            viewBox="0 -960 960 960"
                                            width="20px"
                                            fill="#FFFFFF"
                                        >
                                            <path d="M216-216h51l375-375-51-51-375 375v51Zm-72 72v-153l498-498q11-11 23.84-16 12.83-5 27-5 14.16 0 27.16 5t24 16l51 51q11 11 16 24t5 26.54q0 14.45-5.02 27.54T795-642L297-144H144Zm600-549-51-51 51 51Zm-127.95 76.95L591-642l51 51-25.95-25.05Z" />
                                        </svg>
                                        <label>Edit Event Details</label>
                                    </button>
                                    }
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <h3 className="font-bold text-gray-700">
                                Start Time
                            </h3>
                            <p>{format(new Date(event.startTime), 'h:mm a')}</p>
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
                            <h3 className="font-bold text-gray-700">
                                Location
                            </h3>
                            <p>{event.location || 'No location specified'}</p>
                        </div>


                        <div>
                            <h3 className="font-bold text-gray-700">Staff</h3>
                            <p>{assigneeDisplayName}</p>
                        </div>

                        {event.description && (
                            <div className="md:col-span-2">
                                <h3 className="font-bold text-gray-700">
                                    Description
                                </h3>
                                <p>{event.description}</p>
                            </div>
                        )}
                    </div>

                    <div className="h-px bg-gray-200"/>


                    <div className="md:col-span-2">
                        {isEditingCaseNotes ? (
                            <EditCaseNotes
                                eventId={event.id!}
                                initialNotes={event.caseNotes || ''}
                                clientName={event.clientName}
                                onClose={() => setIsEditingCaseNotes(false)}
                                onSave={(notes) => {
                                    setEvent({ ...event, caseNotes: notes })
                                    setIsEditingCaseNotes(false)
                                }}
                            />
                        ) : (
                            <>
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-gray-700">
                                        Case Notes
                                    </h3>
                                    <button
                                        onClick={() => setIsEditingCaseNotes(true)}
                                        className="flex flex-row space-x-[8px] rounded-[5px] bg-black px-[12px] py-[8px] text-[14px] text-white"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="20px"
                                            viewBox="0 -960 960 960"
                                            width="20px"
                                            fill="#FFFFFF"
                                        >
                                            <path d="M216-216h51l375-375-51-51-375 375v51Zm-72 72v-153l498-498q11-11 23.84-16 12.83-5 27-5 14.16 0 27.16 5t24 16l51 51q11 11 16 24t5 26.54q0 14.45-5.02 27.54T795-642L297-144H144Zm600-549-51-51 51 51Zm-127.95 76.95L591-642l51 51-25.95-25.05Z" />
                                        </svg>
                                        <label>Edit</label>
                                    </button>
                                </div>
                                <p className="mt-2 whitespace-pre-wrap">
                                    {event.caseNotes || 'No case notes available.'}
                                </p>
                            </>
                        )}
                    </div>

                    
                </div>
        

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
                    showViewCaseNotes={false}
                />
            )}

        </div>
    )
}

'use client'

import { getAllClients, getAllUsers, getClientById } from '@/api/clients'
import { deleteCheckIn, updateCheckIn } from '@/api/events'
import DeleteConfirmDialog from '@/app/_components/DeleteConfirmDialog'
import { Card } from '@/components/ui/card'
import { NewClient } from '@/types/client-types'
import { CheckInType, ContactType } from '@/types/event-types'
import { Users } from '@/types/user-types'
import { roundToNearest10Minutes } from '@/utils/dateUtils'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import useSWR from 'swr'
import ClientCard from '../ClientCard'
import CheckInFormFields, { StaffOption } from './CheckInFormFields'

interface EditScheduledCheckInProps {
    onClose: () => void
    onUpdatedEvent: () => void
    selectedEvent: any
    fromEvent: boolean
    showViewCaseNotes?: boolean
}

type ClientWithLastCheckin = NewClient & { lastCheckinDate?: string }

const EditScheduledCheckIn: React.FC<EditScheduledCheckInProps> = ({
    onClose,
    selectedEvent,
    onUpdatedEvent,
    fromEvent,
    showViewCaseNotes = true,
}) => {
    const [editMode, setEditMode] = useState(fromEvent)
    const [date, setDate] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [location, setLocation] = useState('')
    const [contactType, setContactType] = useState<string>(
        ContactType.Values['Wellness Check'],
    )
    const [assigneeId, setAssigneeId] = useState('')
    const [selectedClientDocId, setSelectedClientDocId] = useState('')
    const { data: clients } = useSWR<NewClient[]>('clients', getAllClients)
    const [showUpdateSuccess, setShowUpdateSuccess] = useState(false)
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [client, setClient] = useState<ClientWithLastCheckin | null>(null)
    const [staffOptions, setStaffOptions] = useState<StaffOption[]>([])
    const [submitting, setSubmitting] = useState(false)

    const router = useRouter()

    useEffect(() => {
        if (selectedEvent) {
            const start = new Date(selectedEvent.start)
            const end = new Date(selectedEvent.end)
            const clientId =
                selectedEvent.clientDocId || selectedEvent.clientId || ''

            setDate(format(start, 'yyyy-MM-dd'))
            setStartTime(format(start, 'HH:mm'))
            setEndTime(format(end, 'HH:mm'))
            setLocation(selectedEvent.location || '')
            setContactType(selectedEvent.contactCode)
            setSelectedClientDocId(clientId)
            setAssigneeId(selectedEvent.assigneeId || selectedEvent.asigneeId || '')

            // Fetch client data asynchronously
            const fetchClient = async () => {
                if (!clientId) {
                    setClient(null)
                    return
                }
                try {
                    const clientData = await getClientById(clientId)
                    if (clientData) {
                        setClient(clientData)
                        console.log('client updated:', clientData)
                    } else {
                        setClient(null)
                        console.error('No client data found')
                    }
                } catch (error) {
                    console.error('Error fetching client:', error)
                    setClient(null)
                }
            }
            fetchClient()
        }
    }, [selectedEvent])

    useEffect(() => {
        setEditMode(fromEvent)
    }, [selectedEvent?.id, fromEvent])

    useEffect(() => {
        const fetchStaffOptions = async () => {
            try {
                const users = await getAllUsers()
                const options = users
                    .map((staff: Users) => ({
                        label: staff.name,
                        value: staff.uid ?? staff.id ?? '',
                    }))
                    .filter((option) => option.value)

                if (
                    assigneeId &&
                    !options.some(
                        (option) =>
                            option.value === assigneeId ||
                            option.label === assigneeId,
                    )
                ) {
                    options.unshift({
                        label: assigneeId,
                        value: assigneeId,
                    })
                }
                setStaffOptions(options)
            } catch (error) {
                console.error('Error fetching staff options:', error)
            }
        }
        fetchStaffOptions()
    }, [assigneeId])

    const selectedClient = useMemo(() => {
        if (!clients || !selectedClientDocId) return null
        return clients.find((client) => client.docId === selectedClientDocId)
    }, [clients, selectedClientDocId])

    const selectedAssigneeName =
        staffOptions.find(
            (option) =>
                option.value === assigneeId || option.label === assigneeId,
        )?.label ??
        assigneeId ??
        '-'

    const handleSubmit = (e: React.FormEvent) => {
        if (submitting) return
        e.preventDefault()

        const startDateTime = new Date(`${date}T${startTime}`).toLocaleString(
            'en-US',
        )
        const endDateTime = new Date(`${date}T${endTime}`).toLocaleString(
            'en-US',
        )

        const startDateTimeObj = new Date(`${date}T${startTime}`)
        const endDateTimeObj = new Date(`${date}T${endTime}`)

        if (endDateTimeObj <= startDateTimeObj) {
            alert('End time must be after start time.')
            return
        }

        if (!selectedClient) {
            alert('No client selected.')
            return
        }

        const updatedEvent: CheckInType = {
            id: selectedEvent.id,
            startTime: startDateTime,
            endTime: endDateTime,
            assigneeId,
            location,
            clientDocId: selectedClientDocId,
            contactCode: contactType,
            scheduled: true,
            clientCode: selectedClient.clientCode ?? '',
            clientName:
                `${selectedClient.firstName || ''} ${selectedClient.lastName || ''}`.trim(),
        }

        setSubmitting(true)
        updateCheckIn(updatedEvent)
            .then(() => {
                setShowUpdateSuccess(true)
                setTimeout(() => {
                    setShowUpdateSuccess(false)
                    onUpdatedEvent()
                    onClose()
                }, 1000)
                setSubmitting(false)
            })
            .catch((err) => {
                console.error(err)
                alert('Error updating event.')
                setSubmitting(false)
            })
    }

    const handleDelete = async () => {
        try {
            await deleteCheckIn(selectedEvent.id)
            setShowDeleteConfirm(false)
            setShowDeleteSuccess(true)
            setEditMode(false)
            setTimeout(() => {
                setShowDeleteSuccess(false)
                onUpdatedEvent()
                onClose()
            }, 1000)
        } catch (err) {
            console.error(err)
            alert('Error deleting event.')
        }
    }

    if (!selectedEvent) return null

    const portalTarget = typeof document !== 'undefined' ? document.body : null

    return (
        <>
            {/* event info popup*/}

            {portalTarget &&
                !showUpdateSuccess &&
                !showDeleteSuccess &&
                !showDeleteConfirm &&
                !editMode &&
                !fromEvent &&
                createPortal(
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div
                            className="absolute inset-0 bg-black bg-opacity-30"
                            onClick={onClose}
                            aria-hidden
                        />
                        <div
                            className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-lg"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="mb-4 flex flex-row items-center justify-between gap-3">
                                <span className="inline-flex items-center rounded-full bg-purple-200 px-3 py-1.5 text-sm font-medium leading-none text-purple-800">
                                    {selectedEvent.contactCode}
                                </span>
                                <div className="flex flex-row items-center gap-1">
                                    <button
                                        onClick={() => setEditMode(true)}
                                        className="inline-flex size-8 items-center justify-center rounded-md hover:bg-gray-100"
                                    >
                                        <span className="material-symbols-outlined text-[1.25rem]">
                                            edit
                                        </span>
                                    </button>
                                    <button
                                        onClick={() =>
                                            setShowDeleteConfirm(true)
                                        }
                                        className="inline-flex size-8 items-center justify-center rounded-md hover:bg-gray-100"
                                    >
                                        <span className="material-symbols-outlined text-[1.25rem]">
                                            delete
                                        </span>
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="inline-flex size-8 items-center justify-center rounded-md hover:bg-gray-100"
                                    >
                                        <span className="material-symbols-outlined text-[1.25rem]">
                                            close
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <h2 className="text-2xl font-semibold">
                                {selectedEvent.clientName}
                            </h2>
                            <p className="mb-4 text-gray-500">
                                {client?.clientCode ?? ''}
                            </p>

                            <div className="mb-2 flex items-center gap-2 text-gray-800">
                                <span className="material-symbols-outlined">
                                    calendar_today
                                </span>
                                <p>
                                    {roundToNearest10Minutes(
                                        new Date(selectedEvent.start),
                                    ).toLocaleString()}{' '}
                                    –{' '}
                                    {roundToNearest10Minutes(
                                        new Date(selectedEvent.end),
                                    ).toLocaleTimeString([], {
                                        hour: 'numeric',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>

                            <div className="mb-2 flex items-center gap-2 text-gray-800">
                                <span className="material-symbols-outlined">
                                    person
                                </span>
                                <p>{selectedAssigneeName}</p>
                            </div>

                            {selectedEvent.location && (
                                <div className="mb-2 flex items-center gap-2 text-gray-800">
                                    <span className="material-symbols-outlined">
                                        location_on
                                    </span>
                                    <p>{selectedEvent.location}</p>
                                </div>
                            )}
                            {showViewCaseNotes && (
                                <button
                                    type="button"
                                    className="mx-auto mt-[16px] flex cursor-pointer items-center gap-2 rounded-[5px] bg-[#4EA0C9] px-[12px] py-[8px] text-white"
                                    onClick={() =>
                                        router.push(`/events/${selectedEvent.id}`)
                                    }
                                >
                                    View case notes
                                </button>
                            )}
                        </div>
                    </div>,
                    portalTarget,
                )}
            {/* editing event */}
            {portalTarget &&
                !showUpdateSuccess &&
                !showDeleteSuccess &&
                editMode &&
                createPortal(
                    <div className="fixed inset-0 z-50 flex">
                        <div
                            className="fixed inset-0 bg-black bg-opacity-30"
                            onClick={onClose}
                            aria-hidden
                        />
                        <div className="fixed right-0 top-0 z-[100] h-full w-full overflow-y-auto border-l border-gray-200 bg-white p-6 shadow-lg sm:w-[600px] sm:p-8">
                            <div className="absolute right-4 top-4 flex gap-3 text-gray-600"></div>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Header */}

                                <div className="mb-6 flex items-center justify-between">
                                    <h2 className="font-['Epilogue'] text-[24px] font-[600]">
                                        Edit Check-In
                                    </h2>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <span className="material-symbols-outlined">
                                            close
                                        </span>
                                    </button>
                                </div>

                                <div>
                                    {client && <ClientCard client={client} />}
                                </div>

                                <CheckInFormFields
                                    date={date}
                                    setDate={setDate}
                                    startTime={startTime}
                                    setStartTime={setStartTime}
                                    endTime={endTime}
                                    setEndTime={setEndTime}
                                    assigneeId={assigneeId}
                                    setAssigneeId={setAssigneeId}
                                    staffOptions={staffOptions}
                                    location={location}
                                    setLocation={setLocation}
                                    contactType={contactType}
                                    setContactType={setContactType}
                                />

                                {/* Buttons */}
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        className={`transition" flex-1 rounded py-2 text-white shadow ${submitting ? 'bg-gray-300' : 'bg-[#4EA0C9]'}`}
                                    >
                                        {submitting
                                            ? 'Submitting...'
                                            : 'Save changes'}
                                    </button>
                                    {showViewCaseNotes && (
                                        <button
                                            type="button"
                                            className="flex-1 rounded bg-black py-2 text-white shadow transition hover:bg-gray-800"
                                            onClick={() =>
                                                router.push(
                                                    `/events/${selectedEvent.id}`,
                                                )
                                            }
                                        >
                                            View case notes
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>,
                    portalTarget,
                )}
            {/* event edit success message */}
            {portalTarget &&
                showUpdateSuccess &&
                createPortal(
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <Card className="w-fit rounded px-4 py-2 text-center">
                            Check in updated successfully!
                        </Card>
                    </div>,
                    portalTarget,
                )}
            <DeleteConfirmDialog
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDelete}
                entityName={selectedEvent?.clientName}
            />
            {/* delete event success message */}
            {portalTarget &&
                showDeleteSuccess &&
                createPortal(
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <Card className="w-fit rounded px-4 py-2 text-center">
                            Check in deleted.
                        </Card>
                    </div>,
                    portalTarget,
                )}
        </>
    )
}

export default EditScheduledCheckIn

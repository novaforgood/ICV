'use client'

import { getAllClients, getClientById, getUsersCollection } from '@/api/clients'
import { deleteCheckIn, updateCheckIn } from '@/api/events'
import { ContactTypeBadge } from '@/app/_components/ContactTypeBadge'
import { Card } from '@/components/ui/card'
import { NewClient } from '@/types/client-types'
import { CheckInType, ContactType } from '@/types/event-types'
import { format } from 'date-fns'
import dayjs from 'dayjs'
import React, { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import useSWR from 'swr'
import ClientCard from '../ClientCard'
import { useRouter } from 'next/navigation'
import {
    LocalizationProvider,
    TimePicker,
} from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

function roundToNearest10Minutes(date: Date): Date {
    const d = new Date(date)
    const minutes = d.getMinutes()
    const rounded = Math.round(minutes / 10) * 10
    if (rounded === 60) {
        d.setHours(d.getHours() + 1)
        d.setMinutes(0, 0, 0)
    } else {
        d.setMinutes(rounded, 0, 0)
    }
    return d
}

interface EditScheduledCheckInProps {
    onClose: () => void
    onUpdatedEvent: () => void
    selectedEvent: any
    fromEvent: boolean
}

type ClientWithLastCheckin = NewClient & { lastCheckinDate?: string }

const EditScheduledCheckIn: React.FC<EditScheduledCheckInProps> = ({
    onClose,
    selectedEvent,
    onUpdatedEvent,
    fromEvent,
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
    const [client, setClient] = useState<ClientWithLastCheckin | null>(null)
    const [staffNames, setStaffNames] = useState<string[]>([])
    const [submitting, setSubmitting] = useState(false)

    const router = useRouter()

    useEffect(() => {
        if (selectedEvent) {
            const start = new Date(selectedEvent.start)
            const end = new Date(selectedEvent.end)
            setDate(format(start, 'yyyy-MM-dd'))
            setStartTime(format(start, 'HH:mm'))
            setEndTime(format(end, 'HH:mm'))
            setLocation(selectedEvent.location || '')
            setContactType(selectedEvent.contactCode)
            setSelectedClientDocId(selectedEvent.clientDocId)
            setAssigneeId(selectedEvent.assigneeId || '')

            // Fetch client data asynchronously
            const fetchClient = async () => {
                if (!selectedEvent.clientDocId) {
                    setClient(null)
                    return
                }
                try {
                    const clientData = await getClientById(
                        selectedEvent.clientDocId,
                    )
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
        // Fetch staff names when component mounts
        const fetchStaffNames = async () => {
            try {
                const names = await getUsersCollection()
                if (assigneeId && !names.includes(assigneeId)) {
                    names.push(assigneeId)
                }
                setStaffNames(names)
            } catch (error) {
                console.error('Error fetching staff names:', error)
            }
        }
        fetchStaffNames()
    }, [assigneeId])

    const selectedClient = useMemo(() => {
        if (!clients || !selectedClientDocId) return null
        return clients.find((client) => client.docId === selectedClientDocId)
    }, [clients, selectedClientDocId])

  const handleSubmit = (e: React.FormEvent) => {
    if (submitting) return
    e.preventDefault()
    
    const startDateTime = new Date(`${date}T${startTime}`).toLocaleString('en-US')
    const endDateTime = new Date(`${date}T${endTime}`).toLocaleString('en-US')

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
            clientId: selectedClient.clientCode ?? '',
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

    const handleDelete = (e: React.FormEvent) => {
        e.preventDefault()

        deleteCheckIn(selectedEvent.id)
            .then(() => {
                setShowDeleteSuccess(true)
                setEditMode(false)

                setTimeout(() => {
                    setShowDeleteSuccess(false)
                    onUpdatedEvent()
                    onClose()
                }, 1000)
            })
            .catch((err) => {
                console.error(err)
                alert('Error deleting event.')
            })
    }

    if (!selectedEvent) return null

    const portalTarget =
        typeof document !== 'undefined' ? document.body : null

    return (
        <>
            {/* event info popup*/}

            {portalTarget &&
                !showUpdateSuccess &&
                !showDeleteSuccess &&
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
                            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-lg z-10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="absolute right-4 top-4 flex gap-3 text-gray-600">
                                <button onClick={() => setEditMode(true)}>
                                    <span className="material-symbols-outlined">
                                        edit
                                    </span>
                                </button>
                                <button onClick={handleDelete}>
                                    <span className="material-symbols-outlined">
                                        delete
                                    </span>
                                </button>
                                <button onClick={onClose}>
                                    <span className="material-symbols-outlined">
                                        close
                                    </span>
                                </button>
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

                            <span className="mb-4 inline-block rounded-full bg-purple-200 px-3 py-1 text-sm font-medium text-purple-800">
                                {selectedEvent.contactCode}
                            </span>

                            <div className="mb-2 flex items-center gap-2 text-gray-800">
                                <span className="material-symbols-outlined">
                                    person
                                </span>
                                <p>{selectedEvent.assigneeId}</p>
                            </div>

                            {selectedEvent.location && (
                                <div className="mb-2 flex items-center gap-2 text-gray-800">
                                    <span className="material-symbols-outlined">
                                        location_on
                                    </span>
                                    <p>{selectedEvent.location}</p>
                                </div>
                            )}
            <button
                type="button"
                className="flex items-center gap-2 text-blue-700 mt-4 underline cursor-pointer"
                onClick={() => router.push(`/events/${selectedEvent.id}`)}
            >
                <span className="material-symbols-outlined">description</span>
                View case notes
            </button>
        </div>
      </div>,
                    portalTarget
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
                <div className="fixed right-0 top-0 h-full w-[600px] bg-white shadow-lg border-l border-gray-200 p-8 z-[100] overflow-y-auto">
          <div className="absolute top-4 right-4 flex gap-3 text-gray-600">
          </div>
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
            
            { client && (< ClientCard client={client} /> )}
          </div>

                        {/* Date */}
                        <div>
                            <label className="mb-1 block">Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="focus:ring-blue-500 mb-1 block w-full rounded border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2"
                            />
                        </div>

                        {/* Start & End Time */}
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <TimePicker
                                        label="Start time"
                                        value={date && startTime ? dayjs(roundToNearest10Minutes(new Date(`${date}T${startTime}`))) : null}
                                        onChange={(newValue) =>
                                            setStartTime(newValue ? newValue.format('HH:mm') : '')
                                        }
                                        minutesStep={5}
                                        timeSteps={{ minutes: 5 }}
                                        slotProps={{
                                            textField: {
                                                required: true,
                                                fullWidth: true,
                                                size: 'small',
                                            },
                                        }}
                                    />
                                </div>
                                <div className="flex-1">
                                    <TimePicker
                                        label="End time"
                                        value={date && endTime ? dayjs(roundToNearest10Minutes(new Date(`${date}T${endTime}`))) : null}
                                        onChange={(newValue) =>
                                            setEndTime(newValue ? newValue.format('HH:mm') : '')
                                        }
                                        minutesStep={5}
                                        timeSteps={{ minutes: 5 }}
                                        slotProps={{
                                            textField: {
                                                required: true,
                                                fullWidth: true,
                                                size: 'small',
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </LocalizationProvider>

                        {/* Staff display */}
                        <div className="relative">
                            <label className="mb-1 block">Staff</label>
                            <select
                                className="w-full rounded border border-gray-300 px-4 py-2"
                                value={assigneeId}
                                onChange={(e) => setAssigneeId(e.target.value)}
                            >
                                {staffNames.map((name) => (
                                    <option key={name} value={name}>
                                        {name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="mb-1 block">Location</label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="focus:ring-blue-500 mb-1 block w-full rounded border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2"
                            />
                        </div>

                        {/* Contact Code */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Contact code
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.values(ContactType.Values).map(
                                    (type) => (
                                        <div
                                            key={type}
                                            className="flex items-center gap-2"
                                        >
                                            <input
                                                type="radio"
                                                id={type
                                                    .toLowerCase()
                                                    .replace(/\s+/g, '-')}
                                                name="contact-code"
                                                checked={contactType === type}
                                                onChange={() =>
                                                    setContactType(type)
                                                }
                                                className="h-4 w-4"
                                            />
                                            <label
                                                htmlFor={type
                                                    .toLowerCase()
                                                    .replace(/\s+/g, '-')}
                                            >
                                                <ContactTypeBadge type={type} />
                                            </label>
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                className={`flex-1 rounded  py-2 text-white shadow transition"
                                ${submitting ? 'bg-gray-300' : 'bg-[#4EA0C9]'}`}
              >
                                  {submitting ? 'Submitting...' : 'Save changes'}
                            </button>
                            <button
                                type="button"
                                className="flex-1 rounded bg-black py-2 text-white shadow transition hover:bg-gray-800"
                                onClick={() => router.push(`/events/${selectedEvent.id}`)}
                            >
                                View case notes
                            </button>
                        </div>
                    </form>
                </div>
            </div>,
            portalTarget
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
                    portalTarget
                )}
            {/* delete event success message */}
            {portalTarget &&
                showDeleteSuccess &&
                createPortal(
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <Card className="w-fit rounded px-4 py-2 text-center">
                            Check in deleted.
                        </Card>
                    </div>,
                    portalTarget
                )}
        </>
    )
}

export default EditScheduledCheckIn

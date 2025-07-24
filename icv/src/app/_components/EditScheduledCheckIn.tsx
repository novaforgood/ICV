'use client'

import { getAllClients, getClientById, getUsersCollection } from '@/api/clients'
import { deleteCheckIn, updateCheckIn } from '@/api/events'
import { ContactTypeBadge } from '@/app/_components/ContactTypeBadge'
import { Card } from '@/components/ui/card'
import { NewClient } from '@/types/client-types'
import { CheckInType, ContactType } from '@/types/event-types'
import { format } from 'date-fns'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import ClientCard from './ClientCard'
import { useRouter } from 'next/navigation'

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
    if (!selectedEvent) return null

    const [editMode, setEditMode] = useState(fromEvent)
    const [date, setDate] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [location, setLocation] = useState('')
    const [contactType, setContactType] = useState<string>(
        ContactType.Values['Wellness Check'],
    )
    const [assigneeId, setAssigneeId] = useState('')
    const [clientSearch, setClientSearch] = useState('')
    const [selectedClientDocId, setSelectedClientDocId] = useState('')
    const { data: clients } = useSWR<NewClient[]>('clients', getAllClients)
    const [showUpdateSuccess, setShowUpdateSuccess] = useState(false)
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false)
    const [client, setClient] = useState<ClientWithLastCheckin | null>(null)
    const [staffNames, setStaffNames] = useState<string[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
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
            clientId: selectedClient.id,
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

    return (
        <>
            {/* event info popup*/}

            {!showUpdateSuccess &&
                !showDeleteSuccess &&
                !editMode &&
                !fromEvent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                        <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
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
                                {selectedEvent.clientId}
                            </p>

                            <div className="mb-2 flex items-center gap-2 text-gray-800">
                                <span className="material-symbols-outlined">
                                    calendar_today
                                </span>
                                <p>
                                    {new Date(
                                        selectedEvent.start,
                                    ).toLocaleString()}{' '}
                                    –{' '}
                                    {new Date(
                                        selectedEvent.end,
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
      </div>
    )}
    {/* editing event */}
    {!showUpdateSuccess && !showDeleteSuccess && editMode && (
      <div className="fixed right-0 top-0 h-full w-[600px] bg-white shadow-lg border-l border-gray-200 p-8 z-[100] overflow-y-auto">
          <div className="absolute top-4 right-4 flex gap-3 text-gray-600">

            <button onClick={onClose}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header */}
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
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label
                                    htmlFor="startTime"
                                    className="mb-1 block"
                                >
                                    Start time
                                </label>
                                <input
                                    id="startTime"
                                    type="time"
                                    value={startTime}
                                    onChange={(e) =>
                                        setStartTime(e.target.value)
                                    }
                                    className="w-full rounded border p-2"
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="endTime" className="mb-1 block">
                                    End time
                                </label>
                                <input
                                    id="endTime"
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="w-full rounded border p-2"
                                    required
                                />
                            </div>
                        </div>

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
            )}
            {/* event edit success message */}
            {showUpdateSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <Card className="w-fit rounded px-4 py-2 text-center">
                        Check in updated successfully!
                    </Card>
                </div>
            )}
            {/* delete event success message */}
            {showDeleteSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <Card className="w-fit rounded px-4 py-2 text-center">
                        Check in deleted.
                    </Card>
                </div>
            )}
        </>
    )
}

export default EditScheduledCheckIn

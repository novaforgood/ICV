'use client'

import { getAllClients } from '@/api/clients'
import { createCheckIn } from '@/api/events'
import { Card } from '@/components/ui/card'
import { CheckInType, ContactType } from '@/types/event-types'
import { format } from 'date-fns'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useMemo, useState } from 'react'
import useSWR, { mutate } from 'swr'

interface ScheduledCheckInCreationProps {
    onNewEvent: () => void,
    clientName?: string,
    variant?: 'default' | 'checkins-page'
}

const ScheduledCheckInCreation: React.FC<ScheduledCheckInCreationProps> = ({
    onNewEvent,
    clientName,
    variant = 'default',
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    const [date, setDate] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [location, setLocation] = useState('')
    const [contactType, setContactType] = useState(
        ContactType.Values['Wellness Check'],
    )
    const [assigneeId, setAssigneeId] = useState('')
    const [clientSearch, setClientSearch] = useState('')
    const [selectedClientDocId, setSelectedClientId] = useState('')

    const { data: clients } = useSWR('clients', getAllClients)

    const filteredClients = useMemo(() => {
        if (!clients) return []
        return clients.filter((client: any) => {
            const fullName =
                `${client.firstName || ''} ${client.lastName || ''}`.toLowerCase()
            return fullName.includes(clientSearch.toLowerCase())
        })
    }, [clients, clientSearch])

    const selectedClient = useMemo(() => {
        if (!clients || !selectedClientDocId) return null
        return clients.find(
            (client: any) => client.docId === selectedClientDocId,
        )
    }, [clients, selectedClientDocId])

    const name = useMemo(() => {
        if (clientName) {
          return `Check-in with ${clientName}`
      }
        if (selectedClient) {
            return `Check-in with ${selectedClient.firstName || selectedClient.lastName ? selectedClient.firstName + ' ' + selectedClient.lastName : 'Client ' + selectedClient.docId}`
        }
        return 'Check-in with Client'
    }, [selectedClient])

    useEffect(() => {
        const auth = getAuth()
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user?.displayName) setAssigneeId(user.displayName)
            else setAssigneeId('')
        })
        return () => unsubscribe()
    }, [])

    //useeffect to autofill client search bar with client name PROBLEM: ONLY AUTOFILLS ON FIRST USE, cant just change it to name when onChange in input bc then the dropdown doesnt work properly
    useEffect(() => {
      if (clientName) {
        setClientSearch(clientName)
      }
    }, [clientName])

    const resetFormDefaults = () => {
        const now = new Date()
        setDate(format(now, 'yyyy-MM-dd'))
        setStartTime(format(now, 'HH:mm'))
        setEndTime(format(new Date(now.getTime() + 60 * 60 * 1000), 'HH:mm'))
    }

    useEffect(() => {
        resetFormDefaults()
    }, [])

    const closeModal = () => {
        setIsOpen(false)
        setShowSuccess(false)
        resetFormDefaults()
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!selectedClient) {
            alert('Please select a client before scheduling the event.')
            return
        }

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

        const newEvent: CheckInType & { clientId?: string } = {
            name,
            startTime: startDateTime,
            endTime: endDateTime,
            assigneeId,
            location,
            clientDocId: selectedClientDocId,
            contactCode: contactType,
            scheduled: true,
            clientId: selectedClient.id,
            clientName:
                selectedClient.firstName + ' ' + selectedClient.lastName,
        }

        createCheckIn(newEvent)
            .then(() => {
                setShowSuccess(true)
                setLocation('')
                setClientSearch('')
                setSelectedClientId('')
                mutate('calendar-events')

                setTimeout(() => {
                    setShowSuccess(false)
                    closeModal()
                }, 2000)

                onNewEvent()
            })
            .catch((err) => {
                console.error(err)
                alert('Error creating event.')
            })
    }

    return (
        <>
            <div>
                {variant === 'checkins-page' ? (
                    <button
                        className="w-60 rounded-md bg-sky px-4 py-2 text-white shadow-sm transition-colors duration-200 hover:bg-blue"
                        onClick={() => setIsOpen(true)}
                    >
                        Create Check-In
                    </button>
                ) : (
                    <button
                        className="rounded bg-foreground p-2 text-white"
                        onClick={() => setIsOpen(true)}
                    >
                        Schedule New Event
                    </button>
                )}
            </div>

            {isOpen && showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <Card className="w-fit rounded px-4 py-2 text-center">
                        Check in created successfully!
                    </Card>
                </div>
            )}
            {isOpen && !showSuccess && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50"
                        onClick={closeModal}
                    />

                    {/* Modal */}
                    <div className="fixed right-0 top-0 z-50 h-full w-96 border-l border-gray-200 bg-white p-6 shadow-lg">
                        <div onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={closeModal}
                                className="absolute right-4 top-4 text-xl font-bold text-gray-600 hover:text-black"
                            >
                                ×
                            </button>

                            <h2 className="mb-6 text-xl font-semibold">
                                {name}
                            </h2>

                            <form
                                onSubmit={handleSubmit}
                                className="max-h-[75vh] space-y-4 overflow-y-auto"
                            >
                                <div>
                                    <label className="mb-1 block">Date</label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) =>
                                            setDate(e.target.value)
                                        }
                                        className="w-full rounded border p-2"
                                        required
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="mb-1 block">
                                            Start Time
                                        </label>
                                        <input
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
                                        <label className="mb-1 block">
                                            End Time
                                        </label>
                                        <input
                                            type="time"
                                            value={endTime}
                                            onChange={(e) =>
                                                setEndTime(e.target.value)
                                            }
                                            className="w-full rounded border p-2"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1 block">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) =>
                                            setLocation(e.target.value)
                                        }
                                        className="w-full rounded border p-2"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block">Client</label>
                                    {selectedClientDocId && selectedClient ? (
                                        <div className="flex items-center justify-between rounded bg-gray-200 p-2">
                                            <span>
                                                {selectedClient.firstName}{' '}
                                                {selectedClient.lastName}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedClientId('')
                                                    setClientSearch('')
                                                }}
                                                className="text-gray-600 hover:text-black"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <input
                                                type="text"
                                                placeholder="Search client"
                                                value={clientSearch}
                                                onChange={(e) =>
                                                    setClientSearch(
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded border p-2"
                                            />
                                            {clientSearch && (
                                                <ul className="mt-2 max-h-40 overflow-y-auto border">
                                                    {filteredClients.map(
                                                        (client) => (
                                                            <li
                                                                key={
                                                                    client.docId
                                                                }
                                                                className="cursor-pointer p-2 hover:bg-gray-100"
                                                                onClick={() => {
                                                                    setSelectedClientId(
                                                                        client.docId,
                                                                    )
                                                                    setClientSearch(
                                                                        '',
                                                                    )
                                                                }}
                                                            >
                                                                {
                                                                    client.firstName
                                                                }{' '}
                                                                {
                                                                    client.lastName
                                                                }{' '}
                                                                {client.clientCode &&
                                                                    `(${client.clientCode})`}
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            )}
                                        </>
                                    )}
                                </div>

                                {/* Dropdown for Contact Type */}
                                <div className="form-group mb-4">
                                    <label
                                        htmlFor="contactType"
                                        className="mb-2 block"
                                    >
                                        Select Contact Code
                                    </label>
                                    <select
                                        id="category"
                                        value={contactType}
                                        onChange={(e) =>
                                            setContactType(e.target.value)
                                        }
                                        className="w-full rounded border border-gray-300 p-2"
                                    >
                                        <option value="">
                                            Select a contact type
                                        </option>
                                        {Object.values(ContactType.Values).map(
                                            (option) => (
                                                <option
                                                    key={option}
                                                    value={option}
                                                >
                                                    {option}
                                                </option>
                                            ),
                                        )}
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full rounded bg-foreground py-2 text-white"
                                >
                                    Schedule
                                </button>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default ScheduledCheckInCreation

'use client'

import { getAllClients, getAllUsers } from '@/api/clients'
import { createCheckIn } from '@/api/events'
import { Card } from '@/components/ui/card'
import { roundToNearest10Minutes } from '@/utils/dateUtils'
import { CheckInType, ContactType } from '@/types/event-types'
import { Users } from '@/types/user-types'
import { format } from 'date-fns'
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import useSWR, { mutate } from 'swr'
import CheckInFormFields, { StaffOption } from './CheckInFormFields'
import ClientCard from '../ClientCard'
import ClientSearch from './ClientSearch'

interface ScheduledCheckInCreationProps {
    onNewEvent: () => void
    clientName?: string
    clientDocId?: string
    buttonClassName?: string
}

const ScheduledCheckInCreation: React.FC<ScheduledCheckInCreationProps> = ({
    onNewEvent,
    clientName = '',
    clientDocId,
    buttonClassName,
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    const [date, setDate] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [location, setLocation] = useState('')
    const [contactType, setContactType] = useState<string>(
        ContactType.Values['Wellness Check'],
    )
    const [assigneeId, setAssigneeId] = useState('')
    const [selectedClientDocId, setSelectedClientId] = useState('')
    const [staffOptions, setStaffOptions] = useState<StaffOption[]>([])
    const [currentUserName, setCurrentUserName] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const { data: clients } = useSWR('clients', getAllClients)

    const selectedClient = useMemo(() => {
        if (!clients || !selectedClientDocId) return null
        return clients.find(
            (client: any) => client.docId === selectedClientDocId,
        )
    }, [clients, selectedClientDocId])

    const name = useMemo(() => {
        if (selectedClient) {
            return `Check-in with ${selectedClient.firstName || selectedClient.lastName ? selectedClient.firstName + ' ' + selectedClient.lastName : 'Client ' + selectedClient.docId}`
        }
        return 'Create Check-In'
    }, [selectedClient])

    useEffect(() => {
        const auth = getAuth()
        const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
            setCurrentUserName(user?.displayName ?? '')
            setAssigneeId(user?.uid ?? '')
        })
        return () => unsubscribe()
    }, [])

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
                    !options.some((option) => option.value === assigneeId)
                ) {
                    options.unshift({
                        label: currentUserName || assigneeId,
                        value: assigneeId,
                    })
                }
                setStaffOptions(options)
            } catch (error) {
                console.error('Error fetching staff options:', error)
            }
        }
        fetchStaffOptions()
    }, [assigneeId, currentUserName])

    const resetFormDefaults = () => {
        const now = new Date()
        const roundedNow = roundToNearest10Minutes(now)
        const endTimeDate = new Date(roundedNow.getTime() + 60 * 60 * 1000)
        setDate(format(roundedNow, 'yyyy-MM-dd'))
        setStartTime(format(roundedNow, 'HH:mm'))
        setEndTime(format(roundToNearest10Minutes(endTimeDate), 'HH:mm'))
    }

    useEffect(() => {
        resetFormDefaults()
    }, [])

    useEffect(() => {
        if (clientDocId && isOpen) {
            setSelectedClientId(clientDocId)
        }
    }, [clientDocId, isOpen])

    const closeModal = () => {
        setIsOpen(false)
        setShowSuccess(false)
        resetFormDefaults()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!selectedClient) {
            alert('Please select a client before scheduling the event.')
            return
        }

        if (!assigneeId) {
            alert('No assignee found. Please try logging in again.')
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

        const newEvent: CheckInType & { clientDocId?: string } = {
            name,
            startTime: startDateTime,
            endTime: endDateTime,
            assigneeId,
            location,
            clientDocId: selectedClientDocId,
            contactCode: contactType,
            scheduled: true,
            clientCode: selectedClient.clientCode,
            clientName:
                selectedClient.firstName + ' ' + selectedClient.lastName,
        }

        // Add timeout to the createCheckIn call
        const timeoutDuration = 10000 // 10 seconds
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(
                () => reject(new Error('Request timed out')),
                timeoutDuration,
            )
        })

        setSubmitting(true)
        createCheckIn(newEvent)
            .then(() => {
                setShowSuccess(true)
                setLocation('')
                setSelectedClientId('')
                mutate('calendar-events')
                onNewEvent()

                setTimeout(() => {
                    if (mounted.current) {
                        setShowSuccess(false)
                        closeModal()
                    }
                }, 2000)
            })
            .catch((err) => {
                console.error('Error creating event:', err)
                alert(`Error creating event: ${err.message}. Please try again.`)
            })
            .finally(() => {
                if (mounted.current) {
                    setSubmitting(false)
                }
            })
    }

    // Add mounted ref to handle cleanup
    const mounted = useRef(true)
    useEffect(() => {
        mounted.current = true
        return () => {
            mounted.current = false
        }
    }, [])

    return (
        <>
            <button
                className="rounded-[5px] bg-[#1A1D20] px-[20px] py-[16px] text-white"
                onClick={() => setIsOpen(true)}
            >
                Create Check-In
            </button>

            {isOpen && showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <Card className="w-fit rounded px-4 py-2 text-center">
                        Check-in created successfully!
                    </Card>
                </div>
            )}

            {isOpen && !showSuccess && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                        onClick={closeModal}
                    />

                    {/* Modal */}
                    <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white shadow-xl sm:w-[600px]">
                        <div className="p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="font-['Epilogue'] text-[24px] font-[600]">
                                    Create Check-In
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <span className="material-symbols-outlined">
                                        close
                                    </span>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <label className="text-sm font-medium text-gray-700">
                                            Client
                                        </label>
                                        {selectedClientDocId && selectedClient && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedClientId('')
                                                }
                                                className="text-sm text-gray-500 underline hover:text-gray-700"
                                                aria-label="Clear client selection"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                    {selectedClientDocId && selectedClient ? (
                                        <ClientCard client={selectedClient} />
                                    ) : (
                                        <ClientSearch
                                            key={clientName}
                                            onSelect={setSelectedClientId}
                                            initialSearch={clientName}
                                        />
                                    )}
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

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`w-full rounded-lg p-3 font-medium text-white transition-colors ${submitting ? 'cursor-not-allowed bg-gray-300' : 'bg-black hover:bg-gray-800'}`}
                                >
                                    {submitting ? 'Submitting...' : 'Save'}
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

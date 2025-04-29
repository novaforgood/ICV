'use client'

import React, { useState, useMemo, useEffect } from 'react'
import useSWR from 'swr'
import { CheckInType } from '@/types/event-types'
import { createCheckIn } from '@/api/events'
import { Card } from '@/components/ui/card'
import { getAllClients } from '@/api/clients'
import { CheckInCategory } from '@/types/event-types'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { format } from 'date-fns'

const ScheduledCheckInCreation: React.FC = () => {
    const [date, setDate] = useState('')
    // Initialize startTime and endTime as empty; defaults will be set via useEffect.
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [location, setLocation] = useState('')
    const [name, setName] = useState('')
    const [category, setCategory] = useState(CheckInCategory.Values.Other) // Default to 'Other' category

    // assigneeId now comes from Firebase Authentication
    const [assigneeId, setAssigneeId] = useState('')

    // Client search state
    const [clientSearch, setClientSearch] = useState('')
    const [selectedClientId, setSelectedClientId] = useState('')

    const { data: clients } = useSWR('clients', getAllClients)

    const filteredClients = useMemo(() => {
        if (!clients) return []
        return clients.filter((client: any) => {
            const fullName = `${client.firstName || ''} ${client.lastName || ''}`.toLowerCase()
            return fullName.includes(clientSearch.toLowerCase())
        })
    }, [clients, clientSearch])

    const selectedClient = useMemo(() => {
        if (!clients || !selectedClientId) return null
        return clients.find((client: any) => client.id === selectedClientId)
    }, [clients, selectedClientId])

    // Set current user's UID as assigneeId on mount
    useEffect(() => {
        const auth = getAuth()
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user && user.displayName) {
                setAssigneeId(user.displayName)
            } else {
                setAssigneeId('')
            }
        })

        return () => unsubscribe()
    }, [])

    // Set default startTime to now and endTime to one hour later on mount
    const resetFormDefaults = () => {
        const now = new Date()
        setStartTime(format(now, 'HH:mm'))
        const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000)
        setEndTime(format(oneHourLater, 'HH:mm'))
        setDate(format(now, 'yyyy-MM-dd'))
    }

    useEffect(() => {
        resetFormDefaults()
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!date || isNaN(new Date(date).getTime())) {
            alert('Please select a valid date.');
            return;
        }

        const startDateTime = new Date(`${date}T${startTime}`).toISOString()
        const endDateTime = new Date(`${date}T${endTime}`).toISOString()
        const newEvent: CheckInType & { clientId?: string } = {
            name,
            startTime: startDateTime,
            endTime: endDateTime,
            assigneeId, // current user's uid from Firebase Auth
            location,
            clientId: selectedClientId,
            category: category,
            scheduled: true,
        }

        createCheckIn(newEvent)
            .then(response => {
                console.log('Event created successfully:', response)
                alert('Event created successfully!')
                setName('')
                setDate('')
                setStartTime('')
                setEndTime('')
                setLocation('')
                setCategory('')
                setClientSearch('')
                setSelectedClientId('')
                resetFormDefaults()
            })
            .catch(error => {
                console.error('Error creating event:', error)
            })

        console.log(newEvent)
    }

    return (
        <Card className="flex w-96 p-12 pt-12 pb-6 flex-col justify-start items-center fixed right-0 top-0 h-full">
            <h2 className="self-stretch text-left font-semibold text-[28px] leading-[40px] pb-10">
                Schedule Check-In
            </h2>
            <form onSubmit={handleSubmit} className="w-full">
                {/* Check-in Name */}
                <div className="form-group mb-4">
                    <label htmlFor="name" className="block mb-2">Check-in Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                {/* Date */}
                <div className="form-group mb-4">
                    <label htmlFor="date" className="block mb-2">Date</label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                {/* Start and End Time */}
                <div className="flex flex-row justify-between">
                    <div className="form-group mb-4 w-5/12">
                        <label htmlFor="startTime" className="block mb-2">Start Time</label>
                        <input
                            type="time"
                            id="startTime"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="form-group mb-6 mx-2 self-end">-</div>
                    <div className="form-group mb-4 w-5/12">
                        <label htmlFor="endTime" className="block mb-2">End Time</label>
                        <input
                            type="time"
                            id="endTime"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                </div>
                {/* Location */}
                <div className="form-group mb-4">
                    <label htmlFor="location" className="block mb-2">Location</label>
                    <input
                        type="text"
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                {/* Dropdown for Check-in Category
                <div className="form-group mb-4">
                    <label htmlFor="checkInType" className="block mb-2">Check-in Category</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="">Select a category</option>
                        {Object.values(CheckInCategory.Values).map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div> */}
                {/* Client Search / Selection */}
                <div className="form-group mb-4">
                    <label htmlFor="clientSearch" className="block mb-2">Client</label>
                    {selectedClientId && selectedClient ? (
                        <div className="flex items-center justify-between bg-gray-300 rounded p-2">
                            <span className="truncate">
                                {selectedClient.firstName} {selectedClient.lastName}
                            </span>
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedClientId('')
                                    setClientSearch('')
                                }}
                                className="text-gray-700 hover:text-gray-900"
                            >
                                X
                            </button>
                        </div>
                    ) : (
                        <>
                            <input
                                type="text"
                                id="clientSearch"
                                value={clientSearch}
                                onChange={(e) => setClientSearch(e.target.value)}
                                placeholder="Search by first or last name"
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            {clientSearch && (
                                <ul className="border border-gray-300 mt-2 max-h-40 overflow-y-auto">
                                    {filteredClients.map((client: any) => (
                                        <li
                                            key={client.id}
                                            className={`p-2 cursor-pointer hover:bg-gray-200 ${
                                                selectedClientId === client.id ? 'bg-gray-300' : ''
                                            }`}
                                            onClick={() => {
                                                setSelectedClientId(client.id)
                                                setClientSearch('')
                                            }}
                                        >
                                            {client.firstName} {client.lastName}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    )}
                </div>
                <button type="submit" className="w-full p-2 bg-foreground text-white rounded">
                    Schedule
                </button>
            </form>
        </Card>
    )
}

export default ScheduledCheckInCreation

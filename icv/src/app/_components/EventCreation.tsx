'use client'

import React, { useState, useMemo } from 'react'
import useSWR from 'swr'
import { CaseEventType } from '@/types/event-types'
import { createEvent } from '@/api/events'
import { Card } from '@/components/ui/card'
import { getAllClients } from '@/api/clients'

const EventsCreation: React.FC = () => {
    const [date, setDate] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [assigneeId, setAssigneeId] = useState('')
    const [location, setLocation] = useState('')
    const [name, setName] = useState('')

    // Client search state
    const [clientSearch, setClientSearch] = useState('')
    const [selectedClientId, setSelectedClientId] = useState('')

    // Fetch all clients using getAllClients API
    const { data: clients } = useSWR('clients', getAllClients)

    // Filter clients based on search input (first name and last name)
    const filteredClients = useMemo(() => {
        if (!clients) return []
        return clients.filter((client: any) => {
            const fullName = `${client.firstName || ''} ${client.lastName || ''}`.toLowerCase()
            return fullName.includes(clientSearch.toLowerCase())
        })
    }, [clients, clientSearch])

    // Get full info for the selected client
    const selectedClient = useMemo(() => {
        if (!clients || !selectedClientId) return null
        return clients.find((client: any) => client.id === selectedClientId)
    }, [clients, selectedClientId])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const startDateTime = new Date(`${date}T${startTime}`)
        const endDateTime = new Date(`${date}T${endTime}`)

        // Include clientId in the new event object
        const newEvent: CaseEventType & { clientId?: string } = {
            name: name,
            startTime: startDateTime,
            endTime: endDateTime,
            assigneeId: assigneeId,
            location: location,
            clientId: selectedClientId
        }

        createEvent(newEvent)
            .then(response => {
                console.log('Event created successfully:', response)
                alert('Event created successfully!')
                // Clear all fields and client selection
                setName('')
                setDate('')
                setStartTime('')
                setEndTime('')
                setAssigneeId('')
                setLocation('')
                setClientSearch('')
                setSelectedClientId('')
            })
            .catch(error => {
                console.error('Error creating event:', error)
            })

        console.log({ name, startTime, endTime, assigneeId, location, selectedClientId })
    }

    return (
        <Card className="flex w-96 p-12 pt-12 pb-6 flex-col justify-start items-center fixed right-0 top-0 h-full">
            <h2 className="self-stretch text-left font-semibold text-[28px] leading-[40px] pb-10">
                Add Event
            </h2>
            <form onSubmit={handleSubmit} className="w-full">
                <div className="form-group mb-4">
                    <label htmlFor="name" className="block mb-2">
                        Event Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="form-group mb-4">
                    <label htmlFor="date" className="block mb-2">
                        Date
                    </label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="flex flex-row justify-between">
                    <div className="form-group mb-4 w-5/12">
                        <label htmlFor="startTime" className="block mb-2">
                            Start Time
                        </label>
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
                        <label htmlFor="endTime" className="block mb-2">
                            End Time
                        </label>
                        <input
                            type="time"
                            id="endTime"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                </div>
                <div className="form-group mb-4">
                    <label htmlFor="assigneeId" className="block mb-2">
                        Assignee
                    </label>
                    <input
                        type="text"
                        id="assigneeId"
                        value={assigneeId}
                        onChange={(e) => setAssigneeId(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="form-group mb-4">
                    <label htmlFor="location" className="block mb-2">
                        Location
                    </label>
                    <input
                        type="text"
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                {/* Client Search / Selected Client */}
                <div className="form-group mb-4">
                    <label htmlFor="clientSearch" className="block mb-2">
                        {'Client'}
                    </label>
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
                <button
                    type="submit"
                    className="w-full p-2 bg-foreground text-white rounded"
                >
                    Create Event
                </button>
            </form>
        </Card>
    )
}

export default EventsCreation
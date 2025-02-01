'use client'

import {
    deleteEvent,
    getEventsbyClientId,
    updateEvent,
} from '@/api/make-cases/make-event'
import { ContactType } from '@/types/event-types'
import { useState } from 'react'
import ClientEvents from './ClientEvents'

const EditEvents = ({
    clientId,
    events,
}: {
    clientId: string
    events: any[]
}) => {
    const [eventList, setEventList] = useState(events || []) // actively stores list (updating elements based on any edits)
    const [isEditing, setIsEditing] = useState(false) // basically a boolean tracking whether table is being edited
    const [toDelete, setToDelete] = useState<string | null>(null) // stores either the id of an event to delete, or nothing (null)
    const [showDeleteWarning, setShowDeleteWarning] = useState(false) // boolean tracking whether to show delete confirmation dialog or not

    const refetchEvents = async () => {
        try {
            // Assuming you have an API function to fetch the events
            const updatedEvents = await getEventsbyClientId(clientId)
            setEventList(updatedEvents) // Update the events state with the fetched events
        } catch (error) {
            console.error('Error refetching events:', error)
        }
    }

    // id: matches event being edited, field is the column, value is the actual data
    const handleEditEvent = (id: string, field: string, value: string) => {
        setEventList((prevEvents) =>
            // like a for loop; iterates over each item in eventList
            prevEvents.map((event) =>
                // uses event id to match the correct event in eventList to update, and performs the update
                // ... does a shallow copy of the event, then changes only the relevant field
                event.id === id ? { ...event, [field]: value } : event,
            ),
        )
    }

    // function that saves updated event to server
    const handleSaveEvent = async (event: any) => {
        await updateEvent(event.id, event)
        console.log('Saving event', event)
        await refetchEvents()
        setIsEditing(false) // exits editing mode when save is clicked
    }

    const handleSaveAll = async () => {
        // Save all edited events
        for (let event of eventList) {
            if (event.isEdited) {
                await updateEvent(event.id, event) // Save only if edited
                console.log('Saving event', event)
            }
        }

        // Refetch events after saving
        await refetchEvents()
        setIsEditing(false)
    }

    const toggleEditing = async () => {
        if (isEditing) {
            // When cancel is clicked, reset the event list to the original data
            await refetchEvents()
        }
        setIsEditing((prev) => !prev)
    }

    const openDeleteWarning = (eventId: string) => {
        setToDelete(eventId)
        setShowDeleteWarning(true)
    }

    // function to delete event
    const handleDeleteEvent = async (eventId: string) => {
        try {
            await deleteEvent(eventId)
            console.log(`Event with ID ${eventId} has been deleted`)

            // Refetch the events after deletion
            await refetchEvents()
            setShowDeleteWarning(false)
        } catch (error) {
            console.error('Error deleting event:', error)
        }
    }

    const cancelDeleteEvent = () => {
        setShowDeleteWarning(false) // Close the confirmation dialog
        setToDelete(null) // Reset the event to be deleted
    }

    return (
        <div>
            {/* Display Events Table */}
            <div className="space-y-4 p-10">
                <h2 className="font-bold">Client Events:</h2>

                <table
                    className="w-[100%] border p-2"
                    style={{ padding: '10px' }}
                >
                    <thead>
                        <tr>
                            <th className="border p-2">Date</th>
                            <th className="border p-2">Contact Type</th>
                            <th className="border p-2">Description</th>
                            {isEditing && (
                                <th className="border p-2">Actions</th>
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {/* checks to see if no events found; otherwise renders events in table */}
                        {eventList.length > 0 ? (
                            eventList.map((event) => (
                                <tr key={event.id}>
                                    <td className="border p-2">
                                        {isEditing ? (
                                            <input
                                                type="date"
                                                value={event.date}
                                                // 'e' holds the new value in the input field when onChange is triggered
                                                onChange={(e) => {
                                                    handleEditEvent(
                                                        event.id,
                                                        'date',
                                                        e.target.value,
                                                    )
                                                    event.isEdited = true // Mark this event as edited
                                                }}
                                                className="w-[100%] border p-2"
                                            />
                                        ) : (
                                            event.date // if not in edit mode, just show the static event info
                                        )}
                                    </td>
                                    <td className="border p-2">
                                        {isEditing ? (
                                            <select
                                                value={event.contactType}
                                                onChange={(e) => {
                                                    handleEditEvent(
                                                        event.id,
                                                        'contactType',
                                                        e.target.value,
                                                    )
                                                    event.isEdited = true // Mark this event as edited
                                                }}
                                                className="w-[100%] border p-2"
                                            >
                                                {Object.values(
                                                    ContactType.Values,
                                                ).map((type) => (
                                                    // key = unique key for each item, value = the actual value the user selects
                                                    <option
                                                        key={type}
                                                        value={type}
                                                    >
                                                        {/* type displays the readable text inside the dropdown */}
                                                        {type}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            event.contactType
                                        )}
                                    </td>
                                    <td className="border p-2">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={event.description}
                                                onChange={(e) => {
                                                    handleEditEvent(
                                                        event.id,
                                                        'description',
                                                        e.target.value,
                                                    )
                                                    event.isEdited = true // Mark this event as edited
                                                }}
                                                className="w-[100%] border p-2"
                                            />
                                        ) : (
                                            event.description
                                        )}
                                    </td>
                                    {isEditing && (
                                        <td className="border p-2">
                                            {/* individual save button per row (event) */}
                                            <button
                                                onClick={() =>
                                                    // passes relevant event to handleSave
                                                    handleSaveEvent(event)
                                                }
                                                className="rounded bg-blue-500 p-2 text-white"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() =>
                                                    openDeleteWarning(event.id)
                                                }
                                                className="ml-2 rounded bg-red-500 p-2 text-white"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="border p-2 text-center"
                                >
                                    No events found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="space-x-5">
                    {/* Only show the Edit button if there are events in the table */}
                    {eventList.length > 0 && (
                        <button
                            onClick={toggleEditing}
                            className="mb-4 rounded bg-blue-500 p-2 text-white"
                        >
                            {isEditing ? 'Cancel' : 'Edit'}
                        </button>
                    )}
                    {/* Save All button */}
                    {isEditing && (
                        <button
                            onClick={handleSaveAll}
                            className="mb-4 rounded bg-blue-500 p-2 text-white"
                        >
                            Save All
                        </button>
                    )}
                </div>

                {/* Form to add new events */}
                <ClientEvents clientID={clientId} />
            </div>
            {/* Confirmation Modal */}
            {showDeleteWarning && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="rounded-lg bg-white p-6">
                        <h3 className="text-lg font-bold">Warning</h3>
                        <p>
                            This action is not reversible. Are you sure you want
                            to delete this event?
                        </p>
                        <div className="mt-4 space-x-4">
                            <button
                                onClick={() => handleDeleteEvent(toDelete!)} // Confirm delete
                                className="rounded bg-red-500 p-2 text-white"
                            >
                                Proceed with Deletion
                            </button>
                            <button
                                onClick={cancelDeleteEvent} // Cancel deletion
                                className="rounded bg-gray-500 p-2 text-white"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default EditEvents

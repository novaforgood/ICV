'use client'

import { updateEvent } from '@/api/make-cases/make-event'
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
        setIsEditing(false) // exits editing mode when save is clicked
    }

    const toggleEditing = () => {
        if (isEditing) {
            // When cancel is clicked, reset the event list to the original data
            setEventList(events)
        }
        setIsEditing((prev) => !prev)
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
                                                onChange={(e) =>
                                                    handleEditEvent(
                                                        event.id,
                                                        'date',
                                                        e.target.value,
                                                    )
                                                }
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
                                                onChange={(e) =>
                                                    handleEditEvent(
                                                        event.id,
                                                        'contactType',
                                                        e.target.value,
                                                    )
                                                }
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
                                                onChange={(e) =>
                                                    handleEditEvent(
                                                        event.id,
                                                        'description',
                                                        e.target.value,
                                                    )
                                                }
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

                {/* Button to toggle editing mode */}
                <button
                    onClick={toggleEditing}
                    className="mb-4 rounded bg-blue-500 p-2 text-white"
                >
                    {isEditing ? 'Cancel' : 'Edit'}
                </button>

                {/* Form to add new events */}
                <ClientEvents clientID={clientId} />
            </div>
        </div>
    )
}

export default EditEvents

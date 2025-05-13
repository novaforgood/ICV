'use client'

import React, { useState, useMemo, useEffect } from 'react'
import useSWR, { mutate } from 'swr'
import { CheckInType, ContactType } from '@/types/event-types'
import { deleteCheckIn, updateCheckIn } from '@/api/events'
import { getAllClients } from '@/api/clients'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { format } from 'date-fns'
import { Card } from '@/components/ui/card'

interface EditScheduledCheckInProps {
  onClose: () => void
  onUpdatedEvent: () => void
  selectedEvent: any
}

const EditScheduledCheckIn: React.FC<EditScheduledCheckInProps> = ({
  onClose,
  selectedEvent,
  onUpdatedEvent,
}) => {
  if (!selectedEvent) return null

  const [editMode, setEditMode] = useState(false)
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [location, setLocation] = useState('')
  const [contactType, setContactType] = useState(ContactType.Values['Wellness Check'])
  const [assigneeId, setAssigneeId] = useState('')
  const [clientSearch, setClientSearch] = useState('')
  const [selectedClientDocId, setSelectedClientDocId] = useState('')
  const { data: clients } = useSWR('clients', getAllClients)
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false)
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false)

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.displayName) setAssigneeId(user.displayName)
    })
    return () => unsubscribe()
  }, [])

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
    }
  }, [selectedEvent])

  const selectedClient = useMemo(() => {
    if (!clients || !selectedClientDocId) return null
    return clients.find((client: any) => client.docId === selectedClientDocId)
  }, [clients, selectedClientDocId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    
    const startDateTime = new Date(`${date}T${startTime}`).toLocaleString('en-US')
    const endDateTime = new Date(`${date}T${endTime}`).toLocaleString('en-US')

    const updatedEvent: CheckInType & { clientId?: string } = {
      id: selectedEvent.id,
      startTime: startDateTime,
      endTime: endDateTime,
      assigneeId,
      location,
      clientDocId: selectedClientDocId,
      contactCode: contactType,
      scheduled: true,
      clientId: selectedClient.id,
      clientName: selectedClient.firstName + ' ' + selectedClient.lastName
    }

    updateCheckIn(updatedEvent)
      .then(() => {
        setShowUpdateSuccess(true)
        setEditMode(false)

        setTimeout(() => {
          setShowUpdateSuccess(false)
          onUpdatedEvent()
          onClose()
        }, 1000)
      })
      .catch((err) => {
        console.error(err)
        alert('Error updating event.')
      })

  }

  useEffect(() => {
  console.log('showUpdateSuccess changed to:', showUpdateSuccess)
  }, [showUpdateSuccess])

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
    {!showUpdateSuccess && !showDeleteSuccess && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="relative bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
        <div className="absolute top-4 right-4 flex gap-3 text-gray-600">
          {!editMode && (
            <button onClick={() => setEditMode(true)}>
              <span className="material-symbols-outlined">edit</span>
            </button>
          )}
          <button onClick={handleDelete}>
            <span className="material-symbols-outlined">delete</span>
          </button>
          <button onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
          <div className="py-8">
        {editMode ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="w-full p-2 border rounded"
            />
            <select
              value={contactType}
              onChange={(e) => setContactType(e.target.value)}
              className="w-full p-2 border rounded"
            >
              {Object.values(ContactType.Values).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="w-full bg-foreground text-white py-2 rounded"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <>
            <h2 className="text-2xl font-semibold">{selectedEvent.clientName}</h2>
            <p className="text-gray-500 mb-4">{selectedEvent.clientId}</p>
            <div className="flex items-center gap-2 text-gray-800 mb-2">
              <span className="material-symbols-outlined">calendar_today</span>
              <p>
                {new Date(selectedEvent.start).toLocaleString()} – {new Date(selectedEvent.end).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
              </p>
            </div>
            <span className="inline-block bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
              {selectedEvent.contactCode}
            </span>
            <div className="flex items-center gap-2 text-gray-800 mb-2">
              <span className="material-symbols-outlined">person</span>
              <p>{selectedEvent.assigneeId}</p>
            </div>
            {selectedEvent.location && (
              <div className="flex items-center gap-2 text-gray-800 mb-2">
                <span className="material-symbols-outlined">location_on</span>
                <p>{selectedEvent.location}</p>
              </div>
            )}
            <div className="flex items-center gap-2 text-blue-700 mt-4 underline cursor-pointer">
              <span className="material-symbols-outlined">description</span>
              <p>View case notes</p>
            </div>
          </>
        )}
      </div>
      </div>
    </div>
    )}
    {showUpdateSuccess && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <Card className="px-4 py-2 rounded text-center w-fit">
                  Check in updated successfully!
                </Card>
              </div>
    ) }
    {showDeleteSuccess && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <Card className="px-4 py-2 rounded text-center w-fit">
                  Check in deleted.
                </Card>
              </div>
    ) }
    </>
  )
}

export default EditScheduledCheckIn

'use client'

import React, { useState, useMemo, useEffect } from 'react'
import useSWR, { mutate } from 'swr'
import { CheckInType, ContactType } from '@/types/event-types'
import { NewClient } from '@/types/client-types'
import { deleteCheckIn, updateCheckIn } from '@/api/events'
import { getAllClients, getClientById } from '@/api/clients'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { format } from 'date-fns'
import { Card } from '@/components/ui/card'
import ClientCard from './ClientCard'
import { ContactTypeBadge } from '@/app/_components/ContactTypeBadge'
import { getUserNames } from '@/api/users'

interface EditScheduledCheckInProps {
  onClose: () => void
  onUpdatedEvent: () => void
  selectedEvent: any
}

type ClientWithLastCheckin = NewClient & { lastCheckinDate?: string }

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
  const [contactType, setContactType] = useState<string>(ContactType.Values['Wellness Check'])
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
      
      // Fetch client data asynchronously
      const fetchClient = async () => {
        if (!selectedEvent.clientDocId) {
          setClient(null)
          return
        }
        try {
          const clientData = await getClientById(selectedEvent.clientDocId)
          if (clientData) {
            setClient(clientData)
            console.log("client updated:", clientData)
          } else {
            setClient(null)
            console.error("No client data found")
          }
        } catch (error) {
          console.error("Error fetching client:", error)
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
        const names = await getUserNames()
        setStaffNames(names)
      } catch (error) {
        console.error('Error fetching staff names:', error)
      }
    }
    fetchStaffNames()
  }, [])

  const selectedClient = useMemo(() => {
    if (!clients || !selectedClientDocId) return null
    return clients.find((client) => client.docId === selectedClientDocId)
  }, [clients, selectedClientDocId])

  const filteredStaff = staffNames.filter(name =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
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
      clientName: `${selectedClient.firstName || ''} ${selectedClient.lastName || ''}`.trim()
    }

    updateCheckIn(updatedEvent)
      .then(() => {
        setShowUpdateSuccess(true)
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
    {!showUpdateSuccess && !showDeleteSuccess && !editMode && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
        <div className="relative bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
          <div className="absolute top-4 right-4 flex gap-3 text-gray-600">
            <button onClick={() => setEditMode(true)}>
              <span className="material-symbols-outlined">edit</span>
            </button>
            <button onClick={handleDelete}>
              <span className="material-symbols-outlined">delete</span>
            </button>
            <button onClick={onClose}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <h2 className="text-2xl font-semibold">{selectedEvent.clientName}</h2>
          <p className="text-gray-500 mb-4">{selectedEvent.clientId}</p>

          <div className="flex items-center gap-2 text-gray-800 mb-2">
            <span className="material-symbols-outlined">calendar_today</span>
            <p>
              {new Date(selectedEvent.start).toLocaleString()} –{' '}
              {new Date(selectedEvent.end).toLocaleTimeString([], {
                hour: 'numeric',
                minute: '2-digit',
              })}
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
            <ClientCard client={client} /> 
            <p className="text-gray-500 text-sm">{selectedEvent.clientId}</p>
          </div>

          {/* Date */}
          <div>
            <label className="block mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded px-4 py-2 block mb-1 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Start & End Time */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="startTime" className="block mb-1">Start time</label>
              <input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="flex-1">
              <label htmlFor="endTime" className="block mb-1">End time</label>
              <input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          {/* Staff display */}
          <div className="relative">
            <label className="block mb-1">Staff</label>
            <div className="w-full border rounded px-4 py-2 border-gray-300 bg-gray-50">
                {assigneeId}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border rounded px-4 py-2 block mb-1 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Contact Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact code</label>
            <div className="grid grid-cols-2 gap-3">
              {Object.values(ContactType.Values).map((type) => (
                <div key={type} className="flex items-center gap-2">
                  <input
                    type="radio"
                    id={type.toLowerCase().replace(/\s+/g, '-')}
                    name="contact-code"
                    checked={contactType === type}
                    onChange={() => setContactType(type)}
                    className="w-4 h-4"
                  />
                  <label htmlFor={type.toLowerCase().replace(/\s+/g, '-')}>
                    <ContactTypeBadge type={type} />
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-[#4EA0C9] text-white py-2 rounded shadow hover:bg-[#3b8db2] transition"
            >
              Save changes
            </button>
            <button
              type="button"
              className="flex-1 bg-black text-white py-2 rounded shadow hover:bg-gray-800 transition"
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
                <Card className="px-4 py-2 rounded text-center w-fit">
                  Check in updated successfully!
                </Card>
              </div>
    ) }
    {/* delete event success message */}
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

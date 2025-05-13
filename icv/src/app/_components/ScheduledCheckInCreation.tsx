'use client'

import React, { useState, useMemo, useEffect } from 'react'
import useSWR, { mutate } from 'swr'
import { CheckInType, CheckInCategory, ContactType } from '@/types/event-types'
import { createCheckIn } from '@/api/events'
import { getAllClients } from '@/api/clients'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { format } from 'date-fns'
import { Card } from '@/components/ui/card'

interface ScheduledCheckInCreationProps {
  onNewEvent: () => void
}

const ScheduledCheckInCreation: React.FC<ScheduledCheckInCreationProps> = ({onNewEvent}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [location, setLocation] = useState('')
  const [contactType, setContactType] = useState(ContactType.Values['Wellness Check'])
  const [assigneeId, setAssigneeId] = useState('')
  const [clientSearch, setClientSearch] = useState('')
  const [selectedClientDocId, setSelectedClientId] = useState('')

  const { data: clients } = useSWR('clients', getAllClients)

  const filteredClients = useMemo(() => {
    if (!clients) return []
    return clients.filter((client: any) => {
      const fullName = `${client.firstName || ''} ${client.lastName || ''}`.toLowerCase()
      return fullName.includes(clientSearch.toLowerCase())
    })
  }, [clients, clientSearch])

  const selectedClient = useMemo(() => {
    if (!clients || !selectedClientDocId) return null
    return clients.find((client: any) => client.docId === selectedClientDocId)
  }, [clients, selectedClientDocId])

  const name = useMemo(() => {
    if (selectedClient) {
      return (`Check-in with ${(selectedClient.firstName || selectedClient.lastName)?(selectedClient.firstName + ' ' + selectedClient.lastName) : 'Client ' + selectedClient.docId}`)
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

    const startDateTime = new Date(`${date}T${startTime}`).toLocaleString('en-US')
    const endDateTime = new Date(`${date}T${endTime}`).toLocaleString('en-US')

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
      clientName: selectedClient.firstName + ' ' + selectedClient.lastName
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
      <button
        className="p-2 bg-foreground text-white rounded"
        onClick={() => setIsOpen(true)}
      >
        Schedule New Event
      </button>

      {isOpen && showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                  <Card className="px-4 py-2 rounded text-center w-fit">
                    Check in created successfully!
                  </Card>
                </div>
      ) }

      {isOpen && !showSuccess && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center"
            onClick={closeModal}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="relative bg-white w-full max-w-lg mx-4 p-6 rounded-lg shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-xl font-bold text-gray-600 hover:text-black"
              >
                ×
              </button>

              <h2 className="text-xl font-semibold mb-6">{name}</h2>

              <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto max-h-[75vh]">

                <div>
                  <label className="block mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block mb-1">Start Time</label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1">End Time</label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1">Client</label>
                  {selectedClientDocId && selectedClient ? (
                    <div className="flex justify-between items-center p-2 bg-gray-200 rounded">
                      <span>
                        {selectedClient.firstName} {selectedClient.lastName}
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
                        onChange={(e) => setClientSearch(e.target.value)}
                        className="w-full p-2 border rounded"
                      />
                      {clientSearch && (
                        <ul className="border max-h-40 overflow-y-auto mt-2">
                          {filteredClients.map((client) => (
                            <li
                              key={client.docId}
                              className="p-2 cursor-pointer hover:bg-gray-100"
                              onClick={() => {
                                setSelectedClientId(client.docId)
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

                {/* Dropdown for Contact Type */}
                <div className="form-group mb-4">
                    <label htmlFor="contactType" className="block mb-2">Select Contact Code</label>
                    <select
                        id="category"
                        value={contactType}
                        onChange={(e) => setContactType(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="">Select a contact type</option>
                        {Object.values(ContactType.Values).map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-foreground text-white py-2 rounded"
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

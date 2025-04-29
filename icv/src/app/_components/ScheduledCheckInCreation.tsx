'use client'

import React, { useState, useMemo, useEffect } from 'react'
import useSWR, { mutate } from 'swr'
import { CheckInType, CheckInCategory } from '@/types/event-types'
import { createCheckIn } from '@/api/events'
import { getAllClients } from '@/api/clients'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { format } from 'date-fns'
import { Card } from '@/components/ui/card'

const ScheduledCheckInCreation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [location, setLocation] = useState('')
  const [name, setName] = useState('')
  const [category, setCategory] = useState(CheckInCategory.Values.Other)
  const [assigneeId, setAssigneeId] = useState('')
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

  const closeSidebar = () => {
    setIsOpen(false)
    resetFormDefaults()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const startDateTime = new Date(`${date}T${startTime}`).toLocaleString('en-US')
    const endDateTime = new Date(`${date}T${endTime}`).toLocaleString('en-US')

    const newEvent: CheckInType & { clientId?: string } = {
      name,
      startTime: startDateTime,
      endTime: endDateTime,
      assigneeId,
      location,
      clientId: selectedClientId,
      category,
      scheduled: true,
    }

    createCheckIn(newEvent)
      .then(() => {
        alert('Event created successfully!')
        mutate('calendar-events')
        closeSidebar()
        setName('')
        setLocation('')
        setClientSearch('')
        setSelectedClientId('')
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

      {isOpen && (
        <>
          {/* Sidebar overlay */}
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={closeSidebar}
          />
          <div className="fixed top-0 right-0 z-50 h-full w-[480px] bg-white shadow-lg overflow-y-auto p-6">
            <button
              onClick={closeSidebar}
              className="absolute top-4 right-4 text-xl font-bold text-gray-600 hover:text-black"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-6">Schedule Check-In</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">Check-in Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
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
                {selectedClientId && selectedClient ? (
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
                            key={client.id}
                            className="p-2 cursor-pointer hover:bg-gray-100"
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
                className="w-full bg-foreground text-white py-2 rounded"
              >
                Schedule
              </button>
            </form>
          </div>
        </>
      )}
    </>
  )
}

export default ScheduledCheckInCreation

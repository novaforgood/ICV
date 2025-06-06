'use client'

import React, { useState, useMemo, useEffect, useRef } from 'react'
import useSWR, { mutate } from 'swr'
import { CheckInType, CheckInCategory, ContactType } from '@/types/event-types'
import { createCheckIn } from '@/api/events'
import { getAllClients } from '@/api/clients'
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'
import { format } from 'date-fns'
import { Card } from '@/components/ui/card'
import ClientSearch from './ClientSearch'
import { ContactTypeBadge } from '@/app/_components/ContactTypeBadge'

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
  const [contactType, setContactType] = useState<string>(ContactType.Values['Wellness Check'])
  const [assigneeId, setAssigneeId] = useState('')
  const [selectedClientDocId, setSelectedClientId] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { data: clients } = useSWR('clients', getAllClients)

  const selectedClient = useMemo(() => {
    if (!clients || !selectedClientDocId) return null
    return clients.find((client: any) => client.docId === selectedClientDocId)
  }, [clients, selectedClientDocId])

  const name = useMemo(() => {
    if (selectedClient) {
      return (`Check-in with ${(selectedClient.firstName || selectedClient.lastName)?(selectedClient.firstName + ' ' + selectedClient.lastName) : 'Client ' + selectedClient.docId}`)
    }
    return 'Create Check-In'
  }, [selectedClient])    

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
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

      // Add timeout to the createCheckIn call
      const timeoutDuration = 10000; // 10 seconds
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timed out')), timeoutDuration);
      });

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
      )}

      {isOpen && !showSuccess && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center"
            onClick={closeModal}
          />

          {/* Modal */}
          <div className="fixed inset-y-0 right-0 z-50 w-[600px] bg-white shadow-xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">{name}</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
                  {selectedClientDocId && selectedClient ? (
                    <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                      <span className="font-medium">
                        {selectedClient.firstName} {selectedClient.lastName}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedClientId('')}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </div>
                  ) : (
                    <ClientSearch onSelect={setSelectedClientId} />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start time</label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End time</label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter location"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

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

                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full text-white p-3 rounded-lg font-medium transition-colors
                  ${submitting ? 'bg-gray-300 cursor-not-allowed' : 'bg-black hover:bg-gray-800'}`}
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

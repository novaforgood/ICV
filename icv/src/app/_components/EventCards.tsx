'use client'

import { getAllEvents } from "@/api/events"
import { CaseEventType } from "@/types/event-types"
import React, { useState, useMemo } from "react"
import useSWR from "swr"
import useClientNames from "../hooks/useClientNames"
import { format, isValid } from "date-fns"
import Card from "../components/ui/Card"
import CardContent from "../components/ui/CardContent"
import Button from "../components/ui/Button"

// Fetcher function for events
const fetchEvents = async (): Promise<CaseEventType[]> => {
  const events = await getAllEvents()
  return events
}

const EventCards: React.FC = () => {
  const { data: events, error, isLoading } = useSWR("events", fetchEvents)
  const { clientNames, error: clientNamesError } = useClientNames(events)

  // State to track selected day (YYYY-MM-DD string)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // Generate date options (week view)
  const today = new Date()
  const weekDays = Array.from({ length: 7 }, (_, i) =>
    new Date(today.setDate(today.getDate() - today.getDay() + i))
  )

  // Filter events by selected date and ensure event.date is valid
  const filteredEvents = useMemo(() => {
    if (!selectedDate || !events) return events || []
    return events.filter((event) => {
      const eventDate = new Date(event.date)
      if (!isValid(eventDate)) return false
      return format(eventDate, "yyyy-MM-dd") === selectedDate
    })
  }, [selectedDate, events])

  // Handle loading and error states
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading data: {error.message}</div>
  if (clientNamesError)
    return <div>Error loading client names: {clientNamesError.message}</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-primary">Schedule</h1>

      {/* Date Selector */}
      <div className="flex space-x-2 mb-4">
        {weekDays.map((day) => {
          const formattedDate = format(day, "yyyy-MM-dd")
          return (
            <Button
              key={formattedDate}
              variant={selectedDate === formattedDate ? "default" : "outline"}
              onClick={() => setSelectedDate(formattedDate)}
            >
              {format(day, "E d")}
            </Button>
          )
        })}
      </div>

      {/* Event Cards */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <p>No events for this day.</p>
        ) : (
          filteredEvents.map((event) => {
            const eventDate = new Date(event.date)
            if (!isValid(eventDate)) return null

            const startTime = eventDate
            const endTime = new Date(
              startTime.getTime() + (event.duration || 0) * 60 * 60 * 1000
            )
            const eventName = String(event.name) || "Loading..."

            return (
              <Card key={String(event.id)} className="shadow-md">
                <CardContent className="p-4">
                  <div className="text-sm text-gray-500">
                    {format(startTime, "p")} - {format(endTime, "p")}
                  </div>
                  <h2 className="font-bold text-lg">
                    {eventName}
                  </h2>
                  <p className="text-gray-600">{event.location}</p>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

export default EventCards

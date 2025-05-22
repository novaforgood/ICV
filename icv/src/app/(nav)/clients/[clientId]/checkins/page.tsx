'use client'
import ClientCalendarSearch from '@/app/_components/ClientCalendarSearch'
import EventCard from '@/app/_components/EventsCard'
import ScheduledCheckInCreation from '@/app/_components/ScheduledCheckInCreation'
import { clientDb } from '@/data/firebase'
import { useUser } from '@/hooks/useUser'
import { CheckInType } from '@/types/event-types'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface CheckIn extends CheckInType {
    id: string
}
type CheckInsState = {
    past: CheckIn[]
    upcoming: CheckIn[]
}

export default function CheckInsPage() {
    const { clientId } = useParams()
    const [checkIns, setCheckIns] = useState<CheckInsState>({
        past: [],
        upcoming: [],
    })
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [newEvents, setNewEvents] = useState(false)

    const handleSearchChange = (searchText: string) => {
        console.log('search text: ', searchText)
        setSearch(searchText)
    }

    const sortBySearchRelevance = (a: CheckIn, b: CheckIn) => {
        // Convert search and check-in data to lowercase for case-insensitive comparison
        const searchLower = search.toLowerCase()
        const aTitle = a.contactCode?.toLowerCase() || ''
        const bTitle = b.contactCode?.toLowerCase() || ''
        const aDescription = a.description?.toLowerCase() || ''
        const bDescription = b.description?.toLowerCase() || ''

        // Check if search term appears in title (highest priority)
        const aTitleMatch = aTitle.includes(searchLower)
        const bTitleMatch = bTitle.includes(searchLower)
        if (aTitleMatch !== bTitleMatch) return bTitleMatch ? 1 : -1

        // Then check description matches
        const aDescMatch = aDescription.includes(searchLower)
        const bDescMatch = bDescription.includes(searchLower)
        if (aDescMatch !== bDescMatch) return bDescMatch ? 1 : -1

        // If no search term, maintain original date-based sorting
        return new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    }

    useEffect(() => {
        const fetchCheckIns = async () => {
            try {
                const q = query(
                    collection(clientDb, 'events'),
                    where('clientId', '==', clientId),
                )
                const querySnapshot = await getDocs(q)
                const checkInsData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as CheckIn[] //type assertion that tells ts that the data matches our CheckIn interface which includes starttime, allows us to filter into past and upcoming

                const now = new Date()
                now.setHours(0, 0, 0, 0)

                //filter checkins into past and upcoming
                const pastCheckIns = checkInsData.filter((checkIn) => {
                    const checkInDate = new Date(checkIn.startTime)
                    return checkInDate < now
                })
                const upcomingCheckIns = checkInsData.filter((checkIn) => {
                    const checkInDate = new Date(checkIn.startTime)
                    return checkInDate >= now
                })

                //sort past in descending order. most recent up top
                pastCheckIns.sort(
                    (a, b) =>
                        new Date(b.startTime).getTime() -
                        new Date(a.startTime).getTime(),
                )

                //sort upcoming in ascending, soonest first
                upcomingCheckIns.sort(
                    (a, b) =>
                        new Date(a.startTime).getTime() -
                        new Date(b.startTime).getTime(),
                )

                setCheckIns({
                    past: pastCheckIns,
                    upcoming: upcomingCheckIns,
                })
            } catch (error) {
                console.error('Error fetching check-ins:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchCheckIns()
    }, [clientId])

    const { user } = useUser()

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <h1 className="text-2xl font-medium">Loading...</h1>
            </div>
        )
    }

    return (
        <div className="p-7">
            <ClientCalendarSearch onSearchChange={handleSearchChange} />
            <div className="flex w-full flex-row gap-6">
                <h1 className="text-2xl font-medium">Upcoming check ins</h1>
                <div className="ml-auto">
                    <ScheduledCheckInCreation
                        onNewEvent={() => setNewEvents(true)}
                    />
                </div>
            </div>

            <div className="grid gap-4">
                {[...checkIns.upcoming]
                    .sort(sortBySearchRelevance)
                    .map((checkIn: CheckIn) => (
                        <EventCard key={String(checkIn.id)} event={checkIn} />
                    ))}
            </div>

            <h1 className="mb-4 mt-8 text-2xl font-medium">Past check ins</h1>
            <div className="grid gap-4">
                {[...checkIns.past]
                    .sort(sortBySearchRelevance)
                    .map((checkIn: CheckIn) => (
                        <EventCard key={String(checkIn.id)} event={checkIn} />
                    ))}
            </div>
        </div>
    )
}

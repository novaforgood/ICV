'use client'

import { getClientById } from '@/api/clients'
import EventCard from '@/app/_components/EventsCard'
import ScheduledCheckInCreation from '@/app/_components/ScheduledCheckInCreation'
import Symbol from '@/components/Symbol'
import { clientDb } from '@/data/firebase'
import { useUser } from '@/hooks/useUser'
import { CheckInType } from '@/types/event-types'
import { collection, getDocs, or, query, where } from 'firebase/firestore'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Dropdown from 'react-dropdown'

interface CheckIn extends CheckInType {
    id: string
}
type CheckInsState = {
    past: CheckIn[]
    upcoming: CheckIn[]
}

// Add sorting type
type SortOrder = 'newest' | 'oldest'

export default function CheckInsPage() {
    const { clientId } = useParams()
    const [client, setClient] = useState<any>(null)
    const [checkIns, setCheckIns] = useState<CheckInsState>({
        past: [],
        upcoming: [],
    })
    const [loading, setLoading] = useState(true)
    const [newEvents, setNewEvents] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const eventsPp = 8
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null,
    )

    // Add sorting state
    const [sortOrder, setSortOrder] = useState<SortOrder>('newest')

    // Define color mapping for categories
    const getCategoryColor = (category: string) => {
        const colors: { [key: string]: string } = {
            None: 'bg-white',
            'Referral and Intake': 'bg-teal-200',
            Phone: 'bg-red-200',
            'Wellness Check': 'bg-amber-300',
            'Face to Face': 'bg-blue-200',
            'Team Meeting': 'bg-green-200',
            'Individual Meeting': 'bg-purple-200',
            'Family Meeting': 'bg-pink-200',
            'Referral to Service Provider': 'bg-indigo-200',
            'Employment Job Readiness': 'bg-orange-200',
            Transportation: 'bg-cyan-200',
            'Tracking Check Up': 'bg-blue-200',
            Advocacy: 'bg-green-200',
            Other: 'bg-purple-200',
        }
        return colors[category] || colors['Other']
    }

    //pagination!
    const indexofLastEvent = currentPage * eventsPp
    const indexofFirstEvent = indexofLastEvent - eventsPp

    const currEvents = [...checkIns.past].slice(
        indexofFirstEvent,
        indexofLastEvent,
    )

    // Sort past events
    const sortedPastEvents = currEvents.sort((a, b) => {
        const dateA = new Date(a.startTime).getTime()
        const dateB = new Date(b.startTime).getTime()
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
    })

    // Sort upcoming events
    const sortedUpcomingEvents = [...checkIns.upcoming].sort((a, b) => {
        const dateA = new Date(a.startTime).getTime()
        const dateB = new Date(b.startTime).getTime()
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
    })

    //filtering options
    // const codes = currEvents.map(evt => evt.contactCode); ISSUE: TAKES CATEGORIES FROM ALL PAST< NO TTHE PAST IN THE PAGE
    const filterOptions = Array.from(
        new Set([
            'None',
            ...checkIns.upcoming.map((ci) => String(ci.contactCode)),
            ...checkIns.past.map((ci) => String(ci.contactCode)),
        ]),
    )
    // Filter upcoming events by category if a category is selected
    const filteredUpcomingEvents = selectedCategory
        ? [...checkIns.upcoming].filter(
              (event) => event.contactCode === selectedCategory,
          )
        : sortedUpcomingEvents

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setSortOrder('newest')
            setCurrentPage(currentPage + 1)
        }
    }

    // Filter events by category if a category is selected
    const filteredPastEvents = selectedCategory
        ? sortedPastEvents.filter(
              (event) => event.contactCode === selectedCategory,
          )
        : sortedPastEvents
    const totalPages = Math.ceil(filteredPastEvents.length / eventsPp)

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setSortOrder('newest')
            setCurrentPage(currentPage - 1)
        }
    }

    const handleCategoryChange = (option: { value: string }) => {
        if (selectedCategory == option.value || option.value == 'None') {
            setSelectedCategory('')
        } else {
            setSelectedCategory(option.value)
        }
        setCurrentPage(1) // Reset to first page when filter changes
    }

    //fetch client
    useEffect(() => {
        const fetchClient = async () => {
            const clientData = await getClientById(clientId as string)

            setClient(clientData)
        }
        fetchClient()
    }, [clientId])

    useEffect(() => {
        const fetchCheckIns = async () => {
            try {
                const q = query(
                    collection(clientDb, 'events'),
                    or(
                        where('clientDocId', '==', clientId),
                        where('clientId', '==', clientId),
                    ),
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
                console.log(
                    'upcoming check ins count:',
                    upcomingCheckIns.length,
                )
                console.log('past check ins count:', pastCheckIns.length)

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
            <div className="sticky top-48 z-10 flex h-20 items-center justify-between bg-white pb-4">
                {/* Title */}
                <h1 className="text-4xl font-bold">Case Notes</h1>

                <div className="flex items-center gap-4">
                    <ScheduledCheckInCreation
                        onNewEvent={() => setNewEvents(true)}
                        variant="checkins-page"
                        clientName={`${client?.firstName} ${client?.lastName}`}
                    />

                    {/* Filter controls */}
                    <div className="flex items-center gap-2">
                        <Dropdown
                            className="w-full border-black"
                            placeholderClassName="hidden"
                            options={filterOptions.map((option) => ({
                                value: option,
                                label: (
                                    <div
                                        className={`${getCategoryColor(option)} flex h-[30px] w-full items-center justify-center rounded-md border border-gray-200 p-4`}
                                    >
                                        <span className="truncate text-sm font-medium">
                                            {option}
                                        </span>
                                    </div>
                                ),
                            }))}
                            onChange={handleCategoryChange}
                            controlClassName={`flex items-center justify-between border border-black-300 rounded-md px-4 py-2 ${selectedCategory ? 'bg-sky' : 'bg-white'} w-full hover:border-neutral-400`}
                            menuClassName="dropdown-menu absolute w-400 mt-5 py-2 px-2 border border-black-500 rounded-md bg-white shadow-lg z-50 max-h-60 overflow-auto hover:border-neutral-400 [&>div]:!bg-transparent [&>div]:!p-1"
                            arrowClosed={
                                <div className="flex w-full items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Symbol
                                            symbol="filter_list"
                                            className="h-5 w-5"
                                        />
                                        <span>Filter</span>
                                    </div>
                                    {selectedCategory && (
                                        <span className="ml-2">
                                            {selectedCategory}
                                        </span>
                                    )}
                                </div>
                            }
                            arrowOpen={
                                <div className="flex w-full items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Symbol
                                            symbol="filter_list"
                                            className="h-5 w-5"
                                        />
                                        <span>Filter</span>
                                    </div>
                                    {selectedCategory && (
                                        <span className="ml-2">
                                            {selectedCategory}
                                        </span>
                                    )}
                                </div>
                            }
                        />
                    </div>

                    {/* Sort controls */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setSortOrder('newest')}
                            className={`rounded-md px-3 py-1 ${
                                sortOrder === 'newest'
                                    ? 'bg-blue text-white'
                                    : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                        >
                            Newest
                        </button>
                        <button
                            onClick={() => setSortOrder('oldest')}
                            className={`rounded-md px-3 py-1 ${
                                sortOrder === 'oldest'
                                    ? 'bg-blue text-white'
                                    : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                        >
                            Oldest
                        </button>
                    </div>

                    {/* Pagination controls */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className={`flex h-8 w-8 items-center justify-center rounded-md ${
                                currentPage === 1
                                    ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                                    : 'bg-blue text-white hover:bg-navy'
                            }`}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <span className="text-sm">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className={`flex h-8 w-8 items-center justify-center rounded-md ${
                                currentPage === totalPages
                                    ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                                    : 'bg-blue text-white hover:bg-navy'
                            }`}
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex w-full flex-row gap-6">
                {currentPage === 1 && (
                    <div className="flex w-full items-center justify-between pb-4">
                        <h1 className="text-xl font-medium">
                            Upcoming check ins
                        </h1>
                    </div>
                )}
            </div>

            <div className="grid gap-4">
                {currentPage === 1 &&
                    // Show upcoming check-ins on first page
                    (filteredUpcomingEvents.length === 0 ? (
                        <div className="py-4 text-center text-gray-500">
                            No upcoming check-ins scheduled. Yay!
                        </div>
                    ) : (
                        filteredUpcomingEvents.map((checkIn: CheckIn) => (
                            <EventCard
                                key={String(checkIn.id)}
                                event={checkIn}
                                variant="checkins-page"
                            />
                        ))
                    ))}
            </div>

            <div className="mb-4 mt-8 flex w-full items-center justify-between">
                <h1 className="text-xl font-medium">Past check ins</h1>
                <div className="flex items-center gap-2"></div>
            </div>
            <div className="grid gap-4">
                {filteredPastEvents.map((checkIn: CheckIn) => (
                    <EventCard
                        key={String(checkIn.id)}
                        event={checkIn}
                        variant="checkins-page"
                    />
                ))}
            </div>
        </div>
    )
}

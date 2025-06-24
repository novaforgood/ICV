'use client'

import { getClientById } from '@/api/clients'
import EventCard from '@/app/_components/EventsCard'
import ScheduledCheckInCreation from '@/app/_components/ScheduledCheckInCreation'
import Symbol from '@/components/Symbol'
import { clientDb } from '@/data/firebase'
import { useUser } from '@/hooks/useUser'
import { CheckInType } from '@/types/event-types'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import { collection, getDocs, or, query, where } from 'firebase/firestore'
import { ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

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
    // tracking state of dropdown box
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // useEffect(() => {
    //     function handleClickOutside(event: MouseEvent) {
    //       if (
    //         dropdownRef.current &&
    //         !dropdownRef.current.contains(event.target as Node)
    //       ) {
    //         setIsOpen(false);
    //       }
    //     }
    //   //need to use click instead of mousedown bc click only fires after mrowser has done mousedown mouseup seq
    //     document.addEventListener('click', handleClickOutside);
    //     return () => {
    //       document.removeEventListener('click', handleClickOutside);
    //     };
    //   }, []);

    // sorting state
    const [sortOrder, setSortOrder] = useState<SortOrder>('newest')

    // color mapping for categories
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

                // Reset newEvents to false after fetching to allow future refreshes
                setNewEvents(false)
            } catch (error) {
                console.error('Error fetching check-ins:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchCheckIns()
    }, [clientId, newEvents]) // Add newEvents as a dependency to trigger refresh whenever new event added

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
            <div className="sticky top-[168px] z-10 flex h-20 w-full items-center justify-between bg-white pb-4">
                {/* Title */}
                <h1 className="text-4xl font-bold">Case Notes</h1>

                <div className="z-40 flex items-center gap-4">
                    <ScheduledCheckInCreation
                        onNewEvent={() => setNewEvents(true)}
                        clientName={`${client?.firstName} ${client?.lastName}`}
                    />

                    {/* Filter controls */}
                    <div className="flex items-center gap-2">
                        <Select
                            value={selectedCategory || 'all'}
                            onValueChange={(value) => {
                                setSelectedCategory(value === 'all' ? null : value)
                                setCurrentPage(1)
                            }}
                        >
                            <SelectTrigger className="w-[180px] h-10 px-4 py-2 text-sm">
                                <SelectValue placeholder="Filter by category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {filterOptions.map((option) => (
                                    <SelectItem key={option} value={option}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Sort controls */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')
                            }
                            className="flex items-center gap-2 h-10 px-4 py-2 text-sm"
                        >
                            <ArrowUpDown className="h-4 w-4" />
                            {sortOrder === 'newest' ? 'Oldest' : 'Newest'}
                        </Button>
                    </div>

                    {/* Pagination controls */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className="text-[16px] disabled:cursor-not-allowed disabled:text-gray-300"
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
                {filteredPastEvents.length === 0 ? (
                    <div className="py-4 text-center text-gray-500">
                        No past check-ins. Yay!
                    </div>
                ) : (
                    filteredPastEvents.map((checkIn: CheckIn) => (
                        <EventCard
                            key={String(checkIn.id)}
                            event={checkIn}
                            variant="checkins-page"
                        />
                    ))
                )}
            </div>
        </div>
    )
}

'use client'
import ClientCalendarSearch from '@/app/_components/ClientCalendarSearch'
import EventCard from '@/app/_components/EventsCard'
import { Card } from '@/components/ui/card'
import { clientDb } from '@/data/firebase'
import { useUser } from '@/hooks/useUser'
import { CheckInType } from '@/types/event-types'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface CheckIn extends CheckInType{
    id: string
}

export default function CheckInsPage() {
    const { clientId } = useParams()
    const [checkIns, setCheckIns] = useState<CheckIn[]>([])
    const [loading, setLoading] = useState(true)

    const handleSearchChange = (searchText: string) => {
        console.log('search text: ', searchText)
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
                }))
                setCheckIns(checkInsData)
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
        <div className="p-4">
            <ClientCalendarSearch onSearchChange={handleSearchChange} />
            <h1 className="mb-4 text-2xl font-medium">Upcoming check ins</h1>
            <div className="grid gap-4">
                
                {checkIns.map((checkIn) => (
                  <EventCard 
                    key={String(checkIn.id)}
                    event={checkIn}
                    />
                ))}
            </div>

            <h1 className="mb-4 mt-8 text-2xl font-medium">Past check ins</h1>
        </div>
    )
}

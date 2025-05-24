'use client'

import { Card } from '@/components/ui/card'
import { useUser } from '@/hooks/useUser'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import CheckInCounter from '../_components/CheckInCounter'
import EventsSchedule from '../_components/EventsSchedule'
import SpontaneousCheckInModal from '../_components/SpontaneousCheckinCreation'

export const dynamic = 'force-dynamic'

export default function Home() {
    const router = useRouter()
    const { user } = useUser()

    return (
        <div className="flex h-screen flex-row gap-6 p-6 pt-12">
            <div className="flex flex-1 flex-col gap-8">
                <h1 className="text-6xl font-bold">
                    Hello, {user?.displayName}
                </h1>
                <EventsSchedule />
            </div>
            <div className="flex w-1/3 flex-col gap-6 p-4">
                <CheckInCounter />

                <h1 className="text-2xl font-semibold">Recent Clients</h1>
                <Link href="/clients/1n8OcnTxVGsnhTloPySW/checkins">
                    <Card>
                        <h1 className="text-xl font-bold">Jimin Kim</h1>
                        <p>PK2025</p>
                    </Card>
                </Link>
                <SpontaneousCheckInModal />
            </div>
        </div>
    )
}

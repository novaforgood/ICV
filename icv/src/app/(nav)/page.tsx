'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import EventsSchedule from '../_components/EventsSchedule'
import Link from 'next/link'
import CheckInCounter from '../_components/CheckInCounter'
import SpontaneousCheckInModal from '../_components/SpontaneousCheckinCreation'
import { useUser } from '@/hooks/useUser'
import { TimeFrameProvider } from '../_context/TimeFrameContext'

export const dynamic = 'force-dynamic'

export default function Home() {
  const router = useRouter()
  const { user } = useUser()

  return (
    <div className="flex h-screen flex-col  justify-between md:flex-row gap-6 p-6 pt-12">
      {/* desktop view */}
      <div className="hidden flex-2/3 w-full flex-col gap-8 md:flex">
        <h1 className="text-6xl font-bold">Hello, {user?.displayName}</h1>
        <EventsSchedule />
      </div>

      {/* tablet */}
      <div className="flex gap-8 md:hidden">
        <h1 className="text-6xl font-bold">Hello, {user?.displayName}</h1>
      </div>
      <TimeFrameProvider>
        <div className="md:hidden w-full">
          <CheckInCounter />
        </div>
        <div className="flex w-full md:hidden">
          <SpontaneousCheckInModal />
        </div>

        <div className="flex flex-1 flex-col gap-8 md:hidden">
          <EventsSchedule />
        </div>

        {/* Sidebar layout for md and up */}
        <div className="hidden md:flex w-1/3 flex-col gap-6 p-4">
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
      </TimeFrameProvider>
    </div>
  )
}
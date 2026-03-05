'use client'

import { useRouter } from 'next/navigation'
import EventsSchedule from '../_components/calendar/EventsSchedule'
import CheckInCounter from '../_components/dashboard/CheckInCounter'
import SpontaneousCheckInModal from '../_components/dashboard/SpontaneousCheckinCreation'
import { useUser } from '@/hooks/useUser'
import { TimeFrameProvider } from '../_context/TimeFrameContext'
import { CheckInCountProvider } from '../_context/CheckInCountContext'
import RecentClients from '../_components/dashboard/RecentClients'
export const dynamic = 'force-dynamic'

export default function Home() {
  const router = useRouter()
  const { user } = useUser()

  return (
    <div className="m-[48px] flex flex-col justify-between gap-[40px] md:flex-row">
      {/* desktop view */}
      <div className="hidden flex-2/3 w-full flex-col gap-[40px] md:flex">
        <h1 className="text-6xl font-bold">Hello, {user?.displayName}</h1>
        <EventsSchedule />
      </div>

      {/* tablet / mobile greeting */}
      <div className="flex gap-[40px] md:hidden">
        <h1 className="text-6xl font-bold">Hello, {user?.displayName}</h1>
      </div>
      <TimeFrameProvider>
        <CheckInCountProvider>
        {/* Mobile: stack with 40px gap; desktop: contents so sidebar stays in flow */}
        <div className="flex flex-col gap-[40px] md:contents">
          <div className="md:hidden w-full">
            <CheckInCounter />
          </div>
          <div className="flex w-full md:hidden">
            <SpontaneousCheckInModal />
          </div>
          <div className="flex flex-1 flex-col gap-[40px] md:hidden">
            <EventsSchedule />
          </div>
        </div>

        {/* Sidebar layout for md and up */}
        <div className="hidden w-1/3 flex-col gap-[40px] md:flex">
          <CheckInCounter />
          <RecentClients />
          <SpontaneousCheckInModal />
        </div>
        </CheckInCountProvider>
      </TimeFrameProvider>
    </div>
  )
}
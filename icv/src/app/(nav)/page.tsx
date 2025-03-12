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

export const dynamic = 'force-dynamic'

export default function Home() {
    const router = useRouter()

    return (
        <div className="flex h-screen flex-row gap-6 p-6 pt-12">
            <div className="flex flex-1 flex-col gap-8">
                <h1 className="text-6xl font-bold">Hello, Akhilesh</h1>

                <EventsSchedule />
            </div>
            <div className="flex w-1/3 flex-col gap-6">
                <div className="flex flex-row justify-between">
                    <h2 className="text-3xl font-semibold">ICV's Numbers</h2>
                    <Select defaultValue="week">
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Timeframe" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="week">Week</SelectItem>
                            <SelectItem value="month">Month</SelectItem>
                            <SelectItem value="ytd">Year to Date</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* 2 column grid */}
                <div className="grid grid-cols-2 gap-6">
                    <Card className="flex flex-1 flex-row items-center justify-between">
                        <h1 className="text-4xl font-bold">3</h1>
                        <p className="flex flex-row items-center gap-2 text-right">
                            check-ins
                        </p>
                    </Card>
                    <Card className="flex flex-1 flex-row items-center justify-between">
                        <h1 className="text-4xl font-bold">1</h1>
                        <p className="flex flex-row items-center gap-2 text-right">
                            hot meals
                        </p>
                    </Card>
                    <Card className="flex flex-1 flex-row items-center justify-between">
                        <h1 className="text-4xl font-bold">2</h1>
                        <p className="flex flex-row items-center gap-2 text-right">
                            hygiene kits
                        </p>
                    </Card>
                    <Card className="flex flex-1 flex-row items-center justify-between">
                        <h1 className="text-4xl font-bold">1</h1>
                        <p className="flex flex-row items-center gap-2 text-right">
                            snack packs
                        </p>
                    </Card>
                </div>
                <h1 className="text-2xl font-semibold">Recent Clients</h1>
                <Link href="/clientprofile" >
                <Card>
                    <h1 className="text-xl font-bold">Jimin Kim</h1>
                    <p>PK2025</p>
                </Card>
                </Link>
                <div className="mt-auto">
                    <Button
                        className="mt-6 w-full"
                        onClick={() => {
                            router.push('/intake')
                        }}
                    >
                        New Client
                    </Button>
                </div>
            </div>
        </div>
    )
}

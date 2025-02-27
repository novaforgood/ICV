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
import Symbol from '../components/Symbol'

export const dynamic = 'force-dynamic'

export default function Home() {
    const router = useRouter()

    return (
        <div className="flex flex-row gap-6 p-6 pt-12">
            <div className="flex-1">
                <h1 className="text-6xl font-bold">Hello, Akhilesh</h1>

                <div className="mt-8 flex flex-row justify-between">
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

                <div className="mt-8 flex flex-row gap-6">
                    <Card className="flex-1">
                        <h1 className="mb-8 text-4xl font-bold">1</h1>
                        <p className="flex flex-row items-center gap-2">
                            <Symbol symbol="group" />
                            new clients
                        </p>
                    </Card>
                    <Card className="flex-1">
                        <h1 className="mb-8 text-4xl font-bold">2</h1>
                        <p className="flex flex-row items-center gap-2">
                            <Symbol symbol="soup_kitchen" />
                            meal kits given
                        </p>
                    </Card>

                    <Card className="flex-1">
                        <h1 className="mb-8 text-4xl font-bold">3</h1>
                        <p className="flex flex-row items-center gap-2">
                            <Symbol symbol="calendar_month" />
                            check-ins
                        </p>
                    </Card>
                </div>
            </div>
            <div className="flex w-1/3 flex-col gap-6">
                <Button
                    className="w-full"
                    onClick={() => {
                        router.push('/intake')
                    }}
                >
                    New Client
                </Button>
                <h1 className="text-2xl font-semibold">Recent Clients</h1>

                <Card>
                    <h1 className="text-xl font-bold">Jimin Kim</h1>
                    <p>lorem ipsum</p>
                </Card>
            </div>
        </div>
    )
}

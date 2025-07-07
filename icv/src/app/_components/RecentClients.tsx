import { getAllClientsByLastCheckinDate, getRecentClients } from '@/api/clients'
import { NewClient } from '@/types/client-types'
import useSWR from 'swr'
import ClientCard from './ClientCard'
import React from 'react'
import Link from 'next/link'

const RecentClients: React.FC = () => {
    const { data: clients } = useSWR<NewClient[]>('recentClients', getRecentClients)

    if (!clients) {
        return (
            <div>
                <h1 className="text-2xl font-semibold">Recent Clients</h1>
                <div className="text-center text-gray-500">Loading clients...</div> 
            </div>
        )
    }
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold">Recent Clients</h1>
            <div className="flex flex-col gap-4">
                {clients.map((client) => (
                    <Link href={`/clients/${client.docId}`} key={client.docId} className="block">
                        <ClientCard client={client} showLastCheckin={true} />
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default React.memo(RecentClients)
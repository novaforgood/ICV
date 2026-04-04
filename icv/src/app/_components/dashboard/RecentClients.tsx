import { getRecentClients } from '@/api/clients'
import { useHomePageLoadingReporter } from '@/app/_context/HomePageLoadingContext'
import { NewClient } from '@/types/client-types'
import Link from 'next/link'
import React from 'react'
import useSWR from 'swr'
import ClientCard from '../ClientCard'

const RecentClients: React.FC = () => {
    const { data: clients } = useSWR<NewClient[]>(
        'recentClients',
        getRecentClients,
    )

    useHomePageLoadingReporter('recentClients', clients === undefined)

    if (!clients) {
        return null
    }
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold">Recent Clients</h1>
            <div className="flex flex-col gap-4">
                {clients.map((client) => (
                    <Link
                        href={`/clients/${client.docId}`}
                        key={client.docId}
                        className="block"
                    >
                        <ClientCard client={client} showLastCheckin={true} />
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default React.memo(RecentClients)

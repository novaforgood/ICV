'use client'

import { getLastCheckInDate } from '@/api/events'
import { Card } from '@/components/ui/card'
import { NewClient } from '@/types/client-types'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const formatDate = (date: Date | string | null | undefined) => {
    const parsedDate = date ? new Date(date) : null
    if (!parsedDate || isNaN(parsedDate.getTime())) return 'N/A'

    return parsedDate.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
    })
}

interface ClientCardProps {
    client: NewClient
    showLastCheckin?: boolean
    docID?: string
}

const ClientCard: React.FC<ClientCardProps> = ({
    client,
    showLastCheckin = true,
    docID,
}) => {
    const [lastCheckIn, setLastCheckIn] = useState<Date | null>(null)

    useEffect(() => {
        const fetchLastCheckIn = async () => {
            if (docID && showLastCheckin) {
                try {
                    if (docID) {
                        const date = await getLastCheckInDate(docID)
                        setLastCheckIn(date)
                    } else {
                        console.error('client.docId is undefined')
                        setLastCheckIn(null)
                    }
                } catch (error) {
                    console.error('Error fetching last check-in date:', error)
                    setLastCheckIn(null)
                }
            }
        }

        fetchLastCheckIn()
    }, [client.docId])

    return (
        <Card className="flex min-h-24 w-full bg-white p-4 hover:bg-gray-50">
            <div className="flex w-full items-start gap-3">
                {client.clientPic?.[0]?.uri ? (
                    <Image
                        src={client.clientPic[0].uri}
                        alt={`${client.firstName} ${client.lastName}`}
                        className="aspect-square h-16 w-16 rounded-full object-cover object-center"
                        width={64}
                        height={64}
                    />
                ) : (
                    <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-16 w-16 flex-shrink-0 text-gray-300"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                )}
                <div className="flex w-full flex-col">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="line-clamp-1 font-medium text-gray-900">
                                {client.firstName} {client.lastName}
                            </div>
                            <div className="mt-0.5 text-sm text-gray-500">
                                {client.clientCode || client.id}
                            </div>
                        </div>
                    </div>
                    {showLastCheckin && (
                        <div className="mt-2 flex flex-row items-center justify-between text-xs text-gray-500">
                            <span className="text-gray-400">Last check-in</span>
                            <span className="text-xs">
                                {formatDate(lastCheckIn || client.intakeDate)}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    )
}

export default ClientCard

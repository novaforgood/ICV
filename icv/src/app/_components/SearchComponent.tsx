'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/hooks/useUser'
import { getClientByCaseManager } from '@/api/clients'
import type { NewClient } from '@/types/client-types'
import { searchByKeyword } from '@/lib/firestoreUtils'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'

// Extended client type with lastCheckinDate
interface ClientWithLastCheckin extends NewClient {
    lastCheckinDate?: string;
}

const SearchComponent = () => {
    const { user } = useUser()
    const [searchTerm, setSearchTerm] = useState('')
    const [results, setResults] = useState<ClientWithLastCheckin[]>([])
    const [loading, setLoading] = useState(false)
    const [initialPage, setInitialPage] = useState(true)
    const [managerClients, setManagerClients] = useState<ClientWithLastCheckin[]>([])
    const [isLoadingManagerClients, setIsLoadingManagerClients] = useState(false)
    const [managerClientsError, setManagerClientsError] = useState<string | null>(null)
    // Format date helper function
    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'No check-in'
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: '2-digit'
        })
    }

    // console.log(managerClients)

    useEffect(() => {
        const fetchManagerClients = async () => {
            if (!user?.uid) return

            setIsLoadingManagerClients(true)
            setManagerClientsError(null)
            try {
                const clients = await getClientByCaseManager()
                setManagerClients(clients as ClientWithLastCheckin[])
            } catch (err) {
                console.error('Error fetching manager clients:', err)
                setManagerClientsError('Failed to load assigned clients')
            } finally {
                setIsLoadingManagerClients(false)
            }
        }

        fetchManagerClients()
    }, [user?.uid])

    useEffect(() => {
        const performSearch = async () => {
            if (!searchTerm.trim()) {
                setResults([])
                setInitialPage(true)
                return
            }

            setLoading(true)
            setInitialPage(false)
            try {
                const searchResults = await searchByKeyword(searchTerm)
                setResults(searchResults as ClientWithLastCheckin[])

            } catch (err) {
                console.error('Error searching clients:', err)
            } finally {
                setLoading(false)
            }
        }

        const debounceTimer = setTimeout(performSearch, 300)
        return () => clearTimeout(debounceTimer)
    }, [searchTerm])

    return (
        <div className="w-full max-w-6xl mx-auto p-4">
            <div className="mb-8 flex items-center gap-4">
                <div className="bg-midground flex flex-1 flex-row items-center gap-2 rounded px-4 py-2 text-black">
                    <svg
                        className="h-4 w-4 flex-shrink-0 -translate-y-[1px] text-gray-700"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search clients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-transparent text-base outline-none placeholder:text-gray-700"
                    />
                </div>
                <button className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                    </svg>
                    Sort intake date
                </button>
                <button className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                    </svg>
                    Filter intake date
                </button>
            </div>

            {loading && (
                <div className="mt-4 w-full text-center text-gray-500">
                    Searching...
                </div>
            )}
            {managerClientsError && (
                <div className="text-red-500 text-center mb-4">
                    {managerClientsError}
                </div>
            )}

            <div className="grid gap-4">
                {initialPage ? (
                    <div className="mb-4">
                        <h2 className="text-black text-3xl font-semibold font-['Epilogue'] mb-4">
                            Recent Check-Ins
                        </h2>
                        {isLoadingManagerClients ? (
                            <div className="text-center text-gray-500">Loading assigned clients...</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {managerClients.slice(0, 4).map((client) => (
                                    <Link
                                        key={client.id}
                                        href={`/clients/${client.id}`}
                                        className="text-lg font-medium text-blue-600 hover:text-blue-800"
                                    >
                                        <Card className="flex min-h-24 w-full bg-white p-4 hover:bg-gray-50">
                                            <div className="flex w-full items-start gap-3">
                                                {client.clientImage?.[0] ? (
                                                    <Image
                                                        src={client.clientImage[0]}
                                                        alt={`${client.firstName} ${client.lastName}`}
                                                        className="h-16 w-16 rounded-full object-cover"
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
                                                <div className="flex min-w-0 flex-1 flex-col">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <div className="text-base font-large text-gray-900">
                                                                {client.firstName} {client.lastName}
                                                            </div>
                                                            <div className="mt-0.5 text-sm text-black">
                                                                <div className="self-stretch justify-start text-black text-sm font-normal font-['Epilogue'] leading-none">
                                                                    {client.clientCode || client.id}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 flex flex-row items-center justify-between text-xs text-gray-500">
                                                        <span className="text-gray-400">
                                                            Last checked
                                                        </span>
                                                        <div className="flex justify-end text-gray-400">
                                                            <span className="ml-2">
                                                                {formatDate(client.lastCheckinDate)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <h2 className="text-black text-3xl font-semibold font-['Epilogue'] mb-4">
                            Search Results
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {results.map((client) => (
                                <Link
                                    key={client.id}
                                    href={`/clients/${client.id}`}
                                    className="text-lg font-medium text-blue-600 hover:text-blue-800"
                                >
                                    <Card className="flex min-h-24 w-full bg-white p-4 hover:bg-gray-50">
                                        <div className="flex w-full items-start gap-3">
                                            {client.clientImage?.[0] ? (
                                                <Image
                                                    src={client.clientImage[0]}
                                                    alt={`${client.firstName} ${client.lastName}`}
                                                    className="h-16 w-16 rounded-full object-cover"
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
                                            <div className="flex min-w-0 flex-1 flex-col">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <div className="text-base font-medium text-gray-900">
                                                            {client.firstName} {client.lastName}
                                                        </div>
                                                        <div className="mt-0.5 text-sm text-gray-500">
                                                            {client.clientCode || client.id}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-2 flex flex-row items-center justify-between text-sm text-gray-500">
                                                    <span className="text-gray-400">
                                                        Last check-in
                                                    </span>
                                                    <div className="flex justify-end">
                                                        <span className="ml-2">
                                                            {formatDate(client.lastCheckinDate)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

// function truncateText(text: string, length: number) {
//     return text.length > length ? text.slice(0, length) + '...' : text
// }

export default SearchComponent

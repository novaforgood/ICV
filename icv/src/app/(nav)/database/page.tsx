'use client'

import { getAllClients } from '@/api/clients'
import { NewClient } from '@/types/client-types'
import { useRouter, useSearchParams } from 'next/navigation'
import { NavMainContentLoadingOverlay } from '@/app/_components/LoadingOverlay'
import { Suspense, useEffect, useState } from 'react'
import ClientsTable from './_components/ClientsTable'
import HousingStatusTable from './_components/HousingStatusTable'
import PieChart from './_components/PieChart'

const DatabaseContent = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [activeView, setActiveView] = useState<'table' | 'chart' | 'housing'>(
        () => {
            const view = searchParams.get('view')
            return view === 'chart' || view === 'housing' ? view : 'table'
        },
    )
    const [clients, setClients] = useState<NewClient[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Update URL when activeView changes
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('view', activeView)
        router.push(`?${params.toString()}`)
    }, [activeView, router, searchParams])

    // Fetch clients when component mounts
    useEffect(() => {
        const fetchClients = async () => {
            setIsLoading(true)
            try {
                const data = await getAllClients()
                setClients(data)
            } finally {
                setIsLoading(false)
            }
        }
        fetchClients()
    }, [])

    return (
        <div className="m-[48px] space-y-[40px]">
            <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <h1 className="text-6xl font-bold">Database</h1>

                {/* Toggle Switch - moves to row below title on screens smaller than lg */}
                <div className="relative inline-flex w-fit items-center justify-start self-start rounded-[20px] bg-zinc-200 p-1 lg:self-center">
                    <div
                        className={`absolute transition-all duration-300 ease-in-out ${
                            activeView === 'table'
                                ? 'left-1'
                                : activeView === 'chart'
                                  ? 'left-[calc(33.33%+2px)]'
                                  : 'left-[calc(66.66%+2px)]'
                        } h-[calc(100%-8px)] w-[calc(33.33%-4px)] rounded-[16px] bg-black`}
                    />
                    <button
                        onClick={() => setActiveView('table')}
                        className={`relative flex w-[140px] items-center justify-center gap-2.5 rounded-[16px] px-5 py-2 transition-colors duration-300 ${
                            activeView === 'table' ? 'text-white' : 'text-black'
                        }`}
                    >
                        <div className="w-full justify-center text-center font-['Epilogue'] text-base font-normal leading-none">
                            Clients
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveView('chart')}
                        className={`relative flex w-[140px] items-center justify-center gap-2.5 rounded-[16px] px-5 py-2 transition-colors duration-300 ${
                            activeView === 'chart' ? 'text-white' : 'text-black'
                        }`}
                    >
                        <div className="w-full justify-center text-center font-['Epilogue'] text-base font-normal leading-none">
                            Check ins
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveView('housing')}
                        className={`relative flex w-[140px] items-center justify-center gap-2.5 rounded-[16px] px-5 py-2 transition-colors duration-300 ${
                            activeView === 'housing'
                                ? 'text-white'
                                : 'text-black'
                        }`}
                    >
                        <div className="w-full justify-center text-center font-['Epilogue'] text-base font-normal leading-none">
                            Housing
                        </div>
                    </button>
                </div>
            </div>

            {/* Conditional Rendering */}
            {activeView === 'table' ? (
                <ClientsTable clients={clients} isLoading={isLoading} />
            ) : activeView === 'chart' ? (
                <PieChart />
            ) : (
                <HousingStatusTable />
            )}
        </div>
    )
}

const DatabasePage = () => {
    return (
        <Suspense
            fallback={<NavMainContentLoadingOverlay />}
        >
            <DatabaseContent />
        </Suspense>
    )
}

export default DatabasePage

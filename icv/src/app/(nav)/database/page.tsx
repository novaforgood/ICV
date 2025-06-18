'use client'

import { getAllClients } from '@/api/clients'
import { NewClient } from '@/types/client-types'
import { useEffect, useState } from 'react'
import ClientsTable from './_components/ClientsTable'
import PieChart from './_components/PieChart'
import HousingStatusTable from './_components/HousingStatusTable'

const DatabasePage = () => {
    const [activeView, setActiveView] = useState<'table' | 'chart' | 'housing'>('table')
    const [clients, setClients] = useState<NewClient[]>([])
    const [isLoading, setIsLoading] = useState(true)

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
            <div className="mb-4 flex flex-row items-center justify-between">
                <h1 className="text-6xl font-bold">Database</h1>

                {/* Toggle Switch */}
                <div className="relative inline-flex items-center justify-start rounded-[20px] bg-zinc-200 p-1">
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
                        className={`relative flex items-center justify-center gap-2.5 rounded-[16px] px-5 py-2 transition-colors duration-300 w-[120px] ${
                            activeView === 'table' ? 'text-white' : 'text-black'
                        }`}
                    >
                        <div className="justify-center font-['Epilogue'] text-base font-normal leading-none text-center w-full">
                            Clients
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveView('chart')}
                        className={`relative flex items-center justify-center gap-2.5 rounded-[16px] px-5 py-2 transition-colors duration-300 w-[120px] ${
                            activeView === 'chart' ? 'text-white' : 'text-black'
                        }`}
                    >
                        <div className="justify-center font-['Epilogue'] text-sm font-normal leading-none text-center w-full">
                            Check ins
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveView('housing')}
                        className={`relative flex items-center justify-center gap-2.5 rounded-[16px] px-5 py-2 transition-colors duration-300 w-[120px] ${
                            activeView === 'housing' ? 'text-white' : 'text-black'
                        }`}
                    >
                        <div className="justify-center font-['Epilogue'] text-base font-normal leading-none text-center w-full">
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

export default DatabasePage

'use client'

import { getAllClients } from '@/api/clients'
import { NewClient } from '@/types/client-types'
import { useEffect, useState } from 'react'
import ClientsTable from './_components/ClientsTable'
import PieChart from './_components/PieChart'

const DatabasePage = () => {
    const [activeView, setActiveView] = useState<'table' | 'chart'>('table')
    const [clients, setClients] = useState<NewClient[]>([])

    // Fetch clients when component mounts
    useEffect(() => {
        const fetchClients = async () => {
            const data = await getAllClients()
            setClients(data)
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
                                : 'left-[calc(100%-50%-4px)]'
                        } h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-[16px] bg-black`}
                    />
                    <button
                        onClick={() => setActiveView('table')}
                        className={`relative flex items-center justify-center gap-2.5 rounded-[16px] px-5 py-2 transition-colors duration-300 ${
                            activeView === 'table' ? 'text-white' : 'text-black'
                        }`}
                    >
                        <div className="justify-center font-['Epilogue'] text-base font-normal leading-none">
                            Clients
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveView('chart')}
                        className={`relative flex items-center justify-center gap-2.5 rounded-[16px] px-5 py-2 transition-colors duration-300 ${
                            activeView === 'chart' ? 'text-white' : 'text-black'
                        }`}
                    >
                        <div className="justify-center font-['Epilogue'] text-base font-normal leading-none">
                            Check ins
                        </div>
                    </button>
                </div>
            </div>

            {/* Conditional Rendering */}
            {activeView === 'table' ? (
                <ClientsTable clients={clients} />
            ) : (
                <PieChart />
            )}
        </div>
    )
}

export default DatabasePage

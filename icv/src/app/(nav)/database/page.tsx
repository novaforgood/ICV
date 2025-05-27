'use client'

import { useState, useEffect } from 'react'
import { getAllClients } from '@/api/clients'
import ClientsTable from './_components/ClientsTable'
import PieChart from './_components/PieChart'
import { NewClient } from '@/types/client-types'


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
        <div className="p-6 pt-12">
            <div className="mb-4 flex flex-row justify-between items-center">
                <h1 className="text-6xl font-bold px-10">Database</h1>
                
                {/* Toggle Switch */}
                <div className="relative bg-zinc-200 rounded-[20px] inline-flex justify-start items-center p-1">
                    <div 
                        className={`absolute transition-all duration-300 ease-in-out ${
                            activeView === 'table' ? 'left-1' : 'left-[calc(100%-50%-4px)]'
                        } w-[calc(50%-4px)] h-[calc(100%-8px)] bg-black rounded-[16px]`}
                    />
                    <button
                        onClick={() => setActiveView('table')}
                        className={`relative px-5 py-2 rounded-[16px] flex justify-center items-center gap-2.5 transition-colors duration-300 ${
                            activeView === 'table' ? 'text-white' : 'text-black'
                        }`}
                    >
                        <div className="justify-center text-base font-normal font-['Epilogue'] leading-none">
                            Clients
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveView('chart')}
                        className={`relative px-5 py-2 rounded-[16px] flex justify-center items-center gap-2.5 transition-colors duration-300 ${
                            activeView === 'chart' ? 'text-white' : 'text-black'
                        }`}
                    >
                        <div className="justify-center text-base font-normal font-['Epilogue'] leading-none">
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

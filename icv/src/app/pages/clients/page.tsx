// pages/clients/page.tsx
"use client";  // Add this line to mark it as a client-side component

import { useState, useEffect } from 'react'
import { getAllClients } from '@/api/clients'
import ClientsTable from '@/app/components/ClientsTable'
import { Client } from '@/types/case-types'

const ClientsPage = () => {
    const [clients, setClients] = useState<Client[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const clientsData = await getAllClients()
                setClients(clientsData)
            } catch (err) {
                setError('Failed to load clients')
            } finally {
                setLoading(false)
            }
        }

        fetchClients()
    }, [])

    if (loading) return <div>Loading...</div>
    if (error) return <div>{error}</div>

    return <ClientsTable clients={clients} />
}

export default ClientsPage

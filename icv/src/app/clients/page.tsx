// "use client";  // Add this line to mark it as a client-side component

// import { useState, useEffect } from 'react'
// import { getAllClients } from '@/api/clients'
// import ClientsTable from '@/app/components/ClientsTable'
// import { Client } from '@/types/client-types'

// const ClientsPage = () => {
//     const [clients, setClients] = useState<Client[]>([])
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState('')

//     useEffect(() => {
//         const fetchClients = async () => {
//             try {
//                 const clientsData = await getAllClients()
//                 setClients(clientsData)
//             } catch (err) {
//                 setError('Failed to load clients')
//             } finally {
//                 setLoading(false)
//             }
//         }

//         fetchClients()
//     }, [])

//     if (loading) return <div>Loading...</div>
//     if (error) return <div>{error}</div>

//     return <ClientsTable clients={clients} />
// }

// export default ClientsPage

"use client";

import SearchComponent from "@/app/components/SearchComponent";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <h1 className="text-2xl font-bold mb-4">Search for Users</h1>
            <SearchComponent />
        </div>
    );
}

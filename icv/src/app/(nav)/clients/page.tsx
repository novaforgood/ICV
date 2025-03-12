'use server'

import { getAllClients } from '@/api/clients'
import SearchComponent from '@/app/_components/SearchComponent'

export default async function ClientsPage() {
    const clients = await getAllClients()

    return (
        <div className="w-full p-6">
            <h1 className="mb-4 mt-6 w-full text-6xl font-bold">Clients</h1>

            <SearchComponent clients={clients} />
        </div>
    )
}

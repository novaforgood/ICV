'use server'

import { getAllClients } from '@/api/clients'
import SearchComponent from '@/app/_components/SearchComponent'

export default async function ClientsPage() {
    const clients = await getAllClients()
    
    return (
        <>
            <SearchComponent clients={clients} />
        </>
    )
}

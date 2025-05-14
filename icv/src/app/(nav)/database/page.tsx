'use server'

import { getAllClients } from '@/api/clients'
import ClientsTable from './_components/ClientsTable'

interface Props {}

const page = async (props: Props) => {
    const clients = await getAllClients()
    return (
        <div className="p-6 pt-12">
            <div className="mb-4 flex flex-row">
                <h1 className="text-6xl font-bold">Client Database</h1>
            </div>
            <ClientsTable clients={clients} />
        </div>
    )
}

export default page

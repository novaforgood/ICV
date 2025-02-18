'use server'

import { getClientById } from '@/api/make-cases/make-case'
import { getEventsbyClientId } from '@/api/make-cases/make-event'
import ClientEvents from '@/app/components/ClientEvents'

const page = async ({
    params,
}: {
    params: {
        clientId: string
    }
}) => {
    const { clientId } = await params
    console.log('id', clientId)
    const client = await getClientById(clientId)
    console.log('client', client)

    const events = await getEventsbyClientId(clientId)
    // if (!client) {
    //     return <div>client not found</div>
    // }
    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-50 p-8">
            <h1 className="mb-4 text-xl font-bold text-gray-800">
                client {client.firstName} {client.lastName}'s information{' '}
            </h1>
            <h1> client ID: {params.clientId}</h1>
            <p>{client.assignedClientManager}</p>

            {/* Display Events Table */}
            <div className="space-y-4 p-10">
                <h2 className="font-bold">Client Events:</h2>
                <table
                    className="w-[100%] border p-2"
                    style={{ padding: '10px' }}
                >
                    <thead>
                        <tr>
                            <th className="border p-2">Date</th>
                            <th className="border p-2">Contact Type</th>
                            <th className="border p-2">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.length > 0 ? (
                            events.map((event, index) => (
                                <tr key={index}>
                                    <td className="border p-2">{event.date}</td>
                                    <td className="border p-2">
                                        {event.contactType}
                                    </td>
                                    <td className="border p-2">
                                        {event.description}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="border p-2 text-center"
                                >
                                    No events found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <ClientEvents clientID={clientId} />
        </div>
    )
}

export default page

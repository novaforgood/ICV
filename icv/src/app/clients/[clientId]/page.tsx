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
    const { clientId } = params
    const client = await getClientById(clientId)
    const events = await getEventsbyClientId(clientId)

    console.log('client', client)

    return (
        <div>
            <h1>Client ID: {clientId}</h1>
            <div>
                <h2>Client Details:</h2>
                <pre>{JSON.stringify(client, null, 2)}</pre>
            </div>

            {/* Embed the ClientEvents component to show the form and table */}

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
                <ClientEvents clientID={clientId} />
            </div>
        </div>
    )
}

export default page

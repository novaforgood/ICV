import { getClientById } from '@/api/make-cases/make-case'
import { getEventsbyClientId } from '@/api/make-cases/make-event'
import EditEvents from '@/app/components/EditEvents'

const page = async ({
    params,
}: {
    params: {
        clientId: string
    }
}) => {
    const { clientId } = await params
    const client = await getClientById(clientId)
    const events = await getEventsbyClientId(clientId)

    // console.log('client', client)

    return (
        <div>
            <h1>Client ID: {clientId}</h1>
            <div>
                <h2>Client Details:</h2>
                <pre>{JSON.stringify(client, null, 2)}</pre>
            </div>

            {/* Passing clientId and events to ClientEditor */}
            <EditEvents clientId={clientId} events={events} />
        </div>
    )
}

export default page

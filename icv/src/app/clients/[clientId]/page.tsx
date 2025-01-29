import { getClientById } from '@/api/make-cases/make-case'
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
    console.log('client', client)

    return (
        <div>
            <h1>Client ID: {clientId}</h1>
            <div>
                <h2>Client Details:</h2>
                <pre>{JSON.stringify(client, null, 2)}</pre>
            </div>

            {/* Embed the ClientEvents component to show the form and table */}
            <ClientEvents />
        </div>
    )
}

export default page

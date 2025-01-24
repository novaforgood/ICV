import { getClientById } from '@/api/make-cases/make-case'

const page = async ({
    params,
}: {
    params: {
        clientId: string
    }
}) => {
    const client = await getClientById(params.clientId)
    return (
        <div>
            <h1>
                {' '}
                client {client.firstName} {client.lastName}'s information{' '}
            </h1>
            <p>{client.assignedClientManager}</p>
        </div>
    )
    
}

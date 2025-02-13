import { getClientById } from '@/api/make-cases/make-case'

const page = async ({
    params,
}: {
    params: {
        id: string
    }
}) => {
    const client = await getClientById(params.id)
    return (
        <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
            <h1 className="text-xl font-bold text-gray-800 mb-4">
                {' '}
                client {client.firstName} {client.lastName}'s information{' '}
            </h1>
            <h1> client ID: {params.id}</h1>
            <p>{client.assignedClientManager}</p>
        </div>
    )
}

export default page

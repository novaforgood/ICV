import { getClientById } from '@/api/make-cases/make-case'

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

    return <div>{JSON.stringify(client)}</div>
}

export default page

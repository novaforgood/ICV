import { getClientById } from '@/api/make-cases/make-case'
import { ClientFamilyToggle } from '@/app/_components/clientProfile/EditClientFamily'
import { notFound } from 'next/navigation'

const page = async ({
    params,
}: {
    params: Promise<{
        clientId: string
    }>
}) => {
    const { clientId } = await params
    const client = await getClientById(clientId)
    if (!client) notFound()
    return (
        <ClientFamilyToggle
            client={client}
            spouse={
                client.associatedSpouseID
                    ? await getClientById(client.associatedSpouseID)
                    : undefined
            }
            id={clientId}
        />
    )
}

export default page

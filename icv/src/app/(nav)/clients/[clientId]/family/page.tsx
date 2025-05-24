import { getClientById } from '@/api/make-cases/make-case'
import { ClientFamilyToggle } from '@/app/_components/clientProfile/EditClientFamily'

const page = async ({
    params,
}: {
    params: {
        clientId: string
    }
}) => {
    const { clientId } = await params
    const client = await getClientById(clientId)

    return (
        <ClientFamilyToggle
            client={client}
            spouse={
                client.associatedSpouseID
                    ? await getClientById(client.associatedSpouseID)
                    : undefined
            }
        />
    )
}

export default page

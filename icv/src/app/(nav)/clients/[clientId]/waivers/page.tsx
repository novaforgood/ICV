import { getClientById } from '@/api/make-cases/make-case'
import { ClientWaiversToggle } from '@/app/_components/clientProfile/EditClientWaivers'

const page = async ({
    params,
}: {
    params: {
        clientId: string
    }
}) => {
    const { clientId } = await params
    const client = await getClientById(clientId)
    return <ClientWaiversToggle client={client} id={clientId} />
}

export default page

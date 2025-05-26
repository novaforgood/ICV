import { getClientById } from '@/api/make-cases/make-case'
import { ClientBackgroundToggle } from '@/app/_components/clientProfile/EditClientBackground'

const page = async ({
    params,
}: {
    params: {
        clientId: string
    }
}) => {
    const { clientId } = await params
    const client = await getClientById(clientId)
    return <ClientBackgroundToggle client={client} id={clientId} />
}

export default page

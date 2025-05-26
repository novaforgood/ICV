import { getClientById } from '@/api/make-cases/make-case'
import { ClientServicesToggle } from '@/app/_components/clientProfile/EditClientServices'

const page = async ({
    params,
}: {
    params: {
        clientId: string
    }
}) => {
    const { clientId } = await params
    const client = await getClientById(clientId)
    return <ClientServicesToggle client={client} id={clientId}/>
}

export default page

import { getClientById } from '@/api/make-cases/make-case'
import { ClientServicesToggle } from '@/app/_components/clientProfile/EditClientServices'
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
    return <ClientServicesToggle client={client} id={clientId}/>
}

export default page

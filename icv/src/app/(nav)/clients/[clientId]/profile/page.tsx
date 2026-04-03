import { getClientById } from '@/api/make-cases/make-case'
import { ClientProfileToggle } from '@/app/_components/clientProfile/EditClientProfile'
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

    return <ClientProfileToggle client={client} id={clientId} />
}

export default page

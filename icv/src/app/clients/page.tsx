'use server'

// 'use client' // Add this line to mark it as a client-side component

import { getAllClients } from '@/api/clients'
import ClientsTable from '@/app/_components/ClientsTable'

const ClientsPage = async () => {
    // const [clients, setClients] = useState<Client[]>([])
    // const [loading, setLoading] = useState(true)
    // const [error, setError] = useState('')

    // useEffect(() => {
    //     const fetchClients = async () => {
    //         try {
    //             const clientsData = await getAllClients()
    //             setClients(clientsData)
    //         } catch (err) {
    //             setError('Failed to load clients')
    //         } finally {
    //             setLoading(false)
    //         }
    //     }

    //     fetchClients()
    // }, [])

    // if (loading) return <div>Loading...</div>
    // if (error) return <div>{error}</div>

    const clients = await getAllClients()

    return <ClientsTable clients={clients} />
}

export default ClientsPage

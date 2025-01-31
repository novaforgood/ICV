import { clientDb } from '@/lib/firebase'
import { Client } from '@/types/client-types'
import { collection, getDocs } from 'firebase/firestore'

export async function getAllClients(): Promise<Client[]> {
    const clientsCollection = collection(clientDb, 'clients') // Ensure the collection name is correct
    const clientsSnapshot = await getDocs(clientsCollection)
    const clientsList = clientsSnapshot.docs.map((doc) => doc.data() as Client)
    return clientsList
}


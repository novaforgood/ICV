import { db } from '@/data/firebase'
import { Client } from '@/types/client'
import { collection, getDocs } from 'firebase/firestore'

export async function getAllClients(): Promise<Client[]> {
    const clientsCollection = collection(db, 'clients')  // Ensure the collection name is correct
    const clientsSnapshot = await getDocs(clientsCollection)
    const clientsList = clientsSnapshot.docs.map((doc) => doc.data() as Client)
    return clientsList
}

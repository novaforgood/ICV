import { Client } from '@/types/client-types'
import { collection, getDocs, getFirestore } from 'firebase/firestore'
import { getAuthenticatedAppForUser } from '@/lib/serverApp'

export async function getAllClients(): Promise<Client[]> {
    const { firebaseServerApp } = await getAuthenticatedAppForUser()
    const ssrdb = getFirestore(firebaseServerApp)

    const clientsCollection = collection(ssrdb, 'clients') // Ensure the collection name is correct
    const clientsSnapshot = await getDocs(clientsCollection)
    const clientsList = clientsSnapshot.docs.map((doc) => doc.data() as Client)
    return clientsList
}

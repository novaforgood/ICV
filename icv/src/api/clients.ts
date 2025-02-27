import { getAuthenticatedAppForUser } from '@/lib/serverApp'
import { NewClient } from '@/types/client-types'
import { collection, getDocs, getFirestore } from 'firebase/firestore'

export async function getAllClients(): Promise<NewClient[]> {
    const { firebaseServerApp, currentUser } =
        await getAuthenticatedAppForUser()
    if (!currentUser) {
        throw new Error('User not found')
    }
    const ssrdb = getFirestore(firebaseServerApp)

    const clientsCollection = collection(ssrdb, 'clients') // Ensure the collection name is correct
    const clientsSnapshot = await getDocs(clientsCollection)
    const clientsList = clientsSnapshot.docs.map(
        (doc) => doc.data() as NewClient,
    )
    return clientsList
}

export async function getClientById(id: string) {
    const clientsCollection = collection(db, 'clients')
    const clientDoc = await getDoc(doc(clientsCollection, id))
    const client = clientDoc.data() as Client
    return client
}
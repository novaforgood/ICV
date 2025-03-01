import { getAuthenticatedAppForUser } from '@/lib/serverApp'
import { NewClient } from '@/types/client-types'
import { collection, getDoc, getDocs, getFirestore, doc } from 'firebase/firestore'

export async function getAllClients(): Promise<NewClient[]> {
    const { firebaseServerApp, currentUser } =
        await getAuthenticatedAppForUser()
    if (!currentUser) {
        throw new Error('User not found')
    }
    const ssrdb = getFirestore(firebaseServerApp)

    const clientsCollection = collection(ssrdb, 'clients') // Ensure the collection name is correct
    const clientsSnapshot = await getDocs(clientsCollection)
    const clientsList = clientsSnapshot.docs.map((doc) => {
        const data = doc.data() as NewClient
        data.id = doc.id
        return data
    })
    return clientsList
}

export async function getClientById(id: string) {
    const { firebaseServerApp, currentUser } =
        await getAuthenticatedAppForUser()
    if (!currentUser) {
        throw new Error('User not found')
    }
    const ssrdb = getFirestore(firebaseServerApp)

    const clientsCollection = collection(ssrdb, 'clients')
    const clientDoc = await getDoc(doc(clientsCollection, id))
    const client = clientDoc.data() as NewClient
    client.id = clientDoc.id
    return client
}
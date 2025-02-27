import { getAuthenticatedAppForUser } from '@/lib/serverApp'
import { Client, ClientSchema } from '@/types/client-types'
import { getAuthenticatedAppForUser } from '@/lib/serverApp'

import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    updateDoc,
} from 'firebase/firestore'

export async function createClient(client: Client) {
    // verify that the client object is valid
    // let results = ClientSchema.optional().safeParse(client)
    // if (results.success === false) {

    //     throw new Error('Client object is invalid ' + JSON.stringify(results))
    // }
    const { firebaseServerApp } = await getAuthenticatedAppForUser()
    const ssrdb = getFirestore(firebaseServerApp)
    console.log('asdfsdafdsfafdsasdfclient', client)
    const clientsCollection = collection(ssrdb, 'clients')
    const newDoc = await addDoc(clientsCollection, client)
    console.log('Case added with ID: ', newDoc.id)
}

export async function getAllClients() {
    const { firebaseServerApp } = await getAuthenticatedAppForUser()
    const ssrdb = getFirestore(firebaseServerApp)

    const clientsCollection = collection(ssrdb, 'clients')
    const clientsSnapshot = await getDocs(clientsCollection)

    const clients = clientsSnapshot.docs.map((doc) => ({
        id: doc.id, // Firebase document ID
        ...doc.data(), // Other client fields
    })) as Client[]

    return clients
}

export async function getClientById(id: string) {
    // if (!id) {
    //     return
    //     throw new Error('Client ID is required')
    // }
    const { firebaseServerApp } = await getAuthenticatedAppForUser()
    const ssrdb = getFirestore(firebaseServerApp)

    const clientsCollection = collection(ssrdb, 'clients')
    const clientDoc = await getDoc(doc(clientsCollection, id))
    console.log("C")
    const client = clientDoc.data() as Client
    console.log("D")
    return client
}

export async function updateClient(id: string, client: Partial<Client>) {
    const { firebaseServerApp } = await getAuthenticatedAppForUser()
    const ssrdb = getFirestore(firebaseServerApp)

    if (ClientSchema.safeParse(client).success === false) {
        throw new Error('Client object is invalid')
    }

    const clientsCollection = collection(ssrdb, 'clients')
    await updateDoc(doc(clientsCollection, id), client)
}

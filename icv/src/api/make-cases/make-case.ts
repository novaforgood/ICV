import { db } from '@/data/firebase'
import { ClientType, ClientSchema } from '@/types/case-types'

import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    updateDoc,
} from 'firebase/firestore'

export async function createClient(client: ClientType) {
    // verify that the client object is valid
    // let results = ClientSchema.optional().safeParse(client)
    // if (results.success === false) {

    //     throw new Error('Client object is invalid ' + JSON.stringify(results))
    // }

    console.log("asdfsdafdsfafdsasdfclient", client)

    const clientsCollection = collection(db, 'clients')
    const newDoc = await addDoc(clientsCollection, client)
    console.log('Case added with ID: ', newDoc.id)
}

export async function getAllClients() {
    const clientsCollection = collection(db, 'clients')
    const clientsSnapshot = await getDocs(clientsCollection)
    const clients = clientsSnapshot.docs.map((doc) => doc.data() as ClientType)
    return clients
}

export async function getClientById(id: string) {
    const clientsCollection = collection(db, 'clients')
    const clientDoc = await getDoc(doc(clientsCollection, id))
    const client = clientDoc.data() as ClientType
    return client
}

export async function updateClient(id: string, client: Partial<ClientType>) {
    if (ClientSchema.safeParse(client).success === false) {
        throw new Error('Client object is invalid')
    }

    const clientsCollection = collection(db, 'clients')
    await updateDoc(doc(clientsCollection, id), client)
}

import { clientDb } from '@/lib/firebase'
import { Client, ClientSchema } from '@/types/client-types'

import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    updateDoc,
} from 'firebase/firestore'

export async function createClient(client: Client) {
    // verify that the client object is valid
    // let results = ClientSchema.optional().safeParse(client)
    // if (results.success === false) {

    //     throw new Error('Client object is invalid ' + JSON.stringify(results))
    // }

    console.log('asdfsdafdsfafdsasdfclient', client)

    const clientsCollection = collection(clientDb, 'clients')
    const newDoc = await addDoc(clientsCollection, client)
    console.log('Case added with ID: ', newDoc.id)
}

export async function getAllClients() {
    const clientsCollection = collection(clientDb, 'clients')
    const clientsSnapshot = await getDocs(clientsCollection)

    const clients = clientsSnapshot.docs.map((doc) => ({
        id: doc.id, // Firebase document ID
        ...doc.data(), // Other client fields
    })) as Client[]

    return clients
}

export async function getClientById(id: string) {
    const clientsCollection = collection(clientDb, 'clients')
    const clientDoc = await getDoc(doc(clientsCollection, id))
    const client = clientDoc.data() as Client
    return client
}

export const updateClient = async (id: string, updatedClientData: Client) => {
    const clientRef = doc(clientDb, "clients", id);
    await updateDoc(clientRef, updatedClientData);
  };

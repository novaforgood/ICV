'use server'
import 'server-only'

import { getAuthenticatedAppForUser } from '@/lib/serverApp'
import { ClientIntakeSchema, NewClient } from '@/types/client-types'
// import 'server-only'

import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    updateDoc,
} from 'firebase/firestore'

export async function createClient(client: NewClient) {
    try {
        const { firebaseServerApp, currentUser } =
            await getAuthenticatedAppForUser()
        if (!currentUser) {
            throw new Error('User not found')
        }
        const ssrdb = getFirestore(firebaseServerApp)

        const clientsCollection = collection(ssrdb, 'clients')
        const newDoc = await addDoc(clientsCollection, client)
        console.log('Case added with ID: ', newDoc.id)
        return newDoc.id
    } catch (error) {
        console.error('Error creating client:', error)
        throw error
    }
}

export async function getAllClients() {
    const { firebaseServerApp, currentUser } =
        await getAuthenticatedAppForUser()
    if (!currentUser) {
        throw new Error('User not found')
    }
    const ssrdb = getFirestore(firebaseServerApp)

    const clientsCollection = collection(ssrdb, 'clients')
    const clientsSnapshot = await getDocs(clientsCollection)
    const clients = clientsSnapshot.docs.map((doc) => doc.data() as NewClient)
    return clients
}

export async function getClientById(id: string) {
    // if (!id) {
    //     return
    //     throw new Error('Client ID is required')
    // }
    const { firebaseServerApp, currentUser } =
        await getAuthenticatedAppForUser()
    if (!currentUser) {
        throw new Error('User not found')
    }
    const ssrdb = getFirestore(firebaseServerApp)

    const clientsCollection = collection(ssrdb, 'clients')
    const clientDoc = await getDoc(doc(clientsCollection, id))
    const client = clientDoc.data() as NewClient
    return client
}

export async function updateClient(id: string, client: Partial<NewClient>) {
    const { firebaseServerApp, currentUser } =
        await getAuthenticatedAppForUser()
    if (!currentUser) {
        throw new Error('User not found')
    }
    const ssrdb = getFirestore(firebaseServerApp)

    if (ClientIntakeSchema.safeParse(client).success === false) {
        throw new Error('Client object is invalid')
    }

    const clientsCollection = collection(ssrdb, 'clients')
    await updateDoc(doc(clientsCollection, id), client)
}

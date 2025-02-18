import { db } from '@/data/firebase'
import { Client } from '@/types/client-types'

import {
    addDoc,
    collection,
    getDocs,
    query,
    where,
    deleteDoc,
    doc,
    getDoc,
    runTransaction,
    setDoc,
    updateDoc
} from 'firebase/firestore'

export async function getAllClients(): Promise<Client[]> {
    const clientsCollection = collection(db, 'clients') // Ensure the collection name is correct
    const clientsSnapshot = await getDocs(clientsCollection)
    const clientsList = clientsSnapshot.docs.map((doc) => doc.data() as Client)
    return clientsList
}

export async function getClientById(id: string) {
    const clientsCollection = collection(db, 'clients')
    const clientDoc = await getDoc(doc(clientsCollection, id))
    const client = clientDoc.data() as Client
    return client
}
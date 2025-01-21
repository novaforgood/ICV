import { db } from '@/data/firebase'
import { addDoc, collection } from 'firebase/firestore'

export async function createNewFirebaseDocument() {
    // Create a new document in the "clients" collection
    const newClient = {
        lastName: 'Doe',
        firstName: 'John',
        dateOfBirth: new Date(),
    }
    const clientsCollection = collection(db, 'clients')
    const newDoc = await addDoc(clientsCollection, newClient)
}

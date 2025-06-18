'use server'
import 'server-only'

import { getAuthenticatedAppForUser } from '@/lib/serverApp'
import { NewHousing } from '@/types/housingStatus-types'

import {
    addDoc,
    collection,
    doc,
    getDocs,
    getFirestore,
    deleteDoc,
    where,
    query,
    orderBy,
} from 'firebase/firestore'

export async function createHousingUpdate(client: NewHousing) {
    try {
        const { firebaseServerApp, currentUser } =
            await getAuthenticatedAppForUser()
        if (!currentUser) {
            throw new Error('User not found')
        }
        const ssrdb = getFirestore(firebaseServerApp)

        const housingCollection = collection(ssrdb, 'housingStatus')
        const newDoc = await addDoc(housingCollection, client)
        console.log('Housing case added with ', newDoc.id)
        return newDoc.id
    } catch (error) {
        console.error('Error creating client:', error)
        throw error
    }
}

export async function getHousingById(id: string) {
    const { firebaseServerApp, currentUser } =
        await getAuthenticatedAppForUser()
    if (!currentUser) {
        throw new Error('User not found')
    }
    const ssrdb = getFirestore(firebaseServerApp)

    const eventsCollection = collection(ssrdb, 'housingStatus')
    const q = query(
        eventsCollection,
        where('clientID', '==', id),
        orderBy('date')
    )

    const querySnapshot = await getDocs(q)

    // Map through documents and include their 'id' along with data
    const statuses = querySnapshot.docs.map((doc) => ({
        docID: doc.id, // Firebase-generated unique ID
        ...doc.data(), // Spread the document data
    }))
    return statuses
}

export async function deleteHousingStatus(docID: string) {
    const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser()
    if (!currentUser) {
        throw new Error('User not found')
    }

    const db = getFirestore(firebaseServerApp)
    const docRef = doc(db, 'housingStatus', docID)

    await deleteDoc(docRef)
}

export async function getAllHousing() {
    const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser()
    if (!currentUser) {
        throw new Error('User not found')
    }
    const ssrdb = getFirestore(firebaseServerApp)

    const housingCollection = collection(ssrdb, 'housingStatus')
    const q = query(housingCollection, orderBy('date'))
    const querySnapshot = await getDocs(q)

    // Map through documents and include their 'id' along with data
    const statuses = querySnapshot.docs.map((doc) => ({
        docID: doc.id,
        ...doc.data(),
    }))
    return statuses
}
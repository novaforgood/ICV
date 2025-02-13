'use server'
import 'server-only'

import { getAuthenticatedAppForUser } from '@/lib/serverApp'
import { CaseEventType } from '@/types/event-types'

import {
    addDoc,
    collection,
    getDocs,
    getFirestore,
    query,
    where,
} from 'firebase/firestore'

export async function createEvent(event: CaseEventType) {
    const { firebaseServerApp } = await getAuthenticatedAppForUser()
    const ssrdb = getFirestore(firebaseServerApp)

    try {
        const eventsCollection = collection(ssrdb, 'events')
        const newDoc = await addDoc(eventsCollection, event)
        console.log('Event added with ID: ', newDoc.id)
    } catch (error) {
        console.error('Error adding event: ', error)
    }
}

export async function getEventsbyClientId(clientId: string) {
    const { firebaseServerApp } = await getAuthenticatedAppForUser()
    const ssrdb = getFirestore(firebaseServerApp)

    const eventsCollection = collection(ssrdb, 'events')
    const q = query(eventsCollection, where('clientId', '==', clientId))
    const querySnapshot = await getDocs(q)
    const events = querySnapshot.docs.map((doc) => doc.data())
    return events
}

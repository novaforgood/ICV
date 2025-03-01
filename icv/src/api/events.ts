'use server'
import 'server-only'

import { getAuthenticatedAppForUser } from '@/lib/serverApp'
import { CaseEventType } from '@/types/event-types'

import {
    addDoc,
    collection,
    getDocs,
    query,
    where,
    getFirestore
} from 'firebase/firestore'

export async function getAllEvents() {
    const { firebaseServerApp, currentUser } =
        await getAuthenticatedAppForUser()
    if (!currentUser) {
        throw new Error('User not found')
    }
    const ssrdb = getFirestore(firebaseServerApp)
    const eventsCollection = collection(ssrdb, 'events')

    const querySnapshot = await getDocs(eventsCollection)
    const events = querySnapshot.docs.map((doc) => {
        const data = doc.data() as CaseEventType
        data.id = doc.id
        return data
    })
    return events
}

export async function getEventsbyClientId(clientId: string) {
    const { firebaseServerApp, currentUser } =
        await getAuthenticatedAppForUser()
    if (!currentUser) {
        throw new Error('User not found')
    }
    const ssrdb = getFirestore(firebaseServerApp)
    const eventsCollection = collection(ssrdb, 'events')

    const q = query(eventsCollection, where('clientId', '==', clientId))
    const querySnapshot = await getDocs(q)
    const events = querySnapshot.docs.map((doc) => {
        const data = doc.data() as CaseEventType
        data.id = doc.id
        return data
    })    
    return events
}
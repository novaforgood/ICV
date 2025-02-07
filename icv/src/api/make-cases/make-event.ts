import { clientDb } from '@/lib/firebase'
import { CaseEventType } from '@/types/event-types'

import { addDoc, collection, getDocs, query, where } from 'firebase/firestore'

export async function createEvent(event: CaseEventType) {
    try {
        const eventsCollection = collection(clientDb, 'events')
        const newDoc = await addDoc(eventsCollection, event)
        console.log('Event added with ID: ', newDoc.id)
    } catch (error) {
        console.error('Error adding event: ', error)
    }
}

export async function getEventsbyClientId(clientId: string) {
    const eventsCollection = collection(clientDb, 'events')
    const q = query(eventsCollection, where('clientId', '==', clientId))
    const querySnapshot = await getDocs(q)
    const events = querySnapshot.docs.map((doc) => doc.data())
    return events
}

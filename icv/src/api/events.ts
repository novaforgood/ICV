import { db } from '@/data/firebase'
import { CaseEventType } from '@/types/event-types'

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

export async function getAllEvents() {
    const eventsCollection = collection(clientDb, 'events')
    const querySnapshot = await getDocs(eventsCollection)
    const events = querySnapshot.docs.map((doc) => doc.data() as CaseEventType)
    return events
}

export async function getEventsbyClientId(clientId: string) {
    const eventsCollection = collection(clientDb, 'events')
    const q = query(eventsCollection, where('clientId', '==', clientId))
    const querySnapshot = await getDocs(q)
    const events = querySnapshot.docs.map((doc) => doc.data())
    return events
}
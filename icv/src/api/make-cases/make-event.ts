import { db } from '@/data/firebase'
import { CaseEventType } from '@/types/event-types'

import {
    addDoc,
    collection,
    getDocs,
    query,
    where,
    doc,
    updateDoc,
    deleteDoc
} from 'firebase/firestore'

export async function createEvent(event: CaseEventType) {
    try {
    const eventsCollection = collection(db, 'events')
    const newDoc = await addDoc(eventsCollection, event)
    console.log('Event added with ID: ', newDoc.id)
    } catch(error) {
        console.error("Error adding event: ", error);
    }
}

export async function getEventsbyClientId(clientId: string) {
    const eventsCollection = collection(db, 'events')
    const q = query(eventsCollection, where('clientId', '==', clientId))
    const querySnapshot = await getDocs(q);
    
    // Map through documents and include their 'id' along with data
    const events = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Firebase-generated unique ID
        ...doc.data() // Spread the document data
    }));
    return events
}

export async function updateEvent(id: string, updatedEvent: CaseEventType) {
    const eventRef = doc(db, "events", id);
    await updateDoc(eventRef, updatedEvent)
}

export async function deleteEvent(eventId: string) {
    try {
        // Reference to the specific event document in the 'events' collection
        const eventRef = doc(db, 'events', eventId)
        
        // Delete the event document from Firestore
        await deleteDoc(eventRef)
        
        console.log(`Event with ID ${eventId} successfully deleted`)
    } catch (error) {
        console.error('Error deleting event:', error)
        throw new Error('Failed to delete event')
    }
}

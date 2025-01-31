import { clientDb } from '@/lib/firebase'
import { CaseEventType } from '@/types/event-types'

import {
    addDoc,
    collection,
    getDocs,
    query,
    where,
    orderBy,
    doc,
    getDoc,
    setDoc,
    updateDoc
} from 'firebase/firestore'

export async function createEvent(event: CaseEventType) {
    try {
    const eventsCollection = collection(db, 'events')
    const newDoc = await addDoc(eventsCollection, event)

    await updateContactTypeCount(event.contactType);

    console.log('Event added with ID: ', newDoc.id)
    } catch(error) {
        console.error("Error adding event: ", error);
    }
}


async function updateContactTypeCount(contactType: string) {
    const contactTypeCountDocRef = doc(db, 'events', 'contactTypeCount');

    try {
        const docSnapshot = await getDoc(contactTypeCountDocRef);

        if (docSnapshot.exists()) {
            // If document exists, update the count
            const data = docSnapshot.data();
            const currentCount = data[contactType] || 0;

            await updateDoc(contactTypeCountDocRef, {
                [contactType]: currentCount + 1
            });
        } else {
            // If document doesn't exist, create it
            await setDoc(contactTypeCountDocRef, {
                [contactType]: 1
            });
        }
    } catch (error) {
        console.error("Error updating contact type count: ", error);
    }
}

export async function getEventsbyClientId(clientId: string) {
    const eventsCollection = collection(clientDb, 'events')
    const q = query(eventsCollection, where('clientId', '==', clientId))
    const querySnapshot = await getDocs(q)
    const events = querySnapshot.docs.map((doc) => doc.data())
    return events
}

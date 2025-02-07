import { clientDb } from '@/lib/firebase'
import { CaseEventType } from '@/types/event-types'
import {
    addDoc,
    collection,
    doc,
    getDoc,
    runTransaction,
    setDoc,
    updateDoc
} from 'firebase/firestore'

export async function createEvent(event: CaseEventType) {
    const eventsCollection = collection(clientDb, 'events')
    const contactTypeCountDocRef = doc(clientDb, 'events', 'contactTypeCount')

    try {
        // Start the transaction to ensure atomicity
        await runTransaction(clientDb, async (transaction) => {
            // Get the current contactTypeCount document
            const docSnapshot = await transaction.get(contactTypeCountDocRef)

            // If the contactTypeCount document exists, update the count
            if (docSnapshot.exists()) {
                const data = docSnapshot.data()
                const currentCount = data[event.contactType] || 0

                // Update the contactTypeCount in the same transaction
                transaction.update(contactTypeCountDocRef, {
                    [event.contactType]: currentCount + 1
                })
            } else {
                // If the document doesn't exist, create it with initial count for the contactType
                transaction.set(contactTypeCountDocRef, {
                    [event.contactType]: 1
                })
            }

            // Add the new event to the events collection as part of the same transaction
            const newEventRef = doc(eventsCollection)
            transaction.set(newEventRef, event)
        })

        console.log('Event added and contact type count updated successfully')
    } catch (error) {
        console.error("Error adding event and updating contact type count: ", error)
    }
}

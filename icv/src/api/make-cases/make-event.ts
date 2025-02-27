'use server'
import 'server-only'

import { getAuthenticatedAppForUser } from '@/lib/serverApp'
import { CaseEventType } from '@/types/event-types'
import { db } from '@/data/firebase'

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

export async function createEvent(event: CaseEventType) {
    const eventsCollection = collection(db, 'events')
    const contactTypeCountDocRef = doc(db, 'events', 'contactTypeCount')

    try {
        // Start the transaction to ensure atomicity
        await runTransaction(db, async (transaction) => {
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

export async function deleteEvent(eventId: string) {
    const eventRef = doc(clientDb, 'events', eventId)
    const contactTypeCountDocRef = doc(clientDb, 'events', 'contactTypeCount')

    try {
        // Run the transaction to ensure atomicity
        await runTransaction(clientDb, async (transaction) => {
            // Get the event data to determine the contact type
            const eventSnapshot = await transaction.get(eventRef)

            if (!eventSnapshot.exists()) {
                throw new Error('Event not found')
            }

            const eventData = eventSnapshot.data()
            const contactType = eventData?.contactType

            // Only proceed if the contactType exists in the event
            if (!contactType) {
                throw new Error('Event does not have a contact type')
            }

            // Decrement the contact type count in the contactTypeCount document
            const docSnapshot = await transaction.get(contactTypeCountDocRef)
            if (docSnapshot.exists()) {
                const data = docSnapshot.data()
                const currentCount = data[contactType] || 0

                // Only decrement if there's a count > 0
                if (currentCount > 0) {
                    transaction.update(contactTypeCountDocRef, {
                        [contactType]: currentCount - 1
                    })
                }
            }

            // Delete the event document as part of the transaction
            transaction.delete(eventRef)
        })

        console.log(`Event with ID ${eventId} successfully deleted`)
    } catch (error) {
        console.error('Error deleting event:', error)
        throw new Error('Failed to delete event')
    }
}


export async function updateEvent(id: string, updatedEvent: CaseEventType) {
    const eventRef = doc(clientDb, 'events', id)
    const contactTypeCountDocRef = doc(clientDb, 'events', 'contactTypeCount')

    try {
        // Run the transaction to ensure atomicity
        await runTransaction(clientDb, async (transaction) => {
            // Get the current event data to check the old contact type
            const eventSnapshot = await transaction.get(eventRef)

            if (!eventSnapshot.exists()) {
                throw new Error('Event not found')
            }

            const oldEventData = eventSnapshot.data()
            const oldContactType = oldEventData?.contactType

            // Get the new contact type from the updated event
            const newContactType = updatedEvent.contactType

            // Only update the counts if the contact type has changed
            if (oldContactType !== newContactType) {
                // Decrement the old contact type count
                if (oldContactType) {
                    const docSnapshot = await transaction.get(contactTypeCountDocRef)
                    if (docSnapshot.exists()) {
                        const data = docSnapshot.data()
                        const currentCount = data[oldContactType] || 0

                        // Only decrement if there's a count > 0
                        if (currentCount > 0) {
                            transaction.update(contactTypeCountDocRef, {
                                [oldContactType]: currentCount - 1
                            })
                        }
                    }
                }

                // Increment the new contact type count
                const docSnapshot = await transaction.get(contactTypeCountDocRef)
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data()
                    const currentCount = data[newContactType] || 0
                    transaction.update(contactTypeCountDocRef, {
                        [newContactType]: currentCount + 1
                    })
                }
            }

            // Update the event document in the 'events' collection
            transaction.update(eventRef, updatedEvent)
        })

        console.log(`Event with ID ${id} successfully updated`)
    } catch (error) {
        console.error('Error updating event:', error)
        throw new Error('Failed to update event')
    }
}

export async function getEventsbyClientId(clientId: string) {
    const eventsCollection = collection(clientDb, 'events')
    const q = query(eventsCollection, where('clientId', '==', clientId))
    const querySnapshot = await getDocs(q);
    
    // Map through documents and include their 'id' along with data
    const events = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Firebase-generated unique ID
        ...doc.data() // Spread the document data
    }));
    return events
}
'use server'
import 'server-only'

import { getAuthenticatedAppForUser } from '@/lib/serverApp'
import { CheckInCategoryType, CheckInType } from '@/types/event-types'
import { CheckInCategory } from '@/types/event-types'

import {
    addDoc,
    collection,
    getDocs,
    query,
    where,
    getFirestore,
    doc,
    getDoc,
    updateDoc,
    setDoc,
    increment
} from 'firebase/firestore'
import { get } from 'http'
import { utcToZonedTime, format } from 'date-fns-tz';
const timeZone = 'America/Los_Angeles';

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
        const data = doc.data() as CheckInType
        data.id = doc.id
        return data
    })
    
    // Helper function to convert a timestamp to an ISO string
    const convertTimestamp = (timestamp: any) => {
        if (timestamp && typeof timestamp === 'object' && 'seconds' in timestamp) {
            return new Date(timestamp.seconds * 1000).toISOString()
        }
        return timestamp
    }

    // Map events and convert timestamp fields to strings
    return events.map((event: any) => ({
        ...event,
        startTime: convertTimestamp(event.startTime),
        endTime: convertTimestamp(event.endTime)
    }))

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
        const data = doc.data() as CheckInType
        data.id = doc.id
        return data
    })    
    return events
}

// Helper function to convert a Firebase timestamp or ISO string into a Date object
function parseTimestamp(timestamp: any) {
    if (typeof timestamp === 'object') {
        //if firebase timpestamp
        return timestamp.toDate();
    } else if (typeof timestamp === 'string') {
        // ISO string case
        return new Date(timestamp + ' GMT-0800'); // Convert to PST
    }
}
  
export async function getScheduledEvents(): Promise<CheckInType[]> {
    // Retrieve all events using the existing API function
    const events = await getAllEvents();

    // Filter events to only those where the scheduled field is true
    const scheduledEvents = events.filter((event) => event.scheduled === true);

    // Parse the timestamp fields into Date objects, if necessary
    const parsedEvents = scheduledEvents.map((event) => ({
        ...event,
        startTime: parseTimestamp(event.startTime),
        endTime: event.endTime ? parseTimestamp(event.endTime) : undefined,
    }));

return parsedEvents;
}

export async function createCheckIn(event: CheckInType) {
    const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
    if (!currentUser) {
        throw new Error('User not found');
    }
    const ssrdb = getFirestore(firebaseServerApp);

    try {
        const eventsCollection = collection(ssrdb, 'events');
        const eventPayload = {
            ...event,
            // Convert and format startTime in PST
            startTime: event.startTime.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }),
            // Convert endTime to ISO string in PST only if provided
            endTime: event.endTime ? event.endTime.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }) : undefined,

        };
        const newDoc = await addDoc(eventsCollection, eventPayload);
        console.log('Event added with ID:', newDoc.id);

        await incrementCheckInCount(event.category, new Date(event.startTime));

        return newDoc.id;
    } catch (error) {
        console.error('Error adding check in:', error);
        throw new Error('Failed to add check in');
    }
}

export async function incrementCheckInCount(checkInCategory: CheckInCategoryType, date: Date) {
    const { firebaseServerApp, currentUser } =
        await getAuthenticatedAppForUser()
    if (!currentUser) {
        throw new Error('User not found')
    }
    const ssrdb = getFirestore(firebaseServerApp)

    try {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const counterDocId = `${year}-${month}`
        const counterDocRef = doc(ssrdb, 'checkInCounter', counterDocId)
        const counterDoc = await getDoc(counterDocRef)

        if (counterDoc.exists()) {
            await updateDoc(counterDocRef, {
                [checkInCategory]: increment(1)
            })
        } else {
            await setDoc(counterDocRef, {
                [checkInCategory]: 1
            })
        }
    } catch (error) {
        console.error('Error updating check-in count:', error)
        throw new Error('Failed to update check-in count')
    }
}

export async function getCheckInCount(checkInCategory: CheckInCategoryType, date: Date) {
    const { firebaseServerApp, currentUser } =
    await getAuthenticatedAppForUser()
    if (!currentUser) {
        throw new Error('User not found')
    }
    const ssrdb = getFirestore(firebaseServerApp)

    try {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const counterDocId = `${year}-${month}`
        const counterDocRef = doc(ssrdb, 'checkInCounter', counterDocId)
        const counterDoc = await getDoc(counterDocRef)

        if (counterDoc.exists()) {
            const data = counterDoc.data()
            return data[checkInCategory] || 0 // Default to 0 if undefined
        } else {
            return 0
        }
    } catch (error) {
        console.error('Error getting check-in count:', error)
        throw new Error('Failed to get check-in count')
    }
}

export async function updateCaseNotes(eventId: string, newCaseNotes: string): Promise<void> {
    const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
    if (!currentUser) {
        throw new Error('User not found');
    }
    const ssrdb = getFirestore(firebaseServerApp);
    try {
        const eventDocRef = doc(ssrdb, 'events', eventId);
        await updateDoc(eventDocRef, {
            caseNotes: newCaseNotes
        });
        console.log(`Case notes updated for event ID: ${eventId}`);
    } catch (error) {
        console.error('Error updating case notes:', error);
        throw new Error('Failed to update case notes');
    }
}
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
    console.log('trying to add event1:', event);

    try {
        const eventsCollection = collection(ssrdb, 'events');
        const newDoc = await addDoc(eventsCollection, event);
        console.log('Event added with ID:', newDoc.id);

        await incrementCheckInCount(event.category, new Date(event.startTime));

        return newDoc.id;
    } catch (error) {
        console.error('Error adding check in:', error);
        throw new Error('Failed to add check in', { cause: error });
    }
}

export async function incrementCheckInCount(checkInCategory: CheckInCategoryType, date: Date, count: number = 1) {
    const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
    if (!currentUser) {
        throw new Error('User not found');
    }
    const ssrdb = getFirestore(firebaseServerApp);

    try {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const counterDocId = `${year}-${month}`;
        console.log(`Debug: year = ${year}, month = ${month}, counterDocId = ${counterDocId}`);
        
        const counterDocRef = doc(ssrdb, 'checkInCounter', counterDocId);
        const counterDoc = await getDoc(counterDocRef);
        const day = date.getDate().toString();
        console.log(`Debug: day = ${day}`);

        if (counterDoc.exists()) {
            const data = counterDoc.data();
            console.log('Debug: Existing counter doc data:', data);
            
            if (day in data) {
                console.log(`Debug: Found existing day "${day}" in doc. Incrementing ${checkInCategory} by ${count}`);
                await updateDoc(counterDocRef, {
                    [`${day}.${checkInCategory}`]: increment(count)
                });
                console.log(`Debug: Successfully updated ${day}.${checkInCategory}`);
            } else {
                console.log(`Debug: Day "${day}" not found in doc. Creating counterMap.`);
                await updateDoc(counterDocRef, {
                    [`${day}`]: {
                        "Hot Meal": checkInCategory == 'Hot Meal' ? 1 : 0,
                        "Hygiene Kit": checkInCategory == 'Hygiene Kit' ? 1 : 0,
                        "Snack Pack": checkInCategory == 'Snack Pack' ? 1 : 0
                    }
                });
                console.log('Debug: New counterMap created.');
            }

            await updateDoc(counterDocRef, {
                [`${checkInCategory}`]: increment(count)
            });
        } else {
            console.log('Debug: Counter document does not exist.');
            // Optionally, you can create the document here using setDoc
            // For example:
            // await setDoc(counterDocRef, { counterMap: { ... } });
        }

        
    } catch (error) {
        console.error('Error updating check-in count:', error);
        throw new Error('Failed to update check-in count', { cause: error });
    }
}

export async function getCheckInCountYear(checkInCategory: CheckInCategoryType, date: Date) {
    const { firebaseServerApp, currentUser } =
    await getAuthenticatedAppForUser()
    if (!currentUser) {
        throw new Error('User not found')
    }
    const ssrdb = getFirestore(firebaseServerApp)

    try {
        let sum = 0
        const year = date.getFullYear()
        for (let i = 1; i <= 12; i++) {
            const month = String(i).padStart(2, '0')
            const counterDocId = `${year}-${month}`
            const counterDocRef = doc(ssrdb, 'checkInCounter', counterDocId)
            const counterDoc = await getDoc(counterDocRef)

            if (counterDoc.exists()) {
                console.log(`Counter document ${counterDocId} exists with data ${counterDoc.data()}`)
                sum += counterDoc.data()[checkInCategory] || 0
            }
        }

        return sum;
    } catch (error) {
        console.error('Error getting check-in count:', error)
        throw new Error('Failed to get check-in count')
    }
}

export async function getCheckInCountMonth(checkInCategory: CheckInCategoryType, date: Date) {
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
            return counterDoc.data()[checkInCategory] || 0
        } else {
            return 0
        }
    } catch (error) {
        console.error('Error getting check-in count:', error)
        throw new Error('Failed to get check-in count')
    }
}

export async function getCheckInCountDay(checkInCategory: CheckInCategoryType, date: Date) {
    const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
    if (!currentUser) {
        console.error('getCheckInCountDay: User not found');
        throw new Error('User not found');
    }
    const ssrdb = getFirestore(firebaseServerApp);

    try {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const counterDocId = `${year}-${month}`;
        console.log(`getCheckInCountDay: year = ${year}, month = ${month}, counterDocId = ${counterDocId}`);

        const counterDocRef = doc(ssrdb, 'checkInCounter', counterDocId);
        const counterDoc = await getDoc(counterDocRef);
        const day = date.getDate().toString();
        console.log(`getCheckInCountDay: day = ${day}`);

        if (counterDoc.exists()) {
            const data = counterDoc.data();
            console.log('getCheckInCountDay: Counter doc data:', data);
            const fieldKey = `${day}`;
            console.log(`getCheckInCountDay: Looking for fieldKey: ${fieldKey}`);
            
            if (fieldKey in data) {
                const countValue = data[fieldKey][checkInCategory];
                console.log(`getCheckInCountDay: Found count for ${fieldKey}: ${countValue}`);
                return countValue;
            } else {
                console.log(`getCheckInCountDay: Field ${fieldKey} not found. Returning 0.`);
                return 0;
            }
        } else {
            console.log('getCheckInCountDay: Counter document does not exist. Returning 0.');
            return 0;
        }
    } catch (error) {
        console.error('Error getting check-in count:', error);
        throw new Error('Failed to get check-in count');
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
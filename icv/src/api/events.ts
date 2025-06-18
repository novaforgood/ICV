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
    deleteDoc,
    increment,
    sum,
    getAggregateFromServer,
    documentId
} from 'firebase/firestore'
const timeZone = 'America/Los_Angeles';

export async function getAllEvents() {
    const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser()
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
    const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser()
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

export async function getScheduledEvents(): Promise<CheckInType[]> {
    const events = await getAllEvents();
    const scheduledEvents = events.filter((event) => event.scheduled === true);
    return scheduledEvents;
}

export async function getMyScheduledEvents(assigneeId: string): Promise<CheckInType[]> {
    const events = await getAllEvents();
    const scheduledEvents = events.filter((event) => event.scheduled === true && event.assigneeId === assigneeId);
    return scheduledEvents;
}

export async function createCheckIn(event: CheckInType) {
    const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
    if (!currentUser) {
        throw new Error('User not found');
    }
    const ssrdb = getFirestore(firebaseServerApp);
    try {
        const eventsCollection = collection(ssrdb, 'events');
        const newDoc = await addDoc(eventsCollection, event);
        return newDoc.id;
    } catch (error) {
        console.error('Error adding check in:', error);
        throw new Error('Failed to add check in', { cause: error });
    }
}

export async function updateCheckIn(event: CheckInType) {
    const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
    if (!currentUser) {
        throw new Error('User not found');
    }
    const ssrdb = getFirestore(firebaseServerApp);

    if (!event.id) {
        throw new Error('Event ID is required for update')
    }

    try {
        const eventDocRef = doc(ssrdb, 'events', event.id)
        await updateDoc(eventDocRef, { ...event })

        return event.id
    } catch (error) {
        console.error('Error updating check in:', error)
        throw new Error('Failed to update check in', { cause: error })
    }
}

export async function deleteCheckIn(checkInId: string): Promise<void> {
    const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser()
    if (!currentUser) {
        throw new Error('User not found')
    }

    const db = getFirestore(firebaseServerApp)
    const docRef = doc(db, 'events', checkInId)

    try {
        await deleteDoc(docRef)
        console.log(`Deleted check-in: ${checkInId}`)
    } catch (error) {
        console.error('Error deleting check-in:', error)
        throw new Error('Failed to delete check-in', { cause: error })
    }
}

export async function incrementCheckInCount(checkInCategory: CheckInCategoryType, date: Date, count: number = 1) {
    const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
    if (!currentUser) {
        throw new Error('User not found');
    }
    const ssrdb = getFirestore(firebaseServerApp);

    let updated = false;

    try {
        const dayDocRef = doc(ssrdb, 'checkInCounter', 'day');
        const dayDoc = await getDoc(dayDocRef);
        const dateString = date.toDateString();

        if (dayDoc.exists() && dayDoc.data()['date'] == dateString) {
            if (dayDoc.data()[checkInCategory] + count >= 0) {
                await updateDoc(dayDocRef, {
                    [`${checkInCategory}`]: increment(count)
                });
                updated = true;
            }
        } else if (count >= 0) {
            await setDoc(dayDocRef, {
                "date": dateString,
                "Hot Meal": checkInCategory === 'Hot Meal' ? count : 0,
                "Hygiene Kit": checkInCategory === 'Hygiene Kit' ? count : 0,
                "Snack Pack": checkInCategory === 'Snack Pack' ? count : 0
            });
            updated = true;
        }

        if (updated) {
            console.log('day update success');
        }

        if (updated) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const monthDocId = `${year}-${month}`;
            const monthDocRef = doc(ssrdb, 'checkInCounter', monthDocId);
            const monthDoc = await getDoc(monthDocRef);

            if (monthDoc.exists()) {
                await updateDoc(monthDocRef, {
                    [`${checkInCategory}`]: increment(count)
                });
            } else {
                await setDoc(monthDocRef, {
                    "Hot Meal": checkInCategory === 'Hot Meal' ? count : 0,
                    "Hygiene Kit": checkInCategory === 'Hygiene Kit' ? count : 0,
                    "Snack Pack": checkInCategory === 'Snack Pack' ? count : 0
                });
            }

            console.log('month update');
        }
    } catch (error) {
        console.error('Error updating check-in count:', error);
        throw new Error('Failed to update check-in count', { cause: error });
    }

    return updated;
}

export async function getCheckInCountYear(checkInCategory: CheckInCategoryType, date: Date) {
    const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
    if (!currentUser) {
        throw new Error('User not found');
    }
    const ssrdb = getFirestore(firebaseServerApp);

    try {
        const yearStr = date.getFullYear();
        const year = `${yearStr}-`;

        const counterCollectionRef = collection(ssrdb, 'checkInCounter');
        let sum = 0;

        for (let i = 1; i < 12; i++) {
            const month = String(i + 1).padStart(2, '0');
            const monthDocId = `${yearStr}-${month}`;
            const monthDocRef = doc(counterCollectionRef, monthDocId);
            const monthDoc = await getDoc(monthDocRef);
            if (monthDoc.exists()) {
                sum += monthDoc.data()[checkInCategory] || 0;
            }
        }

        return sum;
    } catch (error) {
        console.error('Error getting check-in count:', error);
        throw new Error('Failed to get check-in count');
    }
}

export async function getCheckInCountMonth(checkInCategory: CheckInCategoryType, date: Date) {
    const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
    if (!currentUser) {
        throw new Error('User not found');
    }
    const ssrdb = getFirestore(firebaseServerApp);
    try {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const counterDocId = `${year}-${month}`;
        const counterDocRef = doc(ssrdb, 'checkInCounter', counterDocId);
        const counterDoc = await getDoc(counterDocRef);
        if (counterDoc.exists()) {
            return counterDoc.data()[checkInCategory] || 0;
        } else {
            return 0;
        }
    } catch (error) {
        console.error('Error getting check-in count:', error);
        throw new Error('Failed to get check-in count');
    }
}

export async function getCheckInCountDay(checkInCategory: CheckInCategoryType, date: Date) {
    const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
    if (!currentUser) {
        throw new Error('User not found');
    }
    const ssrdb = getFirestore(firebaseServerApp);
    try {
        const dateString = date.toDateString();
        const dayDocRef = doc(ssrdb, 'checkInCounter', 'day');
        const dayDoc = await getDoc(dayDocRef);

        if (dayDoc.exists() && dayDoc.data()['date'] === dateString) {
            return dayDoc.data()[checkInCategory] || 0;
        } else {
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
    } catch (error) {
        console.error('Error updating case notes:', error);
        throw new Error('Failed to update case notes');
    }
}

export async function getAllCheckInCounts(date: Date) {
    const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser()
    if (!currentUser) throw new Error('User not found')
    const ssrdb = getFirestore(firebaseServerApp)

    const yearStr = date.getFullYear()
    const monthStr = String(date.getMonth() + 1).padStart(2, '0')
    const dateString = date.toDateString()

    const dayDocRef = doc(ssrdb, 'checkInCounter', 'day')
    const monthDocRef = doc(ssrdb, 'checkInCounter', `${yearStr}-${monthStr}`)

    const monthIds = Array.from({ length: 12 }, (_, i) =>
        doc(ssrdb, 'checkInCounter', `${yearStr}-${String(i + 1).padStart(2, '0')}`)
    )

    const [dayDoc, monthDoc, ...yearDocs] = await Promise.all([
        getDoc(dayDocRef),
        getDoc(monthDocRef),
        ...monthIds.map((ref) => getDoc(ref)),
    ])

    const categories: CheckInCategoryType[] = ['Hot Meal', 'Hygiene Kit', 'Snack Pack']

    const counts = {
        day: Object.fromEntries(
            categories.map((cat) => [
                cat,
                dayDoc.exists() && dayDoc.data().date === dateString
                    ? dayDoc.data()[cat] || 0
                    : 0,
            ])
        ),
        month: Object.fromEntries(
            categories.map((cat) => [
                cat,
                monthDoc.exists() ? monthDoc.data()[cat] || 0 : 0,
            ])
        ),
        year: Object.fromEntries(
            categories.map((cat) => [
                cat,
                yearDocs.reduce(
                    (sum, doc) =>
                        sum + (doc.exists() ? doc.data()[cat] || 0 : 0),
                    0
                ),
            ])
        ),
    }

    return counts
}

export async function getEventById(eventId: string): Promise<CheckInType> {
    const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser()
    if (!currentUser) {
        throw new Error('User not found')
    }
    const ssrdb = getFirestore(firebaseServerApp)
    const eventDoc = await getDoc(doc(ssrdb, 'events', eventId))

    if (!eventDoc.exists()) {
        throw new Error('Event not found')
    }

    const eventData = eventDoc.data() as CheckInType
    eventData.id = eventDoc.id
    return eventData
}

export async function getLastCheckInDate(clientDocId: string): Promise<Date | null> {
    const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
    if (!currentUser) {
        throw new Error('User not found');
    }
    const ssrdb = getFirestore(firebaseServerApp);

    try {
        const eventsCollection = collection(ssrdb, 'events');
        const now = new Date();

        // Query for events with matching clientDocId
        const q = query(
            eventsCollection,
            where('clientDocId', '==', clientDocId)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null;
        }

        // Convert all events to array
        const allEvents = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        })) as (CheckInType & { id: string })[];

        // Filter for past events
        const pastEvents = allEvents.filter(event => {
            const eventDate = new Date(event.startTime);
            return !isNaN(eventDate.getTime()) && eventDate < now;
        });

        if (pastEvents.length === 0) {
            return null;
        }

        // Sort events by startTime in descending order (most recent first)
        const sortedEvents = pastEvents.sort((a, b) => {
            const dateA = new Date(a.startTime);
            const dateB = new Date(b.startTime);
            return dateB.getTime() - dateA.getTime();
        });

        // Get the most recent past event's startTime
        console.log('most recent:', clientDocId, sortedEvents[0]);
        const mostRecentEvent = sortedEvents[0];
        return new Date(mostRecentEvent.startTime);
    } catch (error) {
        console.error('Error getting last check-in date:', error);
        throw new Error('Failed to get last check-in date');
    }
}



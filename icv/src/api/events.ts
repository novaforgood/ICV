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

export async function getScheduledEvents(): Promise<CheckInType[]> {
    // Retrieve all events using the existing API function
    const events = await getAllEvents();
    
    // Filter events to only those where the scheduled field is true
    const scheduledEvents = events.filter((event) => event.scheduled === true);
    
    return scheduledEvents;
}

export async function createScheduledCheckIn(event: CheckInType) {
    const { firebaseServerApp, currentUser } =
        await getAuthenticatedAppForUser()
    if (!currentUser) {
        throw new Error('User not found')
    }
    const ssrdb = getFirestore(firebaseServerApp)

    try {
        const eventsCollection = collection(ssrdb, 'events')
        const newDoc = await addDoc(eventsCollection, event)
        console.log('Event added with ID: ', newDoc.id)

        await incrementCheckInCount(event.category, event.startTime)
    } catch (error) {
        console.error('Error adding check in:', error)
        throw new Error('Failed to add check in')
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

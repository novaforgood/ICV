'use server'
import 'server-only'

import { getAuthenticatedAppForUser } from '@/lib/serverApp'
import { NewHousing } from '@/types/housingStatus-types'

import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    updateDoc,
} from 'firebase/firestore'

export async function createHousingUpdate(client: NewHousing) {
    try {
        const { firebaseServerApp, currentUser } =
            await getAuthenticatedAppForUser()
        if (!currentUser) {
            throw new Error('User not found')
        }
        const ssrdb = getFirestore(firebaseServerApp)
  
        const housingCollection = collection(ssrdb, 'housingStatus')
        const newDoc = await addDoc(housingCollection, client)
        console.log('Housing case added with ', newDoc.id)
        return newDoc.id
    } catch (error) {
        console.error('Error creating client:', error)
        throw error
    }
  }
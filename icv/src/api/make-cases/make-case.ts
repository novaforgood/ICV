'use server'
import 'server-only'

import { getAuthenticatedAppForUser } from '@/lib/serverApp'
import { ClientIntakeSchema, NewClient } from '@/types/client-types'
import { TypeOf } from 'zod'
// import 'server-only'

type ClientType = TypeOf<typeof ClientIntakeSchema>

import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    updateDoc,
} from 'firebase/firestore'

export async function createClient(client: NewClient) {
  try {
      const { firebaseServerApp, currentUser } =
          await getAuthenticatedAppForUser()
      if (!currentUser) {
          throw new Error('User not found')
      }
      const ssrdb = getFirestore(firebaseServerApp)

      const clientsCollection = collection(ssrdb, 'clients')
      const newDoc = await addDoc(clientsCollection, client)
      console.log('Case added with ID: ', newDoc.id)
      return newDoc.id
  } catch (error) {
      console.error('Error creating client:', error)
      throw error
  }
}

export async function getAllClients() {
    const { firebaseServerApp, currentUser } =
        await getAuthenticatedAppForUser()
    if (!currentUser) {
        throw new Error('User not found')
    }
    const ssrdb = getFirestore(firebaseServerApp)

    const clientsCollection = collection(ssrdb, 'clients')
    const clientsSnapshot = await getDocs(clientsCollection)
    const clients = clientsSnapshot.docs.map((doc) => doc.data() as NewClient)
    return clients
}

export async function getClientById(id: string) {
    // if (!id) {
    //     return
    //     throw new Error('Client ID is required')
    // }
    const { firebaseServerApp, currentUser } =
        await getAuthenticatedAppForUser()
    if (!currentUser) {
        throw new Error('User not found')
    }
    const ssrdb = getFirestore(firebaseServerApp)

    const clientsCollection = collection(ssrdb, 'clients')
    const clientDoc = await getDoc(doc(clientsCollection, id))
    const client = clientDoc.data() as NewClient
    return client
}

function isDifferent(a: any, b: any): boolean {
    return JSON.stringify(a ?? null) !== JSON.stringify(b ?? null)
  }

export async function updateClient(id: string, updated: Partial<NewClient>) {
    console.log("UPDATING CLIENT")
    const { firebaseServerApp, currentUser } =
      await getAuthenticatedAppForUser()
    if (!currentUser) throw new Error('User not found')
  
    const ssrdb = getFirestore(firebaseServerApp)
    const clientRef = doc(collection(ssrdb, 'clients'), id)
  
    const existingSnap = await getDoc(clientRef)
    if (!existingSnap.exists()) throw new Error('Client not found')
  
    const existing = existingSnap.data() as NewClient
  
    const changedFields: Partial<Record<keyof NewClient, any>> = {}
  
    for (const key in updated) {
      const newVal = updated[key as keyof NewClient]
      const oldVal = existing[key as keyof NewClient]
  
      if (isDifferent(newVal, oldVal)) {
        changedFields[key as keyof NewClient] = newVal
      }
    }


    if (Object.keys(changedFields).length === 0) {
      console.log(`[updateClient] No changes for ${id}, skipping update.`)
      return
    }
    await updateDoc(clientRef, changedFields)
    console.log(`[updateClient] Updated fields for ${id}:`, changedFields)
  }

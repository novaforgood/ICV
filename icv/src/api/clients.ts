'use server'
import 'server-only'

import { getAuthenticatedAppForUser } from '@/lib/serverApp'
import { NewClient } from '@/types/client-types'
import  {UserSchema, Users} from '@/types/user-types'
import { collection, getDoc, getDocs, getFirestore, doc } from 'firebase/firestore'
import { User } from 'firebase/auth'

export async function getAllClients(): Promise<NewClient[]> {
    const { firebaseServerApp, currentUser } =
        await getAuthenticatedAppForUser()
    if (!currentUser) {
        throw new Error('User not found')
    }
    const ssrdb = getFirestore(firebaseServerApp)

    const clientsCollection = collection(ssrdb, 'clients') 
    const clientsSnapshot = await getDocs(clientsCollection)
    const clientsList = clientsSnapshot.docs.map((doc) => {//returns array of client objects by applying arrow function to docs snapshot
        const data = doc.data() as NewClient
        data.id = doc.id
        return data
    })
    return clientsList
}

export async function getAllUsers():  Promise<Users[]> {
    const { firebaseServerApp, currentUser } =
        await getAuthenticatedAppForUser()
    if (!currentUser) {
        throw new Error('User not found')
    }
    const ssrdb = getFirestore(firebaseServerApp)

    const userCollection = collection(ssrdb, 'users')
    const usersSnapshot = await getDocs(userCollection)
    const userList = usersSnapshot.docs.map((doc) => {
        const data = doc.data() as Users
        return {
            id: doc.id,
            ...data
        }
    })
    return userList
}

export async function getClientById(id: string) {
    const { firebaseServerApp, currentUser } =
        await getAuthenticatedAppForUser()
    if (!currentUser) {
        throw new Error('User not found')
    }
    const ssrdb = getFirestore(firebaseServerApp)

    const clientsCollection = collection(ssrdb, 'clients')
    const clientDoc = await getDoc(doc(clientsCollection, id))
    const client = clientDoc.data() as NewClient
    client.id = clientDoc.id
    return client
}
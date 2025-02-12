'use server'
import 'server-only'

import { getAuthenticatedAppForUser } from '@/lib/serverApp'
import { Dog, DogSchema } from '@/types/example-types'
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    updateDoc,
} from 'firebase/firestore'

export async function createDog(dog: Dog) {
    // verify that the user is logged in

    const { firebaseServerApp } = await getAuthenticatedAppForUser()
    const db = getFirestore(firebaseServerApp)

    // verify that the dog object is valid
    if (DogSchema.safeParse(dog).success === false) {
        console.log('Dog object is invalid')
        throw new Error('Dog object is invalid')
    }

    const dogsCollection = collection(db, 'dogs')
    const newDoc = await addDoc(dogsCollection, dog)
    console.log('Dog added with ID: ', newDoc.id)
    return newDoc.id
}

export async function getAllDogs() {
    const dogsCollection = collection(db, 'dogs')
    const dogsSnapshot = await getDocs(dogsCollection)
    const dogs = dogsSnapshot.docs.map((doc) => doc.data() as Dog)
    return dogs
}

export async function getDogById(id: string) {
    const dogsCollection = collection(db, 'dogs')
    const dogDoc = await getDoc(doc(dogsCollection, id))
    const dog = dogDoc.data() as Dog
    return dog
}

export async function updateDog(id: string, dog: Dog) {
    if (DogSchema.safeParse(dog).success === false) {
        throw new Error('Dog object is invalid')
    }

    const dogsCollection = collection(db, 'dogs')
    await updateDoc(doc(dogsCollection, id), dog)
}

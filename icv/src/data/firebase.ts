'use client'

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { firebaseConfig } from './firebaseConfig'
import { getStorage } from 'firebase/storage'

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const clientDb = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)
'use server'
import 'server-only'

import { getAuthenticatedAppForUser } from '@/lib/serverApp'
import { Users } from '@/types/user-types'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase/firestore'
import { initializeApp, getApps, cert } from 'firebase-admin/app'

export async function getFirebaseUsers(): Promise<Users[]> {
    // Verify authenticated user has permission
    const { currentUser } = await getAuthenticatedAppForUser()
    if (!currentUser) {
        throw new Error('User not found')
    }

    try {
        // Get list of users from Firebase Auth
        const listUsersResult = await getAuth().listUsers()
        
        // Map Firebase users to our Users type
        const users: Users[] = listUsersResult.users.map(user => ({
            id: user.uid,
            name: user.displayName || 'No Name',
            email: user.email || 'No Email'
        }))

        return users
    } catch (error) {
        console.error('Error fetching users:', error)
        throw new Error('Failed to fetch users')
    }
}

export async function getUserNames(): Promise<string[]> {
    // Verify authenticated user has permission
    const { currentUser } = await getAuthenticatedAppForUser()
    if (!currentUser) {
        throw new Error('User not found')
    }

    try {
        // Get list of users from Firebase Auth
        const listUsersResult = await getAuth().listUsers()
        
        // Map to just the display names, filtering out null/undefined values and using 'No Name' as fallback
        const userNames = listUsersResult.users
            .map(user => user.displayName || 'No Name')
            .filter(name => name !== null)
            .sort() // Sort alphabetically

        return userNames
    } catch (error) {
        console.error('Error fetching user names:', error)
        throw new Error('Failed to fetch user names')
    }
}

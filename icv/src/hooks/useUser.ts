'use client'

import { auth } from '@/data/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'
import { useEffect, useState } from 'react'

export function useUser(): {
    user: User | null
    loading: boolean
    error: any
} {
    const [userState, setUserState] = useState<{
        user: User | null
        version: number
    }>({
        user: null,
        version: 0,
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<any>(null)

    useEffect(() => {
        const syncCurrentUser = () => {
            setUserState((prev) => ({
                user: auth.currentUser,
                version: prev.version + 1,
            }))
            setLoading(false)
        }

        const unsubscribe = onAuthStateChanged(
            auth,
            (user) => {
                setUserState((prev) => ({
                    user,
                    version: prev.version + 1,
                }))
                setLoading(false)
            },
            (error) => {
                setError(error)
                setLoading(false)
            },
        )

        window.addEventListener('auth-profile-updated', syncCurrentUser)

        return () => {
            unsubscribe()
            window.removeEventListener('auth-profile-updated', syncCurrentUser)
        }
    }, [])

    return { user: userState.user, loading, error }
}
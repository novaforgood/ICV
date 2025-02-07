'use client'

import { auth } from '@/lib/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'
import { useEffect, useState } from 'react'

export function useUser(): {
    user: User | null
    loading: boolean
    error: any
} {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<any>(null)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(
            auth,
            (user) => {
                setUser(user)
                setLoading(false)
            },
            (error) => {
                setError(error)
                setLoading(false)
            },
        )

        return () => unsubscribe()
    }, [])

    return { user, loading, error }
}

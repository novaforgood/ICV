'use client'
import { auth } from '@/data/firebase'
import { getCookie } from 'cookies-next'
import { useEffect, useState } from 'react'

export default function AuthDebugger() {
    const [authState, setAuthState] = useState({
        isLoggedIn: false,
        user: null,
        cookie: null,
        loading: true,
    })

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            const cookie = getCookie('idToken')
            setAuthState({
                isLoggedIn: !!user,
                user: user
                    ? {
                          uid: user.uid,
                          email: user.email,
                          displayName: user.displayName,
                      }
                    : null,
                cookie: cookie || 'none',
                loading: false,
            })
        })

        return () => unsubscribe()
    }, [])

    if (authState.loading) return <div>Loading auth state...</div>

    return (
        <div className="my-4 rounded border bg-gray-50 p-4 text-sm">
            <h3 className="font-bold">Auth Debug Info</h3>
            <p>Logged in: {authState.isLoggedIn ? 'Yes' : 'No'}</p>
            <p>Cookie exists: {authState.cookie !== 'none' ? 'Yes' : 'No'}</p>
            <p>Cookie value: {authState.cookie}</p>
            {authState.user && (
                <div>
                    <p>User ID: {authState.user.uid}</p>
                    <p>Email: {authState.user.email}</p>
                </div>
            )}
        </div>
    )
}

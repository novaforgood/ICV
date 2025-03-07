'use client'

import { auth } from '@/data/firebase'
import { setCookie } from 'cookies-next'
import { getIdToken, onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface Props {}

const AuthSetup = (props: Props) => {
    console.log('AuthSetup')
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log('User is signed in')
                console.log("Welcome, ", auth.currentUser?.displayName)
                const idToken = await getIdToken(user)

                await setCookie('idToken', idToken, {
                    maxAge: 60 * 60 * 24 * 7,
                })

                // Redirect logged-in users away from login page
                if (pathname === '/login') {
                    router.push('/')
                }
            } else {
                console.log('User is signed out')
                await setCookie('idToken', '', {
                    maxAge: 0,
                })
            }
        })

        return () => unsubscribe()
    }, [])

    return null
}

export default AuthSetup
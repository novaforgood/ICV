'use client'

import { auth } from '@/data/firebase'
import { setCookie } from 'cookies-next'
import { getIdToken, onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const AuthSetup = () => {
    console.log('AuthSetup')
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // prevents setting cookie or redirect if user just created an account
                // this is done to enforce proper 2FA flow after account creation
                if (pathname === '/login' && sessionStorage.getItem('justSignedUp')) {
                    return
                }

                const idToken = await getIdToken(user)

                await setCookie('idToken', idToken, {
                    maxAge: 60 * 60 * 24 * 7,
                })

                // redirect to home page if user is logged in and on login page
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
    }, [pathname, router])

    return null
}

export default AuthSetup
'use client'

import { auth } from '@/lib/firebase'
import { setCookie } from 'cookies-next'
import { getIdToken, onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'

interface Props {}

const AuthSetup = (props: Props) => {
    console.log('AuthSetup')

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log('User is signed in')
                const idToken = await getIdToken(user)

                await setCookie('idToken', idToken, {
                    maxAge: 60 * 60 * 24 * 7,
                })
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

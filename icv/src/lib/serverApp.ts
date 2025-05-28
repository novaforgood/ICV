import 'server-only'

import { FirebaseServerApp, initializeServerApp } from 'firebase/app'

import { firebaseConfig } from '@/data/firebaseConfig'
import { getCookie } from 'cookies-next'
import { getAuth, getIdToken } from 'firebase/auth'
import { cookies } from 'next/headers'
import { setCookie } from 'cookies-next'

export async function getAuthenticatedAppForUser() {
    const idToken = await getCookie('idToken', { cookies })

    if (!idToken) {
        console.error('not logged in')
        return {
            redirect: {
                destination: '../login/page.tsx',
                permanent: false,
            },
        }
    }

    console.log('idToken', idToken)

    const firebaseServerApp: FirebaseServerApp = initializeServerApp(
        firebaseConfig,
        idToken
            ? {
                  authIdToken: idToken,
              }
            : {},
    )

    const auth = getAuth(firebaseServerApp)
    await auth.authStateReady()

    if (!auth.currentUser) {
        throw new Error('No user found')
    }


    return { firebaseServerApp, currentUser: auth.currentUser }
}

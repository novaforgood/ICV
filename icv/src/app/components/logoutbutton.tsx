'use client'
import { auth } from '@/lib/firebase'
import { getIdToken, onAuthStateChanged, signOut } from 'firebase/auth'
import { setCookie } from 'cookies-next'
import { useEffect } from 'react'


export default function LogoutButton() {
    

const handleSignOut = async () => {
    try {
        await signOut(auth) // Firebase sign out
        await setCookie('idToken', '', { maxAge: 0 }) // Remove token cookie
        // console.log('User signed out')
        if (auth.currentUser === null) {
            console.log('User is confirmed as signed out')
        }
    } catch (error) {
        console.error('Sign out error:', error)
    }
}

return(
<button className="flex w-full flex-row items-center justify-center gap-4 rounded-md p-4 text-center hover:bg-slate-300" onClick={handleSignOut}>
                        Logout
                    </button>
)
}
'use client'
import { auth } from '@/data/firebase'
import { deleteCookie, getCookie } from 'cookies-next'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
    const router = useRouter()

    const handleSignOut = async () => {
        try {
            // Log cookie before logout
            console.log('Cookie before logout:', getCookie('idToken'))

            // Firebase sign out
            await signOut(auth)

            // Delete cookie more definitively
            deleteCookie('idToken', { path: '/' })

            console.log('User signed out')
            console.log('Cookie after logout:', getCookie('idToken'))

            // Force a page reload to ensure middleware runs on the next navigation
            // This will ensure the middleware redirects the user to the login page
            router.push('/login')

            // For extra safety, you can also force a full page reload
            // window.location.href = '/login'
        } catch (error) {
            console.error('Sign out error:', error)
        }
    }

    return (
        <button
            className="flex w-full flex-row items-center justify-center gap-4 rounded-md p-4 text-center"
            onClick={handleSignOut}
        >
            Logout
        </button>
    )
}

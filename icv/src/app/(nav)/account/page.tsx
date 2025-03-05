'use client'
import { auth } from '@/data/firebase' // Adjust path as needed
import { useUser } from '@/hooks/useUser'
import { signOut } from 'firebase/auth'

const handleLogout = async () => {
    try {
        await signOut(auth)
        console.log('User logged out successfully')
    } catch (error) {
        console.error('Error logging out:', error)
    }
}

const dashboard = () => {
    const { user, loading, error } = useUser()

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error.message}</p>

    return (
        <div>
            <h1>Dashboard</h1>
            {user ? <p>Welcome {user.email}</p> : <p>Not logged in</p>}
            <button
                className="mt-2 bg-blue-500 p-2 text-white"
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
    )
}

export default dashboard

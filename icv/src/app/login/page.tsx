'use client'
import { auth } from '@/data/firebase'
import { setCookie } from 'cookies-next'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
} from 'firebase/auth'
import { useState } from 'react'

const page = () => {
    const [email, setEmail] = useState('')
    const [firstname, setFirstName] = useState('')
    const [lastname, setLastName] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        try {
            if (loading) {//if user is creating an account
                const userCreds = await createUserWithEmailAndPassword(auth, email, password)
                const user = userCreds.user

                //update display name in firebase auth
                await updateProfile(user, {
                    displayName: `${firstname} ${lastname}`,
                })
                console.log('user name stored: ', auth.currentUser?.displayName)
            } else {
                const usercred = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password,
                )
                const user = usercred.user
                if (user) {
                    const token = await user.getIdToken()

                    // Set cookie
                    setCookie('idToken', token, {
                        path: '/',
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'lax',
                    })

                    console.log('Token set in cookie:', token)
                    console.log('Welcome, ', auth.currentUser?.displayName)
                }
            }
            alert('Successfully logged in')
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('An unknown error occurred')
            }
        }
    }
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
                <h2 className="text-grey-800 text-center text-2xl font-semibold">
                    {loading
                        ? 'Create an Account'
                        : 'Login to Inner City Visions'}
                </h2>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <form onSubmit={handleAuth} className="flex flex-col">
                    {loading && (
                        <>
                            <input
                                type="text"
                                placeholder="First Name"
                                className="mt-2 border border-gray-200 p-2"
                                value={firstname}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                className="mt-2 border border-gray-200 p-2"
                                value={lastname}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </>
                    )}

                    <input
                        type="email"
                        placeholder="Email"
                        className="mt-2 border border-gray-200 p-2"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="mt-2 border border-gray-200 p-2"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="mt-2 bg-blue-500 p-2 text-white"
                    >
                        {loading ? 'Create Account' : 'Login'}
                    </button>
                </form>
                <button
                    onClick={() => setLoading(!loading)}
                    className="mt-2 text-blue-500"
                >
                    {loading ? 'Already have an account?' : 'Create an account'}
                </button>
            </div>
        </div>
    )
}

export default page

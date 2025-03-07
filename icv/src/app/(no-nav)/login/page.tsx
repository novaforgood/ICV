'use client'
import { auth } from '@/data/firebase'
import { setCookie } from 'cookies-next'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    sendPasswordResetEmail // Added import for password reset
} from 'firebase/auth'
import { useState } from 'react'
import Image from 'next/image'

const page = () => {
    const [email, setEmail] = useState('')
    const [firstname, setFirstName] = useState('')
    const [lastname, setLastName] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [forgotPassword, setForgotPassword] = useState(false) 

    // Handle password reset
    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        
        try {
            await sendPasswordResetEmail(auth, email)
            alert('Password reset email sent! Please check your inbox.')
            setForgotPassword(false)
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('An unknown error occurred')
            }
        }
    }

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
        <div className="flex min-h-screen flex-col items-center justify-center bg-white p-6">
                <Image 
                    src="/icv.png"
                    alt="icv logo"
                    width={100}
                    height={100}
                    priority
                    
                />
                <h2 className="text-grey-800 text-center text-3xl font-bold">
                    {forgotPassword 
                        ? 'Reset Password'
                        : loading
                            ? 'Sign Up'
                            : 'Login'}
                </h2>
                {error && <p className="text-sm text-red-500">{error}</p>}
                
                {forgotPassword ? (
                    // Forgot Password Form
                    <form onSubmit={handlePasswordReset} className="flex w-[400px] flex-col">
                        <label className='mt-4 mb-0 text-sm text-gray-600'>Enter your email address and we will send you instructions to reset your password.</label>
                        <label className='mt-4 mb-0 text-sm'>Email Address</label>
                        <input
                            type="email"
                            placeholder="Email"
                            className="mt-0 border w-full rounded-md border-gray-200 p-2"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="mx-auto mt-4 w-[128px] rounded-md items-center bg-black p-2 text-white"
                        >
                            Continue
                        </button>
                        <button
                            type="button"
                            onClick={() => setForgotPassword(false)}
                            className="mt-4 text-black bold text-sm"
                        >
                            Back to Login
                        </button>
                    </form>
                ) : (
                    // Regular Login/Signup Form
                    <>
                        <form onSubmit={handleAuth} className="flex w-[400px] flex-col">
                            {loading && (
                                <>
                                {/* Label text size reduced to text-sm */}
                                <label className='mt-10 mb-0 text-sm'>First Name</label>
                                    <input
                                        type="text"
                                        placeholder="First Name"
                                        className="mt-0 border rounded-md border-gray-200 p-2"
                                        value={firstname}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                    <label className='mt-4 mb-0 text-sm'>Last Name</label>
                                    <input
                                        type="text"
                                        placeholder="Last Name"
                                        className="mt-0 border rounded-md border-gray-200 p-2"
                                        value={lastname}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </>
                            )}
                            <label className='mt-4 mb-0 text-sm'>Email Address</label>
                            <input
                                type="email"
                                placeholder="Email"
                                className="mt-0 border w-full rounded-md border-gray-200 p-2"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label className='mt-4 mb-0 text-sm'>Password</label>
                            <input
                                type="password"
                                placeholder="Password"
                                className="mt-0 border w-full rounded-md border-gray-200 p-2"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {loading && (
                            <label className='mt-4 mb-0 mx-auto w-full border rounded-md p-4 text-sm'> Your Password Must Contain: 
                                <ul className="list-disc pl-6 mt-1"> {/* Added list styling and padding */}
                                    <li>12 characters</li>
                                    <li>1 capital character</li>
                                </ul>
                            </label>
                            )}
                            {!loading && (
                            <button
                                onClick={() => setForgotPassword(true)}
                                className="mt-4 text-black text-sm"
                            >
                                Forgot Password?
                            </button>
                        )}
                            <button
                                type="submit"
                                className="mx-auto mt-4 w-[128px] rounded-md items-center bg-black p-2 text-white"
                            >
                                {loading ? 'Sign Up' : 'Login'}
                            </button>
                        </form>
                        
                        <button
                            onClick={() => setLoading(!loading)}
                            className="mt-4 text-black bold text-sm"
                        >
                            {loading ? <>Already have an account? <span className="font-bold"> Log In</span></> : 
                            <>Don't have an account? <span className="font-bold"> Sign Up</span></>}
                        </button>
                    </>
                )}
        </div>
    )
}

export default page

'use client'
import { auth, clientDb } from '@/data/firebase'
import { setCookie } from 'cookies-next'
import {
    createUserWithEmailAndPassword,
    sendPasswordResetEmail, // Added import for password reset
    signInWithEmailAndPassword,
    updateProfile,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const page = () => {
    const [email, setEmail] = useState('')
    const [firstname, setFirstName] = useState('')
    const [lastname, setLastName] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [forgotPassword, setForgotPassword] = useState(false)
    const router = useRouter()

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
            if (loading) {
                //if user is creating an account
                const userCreds = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password,
                )
                const user = userCreds.user

                //update display name in firebase auth
                await updateProfile(user, {
                    displayName: `${firstname} ${lastname}`,
                })
                console.log('user name stored: ', auth.currentUser?.displayName)
                //add username and email to collection to allow display on clinet form "case manager" box
                await setDoc(doc(clientDb, 'users', `${firstname}`), {
                    name: `${firstname} ${lastname}`,
                    email: `${email}`,
                    uid: user.uid
                })
                console.log('user stored in collections')
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
                    router.push('/')
                }
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('An unknown error occurred')
            }
        }
    }

    //handle enter buttonw hen pressed
    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleAuth
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
                <form
                    onSubmit={handlePasswordReset}
                    className="flex w-[400px] flex-col"
                >
                    <label className="mb-0 mt-4 text-sm text-gray-600">
                        Enter your email address and we will send you
                        instructions to reset your password.
                    </label>
                    <label className="mb-0 mt-4 text-sm">Email Address</label>
                    <input
                        type="email"
                        placeholder="Email"
                        className="mt-0 w-full rounded-md border border-gray-200 p-2"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="mx-auto mt-4 w-[128px] items-center rounded-md bg-black p-2 text-white"
                    >
                        Continue
                    </button>
                    <button
                        type="button"
                        onClick={() => setForgotPassword(false)}
                        className="bold mt-4 text-sm text-black"
                    >
                        Back to Login
                    </button>
                </form>
            ) : (
                // Regular Login/Signup Form
                <>
                    <form
                        onSubmit={handleAuth}
                        className="flex w-[400px] flex-col"
                    >
                        {loading && (
                            <>
                                {/* Label text size reduced to text-sm */}
                                <label className="mb-0 mt-10 text-sm">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    className="mt-0 rounded-md border border-gray-200 p-2"
                                    value={firstname}
                                    onChange={(e) =>
                                        setFirstName(e.target.value)
                                    }
                                />
                                <label className="mb-0 mt-4 text-sm">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    className="mt-0 rounded-md border border-gray-200 p-2"
                                    value={lastname}
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                />
                            </>
                        )}
                        <label className="mb-0 mt-4 text-sm">
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="Email"
                            className="mt-0 w-full rounded-md border border-gray-200 p-2"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label className="mb-0 mt-4 text-sm">Password</label>
                        <input
                            type="password"
                            placeholder="Password"
                            className="mt-0 w-full rounded-md border border-gray-200 p-2"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {loading && (
                            <label className="mx-auto mb-0 mt-4 w-full rounded-md border p-4 text-sm">
                                {' '}
                                Your Password Must Contain:
                                <ul className="mt-1 list-disc pl-6">
                                    {' '}
                                    {/* Added list styling and padding */}
                                    <li>12 characters</li>
                                    <li>1 capital character</li>
                                </ul>
                            </label>
                        )}
                        {!loading && (
                            <button
                                type="button" //need this or else default behavior = forgot password when enter key pressed
                                onClick={() => setForgotPassword(true)}
                                className="mt-4 text-sm text-black"
                            >
                                Forgot Password?
                            </button>
                        )}
                        <button
                            type="submit"
                            className="mx-auto mt-4 w-[128px] items-center rounded-md bg-black p-2 text-white"
                        >
                            {loading ? 'Sign Up' : 'Login'}
                        </button>
                    </form>

                    <button
                        onClick={() => setLoading(!loading)}
                        className="bold mt-4 text-sm text-black"
                    >
                        {loading ? (
                            <>
                                Already have an account?{' '}
                                <span className="font-bold"> Log In</span>
                            </>
                        ) : (
                            <>
                                Don't have an account?{' '}
                                <span className="font-bold"> Sign Up</span>
                            </>
                        )}
                    </button>
                </>
            )}
        </div>
    )
}

export default page

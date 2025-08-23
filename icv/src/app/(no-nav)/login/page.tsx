'use client'
import { start2FA } from '@/api/clients'
import { auth, clientDb } from '@/data/firebase'
import { FirebaseError } from 'firebase/app'
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
    const [signUp, setSignUp] = useState(false)
    const [forgotPassword, setForgotPassword] = useState(false)
    const [last2FACall, setLast2FACall] = useState(0) // Track last 2FA call time
    const router = useRouter()

    // Check if enough time has passed since last 2FA call (5 seconds)
    const canCall2FA = () => {
        const now = Date.now()
        const timeSinceLastCall = now - last2FACall
        return timeSinceLastCall >= 5000 // 5 seconds in milliseconds
    }

    // Validate email domain
    const isValidEmailDomain = (email: string) => {
        const allowedDomains = ['@icvcommunity.org', '@gmail.com']
        return allowedDomains.some((domain) =>
            email.toLowerCase().endsWith(domain),
        )
    }

    // Handle password reset
    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Validate email domain
        if (!isValidEmailDomain(email)) {
            setError(
                'Please use an email address from @icvcommunity.org or @gmail.com',
            )
            return
        }

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
        if (loading) return // Prevent multiple submissions
        setLoading(true)
        setError('')

        // Validate email domain
        if (!isValidEmailDomain(email)) {
            setError(
                'Please use an email address from @icvcommunity.org or @gmail.com',
            )
            setLoading(false)
            return
        }

        try {
            if (signUp) {
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
                    uid: user.uid,
                })
                console.log('user stored in collections')

                // Switch back to login mode after successful account creation
                setSignUp(false)
                setFirstName('') // Clear first name field
                setLastName('') // Clear last name field
                setPassword('') // Clear password field
                setError('Account created successfully! Please log in.')
            } else {
                // First authenticate with Firebase
                const usercred = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password,
                )
                const user = usercred.user
                if (user) {
                    // Check if enough time has passed since last 2FA call (5 secs)
                    if (!canCall2FA()) {
                        const remainingTime = Math.ceil(
                            (5000 - (Date.now() - last2FACall)) / 1000,
                        )
                        setError(
                            `Please wait ${remainingTime} seconds before requesting another 2FA code.`,
                        )
                        return
                    }

                    // Start 2FA process, temporarily store email and pw in session storage
                    sessionStorage.setItem('2fa-email', email)
                    sessionStorage.setItem('2fa-pw', password)
                    setLast2FACall(Date.now()) // Record the time of this 2FA call
                    await start2FA(email || '')
                    router.push('/2fa')
                    // router.push('/')
                }
            }
        } catch (err) {
            if (err instanceof Error) {
                const error = err as FirebaseError

                const messages: Record<string, string> = {
                    'auth/invalid-credential':
                        'Incorrect Password. Please try again or reset password.',
                    'auth/user-not-found': 'No user associated with email.',
                    'auth/invalid-email': 'Invalid Email Address.',
                    'auth/too-many-requests':
                        'Too many login attempts. Please try again in 5 minutes.',
                    'auth/missing-password':
                        "You didn't enter a password silly!",
                }

                const text = messages[error.code] ?? error.message
                setError(text)
            } else {
                setError('An unknown error occurred')
            }
        } finally {
            setLoading(false)
        }
    }

    //handle enter button when pressed
    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault() // Prevent default form submission
            if (!loading && (!signUp || canCall2FA())) {
                // Create a synthetic event to pass to handleAuth
                const form = e.currentTarget.form
                if (form) {
                    handleAuth({
                        preventDefault: () => {},
                        target: form,
                    } as any)
                }
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
                    : signUp
                      ? 'Sign Up'
                      : 'Login'}
            </h2>
            {error && (
                <p
                    className={`text-sm ${
                        error.includes('successfully')
                            ? 'text-green-600'
                            : 'text-red-500'
                    }`}
                >
                    {error}
                </p>
            )}

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
                //loading = signup
                <>
                    <form
                        onSubmit={(e) => {
                            if (loading || (!signUp && !canCall2FA())) {
                                e.preventDefault()
                                return
                            }
                            handleAuth(e)
                        }}
                        className="flex w-[400px] flex-col"
                    >
                        {signUp && (
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
                            onKeyDown={handleEnter}
                        />
                        {signUp && (
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

                        {!signUp && (
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
                            className={`mx-auto mt-4 w-[128px] items-center rounded-md p-2 text-white ${
                                loading
                                    ? 'cursor-not-allowed bg-gray-400 opacity-50'
                                    : 'bg-black hover:bg-gray-800'
                            }`}
                            disabled={loading}
                        >
                            {loading
                                ? 'Loading...'
                                : signUp
                                  ? 'Sign Up'
                                  : 'Login'}
                        </button>
                    </form>

                    <button
                        onClick={() => setSignUp(!signUp)}
                        className="bold mt-4 text-sm text-black"
                        disabled={loading}
                    >
                        {/*if not loading, then logging in */}
                        {signUp ? (
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

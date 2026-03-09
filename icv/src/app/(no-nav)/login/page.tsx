'use client'
import { start2FA } from '@/api/clients'
import { auth, clientDb } from '@/data/firebase'
import { FirebaseError } from 'firebase/app'
import {
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const Page = () => {
    // user input fields
    const [email, setEmail] = useState('')
    const [firstname, setFirstName] = useState('')
    const [lastname, setLastName] = useState('')
    const [password, setPassword] = useState('')

    // form mode
    const [signUp, setSignUp] = useState(false)
    const [forgotPassword, setForgotPassword] = useState(false)

    // status
    const [error, setError] = useState('')
    const [statusMessage, setStatusMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [last2FACall, setLast2FACall] = useState(0)

    const router = useRouter()

    useEffect(() => {
        const message = sessionStorage.getItem('postLogoutMessage')
        if (!message) return

        setStatusMessage(message)
        sessionStorage.removeItem('postLogoutMessage')
    }, [])

    // check if enough time has passed since last 2FA call
    const canCall2FA = () => {
        const now = Date.now()
        const timeSinceLastCall = now - last2FACall
        return timeSinceLastCall >= 5000 // 5 second wait period
    }

    // validate email domain, restricted to icvcommunity.org
    const isValidEmailDomain = (email: string) => {
        const allowedDomains = [
            '@icvcommunity.org',
            '@gmail.com',
            '@g.ucla.edu',
        ]
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
            setError('Please use an email address from @icvcommunity.org')
            return
        }

        try {
            await sendPasswordResetEmail(auth, email)
            alert('Password reset email sent! Please check your inbox.')
            setForgotPassword(false)
        } catch (err) {
            if (err instanceof Error) {
                const error = err as FirebaseError
                setError(error.message)
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
        let pending2FASignIn = false

        // Validate email domain
        if (!isValidEmailDomain(email)) {
            setError('Please use an email address from @icvcommunity.org')
            setLoading(false)
            return
        }

        // When signing up, require first and last name
        if (signUp) {
            // cleanup by removing whitespace from first and last name
            const trimmedFirst = firstname.trim()
            const trimmedLast = lastname.trim()
            if (!trimmedFirst || !trimmedLast) {
                setError('Please enter both first name and last name.')
                setLoading(false)
                return
            }
        }

        try {
            if (signUp) {
                // flag, used to prevent auto-login after account creation
                sessionStorage.setItem('justSignedUp', '1')

                const trimmedFirst = firstname.trim()
                const trimmedLast = lastname.trim()

                // create user in firebase auth
                const userCreds = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password,
                )
                const user = userCreds.user

                //update display name in firebase auth
                await updateProfile(user, {
                    displayName: `${trimmedFirst} ${trimmedLast}`,
                })
                console.log(
                    'user display name updated: ',
                    auth.currentUser?.displayName,
                )

                //add username and email to collection to allow display on clinet form "case manager" box
                await setDoc(doc(clientDb, 'users', `${trimmedFirst}`), {
                    name: `${trimmedFirst} ${trimmedLast}`,
                    email: `${email}`,
                    uid: user.uid,
                    photoURL: user.photoURL || '',
                })

                // force sign out to prevent user from being signed in automatically
                await signOut(auth)

                // flag removed after guaranteed sign out
                sessionStorage.removeItem('justSignedUp')

                // switches to login mode on re-render
                setSignUp(false)
                setFirstName('')
                setLastName('')
                setPassword('')

                setError('Account created successfully! Please log in.')
            } else {
                if (!canCall2FA()) {
                    const remainingTime = Math.ceil(
                        (5000 - (Date.now() - last2FACall)) / 1000,
                    )
                    setError(
                        `Please wait ${remainingTime} seconds before requesting another 2FA code.`,
                    )
                    return
                }

                // Mark the login as pending 2FA before Firebase auth changes.
                sessionStorage.setItem('pending2fa', '1')

                // First authenticate with Firebase
                const usercred = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password,
                )
                pending2FASignIn = true
                const user = usercred.user
                if (user) {
                    // Start 2FA process, temporarily store email and pw in session storage
                    sessionStorage.setItem('2fa-email', email)
                    sessionStorage.setItem('2fa-pw', password)
                    setLast2FACall(Date.now()) // Record the time of this 2FA call
                    await start2FA(email || '')

                    // Do not leave a Firebase session active before 2FA completes.
                    await signOut(auth)
                    pending2FASignIn = false
                    router.push('/2fa')
                }
            }
        } catch (err) {
            sessionStorage.removeItem('pending2fa')
            sessionStorage.removeItem('2fa-email')
            sessionStorage.removeItem('2fa-pw')

            if (pending2FASignIn) {
                await signOut(auth)
            }

            if (err instanceof Error) {
                const error = err as FirebaseError

                const messages: Record<string, string> = {
                    'auth/invalid-credential':
                        'Incorrect Password. Please try again or reset password.',
                    'auth/user-not-found':
                        'No user associated with email. Please create an account.',
                    'auth/invalid-email': 'Invalid Email Address.',
                    'auth/too-many-requests':
                        'Too many login attempts. Please try again in 5 minutes.',
                    'auth/missing-password': 'Please enter a password.',
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
        <div className="flex min-h-screen flex-col items-center justify-center space-y-[12px] bg-white p-6">
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
            {statusMessage && (
                <p className="text-sm text-green-600">{statusMessage}</p>
            )}
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
                        onClick={() => {
                            setError('')
                            setForgotPassword(false)
                        }}
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
                                onClick={() => {
                                    setError('')
                                    setForgotPassword(true)
                                }}
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
                        onClick={() => {
                            setError('')
                            setSignUp(!signUp)
                        }}
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
                                Don&apos;t have an account?{' '}
                                <span className="font-bold"> Sign Up</span>
                            </>
                        )}
                    </button>
                </>
            )}
        </div>
    )
}

export default Page

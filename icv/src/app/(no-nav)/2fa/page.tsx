'use client'
import { start2FA, verify2FA } from '@/api/clients'
import { auth } from '@/data/firebase'
import { setCookie } from 'cookies-next'
import { signInWithEmailAndPassword } from 'firebase/auth'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const TwoFactorAuthPage = () => {
    const [verificationCode, setVerificationCode] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [codeSent, setCodeSent] = useState(false)
    const [countdown, setCountdown] = useState(0)
    const router = useRouter()
    const searchParams = useSearchParams()

    //get email and pw from session storage
    const email = sessionStorage.getItem('2fa-email') || ''
    const pw = sessionStorage.getItem('2fa-pw') || ''

    // Auto-send verification code when page loads
    useEffect(() => {
        if (email && !codeSent) {
            sendVerificationCode()
        }
    }, [email])

    // Countdown timer for resend functionality
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [countdown])

    const sendVerificationCode = async () => {
        setLoading(true)
        setError('')

        try {
            await start2FA(email)
            setCodeSent(true)
            setCountdown(60) // 60 second countdown before allowing resend
        } catch (err) {
            setError('Failed to send verification code. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const verifyCode = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            await verify2FA(email, verificationCode)
            //if no error, then we can successfully log in and delete sessionstorage
            const usercred = await signInWithEmailAndPassword(auth, email, pw)
            const user = usercred.user
            if (user) {
                sessionStorage.removeItem('2fa-pw')
                sessionStorage.removeItem('2fa-email')
                // Set cookie
                const token = await user.getIdToken()
                setCookie('idToken', token, {
                    path: '/',
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                })

                console.log('Token set in cookie:', token)
                console.log('Welcome, ', auth.currentUser?.displayName)
                router.push('/')
            }
        } catch (err) {
            setError('Verification failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    // Handle resend code
    const handleResendCode = async () => {
        if (countdown > 0) return
        await sendVerificationCode()
    }

    // Handle back to login
    const handleBackToLogin = () => {
        router.push('/login')
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
            <h2 className="text-grey-800 mt-6 text-center text-3xl font-bold">
                Two-Factor Authentication
            </h2>

            {error && (
                <p className="mt-4 max-w-md text-center text-sm text-red-500">
                    {error}
                </p>
            )}

            <div className="mt-6 w-[400px]">
                <form onSubmit={verifyCode} className="flex flex-col">
                    <p className="mb-6 text-center text-gray-600">
                        Enter the 6-digit verification code sent to your email.
                    </p>

                    <label className="mb-2 text-sm font-medium text-gray-700">
                        Verification Code
                    </label>
                    <input
                        type="text"
                        placeholder="000000"
                        maxLength={6}
                        className="w-full rounded-md border border-gray-200 p-3 text-center font-mono text-lg tracking-widest"
                        value={verificationCode}
                        onChange={(e) => {
                            // Only allow digits
                            const value = e.target.value.replace(/\D/g, '')
                            setVerificationCode(value)
                        }}
                        autoFocus
                    />

                    <button
                        type="submit"
                        disabled={loading || verificationCode.length !== 6}
                        className="mt-6 w-full rounded-md bg-black p-3 text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
                    >
                        {loading ? 'Verifying...' : 'Verify Code'}
                    </button>

                    <div className="mt-4 text-center">
                        <button
                            type="button"
                            onClick={handleResendCode}
                            disabled={countdown > 0}
                            className="text-sm text-blue hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {countdown > 0
                                ? `Resend code in ${countdown}s`
                                : 'Resend code'}
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={handleBackToLogin}
                        className="mt-4 text-sm text-black hover:underline"
                    >
                        Back to Login
                    </button>
                </form>
            </div>
        </div>
    )
}

export default TwoFactorAuthPage

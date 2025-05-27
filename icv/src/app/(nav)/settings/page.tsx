'use client'
import { auth } from '@/data/firebase'
import { useUser } from '@/hooks/useUser'
import { signOut } from 'firebase/auth'
import { useState } from 'react'
import { FiEdit2, FiGlobe, FiMail } from 'react-icons/fi'

const handleLogout = async () => {
    try {
        await signOut(auth)
        console.log('User logged out successfully')
    } catch (error) {
        console.error('Error logging out:', error)
    }
}

// Simple FAQ item with expand/collapse
const FAQItem = ({ question }: { question: string }) => {
    const [open, setOpen] = useState(false)
    return (
        <div className="mb-2">
            <button
                className="flex items-center gap-2 font-medium"
                onClick={() => setOpen((o) => !o)}
            >
                <span className="text-2xl">{open ? '-' : '+'}</span>
                <span>{question}</span>
            </button>
            {open && (
                <div className="ml-8 mt-1 text-sm text-gray-500">
                    We dont have the answer lololol
                </div>
            )}
        </div>
    )
}

const SettingsPage = () => {
    const { user, loading, error } = useUser()

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error.message}</p>

    const displayName = user?.displayName
    const [firstName, ...rest] = (displayName || '').split(' ')
    const lastName = rest.join(' ')

    return (
        <div className="px-12 py-8">
            {/* Header */}
            <h1 className="mb-2 border-b-2 border-dotted pb-2 text-7xl font-bold">
                Settings
            </h1>

            {/* Profile Section */}
            <div className="mb-12 mt-8 flex flex-row items-start justify-between">
                <div className="flex w-full flex-col">
                    <h2 className="mb-2 font-bold uppercase tracking-wider text-gray-400">
                        Profile
                    </h2>
                    <img
                        src={user?.photoURL || '/default-avatar.png'}
                        alt="Profile pic"
                        className="mb-4 h-32 w-32 rounded-full border object-cover"
                    />

                    <div className="flex w-full flex-row gap-12">
                        {/* user infoooo */}
                        <div className="flex-1">
                            <span className="font-bold">First Name</span>
                            <div>{firstName}</div>
                        </div>
                        <div className="flex-1">
                            <span className="font-bold">Last Name</span>
                            <div>{lastName}</div>
                        </div>
                        <div className="flex-1">
                            <span className="font-bold">Email</span>
                            <div>{user?.email}</div>
                        </div>
                        
                    </div>
                </div>

                <div className="flex w-1/3 justify-end">
                    <button className="flex items-center gap-2 rounded-md bg-black px-4 py-2 text-white">
                        <FiEdit2 />
                        Edit
                    </button>
                </div>
            </div>

            <div className="mb-12">
                <h2 className="mb-4 font-bold uppercase tracking-wider text-gray-400">
                    FAQ
                </h2>
                <FAQItem question="Do you have a question?" />
            </div>

            <div>
                <h2 className="mb-2 font-bold uppercase tracking-wider text-gray-400">
                    Need Help?
                </h2>
                <div className="mb-2">
                    For further assistance, contact us at
                </div>
                <div className="mb-1 flex items-center gap-2">
                    <FiGlobe className="text-xl" />
                    <span>novaforgood.org</span>
                </div>
                <div className="flex items-center gap-2">
                    <FiMail className="text-xl" />
                    <span>novaforgood@gmail.com</span>
                </div>
            </div>
        </div>
    )
}

export default SettingsPage

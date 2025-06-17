'use client'
import { auth } from '@/data/firebase'
import { useUser } from '@/hooks/useUser'
import { signOut, updateProfile } from 'firebase/auth'
import { useEffect, useState } from 'react'
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
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
    })
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    // Initialize form data when user data is loaded
    useEffect(() => {
        if (user) {
            const [firstName, ...rest] = (user.displayName || '').split(' ')
            setFormData({
                firstName,
                lastName: rest.join(' '),
                email: user.email || '',
            })
        }
    }, [user])

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error.message}</p>

    const displayName = user?.displayName
    const [firstName, ...rest] = (displayName || '').split(' ')
    const lastName = rest.join(' ')

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSave = async () => {
        try {
            if (!user) return

            // Update profile
            await updateProfile(user, {
                displayName: `${formData.firstName} ${formData.lastName}`,
            })

            // TODO: If you need to update the profile picture, you'll need to:
            // 1. Upload the image to Firebase Storage
            // 2. Get the URL
            // 3. Update the user's photoURL
            // This would require additional Firebase Storage setup

            setIsEditing(false)
        } catch (error) {
            console.error('Error updating profile:', error)
        }
    }

    const handleCancel = () => {
        setIsEditing(false)
        // Reset form data
        if (user) {
            const [firstName, ...rest] = (user.displayName || '').split(' ')
            setFormData({
                firstName,
                lastName: rest.join(' '),
                email: user.email || '',
            })
        }
        setPreviewUrl(null)
        setImageFile(null)
    }

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
                    <div className="relative">
                        <img
                            src={previewUrl || user?.photoURL || '/icv.png'}
                            alt="Profile pic"
                            className="mb-4 h-32 w-32 rounded-full border object-cover"
                        />
                        {isEditing && (
                            <div className="absolute bottom-6 left-0 w-32">
                                <button
                                    className="w-full rounded bg-black/50 px-2 py-1 text-sm text-white"
                                    onClick={() =>
                                        document
                                            .getElementById('imageUpload')
                                            ?.click()
                                    }
                                >
                                    Upload New Image
                                </button>
                                <input
                                    id="imageUpload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex w-full flex-row gap-12">
                        <div className="flex-1">
                            <span className="font-bold">First Name</span>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                                />
                            ) : (
                                <div>{firstName}</div>
                            )}
                        </div>
                        <div className="flex-1">
                            <span className="font-bold">Last Name</span>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                                />
                            ) : (
                                <div>{lastName}</div>
                            )}
                        </div>
                        <div className="flex-1">
                            <span className="font-bold">Email</span>
                            <div>{user?.email}</div>
                        </div>
                    </div>
                </div>

                <div className="flex w-1/3 justify-end gap-2">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleSave}
                                className="bg-blue-500 flex items-center gap-2 rounded-md px-4 py-2 text-white"
                            >
                                Save
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex items-center gap-2 rounded-md bg-black px-4 py-2 text-white"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 rounded-md bg-black px-4 py-2 text-white"
                        >
                            <FiEdit2 />
                            Edit
                        </button>
                    )}
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

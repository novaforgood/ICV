'use client'
import { Card } from '@/components/ui/card'
import { auth, clientDb, storage } from '@/data/firebase'
import { useUser } from '@/hooks/useUser'
import {
    signOut,
    updateEmail,
    updatePassword,
    updateProfile,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
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
                    Please log out and use the Forgot Password Button.
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
        password: '********',
    })
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [changePassword, setChangePassword] = useState(false)

    // Initialize form data when user data is loaded
    useEffect(() => {
        if (user) {
            const [firstName, ...rest] = (user.displayName || '').split(' ')
            setFormData({
                firstName,
                lastName: rest.join(' '),
                email: user.email || '',
                password: '********',
            })
        }
    }, [user])

    //useeffect to display saved successfully
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSuccess(false)
        }, 3000)
    }, [showSuccess])

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
            [name]: value, //works for all inputs, uses input's name and assigns the inputs's value
        }))
    }

    const handleSave = async () => {
        try {
            if (!user) return

            setIsSaving(true)

            // Update profile
            let photoURL = user.photoURL
            if (imageFile) {
                const fileExtension = imageFile.name.split('.').pop()
                const fileName = `profile-images/${user.uid}`
                const storageRef = ref(storage, fileName)

                const snapshot = await uploadBytes(storageRef, imageFile)
                photoURL = await getDownloadURL(snapshot.ref)
                console.log(
                    'oimage uploaded successfully, photoURL: ',
                    photoURL,
                )
            }
            await updateProfile(user, {
                displayName: `${formData.firstName} ${formData.lastName}`,
                photoURL: photoURL,
            })
            await updateEmail(user, formData.email)
            if(formData.password !== '********'){
            await updatePassword(user, formData.password)
            }

            console.log('user name stored: ', auth.currentUser?.displayName)
            //add username and email to collection to allow display on client form "case manager" box
            await setDoc(doc(clientDb, 'users', `${formData.firstName}`), {
                name: `${formData.firstName} ${formData.lastName}`,
                email: `${formData.email}`,
                uid: user.uid,
            })

            setIsEditing(false)
            // Clear the image file and preview after successful upload
            setImageFile(null)
            setPreviewUrl(null)
        } catch (error) {
            console.error('Error updating profile:', error)
        } finally {
            setShowSuccess(true)
            setIsSaving(false)
            setIsEditing(false)
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
                password: '********',
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
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <Card className="w-fit rounded px-4 py-2 text-center">
                        User info saved!
                    </Card>
                </div>
            )}

            {/* Profile Section */}
            <div className="mb-12 mt-8 flex flex-row items-start justify-between">
                <div className="flex w-full flex-col">
                    <div className="flex flex-row items-center justify-between">
                        <h2 className="mb-2 font-bold uppercase tracking-wider text-gray-400">
                            Profile
                        </h2>
                        <div className="flex gap-2">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="flex items-center gap-2 rounded-md bg-blue px-4 py-2 text-white disabled:opacity-50"
                                    >
                                        {isSaving ? 'Saving...' : 'Save'}
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        disabled={isSaving}
                                        className="flex items-center gap-2 rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
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
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                                />
                            ) : (
                                <div>{user?.email}</div>
                            )}
                        </div>
                        
                        {/* <div className="flex-1">
                            {isEditing ? (
                                <div>
                                    <span className="font-bold">
                                        Type your new password here:{''}
                                    </span>
                                    <input
                                        type="text"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                                    />
                                </div>
                            ) : (
                                <div>
                                    <span className="font-bold">Password</span>
                                    <input
                                        type="password"
                                        value="********"
                                        disabled
                                        className="mt-1 w-full cursor-not-allowed rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-400"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Click{' '}
                                        <span className="font-semibold">
                                            Edit
                                        </span>{' '}
                                        to change your password.
                                    </p>
                                </div>
                            )}
                        </div> */}
                    </div>
                </div>
            </div>

            <div className="mb-12">
                <h2 className="mb-4 font-bold uppercase tracking-wider text-gray-400">
                    FAQ
                </h2>
                <FAQItem question="Need to Change Your Password?" />
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

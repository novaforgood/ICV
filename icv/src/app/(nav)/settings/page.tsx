'use client'
import { NavMainContentLoadingOverlay } from '@/app/_components/LoadingOverlay'
import { Card } from '@/components/ui/card'
import { auth, clientDb, storage } from '@/data/firebase'
import { useUser } from '@/hooks/useUser'
import { getCroppedImg } from '@/utils/cropImage'
import { deleteCookie } from 'cookies-next'
import { FirebaseError } from 'firebase/app'
import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    signOut,
    updateProfile,
    verifyBeforeUpdateEmail,
} from 'firebase/auth'
import {
    collection,
    doc,
    getDocs,
    limit,
    query,
    setDoc,
    where,
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { useRouter } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import Cropper, { Area } from 'react-easy-crop'
import { FiEdit2, FiGlobe, FiMail } from 'react-icons/fi'

const FAQItem = ({
    question,
    answer,
}: {
    question: string
    answer: ReactNode
}) => {
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
                <div className="ml-8 mt-1 text-sm text-gray-500">{answer}</div>
            )}
        </div>
    )
}

const SettingsPage = () => {
    const { user, loading, error } = useUser()
    const router = useRouter()
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
    const [saveError, setSaveError] = useState('')
    const [changePassword, setChangePassword] = useState(false)
    const [pendingEmailChange, setPendingEmailChange] = useState('')
    const [showReauthModal, setShowReauthModal] = useState(false)
    const [reauthPassword, setReauthPassword] = useState('')
    const [reauthError, setReauthError] = useState('')
    const [isReauthenticating, setIsReauthenticating] = useState(false)
    const [cropImageSrc, setCropImageSrc] = useState<string | null>(null)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(
        null,
    )
    const [isCropping, setIsCropping] = useState(false)

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
        if (!showSuccess) return

        const timer = setTimeout(() => {
            setShowSuccess(false)
        }, 3000)

        return () => clearTimeout(timer)
    }, [showSuccess])

    useEffect(() => {
        return () => {
            if (previewUrl?.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl)
            }
            if (cropImageSrc) {
                URL.revokeObjectURL(cropImageSrc)
            }
        }
    }, [previewUrl, cropImageSrc])

    if (loading) return <NavMainContentLoadingOverlay />
    if (error) return <p>Error: {error.message}</p>

    const displayName = user?.displayName
    const [firstName, ...rest] = (displayName || '').split(' ')
    const lastName = rest.join(' ')

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (cropImageSrc) {
                URL.revokeObjectURL(cropImageSrc)
            }
            setImageFile(file)
            setCropImageSrc(URL.createObjectURL(file))
            setCrop({ x: 0, y: 0 })
            setZoom(1)
            setCroppedAreaPixels(null)
        }
    }

    const handleCropComplete = (_croppedArea: Area, croppedArea: Area) => {
        setCroppedAreaPixels(croppedArea)
    }

    const handleCropCancel = () => {
        if (cropImageSrc) {
            URL.revokeObjectURL(cropImageSrc)
        }
        setCropImageSrc(null)
        setImageFile(null)
        setCrop({ x: 0, y: 0 })
        setZoom(1)
        setCroppedAreaPixels(null)
        setIsCropping(false)
    }

    const handleCropConfirm = async () => {
        if (!cropImageSrc || !imageFile || !croppedAreaPixels) return

        setIsCropping(true)
        try {
            const blob = await getCroppedImg(
                cropImageSrc,
                croppedAreaPixels,
                imageFile.type || 'image/jpeg',
            )
            const extension = imageFile.name.split('.').pop() || 'jpg'
            const baseName = imageFile.name.replace(/\.[^/.]+$/, '') || 'image'
            const croppedFile = new File(
                [blob],
                `${baseName}-cropped.${extension}`,
                { type: imageFile.type || 'image/jpeg' },
            )
            const nextPreviewUrl = URL.createObjectURL(croppedFile)

            if (previewUrl?.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl)
            }
            URL.revokeObjectURL(cropImageSrc)

            setImageFile(croppedFile)
            setPreviewUrl(nextPreviewUrl)
            setCropImageSrc(null)
            setCrop({ x: 0, y: 0 })
            setZoom(1)
            setCroppedAreaPixels(null)
        } catch (error) {
            console.error('Error cropping image:', error)
        } finally {
            setIsCropping(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value, //works for all inputs, uses input's name and assigns the inputs's value
        }))
    }

    const clearPendingImageState = () => {
        setImageFile(null)
        if (previewUrl?.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl)
        }
        setPreviewUrl(null)
    }

    const upsertUserDirectoryEntry = async ({
        firstName,
        lastName,
        email,
        uid,
        photoURL,
    }: {
        firstName: string
        lastName: string
        email: string
        uid: string
        photoURL: string
    }) => {
        const usersQuery = query(
            collection(clientDb, 'users'),
            where('uid', '==', uid),
            limit(1),
        )
        const usersSnapshot = await getDocs(usersQuery)
        const userDocRef =
            usersSnapshot.docs[0]?.ref ?? doc(clientDb, 'users', uid)

        await setDoc(userDocRef, {
            name: `${firstName} ${lastName}`,
            email,
            uid,
            photoURL,
        })
    }

    const completeEmailChangeFlow = async (currentEmail: string) => {
        if (!user) return

        await upsertUserDirectoryEntry({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: currentEmail,
            uid: user.uid,
            photoURL: user.photoURL || '',
        })

        clearPendingImageState()
        sessionStorage.setItem(
            'postLogoutMessage',
            'Check your new email to verify the change, then sign in again.',
        )
        await signOut(auth)
        deleteCookie('idToken', { path: '/' })
        router.push('/login')
    }

    const closeReauthModal = () => {
        setShowReauthModal(false)
        setPendingEmailChange('')
        setReauthPassword('')
        setReauthError('')
    }

    const handleSave = async () => {
        if (!user || isSaving) return

        const trimmedEmail = formData.email.trim()
        const emailChanged = trimmedEmail !== (user.email || '')

        setIsSaving(true)
        setSaveError('')

        try {
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
            await user.reload()
            window.dispatchEvent(new Event('auth-profile-updated'))

            if (emailChanged) {
                await verifyBeforeUpdateEmail(user, trimmedEmail)
            }

            console.log('user name stored: ', auth.currentUser?.displayName)

            if (emailChanged) {
                await completeEmailChangeFlow(user.email || '')
                return
            }

            //add username and email to collection to allow display on client form "case manager" box
            await upsertUserDirectoryEntry({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: trimmedEmail,
                uid: user.uid,
                photoURL: photoURL || '',
            })

            clearPendingImageState()
            setShowSuccess(true)
            setIsEditing(false)
        } catch (error) {
            console.error('Error updating profile:', error)
            if (error instanceof FirebaseError) {
                if (
                    error.code === 'auth/requires-recent-login' &&
                    emailChanged
                ) {
                    setPendingEmailChange(trimmedEmail)
                    setReauthPassword('')
                    setReauthError('')
                    setSaveError('')
                    setShowReauthModal(true)
                    return
                }

                const messages: Record<string, string> = {
                    'auth/requires-recent-login':
                        'Please log in again before changing your email.',
                    'auth/operation-not-allowed':
                        'Please verify the email-change link sent to your new address before signing in again.',
                    'auth/email-already-in-use':
                        'That email address is already in use.',
                    'auth/invalid-email': 'Please enter a valid email address.',
                }

                setSaveError(messages[error.code] ?? error.message)
            } else if (error instanceof Error) {
                setSaveError(error.message)
            } else {
                setSaveError('Unable to save your changes right now.')
            }
        } finally {
            setIsSaving(false)
        }
    }

    const handleReauthenticate = async () => {
        if (!user || !user.email || !pendingEmailChange || !reauthPassword) {
            setReauthError('Enter your current password to continue.')
            return
        }

        setIsReauthenticating(true)
        setReauthError('')

        try {
            const credential = EmailAuthProvider.credential(
                user.email,
                reauthPassword,
            )
            await reauthenticateWithCredential(user, credential)
            await verifyBeforeUpdateEmail(user, pendingEmailChange)
            closeReauthModal()
            await completeEmailChangeFlow(user.email || '')
        } catch (error) {
            console.error('Error reauthenticating user:', error)
            if (error instanceof FirebaseError) {
                const messages: Record<string, string> = {
                    'auth/invalid-credential':
                        'Incorrect password. Please try again.',
                    'auth/wrong-password':
                        'Incorrect password. Please try again.',
                    'auth/too-many-requests':
                        'Too many attempts. Please wait a few minutes and try again.',
                    'auth/email-already-in-use':
                        'That email address is already in use.',
                    'auth/invalid-email': 'Please enter a valid email address.',
                }

                setReauthError(messages[error.code] ?? error.message)
            } else if (error instanceof Error) {
                setReauthError(error.message)
            } else {
                setReauthError('Unable to verify your password right now.')
            }
        } finally {
            setIsReauthenticating(false)
        }
    }

    const handleCancel = () => {
        setIsEditing(false)
        setSaveError('')
        closeReauthModal()
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
        if (cropImageSrc) {
            URL.revokeObjectURL(cropImageSrc)
        }
        clearPendingImageState()
        setCropImageSrc(null)
        setCrop({ x: 0, y: 0 })
        setZoom(1)
        setCroppedAreaPixels(null)
    }

    return (
        <div className="m-[48px] space-y-[40px]">
            {/* Header */}
            <h1 className="text-6xl font-bold">Settings</h1>
            {saveError && <p className="text-sm text-red-500">{saveError}</p>}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <Card className="w-fit rounded px-4 py-2 text-center">
                        User info saved!
                    </Card>
                </div>
            )}
            {showReauthModal &&
                createPortal(
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
                        onClick={closeReauthModal}
                    >
                        <Card
                            className="relative w-full max-w-md rounded-lg bg-white p-0 shadow-lg"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                type="button"
                                onClick={closeReauthModal}
                                disabled={isReauthenticating}
                                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center text-gray-500 disabled:opacity-50"
                                aria-label="Close"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M18 6 6 18" />
                                    <path d="m6 6 12 12" />
                                </svg>
                            </button>
                            <div className="flex w-full flex-col space-y-[24px] p-[36px]">
                                <h2 className="text-center text-[24px] font-[600]">
                                    Confirm Your Password
                                </h2>
                                <p className="text-center text-[16px] text-gray-600">
                                    Enter your current password to continue
                                    changing your email to {pendingEmailChange}.
                                </p>
                                <div>
                                    <input
                                        type="password"
                                        value={reauthPassword}
                                        onChange={(e) =>
                                            setReauthPassword(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                void handleReauthenticate()
                                            }
                                        }}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                                        placeholder="Current password"
                                        autoFocus
                                    />
                                    {reauthError && (
                                        <p className="mt-2 text-sm text-red-500">
                                            {reauthError}
                                        </p>
                                    )}
                                </div>
                                <div className="flex justify-center gap-[12px]">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            void handleReauthenticate()
                                        }
                                        disabled={isReauthenticating}
                                        className="rounded-md bg-[#4EA0C9] px-4 py-2 text-white disabled:opacity-50"
                                    >
                                        {isReauthenticating
                                            ? 'Verifying...'
                                            : 'Continue'}
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </div>,
                    document.body,
                )}
            {cropImageSrc && (
                <div className="fixed inset-0 z-50 flex flex-col bg-black">
                    <div className="relative flex-1">
                        <Cropper
                            image={cropImageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            cropShape="round"
                            onCropChange={setCrop}
                            onCropComplete={handleCropComplete}
                            onZoomChange={setZoom}
                        />
                    </div>
                    <div className="flex justify-end gap-4 border-t border-gray-700 bg-black p-4">
                        <button
                            type="button"
                            onClick={handleCropCancel}
                            className="rounded-md px-4 py-2 text-white hover:bg-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleCropConfirm}
                            disabled={isCropping || !croppedAreaPixels}
                            className="rounded-md bg-white px-4 py-2 text-black hover:bg-gray-200 disabled:opacity-50"
                        >
                            {isCropping ? 'Cropping...' : 'Crop'}
                        </button>
                    </div>
                </div>
            )}

            {/* Profile Section */}
            <div className="mb-12 mt-8 flex flex-row items-start justify-between">
                <div className="flex w-full flex-col">
                    <div className="flex flex-row items-center justify-between">
                        <h2 className="mb-2 font-bold uppercase tracking-wider text-gray-400">
                            Profile
                        </h2>
                        <div>
                            {!isEditing && (
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
                    </div>
                </div>
            </div>
            {isEditing && (
                <div className="mb-12 flex justify-start space-x-[24px]">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="rounded-[5px] bg-[#4EA0C9] px-[20px] py-[16px] text-white hover:bg-[#246F95] disabled:opacity-50"
                    >
                        <div className="flex flex-row space-x-[8px]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="20px"
                                viewBox="0 -960 960 960"
                                width="20px"
                                fill="#FFFFFF"
                            >
                                <path d="M389-267 195-460l51-52 143 143 325-324 51 51-376 375Z" />
                            </svg>
                            {isSaving ? 'Saving...' : 'Save'}
                        </div>
                    </button>
                    <button
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="rounded-[5px] bg-[#1A1D20] px-[20px] py-[16px] text-white hover:bg-[#6D757F] disabled:opacity-50"
                    >
                        <div className="flex flex-row space-x-[8px]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="20px"
                                viewBox="0 -960 960 960"
                                width="20px"
                                fill="#FFFFFF"
                            >
                                <path d="m291-240-51-51 189-189-189-189 51-51 189 189 189-189 51 51-189 189 189 189-51 51-189-189-189 189Z" />
                            </svg>
                            Cancel
                        </div>
                    </button>
                </div>
            )}
            <div className="mb-12">
                <h2 className="mb-4 font-bold uppercase tracking-wider text-gray-400">
                    FAQ
                </h2>
                <FAQItem
                    question="Where can I find a walkthrough of the application?"
                    answer={
                        <>
                            You can find a walkthrough video{' '}
                            <a
                                href="https://drive.google.com/drive/folders/1pP9qxoG5GD0XCdVRzn2fRpz6O-eZ3rhP?usp=sharing"
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline"
                            >
                                here
                            </a>
                            .
                        </>
                    }
                />
                <FAQItem
                    question="Need to change your password?"
                    answer="To change your password, please log out and use the 'Forgot Password' button."
                />
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

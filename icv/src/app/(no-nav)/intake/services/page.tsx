'use client'

import { storage } from '@/data/firebase'
import { ServicesSchema } from '@/types/client-types'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    deleteObject,
    getDownloadURL,
    ref,
    uploadBytes,
} from 'firebase/storage'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { TypeOf } from 'zod'
import { useIntakeFormStore } from '../../../_lib/useIntakeFormStore'
import FileUpload from '../components/FileUpload'
import { CheckboxList } from '../components/MakeOptions'

interface Props {}

const MENTORING = [
    'Problem Solving/Decision Making',
    'Goal Setting',
    'Academic Support',
    'Group Mentoring',
    'Conflict Resolution',
    'Rumor Control Intervention',
]

const HOUSING = [
    'Emergency Shelter',
    'Hotel Voucher',
    'Shared Living',
    'Independent Living',
    'Management Companies',
    'Transportation',
]

const EDUTRAIN = [
    'Independent Studies',
    'Charter Schools',
    'Adult School/GED',
    'Vocational Training School',
    'Financial Aid/College Support',
]

const REFERRAL = [
    'Legal Assistance/Food Pantry',
    'DV Crisis Support',
    'Reentry Services',
    'Immigration Services',
    'Financial Literacy',
    'Anger Management',
    'Financial Assistance Programs (SNAP/Cal/Works)',
]

const PERSONAL_DEV = [
    'Job Readiness',
    'Employment Assistance',
    'Career Development',
    'Creativity & Personal Expression',
]

const REDIRECTION = [
    'Emergency Shelter',
    'Human Trafficking Resources',
    'Personal Development',
    'Domestic Violence Resources',
    'Transportation',
    'Informal Case Management',
]

const HEALTH_WELLNESS = [
    'Mental Health',
    'Medical Services',
    'Substance Abuse Treatment',
    'Basic Needs Support',
]

const Page = (props: Props) => {
    const { form: loadedForm, updateForm } = useIntakeFormStore()
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    type ServiceType = TypeOf<typeof ServicesSchema>

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<ServiceType>({
        mode: 'onChange',
        resolver: zodResolver(ServicesSchema),
        defaultValues: loadedForm,
    })

    const router = useRouter()

    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
        field: string,
        name: string,
    ) => {
        console.log('in image func!')
        // was a file selected and is it in the input field?
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files)
            const fileNames = files.map((file) => file.name)

            updateForm({ [name]: fileNames })

            const oldImageUrls = loadedForm?.[field as keyof typeof loadedForm]

            if (oldImageUrls && Array.isArray(oldImageUrls)) {
                // Delete all old images from Firebase Storage
                await Promise.all(
                    oldImageUrls.map(async (url) => {
                        const oldImageRef = ref(storage, url as string)
                        try {
                            await deleteObject(oldImageRef)
                            console.log(`Deleted old image: ${url}`)
                        } catch (error) {
                            console.error(
                                `Error deleting old image ${url}:`,
                                error,
                            )
                        }
                    }),
                )
            }
            // uploading new image
            const uploadPromises = files.map(async (file) => {
                const storageRef = ref(storage, file.name)
                try {
                    const snapshot = await uploadBytes(storageRef, file)
                    const downloadURL = await getDownloadURL(snapshot.ref)
                    console.log(`Uploaded file URL: ${downloadURL}`)
                    return downloadURL
                } catch (error) {
                    console.error(`Error uploading file ${file.name}:`, error)
                    return null
                }
            })

            const downloadURLs = (await Promise.all(uploadPromises)).filter(
                Boolean,
            ) // Remove null values

            if (downloadURLs.length > 0) {
                updateForm({ [field]: downloadURLs }) // Store new image URLs in Zustand
            }
        }
    }

    useEffect(() => {
        reset(loadedForm)
    }, [loadedForm, reset])

    useEffect(() => {
        const unsubscribe = watch((data) => {
            updateForm({
                ...data,
                mentoring: data.mentoring?.filter(
                    (item): item is string => item !== undefined,
                ),
                personalDev: data.personalDev?.filter(
                    (item): item is string => item !== undefined,
                ),
                housing: data.housing?.filter(
                    (item): item is string => item !== undefined,
                ),
                redirection: data.redirection?.filter(
                    (item): item is string => item !== undefined,
                ),
                education: data.education?.filter(
                    (item): item is string => item !== undefined,
                ),
                healthWellness: data.healthWellness?.filter(
                    (item): item is string => item !== undefined,
                ),
                referral: data.referral?.filter(
                    (item): item is string => item !== undefined,
                ),
            })
        }).unsubscribe
        console.log(loadedForm)
        console.log(errors)

        return unsubscribe
    }, [watch, loadedForm])

    const handleAddFile = (fileInputRef: React.RefObject<HTMLInputElement>) => {
        if (fileInputRef.current) {
            fileInputRef.current.click() // Trigger the file input click for the passed fileRef
        }
    }

    const deleteFile = async (
        index: number,
        fileName: string,
        field: string,
        nameField: string,
    ) => {
        const fileIndex = (
            loadedForm[nameField as keyof typeof loadedForm] as string[]
        ).indexOf(fileName)
        if (fileIndex === -1) {
            console.log('File name not found.')
            return
        }

        // Get the corresponding file URL from fileURLs using the index
        const fileURL = (
            loadedForm[field as keyof typeof loadedForm] as string[]
        )[fileIndex]
        if (!fileURL) {
            console.log('No URL found for the given file.')
            return
        }
        const fileRef = ref(storage, fileURL)

        try {
            console.log(fileURL)
            console.log(fileName)
            // Delete the file from Firebase Storage
            await deleteObject(fileRef)
            console.log(`File ${fileName} deleted successfully from storage.`)

            const fileIndex = (
                loadedForm[nameField as keyof typeof loadedForm] as string[]
            ).indexOf(fileName)
            if (fileIndex === -1) {
                console.log('File name not found.')
                return
            }

            const updatedFileURLs = (
                loadedForm[field as keyof typeof loadedForm] as string[]
            ).filter((_, index) => index !== fileIndex)
            const updatedFileNames = (
                loadedForm[nameField as keyof typeof loadedForm] as string[]
            ).filter((_, index) => index !== fileIndex)

            // Update the Zustand store with the new arrays
            updateForm({ [field]: updatedFileURLs })
            updateForm({ [nameField]: updatedFileNames })
        } catch (error) {
            console.error('Error deleting file:', error)
        }
    }
    const onSubmit = (data: ServiceType) => {
        console.log('in submit...', data)
        updateForm(data)
        router.push('/intake/confirmation')
    }

    const selectedMentoring = watch('mentoring') ?? []
    const selectedHousing = watch('housing') ?? []
    const selectedEducation = watch('education') ?? []
    const selectedReferral = watch('referral') ?? []
    const selectedPersonal = Array.isArray(watch('personalDev'))
        ? (watch('personalDev') ?? [])
        : []
    const selectedRedirection = watch('redirection') ?? []
    const selectedHealth = watch('healthWellness') ?? []

    return (
        <form
            className="space-y-[24px]"
            style={{ padding: '24px' }}
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="space-y-[24px]">
                <label className="font-['Epilogue'] text-[56px] font-bold leading-[72px] text-neutral-900">
                    Intake Form
                </label>
            </div>
            <div className="flex min-h-screen items-center justify-center">
                <div className="min-w-[800px] space-y-[60px]">
                    <div className="space-y-[60px]">
                        <label className="font-['Epilogue'] text-[40px] font-bold leading-[56px] text-neutral-900">
                            Services
                        </label>
                        <div className="grid grid-cols-2 gap-[12px]">
                            <div>
                                <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                    Mentoring
                                </label>
                                <CheckboxList
                                    options={MENTORING}
                                    selectedValues={selectedMentoring}
                                    onChange={(updatedMentoring) =>
                                        setValue('mentoring', updatedMentoring)
                                    }
                                    name="mentoring"
                                />
                            </div>
                            <div>
                                <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                    Personal Development
                                </label>
                                <CheckboxList
                                    options={PERSONAL_DEV}
                                    selectedValues={selectedPersonal}
                                    onChange={(updatedPersonal) =>
                                        setValue('personalDev', updatedPersonal)
                                    }
                                    name="redirection"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-[12px]">
                            <div>
                                <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                    Housing Assistance
                                </label>
                                <CheckboxList
                                    options={HOUSING}
                                    selectedValues={selectedHousing}
                                    onChange={(updatedHousing) =>
                                        setValue('housing', updatedHousing)
                                    }
                                    name="housing"
                                />
                            </div>
                            <div>
                                <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                    Redirection Program
                                </label>
                                <CheckboxList
                                    options={REDIRECTION}
                                    selectedValues={selectedRedirection}
                                    onChange={(updatedRedirection) =>
                                        setValue(
                                            'redirection',
                                            updatedRedirection,
                                        )
                                    }
                                    name="redirection"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-[12px]">
                            <div>
                                <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                    Education & Training Support
                                </label>
                                <CheckboxList
                                    options={EDUTRAIN}
                                    selectedValues={selectedEducation}
                                    onChange={(updatedEducation) =>
                                        setValue('education', updatedEducation)
                                    }
                                    name="education"
                                />
                            </div>
                            <div>
                                <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                    Health & Wellness Support
                                </label>
                                <CheckboxList
                                    options={HEALTH_WELLNESS}
                                    selectedValues={selectedHealth}
                                    onChange={(updatedHealth) =>
                                        setValue(
                                            'healthWellness',
                                            updatedHealth,
                                        )
                                    }
                                    name="healthWellness"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                Referrals/Linkages Services
                            </label>
                            <CheckboxList
                                options={REFERRAL}
                                selectedValues={selectedReferral}
                                onChange={(updatedReferral) =>
                                    setValue('referral', updatedReferral)
                                }
                                name="referral"
                            />
                        </div>
                        {/* ADDITIONAL FEATURES */}
                        <div className="space-y-[32px]">
                            {/* Image */}
                            <FileUpload
                                label="Image"
                                fileName={loadedForm.clientImageName?.filter(
                                    (name): name is string =>
                                        name !== undefined,
                                )}
                                handleFileChange={handleImageChange}
                                handleAddFile={handleAddFile}
                                deleteFile={deleteFile}
                                field="clientImage"
                                nameField="clientImageName"
                                buttonText="Add image"
                            />
                            {/* ID */}
                            <FileUpload
                                label="ID"
                                fileName={loadedForm.clientIDName?.filter(
                                    (name): name is string =>
                                        name !== undefined,
                                )}
                                handleFileChange={handleImageChange}
                                handleAddFile={handleAddFile}
                                deleteFile={deleteFile}
                                field="clientID"
                                nameField="clientIDName"
                                buttonText="Add ID"
                            />
                            {/* Passport */}
                            <FileUpload
                                label="Passport"
                                fileName={loadedForm.clientPassportName?.filter(
                                    (name): name is string =>
                                        name !== undefined,
                                )}
                                handleFileChange={handleImageChange}
                                handleAddFile={handleAddFile}
                                deleteFile={deleteFile}
                                field="clientPassport"
                                nameField="clientPassportName"
                                buttonText="Add passport"
                            />
                            {/* MediCal */}
                            <FileUpload
                                label="MediCal"
                                fileName={loadedForm.clientMedName?.filter(
                                    (name): name is string =>
                                        name !== undefined,
                                )}
                                handleFileChange={handleImageChange}
                                handleAddFile={handleAddFile}
                                deleteFile={deleteFile}
                                field="clientMed"
                                nameField="clientMedName"
                                buttonText="Add MediCal"
                            />

                            {/* SSN */}
                            <FileUpload
                                label="SSN"
                                fileName={loadedForm.clientSSNName?.filter(
                                    (name): name is string =>
                                        name !== undefined,
                                )}
                                handleFileChange={handleImageChange}
                                handleAddFile={handleAddFile}
                                deleteFile={deleteFile}
                                field="clientSSN"
                                nameField="clientSSNName"
                                buttonText="Add SSN"
                            />
                            {/* Birth Certificate */}
                            <FileUpload
                                label="Birth Certificate"
                                fileName={loadedForm.clientBCName?.filter(
                                    (name): name is string =>
                                        name !== undefined,
                                )}
                                handleFileChange={handleImageChange}
                                handleAddFile={handleAddFile}
                                deleteFile={deleteFile}
                                field="clientBC"
                                nameField="clientBCName"
                                buttonText="Add birth certificate"
                            />
                            {/* Other Files */}
                            <FileUpload
                                label="Other Files"
                                fileName={loadedForm.otherFilesName?.filter(
                                    (name): name is string =>
                                        name !== undefined,
                                )}
                                handleFileChange={handleImageChange}
                                handleAddFile={handleAddFile}
                                deleteFile={deleteFile}
                                field="otherFiles"
                                nameField="otherFilesName"
                                buttonText="Add other files"
                            />
                        </div>
                        {/* Notes */}
                        <div>
                            <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                Additional Notes
                            </label>
                            <div>
                                <textarea
                                    {...register('notes')}
                                    placeholder="Text"
                                    className="w-[80%] rounded border p-2"
                                />
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={() =>
                                    router.push('/intake/background')
                                }
                                className="rounded-[5px] bg-neutral-900 px-4 py-2 text-white"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                className="rounded-[5px] bg-neutral-900 px-4 py-2 text-white"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default Page

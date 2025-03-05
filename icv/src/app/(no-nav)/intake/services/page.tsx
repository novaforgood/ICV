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
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            const fileName = file.name

            updateForm({ [name]: fileName })

            // get the old image URL if it exists (from zustand)
            const oldImageUrl = loadedForm?.[field as keyof typeof loadedForm]

            // if there's an old image, delete it from Firebase Storage
            if (oldImageUrl) {
                const oldImageRef = ref(storage, oldImageUrl as string) // ref to the old image
                try {
                    await deleteObject(oldImageRef)
                    console.log('Old image deleted successfully')
                } catch (error) {
                    console.error('Error deleting old image:', error)
                }
            }

            // uploading new image
            const storageRef = ref(storage, `${file.name}`)
            try {
                const snapshot = await uploadBytes(storageRef, file)
                // retrieve download URL from firebase storage
                const downloadURL = await getDownloadURL(snapshot.ref)

                console.log('Uploaded file URL:', downloadURL)

                // stores image URL in zustand for specified field
                updateForm({ [field]: downloadURL })
            } catch (error) {
                console.error('Error uploading file:', error)
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

    const deleteFile = async (fieldName: string, fileName: string) => {
        // Get the old image URL (from Zustand or loadedForm)
        const oldImageUrl = loadedForm?.[fieldName as keyof typeof loadedForm] // from loadedForm
        // Or if you're using Zustand
        // const oldImageUrl = useFileStore.getState().clientImageURL

        if (oldImageUrl) {
            const oldImageRef = ref(storage, oldImageUrl as string) // Create a reference to the file

            try {
                await deleteObject(oldImageRef) // Delete the file
                console.log('Old image deleted successfully')

                updateForm({ [fieldName]: null })
                updateForm({ [fileName]: null })
            } catch (error) {
                console.error('Error deleting old image:', error)
            }
        } else {
            console.log('No old image URL found to delete')
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

    const fileInputRefImage = useRef<HTMLInputElement>(null!)
    const fileInputRefID = useRef<HTMLInputElement>(null!)
    const fileInputRefP = useRef<HTMLInputElement>(null!)
    const fileInputRefM = useRef<HTMLInputElement>(null!)
    const fileInputRefS = useRef<HTMLInputElement>(null!)
    const fileInputRefBC = useRef<HTMLInputElement>(null!)
    const fileInputRefO = useRef<HTMLInputElement>(null!)

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
                            <div className="space-y-[24px]">
                                <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                    Image
                                </label>
                                <div className="space-y-[24px]">
                                    {loadedForm.clientImageName && (
                                        <div className="flex justify-between">
                                            <p>
                                                {' '}
                                                {
                                                    loadedForm.clientImageName
                                                }{' '}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    deleteFile(
                                                        'clientImage',
                                                        'clientImageName',
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleAddFile(fileInputRefImage)
                                        }
                                        className="flex h-[52px] items-center justify-center gap-[8px] rounded-[5px] bg-[#27262A] px-[12px] py-[16px] text-white"
                                    >
                                        + Add Image
                                    </button>
                                    <input
                                        ref={fileInputRefImage}
                                        type="file"
                                        onChange={(e) =>
                                            handleImageChange(
                                                e,
                                                'clientImage',
                                                'clientImageName',
                                            )
                                        }
                                        className="hidden" // Hide the actual file input
                                    />
                                </div>
                            </div>
                            {/* ID */}
                            <div className="space-y-[24px]">
                                <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                    ID
                                </label>
                                {loadedForm.clientIDName && (
                                    <div className="flex justify-between">
                                        <p> {loadedForm.clientIDName} </p>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                deleteFile(
                                                    'clientID',
                                                    'clientIDName',
                                                )
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                                <div className="space-y-[24px]">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleAddFile(fileInputRefID)
                                        }
                                        className="flex h-[52px] items-center justify-center gap-[8px] rounded-[5px] bg-[#27262A] px-[12px] py-[16px] text-white"
                                    >
                                        + Add ID
                                    </button>
                                    <input
                                        ref={fileInputRefID}
                                        type="file"
                                        onChange={(e) =>
                                            handleImageChange(
                                                e,
                                                'clientID',
                                                'clientIDName',
                                            )
                                        }
                                        className="hidden"
                                    />
                                </div>
                            </div>
                            {/* Passport */}
                            <div className="space-y-[24px]">
                                <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                    Passport
                                </label>
                                {loadedForm.clientPassportName && (
                                    <div className="flex justify-between">
                                        <p> {loadedForm.clientPassportName} </p>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                deleteFile(
                                                    'clientPassport',
                                                    'clientPassportName',
                                                )
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                                <div className="space-y-[24px]">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleAddFile(fileInputRefP)
                                        }
                                        className="flex h-[52px] items-center justify-center gap-[8px] rounded-[5px] bg-[#27262A] px-[12px] py-[16px] text-white"
                                    >
                                        + passport
                                    </button>
                                    <input
                                        ref={fileInputRefP}
                                        type="file"
                                        onChange={(e) =>
                                            handleImageChange(
                                                e,
                                                'clientPassport',
                                                'clientPassportName',
                                            )
                                        }
                                        className="hidden"
                                    />
                                </div>
                            </div>
                            {/* MediCal */}
                            <div className="space-y-[24px]">
                                <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                    MediCal
                                </label>
                                {loadedForm.clientMedName && (
                                    <div className="flex justify-between">
                                        <p> {loadedForm.clientMedName} </p>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                deleteFile(
                                                    'clientMed',
                                                    'clientMedName',
                                                )
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                                <div className="space-y-[24px]">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleAddFile(fileInputRefM)
                                        }
                                        className="flex h-[52px] items-center justify-center gap-[8px] rounded-[5px] bg-[#27262A] px-[12px] py-[16px] text-white"
                                    >
                                        + Add MediCal
                                    </button>
                                    <input
                                        ref={fileInputRefM}
                                        type="file"
                                        onChange={(e) =>
                                            handleImageChange(
                                                e,
                                                'clientMed',
                                                'clientMedName',
                                            )
                                        }
                                        className="hidden" // Hide the actual file input
                                    />
                                </div>
                            </div>

                            {/* SSN */}
                            <div className="space-y-[24px]">
                                <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                    SSN
                                </label>
                                {loadedForm.clientSSNName && (
                                    <div className="flex justify-between">
                                        <p> {loadedForm.clientSSNName} </p>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                deleteFile(
                                                    'clientSSN',
                                                    'clientSSNName',
                                                )
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                                <div className="space-y-[24px]">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleAddFile(fileInputRefS)
                                        }
                                        className="flex h-[52px] items-center justify-center gap-[8px] rounded-[5px] bg-[#27262A] px-[12px] py-[16px] text-white"
                                    >
                                        + Add SSN
                                    </button>
                                    <input
                                        ref={fileInputRefS}
                                        type="file"
                                        onChange={(e) =>
                                            handleImageChange(
                                                e,
                                                'clientSSN',
                                                'clientSSNName',
                                            )
                                        }
                                        className="hidden"
                                    />
                                </div>
                            </div>
                            {/* Birth Certificate */}
                            <div className="space-y-[24px]">
                                <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                    Birth Certificate
                                </label>
                                {loadedForm.clientBCName && (
                                    <div className="flex justify-between">
                                        <p> {loadedForm.clientBCName} </p>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                deleteFile(
                                                    'clientBC',
                                                    'clientBCName',
                                                )
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                                <div className="space-y-[24px]">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleAddFile(fileInputRefBC)
                                        }
                                        className="flex h-[52px] items-center justify-center gap-[8px] rounded-[5px] bg-[#27262A] px-[12px] py-[16px] text-white"
                                    >
                                        + Add birth certificate
                                    </button>
                                    <input
                                        ref={fileInputRefBC}
                                        type="file"
                                        onChange={(e) =>
                                            handleImageChange(
                                                e,
                                                'clientBC',
                                                'clientBCName',
                                            )
                                        }
                                        className="hidden"
                                    />
                                </div>
                            </div>
                            {/* Other Files */}
                            <div className="space-y-[24px]">
                                <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                    Other
                                </label>
                                {loadedForm.otherFilesName && (
                                    <div className="flex justify-between">
                                        <p> {loadedForm.otherFilesName} </p>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                deleteFile(
                                                    'otherFiles',
                                                    'otherFilesName',
                                                )
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                                <div className="space-y-[24px]">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleAddFile(fileInputRefO)
                                        }
                                        className="flex h-[52px] items-center justify-center gap-[8px] rounded-[5px] bg-[#27262A] px-[12px] py-[16px] text-white"
                                    >
                                        + Add other
                                    </button>
                                    <input
                                        ref={fileInputRefO}
                                        type="file"
                                        onChange={(e) =>
                                            handleImageChange(
                                                e,
                                                'otherFiles',
                                                'otherFilesName',
                                            )
                                        }
                                        className="hidden"
                                    />
                                </div>
                            </div>
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

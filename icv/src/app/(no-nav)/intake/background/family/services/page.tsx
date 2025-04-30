'use client'

import { storage } from '@/data/firebase'
import {
    EDUTRAIN,
    HEALTH_WELLNESS,
    HOUSING,
    MENTORING,
    PERSONAL_DEV,
    REDIRECTION,
    REFERRALSERVICE,
    ServicesSchema,
} from '@/types/client-types'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    deleteObject,
    getDownloadURL,
    ref,
    uploadBytes,
} from 'firebase/storage'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { TypeOf } from 'zod'
import FileUpload, { ResetButton } from '../../../../../_components/FileUpload'
import { CheckboxList } from '../../../../../_components/MakeOptions'
import { useIntakeFormStore } from '../../../../../_lib/useIntakeFormStore'

interface Props {}

const Page = (props: Props) => {
    const { form: loadedForm, updateForm } = useIntakeFormStore()
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

    const resetFiles = async (field: string, nameField: string) => {
        const oldImageUrls = loadedForm?.[field as keyof typeof loadedForm]

        if (oldImageUrls && Array.isArray(oldImageUrls)) {
            await Promise.all(
                oldImageUrls.map(async (url) => {
                    const oldImageRef = ref(storage, url as string)
                    try {
                        await deleteObject(oldImageRef)
                        console.log(`Deleted old image: ${url}`)
                        const updatedUrls = loadedForm?.[
                            field as keyof typeof loadedForm
                        ] as string[]
                        const updatedNames = loadedForm?.[
                            nameField as keyof typeof loadedForm
                        ] as string[]

                        updatedUrls.shift() // Remove the first element
                        updatedNames.shift() // Remove the first element

                        // Update the form state with the remaining items
                        updateForm({ [field]: updatedUrls })
                        updateForm({ [nameField]: updatedNames })
                    } catch (error) {
                        console.error(`Error deleting old image ${url}:`, error)
                    }
                }),
            )
            updateForm({ [field]: [] })
            updateForm({ [nameField]: [] })
        }
    }

    const deleteFile = async (
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
        router.push('/intake/background/family/services/confirmation')
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
            <div className="flex min-h-screen items-center justify-center">
                <div className="min-w-[800px] space-y-[60px]">
                    <div className="space-y-[60px]">
                        <label className="block text-center font-['Epilogue'] text-[40px] font-bold leading-[56px] text-neutral-900">
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
                                options={REFERRALSERVICE}
                                selectedValues={selectedReferral}
                                onChange={(updatedReferral) =>
                                    setValue('referral', updatedReferral)
                                }
                                name="referral"
                            />
                        </div>
                        <div className="space-y-[24px]">
                            <div className="flex items-center justify-between">
                                <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                    Profile Picture
                                </label>
                                <ResetButton
                                    fileName={loadedForm.clientImageName?.filter(
                                        (name): name is string =>
                                            name !== undefined,
                                    )}
                                    field="clientImage"
                                    nameField="clientImageName"
                                    resetFiles={resetFiles}
                                />
                            </div>

                            {/* Image */}
                            <FileUpload
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
                        </div>
                        {/* ADDITIONAL FEATURES */}
                        <div className="space-y-[32px]">
                            <div className="space-y-[24px]">
                                <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                    Documents
                                </label>
                            </div>
                            {/* ID */}
                            <div className="space-y-[4px]">
                                <div className="flex items-center justify-between">
                                    <label className="font-epilogue text-[16px] leading-[20px] text-[#000]">
                                        ID
                                    </label>
                                    {/* Reset Button */}
                                    <ResetButton
                                        fileName={loadedForm.clientIDName?.filter(
                                            (name): name is string =>
                                                name !== undefined,
                                        )}
                                        field="clientID"
                                        nameField="clientIDName"
                                        resetFiles={resetFiles}
                                    />
                                </div>
                                <FileUpload
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
                            </div>
                            {/* Passport */}
                            <div className="space-y-[4px]">
                                <div className="flex items-center justify-between">
                                    <label className="font-epilogue text-[16px] leading-[20px] text-[#000]">
                                        Passport
                                    </label>
                                    {/* Reset Button */}
                                    <ResetButton
                                        fileName={loadedForm.clientPassportName?.filter(
                                            (name): name is string =>
                                                name !== undefined,
                                        )}
                                        field="clientPassport"
                                        nameField="clientPassportName"
                                        resetFiles={resetFiles}
                                    />
                                </div>
                                <FileUpload
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
                            </div>

                            <div className="space-y-[4px]">
                                <div className="flex items-center justify-between">
                                    <label className="font-epilogue text-[16px] leading-[20px] text-[#000]">
                                        MediCal
                                    </label>
                                    {/* Reset Button */}
                                    <ResetButton
                                        fileName={loadedForm.clientMed?.filter(
                                            (name): name is string =>
                                                name !== undefined,
                                        )}
                                        field="clientMed"
                                        nameField="clientMedName"
                                        resetFiles={resetFiles}
                                    />
                                </div>
                                {/* MediCal */}
                                <FileUpload
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
                            </div>

                            <div className="space-y-[4px]">
                                <div className="flex items-center justify-between">
                                    <label className="font-epilogue text-[16px] leading-[20px] text-[#000]">
                                        SSN
                                    </label>
                                    {/* Reset Button */}
                                    <ResetButton
                                        fileName={loadedForm.clientSSNName?.filter(
                                            (name): name is string =>
                                                name !== undefined,
                                        )}
                                        field="clientSSN"
                                        nameField="clientSSNName"
                                        resetFiles={resetFiles}
                                    />
                                </div>
                                {/* SSN */}
                                <FileUpload
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
                            </div>

                            <div className="space-y-[4px]">
                                <div className="flex items-center justify-between">
                                    <label className="font-epilogue text-[16px] leading-[20px] text-[#000]">
                                        Birth certificate
                                    </label>
                                    {/* Reset Button */}
                                    <ResetButton
                                        fileName={loadedForm.clientBCName?.filter(
                                            (name): name is string =>
                                                name !== undefined,
                                        )}
                                        field="clientBC"
                                        nameField="clientBCName"
                                        resetFiles={resetFiles}
                                    />
                                </div>
                                {/* Birth Certificate */}
                                <FileUpload
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
                            </div>

                            <div className="space-y-[4px]">
                                <div className="flex items-center justify-between">
                                    <label className="font-epilogue text-[16px] leading-[20px] text-[#000]">
                                        Other
                                    </label>
                                    {/* Reset Button */}
                                    <ResetButton
                                        fileName={loadedForm.otherFilesName?.filter(
                                            (name): name is string =>
                                                name !== undefined,
                                        )}
                                        field="otherFiles"
                                        nameField="otherFilesName"
                                        resetFiles={resetFiles}
                                    />
                                </div>
                                {/* Other Files */}
                                <FileUpload
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
                        </div>
                        {/* Notes */}
                        <div className="space-y-[24px]">
                            <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                Additional Notes
                            </label>
                            <div>
                                <textarea
                                    {...register('notes')}
                                    placeholder="Text"
                                    className="w-full rounded border p-2"
                                />
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={() =>
                                    router.push('/intake/background/family')
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

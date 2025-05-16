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
    ) => {
        console.log('in image func!')
        // was a file selected and is it in the input field?
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files)

            // uploading new image
            const uploadPromises = files.map(async (file) => {
                const storageRef = ref(storage, file.name)
                try {
                    const snapshot = await uploadBytes(storageRef, file)
                    const downloadURL = await getDownloadURL(snapshot.ref)
                    console.log(`Uploaded file URL: ${downloadURL}`)
                    return { name: file.name, uri: downloadURL }
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
        console.log('in frontend here files', loadedForm.clientIDocs)
    }, [loadedForm.clientIDocs])

    useEffect(() => {
        reset(loadedForm)
    }, [loadedForm, reset])

    useEffect(() => {
        const unsubscribe = watch((data) => {
            updateForm({
                ...data,
                mentoring: data.mentoring?.filter(
                    (item): item is string => !!item,
                ),
                personalDev: data.personalDev?.filter(
                    (item): item is string => !!item,
                ),
                housing: data.housing?.filter((item): item is string => !!item),
                redirection: data.redirection?.filter(
                    (item): item is string => !!item,
                ),
                education: data.education?.filter(
                    (item): item is string => !!item,
                ),
                healthWellness: data.healthWellness?.filter(
                    (item): item is string => !!item,
                ),
                referral: data.referral?.filter(
                    (item): item is string => !!item,
                ),
                clientPic: data.clientPic?.filter(
                    (item): item is { uri: string; name?: string } =>
                        !!item?.uri,
                ),
                clientIDocs: data.clientIDocs?.filter(
                    (item): item is { uri: string; name?: string } =>
                        !!item?.uri,
                ),
                clientPassport: data.clientPassport?.filter(
                    (item): item is { uri: string; name?: string } =>
                        !!item?.uri,
                ),
                clientMediCal: data.clientMediCal?.filter(
                    (item): item is { uri: string; name?: string } =>
                        !!item?.uri,
                ),
                clientSSN: data.clientSSN?.filter(
                    (item): item is { uri: string; name?: string } =>
                        !!item?.uri,
                ),
                clientBC: data.clientBC?.filter(
                    (item): item is { uri: string; name?: string } =>
                        !!item?.uri,
                ),
                otherFiles: data.otherFiles?.filter(
                    (item): item is { uri: string; name?: string } =>
                        !!item?.uri,
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

    const resetFiles = async (field: string) => {
        const oldFiles = loadedForm?.[field as keyof typeof loadedForm]

        if (Array.isArray(oldFiles)) {
            await Promise.all(
                (oldFiles as { uri: string }[]).map(async (file) => {
                    const fileRef = ref(storage, file.uri)
                    try {
                        await deleteObject(fileRef)
                        console.log(`Deleted file: ${file.uri}`)
                    } catch (error) {
                        console.error(`Error deleting file ${file.uri}:`, error)
                    }
                }),
            )
            updateForm({ [field]: [] })
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
                                        data={{
                                            ...loadedForm,
                                            clientPic:
                                                loadedForm.clientPic ?? [],
                                            clientIDocs:
                                                loadedForm.clientIDocs ?? [],
                                            clientPassport:
                                                loadedForm.clientPassport ?? [],
                                            clientMediCal:
                                                loadedForm.clientMediCal ?? [],
                                            clientSSN:
                                                loadedForm.clientSSN ?? [],
                                            clientBC: loadedForm.clientBC ?? [],
                                            otherFiles:
                                                loadedForm.otherFiles ?? [],
                                        }}
                                        field="clientPic"
                                        resetFiles={resetFiles}
                                    />
                                </div>
                                <FileUpload
                                    data={{
                                        ...loadedForm,
                                        clientPic: loadedForm.clientPic ?? [],
                                        clientIDocs:
                                            loadedForm.clientIDocs ?? [],
                                        clientPassport:
                                            loadedForm.clientPassport ?? [],
                                        clientMediCal:
                                            loadedForm.clientMediCal ?? [],
                                        clientSSN: loadedForm.clientSSN ?? [],
                                        clientBC: loadedForm.clientBC ?? [],
                                        otherFiles: loadedForm.otherFiles ?? [],
                                    }}
                                    handleFileChange={handleImageChange}
                                    handleAddFile={handleAddFile}
                                    field="clientPic"
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
                                        data={{
                                            ...loadedForm,
                                            clientPic:
                                                loadedForm.clientPic ?? [],
                                            clientIDocs:
                                                loadedForm.clientIDocs ?? [],
                                            clientPassport:
                                                loadedForm.clientPassport ?? [],
                                            clientMediCal:
                                                loadedForm.clientMediCal ?? [],
                                            clientSSN:
                                                loadedForm.clientSSN ?? [],
                                            clientBC: loadedForm.clientBC ?? [],
                                            otherFiles:
                                                loadedForm.otherFiles ?? [],
                                        }}
                                        field="clientIDocs"
                                        resetFiles={resetFiles}
                                    />
                                </div>
                                <FileUpload
                                    data={{
                                        ...loadedForm,
                                        clientPic: loadedForm.clientPic ?? [],
                                        clientIDocs:
                                            loadedForm.clientIDocs ?? [],
                                        clientPassport:
                                            loadedForm.clientPassport ?? [],
                                        clientMediCal:
                                            loadedForm.clientMediCal ?? [],
                                        clientSSN: loadedForm.clientSSN ?? [],
                                        clientBC: loadedForm.clientBC ?? [],
                                        otherFiles: loadedForm.otherFiles ?? [],
                                    }}
                                    handleFileChange={handleImageChange}
                                    handleAddFile={handleAddFile}
                                    field="clientIDocs"
                                    buttonText="Add ID"
                                />
                            </div>

                            <div className="space-y-[4px]">
                                <div className="flex items-center justify-between">
                                    <label className="font-epilogue text-[16px] leading-[20px] text-[#000]">
                                        Passport
                                    </label>

                                    <ResetButton
                                        data={{
                                            ...loadedForm,
                                            clientPic:
                                                loadedForm.clientPic ?? [],
                                            clientIDocs:
                                                loadedForm.clientIDocs ?? [],
                                            clientPassport:
                                                loadedForm.clientPassport ?? [],
                                            clientMediCal:
                                                loadedForm.clientMediCal ?? [],
                                            clientSSN:
                                                loadedForm.clientSSN ?? [],
                                            clientBC: loadedForm.clientBC ?? [],
                                            otherFiles:
                                                loadedForm.otherFiles ?? [],
                                        }}
                                        field="clientPassport"
                                        resetFiles={resetFiles}
                                    />
                                </div>
                                <FileUpload
                                    data={{
                                        ...loadedForm,
                                        clientPic: loadedForm.clientPic ?? [],
                                        clientIDocs:
                                            loadedForm.clientIDocs ?? [],
                                        clientPassport:
                                            loadedForm.clientPassport ?? [],
                                        clientMediCal:
                                            loadedForm.clientMediCal ?? [],
                                        clientSSN: loadedForm.clientSSN ?? [],
                                        clientBC: loadedForm.clientBC ?? [],
                                        otherFiles: loadedForm.otherFiles ?? [],
                                    }}
                                    handleFileChange={handleImageChange}
                                    handleAddFile={handleAddFile}
                                    field="clientPassport"
                                    buttonText="Add passport"
                                />
                            </div>

                            <div className="space-y-[4px]">
                                <div className="flex items-center justify-between">
                                    <label className="font-epilogue text-[16px] leading-[20px] text-[#000]">
                                        MediCal
                                    </label>
               
                                    <ResetButton
                                        data={{
                                            ...loadedForm,
                                            clientPic:
                                                loadedForm.clientPic ?? [],
                                            clientIDocs:
                                                loadedForm.clientIDocs ?? [],
                                            clientPassport:
                                                loadedForm.clientPassport ?? [],
                                            clientMediCal:
                                                loadedForm.clientMediCal ?? [],
                                            clientSSN:
                                                loadedForm.clientSSN ?? [],
                                            clientBC: loadedForm.clientBC ?? [],
                                            otherFiles:
                                                loadedForm.otherFiles ?? [],
                                        }}
                                        field="clientMediCal"
                                        resetFiles={resetFiles}
                                    />
                                </div>
                                <FileUpload
                                    data={{
                                        ...loadedForm,
                                        clientPic: loadedForm.clientPic ?? [],
                                        clientIDocs:
                                            loadedForm.clientIDocs ?? [],
                                        clientPassport:
                                            loadedForm.clientPassport ?? [],
                                        clientMediCal:
                                            loadedForm.clientMediCal ?? [],
                                        clientSSN: loadedForm.clientSSN ?? [],
                                        clientBC: loadedForm.clientBC ?? [],
                                        otherFiles: loadedForm.otherFiles ?? [],
                                    }}
                                    handleFileChange={handleImageChange}
                                    handleAddFile={handleAddFile}
                                    field="clientMediCal"
                                    buttonText="Add MediCal"
                                />
                            </div>

                            <div className="space-y-[4px]">
                                <div className="flex items-center justify-between">
                                    <label className="font-epilogue text-[16px] leading-[20px] text-[#000]">
                                        SSN
                                    </label>
                                    <ResetButton
                                        data={{
                                            ...loadedForm,
                                            clientPic:
                                                loadedForm.clientPic ?? [],
                                            clientIDocs:
                                                loadedForm.clientIDocs ?? [],
                                            clientPassport:
                                                loadedForm.clientPassport ?? [],
                                            clientMediCal:
                                                loadedForm.clientMediCal ?? [],
                                            clientSSN:
                                                loadedForm.clientSSN ?? [],
                                            clientBC: loadedForm.clientBC ?? [],
                                            otherFiles:
                                                loadedForm.otherFiles ?? [],
                                        }}
                                        field="clientSSN"
                                        resetFiles={resetFiles}
                                    />
                                </div>
                                <FileUpload
                                    data={{
                                        ...loadedForm,
                                        clientPic: loadedForm.clientPic ?? [],
                                        clientIDocs:
                                            loadedForm.clientIDocs ?? [],
                                        clientPassport:
                                            loadedForm.clientPassport ?? [],
                                        clientMediCal:
                                            loadedForm.clientMediCal ?? [],
                                        clientSSN: loadedForm.clientSSN ?? [],
                                        clientBC: loadedForm.clientBC ?? [],
                                        otherFiles: loadedForm.otherFiles ?? [],
                                    }}
                                    handleFileChange={handleImageChange}
                                    handleAddFile={handleAddFile}
                                    field="clientSSN"
                                    buttonText="Add SSN"
                                />
                            </div>

                            <div className="space-y-[4px]">
                                <div className="flex items-center justify-between">
                                    <label className="font-epilogue text-[16px] leading-[20px] text-[#000]">
                                        Birth certificate
                                    </label>
                        
                                    <ResetButton
                                        data={{
                                            ...loadedForm,
                                            clientPic:
                                                loadedForm.clientPic ?? [],
                                            clientIDocs:
                                                loadedForm.clientIDocs ?? [],
                                            clientPassport:
                                                loadedForm.clientPassport ?? [],
                                            clientMediCal:
                                                loadedForm.clientMediCal ?? [],
                                            clientSSN:
                                                loadedForm.clientSSN ?? [],
                                            clientBC: loadedForm.clientBC ?? [],
                                            otherFiles:
                                                loadedForm.otherFiles ?? [],
                                        }}
                                        field="clientBC"
                                        resetFiles={resetFiles}
                                    />
                                </div>
                                <FileUpload
                                    data={{
                                        ...loadedForm,
                                        clientPic: loadedForm.clientPic ?? [],
                                        clientIDocs:
                                            loadedForm.clientIDocs ?? [],
                                        clientPassport:
                                            loadedForm.clientPassport ?? [],
                                        clientMediCal:
                                            loadedForm.clientMediCal ?? [],
                                        clientSSN: loadedForm.clientSSN ?? [],
                                        clientBC: loadedForm.clientBC ?? [],
                                        otherFiles: loadedForm.otherFiles ?? [],
                                    }}
                                    handleFileChange={handleImageChange}
                                    handleAddFile={handleAddFile}
                                    field="clientBC"
                                    buttonText="Add birth certificate"
                                />
                            </div>

                            <div className="space-y-[4px]">
                                <div className="flex items-center justify-between">
                                    <label className="font-epilogue text-[16px] leading-[20px] text-[#000]">
                                        Other
                                    </label>
                             
                                    <ResetButton
                                        data={{
                                            ...loadedForm,
                                            clientPic:
                                                loadedForm.clientPic ?? [],
                                            clientIDocs:
                                                loadedForm.clientIDocs ?? [],
                                            clientPassport:
                                                loadedForm.clientPassport ?? [],
                                            clientMediCal:
                                                loadedForm.clientMediCal ?? [],
                                            clientSSN:
                                                loadedForm.clientSSN ?? [],
                                            clientBC: loadedForm.clientBC ?? [],
                                            otherFiles:
                                                loadedForm.otherFiles ?? [],
                                        }}
                                        field="otherFiles"
                                        resetFiles={resetFiles}
                                    />
                                </div>
                                <FileUpload
                                    data={{
                                        ...loadedForm,
                                        clientPic: loadedForm.clientPic ?? [],
                                        clientIDocs:
                                            loadedForm.clientIDocs ?? [],
                                        clientPassport:
                                            loadedForm.clientPassport ?? [],
                                        clientMediCal:
                                            loadedForm.clientMediCal ?? [],
                                        clientSSN: loadedForm.clientSSN ?? [],
                                        clientBC: loadedForm.clientBC ?? [],
                                        otherFiles: loadedForm.otherFiles ?? [],
                                    }}
                                    handleFileChange={handleImageChange}
                                    handleAddFile={handleAddFile}
                                    field="otherFiles"
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
                                    {...register('additionalNotes')}
                                    placeholder="Text"
                                    className="min-h-[100px] w-full resize-y overflow-auto rounded border p-2"
                                    rows={4}
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

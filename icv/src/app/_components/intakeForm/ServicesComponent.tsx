'use client'

import { auth, storage } from '@/data/firebase'
import {
    EDUTRAIN,
    HEALTH_WELLNESS,
    HOUSING,
    MENTORING,
    NewClient,
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
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { TypeOf } from 'zod'
import FileUpload, { ResetButton } from './FileUpload'
import { CheckboxList } from './MakeOptions'

interface Props {
    formType: Partial<NewClient>
    updateForm: (form: Partial<NewClient>) => void
    onSubmitNew?: (data: NewClient) => void
    onSubmitEdit?: (data: NewClient) => void
    onCancel?: () => void
    submitType: 'save' | 'new'
    titleStyle: string
    /** Optional style for file upload labels (ID, Passport, etc.). Defaults to titleStyle. */
    fileUploadLabelStyle?: string
}

type ServiceType = TypeOf<typeof ServicesSchema>

export const ServicesSection: React.FC<Props> = ({
    formType,
    updateForm,
    onSubmitNew,
    onSubmitEdit,
    onCancel,
    submitType,
    titleStyle,
    fileUploadLabelStyle,
}) => {
    const router = useRouter()

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
        defaultValues: formType,
    })

    const [uploadingField, setUploadingField] = useState<string | null>(null)

    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
        field: string,
    ) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files)

            setUploadingField(field)

            const uploadPromises = files.map(async (file) => {
                // generate unique path for each file
                const path = `uploads/${auth.currentUser?.uid}/${field}/${crypto.randomUUID()}/${file.name}`
                const storageRef = ref(storage, path)
                try {
                    const snapshot = await uploadBytes(storageRef, file)
                    const downloadURL = await getDownloadURL(snapshot.ref)
                    return { name: file.name, uri: downloadURL }
                } catch (error) {
                    console.error(`Error uploading file ${file.name}:`, error)
                    return null
                }
            })

            const downloadURLs = (await Promise.all(uploadPromises)).filter(
                Boolean,
            )
            if (downloadURLs.length > 0) {
                const existingFiles =
                    (formType[field as keyof typeof formType] as
                        | { name: string; uri: string }[]
                        | undefined) ?? []
                const existingArray = Array.isArray(existingFiles)
                    ? existingFiles
                    : []
                updateForm({
                    [field]: [...existingArray, ...downloadURLs],
                })
            }

            setUploadingField(null)
        }
    }

    const handleAddFile = (fileInputRef: React.RefObject<HTMLInputElement>) => {
        if (fileInputRef.current) fileInputRef.current.click()
    }

    const resetFiles = async (field: string) => {
        const oldFiles = formType?.[field as keyof typeof formType]
        if (Array.isArray(oldFiles)) {
            await Promise.all(
                (oldFiles as { uri: string }[]).map(async (file) => {
                    try {
                        await deleteObject(ref(storage, file.uri))
                        console.log(`Deleted file: ${file.uri}`)
                    } catch (error) {
                        console.error(`Error deleting file ${file.uri}:`, error)
                    }
                }),
            )
            updateForm({ [field]: [] })
        }
    }

    const removeFile = async (field: string, index: number) => {
        const oldFiles =
            (formType[field as keyof typeof formType] as
                | { name: string; uri: string }[]
                | undefined) ?? []
        const fileToRemove = oldFiles[index]
        if (!fileToRemove) return

        try {
            await deleteObject(ref(storage, fileToRemove.uri))
        } catch (error) {
            console.error(`Error deleting file ${fileToRemove.uri}:`, error)
        }

        const updated = oldFiles.filter((_, i) => i !== index)
        updateForm({ [field]: updated })
    }

    useEffect(() => {
        reset(formType)
    }, [formType, reset])

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
                    (item): item is { uri: string } => !!item?.uri,
                ),
                clientIDocs: data.clientIDocs?.filter(
                    (item): item is { uri: string } => !!item?.uri,
                ),
                clientPassport: data.clientPassport?.filter(
                    (item): item is { uri: string } => !!item?.uri,
                ),
                clientMediCal: data.clientMediCal?.filter(
                    (item): item is { uri: string } => !!item?.uri,
                ),
                clientSSN: data.clientSSN?.filter(
                    (item): item is { uri: string } => !!item?.uri,
                ),
                clientBC: data.clientBC?.filter(
                    (item): item is { uri: string } => !!item?.uri,
                ),
                otherFiles: data.otherFiles?.filter(
                    (item): item is { uri: string } => !!item?.uri,
                ),
            })
        }).unsubscribe

        return unsubscribe
    }, [watch, formType])

    const handleSubmitType = (data: ServiceType) => {
        if (submitType === 'save' && onSubmitEdit) {
            onSubmitEdit(data as NewClient)
        } else if (submitType === 'new' && onSubmitNew) {
            onSubmitNew(data as NewClient)
        }
    }

    const selected = {
        mentoring: watch('mentoring') ?? [],
        personalDev: watch('personalDev') ?? [],
        housing: watch('housing') ?? [],
        redirection: watch('redirection') ?? [],
        education: watch('education') ?? [],
        healthWellness: watch('healthWellness') ?? [],
        referral: watch('referral') ?? [],
    }

    return (
        <form
            className="space-y-[24px]"
            onSubmit={handleSubmit(handleSubmitType)}
        >
            <div className="flex min-h-screen items-center justify-center">
                <div className="w-full space-y-[48px]">
                    <div className="space-y-[24px]">
                        {titleStyle !=
                            "font-['Epilogue'] text-[28px] font-semibold leading-[40px] text-neutral-900" && (
                            <label className={titleStyle}>ICV SERVICES</label>
                        )}
                        {/* Grid Checkboxes */}
                        <div className="flex flex-col space-y-[24px] min-[800px]:grid min-[800px]:grid-cols-2 min-[800px]:gap-[12px]">
                            <div>
                                <label className="mb-[4px] block font-['Epilogue'] text-[16px] font-bold text-neutral-900">
                                    Mentoring
                                </label>
                                <CheckboxList
                                    options={MENTORING}
                                    selectedValues={selected.mentoring}
                                    onChange={(val) =>
                                        setValue('mentoring', val)
                                    }
                                    name="mentoring"
                                />
                            </div>
                            <div>
                                <label className="mb-[4px] block font-['Epilogue'] text-[16px] font-bold text-neutral-900">
                                    Personal Development
                                </label>
                                <CheckboxList
                                    options={PERSONAL_DEV}
                                    selectedValues={selected.personalDev}
                                    onChange={(val) =>
                                        setValue('personalDev', val)
                                    }
                                    name="personalDev"
                                />
                            </div>
                            <div>
                                <label className="mb-[4px] block font-['Epilogue'] text-[16px] font-bold text-neutral-900">
                                    Housing Assistance
                                </label>
                                <CheckboxList
                                    options={HOUSING}
                                    selectedValues={selected.housing}
                                    onChange={(val) => setValue('housing', val)}
                                    name="housing"
                                />
                            </div>
                            <div>
                                <label className="mb-[4px] block font-['Epilogue'] text-[16px] font-bold text-neutral-900">
                                    Redirection Program
                                </label>
                                <CheckboxList
                                    options={REDIRECTION}
                                    selectedValues={selected.redirection}
                                    onChange={(val) =>
                                        setValue('redirection', val)
                                    }
                                    name="redirection"
                                />
                            </div>
                            <div>
                                <label className="mb-[4px] block font-['Epilogue'] text-[16px] font-bold text-neutral-900">
                                    Education & Training Support
                                </label>
                                <CheckboxList
                                    options={EDUTRAIN}
                                    selectedValues={selected.education}
                                    onChange={(val) =>
                                        setValue('education', val)
                                    }
                                    name="education"
                                />
                            </div>
                            <div>
                                <label className="mb-[4px] block font-['Epilogue'] text-[16px] font-bold text-neutral-900">
                                    Health & Wellness Support
                                </label>
                                <CheckboxList
                                    options={HEALTH_WELLNESS}
                                    selectedValues={selected.healthWellness}
                                    onChange={(val) =>
                                        setValue('healthWellness', val)
                                    }
                                    name="healthWellness"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-[4px] block font-['Epilogue'] text-[16px] font-bold text-neutral-900">
                                Referrals/Linkages Services
                            </label>
                            <CheckboxList
                                options={REFERRALSERVICE}
                                selectedValues={selected.referral}
                                onChange={(val) => setValue('referral', val)}
                                name="referral"
                            />
                        </div>
                    </div>

                    <div className="space-y-[24px]">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-[8px]">
                                <label className={titleStyle}>
                                    Profile Picture
                                </label>
                                <span className="group relative flex">
                                    <span className="flex cursor-help items-center justify-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="20px"
                                            viewBox="0 -960 960 960"
                                            width="20px"
                                        >
                                            <path d="M480-96v-96q-140.33 0-238.16-97.77-97.84-97.77-97.84-238Q144-668 241.89-766t238.29-98q70.2 0 131.01 26.5Q672-811 717.5-765.5t72 106.37Q816-598.27 816-528q0 69-29.5 134t-77 121Q662-217 602-171.5T480-96Zm72-128q80-60 136-139.5T744-528q0-109-77.5-186.5T480-792q-109 0-186.5 77.5T216-528q0 109 77.5 186.5T480-264h72v40Zm-43.5-123.5Q520-359 520-376t-11.5-28.5Q497-416 480-416t-28.5 11.5Q440-393 440-376t11.5 28.5Q463-336 480-336t28.5-11.5ZM451-458h58q0-26 4-39.5t23-32.5q18-17 36-36t18-54q0-48-32-74t-78-26q-41.88 0-70.44 24Q381-672 370-640l52.33 22q4.67-17 18.16-32T480-665q27 0 39.5 15t12.5 32q0 21-14.5 35.5T486-552q-26 24-30.5 41.5T451-458Zm29-50Z" />
                                        </svg>
                                    </span>
                                    <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-3 py-2 text-sm text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-hover:delay-100">
                                        Camera is not available on desktop
                                    </span>
                                </span>
                            </div>
                            <ResetButton
                                data={formType}
                                field="clientPic"
                                resetFiles={resetFiles}
                            />
                        </div>
                        <FileUpload
                            data={formType}
                            handleFileChange={handleImageChange}
                            handleAddFile={handleAddFile}
                            onRemoveFile={removeFile}
                            field="clientPic"
                            isUploading={uploadingField === 'clientPic'}
                            isProfilePic
                        />
                    </div>

                    {/* Documents */}
                    <div className="space-y-[24px]">
                        <div className="flex items-center space-x-[8px]">
                            <label className={titleStyle}>Documents</label>
                            <span className="group relative flex">
                                <span className="flex cursor-help items-center justify-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="20px"
                                        viewBox="0 -960 960 960"
                                        width="20px"
                                    >
                                        <path d="M480-96v-96q-140.33 0-238.16-97.77-97.84-97.77-97.84-238Q144-668 241.89-766t238.29-98q70.2 0 131.01 26.5Q672-811 717.5-765.5t72 106.37Q816-598.27 816-528q0 69-29.5 134t-77 121Q662-217 602-171.5T480-96Zm72-128q80-60 136-139.5T744-528q0-109-77.5-186.5T480-792q-109 0-186.5 77.5T216-528q0 109 77.5 186.5T480-264h72v40Zm-43.5-123.5Q520-359 520-376t-11.5-28.5Q497-416 480-416t-28.5 11.5Q440-393 440-376t11.5 28.5Q463-336 480-336t28.5-11.5ZM451-458h58q0-26 4-39.5t23-32.5q18-17 36-36t18-54q0-48-32-74t-78-26q-41.88 0-70.44 24Q381-672 370-640l52.33 22q4.67-17 18.16-32T480-665q27 0 39.5 15t12.5 32q0 21-14.5 35.5T486-552q-26 24-30.5 41.5T451-458Zm29-50Z" />
                                    </svg>
                                </span>
                                <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-3 py-2 text-sm text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-hover:delay-100">
                                    Camera is not available on desktop
                                </span>
                            </span>
                        </div>
                        {[
                            ['clientIDocs', 'ID'],
                            ['clientPassport', 'Passport'],
                            ['clientMediCal', 'MediCal'],
                            ['clientSSN', 'SSN'],
                            ['clientBC', 'Birth Certificate'],
                            ['otherFiles', 'Other Documents'],
                        ].map(([field, label]) => (
                            <div className="space-y-[8px]" key={field}>
                                <div className="flex items-center justify-between">
                                    <label
                                        className={
                                            fileUploadLabelStyle ?? titleStyle
                                        }
                                    >
                                        {label}
                                    </label>
                                    <ResetButton
                                        data={formType}
                                        field={field}
                                        resetFiles={resetFiles}
                                    />
                                </div>
                                <FileUpload
                                    data={formType}
                                    handleFileChange={handleImageChange}
                                    handleAddFile={handleAddFile}
                                    onRemoveFile={removeFile}
                                    field={field}
                                    isUploading={uploadingField === field}
                                    isProfilePic={false}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="space-y-[8px]">
                        <label className={titleStyle}>Additional Notes</label>
                        <textarea
                            {...register('additionalNotes')}
                            placeholder="Text"
                            className="min-h-[100px] w-full resize-y overflow-auto rounded border p-2"
                            rows={4}
                        />
                    </div>

                    {submitType === 'new' && (
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
                    )}
                    {submitType == 'save' && (
                        <div className="flex justify-start space-x-[24px]">
                            <button
                                type="submit"
                                className="rounded-[5px] bg-[#4EA0C9] px-[20px] py-[16px] text-white hover:bg-[#246F95]"
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
                                    Save
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={onCancel}
                                className="rounded-[5px] bg-[#1A1D20] px-[20px] py-[16px] text-white"
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
                </div>
            </div>
        </form>
    )
}

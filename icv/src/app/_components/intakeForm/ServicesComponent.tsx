'use client'

import { storage } from '@/data/firebase'
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
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { TypeOf } from 'zod'
import FileUpload, { ResetButton } from '../../_components/FileUpload'
import { CheckboxList } from '../../_components/MakeOptions'

interface Props {
    formType: Partial<NewClient>
    updateForm: (form: Partial<NewClient>) => void
    onSubmitNew?: (data: NewClient) => void
    onSubmitEdit?: (data: NewClient) => void
    onCancel?: () => void
    submitType: 'save' | 'new'
    titleStyle: string
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

    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
        field: string,
    ) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files)

            const uploadPromises = files.map(async (file) => {
                const storageRef = ref(storage, file.name)
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
                updateForm({ [field]: downloadURLs })
            }
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
                        <div className="grid grid-cols-2 gap-[12px]">
                            <div>
                                <label className="font-['Epilogue'] text-[16px] text-neutral-900">
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
                                <label className="font-['Epilogue'] text-[16px] text-neutral-900">
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
                                <label className="font-['Epilogue'] text-[16px] text-neutral-900">
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
                                <label className="font-['Epilogue'] text-[16px] text-neutral-900">
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
                                <label className="font-['Epilogue'] text-[16px] text-neutral-900">
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
                                <label className="font-['Epilogue'] text-[16px] text-neutral-900">
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
                            <label className="font-['Epilogue'] text-[16px] text-neutral-900">
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

                    {/* File Upload Sections */}
                    {[
                        ['clientPic', 'Profile Picture'],
                        ['clientIDocs', 'ID'],
                        ['clientPassport', 'Passport'],
                        ['clientMediCal', 'MediCal'],
                        ['clientSSN', 'SSN'],
                        ['clientBC', 'Birth Certificate'],
                        ['otherFiles', 'Other Documents'],
                    ].map(([field, label]) => (
                        <div className="space-y-[8px]" key={field}>
                            <div className="flex items-center justify-between">
                                <label className={titleStyle}>{label}</label>
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
                                field={field}
                                buttonText={`Add ${label.toLowerCase()}`}
                            />
                        </div>
                    ))}

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
                                className="rounded-[5px] bg-[#1A1D20] px-[20px] py-[16px] text-white hover:bg-[#6D757F]"
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

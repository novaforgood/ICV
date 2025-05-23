'use client'

import {
    CITIZEN,
    CONTACTSOURCE,
    ETHNICITY,
    GENDER,
    HOMELESS,
    ProfileSchema,
    YESNO,
} from '@/types/client-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { TypeOf } from 'zod'
import {
    CheckboxListWithOther,
    RadioChoice,
    RadioWithOther,
} from '../../_components/MakeOptions'
import { useIntakeFormStore } from '../../_lib/useIntakeFormStore'

interface Props {}

const Page = (props: Props) => {
    const searchParams = useSearchParams()
    const spouseID = searchParams?.get('spouseID') || undefined

    const { form: loadedForm, updateForm } = useIntakeFormStore()
    type ProfileType = TypeOf<typeof ProfileSchema>

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<ProfileType>({
        mode: 'onChange',
        resolver: zodResolver(ProfileSchema),
        defaultValues: loadedForm,
    })

    const router = useRouter()

    useEffect(() => {
        reset(loadedForm)
    }, [loadedForm, reset])

    useEffect(() => {
        {
            spouseID && setValue('associatedSpouseID', spouseID)
        }
        console.log(spouseID)
    }, [spouseID])

    useEffect(() => {
        const unsubscribe = watch((data) => {
            updateForm({
                ...data,
                ethnicity: data.ethnicity?.filter(
                    (eth) => eth !== undefined,
                ) as string[],
            })
        }).unsubscribe
        console.log(loadedForm)
        console.log(errors)

        return unsubscribe
    }, [watch, loadedForm])

    const calculateAgeAndRange = (
        dobString: string,
    ): { age: number | undefined; ageRange: string | undefined } => {
        if (!dobString) return { age: undefined, ageRange: undefined }

        const dob = new Date(dobString)
        const now = new Date()

        let age = now.getFullYear() - dob.getFullYear()
        const monthDiff = now.getMonth() - dob.getMonth()
        if (
            monthDiff < 0 ||
            (monthDiff === 0 && now.getDate() < dob.getDate())
        ) {
            age--
        }

        const ageRange =
            age >= 16 && age <= 30
                ? 'Age: 16-30'
                : age >= 31 && age <= 40
                  ? 'Age: 31-40'
                  : age >= 41 && age <= 70
                    ? 'Age: 41-70'
                    : undefined

        return { age, ageRange }
    }

    // updates age and age range when date of birth is changed
    useEffect(() => {
        const dobValue = loadedForm.dateOfBirth

        if (dobValue) {
            const { age, ageRange } = calculateAgeAndRange(dobValue)

            if (age !== undefined) {
                setValue('age', age) // Only set 'age' if it's calculated
            }
            if (ageRange) {
                setValue('ageRange', ageRange) // Only set 'ageRange' if it's calculated
            }
        }
    }, [loadedForm.dateOfBirth, setValue])

    useEffect(() => {
        const calculatedCode = `${loadedForm.firstName?.[0]?.toUpperCase() ?? 'N'}${loadedForm.gender?.[0]?.toUpperCase() ?? 'X'}${loadedForm.lastName?.[0]?.toUpperCase() ?? 'N'}${new Date().getFullYear()}`
        updateForm({ clientCode: calculatedCode })
    }, [loadedForm.firstName, loadedForm.lastName, loadedForm.gender])

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0] // Format: YYYY-MM-DD
        setValue('intakeDate', today)
    }, [setValue])

    const onSubmit = (data: ProfileType) => {
        console.log('in submit...', data)
        updateForm(data)
        router.push('/intake/background')
    }

    const selectedGender = watch('gender') ?? ''
    const selectedRef = watch('contactSource') ?? ''
    const selectedCitizen = watch('citizenship') ?? ''
    const selectedHomeless = watch('homeless') ?? ''
    const selectedEthnicities = Array.isArray(watch('ethnicity'))
        ? (watch('ethnicity') ?? [])
        : []
    const selectedSheltered = watch('sheltered') ?? ''

    return (
        <form
            className="space-y-[24px]"
            style={{ padding: '24px' }}
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="flex min-h-screen items-center justify-center">
                <div className="min-w-[800px] space-y-[60px]">
                    <div>
                        <label className="block text-center font-['Epilogue'] text-[40px] font-bold leading-[56px] text-neutral-900">
                            Client Profile
                        </label>
                    </div>

                    {/* Basic Information */}
                    <div className="space-y-[24px]">
                        <div className="grid grid-cols-2 gap-[12px]">
                            <div className="flex flex-col space-y-[4px]">
                                <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                    First Name
                                </label>
                                <input
                                    {...register('firstName')}
                                    type="text"
                                    placeholder="Text"
                                    className="w-full rounded border p-2"
                                />
                            </div>
                            <div className="flex flex-col space-y-[4px]">
                                <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                    Last Name
                                </label>
                                <input
                                    {...register('lastName')}
                                    type="text"
                                    placeholder="Text"
                                    className="w-full rounded border p-2"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-[12px]">
                            <div className="flex flex-col space-y-[4px]">
                                <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                    Date of Birth
                                </label>
                                <input
                                    {...register('dateOfBirth')}
                                    type="date"
                                    placeholder="MM/DD/YYYY"
                                    className="rounded border p-2"
                                />
                            </div>
                            <div className="flex flex-col space-y-[4px]">
                                <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                    Intake Date
                                </label>
                                <input
                                    {...register('intakeDate')}
                                    type="date"
                                    className="rounded border p-2"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col space-y-[4px]">
                            <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                Gender
                            </label>
                            <div className="flex flex-col space-y-[8px]">
                                <RadioWithOther
                                    options={GENDER}
                                    selectedValue={selectedGender}
                                    onChange={(updatedGender) =>
                                        setValue('gender', updatedGender)
                                    }
                                    name="gender"
                                    otherLabel="Other"
                                    otherPlaceholder="Other"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col space-y-[4px]">
                            <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                Client Code
                            </label>
                            <input
                                {...register('clientCode')}
                                type="text"
                                placeholder="Text"
                                className="w-[50%] rounded border p-2"
                            />
                        </div>
                        <div className="flex flex-col space-y-[4px]">
                            <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                Referral Source
                            </label>
                            <div className="flex flex-col space-y-[8px]">
                                <RadioWithOther
                                    options={CONTACTSOURCE}
                                    selectedValue={selectedRef}
                                    onChange={(updatedRef) =>
                                        setValue('contactSource', updatedRef)
                                    }
                                    name="contactSource"
                                    otherLabel="Other"
                                    otherPlaceholder="Other"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-[24px]">
                        <label className="font-['Epilogue'] text-[28px] font-semibold leading-[40px] text-neutral-900">
                            Contact Information
                        </label>
                        <div className="grid grid-cols-2 gap-[12px]">
                            <div>
                                <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                    Email Address
                                </label>
                                <input
                                    {...register('email')}
                                    type="text"
                                    placeholder="Text"
                                    className="w-full rounded border p-2"
                                />
                            </div>
                            <div className="flex flex-col space-y-[4px]">
                                <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                    Phone Number
                                </label>
                                <input
                                    {...register('phoneNumber')}
                                    type="text"
                                    placeholder="Text"
                                    className="w-full rounded border p-2"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Citizenship Information */}
                    <div className="space-y-[24px]">
                        <label className="font-['Epilogue'] text-[28px] font-semibold leading-[40px] text-neutral-900">
                            Citizenship
                        </label>
                        <div className="space-y-[24px]">
                            <div>
                                <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                    Place of Origin
                                </label>
                                <input
                                    {...register('placeOrigin')}
                                    type="text"
                                    placeholder="Text"
                                    className="w-full rounded border p-2"
                                />
                            </div>
                            <div className="flex flex-col space-y-[4px]">
                                <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                    Citizenship Status
                                </label>
                                <div className="flex flex-col space-y-[8px]">
                                    <RadioWithOther
                                        options={CITIZEN}
                                        selectedValue={selectedCitizen}
                                        onChange={(updatedCit) =>
                                            setValue('citizenship', updatedCit)
                                        }
                                        name="citizenship"
                                        otherLabel="Other"
                                        otherPlaceholder="Other"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ethnicity Information */}
                    <div className="space-y-[24px]">
                        <label className="font-['Epilogue'] text-[28px] font-semibold leading-[40px] text-neutral-900">
                            Ethnicity
                        </label>
                        <div className="space-y-[24px]">
                            <div className="flex flex-col space-y-[8px]">
                                <CheckboxListWithOther
                                    options={ETHNICITY}
                                    selectedValues={selectedEthnicities}
                                    onChange={(updatedEthnicities) =>
                                        setValue(
                                            'ethnicity',
                                            updatedEthnicities,
                                        )
                                    }
                                    name="ethnicity"
                                    otherLabel="Other"
                                    otherPlaceholder="Specify other ethnicity"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Housing Information */}
                    <div className="space-y-[24px]">
                        <label className="font-['Epilogue'] text-[28px] font-semibold leading-[40px] text-neutral-900">
                            Housing
                        </label>

                        <div className="flex flex-col space-y-[4px]">
                            <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                Homeless
                            </label>
                            <div className="flex flex-col space-y-[8px]">
                                <RadioChoice
                                    options={HOMELESS}
                                    selectedValue={selectedHomeless}
                                    onChange={(updatedHM) =>
                                        setValue('homeless', updatedHM)
                                    }
                                    name="homeless?"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col space-y-[4px]">
                            <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                Sheltered
                            </label>
                            <RadioChoice
                                options={YESNO}
                                selectedValue={selectedSheltered}
                                onChange={(updatedSheltered) =>
                                    setValue('sheltered', updatedSheltered)
                                }
                                name="cps"
                            />
                        </div>

                        {/* Street Address & Apt No. (Same Row) */}
                        <div className="grid grid-cols-[3fr_1fr] gap-[12px]">
                            <div className="flex flex-col space-y-[4px]">
                                <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                    Street Address/Location of Contact
                                </label>
                                <input
                                    {...register('streetAddress')}
                                    type="text"
                                    placeholder="Text"
                                    className="w-full rounded border p-2"
                                />
                            </div>
                            <div className="flex flex-col space-y-[4px]">
                                <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                    Apt No.
                                </label>
                                <input
                                    {...register('aptNumber')}
                                    type="text"
                                    placeholder="Text"
                                    className="w-full rounded border p-2"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-[12px]">
                            <div className="flex flex-col space-y-[4px]">
                                <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                    City
                                </label>
                                <input
                                    {...register('city')}
                                    type="text"
                                    placeholder="Text"
                                    className="w-full rounded border p-2"
                                />
                            </div>
                            <div className="flex flex-col space-y-[4px]">
                                <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                    Postal/Zip Code
                                </label>
                                <input
                                    {...register('zipCode')}
                                    type="text"
                                    placeholder="Zip Code"
                                    className="w-full rounded border p-2"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col space-y-[4px]">
                            <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                Housing Notes
                            </label>
                            <textarea
                                {...register('housingNotes')}
                                placeholder="Text"
                                className="min-h-[100px] w-full resize-y overflow-auto rounded border p-2"
                                rows={4}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="rounded-[5px] bg-neutral-900 px-4 py-2 text-white"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default Page

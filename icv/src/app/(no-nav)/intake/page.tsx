'use client'

import { ProfileSchema } from '@/types/client-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { TypeOf } from 'zod'
import { useIntakeFormStore } from '../../_lib/useIntakeFormStore'
import {
    CheckboxListWithOther,
    RadioChoice,
    RadioWithOther,
} from './components/MakeOptions'

interface Props {}

const GENDER = ['Male', 'Female', 'Nonbinary']
const REFERRAL = [
    'Police Department',
    'School liaison',
    'City of Huntington Park',
]
const CITIZEN = ['Citizen', 'Resident', 'Undocumented']
const HOMELESS = ['Yes', 'No', 'At risk']
const ETHNICITY = [
    'White',
    'Black or African American',
    'Hispanic, Latino, or Spanish Origin',
    'Asian',
    'Native American',
    'Middle Eastern',
    'Hawaiian or Pacific Islander',
]
const EMPLOYED = ['Yes', 'No']

const Page = (props: Props) => {
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

    const onSubmit = (data: ProfileType) => {
        console.log('in submit...', data)
        updateForm(data)
        router.push('/intake/family')
    }

    const selectedGender = watch('gender') ?? ''
    const selectedRef = watch('referralSource') ?? ''
    const selectedCitizen = watch('citizenship') ?? ''
    const selectedHomeless = watch('homeless') ?? ''
    const selectedEthnicities = Array.isArray(watch('ethnicity'))
        ? (watch('ethnicity') ?? [])
        : []
    const selectedEmp = watch('employed') ?? ''

    return (
        <form
            className="space-y-[24px]"
            style={{ padding: '24px' }}
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="flex min-h-screen items-center justify-center">
                <div className="min-w-[800px] space-y-[60px]">
                    <div>
                        <label className="font-['Epilogue'] text-[40px] font-bold leading-[56px] text-neutral-900">
                            Client Profile
                        </label>
                    </div>
                    <div className="space-y-[24px]">
                        <div className="space-y-[24px]">
                            <div className="grid grid-cols-2 gap-[12px]">
                                {/* Left Column */}
                                <div className="space-y-[24px]">
                                    <div className="flex flex-col space-y-[4px]">
                                        <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                            First Name
                                        </label>
                                        <input
                                            {...register('firstName')}
                                            type="text"
                                            placeholder="First Name"
                                            className="w-full rounded border p-2"
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-[4px]">
                                        <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                            Date of Birth
                                        </label>
                                        <input
                                            {...register('dateOfBirth')}
                                            type="date"
                                            placeholder="MM/DD/YYYY"
                                            className="w-full rounded border p-2"
                                        />
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
                                                    setValue(
                                                        'gender',
                                                        updatedGender,
                                                    )
                                                }
                                                name="gender"
                                                otherLabel="Other"
                                                otherPlaceholder="Other"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col space-y-[4px]">
                                        <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                            Referral Source
                                        </label>
                                        <div className="flex flex-col space-y-[8px]">
                                            <RadioWithOther
                                                options={REFERRAL}
                                                selectedValue={selectedRef}
                                                onChange={(updatedRef) =>
                                                    setValue(
                                                        'referralSource',
                                                        updatedRef,
                                                    )
                                                }
                                                name="referralSource"
                                                otherLabel="Other"
                                                otherPlaceholder="Other"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-[24px]">
                                    <div className="flex flex-col space-y-[4px]">
                                        <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                            Last Name
                                        </label>
                                        <input
                                            {...register('lastName')}
                                            type="text"
                                            placeholder="Last Name"
                                            className="w-full rounded border p-2"
                                        />
                                    </div>
                                </div>
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
                                    Citizenship
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

                    {/* Housing Information */}
                    <div className="space-y-[24px]">
                        <label className="font-['Epilogue'] text-[28px] font-semibold leading-[40px] text-neutral-900">
                            Housing
                        </label>

                        <div className="flex flex-col space-y-[4px]">
                            <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                Homeless?
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
                                Duration of homelessness
                            </label>
                            <input
                                {...register('durationHomeless')}
                                type="text"
                                placeholder="Text"
                                className="w-full rounded border p-2"
                            />
                        </div>

                        <div className="flex flex-col space-y-[4px]">
                            <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                Housing situation
                            </label>
                            <input
                                {...register('housingSituation')}
                                type="text"
                                placeholder="Text"
                                className="w-full rounded border p-2"
                            />
                        </div>

                        {/* Street Address & Apt No. (Same Row) */}
                        <div className="grid grid-cols-2 gap-[12px]">
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
                                    className="w-[30%] rounded border p-2"
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
                                    className="w-[60%] rounded border p-2"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Demographics Information */}
                    <div className="space-y-[24px]">
                        <label className="font-['Epilogue'] text-[28px] font-semibold leading-[40px] text-neutral-900">
                            Demographics
                        </label>
                        <div className="space-y-[24px]">
                            <div>
                                <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                    Ethnicity?
                                </label>
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
                            <div className="flex flex-col space-y-[4px]">
                                <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                    Employed
                                </label>
                                <RadioChoice
                                    options={EMPLOYED}
                                    selectedValue={selectedEmp}
                                    onChange={(updatedEmp) =>
                                        setValue('employed', updatedEmp)
                                    }
                                    name="employed"
                                />
                            </div>
                            <div className="space-y-[4px]">
                                <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                    Income
                                </label>
                                <div className="flex items-center space-x-[2px]">
                                    <p className="text-lg">$</p>
                                    <input
                                        {...register('income')}
                                        type="text"
                                        placeholder="Text"
                                        className="w-[30%] rounded border p-2"
                                    />
                                </div>
                            </div>
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

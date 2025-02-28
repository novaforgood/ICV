'use client'

import { ProfileSchema } from '@/types/client-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { TypeOf } from 'zod'
import { useIntakeFormStore } from '../_lib/useIntakeFormStore'

interface Props {}

const Page = (props: Props) => {
    const {
        form: loadedForm,
        progress: loadedProgress,
        updateForm,
        updateProgress,
    } = useIntakeFormStore()
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
            updateForm(data)

            const isAnyFieldFilled = Object.values(data).some((field) => {
                if (Array.isArray(field)) {
                    return field.length > 0
                }
                if (typeof field === 'boolean') {
                    return true
                }
                return field?.length > 0 || field !== undefined
            })

            updateProgress({
                clientProfile: isAnyFieldFilled ? 'in-progress' : 'not-started',
            })
        }).unsubscribe
        console.log(loadedForm)
        console.log(loadedProgress)
        console.log(errors)

        return unsubscribe
    }, [watch, loadedForm])

    const onSubmit = (data: ProfileType) => {
        console.log('in submit...', data)
        updateForm(data)
        router.push('/intake/family')
    }

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
                    <div className="grid grid-cols-2 gap-[12px]">
                        <div>
                            <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                Program
                            </label>
                            <select
                                {...register('program')}
                                defaultValue="Select Program"
                                className="w-full rounded border p-2"
                            >
                                <option value="Homeless Department">
                                    Homeless Department
                                </option>
                                <option value="School Outreach">
                                    School Outreach
                                </option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            {/* get all registered staff members in program */}
                            <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                Assessing Staff
                            </label>
                            <select
                                {...register('assessingStaff')}
                                defaultValue="Select Staff"
                                className="w-full rounded border p-2"
                            >
                                <option value="Staff 1">Staff 1</option>
                                <option value="Staff 2">Staff 2</option>
                                <option value="Staff 3">Staff 3</option>
                            </select>
                        </div>
                    </div>
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
                                        <select
                                            {...register('gender')}
                                            defaultValue="Select Gender"
                                            className="w-full rounded border p-2"
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">
                                                Female
                                            </option>
                                            <option value="Non-Binary">
                                                Non-Binary
                                            </option>
                                            <option value="Other">Other</option>
                                        </select>
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
                                    <div className="flex flex-col space-y-[4px]">
                                        <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                            Client Number
                                        </label>
                                        <input
                                            {...register('clientNumber')}
                                            type="text"
                                            placeholder="Text"
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

                    {/* Housing Information */}
                    <div className="space-y-[24px]">
                        <label className="font-['Epilogue'] text-[28px] font-semibold leading-[40px] text-neutral-900">
                            Housing
                        </label>

                        <div className="flex flex-col space-y-[4px]">
                            <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                Housing Type
                            </label>
                            <select
                                {...register('housingType')}
                                defaultValue="Select"
                                className="w-[40%] rounded border p-2"
                            >
                                <option value="Not Sure">Not Sure</option>
                                <option value="What Design">What Design</option>
                                <option value="Wants Here">Wants Here</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="flex flex-col space-y-[4px]">
                            <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                At Risk
                            </label>
                            <div className="mt-2 flex flex-col gap-[4px]">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        {...register('atRisk')}
                                    />
                                    Yes
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={!watch('atRisk')}
                                        onChange={() =>
                                            setValue('atRisk', false)
                                        }
                                    />
                                    No
                                </label>
                            </div>
                        </div>

                        {/* Street Address & Apt No. (Same Row) */}
                        <div className="grid grid-cols-2 gap-[12px]">
                            <div className="flex flex-col space-y-[4px]">
                                <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                    Street Address
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

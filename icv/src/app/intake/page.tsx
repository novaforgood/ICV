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
            className="space-y-4"
            style={{ padding: '50px' }}
            onSubmit={handleSubmit(onSubmit)}
        >
            <div>
                <label className="bold text-3xl">Intake Form</label>
            </div>
            <div className="space-y-8">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label>Program</label>
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
                    <div className="flex flex-col">
                        {/* get all registered staff members in program */}
                        <label>Assessing Staff</label>
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
                <div className="space-y-4">
                    <label className="bold text-2xl">Client Profile</label>
                    <div className="grid grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-4">
                            <div className="flex flex-col">
                                <label>First Name</label>
                                <input
                                    {...register('firstName')}
                                    type="text"
                                    placeholder="First Name"
                                    className="w-full rounded border p-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>Date of Birth</label>
                                <input
                                    {...register('dateOfBirth')}
                                    type="date"
                                    placeholder="MM/DD/YYYY"
                                    className="w-full rounded border p-2"
                                />
                            </div>
                            {/* <div className="flex flex-col">
                            <label>Age</label>
                            <input
                                {...register('age')}
                                type="text"
                                placeholder="Text"
                                className="w-full rounded border p-2"
                            />
                        </div> */}
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            <div className="flex flex-col">
                                <label>Last Name</label>
                                <input
                                    {...register('lastName')}
                                    type="text"
                                    placeholder="Last Name"
                                    className="w-full rounded border p-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>Client Number</label>
                                <input
                                    {...register('clientNumber')}
                                    type="text"
                                    placeholder="Text"
                                    className="w-full rounded border p-2"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <label>Gender</label>
                            <select
                                {...register('gender')}
                                defaultValue="Select Gender"
                                className="w-full rounded border p-2"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Non-Binary">Non-Binary</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                    <label className="bold text-2xl">Contact Information</label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label>Email Address</label>
                            <input
                                {...register('email')}
                                type="text"
                                placeholder="Text"
                                className="w-full rounded border p-2"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label>Phone Number</label>
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
                <div className="space-y-4">
                    <label className="bold text-2xl">Housing</label>

                    <div className="flex flex-col">
                        <label>Housing Type</label>
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

                    <div className="flex flex-col">
                        <label>At Risk</label>
                        <div className="mt-2 flex flex-col gap-2">
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
                                    onChange={() => setValue('atRisk', false)}
                                />
                                No
                            </label>
                        </div>
                    </div>

                    {/* Street Address & Apt No. (Same Row) */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label>Street Address</label>
                            <input
                                {...register('streetAddress')}
                                type="text"
                                placeholder="Text"
                                className="w-full rounded border p-2"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label>Apt No.</label>
                            <input
                                {...register('aptNumber')}
                                type="text"
                                placeholder="Text"
                                className="w-[30%] rounded border p-2"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label>City</label>
                            <input
                                {...register('city')}
                                type="text"
                                placeholder="Text"
                                className="w-full rounded border p-2"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label>Postal/Zip Code</label>
                            <input
                                {...register('zipCode')}
                                type="text"
                                placeholder="Zip Code"
                                className="w-[60%] rounded border p-2"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between">
                <button
                    type="submit"
                    className="ml-auto mt-4 rounded bg-blue-500 p-2 text-white"
                >
                    Continue
                </button>
            </div>
        </form>
    )
}

export default Page
